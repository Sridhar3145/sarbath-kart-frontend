import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import logo from "../assets/logo.webp";
import { useNavigate } from "react-router-dom";

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

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };


  const ADMIN_EMAIL = "sridhar314507@gmail.com";

  const isAdmin =
    localStorage.getItem("token") &&
    localStorage.getItem("email") === ADMIN_EMAIL;


  const handleToggle = () => setToggleMenu((prev) => !prev);

  const navLinkClass =
    "relative font-head hover:scale-110 transition-transform duration-300 hover:text-[#1F2937] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300";

  return (
    <>
      <nav className="relative bg-[#f9db79] text-black px-4 md:px-12 py-3 z-50 border-b-2 border-black">
        <div className="flex justify-between items-center md:hidden relative">
          <div className="flex items-center gap-3">
            <button onClick={handleToggle} className="text-2xl font-bold">
              ☰
            </button>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="w-20 h-20 rounded-full bg-black flex items-center justify-center overflow-hidden"
            >
              <img src={logo} alt="logo" className="w-20 h-20 object-contain" />
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/signup">
              <FaUserAlt className="w-7 h-7 text-black" />
            </Link>
            <Link to="/cart" className="relative">
              <PiShoppingCartSimpleBold className="w-8 h-8 text-black" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount > 0 ? cartCount : 0}
              </span>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-between items-center">
          <Link
            to="/"
            className="w-20 h-20 rounded-full bg-black flex items-center justify-center overflow-hidden"
          >
            <img src={logo} alt="logo" className="w-24 h-24 object-contain" />
          </Link>

          <div className="flex space-x-8 text-lg font-semibold">
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

          <div className="flex items-center gap-6">
            <Link to="/signup">
              <FaUserAlt className="w-7 h-7 text-black" />
            </Link>
            <Link to="/cart" className="relative">
              <PiShoppingCartSimpleBold className="w-8 h-8 text-black" />

              {cartCount > 0 ? (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              ) : (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  0
                </span>
              )}
            </Link>
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                if (token) {
                  navigate(cartCount > 0 ? "/checkout" : "/product");
                } else {
                  navigate("/login");
                }
              }}
              className="bg-black text-[#f9db79] px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Buy Now
            </button>
            {!username ? (
              <Link
                to="/login"
                className="bg-black text-[#f9db79] px-4 py-2 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-black text-[#f9db79] px-4 py-2 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {toggleMenu && (
        <div className="md:hidden fixed top-20 left-0 right-0 z-50 flex justify-left">
          <div
            onTouch
            className="bg-yellow-400 text-black px-5 py-8 space-y-4 text-left shadow-2xl rounded-xl w-full max-w-70 "
          >
            <Link
              to="/"
              onClick={handleToggle}
              className="block text-lg font-medium hover:text-yellow-600 transition"
            >
              Home
            </Link>
            <Link
              to="/product"
              onClick={handleToggle}
              className="block text-lg font-medium hover:text-yellow-600 transition"
            >
              Products
            </Link>
            <Link
              to="/cart"
              onClick={handleToggle}
              className="block text-lg font-medium hover:text-yellow-600 transition"
            >
              Cart
            </Link>
            <Link
              to="/contact"
              onClick={handleToggle}
              className="block text-lg font-medium hover:text-yellow-600 transition"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link to="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
            )}

            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                if (token) {
                  navigate(cartCount > 0 ? "/checkout" : "/product");
                } else {
                  navigate("/login");
                }
                handleToggle();
              }}
              className="bg-black text-[#f9db79] px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors "
            >
              Buy Now
            </button>
            {!username ? (
              <Link
                to="/login"
                onClick={() => {
                  handleLogout();
                  handleToggle();
                }}
                className="bg-black text-[#f9db79] px-4 py-2 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors ml-3"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  handleToggle();
                }}
                className="bg-black text-[#f9db79] px-4 py-2 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors ml-3"
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
