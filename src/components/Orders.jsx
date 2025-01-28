import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 8; // Number of rows to display per page

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const handleStatusChange = async (orderId, newStatus) => {
    const allData = { orderId, newStatus };

    try {
      const response = await axiosClient.post(`/updateorderstatus/${orderId}`, allData);
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

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    order.userId?.username.toLowerCase().includes(searchTerm.toLowerCase())
    || order.address?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.address?.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.address?.pincode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.address?.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

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

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by Customer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-1/2"
        />
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Customer Name</th>
              <th className="py-3 px-6 text-left">Delivered Address</th>
              <th className="py-3 px-6 text-left">Products</th>
              <th className="py-3 px-6 text-right">Total Price</th>
              <th className="py-3 px-6 text-center">Status</th>     
              <th className="py-3 px-6 text-center">Actions</th>
              <th className="py-3 px-6 text-center">Cancel Reason</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {paginatedOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 transition duration-200 cursor-pointer"
              >
                <td className="py-3 px-6 text-left">{order._id.slice(-5)}</td>

                <td className="py-3 px-6 text-left">
                  {order.userId?.username || 'Guest'}
                </td>
                <td className="py-3 px-6 text-left whitespace-pre-line">
                  <div className="space-y-1">
                    <div>{order.address?.address}</div>
                    <div>
                      {order.address?.city}, {order.address?.state} , {order.address?.pincode}
                    </div>
                    <div>{order.address?.phoneNumber}</div>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  {order.products.map((product) => (
                    <div key={product.productId._id} className="truncate">
                      {product.productId.productName}
                      (x{product.quantity})
                    </div>
                  ))}
                </td>
                <td className="py-3 px-6 text-right">
                  ₹
                  {order.totalPrice}
                </td>
                <td className="py-3 px-6 text-center">{order.status}</td>
                <td className="py-3 px-6 text-center">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 bg-white"
                    disabled={order.status === "Cancelled"} // Disable if the status is Cancelled
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                </td>
                <td className="py-3 px-6 text-center">{order?.cancelReason}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${currentPage === 1
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${currentPage === totalPages
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;


