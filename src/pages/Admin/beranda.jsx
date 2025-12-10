import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

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
    // Fetch data setoran
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
      .catch(() => {});

    // Cleanup chart instance (React StrictMode)
    if (lineInstance.current) lineInstance.current.destroy();
    if (pieInstance.current) pieInstance.current.destroy();

    // Init Line Chart
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

    // Init Pie Chart
    // Init Pie Chart
    if (pieInstance.current) pieInstance.current.destroy();

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
      options: {
        responsive: true,
        maintainAspectRatio: false,

        // Membuat donut lebih proporsional dan center
        cutout: "50%",
        layout: { padding: 0 },

        plugins: {
          legend: {
            position: "bottom", // legend di bawah
            align: "center", // rata tengah
            labels: {
              usePointStyle: true,
              pointStyle: "circle", // bulat seperti gambar contoh
              padding: 15,
              boxWidth: 12,
            },
          },
        },
      },
    });

    return () => {
      if (lineInstance.current) lineInstance.current.destroy();
      if (pieInstance.current) pieInstance.current.destroy();
    };
  }, []);

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Navbaradmin />

        {/* Content */}
        <div className="flex-1 lg:ml-64 px-6 pt-[84px] pb-[160px]">
          {/* Header */}
          <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#F7F7F7] border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.18)]">
            <div className="h-16 flex items-center justify-between px-6">
              <div>
                <h1 className="font-semibold text-[23px]">Dashboard Utama</h1>
                <p className="text-gray-600 text-[15px]">
                  Performa dan Status Operasional
                </p>
              </div>

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
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
            <div className="bg-white shadow rounded-xl p-5">
              <p className="text-sm font-semibold">Total Sampah Terkumpul</p>
              <h2 className="text-2xl font-bold mt-3">
                {totalSampah.toLocaleString()} kg
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Berdasarkan seluruh setoran
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              <p className="text-sm font-semibold">Jumlah Nasabah</p>
              <h2 className="text-2xl font-bold mt-3">1.250</h2>
              <p className="text-gray-500 text-sm mt-2">
                Total nasabah terdaftar
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              <p className="text-sm font-semibold">Total Transaksi Bulan Ini</p>
              <h2 className="text-2xl font-bold mt-3">{jumlahTransaksi}</h2>
              <p className="text-gray-500 text-sm mt-2">
                Total transaksi dari database
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="flex flex-col lg:flex-row gap-6 mt-10">
            <div className="bg-white shadow rounded-xl p-6 w-full lg:w-[624px]">
              <h2 className="font-semibold mb-4 text-[18px]">
                Tren Setoran Sampah (6 Bulan Terakhir)
              </h2>
              <div style={{ height: "380px" }}>
                <canvas ref={lineChartRef}></canvas>
              </div>
            </div>

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

          <br />
        </div>
      </div>

      {/* FOOTER FIXED – SAMPING NAVBAR SAJA */}
      <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <Footeradmin />
      </div>
    </div>
  );
}
