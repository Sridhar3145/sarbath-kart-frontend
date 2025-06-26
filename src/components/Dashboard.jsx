import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username");

    if (!token) {
      navigate("/login");
    }

    if (storedName) {
      setUsername(storedName);
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`);
        const data = await res.json();
        console.log("Fetched orders:", data);
        setDetails(data);
      } catch (error) {
        console.error("Order fetch failed:", error);
      }
    };

    fetchOrders(); // invoke the async function
  }, [navigate]);

  const totalAmount = details.reduce((sum, order) => {
    // order.total = "₹65" → remove ₹, convert to number
    const num = Number(order.total.replace(/[^\d]/g, "")) || 0;
    return sum + num;
  }, 0);
  let topProduct = "--";
  const productCount = {};

  details.forEach((order) => {
    const [productRaw] = order.order.split(" ×"); // 👉 "Nannari Sarbath × 1"
    const product = productRaw.trim();
    productCount[product] = (productCount[product] || 0) + 1;
  });

  const sortedProducts = Object.entries(productCount).sort(
    (a, b) => b[1] - a[1]
  );
  if (sortedProducts.length) {
    topProduct = sortedProducts[0][0];
  }

  return (
    <>
      <div className="p-6 min-h-screen bg-second">
        <div className="max-w-xl mx-auto bg-yellow-400 p-6 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4"> Welcome, {username} !!</h1>

          <div className="space-y-4">
            <div className="bg-black p-4 rounded-xl shadow-sm text-yellow">
              <h2 className="text-lg font-semibold">📦 Total Orders</h2>
              <p className="text-xl font-bold ">{details.length}</p>
            </div>

            <div className="bg-black p-4 rounded-xl shadow-sm text-yellow">
              <h2 className="text-lg font-semibold">💰 Total Revenue</h2>
              <p className="text-xl font-bold">₹{totalAmount}</p>
            </div>

            <div className="bg-black p-4 rounded-xl shadow-sm text-yellow">
              <h2 className="text-lg font-semibold">🥤 Top Product</h2>
              <p className="text-xl font-bold">{topProduct}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
