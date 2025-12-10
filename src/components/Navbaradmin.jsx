import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaNewspaper,
  FaTags,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function Navbaradmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <FaHome />, path: "/admin/beranda" },
    { name: "Berita", icon: <FaNewspaper />, path: "/admin/berita" },
    { name: "Daftar Harga", icon: <FaTags />, path: "/admin/daftarharga" },
    { name: "Lokasi Setor", icon: <FaMapMarkerAlt />, path: "/admin/datalokasi" },
    { name: "Daftar User", icon: <FaUsers />, path: "/admin/datauser" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* TOP NAV MOBILE */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow z-50">
        <div className="flex items-center justify-between h-16 px-5">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl text-gray-800 hover:text-green-600 transition"
          >
            <FaBars />
          </button>

          <h1 className="text-xl font-bold text-green-600">Retrash Admin</h1>
          <div className="w-6"></div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl
          transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 shadow-sm bg-white">
          <h1 className="text-2xl font-bold text-green-600">Retrash</h1>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-xl text-gray-700 hover:text-green-600 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 px-4">
          <ul className="space-y-2">
            {menu.map((item, i) => (
              <li key={i}>
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[15px] transition 
                    ${
                      location.pathname === item.path
                        ? "bg-green-600 text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 absolute bottom-5 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full py-2.5 rounded-lg transition"
          >
            <FaSignOutAlt /> Keluar
          </button>
        </div>
      </div>

      {/* Overlay Mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 lg:hidden z-40"
        ></div>
      )}
    </>
  );
}
