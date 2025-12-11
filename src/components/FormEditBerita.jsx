import { useEffect, useState } from "react";
import axios from "axios";
import DataImage from "../data";

const API_URL = "https://backend-deployment-topaz.vercel.app/api/berita";

const EditBerita = ({ open, onClose, beritaId, onSuccess }) => {
  if (!open) return null;

  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [konten, setKonten] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // POP UP SUKSES
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // =========================
  // FETCH DATA BERITA
  // =========================
  useEffect(() => {
    if (!beritaId) return;

    axios
      .get(`${API_URL}/${beritaId}`)
      .then((res) => {
        const data = res.data.data;

        setJudul(data.judul);
        setKonten(data.konten);
        setPreview(data.image_url);

        const dateObj = new Date(data.created_at);
        setTanggal(dateObj.toISOString().split("T")[0]);
      })
      .catch((err) => console.error(err));
  }, [beritaId]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (status) => {
    if (!judul || !konten || !tanggal) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("konten", konten);
      formData.append("status", status);
      formData.append("author", "Admin");

      if (thumbnail) formData.append("image", thumbnail);

      await axios.put(`${API_URL}/${beritaId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // 🟢 Pesan sesuai tombol
      if (status === "draft") {
        setSuccessMessage("Berhasil menyimpan sebagai draft.");
      } else {
        setSuccessMessage("Berhasil memperbarui & mempublish berita.");
      }

      setShowSuccess(true);

    } catch (err) {
      console.error(err);
      alert("Gagal mengubah berita!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 overflow-y-auto z-50 px-4 py-10">

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit Berita</h2>

        <div className="space-y-4">

          <div>
            <label className="text-sm font-medium">Judul Berita</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full mt-1 border border-gray-400 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tanggal Publikasi</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full mt-1 border border-gray-400 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Konten Berita</label>
            <textarea
              rows="5"
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              className="w-full mt-1 border border-gray-400 rounded-lg px-3 py-2"
            ></textarea>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="text-sm font-medium">Thumbnail Berita</label>

            <div className="mt-2 border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center cursor-pointer relative">

              {preview ? (
                <img src={preview} className="w-full max-h-60 object-cover rounded-lg" />
              ) : (
                <>
                  <span className="text-3xl">📤</span>
                  <p className="text-sm mt-2 text-gray-600">Upload gambar baru</p>
                </>
              )}

              <input
                type="file"
                onChange={handleFile}
                className="w-full h-full opacity-0 absolute cursor-pointer"
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={() => handleSubmit("draft")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-gray-400"
            disabled={loading}
          >
            Draft
          </button>

          <button
            onClick={() => handleSubmit("published")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Publish"}
          </button>
        </div>

      </div>

      {/* =========================== */}
      {/* POP UP SUKSES */}
      {/* =========================== */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-7 text-center">

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <img
                src={DataImage.CentangIcon}
                alt="success"
                className="w-12 h-12"
              />
            </div>

            <h3 className="text-xl font-semibold">Sukses</h3>
            <p className="text-gray-600 mt-1">{successMessage}</p>

            <button
              onClick={() => {
                setShowSuccess(false);
                onSuccess();
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

export default EditBerita;
