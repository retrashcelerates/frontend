// src/components/AddUserModal.jsx
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";


import {
  validateUsername,
  validateEmail,
  validatePhone,
  validatePassword,
  validateRole,
  combineErrors
} from "../pages/validasi/validasi"; 


export default function AddUserModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
  });

  const [step, setStep] = useState("form"); // "form" | "success"
  const [errors, setErrors] = useState([]); // menampung error FE

  useEffect(() => {
    if (open) {
      setForm({
        username: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
      });
      setErrors([]);
      setStep("form");
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 VALIDASI FE
    const validationErrors = combineErrors(
      validateUsername(form.username),
      validateEmail(form.email),
      validatePhone(form.phone),
      validatePassword(form.password),
      validateRole(form.role)
    );

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return; // stop submit
    }

    // Kirim ke backend
    const ok = await onSave(form);
    if (ok) {
      setStep("success");
      setErrors([]);
    }
  };

  const handleCloseAll = () => {
    setStep("form");
    setErrors([]);
    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-[60] 
        bg-black/40 
        overflow-y-auto        /* ⬅️ SCROLL LUAR */
        flex items-start justify-center
        py-10                  /* ⬅️ Biar modal tidak nempel atas */
      "
    >
      {/* CARD MODAL — tidak scroll */}
      <div
        className="
          bg-white rounded-2xl shadow-xl
          w-full max-w-2xl p-8 
          relative
        "
      >

        {/* Tombol X */}
        <button
          onClick={handleCloseAll}
          className="absolute right-6 top-6 text-green-500 hover:text-green-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        {step === "form" ? (
          <>
            <h2 className="text-xl font-semibold mb-6">Tambah User</h2>

            {/* ERROR VALIDASI */}
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
                <ul className="text-red-600 text-sm list-disc ml-5">
                  {errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="text-sm font-medium mb-1 block">Nama User</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Masukkan nama user"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Masukkan email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Nomor Telepon</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Masukkan nomor telepon"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-2 rounded-md"
                >
                  Simpan
                </button>
              </div>

            </form>
          </>
        ) : (
          // POPUP SUKSES
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-4 flex items-center justify-center h-18 w-18 rounded-full bg-green-500">
              <svg
                className="h-14 w-14 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold mb-1">Sukses</h3>
            <p className="text-sm text-gray-600 mb-10">
              User berhasil ditambahkan.
            </p>

            <button
              onClick={handleCloseAll}
              className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
            >
              Oke
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
