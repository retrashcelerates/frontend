import { useState } from "react";
import axios from "axios";
import DataImage from "../data";

const API_URL = "https://backend-deployment-topaz.vercel.app/api/lokasi";

export default function FormTambahLokasi({ open, onClose, onSuccess }) {
  if (!open) return null;

  const [form, setForm] = useState({
    name: "",
    jalan: "",
    desa: "",
    kecamatan: "",
    kabupaten: "",
    kodepos: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // POPUP SUKSES
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const { name, jalan, desa, kecamatan, kabupaten, kodepos } = form;

    if (!name || !jalan || !desa || !kecamatan || !kabupaten || !kodepos || !thumbnail) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("image", thumbnail);

      await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setShowSuccess(true); // ⬅️ TAMPILKAN POPUP SUKSES
    } catch (err) {
      console.error(err);
      alert("Gagal menambah lokasi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start overflow-y-auto py-14 px-4">

      {/* CARD UTAMA */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-7 relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-green-600 text-xl font-bold hover:text-green-800"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-[20px] font-semibold mb-6">Tambah Lokasi</h2>

        {/* FORM */}
        <div className="space-y-4">
          {/* Input Fields */}
          {[
            { label: "Nama Lokasi", name: "name", placeholder: "Masukkan nama lokasi" },
            { label: "Jalan", name: "jalan", placeholder: "Contoh: Jl. Ketintang Baru No.12" },
            { label: "Desa", name: "desa", placeholder: "Contoh: Surabaya" },
            { label: "Kecamatan", name: "kecamatan", placeholder: "Contoh: Gayungan" },
            { label: "Kabupaten", name: "kabupaten", placeholder: "Contoh: Surabaya" },
            { label: "Kode pos", name: "kodepos", placeholder: "Contoh: 60243" },
          ].map((item, i) => (
            <div key={i}>
              <label className="text-sm font-medium">{item.label}</label>
              <input
                type="text"
                name={item.name}
                placeholder={item.placeholder}
                value={form[item.name]}
                onChange={handleInput}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          ))}

          {/* Thumbnail Upload */}
          <div>
            <label className="text-sm font-medium">Thumbnail Lokasi</label>

            <div className="mt-2 border border-dashed border-gray-400 rounded-lg p-6 
                            flex flex-col justify-center items-center cursor-pointer relative h-40">

              {preview ? (
                <img src={preview} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <img src={DataImage.CloudIcon} className="w-12 opacity-60" />
                  <p className="text-gray-600 text-sm mt-2">
                    Seret dan lepas gambar Anda disini
                  </p>
                </>
              )}

              <input
                type="file"
                onChange={handleFile}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
          </div>
        </div>

        {/* BUTTON SIMPAN */}
        <div className="flex justify-end mt-7">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#47CF65] text-white rounded-md text-sm hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {/* POPUP SUKSES */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg">
            
            {/* Ikon sukses (gunakan gambar dari DataImage) */}
            <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <img src={DataImage.CentangIcon} className="w-12" />
            </div>

            <h3 className="text-xl font-semibold">Sukses</h3>
            <p className="text-black mt-1">
              Berhasil menambah lokasi setor.
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                onSuccess(); // refresh & tutup modal
              }}
              className="mt-5 px-6 py-2 bg-[#47CF65] text-white rounded-lg hover:bg-green-700"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
