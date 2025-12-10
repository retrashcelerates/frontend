import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FormPenarikan from "../components/FormPenarikan";
import { FiCamera } from "react-icons/fi";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function ProfilePage() {
  const navigate = useNavigate();

  // --- ambil user awal dari localStorage ---
  let initialUser = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) initialUser = JSON.parse(raw);
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

  // ====== STATE EDIT PROFILE ======
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: profile.username || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    avatarPreview: profile.avatar_url || "",
    avatarFile: null,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ====== STATE LOGOUT KONFIRM ======
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Stats setor: saldo total, jumlah transaksi, total kg
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

  // ========= FETCH PROFIL USER =========
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
        setErrorMsg(json?.error || json?.message || "Gagal mengambil profil");
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

  // setiap profile berubah & tidak sedang edit → sinkron ke editData
  useEffect(() => {
    if (!isEditing) {
      setEditData((prev) => ({
        ...prev,
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        avatarPreview: profile.avatar_url || "",
        avatarFile: null,
      }));
    }
  }, [profile, isEditing]);

  // bersihkan URL preview avatar kalau berubah
  useEffect(() => {
    return () => {
      if (editData.avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(editData.avatarPreview);
      }
    };
  }, [editData.avatarPreview]);

  // ========= FETCH RINGKASAN SETOR =========
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

  // ========= FETCH RIWAYAT PENARIKAN =========
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
          },
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

  // ========= SALDO TERSISA & SORTING RIWAYAT =========
  const saldoTersedia = useMemo(() => {
    const totalPenarikan = withdrawals.reduce(
      (sum, w) => sum + Number(w.jumlah_penarikan || 0),
      0
    );
    const sisa = Number(stats.totalSaldo || 0) - totalPenarikan;
    return sisa > 0 ? sisa : 0;
  }, [stats.totalSaldo, withdrawals]);

  const sortedWithdrawals = useMemo(() => {
    return [...withdrawals].sort((a, b) => {
      const da = new Date(a.tanggal_penarikan || a.created_at || 0);
      const db = new Date(b.tanggal_penarikan || b.created_at || 0);
      return db - da;
    });
  }, [withdrawals]);

  const joinDate = formatTanggal(profile.created_at);
  const roleLabel = getRoleLabel(profile.role);

  const handleOpenPenarikan = () => setIsPenarikanOpen(true);
  const handleClosePenarikan = () => setIsPenarikanOpen(false);

  // refresh setelah penarikan
  const refreshSaldoDanRiwayat = useCallback(async () => {
    await Promise.all([fetchSetorStats(), fetchRiwayatPenarikan()]);
  }, [fetchSetorStats, fetchRiwayatPenarikan]);

  // ========= HANDLER EDIT PROFILE =========
  const handleStartEdit = () => {
    setSuccessMsg("");
    setErrorMsg("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // kembalikan ke nilai profile
    setEditData({
      username: profile.username || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
      avatarPreview: profile.avatar_url || "",
      avatarFile: null,
    });
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // bersihkan preview lama kalau blob
    if (editData.avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(editData.avatarPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setEditData((prev) => ({
      ...prev,
      avatarFile: file,
      avatarPreview: previewUrl,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setErrorMsg("");
      setSuccessMsg("");

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      const formData = new FormData();
      // hanya kirim field yang diubah / terisi
      if (editData.username !== profile.username)
        formData.append("username", editData.username);
      if (editData.email !== profile.email)
        formData.append("email", editData.email);
      if (editData.phone !== profile.phone)
        formData.append("phone", editData.phone);
      if (editData.address !== profile.address)
        formData.append("address", editData.address);
      if (editData.avatarFile) {
        // asumsi field name di backend: "avatar"
        formData.append("avatar", editData.avatarFile);
      }

      // kalau tidak ada yang diubah
      if (
        !editData.avatarFile &&
        editData.username === profile.username &&
        editData.email === profile.email &&
        editData.phone === profile.phone &&
        editData.address === profile.address
      ) {
        setIsEditing(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Gagal update profil:", json);
        const msgs = [];
        if (Array.isArray(json?.errors)) msgs.push(...json.errors);
        if (json?.message && !msgs.includes(json.message))
          msgs.push(json.message);
        setErrorMsg(
          msgs.length
            ? msgs.join(" | ")
            : "Gagal menyimpan perubahan profil."
        );
        return;
      }

      // asumsikan json.data = user baru
      if (json.data) {
        setProfile((prev) => ({ ...prev, ...json.data }));
        localStorage.setItem("user", JSON.stringify(json.data));
      }

      setIsEditing(false);
      setSuccessMsg("Profil berhasil diperbarui.");
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ========= HANDLER LOGOUT =========
  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogoutConfirmOpen(false);
    navigate("/"); // <-- diarahkan ke homepage
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER BAR (fixed) */}
      <div className="w-full h-20 bg-white shadow-sm fixed top-0 left-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 sm:px-0 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 text-sm hover:text-gray-800"
          >
            <span className="text-lg mr-1">←</span> Kembali
          </button>

          <div className="w-px h-5 bg-gray-300"></div>

          <div className="flex flex-col flex-1">
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
      <div className="max-w-6xl mx-auto pt-20 px-4 md:pt-25 md:pb-8">
        {errorMsg && (
          <div className="mb-3 text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-3 text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
            {successMsg}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              {/* AVATAR */}
              <div className="w-20 h-20 mx-auto relative">
                {editData.avatarPreview ? (
                  <img
                    src={editData.avatarPreview}
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

                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full cursor-pointer shadow flex items-center justify-center">
                    <FiCamera className="w-4 h-4" />
                    <span className="sr-only">Ganti foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
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

              {/* Saldo tersisa */}
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

              {/* Ringkasan transaksi & total kg */}
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

              {/* Tombol Logout – outline merah */}
              <button
                onClick={handleLogoutClick}
                className="mt-4 w-full border border-red-500 text-red-500 font-medium rounded-lg py-2 shadow-sm hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* DATA DIRI */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Data Diri</h3>

                {/* Tombol Edit / Simpan & Batal */}
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        disabled={savingProfile}
                        className="text-gray-600 border border-gray-300 rounded-lg px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-60"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg disabled:opacity-60"
                      >
                        {savingProfile ? "Menyimpan..." : "Simpan"}
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-700 border border-green-600 rounded-lg px-3 py-1 text-sm"
                      onClick={handleStartEdit}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* FORM / READONLY */}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {/* Nama */}
                <div>
                  <p className="text-gray-500 mb-1">Nama Lengkap</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) =>
                        handleEditChange("username", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
                    />
                  ) : (
                    <p className="font-medium">{profile.username || "-"}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        handleEditChange("email", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
                    />
                  ) : (
                    <p className="font-medium">{profile.email || "-"}</p>
                  )}
                </div>

                {/* Telepon */}
                <div>
                  <p className="text-gray-500 mb-1">No. Telepon</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) =>
                        handleEditChange("phone", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
                    />
                  ) : (
                    <p className="font-medium">{profile.phone || "-"}</p>
                  )}
                </div>

                {/* Alamat */}
                <div>
                  <p className="text-gray-500 mb-1">Alamat Lengkap</p>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editData.address}
                      onChange={(e) =>
                        handleEditChange("address", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
                    />
                  ) : (
                    <p className="font-medium">
                      {profile.address || "Belum diisi"}
                    </p>
                  )}
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

            {/* Riwayat Penarikan */}
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

      {/* MODAL KONFIRMASI LOGOUT */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Konfirmasi Logout
              </h2>
              <button
                onClick={handleCancelLogout}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg border border-red-500 text-red-500 bg-white hover:bg-red-50 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
