import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

// IMPORT BENAR
import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";

export default function BerandaAdmin() {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const lineInstance = useRef(null);
  const pieInstance = useRef(null);

  const [totalSampah, setTotalSampah] = useState(0);
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);

  useEffect(() => {
    if (lineInstance.current) lineInstance.current.destroy();
    if (pieInstance.current) pieInstance.current.destroy();

    fetch("https://backend-deployment-topaz.vercel.app/api/setor", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const list = json.data || [];

        const total = list.reduce(
          (sum, item) => sum + parseFloat(item.kuantitas || 0),
          0
        );

        setTotalSampah(total);
        setJumlahTransaksi(list.length);
      })
      .catch((err) => console.error("Fetch error:", err));

    // LINE CHART
    lineInstance.current = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
        datasets: [
          {
            label: "Total Setoran",
            data: [2100, 2500, 2000, 2700, 2300, 3000],
            borderWidth: 2,
            tension: 0.4,
            borderColor: "#4CAF50",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    // PIE CHART
    pieInstance.current = new Chart(pieChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Plastik", "Kardus", "Kertas"],
        datasets: [
          {
            data: [55, 25, 20],
            backgroundColor: ["#4CAF50", "#FFD700", "#FF6B6B"],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    return () => {
      if (lineInstance.current) lineInstance.current.destroy();
      if (pieInstance.current) pieInstance.current.destroy();
    };
  }, []);

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex">
      {/* NAVBAR ADMIN */}
      <Navbaradmin />

      {/* CONTENT WRAPPER */}
      <div className="flex-1 lg:ml-64 px-6 pt-10 pb-10">
        {/* HEADER TITLE */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-[23px]">Dashboard Utama</h1>
            <p className="text-gray-600 text-[18px]">
              Performa dan Status Operasional
            </p>
          </div>

          {/* USER INFO */}
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?img=12"
              className="w-10 h-10 rounded-full"
              alt="profile"
            />
            <div>
              <p className="font-semibold text-sm">Indi Ariyanti</p>
              <p className="text-gray-500 text-xs">Admin</p>
            </div>
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* TOTAL SAMPAH */}
          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-sm font-semibold">Total Sampah Terkumpul</p>
            <h2 className="text-2xl font-bold mt-3">
              {totalSampah.toLocaleString()} kg
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Berdasarkan seluruh setoran
            </p>
          </div>

          {/* JUMLAH NASABAH */}
          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-sm font-semibold">Jumlah Nasabah</p>
            <h2 className="text-2xl font-bold mt-3">1.250</h2>
            <p className="text-gray-500 text-sm mt-2">
              Total nasabah terdaftar
            </p>
          </div>

          {/* TOTAL TRANSAKSI */}
          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-sm font-semibold">Total Transaksi Bulan Ini</p>
            <h2 className="text-2xl font-bold mt-3">{jumlahTransaksi}</h2>
            <p className="text-gray-500 text-sm mt-2">
              Total transaksi dari database
            </p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="flex flex-col lg:flex-row gap-6 mt-10">
          {/* LINE CHART */}
          <div className="bg-white shadow rounded-xl p-6 w-full lg:w-[624px]">
            <h2 className="font-semibold mb-4 text-[18px]">
              Tren Setoran Sampah (6 Bulan Terakhir)
            </h2>
            <div style={{ height: "380px" }}>
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-white shadow rounded-xl p-6 w-full lg:w-[347px]">
            <h2 className="font-semibold mb-4 text-[18px]">
              Distribusi Kategori Sampah
            </h2>
            <div
              style={{ width: "288px", height: "288px" }}
              className="mx-auto"
            >
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10">
          <Footeradmin />
        </div>
      </div>
    </div>
  );
}
