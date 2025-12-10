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

/* ADMIN */
import BerandaAdmin from "./pages/Admin/beranda";
import BeritaAdmin from "./pages/Admin/berita";
import DaftarHargaAdmin from "./pages/Admin/daftarharga";
import LokasiAdmin from "./pages/Admin/datalokasi";
import DataUser from "./pages/Admin/datauser";

function App() {
  const location = useLocation();

  // Navbar hilang di admin & detail berita
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/berita/");

  // Footer hilang hanya di admin
  const hideFooter = location.pathname.startsWith("/admin");

  return (
    <>
      {/* NAVBAR */}
      {!hideNavbar && <NavbarWrapper />}
      {!hideNavbar && <div className="pt-20" />}

      <Routes>
        {/* USER */}
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

        {/* ADMIN */}
        <Route path="/admin/beranda" element={<BerandaAdmin />} />
        <Route path="/admin/berita" element={<BeritaAdmin />} />
        <Route path="/admin/daftarharga" element={<DaftarHargaAdmin />} />
        <Route path="/admin/datalokasi" element={<LokasiAdmin />} />
        <Route path="/admin/datauser" element={<DataUser />} />
      </Routes>

      {/* FOOTER */}
      {!hideFooter && <Footer />}
    </>
  );
}

export default App;
