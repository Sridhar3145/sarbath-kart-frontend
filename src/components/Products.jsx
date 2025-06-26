import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = ({ addToCart }) => {
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({});
  const [productt, setProductt] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProductt(data);
        setLoading(false);
      });
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
    addToCart({ ...product, quantity: quantities[product._id] || 1 });
    navigate("/cart");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="text-center text-black font-bold text-2xl pt-20">
            Loading products...
          </div>
        ) : (
          productt.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row items-center mb-8 border-b pb-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-48 md:w-72 bg-yellow-400 rounded-lg shadow-gray-700 shadow-xl"
              />

              <div className="md:ml-8 mt-6 md:mt-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  {item.title}
                </h1>
                <p className="text-xl text-green-600 font-semibold mt-2">
                  ₹{item.price}.00
                </p>
                <p className="text-gray-700 mt-4">
                  Refreshing {item.title.toLowerCase()} made with high-quality
                  ingredients. Perfect for summer!
                </p>

                {/* Quantity Selector & Add to Cart */}
                <div className="mt-4 flex items-center space-x-4">
                  <div className="quantity-box">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="px-3 text-lg text-yellow ">
                      {quantities[item._id] || 1}
                    </span>
                    <button
                      onClick={() => increaseQty(item._id)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="atc-btn"
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Product Highlights */}
                <p className="text-gray-700 mt-8">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Products;
