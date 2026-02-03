import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = ({ addToCart }) => {
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({});
  const [productt, setProductt] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="max-w-5xl mx-auto p-6 space-y-10">
        {loading ? (
          <div className="text-center text-[#1F2937] font-semibold text-2xl pt-20">
            Loading products...
          </div>
        ) : (
          productt.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center justify-center bg-[#e5e9fa] rounded-xl p-6">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                  alt={item.title}
                  className="h-80 object-contain drop-shadow-xl"
                />
              </div>

              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-[#1F2937]">
                  {item.title}
                </h1>

                <p className="text-2xl font-semibold text-[#814BF6] mt-3">
                  ₹{item.price}.00
                </p>

                <p className="text-[#4B5563] mt-4 leading-relaxed">
                  Refreshing {item.title.toLowerCase()} made with high-quality
                  ingredients. Perfect for summer refreshment.
                </p>

                <div className="flex items-center gap-4 mt-6">

                  <div className="flex items-center border rounded-full overflow-hidden">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="px-4 py-2 text-lg hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-5 font-semibold">
                      {quantities[item._id] || 1}
                    </span>
                    <button
                      onClick={() => increaseQty(item._id)}
                      className="px-4 py-2 text-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#814BF6] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6d3df0] transition"
                  >
                    Add to Cart
                  </button>
                </div>

                <p className="text-sm text-[#6B7280] mt-6 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Products;

