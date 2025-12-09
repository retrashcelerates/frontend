import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://backend-deployment-topaz.vercel.app/api/berita";

const EditBerita = ({ open, onClose, beritaId, onSuccess }) => {
  if (!open) return null;

  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [konten, setKonten] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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
        const formattedDate = dateObj.toISOString().split("T")[0];
        setTanggal(formattedDate);
      })
      .catch((err) => console.error("Error fetching berita:", err));
  }, [beritaId]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloud = async () => {
    if (!thumbnail) return preview;

    const formData = new FormData();
    formData.append("image", thumbnail);

    const res = await axios.post(
      "https://backend-deployment-topaz.vercel.app/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data.url;
  };

  const handleSubmit = async (status) => {
    if (!judul || !tanggal || !konten) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      const image_url = await uploadImageToCloud();

      await axios.put(`${API_URL}/${beritaId}`, {
        judul,
        konten,
        status,
        author: "Admin",
        image_url,
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Gagal mengubah berita!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 overflow-y-auto z-50 px-4 py-10">

      {/* CARD */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit Berita</h2>

        {/* FORM */}
        <div className="space-y-4">

          {/* Judul */}
          <div>
            <label className="text-sm font-medium">Judul Berita</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full mt-1 border border-[#857A7A] rounded-lg px-3 py-2"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label className="text-sm font-medium">Tanggal Publikasi</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full mt-1 border border-[#857A7A] rounded-lg px-3 py-2"
            />
          </div>

          {/* Konten */}
          <div>
            <label className="text-sm font-medium">Konten Berita</label>
            <textarea
              rows="5"
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              className="w-full mt-1 border border-[#857A7A] rounded-lg px-3 py-2"
            ></textarea>
          </div>

          {/* Upload Thumbnail */}
          <div>
            <label className="text-sm font-medium">Thumbnail Berita</label>

            <div className="mt-2 border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center cursor-pointer relative">

              {preview ? (
                <img
                  src={preview}
                  className="w-full max-h-60 object-cover rounded-lg"
                />
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

        {/* BUTTON */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={() => handleSubmit("draft")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            Simpan Draft
          </button>

          <button
            onClick={() => handleSubmit("terbit")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Publish"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditBerita;
