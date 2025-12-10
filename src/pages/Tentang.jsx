import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import TentangImage from "/assets/tentang/tentang.png";

const Tentang = () => {
  const [active, setActive] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const data = [
    {
      title: "Apa Itu ReTrash?",
      desc: "ReTrash adalah platform bank sampah digital yang hadir untuk membantu masyarakat mengelola sampah secara lebih mudah, modern, dan bernilai ekonomi. Kami percaya bahwa setiap sampah yang dikelola dengan benar dapat menjadi sumber manfaat — baik untuk lingkungan maupun untuk kesejahteraan masyarakat.",
    },
    {
      title: "Cara Tukar Sampah Jadi Saldo?",
      desc: "Di ReTrash, menukar sampah menjadi saldo sangat mudah. Kami menyediakan proses yang cepat, transparan, dan ramah pengguna agar setiap sampah yang Anda setorkan dapat langsung menghasilkan.",
    },
    {
      title: "Apa Manfaat ReTrash?",
      desc: "ReTrash memberikan berbagai manfaat bagi pengguna maupun lingkungan. Dengan sistem yang modern dan berbasis teknologi, setiap orang dapat mengelola sampah dengan lebih mudah, efisien, dan bernilai.",
    },
  ];

  return (
    <section className="pt-28 pb-20 bg-gray-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
        {/* GAMBAR */}
        <div className="relative" data-aos="fade-right">
          <img
            src={TentangImage}
            className="rounded-2xl w-full object-cover max-h-[450px]"
            alt="Tentang"
          />

          <div
            className="absolute bottom-5 left-5 bg-white shadow-lg p-4 rounded-xl max-w-[220px]"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <p className="text-sm font-semibold">Rakadira Pangestu</p>
            <p className="text-xs text-gray-500">Project Manager</p>
            <p className="text-xs italic mt-2 text-gray-600">
              “Kami percaya perubahan besar dimulai dari aksi kecil.”
            </p>
          </div>
        </div>

        {/* TEKS + ACCORDION */}
        <div data-aos="fade-left">
          <div className="inline-block py-1 text-[28px] sm:text-[32px] lg:text-[36px] text-[#018E48] rounded-full mb-4 font-semibold">
            Tentang Kami
          </div>

          <h2 className="text-3xl font-bold mb-6 leading-snug max-w-md">
            Berawal dari Ide, <br /> Menjadi Aksi Nyata
          </h2>

          <div className="space-y-4">
            {data.map((item, i) => {
              const isOpen = active === i;

              return (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-4"
                  data-aos="fade-up"
                  data-aos-delay={i * 150}
                >
                  {/* HEADER */}
                  <button
                    onClick={() => setActive(isOpen ? null : i)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <h4 className="font-semibold">{item.title}</h4>

                    {/* ICON PUTAR */}
                    <div
                      className={`w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full text-xs transform transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </div>
                  </button>

                  {/* DROPDOWN ANIMASI */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 mt-3"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tentang;
