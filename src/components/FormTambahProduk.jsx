// src/components/FormTambahProduk.jsx
import { useState, useRef } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function FormTambahProduk({ open, onClose, onSuccess }) {
  const [addNama, setAddNama] = useState("");
  const [addHarga, setAddHarga] = useState("");
  const [addDeskripsi, setAddDeskripsi] = useState("");
  const [addJenis, setAddJenis] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  if (!open) return null;

  // === pilih file via klik ===
  const handleSelectFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Thumbnail harus berupa file gambar (jpg, png, dll).");
      return;
    }
    setErrorMsg("");
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // === drag & drop ===
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Thumbnail harus berupa file gambar (jpg, png, dll).");
      return;
    }
    setErrorMsg("");
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // === SUBMIT ===
  const handleAddSubmit = async () => {
    if (!addNama.trim() || !addHarga) {
      setErrorMsg("Nama produk dan harga wajib diisi.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      // pakai FormData supaya bisa kirim gambar
      const formData = new FormData();
      formData.append("nama_produk", addNama);
      formData.append("harga", String(Number(addHarga)));
      formData.append("deskripsi", addDeskripsi || "");
      formData.append("jenis", addJenis || "");
      if (thumbnailFile) {
        // ❗ sesuaikan nama field "image" dengan backend (misal: "thumbnail" / "gambar")
        formData.append("image", thumbnailFile);
      }

      const res = await fetch(`${API_BASE_URL}/produk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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

      // reset form
      setAddNama("");
      setAddHarga("");
      setAddDeskripsi("");
      setAddJenis("");
      setThumbnailFile(null);
      setThumbnailPreview("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error tambah produk:", err);
      setErrorMsg("Terjadi kesalahan saat menambah produk.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[94%] max-w-[540px] p-6 sm:p-7 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg sm:text-xl">
            Tambah Harga Baru
          </h2>
          <button
            onClick={onClose}
            className="text-[#24B34B] text-xl font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-3">
          {/* Nama Produk */}
          <div>
            <label className="text-sm font-medium">Nama Produk</label>
            <input
              type="text"
              placeholder="Contoh: Botol Plastik (PET)"
              value={addNama}
              onChange={(e) => setAddNama(e.target.value)}
              className="mt-1.5 w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#24B34B]"
            />
          </div>

          {/* Harga */}
          <div>
            <label className="text-sm font-medium">Harga/kg</label>
            <input
              type="number"
              placeholder="Contoh: 3000"
              value={addHarga}
              onChange={(e) => setAddHarga(e.target.value)}
              className="mt-1.5 w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#24B34B]"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-sm font-medium">Deskripsi</label>
            <input
              type="text"
              placeholder="Contoh: Sampah plastik bening, bersih, kering"
              value={addDeskripsi}
              onChange={(e) => setAddDeskripsi(e.target.value)}
              className="mt-1.5 w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#24B34B]"
            />
          </div>

          {/* Jenis */}
          <div>
            <label className="text-sm font-medium">Jenis</label>
            <input
              type="text"
              placeholder="Contoh: Plastik, Kertas, Logam"
              value={addJenis}
              onChange={(e) => setAddJenis(e.target.value)}
              className="mt-1.5 w-full border border-[#D9D9D9] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#24B34B]"
            />
          </div>

          {/* Thumbnail Produk */}
          <div className="mt-2">
            <label className="text-sm font-medium">Thumbnail Produk</label>

            <div
              onClick={handleSelectFile}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`mt-2 border-2 border-dashed rounded-md px-4 py-6 text-center cursor-pointer transition
              ${
                isDragging
                  ? "border-[#24B34B] bg-[#F4FFF8]"
                  : "border-[#D9D9D9] bg-[#FAFAFA]"
              }`}
            >
              {thumbnailPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <p className="text-xs text-gray-600">
                    Klik atau seret gambar lain untuk mengganti
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-3xl mb-2">☁️</div>
                  <p className="text-xs text-gray-600">
                    Seret dan lepas gambar Anda di sini
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    atau klik untuk memilih file
                  </p>
                </>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Footer button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddSubmit}
            disabled={saving}
            className="px-5 py-2 bg-[#24B34B] text-white text-sm font-semibold rounded-md hover:bg-[#1f9a40] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
