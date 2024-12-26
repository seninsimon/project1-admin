import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axiosClient.post('/fetchallorders');


      console.log('fetch orders response:', response.data.orders);
      
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  // Handle order status update
  const handleStatusChange = async (orderId, newStatus) => {

  const allData = {orderId, newStatus};

    try {
       const response =  await axiosClient.post(`/updateorderstatus/${orderId}` , allData );

       console.log('response from the server:', response);
       

      // Update the local state after successful update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
       toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Render loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading orders...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">
        Order Management
      </h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Customer Name</th>
              <th className="py-3 px-6 text-left">Products</th>
              <th className="py-3 px-6 text-right">Total Price</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="py-3 px-6 text-left">{order._id}</td>
                <td className="py-3 px-6 text-left">
                  {order.userId?.username || 'Guest'}
                </td>
                <td className="py-3 px-6 text-left">
                  {order.products.map((product) => (
                    <div key={product.productId._id}>
                      {product.productId.productName}
                    </div>
                  ))}
                </td>
                <td className="py-3 px-6 text-right">₹{
                  order.totalPrice > 5000 ? `${(order.totalPrice * 0.9).toFixed(2)}` : order.totalPrice}</td>
                <td className="py-3 px-6 text-center">{order.status}</td>
                <td className="py-3 px-6 text-center">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
