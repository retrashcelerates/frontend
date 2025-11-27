import DataImage from "./data";

function App() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section
        id="beranda"
        className="pt-10 grid md:grid-cols-2 items-center gap-10 relative overflow-hidden"
      >
        <div className="z-10">
          <h1 className="text-[42px] font-bold leading-tight mb-4">
            Ayo <span className="text-[#60BE75]">Hijaukan</span> dan <br />
            Hidupkan Dunia!
          </h1>

          <p className="text-gray-700 mb-6">
            Dengan ReTrash, setiap botol dan bungkus punya nilai.
            <br />
            Setorkan sampahmu, kumpulkan poin, dan tukarkan menjadi <br />
            saldo digital langsung ke akunmu.
          </p>

          <button className="bg-[#222] text-white py-3 px-8 rounded-2xl font-semibold hover:bg-[#018E48] transition">
            Setor Sekarang!
          </button>
        </div>

        <div className="flex justify-center z-10">
          <img
            src={DataImage.HeroImage}
            className="w-[420px] md:w-[500px]"
            alt="Hero"
          />
        </div>
      </section>

      {/* ================= FITUR UTAMA ================= */}
      <section id="program" className="py-24 text-center">
        <div className="text-lg inline-block px-5 py-1 border border-[#018E48] text-[#018E48] rounded-full mb-6">
          Fitur Utama
        </div>

        <h2 className="text-[36px] font-semibold leading-snug">
          Fitur Lengkap untuk <br />
          <span className="text-[#60BE75]">Pengelolaan Sampah</span>
        </h2>

        <p className="text-gray-500 max-w-xl mx-auto mt-4 mb-12">
          Akses semua layanan kami dalam satu platform terpadu.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
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
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl text-xl mb-4"
                style={{ background: card.iconbg }}
              >
                {card.icon}
              </div>

              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.desc}</p>
              <button className="text-sm font-semibold hover:underline">
                Lihat detail
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TENTANG ================= */}
      <section id="tentang" className="py-24 bg-[#F8F9FB]">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img
              src={DataImage.TentangImage}
              className="rounded-2xl w-full object-cover"
              alt=""
            />

            <div className="absolute bottom-6 left-6 bg-white shadow-lg p-4 rounded-xl max-w-[250px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  📞
                </div>
                <div>
                  <p className="text-sm font-semibold">Rakadira Pangestu</p>
                  <p className="text-xs text-gray-500">Project Manager</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                "Kami percaya perubahan besar dimulai dari aksi kecil."
              </p>
            </div>
          </div>

          <div>
            <div className="text-lg inline-block px-4 py-1 border border-[#018E48] text-[#018E48] rounded-full mb-4">
              Tentang Kami
            </div>

            <h2 className="text-3xl font-bold mb-6 leading-snug">
              Berawal dari Ide,
              <br /> Menjadi Aksi Nyata
            </h2>

            <div className="space-y-4">
              {[
                [
                  "Apa Itu ReTrash?",
                  "Platform digital untuk pengelolaan sampah cerdas.",
                ],
                [
                  "Cara Tukar Sampah Jadi Saldo?",
                  "Kumpulkan poin dari setiap setoran.",
                ],
                [
                  "Apa Manfaat ReTrash?",
                  "Mengelola sampah jadi lebih mudah dan digital.",
                ],
              ].map(([t, d], i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
                >
                  <h4 className="font-semibold mb-1">{t}</h4>
                  <p className="text-sm text-gray-600">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PETA ================= */}
      <section id="" className="py-24 text-center">
        <h2 className="text-[36px] font-semibold leading-snug">
          Peta Titik Setor <br />
          <span className="text-[#60BE75]">Bank Sampah</span>
        </h2>

        <p className="text-gray-600 mt-4 mb-8 text-sm">
          "Jangkauan bank sampah luas, menjadikan sampah lebih bernilai."
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 text-gray-700">
          <div className="flex items-center gap-2">📍 Surabaya, Indonesia</div>
          <div className="flex items-center gap-2">📞 (123) 456-78-90</div>
          <div className="flex items-center gap-2">✉️ Retrash@website.com</div>
        </div>

        <img
          src={DataImage.MapImage}
          className="w-full max-w-4xl mx-auto rounded-xl"
          alt=""
        />
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0FA958] text-white w-full mt-20 py-12">
        <div className="w-full grid md:grid-cols-2 gap-10 px-10">
          {/* KIRI */}
          <div>
            <h3 className="text-xl font-semibold mb-3">ReTrash</h3>
            <p className="text-sm leading-relaxed opacity-90">
              Retrash adalah platform pengelolaan sampah modern yang membantu
              masyarakat memilah, mengumpulkan, dan menukar ulang sampah dengan
              cara yang lebih praktis dan berkelanjutan.
            </p>
          </div>

          {/* KANAN */}
          <div className="md:text-right">
            <h3 className="text-xl font-semibold mb-3">Sosial Media</h3>

            <div className="flex md:justify-end gap-4 mt-4">
              {/* FB */}
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#0FA958] hover:bg-gray-100 transition"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>

              {/* IG */}
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#0FA958] hover:bg-gray-100 transition"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>

              {/* X */}
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#0FA958] hover:bg-gray-100 transition"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
