// src/pages/Admin/datauser.jsx
import React, { useEffect, useState, useRef } from "react";
import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";
import AddUserModal from "../../components/TambahUser";
import EditUserModal from "../../components/EditUser";
import DataImage from "../../data"; 

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function DataUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔍 state pencarian
  const [search, setSearch] = useState("");

  // state tambah user
  const [openAdd, setOpenAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // state edit user
  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // total sampah user
  const [userTotals, setUserTotals] = useState({});

  // admin profile
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // state upload avatar
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("id-ID");
  };

  // === FETCH PROFILE ADMIN ===
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (res.ok) setCurrentUser(json.data || null);
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // === FETCH TOTAL SAMPAH ===
  const fetchUserTotals = async (userList) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const results = await Promise.all(
        userList.map(async (u) => {
          try {
            const res = await fetch(`${API_BASE_URL}/setor/user/${u.id}`, {
              headers: { Authorization: `Bearer ${token}` },
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
          } catch {
            return { id: u.id, totalKg: 0 };
          }
        })
      );

      const totals = {};
      results.forEach((r) => (totals[r.id] = r.totalKg));
      setUserTotals(totals);
    } catch (err) {
      console.error("Gagal mengambil total sampah:", err);
    }
  };

  // === FETCH USER LIST ===
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token tidak ditemukan");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.message || "Gagal memuat user");
        return;
      }

      const list = json.data || [];
      setUsers(list);
      await fetchUserTotals(list);
    } catch {
      setErrorMsg("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProfile();
  }, []);

  // === FILTER USERS ===
  const filteredUsers = users.filter((user) => {
    const key = search.toLowerCase();
    return (
      (user.username || "").toLowerCase().includes(key) ||
      (user.email || "").toLowerCase().includes(key) ||
      (user.phone || "").toLowerCase().includes(key)
    );
  });

  const avatarUrl =
    currentUser?.avatar_url ||
    (currentUser?.username
      ? `https://ui-avatars.com/api/?name=${currentUser.username}&background=60BE75&color=ffffff&bold=true`
    : "https://ui-avatars.com/api/?name=User&background=60BE75&color=ffffff&bold=true");

  // === HANDLE KLIK AVATAR → BUKA FILE PICKER ===
  const handleAvatarClick = () => {
    if (uploadingAvatar) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // === UPLOAD AVATAR BARU ===
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");

    // validasi simpel ukuran & tipe kalau mau
    if (!file.type.startsWith("image/")) {
      setAvatarError("File harus berupa gambar (jpg, png, dll).");
      return;
    }

    try {
      setUploadingAvatar(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setAvatarError("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const formData = new FormData();
      // ❗ SESUAIKAN NAMA FIELD DENGAN BACKEND-MU
      formData.append("avatar", file);

      // ❗ SESUAIKAN ENDPOINT INI JUGA JIKA PERLU
      const res = await fetch(`${API_BASE_URL}/auth/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal upload avatar:", json);
        setAvatarError(json.message || "Gagal mengunggah avatar.");
        return;
      }

      // asumsi backend mengembalikan avatar_url baru di json.data.avatar_url
      if (json.data?.avatar_url) {
        setCurrentUser((prev) =>
          prev ? { ...prev, avatar_url: json.data.avatar_url } : prev
        );
      }
    } catch (err) {
      console.error("Error upload avatar:", err);
      setAvatarError("Terjadi kesalahan saat upload avatar.");
    } finally {
      setUploadingAvatar(false);
      // reset input supaya bisa pilih file yang sama lagi kalau mau
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col">
      <div className="flex flex-1 pb-20">
        <Navbaradmin />

        {/* MAIN CONTENT */}
        <div className="flex-1 lg:ml-64 px-6 pt-[84px] pb-10">
          {/* HEADER FIXED */}
          <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#FFFFFF] border-b border-gray-200 shadow-sm">
            <div className="h-16 px-6 flex items-center justify-between">
              <div>
                <h1 className="text-[18px] font-semibold">Daftar User</h1>
                <p className="text-[12px] text-gray-600">
                  Kelola data pelanggan bank sampah.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="relative group "
                  title="Klik untuk ganti foto profil"
                >
                  <img
                    src={avatarUrl}
                    className="w-10 h-10 rounded-full border  object-cover"
                    alt="avatar"
                  />
                  {/* overlay kecil saat hover */}
                  <span className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white transition">
                    Ubah
                  </span>
                </button>

                <div>
                  <p className="text-sm font-semibold">
                    {loadingProfile ? "Memuat…" : currentUser?.username || "-"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.role === "admin" ? "Admin" : "User"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* INPUT FILE HIDDEN UNTUK AVATAR */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />

          {/* SPACER UNTUK HEADER FIXED */}
          <div className="h-5" />

          {/* ERROR GLOBAL */}
          {errorMsg && (
            <div className="w-full max-w-5xl mx-auto mt-2 mb-3 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* ERROR AVATAR */}
          {avatarError && (
            <div className="w-full max-w-5xl mx-auto mb-3 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {avatarError}
            </div>
          )}

          {/* SEARCH + BUTTON */}
          <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-2 mb-6">
            {/* SEARCH BAR */}
            <div className="relative w-full sm:w-64">
              <img
                src={DataImage.SearchIcon}
                alt="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
              />

              <input
                type="text"
                placeholder="Cari user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-500 pl-10 pr-4 bg-white py-2 rounded-lg w-full shadow-sm"
              />
            </div>

            {/* BUTTON TAMBAH */}
            <button
              onClick={() => {
                setOpenAdd(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-md px-4 py-2 shadow-sm transition"
            >
              + Tambah User
            </button>
          </div>

          {/* TABEL USER */}
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow border border-gray-500 overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead className="bg-[#D8D8D8] text-black text-sm">
                  <tr className="h-14">
                    <th className="px-5 text-left font-semibold w-[20%]">
                      Nama User
                    </th>
                    <th className="px-5 text-left font-semibold w-[22%]">
                      Email
                    </th>
                    <th className="px-5 text-left font-semibold w-[13%]">
                      No. Telp
                    </th>
                    <th className="px-5 text-center font-semibold w-[13%]">
                      Total Sampah
                    </th>
                    <th className="px-5 text-center font-semibold w-[15%]">
                      Tanggal Daftar
                    </th>
                    <th className="px-5 text-center font-semibold w-[10%]">
                      Role
                    </th>
                    <th className="px-5 text-center font-semibold w-[7%]">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        Memuat data user…
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        Tidak ada user ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-gray-500 hover:bg-gray-50"
                      >
                        <td className="py-3 px-5">{user.username}</td>
                        <td className="py-3 px-5">{user.email}</td>
                        <td className="py-3 px-5">{user.phone || "-"}</td>

                        <td className="py-3 px-5 text-center">
                          {(userTotals[user.id] || 0) + " kg"}
                        </td>

                        <td className="py-3 px-5 text-center">
                          {formatTanggal(user.created_at)}
                        </td>

                        <td className="py-3 px-5 text-center">
                          {user.role === "admin" ? "Admin" : "User"}
                        </td>

                        <td className="py-3 px-5 text-center">
                          <button
                            onClick={() => {
                              setEditUser(user);
                              setOpenEdit(true);
                            }}
                            className="hover:opacity-60"
                          >
                            <img
                              src={DataImage.EditIcon}
                              className="w-5"
                              alt="edit"
                            />
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
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] bg-white shadow z-50">
        <Footeradmin />
      </div>

      {/* MODAL TAMBAH USER */}
      <AddUserModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={async (form) => {
          try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/users`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(form),
            });

            const json = await res.json();

            if (!res.ok) {
              alert(json.message || "Gagal menambah user");
              return false;
            }

            await fetchUsers();
            return true; // ← WAJIB agar popup sukses muncul
          } catch {
            return false;
          }
        }}
      />

      {/* MODAL EDIT USER */}
      <EditUserModal
        open={openEdit}
        user={editUser}
        onClose={() => {
          setOpenEdit(false);
          setEditUser(null);
        }}
        onSave={async ({ id, role }) => {
          try {
            const token = localStorage.getItem("token");

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
              alert(json.message || "Gagal mengedit user");
              return false;
            }

            await fetchUsers(); // refresh tabel
            return true; // untuk menampilkan popup sukses
          } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan.");
            return false;
          }
        }}
      />
    </div>
  );
}
