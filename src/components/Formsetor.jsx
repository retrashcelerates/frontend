import { useEffect, useState } from "react";

const API_BASE_URL = "https://backend-deployment-topaz.vercel.app/api";

export default function FromSetor() {
  // === STATE FORM UTAMA ===
  const [form, setForm] = useState({
    namaPenyetor: "",
    product_id: "",
    lokasi_id: "",
    kuantitas: "",
    hargaPerKg: "",
  });

  // === STATE DATA MASTER ===
  const [produkList, setProdukList] = useState([]);
  const [lokasiList, setLokasiList] = useState([]);
  const [loadingProduk, setLoadingProduk] = useState(true);
  const [loadingLokasi, setLoadingLokasi] = useState(true);

  // === STATE RIWAYAT SETOR ===
  const [transactions, setTransactions] = useState([]);
  const [totalSaldoSetor, setTotalSaldoSetor] = useState(0);

  // === STATE RIWAYAT PENARIKAN ===
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalPenarikan, setTotalPenarikan] = useState(0);

  // === TOTAL SALDO AKHIR ===
  const totalSaldo = totalSaldoSetor - totalPenarikan;

  // === STATE STATUS ===
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  // === STATE MODAL KONFIRMASI ===
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [extraNote, setExtraNote] = useState("");

  // === STATE MODAL SUKSES ===
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  // 🔔 AUTO-CLEAR PESAN VALIDASI (ERRORS) SETELAH 30 DETIK
  useEffect(() => {
    if (errors.length === 0) return;

    const timer = setTimeout(() => {
      setErrors([]);
    }, 30000); // 30000ms = 30 detik

    // bersihin timer kalau errors berubah sebelum 30 detik
    return () => clearTimeout(timer);
  }, [errors]);

  // Helper format rupiah
  const formatRupiah = (angka) => {
    if (angka == null || isNaN(angka)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  // Helper format tanggal (dd/mm/yy)
  const formatTanggal = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "-";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  };

  // Helper format tanggal + jam
  const formatTanggalWaktu = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // === FETCH PRODUK & LOKASI ===
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/produk`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          setProdukList(data.data);
        }
      } catch (err) {
        console.error(err);
        setErrors((prev) => [...prev, "Gagal memuat daftar jenis sampah"]);
      } finally {
        setLoadingProduk(false);
      }
    };

    const fetchLokasi = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/lokasi`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          setLokasiList(data.data);
        }
      } catch (err) {
        console.error(err);
        setErrors((prev) => [...prev, "Gagal memuat daftar lokasi"]);
      } finally {
        setLoadingLokasi(false);
      }
    };

    fetchProduk();
    fetchLokasi();
  }, []);

  // === FETCH RIWAYAT SETOR USER ===
  useEffect(() => {
    const fetchRiwayat = async () => {
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
        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          setErrors((prev) => [
            ...prev,
            data.message || "Gagal memuat riwayat setor",
          ]);
          return;
        }

        const mapped = data.data.map((item) => {
          const qty = Number(item.kuantitas || 0);
          const harga = Number(item.harga_saat_transaksi || 0);
          const total =
            item.total_harga != null ? Number(item.total_harga) : qty * harga;

          return {
            id: item.id,
            name: `Setoran #${item.id}`,
            status: "completed",
            date: formatTanggal(item.tanggal_setor),
            weight: `${qty} kg`,
            amount: formatRupiah(total),
          };
        });

        setTransactions(mapped);

        const totalAll = data.data.reduce((sum, item) => {
          const qty = Number(item.kuantitas || 0);
          const harga = Number(item.harga_saat_transaksi || 0);
          const total =
            item.total_harga != null ? Number(item.total_harga) : qty * harga;
          return sum + total;
        }, 0);

        setTotalSaldoSetor(totalAll);
      } catch (err) {
        console.error(err);
        setErrors((prev) => [...prev, "Gagal memuat riwayat setor"]);
      }
    };

    fetchRiwayat();
  }, []);

  // === FETCH RIWAYAT PENARIKAN USER ===
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) return;

        const user = JSON.parse(userStr);
        if (!user?.id) return;

        const res = await fetch(
          `${API_BASE_URL}/riwayat-penarikan/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          return;
        }

        setWithdrawals(data.data || []);

        const total = (data.data || []).reduce(
          (sum, item) => sum + Number(item.jumlah_penarikan || 0),
          0
        );

        setTotalPenarikan(total);
      } catch (err) {
        console.error("Gagal memuat riwayat penarikan:", err);
      }
    };

    fetchWithdrawals();
  }, []);

  // === HANDLE FORM ===
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "product_id") {
      const selected = produkList.find((p) => p.id === Number(value));
      if (selected) {
        setForm((prev) => ({
          ...prev,
          hargaPerKg: selected.harga,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          hargaPerKg: "",
        }));
      }
    }
  };

  // Buka modal konfirmasi
  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    const newErr = [];
    if (!form.product_id) newErr.push("Jenis sampah wajib dipilih.");
    if (!form.lokasi_id) newErr.push("Lokasi setor wajib dipilih.");
    if (!form.kuantitas || Number(form.kuantitas) <= 0)
      newErr.push("Kuantitas harus lebih dari 0.");

    if (newErr.length > 0) {
      setErrors(newErr);
      return;
    }

    setIsConfirmOpen(true);
  };

  // Konfirmasi transaksi
  const handleConfirmTransaction = async () => {
    setLoadingSubmit(true);
    setErrors([]);
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors([
          "Anda harus login terlebih dahulu sebelum melakukan setor.",
        ]);
        setLoadingSubmit(false);
        return;
      }

      const qty = parseFloat(form.kuantitas || "0");
      const harga = parseFloat(form.hargaPerKg || "0");
      const total = qty * harga;

      const selectedProduk = produkList.find(
        (p) => p.id === Number(form.product_id)
      );
      const selectedLokasi = lokasiList.find(
        (l) => l.id === Number(form.lokasi_id)
      );

      let tanggalSetorISO = null;
      if (pickupDate) {
        const time = pickupTime || "00:00";
        tanggalSetorISO = new Date(`${pickupDate}T${time}:00`).toISOString();
      }

      const catatan_tambahan = `
    Penyetor         : ${form.namaPenyetor || "-"}
    Jenis            : ${selectedProduk ? selectedProduk.nama_produk : "-"}
    Lokasi           : ${selectedLokasi ? selectedLokasi.name : "-"}
    Berat            : ${isNaN(qty) ? 0 : qty} kg
    Harga/kg         : ${isNaN(harga) ? 0 : harga}
    Total            : ${isNaN(total) ? 0 : total}

    Tanggal setor    : ${pickupDate || "-"}
    Waktu setor      : ${pickupTime || "-"}
    Catatan tambahan : ${extraNote || "-"}
    Foto sampah      : ${photoFile ? photoFile.name : "-"}
    `.trim();

      const formData = new FormData();
      formData.append("product_id", String(form.product_id));
      formData.append("lokasi_id", String(form.lokasi_id));
      formData.append("kuantitas", String(qty));
      formData.append("catatan_tambahan", catatan_tambahan);
      if (tanggalSetorISO) {
        formData.append("tanggal_setor", tanggalSetorISO);
      }
      if (photoFile) {
        formData.append("image", photoFile);
      }

      const res = await fetch(`${API_BASE_URL}/setor`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const msgs = [];
        if (data.errors && Array.isArray(data.errors)) msgs.push(...data.errors);
        if (data.message && !msgs.includes(data.message))
          msgs.push(data.message);

        setErrors(msgs.length ? msgs : ["Gagal membuat transaksi setor."]);
      } else {
        const baru = data.data;
        const qtyBaru = Number(baru.kuantitas || 0);
        const hargaBaru = Number(baru.harga_saat_transaksi || 0);
        const totalBaru =
          baru.total_harga != null
            ? Number(baru.total_harga)
            : qtyBaru * hargaBaru;

        // update list & saldo
        setTransactions((prev) => [
          {
            id: baru.id,
            name: `Setoran #${baru.id}`,
            status: "completed",
            date: formatTanggal(baru.tanggal_setor),
            weight: `${qtyBaru} kg`,
            amount: formatRupiah(totalBaru),
          },
          ...prev,
        ]);
        setTotalSaldoSetor((prev) => prev + totalBaru);

        // info untuk modal sukses
        const kodeTransaksi =
          baru.kode_transaksi ||
          `TR-SAMPAH-${String(baru.id).padStart(6, "0")}`;

        setSuccessInfo({
          kode: kodeTransaksi,
          total: totalBaru,
          jenis: selectedProduk?.nama_produk || baru.nama_produk || "Sampah",
          berat: qtyBaru,
          jadwalSetor: tanggalSetorISO || baru.tanggal_setor,
          catatan: extraNote || "-",
          waktuPengajuan: baru.created_at || new Date().toISOString(),
          lokasi: selectedLokasi?.name || "-",
        });
        setSuccessModalOpen(true);

        // reset form
        setIsConfirmOpen(false);
        setForm({
          namaPenyetor: "",
          product_id: "",
          lokasi_id: "",
          kuantitas: "",
          hargaPerKg: "",
        });
        setPickupDate("");
        setPickupTime("");
        setPhotoFile(null);
        setExtraNote("");
      }
    } catch (err) {
      console.error(err);
      setErrors(["Terjadi kesalahan jaringan/server."]);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // === RENDER HALAMAN ===
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center px-4 py-1 rounded-full border border-blue-200 bg-blue-50 text-xs font-medium text-blue-600 mb-4">
            💳 Transaksi Digital
          </span>

          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            Kelola Transaksi <span className="text-green-500">Sampah Anda</span>
          </h1>

          <p className="mt-3 text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            Catat setiap transaksi sampah dengan mudah dan pantau pendapatan
            Anda secara real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ================= FORM SETOR (KIRI) ================= */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-7">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-green-500 text-xl font-bold">+</span>
              <h2 className="font-semibold text-gray-800">
                Setor Sampah
              </h2>
            </div>

            {errors.length > 0 && (
              <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 space-y-1">
                {errors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            {success && (
              <div className="mb-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
                {success}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleOpenConfirm}>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nama Penyetor
                </label>
                <input
                  type="text"
                  name="namaPenyetor"
                  value={form.namaPenyetor}
                  onChange={handleChange}
                  placeholder="Masukkan nama penyetor"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Jenis Sampah
                </label>
                <select
                  name="product_id"
                  value={form.product_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
                  disabled={loadingProduk}
                >
                  <option value="" disabled>
                    Pilih jenis sampah
                  </option>
                  {produkList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama_produk} — Rp {p.harga}/kg
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Pilih Lokasi
                </label>
                <select
                  name="lokasi_id"
                  value={form.lokasi_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
                  disabled={loadingLokasi}
                >
                  <option value="" disabled>
                    Pilih lokasi penyetoran
                  </option>
                  {lokasiList.map((lok) => (
                    <option key={lok.id} value={lok.id}>
                      {lok.name} — {lok.jalan}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Kuantitas (kg)
                  </label>
                  <input
                    type="number"
                    name="kuantitas"
                    min="0"
                    step="0.1"
                    value={form.kuantitas}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Harga per kg
                  </label>
                  <input
                    type="number"
                    name="hargaPerKg"
                    min="0"
                    value={form.hargaPerKg}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
                    disabled
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 transition"
              >
                <span>+</span>
                <span>Konfirmasi Transaksi</span>
              </button>
            </form>
          </div>

          {/* ================= SALDO + RIWAYAT (KANAN) ================= */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 md:p-7 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium flex items-center gap-2">
                  💰 Total Saldo
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/15 border border-white/30">
                  {transactions.length} transaksi
                </span>
              </div>

              <div>
                <div className="text-3xl font-semibold mb-1">
                  {formatRupiah(totalSaldo)}
                </div>
                <p className="text-sm text-white/90">Siap untuk dicairkan</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-7">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-500 text-lg">📅</span>
                <p className="font-semibold text-gray-800">
                  Riwayat Transaksi
                </p>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {transactions.map((trx) => (
                  <div
                    key={trx.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-800">
                          {trx.name}
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-semibold uppercase tracking-wide">
                          {trx.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {trx.date} • {trx.weight}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">
                        {trx.amount}
                      </p>
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <p className="text-xs text-gray-400">
                    Belum ada riwayat transaksi.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL CONFIRMATION ================= */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 px-4 py-10 overflow-y-hidden">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-7 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Konfirmasi Transaksi
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Lengkapi detail transaksi Anda
                </p>
              </div>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">
                  ♻
                </span>
                Ringkasan Transaksi
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Jenis Sampah</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                    {produkList.find((p) => p.id === Number(form.product_id))
                      ?.nama_produk || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Berat</span>
                  <span className="font-medium text-gray-800">
                    {form.kuantitas || 0} kg
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Harga per kg</span>
                  <span className="font-medium text-gray-800">
                    {formatRupiah(form.hargaPerKg)}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-green-100 flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Total Estimasi</span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatRupiah(
                      Number(form.kuantitas || 0) *
                        Number(form.hargaPerKg || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <label className="block text-gray-600 mb-1">
                  Tanggal Setor
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  Waktu Setor
                </label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 text-sm"
                />
              </div>
            </div>

            <div className="mb-4 text-sm">
              <label className="block text-gray-600 mb-1">
                Foto Sampah <span className="text-gray-400"></span>
              </label>
              <label className="w-full flex items-center justify-between border border-dashed border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-green-500">
                <span className="text-xs text-gray-500">
                  {photoFile ? photoFile.name : "Upload Foto"}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  Pilih File
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setPhotoFile(file || null);
                  }}
                />
              </label>
            </div>

            <div className="mb-5 text-sm">
              <label className="block text-gray-600 mb-1">
                Catatan Tambahan{" "}
                <span className="text-gray-400">(Opsional)</span>
              </label>
              <textarea
                rows={3}
                value={extraNote}
                onChange={(e) => setExtraNote(e.target.value)}
                placeholder="Contoh: Sampah sudah dipilah, harap hubungi sebelum datang..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50"
                disabled={loadingSubmit}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmTransaction}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2"
                disabled={loadingSubmit}
              >
                <span>
                  {loadingSubmit ? "Memproses..." : "Konfirmasi Transaksi"}
                </span>
                {!loadingSubmit && <span>➜</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SUKSES ================= */}
      {successModalOpen && successInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header hijau */}
            <div className="relative bg-green-500 px-6 py-6 text-center text-white">
              <button
                onClick={() => setSuccessModalOpen(false)}
                className="absolute right-4 top-4 text-white/80 hover:text-white"
              >
                ✕
              </button>

              <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center mb-3">
                <span className="text-green-500 text-3xl">✓</span>
              </div>

              <h2 className="text-lg font-semibold mb-1">
                Permintaan Setor Berhasil!
              </h2>
              <p className="text-xs text-white/90 max-w-xs mx-auto">
                Jadwal penyetoran sampah Anda telah tercatat.
                Mohon tunggu verifikasi dari petugas kami.
              </p>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 pt-5 bg-gray-50">
              {/* Kode transaksi */}
              <div className="flex justify-center mb-4">
                <span className="text-[11px] px-4 py-1 rounded-full bg-white border border-green-200 text-green-700 font-medium">
                  # {successInfo.kode}
                </span>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-sm space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Estimasi Pendapatan</span>
                  <span className="text-base font-semibold text-green-600">
                    {formatRupiah(successInfo.total)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Jenis Sampah</span>
                  <span className="font-medium text-gray-800">
                    {successInfo.jenis}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Berat</span>
                  <span className="font-medium text-gray-800">
                    {successInfo.berat} kg
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Jadwal Setor</span>
                  <span className="font-medium text-gray-800 text-right">
                    {formatTanggalWaktu(successInfo.jadwalSetor)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Lokasi</span>
                  <span className="font-medium text-gray-800 text-right">
                    {successInfo.lokasi}
                  </span>
                </div>

                <div>
                  <span className="block text-gray-500 mb-1">Catatan</span>
                  <p className="text-xs text-gray-700">
                    {successInfo.catatan || "-"}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                  <span>Waktu Pengajuan</span>
                  <span>{formatTanggalWaktu(successInfo.waktuPengajuan)}</span>
                </div>
              </div>

              <button
                onClick={() => setSuccessModalOpen(false)}
                className="mt-5 w-full rounded-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-900"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
