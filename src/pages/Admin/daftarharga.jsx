// src/pages/Admin/daftarharga.jsx
import { useState, useEffect, useRef } from "react";
import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";
import DataImage from "../../data";

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

  // form TAMBAH
  const [addNama, setAddNama] = useState("");
  const [addHarga, setAddHarga] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  // form EDIT (harga saja, sesuai UI)
  const [editHarga, setEditHarga] = useState("");
  const [editSaving, setEditSaving] = useState(false);

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

  // ====== HANDLER TAMBAH PRODUK (POST /produk) ======
  const handleAddSubmit = async () => {
    if (!addNama.trim() || !addHarga) {
      alert("Jenis sampah dan harga wajib diisi.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      setAddSaving(true);
      setErrorMsg("");

      const res = await fetch(`${API_BASE_URL}/produk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama_produk: addNama,
          harga: Number(addHarga),
          deskripsi: null,
          jenis: null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal tambah produk:", json);
        setErrorMsg(
          (Array.isArray(json?.errors) && json.errors.join(" | ")) ||
            json?.message ||
            "Gagal menambah produk."
        );
        return;
      }

      // sukses
      setShowAdd(false);
      setAddNama("");
      setAddHarga("");
      await fetchProduk();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error tambah produk:", err);
      setErrorMsg("Terjadi kesalahan saat menambah produk.");
    } finally {
      setAddSaving(false);
    }
  };

  // ====== HANDLER BUKA MODAL EDIT ======
  const handleOpenEdit = (item) => {
    setSelectedData(item);
    setEditHarga(item?.harga ?? "");
    setShowEdit(true);
  };

  // ====== HANDLER EDIT PRODUK (PUT /produk/:id) ======
  const handleEditSave = async () => {
    if (!selectedData) return;

    if (!editHarga) {
      alert("Harga wajib diisi.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      setEditSaving(true);
      setErrorMsg("");

      const res = await fetch(`${API_BASE_URL}/produk/${selectedData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama_produk: selectedData.nama_produk,
          harga: Number(editHarga),
          deskripsi: selectedData.deskripsi || null,
          jenis: selectedData.jenis || null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal update produk:", json);
        setErrorMsg(
          (Array.isArray(json?.errors) && json.errors.join(" | ")) ||
            json?.message ||
            "Gagal mengubah produk."
        );
        return;
      }

      setShowEdit(false);
      setSelectedData(null);
      await fetchProduk();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error update produk:", err);
      setErrorMsg("Terjadi kesalahan saat mengubah produk.");
    } finally {
      setEditSaving(false);
    }
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
        {/* HEADER FIXED (disamakan dengan halaman lain) */}
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
            <div className="w-full max-w-5xl mx-auto mb-3 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {avatarError}
            </div>
          )}

          {/* ALERT ERROR CRUD */}
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

            {/* Tombol Tambah di kanan */}
            <button
              onClick={() => {
                setAddNama("");
                setAddHarga("");
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
              <table className="w-full min-w-[850px] text-sm">
                <thead className="bg-[#D8D8D8] text-black text-sm">
                  <tr className="h-14">
                    <th className="px-5 text-left font-semibold w-[40%]">
                      Jenis Sampah
                    </th>
                    <th className="px-5 text-left font-semibold w-[25%]">
                      Harga/kg
                    </th>
                    <th className="px-5 text-left font-semibold w-[15%]">
                      Status
                    </th>
                    <th className="px-5 text-center font-semibold w-[20%]">
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
                        Memuat data harga sampah...
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
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
                        {/* Jenis Sampah (nama_produk dari BE) */}
                        <td className="p-3">{item.nama_produk}</td>

                        {/* Harga/kg (harga dari BE) */}
                        <td className="p-3">{formatRupiah(item.harga)}/kg</td>

                        {/* Status – sementara default "Aktif" */}
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
                            Aktif
                          </span>
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

      {/* MODAL TAMBAH */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-[380px] p-6 relative">
            <h2 className="font-semibold mb-4 text-lg">Tambah Harga Baru</h2>

            <div className="mb-3">
              <label className="text-sm">Jenis Sampah</label>
              <input
                type="text"
                placeholder="Contoh: Botol Plastik (PET)"
                value={addNama}
                onChange={(e) => setAddNama(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm">Harga/kg</label>
              <input
                type="number"
                placeholder="Contoh: 3000"
                value={addHarga}
                onChange={(e) => setAddHarga(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md text-sm"
              />
            </div>

            <div className="mt-2 mb-4">
              <p className="text-sm mb-1">Status</p>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-1">
                  <input type="radio" name="status_tambah" defaultChecked />{" "}
                  Aktif
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="status_tambah" /> Tidak Aktif
                </label>
              </div>
            </div>

            <button
              onClick={handleAddSubmit}
              disabled={addSaving}
              className="mt-3 w-full bg-green-500 text-white py-2 rounded-md text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {addSaving ? "Menyimpan..." : "Simpan"}
            </button>

            <button
              onClick={() => setShowAdd(false)}
              className="absolute top-3 right-3 text-gray-400 text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-[360px] p-6 relative">
            <h2 className="font-semibold mb-4 text-lg">Edit Harga</h2>

            <label className="text-sm">Harga/kg</label>
            <input
              type="number"
              value={editHarga}
              onChange={(e) => setEditHarga(e.target.value)}
              className="w-full mt-2 p-2 border rounded-md text-sm"
            />

            <div className="mt-4">
              <p className="text-sm mb-1">Status</p>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-1">
                  <input type="radio" name="status" defaultChecked /> Aktif
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="status" /> Tidak Aktif
                </label>
              </div>
            </div>

            <button
              onClick={handleEditSave}
              disabled={editSaving}
              className="mt-5 w-full bg-green-500 text-white py-2 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {editSaving ? "Menyimpan..." : "Selesai"}
            </button>

            <button
              onClick={() => {
                setShowEdit(false);
                setSelectedData(null);
              }}
              className="absolute top-3 right-3 text-gray-400 text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MODAL SUCCESS (dipakai tambah & edit & delete) */}
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
          <div className="bg-white rounded-xl w-[90%] max-w-[340px] p-6 text-center">
            <h3 className="font-semibold mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus data ini?
              <br />
              Tindakan tidak dapat dibatalkan.
            </p>

            <div className="mt-5 flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setSelectedData(null);
                }}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Batal
              </button>

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
