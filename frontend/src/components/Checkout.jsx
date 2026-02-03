
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import qr from "../assets/qr.webp";
import toast from "react-hot-toast";

const Checkout = ({ cart, setCart }) => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .matches(
        /^[a-z0-9]+@[a-z]{4,5}\.[a-z]{2,3}$/,
        "Enter a valid email address"
      ),
    phone: Yup.string().matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
    address: Yup.string().required("Address is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const totalAmount = cart.reduce((total, item) => {
    const price = item.price ?? item.productId?.price ?? 0;
    const qty = item.quantity ?? item.qty ?? 1;
    return total + price * qty;
  }, 0);


  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to place order");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer: data,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Order failed");
      }

      localStorage.removeItem("guest_cart");
      setCart([]);


      toast.success('Order placed successfully !!')
      reset();

    } catch (err) {
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#F4F6FD]">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Checkout
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="checkout-label">Name</label>
                <input {...register("name")} className="checkout-input" />
                {errors.name && <p className="error-text">{errors.name.message}</p>}
              </div>

              <div>
                <label className="checkout-label">Email</label>
                <input {...register("email")} className="checkout-input" />
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>

              <div>
                <label className="checkout-label">Phone</label>
                <input {...register("phone")} className="checkout-input" />
                {errors.phone && <p className="error-text">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="checkout-label">Delivery Address</label>
                <textarea
                  rows="3"
                  {...register("address")}
                  className="checkout-input resize-none"
                />
                {errors.address && (
                  <p className="error-text">{errors.address.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-lg transition-all
              ${loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#814BF6] text-white hover:bg-[#6b3ee8] hover:shadow-lg active:scale-95"
                }`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between"
              >
                <span>
                  {item.title ?? item.productId?.title} ×{" "}
                  {item.quantity ?? item.qty}
                </span>
                <span className="font-medium">
                  ₹{item.price ?? item.productId?.price}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-green-700">₹{totalAmount}</span>
          </div>

          <div className="mt-6 text-center border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">
              Scan & Pay
            </p>
            <img
              src={qr}
              alt="QR"
              className="mx-auto w-40 h-40"
            />
            <p className="text-xs text-gray-500 mt-2">
              Complete payment before placing order
            </p>
          </div>
        </div>

      </div>
    </div>
  );


};

export default Checkout;
