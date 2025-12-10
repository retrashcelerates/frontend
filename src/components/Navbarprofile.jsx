import React, { useState, useEffect } from "react";
import DataImage from "../data";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // 🔹 ambil user dari localStorage (username + avatar_url)
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      }
    } catch (err) {
      console.error("Gagal parse user dari localStorage di Navbar:", err);
    }
  }, []);

  const NAVBAR_HEIGHT = 80;

  const menu = [
    { name: "Beranda", type: "scroll", target: "beranda" },
    { name: "Tentang Kami", type: "route", path: "/tentang" },
    { name: "Berita", type: "route", path: "/Berita" },
    { name: "Program", type: "route", path: "/Setorform" },
    { name: "Daftar Harga", type: "route", path: "/Daftarharga" },
  ];

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.offsetTop - NAVBAR_HEIGHT;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  const handleNavigateAndScroll = (target) => {
    setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => handleScroll(target), 300);
    } else {
      handleScroll(target);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setOpen(false);
  };

  // 🔹 komponen kecil untuk avatar (dipakai di desktop & mobile)
  const ProfileAvatar = ({ size = 36 }) => {
    const baseClass = `rounded-full object-cover`;
    const dimClass = size === 36 ? "w-9 h-9" : "w-9 h-9"; // bisa diubah kalau mau beda
    const fallbackInitial =
      user?.username
        ?.split(" ")
        .map((s) => s[0])
        .join("")
        .toUpperCase() || "U";

    if (user?.avatar_url) {
      return (
        <img
          src={user.avatar_url}
          alt={user.username || "Profil"}
          className={`${dimClass} ${baseClass}`}
        />
      );
    }

    return (
      <span
        className={`${dimClass} flex items-center justify-center font-semibold text-xs`}
      >
        {fallbackInitial}
      </span>
    );
  };

  return (
    <nav className="w-full bg-white shadow-xs fixed top-0 left-0 z-50 h-20 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => handleNavigateAndScroll("beranda")}
          className="flex items-center"
        >
          <img
            src={DataImage.Logoimage}
            alt="ReTrash Logo"
            className="h-7 w-auto"
          />
        </button>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex space-x-3 text-sm">
            {menu.map((item) =>
              item.type === "route" ? (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    px-4 py-2 rounded-lg font-medium cursor-pointer
                    transition-all duration-300 ease-out
                    ${
                      isActive
                        ? "bg-black text-white shadow-md scale-[1.03]"
                        : "text-gray-700 hover:bg-black hover:text-white hover:shadow-md hover:scale-[1.03]"
                    }
                  `
                  }
                >
                  {item.name}
                </NavLink>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavigateAndScroll(item.target)}
                  className="
                    px-4 py-2 rounded-lg text-gray-700 cursor-pointer
                    transition-all duration-300 ease-out
                    hover:bg-black hover:text-white hover:shadow-md hover:scale-[1.03]
                  "
                >
                  {item.name}
                </button>
              )
            )}
          </div>

          {/* TOMBOL PROFIL DESKTOP – isi avatar user */}
          <button
            onClick={handleProfileClick}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400
                       flex items-center justify-center text-white font-semibold text-xs
                       border border-white shadow-md hover:shadow-lg hover:scale-105
                       transition-all duration-300 overflow-hidden"
            aria-label="Profil"
          >
            <ProfileAvatar />
          </button>
        </div>

        {/* HAMBURGER (MOBILE) */}
        <button
          className="md:hidden flex flex-col gap-[5px]"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`block w-7 h-[3px] bg-black rounded transition-all duration-300 ${
              open ? "rotate-45 translate-y-[8px]" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-[3px] bg-black rounded transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-[3px] bg-black rounded transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-[8px]" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`
          md:hidden fixed top-20 left-0 w-full bg-white shadow-lg border-t
          transition-all duration-300 overflow-hidden
          ${open ? "max-h-[340px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <ul className="flex flex-col px-6 py-4 space-y-3">
          {/* Profile di mobile */}
          <li className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
            <div className="text-sm text-gray-600">
              <p className="font-semibold">Hallo, {user?.username || "User"}</p>
              <p className="text-xs text-gray-400">Lihat profil Anda</p>
            </div>
            <button
              onClick={handleProfileClick}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400
                         flex items-center justify-center text-white font-semibold text-xs
                         border border-white shadow-md overflow-hidden"
            >
              <ProfileAvatar />
            </button>
          </li>

          {menu.map((item) =>
            item.type === "route" ? (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                  block px-4 py-2 rounded-lg font-medium
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-black hover:text-white hover:shadow-md"
                  }
                `
                }
              >
                {item.name}
              </NavLink>
            ) : (
              <button
                key={item.name}
                onClick={() => handleNavigateAndScroll(item.target)}
                className="
                  block text-left px-4 py-2 rounded-lg text-gray-700 w-full
                  transition-all duration-300 ease-out
                  hover:bg-black hover:text-white hover:shadow-md
                "
              >
                {item.name}
              </button>
            )
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
