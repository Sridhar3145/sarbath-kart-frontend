import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import logo from "../assets/logo.webp";
import toast from "react-hot-toast";

const Navbar = ({ cartCount = 2 }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("username");
      setUsername(storedUser || "");
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    window.dispatchEvent(new Event("storage"));
    toast.success('Logout SuccessFully !!')
    navigate("/login");
  };

  const ADMIN_EMAIL = "sridhar314507@gmail.com";
  const isAdmin =
    localStorage.getItem("token") &&
    localStorage.getItem("email") === ADMIN_EMAIL;

  const navLinkClass =
    "relative font-medium hover:text-[#814BF6] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#814BF6] hover:after:w-full after:transition-all";

  return (
    <>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 md:px-12 py-4 border-b border-gray-200">

        <div className="flex justify-between items-center md:hidden relative">
          <button
            onClick={() => setToggleMenu(!toggleMenu)}
            className="text-2xl font-bold"
          >
            ☰
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link
              to="/"
              className="w-14 h-14 rounded-full bg-[#814BF6] flex items-center justify-center"
            >
              <img src={logo} alt="logo" className="w-14 h-14 object-contain" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/signup">
              <FaUserAlt className="w-7 h-7 text-[#814BF6]" />
            </Link>
            <Link to="/cart" className="relative">
              <PiShoppingCartSimpleBold className="w-7 h-7 text-[#814BF6]" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-between items-center">
          <Link
            to="/"
            className="w-20 h-20 rounded-full bg-[#814BF6] flex items-center justify-center"
          >
            <img
              src={logo}
              alt="logo"
              className="w-20 h-20 object-contain"
            />
          </Link>


          <div className="flex gap-10 text-lg">
            <Link to="/" className={navLinkClass}>
              Home
            </Link>
            <Link to="/product" className={navLinkClass}>
              Products
            </Link>
            <Link to="/cart" className={navLinkClass}>
              Cart
            </Link>
            <Link to="/contact" className={navLinkClass}>
              Contact
            </Link>
            {isAdmin && (
              <Link to="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-5">
            <Link to="/signup">
              <FaUserAlt className="w-9 h-9 bg-[#F4F6FD] text-[#814BF6] rounded-full p-2" />
            </Link>

            <Link to="/cart" className="relative">
              <PiShoppingCartSimpleBold className="w-7 h-7 text-[#814BF6]" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            </Link>

            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                token
                  ? navigate(cartCount > 0 ? "/checkout" : "/product")
                  : navigate("/login");
              }}
              className="bg-[#814BF6] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#6d3df0]"
            >
              Buy Now
            </button>

            {!username ? (
              <Link
                to="/login"
                className="border border-[#814BF6] text-[#814BF6] px-5 py-2 rounded-full font-semibold hover:bg-[#814BF6] hover:text-white transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="border border-[#814BF6] text-[#814BF6] px-5 py-2 rounded-full font-semibold hover:bg-[#814BF6] hover:text-white transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {toggleMenu && (
        <div className="md:hidden fixed top-20 left-0 right-0 z-40 flex justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4 w-[90%]">
            {["/", "/product", "/cart", "/contact"].map((path, i) => (
              <Link
                key={i}
                to={path}
                onClick={() => setToggleMenu(false)}
                className="block text-lg font-medium text-[#1F2937] hover:text-[#814BF6]"
              >
                {path === "/"
                  ? "Home"
                  : path.replace("/", "").charAt(0).toUpperCase() +
                  path.slice(2)}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/dashboard"
                onClick={() => setToggleMenu(false)}
                className="block text-lg font-medium hover:text-[#814BF6]"
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                token
                  ? navigate(cartCount > 0 ? "/checkout" : "/product")
                  : navigate("/login");
                setToggleMenu(false);
              }}
              className="bg-[#814BF6] text-white px-4 py-2 rounded-lg font-semibold"
            >
              Buy Now
            </button>

            {!username ? (
              <Link
                to="/login"
                onClick={() => setToggleMenu(false)}
                className="block border border-[#814BF6] text-[#814BF6] px-4 py-2 rounded-lg font-semibold text-center"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setToggleMenu(false);
                }}
                className="w-full border border-[#814BF6] text-[#814BF6] px-4 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
