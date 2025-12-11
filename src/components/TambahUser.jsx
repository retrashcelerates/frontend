// src/components/AddUserModal.jsx
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function AddUserModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
  });

  const [step, setStep] = useState("form"); // "form" | "success"

  useEffect(() => {
    if (open) {
      setForm({
        username: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
      });
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

    const ok = await onSave(form); // harus return true

    if (ok) {
      setStep("success");
    }
  };

  const handleCloseAll = () => {
    setStep("form");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative">

        {/* Tombol Close */}
        <button
          type="button"
          onClick={handleCloseAll}
          className="absolute right-6 top-6 text-green-500 hover:text-green-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        {step === "form" ? (
          <>
            <h2 className="text-xl font-semibold mb-6">Tambah User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium mb-1">Nama User</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Masukkan nama user"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Masukkan nomor telepon"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
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
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan password user"
                  value={form.password}
                  onChange={handleChange}
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
          // POPUP SUCCESS
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
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
            <p className="text-sm text-gray-600 mb-6">
              User berhasil ditambahkan.
            </p>

            <button
              type="button"
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
