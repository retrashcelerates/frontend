// src/components/NavbarWrapper.jsx
import Navbar from "./Navbar";
import Navbarprofile from "./Navbarprofile";

const NavbarWrapper = () => {
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
