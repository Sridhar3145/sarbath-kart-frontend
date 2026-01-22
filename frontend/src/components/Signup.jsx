
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useState } from "react";

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
      }, 5000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 max-w-md mx-auto mt-10"
    >
      <h1 className="text-2xl font-bold text-center">Sign Up</h1>

      <div>
        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className="border p-2 w-full rounded"
        />
        <p className="text-red-500 text-sm">
          {errors.name?.message}
        </p>
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          autoComplete="off"
          {...register("email")}
          className="border p-2 w-full rounded"
        />
        <p className="text-red-500 text-sm">
          {errors.email?.message}
        </p>
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          {...register("password")}
          className="border p-2 w-full rounded"
        />
        <p className="text-red-500 text-sm">
          {errors.password?.message}
        </p>
      </div>

      <button
        type="submit"
        className="bg-black text-[#FFE169] px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors w-full"
      >
        Sign Up
      </button>

      {error && (
        <p className="text-lg text-red-600 font-bold text-center">
          {error}
        </p>
      )}

      {successful && (
        <p className="text-lg text-black font-bold text-center">
          Signup successful!
        </p>
      )}

      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Signup;

