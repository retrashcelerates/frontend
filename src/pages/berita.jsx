import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const API_URL = "https://backend-deployment-topaz.vercel.app/api/berita";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Init AOS
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  // Fetch berita
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setNews(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-22 min-h-screen bg-[#FFFFFF] pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title */}
        <h1
          className="text-center text-3xl md:text-4xl font-bold mb-10"
          data-aos="fade-down"
        >
          Berita <span className="text-green-600">ReTrash</span>
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600" data-aos="fade-in">
            Memuat berita...
          </p>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {!loading && news.filter(n => n.status === "published").length === 0 && (
            <p className="col-span-full text-center text-gray-500" data-aos="fade-up">
              Belum ada berita.
            </p>
          )}

          {news
            .filter((item) => item.status === "published")
            .map((item, index) => (
              <Link
                key={item.id}
                to={`/berita/${item.id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-4 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}   // animasi bertahap
              >

                {/* Gambar */}
                <img
                  src={item.image_url}
                  alt={item.judul}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                  data-aos="zoom-in"
                  data-aos-delay="80"
                />

                {/* Tanggal */}
                <p className="text-[11px] text-gray-500">
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {/* Judul */}
                <h3 className="font-semibold text-[15px] mt-1">
                  {item.judul}
                </h3>

                {/* Konten preview */}
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {item.konten}
                </p>

                <span className="text-black text-sm font-medium mt-3 inline-block hover:underline">
                  Lebih lanjut
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default News;
