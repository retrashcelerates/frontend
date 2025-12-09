import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import FormSetor from "../components/Formsetor";
import Navbarprofil from "../components/Navbarprofile";

import DataImage from "../data";

export default function Setor() {
  const navigate = useNavigate(); 

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="w-full px-4 md:px-0">
      <div className="max-w-6xl mx-auto">

        <div className="relative w-full h-[400px] md:h-[500px] rounded-md overflow-hidden">

          <img
            src={DataImage.setorImage}
            className="w-full h-full object-center scale-100"
            alt="Setor Sampah"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green"></div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white space-y-3">

            <h3
              className="text-sm md:text-base font-medium opacity-90"
              data-aos="fade-right"
              data-aos-delay="0"
            >
              Pay for Retrash
            </h3>

            <h1
              className="text-4xl md:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-delay="150"
            >
              Setor
            </h1>

            <div
              className="mt-2"
              data-aos="fade-right"
              data-aos-delay="300"
            >
              <p className="font-medium mb-2">Manfaat Program Manivest:</p>
              <ul className="list-disc list-inside text-sm md:text-base space-y-1">
                <li>Mendorong masyarakat untuk lebih peduli terhadap pemilahan sampah.</li>
                <li>Meningkatkan kesadaran program daur ulang sampah.</li>
              </ul>
            </div>

          </div>
        </div>

        <div
          className="mt-6 md:mt-8 text-gray-700 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <p className="max-w-6xl text-justify">
            Program ini mengharuskan nasabah untuk membayar sejumlah biaya untuk pengangkutan dan 
            pemilahan sampah yang belum dipilah dengan baik. Jika nasabah tidak memilah sampahnya 
            secara terpisah (misalnya sampah organik dan anorganik tercampur), Bank Sampah akan 
            mengeluarkan biaya tambahan untuk proses pemilahan yang dilakukan oleh petugas. Program 
            ini bertujuan untuk memberi insentif kepada masyarakat agar lebih disiplin dalam 
            memilah sampah mereka sebelum diserahkan ke Bank Sampah.
          </p>
        </div>

        <FormSetor />

      </div>
    </div>
  );
}
