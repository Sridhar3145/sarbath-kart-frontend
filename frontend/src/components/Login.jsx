
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
        <p className="text-red-600 font-bold text-center">
          {error}
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

