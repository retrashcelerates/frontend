// src/pages/Admin/datauser.jsx
import React, { useEffect, useState } from "react";
import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";
import AddUserModal from "../../components/TambahUser";
import EditUserModal from "../../components/EditUser";
import { FiEdit2 } from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function DataUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // state tambah user
  const [openAdd, setOpenAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // state edit user
  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // total sampah per user (kg)
  const [userTotals, setUserTotals] = useState({});

  // >>> NEW: data admin yang sedang login (untuk header kanan atas)
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ========== FETCH PROFIL USER LOGIN (ADMIN) UNTUK HEADER ==========
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal mengambil profil admin:", json);
        setLoadingProfile(false);
        return;
      }

      setCurrentUser(json.data || null);
    } catch (err) {
      console.error("Error fetch profile admin:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // >>> hitung total sampah (kg) per user
  const fetchUserTotals = async (userList) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const results = await Promise.all(
        userList.map(async (u) => {
          try {
            const res = await fetch(`${API_BASE_URL}/setor/user/${u.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const json = await res.json();
            if (!res.ok || !Array.isArray(json.data)) {
              return { id: u.id, totalKg: 0 };
            }

            const totalKg = json.data.reduce(
              (sum, item) => sum + Number(item.kuantitas || 0),
              0
            );

            return { id: u.id, totalKg };
          } catch (err) {
            console.error("Gagal fetch setor user", u.id, err);
            return { id: u.id, totalKg: 0 };
          }
        })
      );

      const mapTotals = {};
      results.forEach((r) => {
        mapTotals[r.id] = r.totalKg;
      });

      setUserTotals(mapTotals);
    } catch (err) {
      console.error("Gagal menghitung total sampah per user:", err);
    }
  };

  // === AMBIL DATA USER (bisa dipanggil ulang setelah tambah/edit) ===
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json?.message || "Gagal memuat daftar user dari server.");
        setLoading(false);
        return;
      }

      const list = Array.isArray(json.data) ? json.data : [];
      setUsers(list);

      // hitung total sampah per user
      await fetchUserTotals(list);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Terjadi kesalahan jaringan/server saat memuat daftar user."
      );
    } finally {
      setLoading(false);
    }
  };

  // panggil saat pertama kali masuk halaman
  useEffect(() => {
    fetchUsers();
    fetchProfile(); // <<< ambil data admin login untuk header
  }, []);

  // === SIMPAN USER BARU dari MODAL TAMBAH ===
  const handleSaveNewUser = async (formData) => {
    try {
      setSaving(true);
      setErrorMsg("");

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          role: formData.role || "user",
          address: null,
          avatar_url: null,
        }),
      });

        if (!res.ok) {
          setErrorMsg(json?.message || "Gagal memuat daftar user dari server.");
          setLoading(false);
          return;
      const json = await res.json();

      if (!res.ok) {
        const msgs = [];
        if (Array.isArray(json?.errors)) {
          msgs.push(...json.errors);
        }
        if (json?.message && !msgs.includes(json.message)) {
          msgs.push(json.message);
        }
        setErrorMsg(
          msgs.length
            ? msgs.join(" | ")
            : "Gagal menambah user. Periksa kembali data yang diisi."
        );
        return;
      }

      setOpenAdd(false);
      await fetchUsers();
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan saat menambah user baru.");
    } finally {
      setSaving(false);
    }
  };

  // === UPDATE USER (EDIT ROLE) ===
  const handleUpdateUser = async ({ id, role }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal update user:", json);
        setErrorMsg(
          json?.message || "Gagal mengedit user. Silakan coba lagi."
        );
        return;
      }

      await fetchUsers();
      setOpenEdit(false);
      setEditUser(null);
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan jaringan/server saat mengedit user.");
    }
  };

  // helper: label role untuk header
  const getRoleLabel = (role) => {
    if (!role) return "-";
    if (role === "admin") return "Admin";
    return "Nasabah";
  };

  // helper: avatar dari BE / inisial
  const renderAvatarUrl = () => {
    if (currentUser?.avatar_url) return currentUser.avatar_url;
    if (currentUser?.username) {
      const initials = encodeURIComponent(currentUser.username);
      // bisa pakai layanan avatar sederhana
      return `https://ui-avatars.com/api/?name=${initials}&background=16a34a&color=ffffff`;
    }
    return "https://ui-avatars.com/api/?name=User&background=16a34a&color=ffffff";
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex flex-col">
      {/* WRAPPER UTAMA */}
      <div className="flex flex-1 pb-20">
        <Navbaradmin />

        {/* CONTENT */}
        <div className="flex-1 lg:ml-64 px-6 pt-[84px] pb-10">
          {/* HEADER FIXED */}
          <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#F7F7F7] border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.18)]">
            <div className="h-16 flex items-center justify-between px-6">
              <div>
                <h1 className="font-semibold text-[23px]">Daftar User</h1>
                <p className="text-gray-600 text-[15px]">
                  Kelola data pelanggan bank sampah.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Avatar + nama admin dari database */}
                <img
                  src={renderAvatarUrl()}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  alt="profile"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm">
                    {loadingProfile
                      ? "Memuat..."
                      : currentUser?.username || "-"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {getRoleLabel(currentUser?.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ALERT ERROR */}
          {errorMsg && (
            <div className="mt-4 mb-4 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* TOMBOL TAMBAH */}
          <div className="flex justify-end mb-4 mt-2">
            <button
              onClick={() => setOpenAdd(true)}
              disabled={saving}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-md px-4 py-2 shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              + Tambah User
            </button>
          </div>

          {/* TABEL */}
          <div className="w-full max-w-5xl mx-auto mt-4">
            <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
              <div className="max-h-[1000px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-semibold text-[14px]">
                    <tr>
                      <th className="py-3 px-4 border-r border-gray-300">
                        Nama User
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300">
                        Email
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300">
                        No. Telp
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300 text-center">
                        Total Sampah
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300 text-center">
                        Tanggal Daftar
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300 text-center">
                        Role
                      </th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-4 px-4 text-center text-gray-500 text-sm"
                        >
                          Memuat data user...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-4 px-4 text-center text-gray-500 text-sm"
                        >
                          Belum ada data user.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition border-t border-gray-200"
                        >
                          <td className="py-3 px-4 border-r border-gray-100">
                            {user.username}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            {user.email}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            {user.phone || "-"}
                          </td>

                          {/* total sampah */}
                          <td className="py-3 px-4 border-r border-gray-100 text-center">
                            {userTotals[user.id] !== undefined
                              ? `${userTotals[user.id]} kg`
                              : "-"}
                          </td>

                          <td className="py-3 px-4 border-r border-gray-100 text-center">
                            {formatTanggal(user.created_at)}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-center">
                            {user.role === "admin" ? "Admin" : "Nasabah"}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              className="p-2 rounded hover:bg-gray-100 text-gray-700"
                              onClick={() => {
                                setEditUser(user);
                                setOpenEdit(true);
                              }}
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8" />
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <Footeradmin />
      </div>

      {/* MODAL TAMBAH USER */}
      <AddUserModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleSaveNewUser}
      />

      {/* POPUP SUKSES TAMBAH USER */}
      {showSuccess && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500 mx-auto flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold mb-1">Sukses</h3>
            <p className="text-sm text-gray-600 mb-6">
              Berhasil menambahkan user.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-8 py-2 rounded-full"
            >
              Oke
            </button>
          </div>
        </div>
      )}

      {/* MODAL EDIT USER */}
      <EditUserModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditUser(null);
        }}
        user={editUser}
        onSave={handleUpdateUser}
      />
    </div>
  );
}
