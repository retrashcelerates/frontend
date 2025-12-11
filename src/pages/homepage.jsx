// src/pages/homepage.jsx
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import DataImage from "../data";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });

    // cek token di localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleDaftarClick = () => {
    navigate("/login");
  };

  // === DATA KARTU FITUR (dengan onClick masing-masing) ===
  const featureCards = [
    {
      bg: "#E9F7EF",
      iconbg: "#D1F2E1",
      icon: "♻️",
      title: "Transaksi Sampah",
      desc: "Tukar jenis sampah dengan saldo digital.",
      onClick: () => {
        // kalau login ke setorform, kalau belum ke setor
        if (isLoggedIn) {
          navigate("/setorform");
        } else {
          navigate("/setor");
        }
      },
    },
    {
      bg: "#FFF7E6",
      iconbg: "#FFE7B8",
      icon: "📍",
      title: "Titik Setor",
      desc: "Lihat lokasi titik setor terdekat & jadwalnya.",
      onClick: () => navigate("/lokasi"),
    },
    {
      bg: "#EEF5FF",
      iconbg: "#D6E4FF",
      icon: "🗂️",
      title: "Kategori Sampah",
      desc: "Pelajari kategori & harga setiap material.",
      onClick: () => navigate("/daftarharga"),
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section
        id="beranda"
        className="relative h-screen min-h-[650px] overflow-hidden bg-white flex items-center pt-14"
      >
        {/* Dekor kiri */}
        <img
          src={DataImage.Daun1}
          className="absolute bottom-0 left-0 w-[75%] max-w-[550px] pointer-events-none"
          alt="decor"
        />

        {/* Dekor kanan */}
        <img
          src={DataImage.Daun2}
          className="absolute bottom-0 right-0 w-[75%] max-w-[550px] pointer-events-none"
          alt="decor"
        />

        {/* Konten Tengah */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10 px-6 relative z-[2] top-[-100px]">
          <div data-aos="fade-right">
            <h1 className="text-[30px] sm:text-[38px] lg:text-[44px] font-bold leading-tight mb-4">
              Ayo <span className="text-[#60BE75]">Hijaukan</span> dan <br />
              Hidupkan Dunia!
            </h1>

            <p className="text-[#757575] mb-6 text-[16px] sm:text-[18px] max-w-md">
              Dengan ReTrash, setiap botol dan bungkus punya nilai. Setorkan
              sampahmu, kumpulkan poin, dan tukarkan saldo digital langsung di
              akunmu.
            </p>

            {/* TOMBOL HANYA MUNCUL SAAT BELUM LOGIN */}
            {!isLoggedIn && (
              <button
                onClick={handleDaftarClick}
                className="bg-[#222] text-white py-3 px-7 rounded-xl font-semibold hover:bg-[#018E48] transition"
              >
                Daftar Sekarang!
              </button>
            )}
          </div>

          <div className="flex justify-center" data-aos="fade-left">
            <img
              src={DataImage.HeroImage}
              className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[480px] max-w-full"
              alt="Hero"
            />
          </div>
        </div>
      </section>

      {/* SECTION FITUR */}
      <section id="program" className="py-20 bg-white">
        <div
          className="max-w-6xl mx-auto px-6 text-center"
          data-aos="fade-up"
        >
          <div className="inline-block px-5 py-1 text-[#018E48] rounded-full mb-6 text-[28px] sm:text-[32px] lg:text-[36px] font-semibold">
            Fitur Utama
          </div>

          <h2 className="text-[26px] sm:text-[32px] lg:text-[38px] font-semibold leading-snug">
            Fitur Lengkap untuk <br />
            <span className="text-[#60BE75]">Pengelolaan Sampah</span>
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto mt-4 mb-12 text-sm sm:text-base">
            Akses semua layanan kami dalam satu platform yang mudah dan
            terintegrasi.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-[69px]">
            {featureCards.map((card, i) => (
              <div
                key={card.title}
                className="rounded-2xl p-6 text-left hover:shadow-lg transition"
                style={{ background: card.bg }}
                data-aos="zoom-in"
                data-aos-delay={i * 150}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl text-xl mb-4"
                  style={{ background: card.iconbg }}
                >
                  {card.icon}
                </div>

                <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] font-semibold mb-2">
                  {card.title}
                </h3>

                <p className="text-[16px] sm:text-[17px] lg:text-[18px] font-normal text-gray-600 mb-4">
                  {card.desc}
                </p>

                <button
                  onClick={card.onClick}
                  className="text-[16px] sm:text-[17px] lg:text-[18px] font-medium hover:underline"
                >
                  Lihat detail
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION MAP */}
      <section className="py-10 bg-white">
        <div
          className="max-w-6xl mx-auto px-6 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-[26px] sm:text-[32px] lg:text-[40px] font-semibold leading-snug">
            Peta Titik Setor <br />
            <span className="text-[#60BE75]">Bank Sampah</span>
          </h2>

          <p className="text-gray-600 mt-4 mb-4 text-[16px] sm:text-[18px] font-medium text-center sm:whitespace-nowrap">
            "Jangkauan bank sampah luas, menjadikan sampah lebih bernilai."
          </p>

          <p className="text-[#60BE75] text-[16px] sm:text-[18px] font-medium text-center mb-4">
            Surabaya, Jawa Timur, Indonesia
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[16px] sm:text-[18px] text-gray-700">
            {/* Telepon 1 */}
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-[#60BE75]" />
              <span>(123) 456-78-90</span>
            </div>

            {/* Telepon 2 */}
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-[#60BE75]" />
              <span>(123) 456-78-90</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-envelope text-[#60BE75]" />
              <span>Retrash@website.com</span>
            </div>
          </div>

          {/* MAP IMAGE – klik menuju /lokasi */}
          <img
            src={DataImage.MapImage}
            alt="Map"
            onClick={() => navigate("/lokasi")}
            className="mx-auto rounded-xl w-full max-w-[1131.7px] h-auto object-cover mt-4 mb- cursor-pointer"
          />
        </div>
      </section>
    </>
  );
}

export default Homepage;
