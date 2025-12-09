import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataImage from "../data";

const API_BASE_URL = "https://backend-deployment-topaz.vercel.app/api/auth"; 


export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    address: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);  
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");
    setLoading(true);

    try {
      if (!form.username || !form.email || !form.password) {
        setErrors(["Nama, email, dan password wajib diisi."]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          address: form.address || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msgs = [];
        if (data.errors && Array.isArray(data.errors)) {
          msgs.push(...data.errors);
        }
        if (data.message && !msgs.includes(data.message)) {
          msgs.push(data.message);
        }
        setErrors(msgs.length ? msgs : ["Registrasi gagal, silakan coba lagi."]);
      } else {
        setSuccess("Registrasi berhasil, silakan login.");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setErrors(["Terjadi kesalahan jaringan / server."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-10 rounded-2xl shadow-lg grid md:grid-cols-2 gap-10 w-[900px]">
        <img
          src={DataImage.LoginImage}
          className="rounded-xl object-cover w-full h-full"
          alt="Register ReTrash"
        />

        <div>
          <h1 className="text-2xl font-bold mb-1">
            Register Akun <span className="text-green-600">ReTrash</span>
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Daftarkan akunmu untuk mulai mengelola transaksi sampah.
          </p>

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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              className="w-full border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Alamat"
              className="w-full border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Kata Sandi"
              className="w-full border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black text-white py-2 rounded-lg text-sm font-medium transition 
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600"}`}
            >
              {loading ? "Memproses..." : "Register"}
            </button>
          </form>

          <p className="mt-4 text-sm">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-600 underline"
            >
              Login Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
