import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import DataImage from "../data";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

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

            <p className="text-gray-700 mb-6 text-sm sm:text-base max-w-md">
              Dengan ReTrash, setiap botol dan bungkus punya nilai. Setorkan
              sampahmu, kumpulkan poin, dan tukarkan saldo digital langsung di
              akunmu.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="bg-[#222] text-white py-3 px-7 rounded-xl font-semibold hover:bg-[#018E48] transition"
            >
              Daftar Sekarang!
            </button>
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
      <section id="program" className="py-20">
        <div
          className="max-w-6xl mx-auto px-6 text-center"
          data-aos="fade-up"
        >
          <div className="text-sm inline-block px-5 py-1 border border-[#018E48] text-[#018E48] rounded-full mb-6">
            Fitur Utama
          </div>

          <h2 className="text-[26px] sm:text-[32px] lg:text-[38px] font-semibold leading-snug">
            Fitur Lengkap untuk <br />
            <span className="text-[#60BE75]">Pengelolaan Sampah</span>
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto mt-4 mb-12 text-sm sm:text-base">
            Akses semua layanan kami dalam satu platform terpadu.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                bg: "#E9F7EF",
                iconbg: "#D1F2E1",
                icon: "♻️",
                title: "Transaksi Sampah",
                desc: "Tukar jenis sampah dengan saldo digital.",
              },
              {
                bg: "#FFF7E6",
                iconbg: "#FFE7B8",
                icon: "📍",
                title: "Titik Setor",
                desc: "Lihat lokasi titik setor terdekat & jadwalnya.",
              },
              {
                bg: "#EEF5FF",
                iconbg: "#D6E4FF",
                icon: "🗂️",
                title: "Kategori Sampah",
                desc: "Pelajari kategori & harga setiap material.",
              },
            ].map((card, i) => (
              <div
                key={i}
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

                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{card.desc}</p>
                <button className="text-sm font-semibold hover:underline">
                  Lihat detail
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION TENTANG */}
      <section id="tentang" className="py-24 bg-[#F8F9FB]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          
          <div className="relative" data-aos="fade-right">
            <img
              src={DataImage.TentangImage}
              className="rounded-2xl w-full object-cover max-h-[450px]"
              alt=""
            />

            <div className="absolute bottom-5 left-5 bg-white shadow-lg p-4 rounded-xl max-w-[220px]">
              <p className="text-sm font-semibold">Rakadira Pangestu</p>
              <p className="text-xs text-gray-500">Project Manager</p>
            </div>
          </div>

          <div data-aos="fade-left">
            <div className="text-sm inline-block px-4 py-1 border border-[#018E48] text-[#018E48] rounded-full mb-4">
              Tentang Kami
            </div>

            <h2 className="text-3xl font-bold mb-6 leading-snug max-w-md">
              Berawal dari Ide, <br /> Menjadi Aksi Nyata
            </h2>

            <div className="space-y-4">
              {[
                "Apa Itu ReTrash?",
                "Cara Tukar Sampah Jadi Saldo?",
                "Apa Manfaat ReTrash?",
              ].map((title, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-xl shadow"
                  data-aos="fade-up"
                  data-aos-delay={i * 150}
                >
                  <h4 className="font-semibold mb-1">{title}</h4>
                  <p className="text-sm text-gray-600">Keterangan informasi.</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION MAP */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center" data-aos="fade-up">

          <h2 className="text-[26px] sm:text-[32px] lg:text-[38px] font-semibold leading-snug">
            Peta Titik Setor <br />
            <span className="text-[#60BE75]">Bank Sampah</span>
          </h2>

          <p className="text-gray-600 mt-4 mb-8 text-sm sm:text-base max-w-md mx-auto">
            "Jangkauan bank sampah luas, menjadikan sampah lebih bernilai."
          </p>

          <img
            src={DataImage.MapImage}
            className="w-full max-w-3xl mx-auto rounded-xl"
            alt="Map"
          />

        </div>
      </section>
    </>
  );
}

export default Homepage;
