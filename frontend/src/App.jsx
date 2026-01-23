import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

function App() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const syncCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        const guest =
          JSON.parse(localStorage.getItem("guest_cart")) || [];
        setCart(guest);
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCart(data.items || []);
      }
    };

    syncCart();

    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
    };
  }, []);


  const addToCart = async (product, qty = 1) => {
    const token = localStorage.getItem("token");

    if (!token) {
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];

      const index = guestCart.findIndex(
        (i) => i._id === product._id
      );

      if (index > -1) {
        guestCart[index].quantity += qty;
      } else {
        guestCart.push({ ...product, quantity: qty });
      }

      localStorage.setItem(
        "guest_cart",
        JSON.stringify(guestCart)
      );
      setCart(guestCart);
    } else {
      await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          qty,
        }),
      });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCart(data.items || []);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen text-5xl font-bold text-black">
          Loading...
        </div>
      ) : (
        <div className="h-screen overflow-y-scroll scrollbar scrollbar-thumb-yellow-400 scrollbar-track-black">
          <Router>
            <div className="min-h-screen flex flex-col">

              <Navbar cartCount={cart.length} />

              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home addToCart={addToCart} />} />
                  <Route path="/product" element={<Products addToCart={addToCart} />} />
                  <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/contact" element={<Contact />} />

                  <Route
                    path="/checkout"
                    element={
                      localStorage.getItem("token") ? (
                        <Checkout cart={cart} setCart={setCart} />
                      ) : (
                        <Navigate to="/login?redirect=checkout" />
                      )
                    }
                  />

                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </main>

              <Footer />

            </div>
          </Router>

        </div>
      )}
    </>
  );
}

export default App;
