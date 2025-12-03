import { useState, useEffect } from "react";

const Navbar = () => {
  const [active, setActive] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: el.offsetTop - 80,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const onScroll = () => setActive(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`
        navbar w-full flex items-center justify-between 
        py-5 px-6 md:px-12
        bg-gray-100 backdrop-blur-md shadow-sm 
        fixed top-0 left-0 z-50 transition-all
        ${active ? "py-3 shadow-md" : "py-5"}
      `}
    >
      <h1 className="text-2xl md:text-3xl font-bold text-[#018E48] cursor-pointer">
        ReTrash
      </h1>

      <ul
        className={`
          menu fixed left-1/2 -translate-x-1/2
          flex items-center gap-6 px-6 py-3
          bg-white/40 backdrop-blur-lg rounded-b-2xl shadow-md
          transition-all duration-300
          ${active ? "top-0 opacity-100" : "-top-10 opacity-0"}
          md:static md:translate-x-0 md:bg-transparent md:shadow-none md:opacity-100
        `}
      >
        {["beranda", "tentang", "berita", "program", "harga"].map((item) => (
          <li key={item}>
            <button
              onClick={() => {
                if (item === "harga") {
                  window.location.href = "/";
                } else {
                  scrollToSection(item);
                }
              }}
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
