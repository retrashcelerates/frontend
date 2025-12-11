// src/pages/Admin/daftarharga.jsx
import { useState, useEffect, useRef } from "react";
import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";
import DataImage from "../../data";
import FormTambahProduk from "../../components/FormTambahProduk";
import FormEditProduk from "../../components/FormEditProduk";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function DaftarHarga() {
  const [showEdit, setShowEdit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // modal tambah
  const [showAdd, setShowAdd] = useState(false);

  // 🔍 Search state
  const [search, setSearch] = useState("");

  // DATA DARI BACKEND
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // loading delete
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ===== PROFILE ADMIN & AVATAR =====
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  // Format harga ke Rupiah
  const formatRupiah = (angka) => {
    if (angka == null || isNaN(angka)) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(angka));
  };

  // === FETCH PRODUK DARI BE (dipakai di awal & setelah CRUD) ===
  const fetchProduk = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch(`${API_BASE_URL}/produk`);
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json?.message || "Gagal memuat daftar produk dari server.");
        setProdukList([]);
        return;
      }

      const list = Array.isArray(json.data) ? json.data : [];
      setProdukList(list);
    } catch (err) {
      console.error("Error fetch produk:", err);
      setErrorMsg("Terjadi kesalahan jaringan/server saat memuat produk.");
      setProdukList([]);
    } finally {
      setLoading(false);
    }
  };

  // === FETCH PROFILE ADMIN ===
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
        console.error("Gagal mengambil profil admin:", json);
      }
    } catch (err) {
      console.error("Error mengambil profil admin:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProduk();
    fetchProfile();
  }, []);

  // Filter search (berdasarkan nama produk)
  const filteredData = produkList.filter((item) =>
    (item.nama_produk || "").toLowerCase().includes(search.toLowerCase())
  );

  // ====== URL AVATAR (kalau belum ada → ui-avatars hijau) ======
  const avatarUrl =
    currentUser?.avatar_url ||
    (currentUser?.username
      ? `https://ui-avatars.com/api/?name=${currentUser.username}&background=60BE75&color=ffffff&bold=true`
      : "https://ui-avatars.com/api/?name=User&background=60BE75&color=ffffff&bold=true");

  // ====== HANDLE KLIK AVATAR → BUKA FILE PICKER ======
  const handleAvatarClick = () => {
    if (uploadingAvatar) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ====== UPLOAD AVATAR BARU ======
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

  // ====== BUKA MODAL EDIT ======
  const handleOpenEdit = (item) => {
    setSelectedData(item);
    setShowEdit(true);
  };

  // ====== HANDLER DELETE PRODUK (DELETE /produk/:id) ======
  const handleDeleteConfirm = async () => {
    if (!selectedData) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      setDeleteLoading(true);
      setErrorMsg("");

      const res = await fetch(`${API_BASE_URL}/produk/${selectedData.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal hapus produk:", json);
        setErrorMsg(
          (Array.isArray(json?.errors) && json.errors.join(" | ")) ||
            json?.message ||
            "Gagal menghapus produk."
        );
        return;
      }

      setShowDelete(false);
      setSelectedData(null);
      await fetchProduk();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error hapus produk:", err);
      setErrorMsg("Terjadi kesalahan saat menghapus produk.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex">
      {/* SIDEBAR */}
      <Navbaradmin />

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-64 bg-[#F7F7F7] min-h-screen">
        {/* HEADER FIXED */}
        <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#F7F7F7] border-b border-gray-200 shadow">
          <div className="h-16 flex items-center justify-between px-6">
            <div>
              <h1 className="font-semibold text-[23px]">Daftar Harga</h1>
              <p className="text-gray-600 text-[15px]">
                Ubah harga dan status sampah
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
          {/* ERROR AVATAR */}
          {avatarError && (
            <div className="w-full max-w-5xl mx-auto mb-3 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {avatarError}
            </div>
          )}

          {/* ERROR CRUD */}
          {errorMsg && (
            <div className="w-full max-w-5xl mx-auto mb-4 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* SEARCH BAR + TOMBOL TAMBAH */}
          <div className="w-full max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <img
                src={DataImage.SearchIcon}
                alt="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
              />
              <input
                type="text"
                placeholder="Cari jenis sampah..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-500 pl-10 pr-4 bg-white py-2 rounded-lg w-full shadow-sm"
              />
            </div>

            <button
              onClick={() => {
                setShowAdd(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-md px-4 py-2 shadow-sm transition"
            >
              + Tambah Harga
            </button>
          </div>

          {/* TABLE */}
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow border border-gray-500 overflow-x-auto">
              <table className="w-full min-w-[950px] text-sm">
                <thead className="bg-[#D8D8D8] text-black text-sm">
                  <tr className="h-14">
                    <th className="px-5 text-left font-semibold w-[30%]">
                      Kategori Sampah
                    </th>
                    <th className="px-5 text-left font-semibold w-[18%]">
                      Harga/kg
                    </th>
                    <th className="px-5 text-left font-semibold w-[27%]">
                      Deskripsi
                    </th>
                    <th className="px-5 text-left font-semibold w-[15%]">
                      Jenis
                    </th>
                    <th className="px-5 text-center font-semibold w-[10%]">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        Memuat data harga sampah...
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        Tidak ada data cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-500 hover:bg-gray-50"
                      >
                        {/* Produk: gambar + nama */}
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={item.image_url}
                            alt={item.nama_produk}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <span className="font-medium text-sm">
                            {item.nama_produk}
                          </span>
                        </td>

                        {/* Harga */}
                        <td className="p-3">
                          {formatRupiah(item.harga)}/kg
                        </td>

                        {/* Deskripsi */}
                        <td className="p-3 text-gray-700">
                          {item.deskripsi || "-"}
                        </td>

                        {/* Jenis */}
                        <td className="p-3 text-gray-700">
                          {item.jenis || "-"}
                        </td>

                        {/* ACTION */}
                        <td className="py-2">
                          <div className="flex items-center justify-center gap-4">
                            {/* EDIT */}
                            <button
                              onClick={() => handleOpenEdit(item)}
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
                                setSelectedData(item);
                                setShowDelete(true);
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
        </div>

        {/* FOOTER */}
        <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] bg-white shadow z-50">
          <Footeradmin />
        </div>
      </div>

      {/* MODAL TAMBAH (dipisah ke component) */}
      <FormTambahProduk
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={async () => {
          setShowAdd(false);
          await fetchProduk();
          setShowSuccess(true);
        }}
      />

      {/* MODAL EDIT (dipisah ke component) */}
      <FormEditProduk
        open={showEdit}
        data={selectedData}
        onClose={() => {
          setShowEdit(false);
          setSelectedData(null);
        }}
        onSuccess={async () => {
          setShowEdit(false);
          setSelectedData(null);
          await fetchProduk();
          setShowSuccess(true);
        }}
      />

      {/* MODAL SUCCESS (tambah / edit / delete) */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-[320px] p-6 text-center">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
              ✓
            </div>

            <h3 className="font-semibold text-lg">Sukses</h3>
            <p className="text-gray-500 text-sm mt-1">
              Berhasil menyimpan perubahan harga sampah
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-5 bg-green-500 text-white px-6 py-2 rounded-md text-sm"
            >
              Oke
            </button>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-8 shadow-lg">
            <h3 className="text-lg font-semibold text-center">
              Konfirmasi Hapus
            </h3>
            <p className="text-left text-black mt-4">
              Apakah Anda yakin ingin menghapus data ini?
              <br />
              Tindakan tidak dapat dibatalkan.
            </p>

            <div className="mt-5 flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
