import { Routes, Route, useLocation } from "react-router-dom";

import NavbarWrapper from "./components/NavbarWrapper";
import Footer from "./components/Footer";

import Homepage from "./pages/homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Daftarharga from "./pages/Daftarharga";
import Setor from "./pages/Setor";
import Setorform from "./pages/Setorform";
import Profile from "./pages/profile";
import Berita from "./pages/berita";
import BeritaDetail from "./pages/Detailberita";

/* ✅ ADMIN */
import BerandaAdmin from "./pages/Admin/beranda";
import DaftarHargaAdmin from "./pages/Admin/daftarharga";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* NAVBAR USER / GUEST (bukan untuk admin) */}
      {!isAdminRoute && <NavbarWrapper />}
      {!isAdminRoute && <div className="pt-20" />}

      <Routes>
        {/* USER / PUBLIC */}
        <Route path="/" element={<Homepage />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:id" element={<BeritaDetail />} />
        <Route path="/daftarharga" element={<Daftarharga />} />
        <Route path="/setor" element={<Setor />} />
        <Route path="/setorform" element={<Setorform />} />
        <Route path="/profile" element={<Profile />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN – di dalam komponen ini kamu bebas pakai Navbaradmin sendiri */}
        <Route path="/admin/beranda" element={<BerandaAdmin />} />
        <Route path="/admin/daftarharga" element={<DaftarHargaAdmin />} />
      </Routes>

      {/* FOOTER USER (tidak muncul di admin) */}
      {!isAdminRoute && (
        <>
          <div className="pt-20" />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
