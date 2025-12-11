// src/components/FormEditProduk.jsx
import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function FormEditProduk({ open, data, onClose, onSuccess }) {
  const [editHarga, setEditHarga] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // state untuk thumbnail
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (data) {
      setEditHarga(data.harga ?? "");
      setThumbnailPreview(data.image_url || ""); // kalau BE pakainya image_url
      setThumbnailFile(null);
      setErrorMsg("");
    }
  }, [data]);

  if (!open || !data) return null;

  // handle pilih file dari input / drop
  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Thumbnail harus berupa file gambar (JPG, PNG, dll).");
      return;
    }
    setErrorMsg("");
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleEditSave = async () => {
    if (!editHarga) {
      setErrorMsg("Harga wajib diisi.");
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

      // pakai FormData supaya bisa kirim gambar + field lain
      const formData = new FormData();
      formData.append("nama_produk", data.nama_produk);
      formData.append("harga", String(editHarga));
      if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
      if (data.jenis) formData.append("jenis", data.jenis);
      if (thumbnailFile) {
        // SESUAIKAN NAMA FIELD DENGAN BACKEND (mis. "image" / "thumbnail")
        formData.append("image", thumbnailFile);
      }

      const res = await fetch(`${API_BASE_URL}/produk/${data.id}`, {
        method: "PUT", // biarkan tanpa Content-Type, biar browser set multipart boundary
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error update produk:", err);
      setErrorMsg("Terjadi kesalahan saat mengubah produk.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-[420px] p-6 sm:p-7 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg sm:text-xl">Edit Harga</h2>
          <button
            onClick={onClose}
            className="text-[#24B34B] text-xl font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Harga */}
        <div className="mb-4">
          <label className="text-sm font-medium">Harga/Kg</label>
          <input
            type="number"
            placeholder="Masukkan harga baru (Rp.)"
            value={editHarga}
            onChange={(e) => setEditHarga(e.target.value)}
            className="w-full mt-2 px-3 py-2 border border-[#D9D9D9] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#24B34B]"
          />
        </div>

        {/* Thumbnail Sampah */}
        <div className="mb-4">
          <label className="text-sm font-medium">Thumbnail Sampah</label>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-2 border rounded-lg h-[170px] flex flex-col items-center justify-center text-center text-sm cursor-pointer transition ${
              isDragging
                ? "border-[#24B34B] bg-green-50"
                : "border-[#D9D9D9] bg-[#FAFAFA]"
            }`}
            onClick={() =>
              document.getElementById("edit-produk-thumbnail-input")?.click()
            }
          >
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <>
                {/* icon sederhana cloud + arrow */}
                <div className="mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-gray-400 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 15.75A4.5 4.5 0 017.5 11.25h.75a.75.75 0 00.75-.75 5.25 5.25 0 019.867-2.094A3.75 3.75 0 0120.25 15.75H18M12 12v6m0-6l-2.25 2.25M12 12l2.25 2.25"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  Seret dan lepas gambar Anda disini
                </p>
              </>
            )}
          </div>

          {/* input file tersembunyi */}
          <input
            id="edit-produk-thumbnail-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {/* Tombol Selesai */}
        <button
          onClick={handleEditSave}
          disabled={saving}
          className="mt-2 w-full bg-[#24B34B] text-white py-2.5 rounded-md text-sm font-semibold hover:bg-[#1f9a40] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Menyimpan..." : "Selesai"}
        </button>
      </div>
    </div>
  );
}
