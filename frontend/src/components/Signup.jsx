
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[a-z0-9]+@[a-z]{4,5}\.[a-z]{2,3}$/,
      "Enter a valid email address"
    ),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const Signup = () => {
  const [successful, setSuccessful] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const signUpData = await res.json();
      console.log(signUpData);

      if (!res.ok) {
        throw new Error(signUpData.msg || "Signup failed");
      }
      setError("");
      setSuccessful(true);
      reset();
      setTimeout(() => {
        setSuccessful(false);
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FD] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-extrabold text-[#1F2937]">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-600">
            Join us and start your journey
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            {...register("name")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#814BF6]"
          />
          <p className="text-red-500 text-xs">
            {errors.name?.message}
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            {...register("email")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#814BF6]"
          />
          <p className="text-red-500 text-xs">
            {errors.email?.message}
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            {...register("password")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#814BF6]"
          />
          <p className="text-red-500 text-xs">
            {errors.password?.message}
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-full py-2.5 font-semibold bg-[#814BF6] text-white hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Sign Up
        </button>

        {error && (
          <p className="text-red-600 text-sm font-semibold text-center">
            {error}
          </p>
        )}

        {successful && (
          <p className="text-black text-lg font-semibold text-center">
            Signup successful ✔️
          </p>
        )}

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#814BF6] hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );


};

export default Signup;

