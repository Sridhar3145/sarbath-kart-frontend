import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username");

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedName) setUsername(storedName);

    fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDetails(Array.isArray(data) ? data : []))
      .catch(() => setDetails([]));
  }, [navigate]);

  const gridCols =
    "60px 160px 160px 140px 120px 260px 140px 80px 120px";

  const totalAmount = details.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  let topProduct = "--";

  const productCount = details.reduce((acc, order) => {
    const items = Array.isArray(order.order) ? order.order : [];

    items.forEach((item) => {
      acc[item.title] = (acc[item.title] || 0) + item.qty;
    });

    return acc;
  }, {});

  const sortedProducts = Object.entries(productCount).sort(
    (a, b) => b[1] - a[1]
  );

  if (sortedProducts.length) topProduct = sortedProducts[0][0];


  return (
    <div className="min-h-screen bg-second p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Welcome, {username}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-[#ffeeb3] rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-4xl font-bold">{details.length}</h2>
          </div>

          <div className="bg-[#ffeeb3] rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="text-4xl font-bold text-[#EAB308]">
              ₹{totalAmount}
            </h2>
          </div>

          <div className="bg-[#ffeeb3] rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500">Top Product</p>
            <h2 className="text-xl font-semibold">
              {topProduct}
            </h2>
          </div>
        </div>

        {details.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Recent Orders
            </h2>

            <div className="overflow-x-auto">
              <div className="bg-[#FFF4CC] rounded-xl shadow-md">

                <div
                  className="grid px-6 py-4 text-sm font-semibold border-b"
                  style={{ gridTemplateColumns: gridCols }}
                >
                  <div>S.No</div>
                  <div>Customer</div>
                  <div>Mobile</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Product</div>
                  <div>Price</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Total</div>

                </div>

                {details.map((order, index) => {
                  const orderDate = new Date(order.createdAt);

                  const date = orderDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  const time = orderDate.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const items = Array.isArray(order.order) ? order.order : [];

                  const totalQty = items.reduce(
                    (sum, i) => sum + i.qty,
                    0
                  );

                  return (
                    <div
                      key={order._id}
                      className={`grid px-6 py-4 text-sm border-b
                        ${index % 2 === 0 ? "bg-white/40" : ""}`}
                      style={{ gridTemplateColumns: gridCols }}
                    >
                      <div>{index + 1}</div>
                      <div>{order.name || "--"}</div>
                      <div>{order.phone || "--"}</div>
                      <div>{date}</div>
                      <div>{time}</div>

                      <div>
                        {items.map((i, idx) => (
                          <p key={`${order._id}-${idx}`}>
                            {i.title} × {i.qty}
                          </p>
                        ))}
                      </div>

                      <div>
                        {items.map((i, idx) => (
                          <p key={`${order._id}-${idx}-price`}>
                            ₹{i.price}
                          </p>
                        ))}
                      </div>

                      <div className="text-center">{totalQty}</div>
                      <div className="text-right font-semibold">
                        ₹{order.total}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
