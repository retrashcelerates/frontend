// src/pages/Admin/berita.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import DataImage from "../../data";

import Navbaradmin from "../../components/Navbaradmin";
import TambahBerita from "../../components/FormTambahBerita";
import EditBerita from "../../components/FormEditBerita";
import DeleteConfirm from "../../components/DeleteBerita";
import Footeradmin from "../../components/Footeradmin";

const API_URL = "https://backend-deployment-topaz.vercel.app/api/berita";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

const AdminBerita = () => {
  const [berita, setBerita] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  // ====== STATE PROFILE ADMIN & AVATAR ======
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  // FETCH BERITA
  const fetchData = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setBerita(res.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setBerita([]);
        setLoading(false);
      });
  };

  // FETCH PROFIL ADMIN
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (res.ok) {
        setCurrentUser(json.data || null);
      } else {
        console.error("Gagal mengambil profil:", json);
      }
    } catch (err) {
      console.error("Error mengambil profil:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, []);

  // FILTER SEARCH
  const filtered = berita.filter((item) =>
    (item.judul || "").toLowerCase().includes(search.toLowerCase())
  );

  // URL AVATAR: kalau belum ada, pakai ui-avatars background hijau
  const avatarUrl =
    currentUser?.avatar_url ||
    (currentUser?.username
      ? `https://ui-avatars.com/api/?name=${currentUser.username}&background=60BE75&color=ffffff&bold=true`
      : "https://ui-avatars.com/api/?name=User&background=60BE75&color=ffffff&bold=true");

  // DELETE BERITA
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchData();
      return true;  

    } catch (err) {
      console.error(err);
      alert("Gagal menghapus berita!");
      return false; // agar tidak menampilkan sukses
    }
  };


  // HANDLE KLIK AVATAR → BUKA PILIH FILE
  const handleAvatarClick = () => {
    if (uploadingAvatar) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // HANDLE UPLOAD AVATAR BARU
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");

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
      // sesuaikan dengan field backend
      formData.append("avatar", file);

      const res = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
        method: "PUT",
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex">
      {/* SIDEBAR + NAVBAR ADMIN */}
      <Navbaradmin />

      {/* KONTEN UTAMA */}
      <div className="flex-1 lg:ml-64 bg-[#FFFFFF] min-h-screen overflow-x-hidden">
        {/* HEADER FIXED (sudah pakai avatar admin) */}
        <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#FFFFFF] border-b border-gray-200 shadow-sm">
          <div className="h-16 flex items-center justify-between px-6">
            <div>
              <h1 className="font-semibold text-[18px]">Daftar Berita</h1>
              <p className="text-gray-600 text-[12px]">
                Kelola seluruh berita ReTrash
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="relative group"
                title="Klik untuk ganti foto profil"
              >
                <img
                  src={avatarUrl}
                  className="w-10 h-10 rounded-full border object-cover"
                  alt="avatar"
                />
                {/* overlay kecil saat hover */}
                <span className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white transition">
                  Ubah
                </span>
              </button>

              <div>
                <p className="font-semibold text-sm">
                  {loadingProfile ? "Memuat…" : currentUser?.username || "-"}
                </p>
                <p className="text-gray-500 text-xs">
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

        {/* MAIN CONTENT */}
        <div className="pt-[115px] px-6 pb-36">
          {/* error avatar kalau ada */}
          {avatarError && (
            <div className="w-full max-w-5xl mx-auto mb-3 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {avatarError}
            </div>
          )}

          {/* WRAPPER SUPAYA LEBIH KE TENGAH & RAPI */}
          <div className="w-full max-w-5xl mx-auto">
            {/* Header Search + Tambah Berita */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              {/* SEARCH */}
              <div className="relative w-full sm:w-64">
                <img
                  src={DataImage.SearchIcon}
                  alt="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
                />

                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-500 pl-10 pr-4 bg-white py-2 rounded-lg w-full shadow-sm"
                />
              </div>

              {/* BUTTON TAMBAH */}
            <button
              onClick={() => {
                setOpenTambah(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-md px-4 py-2 shadow-sm transition"
            >
              + Tambah Berita
            </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow border border-gray-500 overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-[#D8D8D8] text-black text-sm">
                  <tr className="h-14">
                    <th className="px-5 text-left w-[45%] font-semibold">
                      Judul
                    </th>
                    <th className="px-5 text-center w-[20%] font-semibold">
                      Tanggal
                    </th>
                    <th className="px-5 text-center w-[15%] font-semibold">
                      Status
                    </th>
                    <th className="px-5 text-center w-[20%] font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-gray-500"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-10 text-gray-500"
                      >
                        Tidak ada berita ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-500 hover:bg-gray-50"
                      >
                        {/* Judul + Gambar */}
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={item.image_url}
                            className="w-20 h-16 object-cover rounded-md"
                            alt="thumbnail"
                          />
                          <div>
                            <p className="font-medium text-sm">
                              {item.judul}
                            </p>
                          </div>
                        </td>

                        {/* Tanggal */}
                        <td className="text-center text-sm text-black">
                          {new Date(
                            item.created_at
                          ).toLocaleDateString("id-ID")}
                        </td>

                        {/* Status */}
                        <td className="text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.status === "draft"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="py-2">
                          <div className="flex items-center justify-center gap-4">
                            {/* EDIT */}
                            <button
                              onClick={() => {
                                setSelectedId(item.id);
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

                            {/* DELETE */}
                            <button
                              onClick={() => {
                                setSelectedId(item.id);
                                setOpenDelete(true);
                              }}
                              className="hover:opacity-60"
                            >
                              <img
                                src={DataImage.DeleteIcon}
                                className="w-5"
                                alt="delete"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER FIXED */}
          <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
            <Footeradmin />
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH */}
      <TambahBerita
        open={openTambah}
        onClose={() => setOpenTambah(false)}
        onSuccess={() => {
          setOpenTambah(false);
          fetchData();
        }}
      />

      {/* MODAL EDIT */}
      <EditBerita
        open={openEdit}
        beritaId={selectedId}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => {
          setOpenEdit(false);
          fetchData();
        }}
      />

      {/* MODAL DELETE */}
      <DeleteConfirm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminBerita;
