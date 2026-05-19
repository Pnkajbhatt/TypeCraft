import { NavLink } from "react-router-dom";
import SVGlogo from "../assets/logo.png";

function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="w-full h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2">
        <img src={SVGlogo} alt="Company Logo" className="h-8 w-auto" />
      </NavLink>

      {/* Profile Button */}
      <button
        className="
          border
          border-black
          rounded-full
          px-5
          py-2
          text-sm
          hover:bg-black
          hover:text-white
          transition-all
          duration-300
        "
      >
        {token ? "Profile" : "Guest"}
      </button>
    </nav>
  );
}

export default Navbar;
