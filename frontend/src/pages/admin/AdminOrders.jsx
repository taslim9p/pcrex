import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/layout/AdminMenu";
import Layout from "../../components/layout/Layout.jsx";
import moment from "moment";
import { Select, Spin } from "antd";
import { useAuth } from "../../context/auth";
const { Option } = Select;

function AdminOrders() {
  const [status, setStatus] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [userDataMap, setUserDataMap] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const getOrders = async () => {
    try {
      setLoading(true); // Set loading to true
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/auth/all-orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getAllProducts = async () => {
    try {
      setLoading(true); // Set loading to true
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/product/get-product`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    if (auth?.token) getAllProducts();
  }, [auth?.token]);

  useEffect(() => {
    if (orders.length > 0) {
      orders.forEach(async (order) => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API}/api/v1/auth/userData/${order.buyer._id}`
          );
          setUserDataMap((prev) => ({
            ...prev,
            [order.buyer._id]: data.user,
          }));
        } catch (error) {
          console.log(error);
        }
      });
    }
  }, [orders]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API}/api/v1/auth/order-status/${orderId}`,
        { status: value }
      );
      if (value === "Delivered") {
        const order = orders.find((o) => o._id === orderId);
        for (const product of order.products) {

          const u=await axios.put(`${import.meta.env.VITE_API}/api/v1/product/update-quantity`, {
            productId: product._id,
            quantityPurchased: product.quant,
          });
          
        }
      }
      getOrders(); // Refresh the orders list
    } catch (error) {
      console.log(error);
    }
  };

  const cancelOrder = async (order_id) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API}/api/v1/auth/cancel-order/${order_id}`
      );
      if (data?.message) {
        toast.success(data.message);
        getOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error cancelling order");
    }
  };

  const calculateTotalPrice = (products) => {
    return products.reduce(
      (total, product) => total + product.price * product.quant,
      0
    );
  };

  const calculateTotalQuantity = (products) => {
    return products.reduce((total, product) => total + product.quant, 0);
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="flex flex-col md:flex-row md:gap-4 p-3">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <AdminMenu />
        </div>
        <div className="md:w-3/4">
          {loading ? (
            <div className="h-screen w-full flex items-center justify-center">
              <Spin tip="Loading orders..." />
            </div>
          ) : (
            <>
              <h1 className="text-center text-2xl font-bold mb-4">All Orders</h1>
              {orders?.map((o, i) => (
                <div key={o._id} className="border rounded-lg shadow mb-4 p-4">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Buyer</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Payment</th>
                        <th className="px-4 py-2">Total Quantity</th>
                        <th className="px-4 py-2">Total Amount</th>
                        <th className="px-4 py-2">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b text-center">
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">
                          <Select
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
                            className="w-full"
                          >
                            {status.map((s, index) => (
                              <Option key={index} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td className="px-4 py-2">{userDataMap[o.buyer._id]?.uname}</td>
                        <td className="px-4 py-2">{moment(o?.createdAt).fromNow()}</td>
                        <td className="px-4 py-2">Cash on delivery</td>
                        <td className="px-4 py-2">{calculateTotalQuantity(o?.products)}</td>
                        <td className="px-4 py-2">&#8377;{calculateTotalPrice(o?.products)}</td>
                        <td className="px-4 py-2">{userDataMap[o.buyer._id]?.address || "No address available"}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-4">
                    {o?.products?.map((p) => (
                      <div key={p._id} className="flex flex-col md:flex-row mb-4">
                        <div className="flex-shrink-0 mb-2 md:mb-0">
                          <img
                            src={`${import.meta.env.VITE_API}/api/v1/product/product-photo/${p._id}`}
                            className="w-24 h-24 object-cover rounded-md"
                            alt={p.name}
                          />
                        </div>
                        <div className="md:ml-4">
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-sm text-gray-600">
                            {p.description ? p.description.substring(0, 30) : "No description"}
                          </p>
                          <p className="text-sm">Price: &#8377;{p.price}</p>
                          <p className="text-sm">Quantity: {p.quant}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AdminOrders;
