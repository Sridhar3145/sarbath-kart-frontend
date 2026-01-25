import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hero3 from "../assets/hero3.png";


import AOS from "aos";
import "aos/dist/aos.css";

const Home = ({ addToCart }) => {
  const [quantities, setQuantities] = useState({});
  const [productt, setProductt] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);
  console.log(import.meta.env.VITE_API_URL);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/products`
        );


        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data);

        setProductt(data);
      } catch (error) {
        console.error("Fetch failed:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

    addToCart(product, quantity);

    navigate("/cart");
  };

  return (
    <>
      <section className="hero-section">
        <img
          src={hero3}
          alt="Fruit-image"
          data-aos="fade-right"
          className="w-[38%] h-[38%] object-contain"
        />

        <div className="text-center text-white px-4" data-aos="fade-left">
          <h1 className="text-5xl md:text-6xl font-bold text-[#814BF6]">
            Cool{" "}
            <span className="bg-gradient-to-r from-[#814BF6] to-[#A78BFA] bg-clip-text text-transparent">
              Down
            </span>{" "}
            with Fresh Sarbath!
          </h1>

          <p className="text-lg md:text-xl mt-4 text-[#4B5563]">
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
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left text-[#1F2937]">
          Top Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {productt.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-6 flex flex-col items-center text-center">

                <div className="bg-[#F4F6FD] rounded-xl p-4 mb-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                    alt={item.title}
                    className="h-44 w-44 object-contain drop-shadow-lg"
                  />
                </div>

                <h2 className="text-xl font-semibold text-[#1F2937]">
                  {item.title}
                </h2>

                <p className="text-sm text-[#6B7280] mt-1">
                  Traditional cooling drink
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <p className="text-xl font-bold text-[#814BF6]">
                    ₹ {item.price}.00
                  </p>
                  <span className="text-sm text-[#6B7280]">
                    750 ml
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#814BF6] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#6d3df0] transition"
                  >
                    Add to Cart
                  </button>

                  <div className="flex items-center border rounded-full overflow-hidden">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 font-semibold">
                      {quantities[item._id] || 1}
                    </span>
                    <button
                      onClick={() => increaseQty(item._id)}
                      className="px-4 py-2 hover:bg-gray-100"
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

