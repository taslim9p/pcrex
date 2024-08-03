import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import OrderStatusPieChart from "../../components/OrderStatusPieChart";
import VisitorsLineChart from "../../components/SalesOverTimeChart";
import SalesOverTimeChart from "../../components/SalesOverTimeChart"; // Import the new chart component

const AdminHub = () => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [filteredSales, setFilteredSales] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [cancelledOrdersCount, setCancelledOrdersCount] = useState(0);
  const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
  const [shippedOrdersCount, setShippedOrdersCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [showOutOfStock, setShowOutOfStock] = useState(false); // State to control visibility
  const [weeklySalesData, setWeeklySalesData] = useState([]); // State to hold weekly sales data

  // Function to calculate total sales
  const calculateTotalSales = (orders) => {
    return orders.reduce((sum, order) => {
      return (
        sum +
        order.products.reduce(
          (orderSum, product) => orderSum + product.price * product.quant,
          0
        )
      );
    }, 0);
  };

  // Fetch orders and update state
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/auth/all-orders`
      );
      setOrders(data);
      setFilteredOrders(data);

      setTotalOrdersCount(data.length);
      setTotalSales(
        calculateTotalSales(
          data.filter((order) => order.status === "Delivered")
        )
      );

      setCancelledOrdersCount(
        data.filter((order) => order.status === "Cancelled").length
      );
      setDeliveredOrdersCount(
        data.filter((order) => order.status === "Delivered").length
      );
      setShippedOrdersCount(
        data.filter((order) => order.status === "Shipped").length
      );

      // Calculate weekly sales data
      const filteredDeliveredOrders = data.filter(
        (order) => order.status === "Delivered"
      );
      const salesByWeek = getWeeklySales(filteredDeliveredOrders);
      setWeeklySalesData(salesByWeek);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to group sales data by week
  const getWeeklySales = (orders) => {
    const weeklySales = {};
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt); // Assuming `createdAt` is a field in your order schema
      const weekStart = getWeekStart(orderDate);

      if (!weeklySales[weekStart]) {
        weeklySales[weekStart] = 0;
      }

      const orderTotal = order.products.reduce(
        (sum, product) => sum + product.price * product.quant,
        0
      );

      weeklySales[weekStart] += orderTotal;
    });

    // Convert to array for chart
    return Object.keys(weeklySales).map((weekStart) => ({
      date: weekStart,
      sales: weeklySales[weekStart],
    }));
  };

  // Function to get the start of the week (e.g., Monday)
  const getWeekStart = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Adjust to start on Monday
    return start.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Fetch products and update out-of-stock state
  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/product/get-product`
      );
      setProducts(data.products);
      // Filter out-of-stock products
      setOutOfStockProducts(
        data.products.filter((product) => product.quantity === 0)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Handle filter change
  const handleFilter = (status) => {
    setSelectedFilter(status);
    let filtered = [];
    if (status === "All") {
      filtered = orders;
    } else {
      filtered = orders.filter((order) => order.status === status);
    }
    setFilteredOrders(filtered);
    setFilteredSales(calculateTotalSales(filtered));
  };

  // Toggle out-of-stock products visibility
  const toggleOutOfStock = () => {
    setShowOutOfStock(!showOutOfStock);
  };

  // Fetch data on component mount
  useEffect(() => {
    getOrders();
    getProducts();
  }, []);

  // Fetch visitors count
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/api/v1/auth/total-visitors`)
      .then((response) => {
        setTotalVisitors(response.data.totalVisits);
      })
      .catch((error) => {
        console.error("Error fetching visitor count:", error);
      });
  }, []);

  // Get unique product images
  const getUniqueImages = (orders) => {
    const imageSet = new Set();
    orders.forEach((order) => {
      order.products.forEach((product) => {
        imageSet.add(product._id);
      });
    });
    return Array.from(imageSet);
  };

  const uniqueImages = getUniqueImages(filteredOrders);

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-100 min-h-screen w-full">
        <div className="lg:w-1/5">
          <AdminMenu />
        </div>
        <div className="lg:w-4/5 bg-white rounded-lg shadow-lg p-6 w-full">
          <main>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Report</h1>
              <a
                href="#"
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="bx bxs-cloud-download mr-2"></i>
                <span>Download PDF</span>
              </a>
            </div>

            <div className="flex flex-row gap-6">
              <div className="bg-white p-6 rounded-lg shadow flex-1">
                <h2 className="text-xl font-semibold mb-4">
                  Order Status Chart
                </h2>
                 <OrderStatusPieChart
                  data={{
                    cancelledOrdersCount,
                    shippedOrdersCount,
                    deliveredOrdersCount,
                  }}  
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow flex-1">
                <h2 className="text-xl font-semibold mb-4">sales</h2>
                <SalesOverTimeChart salesData={weeklySalesData} /> Add the new chart here

              </div>
            </div>

           

            <ul className=" mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <li
                className="bg-white p-6 rounded-lg shadow flex items-center w-full cursor-pointer"
                onClick={() => handleFilter("All")}
              >
                <i className="bx bxs-calendar-check text-4xl text-blue-600 mr-4"></i>
                <div>
                  <h3 className="text-xl font-bold">{totalOrdersCount}</h3>
                  <p className="text-gray-600">Total Orders</p>
                </div>
              </li>
              <li
                className="bg-white p-6 rounded-lg shadow flex items-center w-full cursor-pointer"
                onClick={() => handleFilter("Shipped")}
              >
                <i className="bx bxs-calendar-check text-4xl text-blue-600 mr-4"></i>
                <div>
                  <h3 className="text-xl font-bold">{shippedOrdersCount}</h3>
                  <p className="text-gray-600">Shipped Orders</p>
                </div>
              </li>
              <li
                className="bg-white p-6 rounded-lg shadow flex items-center w-full cursor-pointer"
                onClick={() => handleFilter("Delivered")}
              >
                <i className="bx bxs-calendar-check text-4xl text-blue-600 mr-4"></i>
                <div>
                  <h3 className="text-xl font-bold">{deliveredOrdersCount}</h3>
                  <p className="text-gray-600">Delivered Orders</p>
                </div>
              </li>
              <li
                className="bg-white p-6 rounded-lg shadow flex items-center w-full cursor-pointer"
                onClick={() => handleFilter("Cancelled")}
              >
                <i className="bx bxs-calendar-check text-4xl text-blue-600 mr-4"></i>
                <div>
                  <h3 className="text-xl font-bold">{cancelledOrdersCount}</h3>
                  <p className="text-gray-600">Cancelled Orders</p>
                </div>
              </li>
              <li className="bg-white p-6 rounded-lg shadow flex items-center w-full cursor-pointer">
                <i className="bx bxs-dollar-circle text-4xl text-blue-600 mr-4"></i>
                <div>
                  <h3 className="text-xl font-bold">{totalSales.toFixed(2)}</h3>
                  <p className="text-gray-600">
                    Total Sales (Delivered Orders)
                  </p>
                </div>
              </li>
              <li
                className="bg-white p-6 rounded-lg shadow flex items-center w-full cursor-pointer"
                onClick={toggleOutOfStock}
              >
                <i className="bx bxs-cart text-4xl text-red-600 mr-4"></i>
                <div>
                  <h3 className="text-xl font-bold">{outOfStockProducts.length}</h3>
                  <p className="text-gray-600">Out of Stock Products</p>
                </div>
              </li>
            </ul>

            {/* Display filtered orders and out-of-stock products side by side */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="bg-white p-6 rounded-lg shadow mt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedFilter === "All"
                      ? "All Orders"
                      : `${selectedFilter} Orders`}
                  </h2>
                  {filteredOrders.length > 0 ? (
                    <>
                      <ul>
                        {filteredOrders.map((order) => (
                          <li
                            key={order._id}
                            className="border-b py-4 flex items-start gap-4"
                          >
                            <div className="flex flex-wrap gap-2">
                              {order.products.map((product) => (
                                <img
                                  key={product._id}
                                  src={`${
                                    import.meta.env.VITE_API
                                  }/api/v1/product/product-photo/${
                                    product._id
                                  }`}
                                  alt="Product"
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                                />
                              ))}
                            </div>
                            <div className="flex-1">
                              <p>
                                <strong>Order ID:</strong> {order._id}
                              </p>
                              <p>
                                <strong>Status:</strong> {order.status}
                              </p>
                              <p>
                                <strong>Total Price:</strong>{" "}
                                {order.products
                                  .reduce(
                                    (sum, product) =>
                                      sum + product.price * product.quant,
                                    0
                                  )
                                  .toFixed(2)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">
                          Total Sales for{" "}
                          {selectedFilter === "All"
                            ? "All Orders"
                            : `${selectedFilter} Orders`}
                          : ${filteredSales.toFixed(2)}
                        </h3>
                      </div>
                    </>
                  ) : (
                    <p>No orders found.</p>
                  )}
                </div>
              </div>

              <div className="flex-1">
                {/* Button to toggle out-of-stock products */}
                {/* <button 
                  onClick={toggleOutOfStock} 
                  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showOutOfStock ? 'Hide Out-of-Stock Products' : 'Show Out-of-Stock Products'}
                </button> */}

                {/* Display out-of-stock products */}
                {showOutOfStock && (
                  <div className="bg-white p-6 rounded-lg shadow mt-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Out of Stock Products
                    </h2>
                    {outOfStockProducts.length > 0 ? (
                      <ul>
                        {outOfStockProducts.map((product) => (
                          <li
                            key={product._id}
                            className="border-b py-4 flex items-center gap-4"
                          >
                            <img
                              src={`${
                                import.meta.env.VITE_API
                              }/api/v1/product/product-photo/${product._id}`}
                              alt="Product"
                              className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                            />
                            <div className="flex-1">
                              <p>
                                <strong>Product ID:</strong> {product._id}
                              </p>
                              <p>
                                <strong>Name:</strong> {product.name}
                              </p>
                              <p>
                                <strong>Quantity:</strong> {product.quantity}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No out-of-stock products found.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHub;
