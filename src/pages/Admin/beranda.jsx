// src/pages/Admin/beranda.jsx
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

  // ====== STATE PROFILE ADMIN & AVATAR ======
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  // URL AVATAR: kalau belum ada, pakai ui-avatars background hijau
  const avatarUrl =
    currentUser?.avatar_url ||
    (currentUser?.username
      ? `https://ui-avatars.com/api/?name=${currentUser.username}&background=60BE75&color=ffffff&bold=true`
      : "https://ui-avatars.com/api/?name=User&background=60BE75&color=ffffff&bold=true");

  // ====== FETCH PROFIL ADMIN ======
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (res.ok) {
        setCurrentUser(json.data || null);
      } else {
        console.error("Gagal mengambil profil:", json);
      }
    } catch (err) {
      console.error("Error mengambil profil:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // ====== HANDLE KLIK AVATAR → BUKA FILE PICKER ======
  const handleAvatarClick = () => {
    if (uploadingAvatar) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ====== UPLOAD AVATAR BARU ======
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");

    if (!file.type.startsWith("image/")) {
      setAvatarError("File harus berupa gambar (jpg, png, dll).");
      return;
    }

    try {
      setUploadingAvatar(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setAvatarError("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const formData = new FormData();
      // sesuaikan nama field dengan backend
      formData.append("avatar", file);

      const res = await fetch(`${API_BASE_URL}/auth/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal upload avatar:", json);
        setAvatarError(json.message || "Gagal mengunggah avatar.");
        return;
      }

      if (json.data?.avatar_url) {
        setCurrentUser((prev) =>
          prev ? { ...prev, avatar_url: json.data.avatar_url } : prev
        );
      }
    } catch (err) {
      console.error("Error upload avatar:", err);
      setAvatarError("Terjadi kesalahan saat upload avatar.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ====== FETCH DATA DASHBOARD (SETOR, USERS, PRODUK) ======
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
          "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
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
              layout: { padding: { bottom: 35 } },
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

  // panggil fetchProfile sekali di awal
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Navbaradmin />

        {/* CONTENT */}
        <div className="flex-1 lg:ml-64 px-6 pt-[84px] pb-[160px]">
          {/* ==================== HEADER ADMIN (SESUAI PATTERN BARU) ==================== */}
          <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#FFFFFF] border-b border-gray-200 shadow-sm">
            <div className="h-16 flex items-center justify-between px-6">
              <div>
                <h1 className="font-semibold text-[18px]">Dashboard Utama</h1>
                <p className="text-gray-600 text-[12px]">
                  Performa dan Status Operasional
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="relative group"
                  title="Klik untuk ganti foto profil"
                >
                  <img
                    src={avatarUrl}
                    className="w-10 h-10 rounded-full border object-cover"
                    alt="avatar"
                  />
                  {/* overlay kecil saat hover */}
                  <span className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white transition">
                    Ubah
                  </span>
                </button>

                <div>
                  <p className="font-semibold text-sm">
                    {loadingProfile ? "Memuat…" : currentUser?.username || "-"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {currentUser?.role === "admin" ? "Admin" : "User"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* INPUT FILE HIDDEN UNTUK AVATAR */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />

          {/* ERROR AVATAR (kalau ada) */}
          {avatarError && (
            <div className="mt-[72px] mb-2 w-full max-w-5xl mx-auto text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {avatarError}
            </div>
          )}

          {/* ================= INFO CARD ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white shadow-lg rounded-xl p-5">
              <p className="text-sm font-semibold">Total Sampah Terkumpul</p>
              <h2 className="text-2xl font-bold mt-3">{totalSampah} kg</h2>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-5">
              <p className="text-sm font-semibold">Jumlah Nasabah</p>
              <h2 className="text-2xl font-bold mt-3">{jumlahNasabah}</h2>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-5">
              <p className="text-sm font-semibold">Total Transaksi</p>
              <h2 className="text-2xl font-bold mt-3">{jumlahTransaksi}</h2>
            </div>
          </div>

          {/* ================= CHART BAGIAN ================= */}
          <div className="flex flex-col lg:flex-row gap-6 mt-10">
            {/* LINE CHART */}
            <div className="bg-white shadow-lg rounded-xl p-6 w-full lg:w-[624px]">
              <h2 className="font-semibold mb-4 text-[18px]">
                Tren Setoran Sampah (6 Bulan Terakhir)
              </h2>
              <div style={{ height: "380px" }}>
                <canvas ref={lineChartRef}></canvas>
              </div>
            </div>

            {/* DONUT CHART */}
            <div className="bg-white shadow-lg rounded-xl p-6 w-full lg:w-[347px]">
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
