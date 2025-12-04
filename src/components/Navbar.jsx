import React, { useState } from "react";
import DataImage from "../data";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Beranda", type: "scroll", target: "beranda" },
    { name: "Tentang Kami", type: "scroll", target: "tentang" },
    { name: "Berita", type: "route", path: "/berita" },
    { name: "Program", type: "route", path: "/Setor" },
    { name: "Daftar Harga", type: "route", path: "/Daftarharga" },
  ];

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavigateAndScroll = (target) => {
    setOpen(false); // tutup menu mobile

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => handleScroll(target), 300);
    } else {
      handleScroll(target);
    }
  };

  return (
    <nav className="w-full bg-white shadow-xs fixed top-0 left-0 z-50 h-20 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* LOGO */}
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

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-3 text-sm">

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

        {/* BURGER ICON (MOBILE) */}
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
          ${open ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <ul className="flex flex-col px-6 py-4 space-y-3">

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
