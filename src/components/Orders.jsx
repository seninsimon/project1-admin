import React from "react";
import "./Orders.css";

const Orders = () => {
  // Dummy order data
  const orders = [
    {
      id: "ORD12345",
      customer: "John Doe",
      status: "Pending",
      amount: "$120.50",
    },
    {
      id: "ORD12346",
      customer: "Jane Smith",
      status: "Completed",
      amount: "$85.00",
    },
    {
      id: "ORD12347",
      customer: "Michael Brown",
      status: "Shipped",
      amount: "$199.99",
    },
    {
      id: "ORD12348",
      customer: "Emily Davis",
      status: "Cancelled",
      amount: "$45.00",
    },
  ];

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </td>
                <td>{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
