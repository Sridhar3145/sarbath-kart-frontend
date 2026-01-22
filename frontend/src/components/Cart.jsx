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
    <div className="min-h-screen pt-24 pb-10 bg-second px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#1F2937] border-b pb-4">
          🛒 Your Shopping Cart
        </h2>

        {cart.length === 0 ? (
          <div className="text-center text-gray-600 mt-12">
            <p className="text-xl">Your cart is empty.</p>
            <button
              onClick={() => navigate("/product")}
              className="mt-6 cart-btns"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => {
              return (
                <div
                  key={`${item._id}-${item.title}`}
                  className="bg-[#ffeeb3] p-4 rounded-lg shadow-md mb-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col w-full sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4 w-full">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${item.image ?? item.productId?.image}`}
                          alt={item.title ?? item.productId?.title}
                          className="w-20 h-20 object-contain rounded-lg"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 w-full">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {item.title ?? item.productId?.title}
                            </h3>
                            <p className="text-lg font-bold text-green-600 whitespace-nowrap block sm:hidden">
                              ₹{(item.price ?? item.productId?.price) * (item.quantity ?? item.qty)}.00
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            ₹{item.price ?? item.productId?.price} × {item.quantity ?? item.qty}
                          </p>

                          <div className="flex items-center gap-3 sm:hidden">
                            <div className="flex items-center border rounded-4xl px-3 bg-black">
                              <button
                                onClick={() => updateQuantity(item, -1)}
                                className="text-lg px-2 py-1 font-bold text-yellow"
                              >
                                -
                              </button>
                              <span className="px-3 text-lg text-yellow">
                                {item.quantity ?? item.qty}
                              </span>
                              <button
                                onClick={() => updateQuantity(item, +1)}
                                className="text-lg px-2 py-1 font-bold text-yellow"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemove(item)}
                              className="trash-btn"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6">
                      <div className="quantity-box">
                        <button
                          onClick={() => updateQuantity(item, -1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="px-3 text-lg text-yellow">
                          {item.quantity ?? item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item, 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item)}
                        className="trash-btn"
                      >
                        <FaTrashAlt />
                      </button>

                      <p className="text-lg font-bold text-green-600 whitespace-nowrap ml-32">
                        ₹{(item.price ?? item.productId?.price) * (item.quantity ?? item.qty)}.00

                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="total-amount">
              <span className="text-xl font-bold text-gray-700">
                Total Amount:
              </span>
              <span className="text-xl font-bold text-green-700">
                ₹{totalAmount}.00
              </span>
            </div>

            {cart.length > 0 && (
              <div className="cart-btn-box">
                <button
                  onClick={() => {
                    const token = localStorage.getItem("token");

                    if (token) {
                      navigate("/checkout");
                    } else {
                      navigate("/login?redirect=checkout");
                    }
                  }}
                  className="cart-btns"
                >
                  Proceed to Checkout
                </button>

              </div>
            )}

            <div className="cart-btn-box">
              <button
                onClick={() => navigate("/product")}
                className="cart-btns"
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
