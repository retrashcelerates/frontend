import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import FormPenarikan from "../components/FormPenarikan";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function ProfilePage() {
  const navigate = useNavigate();

  // Ambil user dari localStorage sebagai nilai awal
  let initialUser = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      initialUser = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Gagal parse user dari localStorage:", e);
  }

  const [profile, setProfile] = useState({
    id: initialUser?.id || null,
    username: initialUser?.username || "",
    email: initialUser?.email || "",
    phone: initialUser?.phone || "",
    address: initialUser?.address || "",
    avatar_url: initialUser?.avatar_url || "",
    role: initialUser?.role || "",
    created_at: initialUser?.created_at || "",
  });

  // Stats setor: saldo total setor, jumlah transaksi, total kg
  const [stats, setStats] = useState({
    totalSaldo: 0,
    totalTransaksi: 0,
    totalKg: 0,
  });

  // Riwayat penarikan
  const [withdrawals, setWithdrawals] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPenarikanOpen, setIsPenarikanOpen] = useState(false);

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTanggalWaktu = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRupiah = (angka) => {
    const n = Number(angka || 0);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  };

  const getRoleLabel = (role) => {
    if (!role) return "-";
    if (role === "admin") return "Admin";
    return "Nasabah";
  };

  // 🔹 Fetch profil user
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(
          json?.error || json?.message || "Gagal mengambil profil"
        );
        return;
      }

      setProfile((prev) => ({
        ...prev,
        ...json.data,
      }));

      localStorage.setItem("user", JSON.stringify(json.data));
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan saat mengambil profil.");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 🔹 Fetch ringkasan setor user: totalSaldo, totalTransaksi, totalKg
  const fetchSetorStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) return;

      const user = JSON.parse(userStr);
      if (!user?.id) return;

      const res = await fetch(`${API_BASE_URL}/setor/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal fetch setor user:", json);
        setErrorMsg((prev) =>
          prev
            ? prev + " | Gagal memuat ringkasan setor."
            : "Gagal memuat ringkasan setor."
        );
        return;
      }

      const list = Array.isArray(json.data) ? json.data : [];

      let totalSaldo = 0;
      let totalKg = 0;

      for (const item of list) {
        const qty = Number(item.kuantitas || 0);
        const harga = Number(item.harga_saat_transaksi || 0);
        const total =
          item.total_harga != null ? Number(item.total_harga) : qty * harga;

        totalKg += qty;
        totalSaldo += total;
      }

      setStats({
        totalSaldo,
        totalTransaksi: list.length,
        totalKg,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg((prev) =>
        prev
          ? prev + " | Terjadi kesalahan saat memuat ringkasan setor."
          : "Terjadi kesalahan saat memuat ringkasan setor."
      );
    }
  }, []);

  useEffect(() => {
    fetchSetorStats();
  }, [fetchSetorStats]);

  // 🔹 Fetch riwayat penarikan user
  const fetchRiwayatPenarikan = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) return;

      const user = JSON.parse(userStr);
      if (!user?.id) return;

      const res = await fetch(
        `${API_BASE_URL}/riwayat-penarikan/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal fetch riwayat penarikan:", json);
        setErrorMsg((prev) =>
          prev
            ? prev + " | Gagal memuat riwayat penarikan."
            : "Gagal memuat riwayat penarikan."
        );
        return;
      }

      const list = Array.isArray(json.data) ? json.data : [];
      setWithdrawals(list);
    } catch (err) {
      console.error(err);
      setErrorMsg((prev) =>
        prev
          ? prev + " | Terjadi kesalahan saat memuat riwayat penarikan."
          : "Terjadi kesalahan saat memuat riwayat penarikan."
      );
    }
  }, []);

  useEffect(() => {
    fetchRiwayatPenarikan();
  }, [fetchRiwayatPenarikan]);

  // 🔹 Hitung saldo tersisa = total setor - total penarikan
  const saldoTersedia = useMemo(() => {
    const totalPenarikan = withdrawals.reduce(
      (sum, w) => sum + Number(w.jumlah_penarikan || 0),
      0
    );
    const sisa = Number(stats.totalSaldo || 0) - totalPenarikan;
    return sisa > 0 ? sisa : 0;
  }, [stats.totalSaldo, withdrawals]);

  // 🔹 Urutkan riwayat penarikan terbaru di atas
  const sortedWithdrawals = useMemo(() => {
    return [...withdrawals].sort((a, b) => {
      const da = new Date(a.tanggal_penarikan || a.created_at || 0);
      const db = new Date(b.tanggal_penarikan || b.created_at || 0);
      return db - da;
    });
  }, [withdrawals]);

  const joinDate = formatTanggal(profile.created_at);
  const roleLabel = getRoleLabel(profile.role);

  const handleOpenPenarikan = () => {
    setIsPenarikanOpen(true);
  };

  const handleClosePenarikan = () => {
    setIsPenarikanOpen(false);
  };

  // 🔹 Fungsi refresh (dipanggil dari FormPenarikan.onSuccess)
  const refreshSaldoDanRiwayat = useCallback(async () => {
    await Promise.all([fetchSetorStats(), fetchRiwayatPenarikan()]);
  }, [fetchSetorStats, fetchRiwayatPenarikan]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER BAR (fixed) */}
      <div className="w-full bg-white shadow-sm fixed top-0 left-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 sm:px-0 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 text-sm hover:text-gray-800"
          >
            <span className="text-lg mr-1">←</span> Kembali
          </button>

          <div className="w-px h-5 bg-gray-300"></div>

          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
              Profile Saya
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 -mt-0.5">
              Kelola informasi profil Anda
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto pt-20 px-4 md:px-0 md:pt-24 md:pb-8">
        {errorMsg && (
          <div className="mb-4 text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {errorMsg}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="w-20 h-20 mx-auto">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">
                    {profile.username
                      ?.split(" ")
                      .map((s) => s[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <h2 className="text-lg font-semibold mt-3">
                {profile.username || "-"}
              </h2>

              <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                {roleLabel}
              </span>

              <p className="text-xs text-gray-400 mt-2">
                Bergabung sejak {joinDate}
              </p>

              {/* Saldo tersisa (setor - penarikan) */}
              <div className="bg-green-500 text-white rounded-xl p-4 mt-4">
                <p className="text-sm opacity-80">Saldo Tersedia</p>
                <h3 className="text-3xl font-bold">
                  {formatRupiah(saldoTersedia)}
                </h3>
                <button
                  className="mt-3 w-full bg-white text-green-600 font-medium rounded-lg py-2 shadow hover:bg-gray-100"
                  onClick={handleOpenPenarikan}
                  disabled={saldoTersedia <= 0}
                >
                  {saldoTersedia > 0 ? "Tarik Saldo" : "Saldo belum tersedia"}
                </button>
              </div>

              {/* Ringkasan transaksi & total kg dari tabel setor */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <h3 className="text-2xl font-semibold text-blue-600">
                    {stats.totalTransaksi}
                  </h3>
                  <p className="text-sm text-gray-500">Transaksi</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <h3 className="text-2xl font-semibold text-purple-600">
                    {stats.totalKg}
                  </h3>
                  <p className="text-sm text-gray-500">kg Sampah</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Data Diri</h3>
                <button className="text-green-600 hover:text-green-700 border border-green-600 rounded-lg px-3 py-1 text-sm">
                  Edit Profile
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Nama Lengkap</p>
                  <p className="font-medium">{profile.username || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{profile.email || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-500">No. Telepon</p>
                  <p className="font-medium">{profile.phone || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-500">Alamat Lengkap</p>
                  <p className="font-medium">
                    {profile.address || "Belum diisi"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-sm">Status Akun</p>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {roleLabel === "Admin"
                    ? "Admin Sistem"
                    : "Nasabah Bank Sampah"}
                </span>
              </div>
            </div>

            {/* Riwayat Penarikan dengan max-height + scroll */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Riwayat Penarikan Saldo
              </h3>

              <div className="max-h-64 overflow-y-auto pr-1">
                {sortedWithdrawals.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    Belum ada riwayat penarikan saldo.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-100 text-sm">
                    {sortedWithdrawals.map((item) => (
                      <li
                        key={item.id}
                        className="py-3 flex justify-between gap-3"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {formatRupiah(item.jumlah_penarikan)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.metode_penarikan} •{" "}
                            {formatTanggalWaktu(item.tanggal_penarikan)}
                          </p>
                          {item.kode_transaksi && (
                            <p className="text-[11px] text-gray-400 mt-1">
                              Kode:{" "}
                              <span className="font-mono">
                                {item.kode_transaksi}
                              </span>
                            </p>
                          )}
                          {item.catatan && (
                            <p className="text-[11px] text-gray-500 mt-1">
                              Catatan: {item.catatan}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-gray-400">
                            Sisa saldo setelah
                          </p>
                          <p className="text-xs font-semibold text-green-600">
                            {formatRupiah(item.saldo_setelah)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY PENARIKAN (FormPenarikan) */}
      {isPenarikanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <FormPenarikan
            initialSaldo={saldoTersedia}
            defaultName={profile.username}
            defaultPhone={profile.phone}
            onClose={handleClosePenarikan}
            onSuccess={refreshSaldoDanRiwayat}
          />
        </div>
      )}
    </div>
  );
}
