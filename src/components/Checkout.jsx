
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import qr from "../assets/qr.webp";

const Checkout = ({ cart, setCart }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .matches(
        /^[a-z0-9]+@[a-z]{4,5}\.[a-z]{2,3}$/,
        "Enter a valid email address"
      ),
    phone: Yup.string().required("Phone is required"),
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

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const orderSummary = cart.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      }));

      const order = {
        id: Date.now(),
        customer: data,
        items: orderSummary,
        total: totalAmount,
        status: "Placed",
        date: new Date().toISOString(),
      };

      const existingOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      localStorage.setItem(
        "orders",
        JSON.stringify([...existingOrders, order])
      );

      setSuccess(true);
      reset();
      setCart([]);
      localStorage.removeItem("cart");

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 bg-second">
      <div className="max-w-xl mx-auto bg-[#ffeeb3] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          🧾 Place Your Order
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full border rounded px-4 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border rounded px-4 py-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Phone</label>
            <input
              type="text"
              {...register("phone")}
              className="w-full border rounded px-4 py-2"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Delivery Address</label>
            <textarea
              {...register("address")}
              className="w-full border rounded px-4 py-2"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="bg-[#f9db79] p-3 rounded-lg">
            <p className="font-bold">🛒 Your Order:</p>
            {cart.map((item) => (
              <p key={item._id}>
                {item.title} × {item.quantity}
              </p>
            ))}
            <p className="mt-2 font-bold text-green-700">
              Total: ₹{totalAmount}
            </p>
          </div>

          <div className="mb-6 text-center">
            <p className="font-semibold mb-2 text-lg">
              Scan & Pay (GPay, PhonePe, Paytm)
            </p>
            <img
              src={qr}
              alt="GPay QR Code"
              className="mx-auto w-48 h-48 border rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-2">
              After payment, submit your order below 👇
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-bold transition ${loading
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-black text-[#f9db79] hover:bg-gray-800"
              }`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          {success && (
            <p className="text-green-700 mt-4 text-center text-sm">
              ✅ Order placed successfully! Thank you 😊
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
