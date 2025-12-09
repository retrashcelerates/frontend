import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Navbarprofil from "./components/Navbarprofile";

import Homepage from "./pages/homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Daftarharga from "./pages/Daftarharga";
import Setor from "./pages/Setor";
import Setorform from "./pages/Setorform";
import Profile from "./pages/profile";

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
          path="/setor"
          element={
            <>
              <Navbar />
              <div className="pt-20" />
              <Setor />
              <div className="pt-20" />
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

        <Route
          path="/dashboard"
          element={
            <>
              <Navbarprofil />
              <div className="pt-16" />
              <Homepage />
              <Footer />
            </>
          }
        />

        <Route
          path="/setorform"
          element={
            <>
              <Navbarprofil />
              <div className="pt-20" />
              <Setorform />
              <Footer />
            </>
          }
        />

        <Route
          path="/daftarhargalogin"
          element={
            <>
              <Navbarprofil />
              <div className="pt-20" />
              <Daftarharga />
              <Footer />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <Profile />
              <Footer />
            </>
          }
        />

      </Routes>
  );
}

export default App;
