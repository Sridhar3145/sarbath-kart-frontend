
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

    if (storedName) {
      setUsername(storedName);
    }

    const storedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];
    setDetails(storedOrders);
  }, [navigate]);

  const gridCols =
    "60px 160px 160px 320px 140px 80px 120px";

  const totalAmount = details.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  let topProduct = "--";


  const productCount = details.reduce((acc, order) => {
    return order.items.reduce((innerAcc, item) => {
      innerAcc[item.title] =
        (innerAcc[item.title] || 0) + item.quantity;
      return innerAcc;
    }, acc);
  }, {});


  const sortedProducts = Object.entries(productCount).sort(
    (a, b) => b[1] - a[1]
  );

  if (sortedProducts.length) {
    topProduct = sortedProducts[0][0];
  }
  console.log(details);

  return (
    <div className="min-h-screen bg-second p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Welcome, {username}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-[#ffeeb3] rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-4xl font-bold text-gray-900">
              {details.length}
            </h2>
          </div>

          <div className="bg-[#ffeeb3] rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="text-4xl font-bold text-[#EAB308]">
              ₹{totalAmount}
            </h2>
          </div>

          <div className="bg-[#ffeeb3] rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500">Top Product</p>
            <h2 className="text-xl font-semibold text-gray-900">
              {topProduct}
            </h2>
          </div>
        </div>

        {details.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Orders
            </h2>
            <div className="overflow-x-auto w-full">
              <div className="bg-[#FFF4CC] rounded-xl shadow-md w-full">

                <div
                  className="grid px-6 py-4 text-sm font-semibold text-gray-900 border-b"
                  style={{ gridTemplateColumns: gridCols }}
                >
                  <div>S.No</div>
                  <div>Customer</div>
                  <div>Mobile</div>
                  <div>Product</div>
                  <div>Price / unit</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Total</div>
                </div>

                {details.map((order, index) => {
                  const totalQty = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );

                  return (
                    <div
                      key={index}
                      className={`grid px-6 py-4 text-sm items-start border-b last:border-none
                                  ${index % 2 === 0 ? "bg-white/40" : ""}`}
                      style={{ gridTemplateColumns: gridCols }}
                    >

                      <div>{index + 1}</div>


                      <div className="font-medium">
                        {order.customer?.name || "Guest"}
                      </div>


                      <div>{order.customer?.phone || "--"}</div>


                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <p key={i} className="truncate">
                            {item.title} × {item.quantity}
                          </p>
                        ))}
                      </div>


                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <p key={i}>₹{item.price}</p>
                        ))}
                      </div>

                      <div className="text-center font-medium">
                        {totalQty}
                      </div>

                      <div className="text-right font-semibold text-[#EAB308]">
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


