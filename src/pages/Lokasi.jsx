// src/pages/Lokasi.jsx
import { useState, useEffect } from "react";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function Lokasi() {
  const [search, setSearch] = useState("");
  const [lokasiData, setLokasiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==== FETCH DATA LOKASI DARI BACKEND ====
  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/lokasi`);
        const json = await res.json();

        if (!res.ok) {
          setError(json.message || "Gagal memuat data lokasi");
          setLokasiData([]);
          return;
        }

        // Map data dari BE ke FE
        const mapped = (json.data || []).map((item) => {
          const alamatParts = [
            item.jalan,
            item.desa,
            item.kecamatan,
            item.kabupaten,
            item.kodepos,
          ].filter(Boolean);

          return {
            id: item.id,
            nama: item.name,
            alamat: alamatParts.join(", "),
            jam: "Sen - Jum, 08:00 - 17:30",
            image_url: item.image_url || null,
          };
        });

        setLokasiData(mapped);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil data lokasi.");
        setLokasiData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLokasi();
  }, []);

  // Filter search
  const filteredData = lokasiData.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* ===== CONTENT ===== */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center flex-grow">

        {/* ===== TOMBOL KEMBALI ===== */}
        <div
          className="
            flex items-center gap-2 
            text-green-600 font-medium 
            mb-6 cursor-pointer w-fit
            px-1 py-1
            hover:text-green-700 
            transition-all
            active:scale-95
          "
          onClick={() => window.history.back()}
        >
          <span className="text-md sm:text-2xl text-black">&lt;</span>
          <span className="text-lg sm:text-md font-semibold">Kembali</span>
        </div>


        <h1 className="text-3xl font-bold text-gray-800">
          Lokasi Penyetoran Sampah
        </h1>

        <h2 className="text-green-600 font-semibold mt-1">
          Bank Sampah Kota Surabaya
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Temukan lokasi titik penyetoran sampah terdekat di Surabaya Selatan.
          Setor sampah Anda langsung ke lokasi dengan jadwal operasional yang fleksibel.
        </p>

        {/* Search */}
        <div className="mt-8 flex justify-center">
          <input
            type="text"
            placeholder="Cari lokasi penyetoran sampah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Error / Loading */}
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
        {loading && !error && (
          <p className="mt-4 text-sm text-gray-500">Memuat data lokasi...</p>
        )}

        {/* Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 transition-all"
              >
                {/* Gambar */}
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.nama}
                    className="w-full h-52 object-cover"
                  />
                ) : (
                  <div className="w-full h-52 bg-green-100 flex flex-col items-center justify-center text-green-700 text-sm">
                    <span className="text-2xl mb-1">📷</span>
                    <span>Belum ada gambar</span>
                  </div>
                )}

                <div className="p-5 text-left">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">
                    {item.nama}
                  </h3>

                  <div className="flex gap-2 text-gray-600 text-sm mb-2">
                    <span>📍</span>
                    <p>{item.alamat}</p>
                  </div>

                  <div className="flex gap-2 text-gray-600 text-sm">
                    <span>🕒</span>
                    <p>{item.jam}</p>
                  </div>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <p className="col-span-full text-sm text-gray-500">
                Lokasi tidak ditemukan untuk kata kunci tersebut.
              </p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
