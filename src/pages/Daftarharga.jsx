import React from "react";
import DataImage from "../data";

function Daftarharga() {
  return (
    <div className="bg-[#F8F9FB] pt-24 pb-32">
      {/* TITLE */}
      <section className="text-center max-w-4xl mx-auto px-6">
        <div className="w-14 h-14 flex items-center justify-center bg-[#E9F7EF] text-[#018E48] rounded-full mx-auto mb-4">
          ♻️
        </div>

        <h1 className="text-4xl font-bold mb-2">Jenis Sampah & Harga</h1>
        <p className="text-gray-600">
          Panduan lengkap jenis sampah yang diterima beserta syarat
          penerimaannya
        </p>

        <div className="bg-blue-50 border border-blue-200 text-blue-600 p-4 rounded-xl mt-8 text-sm text-left">
          <p className="font-semibold">ℹ️ Informasi Harga</p>
          <p>
            Harga sampah dapat berubah sewaktu-waktu tergantung kondisi pasar.
            Harga yang tertera adalah per tanggal 7 November 2025. Untuk
            informasi harga terbaru, silakan hubungi koordinator bank sampah.
          </p>
        </div>
      </section>

      {/* CARD LIST */}
      <section className="max-w-7xl mx-auto px-6 mt-14 grid md:grid-cols-2 gap-8">
        {/* BOTOL PLASTIK */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between mb-3">
            <h3 className="text-xl font-semibold">Botol Plastik</h3>
            <span className="text-green-600 text-sm">⬆️ Tinggi</span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            PET/PETE • Rp 3,000 per kg
          </p>
          <img
            src="/assets/botol.jpg"
            className="rounded-xl w-full h-40 object-cover mb-4"
          />

          <p className="text-sm font-semibold mb-1">Contoh:</p>
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            {[
              "Botol Aqua",
              "Botol Sprite",
              "Botol Coca Cola",
              "Botol Teh Botol",
            ].map((x) => (
              <span key={x} className="bg-gray-100 px-3 py-1 rounded-full">
                {x}
              </span>
            ))}
          </div>

          <p className="text-sm font-semibold mb-1">Syarat Penerimaan:</p>
          <p className="text-sm bg-gray-100 p-2 rounded-lg">
            Bersih, tidak ada label, tutup botol dipisah
          </p>
        </div>

        {/* KANTONG PLASTIK */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between mb-3">
            <h3 className="text-xl font-semibold">Kantong Plastik</h3>
            <span className="text-yellow-500 text-sm">⬆️ Sedang</span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            HDPE/LDPE • Rp 2,500 per kg
          </p>
          <img
            src="/assets/kantong.jpg"
            className="rounded-xl w-full h-40 object-cover mb-4"
          />

          <p className="text-sm font-semibold mb-1">Contoh:</p>
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            {[
              "Plastik kemasan",
              "Kantong kresek",
              "Botol Coca Cola",
              "Botol Teh Botol",
            ].map((x) => (
              <span key={x} className="bg-gray-100 px-3 py-1 rounded-full">
                {x}
              </span>
            ))}
          </div>

          <p className="text-sm font-semibold mb-1">Syarat Penerimaan:</p>
          <p className="text-sm bg-gray-100 p-2 rounded-lg">
            Bersih, tidak ada label, tutup botol dipisah
          </p>
        </div>

        {/* GELAS PLASTIK */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between mb-3">
            <h3 className="text-xl font-semibold">Gelas Plastik</h3>
            <span className="text-green-600 text-sm">⬆️ Tinggi</span>
          </div>

          <p className="text-sm text-gray-500 mb-2">PP/PS • Rp 2,000 per kg</p>
          <img
            src="/assets/gelas.jpg"
            className="rounded-xl w-full h-40 object-cover mb-4"
          />

          <p className="text-sm font-semibold mb-1">Contoh:</p>
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            {[
              "Gelas air mineral",
              "Cup ice cream",
              "Wadah Makanan",
              "Gelas kopi plastik",
            ].map((x) => (
              <span key={x} className="bg-gray-100 px-3 py-1 rounded-full">
                {x}
              </span>
            ))}
          </div>

          <p className="text-sm font-semibold mb-1">Syarat Penerimaan:</p>
          <p className="text-sm bg-gray-100 p-2 rounded-lg">
            Bersih dari sisa makanan dan minuman
          </p>
        </div>

        {/* KERTAS & KARDUS */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between mb-3">
            <h3 className="text-xl font-semibold">Kardus & Kertas</h3>
            <span className="text-green-600 text-sm">⬆️ Tinggi</span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            PET/PETE • Rp 1,500 per kg
          </p>
          <img
            src="/assets/kertas.jpg"
            className="rounded-xl w-full h-40 object-cover mb-4"
          />

          <p className="text-sm font-semibold mb-1">Contoh:</p>
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            {["Kardus kemasan", "Kertas koran", "Kertas HVS", "Majalah"].map(
              (x) => (
                <span key={x} className="bg-gray-100 px-3 py-1 rounded-full">
                  {x}
                </span>
              )
            )}
          </div>

          <p className="text-sm font-semibold mb-1">Syarat Penerimaan:</p>
          <p className="text-sm bg-gray-100 p-2 rounded-lg">
            Kering, tidak basah atau lembab
          </p>
        </div>
      </section>

      {/* 3 KOTAK INFORMASI */}
      <section className="max-w-5xl mx-auto px-6 mt-20 grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-3xl mb-2">♻️</div>
          <p className="font-semibold mb-2">Sortir Dahulu</p>
          <p className="text-sm text-gray-600">
            Pisahkan sampah berdasarkan jenisnya untuk mendapatkan harga terbaik
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-3xl mb-2">💲</div>
          <p className="font-semibold mb-2">Harga Berubah</p>
          <p className="text-sm text-gray-600">
            Harga dapat berubah tergantung kondisi pasar
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-3xl mb-2">✨</div>
          <p className="font-semibold mb-2">Kondisi Bersih</p>
          <p className="text-sm text-gray-600">
            Pastikan sampah bersih untuk diterima dengan harga maksimal
          </p>
        </div>
      </section>
    </div>
  );
}

export default Daftarharga;
