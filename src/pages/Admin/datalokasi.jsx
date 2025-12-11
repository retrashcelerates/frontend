// src/pages/Admin/datalokasi.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";
import DataImage from "../../data";
import FormTambahLokasi from "../../components/FormTambahLokasi";

const API_URL = "https://backend-deployment-topaz.vercel.app/api/lokasi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

const AdminLokasi = () => {
  const [lokasi, setLokasi] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 state search
  const [search, setSearch] = useState("");

  // MODAL STATE
  const [openTambah, setOpenTambah] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // POPUP SUKSES HAPUS
  const [showSuccess, setShowSuccess] = useState(false);


  // ===== PROFILE ADMIN & AVATAR =====
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  // Fetch lokasi data
  const fetchData = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setLokasi(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Fetch profil admin
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
        console.error("Gagal ambil profil admin:", json);
      }
    } catch (err) {
      console.error("Error ambil profil admin:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, []);

  // HAPUS LOKASI
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setShowSuccess(true); // ← tampilkan popup sukses
      return true;

    } catch (err) {
      console.error(err);
      alert("Gagal menghapus lokasi!");
      return false;
    }
  };


  // FILTER LOKASI BERDASARKAN SEARCH
  const filteredLokasi = lokasi.filter((item) => {
    const k = search.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(k) ||
      (item.jalan || "").toLowerCase().includes(k) ||
      (item.desa || "").toLowerCase().includes(k) ||
      (item.kecamatan || "").toLowerCase().includes(k) ||
      (item.kabupaten || "").toLowerCase().includes(k) ||
      String(item.kodepos || "").toLowerCase().includes(k)
    );
  });

  // URL avatar (kalau belum ada → ui-avatars hijau)
  const avatarUrl =
    currentUser?.avatar_url ||
    (currentUser?.username
      ? `https://ui-avatars.com/api/?name=${currentUser.username}&background=60BE75&color=ffffff&bold=true`
      : "https://ui-avatars.com/api/?name=User&background=60BE75&color=ffffff&bold=true");

  // Klik avatar → buka file picker
  const handleAvatarClick = () => {
    if (uploadingAvatar) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Ganti avatar
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
      // sesuaikan nama field dengan backend
      formData.append("avatar", file);

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
      {/* SIDEBAR */}
      <Navbaradmin />

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-64 bg-[#FFFFFF] min-h-screen">
        {/* HEADER FIXED (DISAMAKAN DENGAN DATAUSER) */}
        <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#FFFFFF] border-b border-gray-200 shadow-sm">
          <div className="h-16 px-6 flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-semibold">Data Lokasi</h1>
              <p className="text-[12px] text-gray-600">
                Kelola data lokasi layanan ReTrash
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

        {/* CONTENT */}
        <div className="pt-[115px] px-6 pb-36">
          {/* ERROR AVATAR (kalau ada) */}
          {avatarError && (
            <div className="w-full max-w-5xl mx-auto mb-4 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {avatarError}
            </div>
          )}

          {/* SEARCH + BUTTON TAMBAH (SEJAJAR DENGAN TABEL) */}
          <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            {/* SEARCH */}
            <div className="relative w-full sm:w-64">
              <img
                src={DataImage.SearchIcon}
                alt="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
              />

              <input
                type="text"
                placeholder="Cari lokasi..."
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
              + Tambah Lokasi
            </button>
          </div>

          {/* TABLE WRAPPER (style seperti berita) */}
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow border border-gray-500 overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead className="bg-[#D8D8D8] text-sm text-black">
                  <tr className="h-14">
                    <th className="px-5 text-left font-semibold w-[25%]">
                      Nama Lokasi
                    </th>
                    <th className="px-5 font-semibold w-[15%]">Jalan</th>
                    <th className="px-5 font-semibold w-[10%]">Desa</th>
                    <th className="px-5 font-semibold w-[10%]">Kecamatan</th>
                    <th className="px-5 font-semibold w-[10%]">Kabupaten</th>
                    <th className="px-5 font-semibold w-[10%]">Kode Pos</th>
                    <th className="px-5 font-semibold w-[10%] text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-6 text-gray-500"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : filteredLokasi.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-10 text-gray-500"
                      >
                        Tidak ada lokasi yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredLokasi.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-500 hover:bg-gray-50"
                      >
                        {/* FOTO + NAMA */}
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={item.image_url}
                            className="w-16 h-16 rounded-md object-cover"
                            alt="lokasi"
                          />
                          <span className="font-medium text-sm">
                            {item.name}
                          </span>
                        </td>

                        <td className="text-gray-700 text-sm text-center">
                          {item.jalan}
                        </td>
                        <td className="text-gray-700 text-sm text-center">
                          {item.desa}
                        </td>
                        <td className="text-gray-700 text-sm text-center">
                          {item.kecamatan}
                        </td>
                        <td className="text-gray-700 text-sm text-center">
                          {item.kabupaten}
                        </td>
                        <td className="text-gray-700 text-sm text-center">
                          {item.kodepos}
                        </td>

                        {/* Aksi (icon sama seperti berita) */}
                        <td className="text-center py-2">
                          <button
                            onClick={() => {
                              setSelectedId(item.id);
                              setOpenDelete(true);
                            }}
                            className="hover:opacity-80"
                          >
                            <img
                              src={DataImage.DeleteIcon}
                              className="w-5"
                              alt="delete"
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

        {/* FOOTER */}
        <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] bg-white shadow z-40">
          <Footeradmin />
        </div>
      </div>

      {/* MODAL TAMBAH */}
      <FormTambahLokasi
        open={openTambah}
        onClose={() => setOpenTambah(false)}
        onSuccess={() => {
          setOpenTambah(false);
          fetchData();
        }}
      />

      {/* MODAL DELETE */}
      {openDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-xl p-8 shadow-lg relative">
            <h3 className="text-lg font-semibold text-center">Hapus Lokasi?</h3>

            <p className="text-left text-black mt-4">
              Apakah Anda yakin ingin menghapus lokasi ini?
              <br />
              Tindakan tidak dapat dibatalkan.
            </p>

            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP SUKSES DELETE */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-7 text-center">

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <img
                src={DataImage.CentangIcon}
                className="w-12 h-12"
                alt="success"
              />
            </div>

            <h3 className="text-xl font-semibold">Sukses</h3>
            <p className="text-gray-600 mt-1">Lokasi berhasil dihapus.</p>

            <button
              onClick={() => {
                setShowSuccess(false);
                setOpenDelete(false);
                setSelectedId(null);
                fetchData(); 
              }}
              className="mt-5 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Oke
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLokasi;
