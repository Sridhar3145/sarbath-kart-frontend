import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();

  const totalAmount = cart.reduce((total, item) => {
    const price = item.price ?? item.productId?.price ?? 0;
    const qty = item.quantity ?? item.qty ?? 1;
    return total + price * qty;
  }, 0);

  const deleteGuestCartItem = (productId) => {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

    const updatedCart = guestCart.filter(
      (item) => item._id !== productId
    );

    localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    return updatedCart;
  };


  const deleteBackendCartItem = async (productId) => {
    const token = localStorage.getItem("token");

    await fetch(`${import.meta.env.VITE_API_URL}/cart/delete/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleRemove = async (item) => {
    const token = localStorage.getItem("token");

    if (!token) {
      const updated = deleteGuestCartItem(item._id);
      setCart(updated);
    } else {
      const productId = item.productId?._id || item._id;

      await deleteBackendCartItem(productId);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCart(data.items || []);
    }
  };

  const updateGuestCartQty = (productId, newQty) => {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

    const updatedCart = guestCart.map((item) =>
      item._id === productId
        ? { ...item, quantity: Math.max(1, newQty) }
        : item
    );

    localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    return updatedCart;
  };

  const updateBackendQty = async (productId, newQty) => {
    const token = localStorage.getItem("token");

    await fetch(`${import.meta.env.VITE_API_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        qty: newQty,
      }),
    });
  };


  const updateQuantity = async (item, delta) => {
    const token = localStorage.getItem("token");

    const currentQty =
      typeof item.quantity === "number"
        ? item.quantity
        : typeof item.qty === "number"
          ? item.qty
          : 1;

    const newQty = Math.max(1, currentQty + delta);

    console.log("CURRENT QTY 👉", currentQty);
    console.log("UPDATING QTY 👉", newQty);

    if (!token) {
      const updated = updateGuestCartQty(item._id, newQty);
      setCart(updated);
    } else {
      const productId = item.productId?._id || item._id;

      await updateBackendQty(productId, newQty);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCart(data.items || []);
    }
  };

  console.log(cart)
  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#F4F6FD] px-4">
      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold mb-8 text-[#1F2937] border-b border-gray-300 pb-4">
          🛒 Your Shopping Cart
        </h2>

        {cart.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-xl">Your cart is empty.</p>
            <button
              onClick={() => navigate("/product")}
              className="mt-6 bg-[#814BF6] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6d3df0]"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>

            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item._id}-${item.title}`}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
                >

                  <div className="flex items-center gap-5">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${item.image ?? item.productId?.image}`}
                      alt={item.title ?? item.productId?.title}
                      className="w-20 h-20 object-contain bg-[#F4F6FD] rounded-xl p-2"
                    />

                    <div>
                      <h3 className="text-lg font-semibold text-[#1F2937]">
                        {item.title ?? item.productId?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ₹{item.price ?? item.productId?.price} × {item.quantity ?? item.qty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto">

                    <div className="flex items-center border rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item, -1)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 font-semibold">
                        {item.quantity ?? item.qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item, +1)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      <FaTrashAlt />
                    </button>

                    <p className="text-lg font-bold text-green-600 whitespace-nowrap">
                      ₹{(item.price ?? item.productId?.price) * (item.quantity ?? item.qty)}.00
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 mt-10 flex justify-between items-center">
              <span className="text-xl font-semibold text-[#1F2937]">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-green-600">
                ₹{totalAmount}.00
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  const token = localStorage.getItem("token");
                  token
                    ? navigate("/checkout")
                    : navigate("/login?redirect=checkout");
                }}
                className="bg-[#814BF6] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6d3df0]"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/product")}
                className="border border-[#814BF6] text-[#814BF6] px-8 py-3 rounded-full font-semibold hover:bg-[#814BF6] hover:text-white transition"
              >
                Keep Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

};

export default Cart;
