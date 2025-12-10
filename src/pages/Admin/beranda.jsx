import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function BerandaAdmin() {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const lineInstance = useRef(null);
  const pieInstance = useRef(null);

  const [totalSampah, setTotalSampah] = useState(0);
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);
  const [jumlahNasabah, setJumlahNasabah] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (lineInstance.current) lineInstance.current.destroy();
    if (pieInstance.current) pieInstance.current.destroy();

    const fetchData = async () => {
      try {
        // === FETCH SETOR, USERS, PRODUK SEKALIGUS ===
        const [setorRes, usersRes, produkRes] = await Promise.all([
          fetch(`${API_BASE_URL}/setor`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/produk`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const setorJson = await setorRes.json();
        const usersJson = await usersRes.json();
        const produkJson = await produkRes.json();

        const setorList = setorJson.data || [];
        const userList = usersJson.data || [];
        const produkList = produkJson.data || [];

        // === TOTAL SAMPAH ===
        setTotalSampah(
          setorList.reduce(
            (sum, item) => sum + parseFloat(item.kuantitas || 0),
            0
          )
        );

        // === JUMLAH TRANSAKSI ===
        setJumlahTransaksi(setorList.length);

        // === JUMLAH NASABAH ROLE "user" ===
        setJumlahNasabah(userList.filter((u) => u.role === "user").length);

        // ======================================
        // === LINE CHART (6 bulan terakhir) ====
        // ======================================
        const now = new Date();
        const indoMonth = [
          "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
          "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
        ];

        const monthSlots = [];
        const monthMap = {};

        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          const label = `${indoMonth[d.getMonth()]} ${String(
            d.getFullYear()
          ).slice(-2)}`;
          monthSlots.push({ key, label });
          monthMap[key] = 0;
        }

        setorList.forEach((item) => {
          const t = item.tanggal_setor || item.created_at;
          const d = new Date(t);
          if (isNaN(d.getTime())) return;
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (monthMap[key] !== undefined) {
            monthMap[key] += Number(item.kuantitas || 0);
          }
        });

        const lineLabels = monthSlots.map((m) => m.label);
        const lineValues = monthSlots.map((m) => monthMap[m.key]);

        if (lineChartRef.current) {
          lineInstance.current = new Chart(lineChartRef.current, {
            type: "line",
            data: {
              labels: lineLabels,
              datasets: [
                {
                  label: "Total Setoran (kg)",
                  data: lineValues,
                  borderColor: "#4CAF50",
                  tension: 0.4,
                  borderWidth: 2,
                  fill: false,
                },
              ],
            },
            options: { responsive: true, maintainAspectRatio: false },
          });
        }

        // ================================================
        // === PIE CHART DISTRIBUSI PRODUK (NAMA PRODUK)
        // ================================================
        const namaProdukMap = {};
        produkList.forEach((p) => {
          namaProdukMap[p.id] = p.nama_produk;
        });

        const productMap = {};
        setorList.forEach((item) => {
          const pid = item.product_id;
          const nama = namaProdukMap[pid] || `Produk ${pid}`;
          const qty = Number(item.kuantitas || 0);
          productMap[nama] = (productMap[nama] || 0) + qty;
        });

        const pieLabels = Object.keys(productMap);
        const pieData = Object.values(productMap);

        const colors = [
          "#4CAF50",
          "#FFD700",
          "#FF6B6B",
          "#42A5F5",
          "#AB47BC",
          "#FF7043",
        ];

        if (pieChartRef.current) {
          pieInstance.current = new Chart(pieChartRef.current, {
            type: "doughnut",
            data: {
              labels: pieLabels,
              datasets: [
                {
                  data: pieData,
                  backgroundColor: pieLabels.map(
                    (_, i) => colors[i % colors.length]
                  ),
                },
              ],
            },
            options: {
              cutout: "50%",
              responsive: true,
              maintainAspectRatio: false,
              layout: { padding: { bottom: 35 } }, // LEGEND JAUH KE BAWAH
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 18,
                  },
                },
              },
            },
          });
        }
      } catch (err) {
        console.log("Error load dashboard:", err);
      }
    };

    fetchData();

    return () => {
      if (lineInstance.current) lineInstance.current.destroy();
      if (pieInstance.current) pieInstance.current.destroy();
    };
  }, []);

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Navbaradmin />

        {/* CONTENT */}
        <div className="flex-1 lg:ml-64 px-6 pt-[84px] pb-[160px]">

          {/* ==================== HEADER ADMIN (ASLI, DIKEMBALIKAN) ==================== */}
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

          {/* ================= INFO CARD ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

            <div className="bg-white shadow rounded-xl p-5">
              <p className="text-sm font-semibold">Total Sampah Terkumpul</p>
              <h2 className="text-2xl font-bold mt-3">{totalSampah} kg</h2>
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              <p className="text-sm font-semibold">Jumlah Nasabah</p>
              <h2 className="text-2xl font-bold mt-3">{jumlahNasabah}</h2>
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              <p className="text-sm font-semibold">Total Transaksi</p>
              <h2 className="text-2xl font-bold mt-3">{jumlahTransaksi}</h2>
            </div>

          </div>

          {/* ================= CHART BAGIAN ================= */}
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

            {/* DONUT CHART */}
            <div className="bg-white shadow rounded-xl p-6 w-full lg:w-[347px]">
              <h2 className="font-semibold mb-4 text-[18px]">
                Distribusi Kategori Sampah
              </h2>
              <div
                style={{ width: "288px", height: "288px" }}
                className="mx-auto mt-4"
              >
                <canvas ref={pieChartRef}></canvas>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <Footeradmin />
      </div>
    </div>
  );
}
