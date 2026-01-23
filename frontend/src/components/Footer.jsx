import React from "react";
import logo from "../assets/logo.webp";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#F4F6FD] text-[#1F2937] mt-16">
      <hr className="border-gray-300" />
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

        <div className="flex justify-center md:justify-start">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#814BF6] flex items-center justify-center">
            <img
              src={logo}
              alt="logo"
              className="w-20 h-20 md:w-20 md:h-20 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2 text-base">
          <Link to="/" className="hover:text-[#814BF6] transition">
            Home
          </Link>
          <Link to="/product" className="hover:text-[#814BF6] transition">
            Products
          </Link>
          <Link to="/cart" className="hover:text-[#814BF6] transition">
            Cart
          </Link>
          <Link to="/contact" className="hover:text-[#814BF6] transition">
            Contact
          </Link>
        </div>

        <div className="flex flex-col items-start md:items-end space-y-2 text-sm text-[#4B5563]">
          <p className="flex items-center gap-2 hover:text-[#814BF6] transition">
            <span>📞</span>
            <span>+91 9865298470</span>
          </p>

          <p className="flex items-center gap-2 hover:text-[#814BF6] transition">
            <span>📧</span>
            <span>selvamsarbathshop@gmail.com</span>
          </p>

          <a
            href="https://wa.me/919345866691"
            className="flex items-center gap-2 hover:text-green-500 transition"
          >
            <FaWhatsapp />
            <span>+91 9345866691</span>
          </a>
        </div>
      </div>

      <hr className="border-gray-300" />

      <p className="text-center text-sm text-[#6B7280] py-4">
        © 2026 Selvam Sarbath. All Rights Reserved.
      </p>
    </footer>
  );

};

export default Footer;
