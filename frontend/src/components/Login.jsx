
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
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const mergeGuestCartToBackend = async (token) => {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

    if (guestCart.length === 0) return;

    for (const item of guestCart) {
      await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item._id,
          qty: item.quantity,
        }),
      });
    }

    localStorage.removeItem("guest_cart");
  };


  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });


      const loginData = await res.json();
      console.log("LOGIN RESPONSE 👉", loginData);

      if (!res.ok) {
        setError(loginData.msg || "Login failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("username", loginData.name);
      localStorage.setItem("email", loginData.email)

      window.dispatchEvent(new Event("storage"));

      await mergeGuestCartToBackend(loginData.token);

      setSuccessful(true);
      reset();

      setTimeout(() => {
        setSuccessful(false);

        if (loginData.email === "sridhar314507@gmail.com") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 2000);

    } catch (err) {
      console.error(err);
      setError('Something went wrong');

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
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600">
            Please login to your account
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
          disabled={isLoading}
          className={`w-full rounded-full py-2.5 font-semibold transition-all ${isLoading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#814BF6] text-white hover:scale-[1.02] hover:shadow-lg"
            }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-red-600 text-sm font-semibold text-center">
            {error}
          </p>
        )}

        {successful && (
          <p className="text-black text-lg font-semibold text-center">
            Login successful ✔️
          </p>
        )}

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#814BF6] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );

}

export default Login;

