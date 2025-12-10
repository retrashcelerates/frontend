// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";

import NavbarWrapper from "./components/NavbarWrapper";
import FooterWrapper from "./components/FooterWrapper";
import ScrollToTop from "./components/ScrollToTop";

// USER PAGES
import Homepage from "./pages/homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Daftarharga from "./pages/Daftarharga";
import Setor from "./pages/Setor";
import Setorform from "./pages/Setorform";
import Profile from "./pages/profile";
import Berita from "./pages/berita";
import BeritaDetail from "./pages/Detailberita";
import Tentang from "./pages/Tentang";
import Lokasi from "./pages/Lokasi";

/* ADMIN */
import BerandaAdmin from "./pages/Admin/beranda";
import BeritaAdmin from "./pages/Admin/berita";
import DaftarHargaAdmin from "./pages/Admin/daftarharga";
import LokasiAdmin from "./pages/Admin/datalokasi";
import DataUser from "./pages/Admin/datauser";

function App() {
  const location = useLocation();

  // ✅ halaman TANPA navbar & footer
  const hideLayoutRoutes = [
    "/login",
    "/register",
    "/profile",
    "/lokasi", // pakai lowercase, sesuai route
  ];

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDetailBerita = location.pathname.startsWith("/berita/"); // /berita/:id

  const hideLayout =
    hideLayoutRoutes.includes(location.pathname) ||
    isDetailBerita ||
    isAdminRoute;

  return (
    <>
      {/* supaya setiap pindah route auto scroll ke atas */}
      <ScrollToTop />

      {/* NAVBAR cuma muncul kalau bukan halaman yang disembunyikan */}
      {!hideLayout && <NavbarWrapper />}

      <Routes>
        {/* USER */}
        <Route path="/" element={<Homepage />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:id" element={<BeritaDetail />} />
        <Route path="/daftarharga" element={<Daftarharga />} />
        <Route path="/setor" element={<Setor />} />
        <Route path="/setorform" element={<Setorform />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/lokasi" element={<Lokasi />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN */}
        <Route path="/admin/beranda" element={<BerandaAdmin />} />
        <Route path="/admin/berita" element={<BeritaAdmin />} />
        <Route path="/admin/daftarharga" element={<DaftarHargaAdmin />} />
        <Route path="/admin/datalokasi" element={<LokasiAdmin />} />
        <Route path="/admin/datauser" element={<DataUser />} />
      </Routes>

      {/* FOOTER juga ikut aturan hideLayout */}
      {!hideLayout && <FooterWrapper />}
    </>
  );
}

export default App;
