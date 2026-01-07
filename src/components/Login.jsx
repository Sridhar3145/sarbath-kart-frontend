
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const schema = yup.object().shape({
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

const Login = () => {
  const [successful, setSuccessful] = useState(false);
  const [error, setError] = useState(false);
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
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const user = users.find(
        (u) =>
          u.email === data.email &&
          u.password === data.password
      );

      if (!user) {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem("token", "dummy-token");
      localStorage.setItem("username", user.name);
      localStorage.setItem("role", user.role);

      window.dispatchEvent(new Event("storage"));

      setError(false);
      setSuccessful(true);
      reset();

      setTimeout(() => {
        setSuccessful(false);
        if (user.name.toLowerCase() === "sridhar") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (err) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 max-w-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

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
        Login
      </button>

      {error && (
        <p className="text-lg text-red-600 font-bold text-center">
          Login Failed
        </p>
      )}

      {successful && (
        <p className="text-lg text-black font-bold text-center">
          Login successful!
        </p>
      )}
      <p className="text-sm mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default Login;

