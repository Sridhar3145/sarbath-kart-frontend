
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const Contact = () => {
  const [success, setSuccess] = useState(false);
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
      const existingMessages =
        JSON.parse(localStorage.getItem("contactMessages")) || [];

      const newMessage = {
        id: Date.now(),
        ...data,
        date: new Date().toISOString(),
      };

      localStorage.setItem(
        "contactMessages",
        JSON.stringify([...existingMessages, newMessage])
      );

      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#ffeeb3]  rounded-xl shadow-md mt-20 mb-52">
      <h2 className="section-heading">Contact Us</h2>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <p className="text-lg font-medium text-black">Get in Touch</p>
          <p className="text-gray-600">
            If you have any queries, feel free to reach out.
          </p>
          <div>
            <p className="font-medium">📍 Address:</p>
            <p className="text-gray-600">
              Ilayankudi, Sivagangai, Tamil Nadu - 630702
            </p>
          </div>
          <div>
            <p className="font-medium">📞 Phone:</p>
            <p className="text-gray-600">+91 9865298470</p>
          </div>
          <div>
            <p className="font-medium">📧 Email:</p>
            <p className="text-gray-600">selvamsarbathshop@gmail.com</p>
          </div>
        </div>

        <div className="bg-second p-6 rounded-lg shadow">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

            <div className="relative">
              <input
                type="text"
                {...register("name")}
                className="contact-input-style peer"
                placeholder=" "
                autoComplete="off"
              />
              <label className="contact-label-style">Name</label>
              {errors.name && (
                <p className="text-red-600 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type="email"
                {...register("email")}
                className="contact-input-style peer"
                placeholder=" "
                autoComplete="off"
              />
              <label className="contact-label-style">Email</label>
              {errors.email && (
                <p className="text-red-600 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                {...register("contactno")}
                className="contact-input-style peer"
                placeholder=" "
                autoComplete="off"
              />
              <label className="contact-label-style">Contact No</label>
              {errors.contactno && (
                <p className="text-red-600 text-sm">
                  {errors.contactno.message}
                </p>
              )}
            </div>

            <div className="relative">
              <textarea
                rows="4"
                {...register("message")}
                className="contact-input-style peer"
                placeholder=" "
                autoComplete="off"
              ></textarea>
              <label className="contact-label-style">Message</label>
              {errors.message && (
                <p className="text-red-600 text-sm">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-[#f9db79] shadow-lg transition ${loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
                }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {success && (
              <p className="text-green-700 mt-4 text-xl">
                ✅ Your message has been sent successfully!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
