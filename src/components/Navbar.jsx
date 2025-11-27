import { useState, useEffect } from "react";

const Navbar = () => {
  const [active, setActive] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setActive(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="navbar py-7 flex items-center justify-between">
      <h1 className="text-2xl md:text-3xl font-bold text-[#018E48] cursor-pointer">
        ReTrash
      </h1>

      {/* MENU */}
      <ul
        className={`menu fixed left-1/2 -translate-x-1/2
          flex items-center gap-6 px-6 py-3
          bg-white/40 backdrop-blur-lg rounded-b-2xl shadow
          transition-all duration-300
          ${active ? "top-0 opacity-100" : "-top-10 opacity-0"}
          md:static md:translate-x-0 md:bg-transparent md:opacity-100 md:shadow-none
        `}
      >
        {["beranda", "tentang", "berita", "program", "harga"].map((item) => (
          <li key={item}>
            <button
              onClick={() => scrollToSection(item)}
              className="font-medium hover:text-[#018E48] transition"
            >
              {item === "harga"
                ? "Daftar Harga"
                : item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
