import { NavLink } from "react-router-dom";
import SVGlogo from "../assets/logo.png";

function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="w-full h-16 bg-white border-b-2 border-black flex items-center justify-between px-6 select-none">
      {/* Logo Wrapper */}
      <NavLink
        to="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img
          src={SVGlogo}
          alt="TypeCraft Logo"
          className="h-6 w-auto object-contain grayscale invert-0"
        />
      </NavLink>

      {/* Action / Profile Button */}
      <NavLink
        to={token ? "/profile" : "/login"}
        className="
          border 
          border-black 
          rounded-none 
          px-5 
          py-1.5 
          text-xs 
          uppercase 
          tracking-wider 
          font-bold 
          bg-white 
          text-black
          shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
          hover:translate-x-[1px]
          hover:translate-y-[1px]
          hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
          active:translate-x-[2px]
          active:translate-y-[2px]
          active:shadow-none
          transition-all
          duration-100
        "
      >
        {token ? "Profile" : "Sign In"}
      </NavLink>
    </nav>
  );
}

export default Navbar;
