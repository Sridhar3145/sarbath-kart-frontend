
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";

const Contact = () => {
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
    contactno: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
      .required("Contact No is required"),
    message: Yup.string().required("Message is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      toast.success("Message send SuccessFully !!")
      reset();

    } catch (error) {
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-[#F4F6FD] px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">

        <h2 className="text-3xl font-bold text-center text-[#1F2937] mb-10">
          Contact Us
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-[#814BF6]">
              Get in Touch
            </h3>

            <p className="text-gray-600">
              If you have any queries, feel free to reach out. We’d love to hear from you.
            </p>

            <div>
              <p className="font-medium text-[#1F2937]">📍 Address</p>
              <p className="text-gray-600">
                Ilayankudi, Sivagangai, Tamil Nadu – 630702
              </p>
            </div>

            <div>
              <p className="font-medium text-[#1F2937]">📞 Phone</p>
              <p className="text-gray-600">+91 9865298470</p>
            </div>

            <div>
              <p className="font-medium text-[#1F2937]">📧 Email</p>
              <p className="text-gray-600">
                selvamsarbathshop@gmail.com
              </p>
            </div>
          </div>

          <div className="bg-[#F4F6FD] rounded-xl p-6 shadow-md">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#814BF6]"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#814BF6]"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact No
                </label>
                <input
                  type="text"
                  {...register("contactno")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#814BF6]"
                />
                {errors.contactno && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.contactno.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  {...register("message")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#814BF6]"
                ></textarea>
                {errors.message && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full font-semibold transition ${loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#814BF6] text-white hover:bg-[#6d3df0]"
                  }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Contact;
