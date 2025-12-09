import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Navbarprofil from "./components/Navbarprofile";

import Homepage from "./pages/homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Berita from "./pages/berita";
import DetailBerita from "./pages/Detailberita";
import Daftarharga from "./pages/Daftarharga";

function App() {
  return (
    <Routes>
      {/* ================= USER (BELUM LOGIN) ================= */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <div className="pt-16" />
            <Homepage />
            <Footer />
          </>
        }
      />

      <Route
        path="/daftarharga"
        element={
          <>
            <Navbar />
            <div className="pt-16" />
            <Daftarharga />
            <Footer />
          </>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
