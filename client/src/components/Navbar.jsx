import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SVGlogo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const isProfilePage = location.pathname === "/profile";
  const actionTo = token ? (isProfilePage ? "/" : "/profile") : "/login";
  const actionLabel = token ? (isProfilePage ? "Home" : "Profile") : "Sign In";

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));

    syncToken();
    window.addEventListener("auth-changed", syncToken);
    window.addEventListener("storage", syncToken);

    return () => {
      window.removeEventListener("auth-changed", syncToken);
      window.removeEventListener("storage", syncToken);
    };
  }, [location.pathname]);

  return (
    <nav className="min-w-6xl  m-auto my-2 h-16 bg-white border-b-2 flex items-center justify-between px-6 select-none rounded-[20px] border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:p-6">
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
        to={actionTo}
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
          hover:translate-x-px
          hover:translate-y-px
          hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
          active:translate-x-0.5
          active:translate-y-0.5
          active:shadow-none
          transition-all
          duration-100
        "
      >
        {actionLabel}
      </NavLink>
    </nav>
  );
}

export default Navbar;
