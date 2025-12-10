import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Navbarprofile from "./Navbarprofile";
// Navbaradmin tidak dipakai di sini lagi

const NavbarWrapper = () => {
  const location = useLocation();

  // halaman yang TIDAK pakai navbar user/navbar profile
  const hideNavbarRoutes = ["/login", "/register", "/profile", ];

  // ❌ SEMUA route admin tidak pakai NavbarWrapper
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

  // user login biasa → Navbarprofile
  if (user) {
    return <Navbarprofile />;
  }

  // belum login → Navbar umum
  return <Navbar />;
};

export default NavbarWrapper;
