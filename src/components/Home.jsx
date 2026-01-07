import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroimg4 from "../assets/heroimg4.png";
import productsData from "../data/productsData";

import AOS from "aos";
import "aos/dist/aos.css";

const Home = ({ addToCart }) => {
  const [quantities, setQuantities] = useState({});
  const [productt, setProductt] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProductt(productsData);
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
      <section className="hero-section">
        <img src={heroimg4} alt="Fruit-image" data-aos="fade-right" />
        <div className="text-center text-white px-4" data-aos="fade-left">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg text-[#1F2937]">
            Cool <span className="text-[#4B5563]">Down</span> with Fresh Sarbath!
          </h1>
          <p className="text-lg md:text-xl mt-4 drop-shadow-md text-[#1F2937]">
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

      <section className="mt-20 px-6 lg:px-28">
        <h1 className="text-3xl font-bold mb-6 text-center lg:text-left text-[#1F2937]">
          Top Product's
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productt.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="w-full bg-[#ffeeb3] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"

            >
              <div className="p-4 flex flex-col items-center">
                <h2 className="text-xl text-[#1F2937] font-semibold text-center mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Traditional cooling drink
                </p>

                <img
                  src={item.image}
                  alt="product"
                  className="h-44 w-44 object-contain mb-3"
                />
                <div className="flex justify-center items-center w-full mt-2 mb-3">
                  <p className="text-xl font-semibold text-[#1F2937]">
                    ₹ {item.price}.00
                  </p>
                  <p className="text-md text-gray-500 ml-4">
                    750 ml
                  </p>
                </div>


                <div className="flex sm:flex-row items-center justify-center w-full gap-8 mt-3">
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
      <div className="mt-10 text-center lg:text-left px-6 lg:px-28">
        <button
          onClick={() => navigate("/product")}
          className="text-2xl font-medium hover:underline text-[#1F2937]"
        >
          Show More Product's....
        </button>
      </div>
    </>
  );
};

export default Home;

