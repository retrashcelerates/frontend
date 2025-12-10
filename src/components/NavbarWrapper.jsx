// src/components/NavbarWrapper.jsx
import { useLocation } from "react-router-dom";   // <-- WAJIB ADA
import Navbar from "./Navbar";
import Navbarprofile from "./Navbarprofile";

const NavbarWrapper = () => {
  const location = useLocation();

  // halaman yang TIDAK pakai navbar user/navbar profile
  const hideNavbarRoutes = ["/login", "/register", "/profile"];

  // SEMUA route admin tidak pakai NavbarWrapper
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (hideNavbarRoutes.includes(location.pathname) || isAdminRoute) {
    return null;
  }

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // user login → pakai navbar profile
  if (user) return <Navbarprofile />;

  // user belum login → navbar biasa
  return <Navbar />;
};

export default NavbarWrapper;
