import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Daftarharga = () => {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  // INIT AOS
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // FETCH PRODUK
  useEffect(() => {
    fetch("https://backend-deployment-topaz.vercel.app/api/produk")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setProduk(data.data);
        } else {
          console.error("Format API salah:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch produk:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="bg-[#F8F9FB] pt-24 pb-32">
        {/* TITLE */}
        <section
          className="text-center max-w-4xl mx-auto px-6"
          data-aos="fade-down"
        >
          <div
            className="w-14 h-14 flex items-center justify-center bg-[#E9F7EF] text-[#018E48] rounded-full mx-auto mb-4"
            data-aos="zoom-in"
          >
            ♻️
          </div>

          <h1 className="text-4xl font-bold mb-2" data-aos="fade-up">
            Jenis Sampah & Harga
          </h1>
          <p className="text-gray-600" data-aos="fade-up" data-aos-delay="150">
            Panduan lengkap jenis sampah yang diterima beserta syarat
            penerimaannya
          </p>

          <div
            className="bg-blue-50 border border-blue-200 text-blue-600 p-4 rounded-xl mt-8 text-sm text-left"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <p className="font-semibold">ℹ️ Informasi Harga</p>
            <p>
              Harga sampah dapat berubah sewaktu-waktu tergantung kondisi pasar.
              Harga yang tertera adalah harga sementara. Untuk info terbaru,
              hubungi koordinator bank sampah.
            </p>
          </div>
        </section>

        {/* LIST CARD PRODUK - DYNAMIC */}
        <section className="max-w-7xl mx-auto px-6 mt-14 grid md:grid-cols-2 gap-8">
          {loading ? (
            <p className="text-center col-span-2 text-gray-500 text-lg">
              Loading data...
            </p>
          ) : (
            produk.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow p-5"
                data-aos="fade-up"
                data-aos-delay={100 * idx}
              >
                <div className="flex justify-between mb-3">
                  <h3 className="text-xl font-semibold">{item.nama_produk}</h3>
                  <span className="text-green-600 text-sm">⬆️ Harga</span>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  Rp {item.harga} per kg
                </p>

                {/* GAMBAR FROM BACKEND */}
                <img
                  src={item.image_url}
                  className="rounded-xl w-full h-40 object-cover mb-4"
                  alt={item.nama_produk}
                />

                <p className="text-sm font-semibold mb-1">Deskripsi:</p>
                <p className="text-sm bg-gray-100 p-2 rounded-lg mb-4">
                  {item.deskripsi}
                </p>

                <p className="text-sm font-semibold mb-1">Jenis:</p>
                <p className="text-sm bg-gray-100 p-2 rounded-lg">
                  {item.jenis}
                </p>
              </div>
            ))
          )}
        </section>

        {/* INFO 3 BOX */}
        <section className="max-w-5xl mx-auto px-6 mt-20 grid md:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: "♻️",
              title: "Sortir Dahulu",
              desc: "Pisahkan sampah berdasarkan jenisnya untuk harga terbaik.",
            },
            {
              icon: "💲",
              title: "Harga Berubah",
              desc: "Harga dapat berubah mengikuti kondisi pasar.",
            },
            {
              icon: "✨",
              title: "Kondisi Bersih",
              desc: "Pastikan sampah bersih agar diterima maksimal.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow"
              data-aos="zoom-in"
              data-aos-delay={i * 150}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-semibold mb-2">{item.title}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default Daftarharga;
