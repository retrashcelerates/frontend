// src/pages/Admin/datauser.jsx
import React, { useEffect, useState } from "react";
import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";
import { FiEdit2 } from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-deployment-topaz.vercel.app/api";

export default function DataUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMsg("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (!res.ok) {
          setErrorMsg(json?.message || "Gagal memuat daftar user dari server.");
          setLoading(false);
          return;
        }

        setUsers(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        setErrorMsg(
          "Terjadi kesalahan jaringan/server saat memuat daftar user."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex flex-col">
      {/* WRAPPER UTAMA */}
      <div className="flex flex-1 pb-20">
        <Navbaradmin />

        {/* CONTENT */}
        <div className="flex-1 lg:ml-64 px-6 pt-[84px] pb-10">
          {/* HEADER FIXED + SHADOW (di atas konten) */}
          <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#F7F7F7] border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.18)]">
            <div className="h-16 flex items-center justify-between px-6">
              <div>
                <h1 className="font-semibold text-[23px]">Daftar User</h1>
                <p className="text-gray-600 text-[15px]">
                  Kelola data pelanggan bank sampah.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  className="w-10 h-10 rounded-full"
                  alt="profile"
                />
                <div>
                  <p className="font-semibold text-sm">Indi Ariyanti</p>
                  <p className="text-gray-500 text-xs">Admin</p>
                </div>
              </div>
            </div>
          </div>

          {/* ALERT ERROR (kalau ada) */}
          {errorMsg && (
            <div className="mt-4 mb-4 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* TOMBOL TAMBAH */}
          <div className="flex justify-end mb-4">
            <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-md px-4 py-2 shadow-sm transition">
              + Tambah User
            </button>
          </div>

          {/* TABEL */}
          <div className="w-full max-w-5xl mx-auto mt-4">
            <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
              {/* SCROLL AREA UNTUK TABEL */}
              <div className="max-h-[1000px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-semibold text-[14px]">
                    <tr>
                      <th className="py-3 px-4 border-r border-gray-300">
                        Nama User
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300">
                        Email
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300">
                        No. Telp
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300 text-center">
                        Total Sampah
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300 text-center">
                        Tanggal Daftar
                      </th>
                      <th className="py-3 px-4 border-r border-gray-300 text-center">
                        Role
                      </th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-4 px-4 text-center text-gray-500 text-sm"
                        >
                          Memuat data user...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-4 px-4 text-center text-gray-500 text-sm"
                        >
                          Belum ada data user.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition border-t border-gray-200"
                        >
                          <td className="py-3 px-4 border-r border-gray-100">
                            {user.username}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            {user.email}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100">
                            {user.phone || "-"}
                          </td>
                          {/* Total Sampah: belum ada di backend, tampilkan '-' dulu */}
                          <td className="py-3 px-4 border-r border-gray-100 text-center">
                            -
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-center">
                            {formatTanggal(user.created_at)}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-center">
                            {user.role === "admin" ? "Admin" : "Nasabah"}
                          </td>

                          {/* AKSI */}
                          <td className="py-3 px-4 text-center">
                            <button className="p-2 rounded hover:bg-gray-100 text-gray-700">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8" />
        </div>
      </div>

      {/* FOOTER FIXED – SAMPING NAVBAR SAJA */}
      <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <Footeradmin />
      </div>
    </div>
  );
}
