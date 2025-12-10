// src/components/EditUserModal.jsx
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function EditUserModal({ open, onClose, user, onSave }) {
  const [role, setRole] = useState("user");
  const [step, setStep] = useState("form"); // "form" | "success"

  useEffect(() => {
    if (open && user) {
      setRole(user.role || "user");
      setStep("form");
    }
  }, [open, user]);

  if (!open || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onSave) return;

    // onSave harus return true kalau sukses
    const ok = await onSave({
      id: user.id,
      role,
    });

    if (ok) {
      setStep("success");
    }
    // kalau tidak ok, biarkan tetap di form (bisa tampil alert dari parent)
  };

  const handleCloseAll = () => {
    setStep("form");
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative">
        {/* Tombol X */}
        <button
          type="button"
          onClick={handleCloseAll}
          className="absolute right-6 top-6 text-green-500 hover:text-green-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        {step === "form" ? (
          <>
            <h2 className="text-xl font-semibold mb-6">Edit User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
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
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
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
            <p className="text-sm text-gray-600 mb-6">
              Berhasil mengedit user.
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
