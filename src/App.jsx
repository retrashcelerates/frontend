import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Homepage from "./pages/homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Berita from "./pages/berita";
import DetailBerita from "./pages/Detailberita";
import Daftarharga from "./pages/Daftarharga";

import AdminBerita from "./pages/Admin/berita";

function App() {
  return (
    <Routes>
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
        path="/Berita"
        element={
          <>
            <Navbar />
            <div className="pt-16" />
            <Berita />
            <Footer />
          </>
        }
      />

      <Route
        path="/berita/:id"
        element={
          <>
            <Navbar />
            <div className="pt-16" />
            <DetailBerita />
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

      <Route path="/admin/berita" element={<AdminBerita />} />

    </Routes>
  );
}

export default App;
