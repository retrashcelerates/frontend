import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const API_URL = "https://backend-deployment-topaz.vercel.app/api/berita";

const BeritaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Init AOS ketika halaman detail dibuka
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    });

    axios
      .get(`${API_URL}/${id}`)
      .then((res) => {
        setBerita(res.data.data);
        setLoading(false);
        setTimeout(() => AOS.refresh(), 100); // refresh animasi setelah data masuk
      })
      .catch((err) => {
        console.error("Error fetching detail:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center text-gray-500">
        Memuat berita...
      </div>
    );

  if (!berita)
    return (
      <div className="h-screen flex justify-center items-center text-red-500">
        Berita tidak ditemukan.
      </div>
    );

  return (
    <div className="pt-22 pb-16 bg-white px-4 flex justify-center">
      <div className="w-full max-w-5xl">

        {/* WRAPPER TITLE + BACK */}
        <div className="mb-8 pt-2" data-aos="fade-down">
          <div className="flex items-start justify-center relative">

            {/* Tombol Back */}
            <button
              onClick={() => navigate(-1)}
              className="
                flex items-center gap-2 group cursor-pointer
                absolute left-0 top-0
                max-sm:static max-sm:mb-3
              "
            >
              <span className="text-[26px] max-sm:text-[20px] text-black leading-none">&lt;</span>

              <span className="
                text-[20px] max-sm:text-[16px]
                text-green-600 font-semibold
                group-hover:text-gray-900 transition
              ">
                Back
              </span>
            </button>

            <div className="w-[110px] max-sm:hidden"></div>

            {/* Judul */}
            <h1
              className="
                text-[22px] sm:text-[32px] font-bold leading-snug text-center
                break-words max-w-[850px] px-6
              "
            >
              {berita.judul}
            </h1>

            <div className="w-[110px] max-sm:hidden"></div>
          </div>
        </div>

        {/* Card Gambar */}
        <div
          className="bg-white shadow-md rounded-2xl p-5 mb-5"
          data-aos="zoom-in"
        >
          <div className="w-full aspect-[10/4] rounded-xl overflow-hidden">
            <img
              src={berita.image_url}
              alt={berita.judul}
              className="w-full h-full rounded-xl object-cover object-center"
            />
          </div>

          <p className="text-xs text-gray-500 mt-2 text-left pr-1">
            {new Date(berita.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Konten */}
        <div
          className="text-gray-700 text-[14px] text-justify leading-[1.45] space-y-3"
          data-aos="fade-up"
        >
          {berita.konten?.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeritaDetail;
