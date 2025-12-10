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

  // Reset form setiap modal dibuka
  useEffect(() => {
    if (open) {
      setForm({
        username: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
      });
    }
  }, [open]);

  if (!open) return null; // kalau tidak open → tidak render

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative">
        
        {/* Tombol X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-green-500 hover:text-green-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Judul */}
        <h2 className="text-xl font-semibold mb-6">Tambah User</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nama User */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama User</label>
            <input
              type="text"
              name="username"
              placeholder="Masukkan nama user"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
            <input
              type="text"
              name="phone"
              placeholder="Masukkan nomor telepon"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password — field baru */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password user"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-2 rounded-md"
            >
              Simpan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
