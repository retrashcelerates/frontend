import { useEffect, useMemo, useState } from "react";
import {
  FaUniversity,
  FaMobileAlt,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

const allowedAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

const formatRupiah = (angka) => {
  const n = Number(angka || 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
};

const formatTanggalWaktu = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const methodOptions = [
  { value: "Bank BCA", label: "Bank BCA", type: "bank" },
  { value: "Bank BRI", label: "Bank BRI", type: "bank" },
  { value: "Bank Mandiri", label: "Bank Mandiri", type: "bank" },
  { value: "Bank BNI", label: "Bank BNI", type: "bank" },
  { value: "GoPay", label: "GoPay", type: "wallet" },
  { value: "OVO", label: "OVO", type: "wallet" },
  { value: "DANA", label: "DANA", type: "wallet" },
  { value: "Tunai di Lokasi", label: "Tunai di Lokasi", type: "cash" },
];

const renderMethodIcon = (type) => {
  if (type === "bank") return <FaUniversity className="w-4 h-4" />;
  if (type === "wallet") return <FaMobileAlt className="w-4 h-4" />;
  if (type === "cash") return <FaMoneyBillWave className="w-4 h-4" />;
  return <FaMobileAlt className="w-4 h-4" />;
};

export default function FormPenarikan({
  initialSaldo = 0,
  defaultName = "",
  defaultPhone = "",
  onClose,
  onSuccess, // dipakai untuk trigger refresh di Profile
}) {
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [method, setMethod] = useState("DANA");
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [phoneError, setPhoneError] = useState("");
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitTime, setSubmitTime] = useState(null);
  const [loading, setLoading] = useState(false);

  // data dari backend (kode + waktu)
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    setName(defaultName || "");
  }, [defaultName]);

  useEffect(() => {
    setPhone(defaultPhone || "");
  }, [defaultPhone]);

  const numericAmount = useMemo(() => Number(amount || 0), [amount]);
  const saldoNumber = useMemo(() => Number(initialSaldo || 0), [initialSaldo]);

  const isPresetValid = allowedAmounts.includes(numericAmount);
  const isAmountWithinSaldo = numericAmount <= saldoNumber;
  const isAmountValid =
    isPresetValid && isAmountWithinSaldo && numericAmount >= 10000;

  const handlePresetClick = (val) => {
    setAmount(String(val));
    setSelectedPreset(val);
  };

  const handleAmountChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    setAmount(v);

    const num = Number(v);
    if (allowedAmounts.includes(num)) {
      setSelectedPreset(num);
    } else {
      setSelectedPreset(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAmountValid || !method || !name || !phone || loading || phoneError)
      return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda harus login terlebih dahulu.");
        setLoading(false);
        return;
      }

      const now = new Date();
      const body = {
        jumlah_penarikan: numericAmount,
        tanggal_penarikan: now.toISOString(),
        metode_penarikan: method,
        saldo_setelah: saldoNumber - numericAmount,
        catatan: note || null,
      };

      const res = await fetch(`${API_BASE_URL}/riwayat-penarikan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Gagal penarikan:", data);
        alert(data?.message || "Gagal mengajukan penarikan.");
        setLoading(false);
        return;
      }

      // simpan kode_transaksi + tanggal_penarikan dari backend
      const created = data.data || {};
      setSuccessData({
        kode: created.kode_transaksi || "",
        waktu: created.tanggal_penarikan || now.toISOString(),
      });

      setSubmitTime(now);
      setShowSuccess(true);

      // 🔹 LANGSUNG trigger refresh di Profile
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan/server saat mengajukan penarikan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    setShowSuccess(false);
    if (onClose) onClose();
  };

  // ================= VIEW: BERHASIL =================
  if (showSuccess) {
    return (
      <div className="w-full max-w-sm sm:max-w-md mx-4 bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <PenarikanBerhasil
          amount={numericAmount}
          method={method}
          name={name}
          phone={phone}
          note={note}
          waktu={successData?.waktu || submitTime}
          kodeTransaksi={successData?.kode || ""}
          onClose={handleCloseAll}
        />
      </div>
    );
  }

  // ================= VIEW: FORM =================
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-4 bg-white rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto no-scrollbar">
      {/* HEADER HIJAU */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-4 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <span className="text-lg">↻</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight">
                Tarik Saldo
              </h2>
              <p className="text-xs opacity-90">
                Cairkan saldo Anda ke rekening tujuan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* KARTU SALDO */}
        <div className="mt-4 bg-white/10 border border-white/30 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80">Saldo Tersedia</p>
            <p className="text-2xl font-semibold">
              {formatRupiah(initialSaldo)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            💳
          </div>
        </div>
      </div>

      {/* ISI FORM */}
      <form onSubmit={handleSubmit} className="p-5 space-y-5 text-sm">
        {/* JUMLAH PENARIKAN */}
        <div>
          <p className="font-semibold mb-2">Jumlah Penarikan</p>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <span className="text-gray-400 text-sm">Rp</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              inputMode="numeric"
              className="w-full bg-transparent outline-none text-gray-800 text-base"
              placeholder="10000"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {allowedAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handlePresetClick(val)}
                className={`text-xs border rounded-xl py-2 font-medium transition
                  ${
                    selectedPreset === val
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-green-500"
                  }`}
              >
                {formatRupiah(val).replace("Rp", "Rp ").replace(",00", "")}
              </button>
            ))}
          </div>

          <div className="mt-3">
            {amount && !allowedAmounts.includes(numericAmount) && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[11px] text-red-700">
                <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">
                  !
                </span>
                <span>Nominal harus sesuai pilihan yang tersedia</span>
              </div>
            )}

            {amount &&
              allowedAmounts.includes(numericAmount) &&
              !isAmountWithinSaldo && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[11px] text-red-700">
                  <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">
                    !
                  </span>
                  <span>Jumlah melebihi saldo yang tersedia</span>
                </div>
              )}

            {amount && isAmountValid && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-700">
                <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">
                  ✓
                </span>
                <span>Jumlah valid</span>
              </div>
            )}
          </div>
        </div>

        {/* METODE PENARIKAN */}
        <div>
          <p className="font-semibold mb-2">Metode Penarikan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {methodOptions.map((opt) => {
              const isActive = method === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMethod(opt.value)}
                  className={`w-full border rounded-2xl px-3 py-2 flex items-center justify-between gap-3 transition
                    ${
                      isActive
                        ? "bg-emerald-50 border-green-600"
                        : "bg-white border-gray-200 hover:border-green-500"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center
                        ${
                          isActive
                            ? "bg-green-600 text-white"
                            : "bg-amber-50 text-amber-500"
                        }`}
                    >
                      {renderMethodIcon(opt.type)}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive ? "text-green-700" : "text-gray-800"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </div>

                  {isActive && (
                    <div className="w-4 h-4 rounded-full border border-green-600 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-green-600">
                        ✓
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* NAMA & NOMOR */}
        <div className="space-y-3">
          <div>
            <p className="font-semibold mb-1">Nama Pemilik Rekening</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <FaUser className="text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-gray-700 text-sm cursor-not-allowed"
                value={name}
                readOnly
              />
            </div>
          </div>

          <div>
            <p className="font-semibold mb-1">Nomor E-Wallet / Rekening</p>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none 
                ${phoneError ? "border-red-400 bg-red-50" : "border-gray-200"}
              `}
              value={phone}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setPhone(v);

                if (v !== defaultPhone) {
                  setPhoneError("Nomor tidak sesuai dengan nomor akun Anda");
                } else {
                  setPhoneError("");
                }
              }}
              placeholder="Nomor tujuan penarikan"
              required
            />
            {phoneError && (
              <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] text-red-700">
                <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">
                  !
                </span>
                <span>{phoneError}</span>
              </div>
            )}
          </div>
        </div>

        {/* CATATAN */}
        <div>
          <p className="font-semibold mb-1">
            Catatan <span className="text-gray-400">(Opsional)</span>
          </p>
          <textarea
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 resize-none"
            placeholder="Tambahkan catatan jika diperlukan"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* TOMBOL AKSI */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={
              !isAmountValid ||
              !method ||
              !name ||
              !phone ||
              loading ||
              phoneError
            }
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold shadow
              ${
                !isAmountValid ||
                !method ||
                !name ||
                !phone ||
                loading ||
                phoneError
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-black"
              }`}
          >
            Ajukan Penarikan
          </button>
        </div>
      </form>
    </div>
  );
}

/* ====================== SUCCESS CARD ====================== */

function PenarikanBerhasil({
  amount,
  method,
  name,
  phone,
  note,
  waktu,
  kodeTransaksi,
  onClose,
}) {
  return (
    <>
      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-6 px-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-white/80 hover:text-white text-lg"
        >
          ✕
        </button>

        <div className="w-14 h-14 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
          ✓
        </div>
        <h2 className="text-lg font-semibold">Penarikan Berhasil!</h2>
        <p className="text-xs opacity-90 mt-1">
          Permintaan Anda sedang diproses dan akan ditransfer dalam 1–2 hari
          kerja.
        </p>

        {/* Badge kode transaksi */}
        {kodeTransaksi && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white text-green-700 rounded-full px-4 py-1 text-xs font-semibold shadow-sm">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[11px]">
              #
            </span>
            <span>{kodeTransaksi}</span>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="p-5 text-sm space-y-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500">Jumlah Penarikan</p>
            </div>
            <p className="text-base font-semibold text-green-600">
              {formatRupiah(amount)}
            </p>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">Metode</span>
            <span className="font-medium text-xs">{method}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">Nomor E-Wallet</span>
            <span className="font-medium text-xs">{phone || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">Nama Penerima</span>
            <span className="font-medium text-xs">{name || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-xs">Catatan</span>
            <span className="font-medium text-xs text-right max-w-[55%]">
              {note || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400 text-[11px]">Waktu Pengajuan</span>
            <span className="text-gray-500 text-[11px]">
              {formatTanggalWaktu(waktu)}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-3 text-xs text-emerald-800 flex gap-3">
          <div className="mt-0.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center text-[12px]">
              ✓
            </span>
          </div>
          <div>
            <p className="font-semibold mb-0.5">Berhasil</p>
            <p>
              Anda akan menerima notifikasi setelah dana berhasil ditransfer.
              Cek <span className="font-semibold">Riwayat Penarikan</span> di
              halaman profil untuk memantau status.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-1 bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-semibold"
        >
          Kembali ke Profile
        </button>
      </div>
    </>
  );
}
