import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fruitimg2 from "../assets/fruitimg2.webp";

import AOS from "aos";
import "aos/dist/aos.css";

const Home = ({ addToCart }) => {
  const [quantities, setQuantities] = useState({});
  const [productt, setProductt] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProductt(data);
      });
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  const increaseQty = (_id) => {
    setQuantities((prev) => ({
      ...prev,
      [_id]: (prev[_id] || 1) + 1,
    }));
  };

  const decreaseQty = (_id) => {
    setQuantities((prev) => ({
      ...prev,
      [_id]: prev[_id] > 1 ? prev[_id] - 1 : 1,
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    addToCart({ ...product, quantity });
    navigate("/cart");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <img src={fruitimg2} data-aos="fade-right" />
        <div className="text-center text-white px-4" data-aos="fade-left">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg text-black">
            Cool <span className="text-white">Down</span> with Fresh Sarbath!
          </h1>
          <p className="text-lg md:text-xl mt-4 drop-shadow-md text-black">
            Taste the best flavors in town, made fresh for you. 🍹
          </p>
          <button
            onClick={() => navigate("/product")}
            className="hero-btn"
            data-aos="zoom-in"
          >
            More Products
          </button>
        </div>
      </section>

      {/* Top Products Section */}
      <section className="mt-20 px-6 lg:px-28">
        <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
          Top Product's
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productt.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="w-full bg-yellow-400 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 duration-300"
            >
              <div className="p-6 flex flex-col items-center">
                <h2 className="text-xl text-black font-semibold text-center mb-2">
                  {item.title}
                </h2>
                <img
                  src={item.image}
                  alt="product"
                  className="h-56 w-56 object-contain mb-4"
                />
                <p className="text-lg font-bold text-black mb-2">
                  ₹ {item.price}.00
                </p>

                <div className="flex sm:flex-row items-center justify-center w-full gap-10 mt-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="atc-btn"
                  >
                    Add to Cart
                  </button>

                  <div className="quantity-box">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="px-3 text-lg text-yellow">
                      {quantities[item._id] || 1}
                    </span>
                    <button
                      onClick={() => increaseQty(item._id)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Show More Button */}
      <div className="mt-10 text-center lg:text-left px-6 lg:px-28">
        <button
          onClick={() => navigate("/product")}
          className="text-2xl font-medium hover:underline"
        >
          Show More Product's....
        </button>
      </div>
    </>
  );
};

export default Home;
