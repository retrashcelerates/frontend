import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataImage from "../data";

const API_BASE_URL = "https://backend-deployment-topaz.vercel.app/api/auth"; 

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      if (!form.email || !form.password) {
        setErrors(["Email dan password wajib diisi."]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
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
        setErrors(msgs.length ? msgs : ["Login gagal, silakan cek kembali email dan password."]);
      } else {
        const token = data?.data?.token;
        const user = data?.data?.user;
        if (token) {
          localStorage.setItem("token", token);
        }
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        setSuccess("Login berhasil. Mengarahkan ke halaman utama...");
        setTimeout(() => {
          navigate("/Dashboard"); 
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setErrors(["Terjadi kesalahan jaringan/server."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-10 rounded-2xl shadow-lg grid md:grid-cols-2 gap-10 w-[900px]">
        {/* IMAGE */}
        <img
          src={DataImage.LoginImage}
          className="rounded-xl object-cover w-full h-full"
          alt="Login ReTrash"
        />

        {/* FORM */}
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Login Akun <span className="text-green-600">ReTrash</span>
          </h1>

          <p className="text-sm text-gray-500 mb-4">
            Pengguna terdaftar dapat masuk menggunakan email dan kata sandi.
          </p>

          {/* Error message */}
          {errors.length > 0 && (
            <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 space-y-1">
              {errors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-green-600 underline"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
