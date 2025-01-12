// import React, { useEffect, useState } from "react";
// import axiosClient from "../api/axiosClient";
// import Swal from "sweetalert2";

// const ReturnProducts = () => {
//     const [returnedOrders, setReturnedOrders] = useState([]);


//     useEffect(() => {
//         fetchReturns();
//     }, []);


//     const fetchReturns = async () => {
//         try {
//             const returnResponse = await axiosClient.get("/fetchreturns");
//             console.log("Return response:", returnResponse.data.orders);
//             setReturnedOrders(returnResponse.data.orders);
//         } catch (error) {
//             console.log("Error fetching returned orders:", error);
//         }
//     };



//     const handleRefund = async (price, userId, orderid) => {
//         const data = { price, userId, orderid };

//         Swal.fire({
//             title: "Are you sure?",
//             text: `Refund ₹${price} to this user?`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes, refund it!",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const walletResponse = await axiosClient.post("/refundttransaction", data);
//                     console.log("Wallet response:", walletResponse);
//                     Swal.fire("Refunded!", "The amount has been refunded to the user's wallet.", "success");
//                     fetchReturns();
//                 } catch (error) {
//                     console.log("Error:", error);
//                     Swal.fire("Error!", "Something went wrong while processing the refund.", "error");
//                 }
//             }
//         });
//     };


//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Returned Orders</h1>
//             {returnedOrders.length === 0 ? (
//                 <p className="text-center text-gray-500">No returned orders found.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Order ID</th>
//                                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Username</th>
//                                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Product</th>
//                                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Total Price</th>
//                                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Order Date</th>
//                                 <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {returnedOrders.map((order) => (
//                                 <tr
//                                     key={order._id}
//                                     className="border-t border-gray-200 hover:bg-gray-50"
//                                 >
//                                     <td className="px-4 py-2 text-sm text-gray-700">{order._id}</td>
//                                     <td className="px-4 py-2 text-sm text-gray-700">{order.userId.username}</td>
//                                     <td className="px-4 py-2 text-sm text-gray-700">
//                                         {order.products.map((product, index) => (
//                                             <p key={index} className="mb-1">{product.productName}</p>
//                                         ))}
//                                     </td>
//                                     <td className="px-4 py-2 text-sm text-gray-700">₹{order.totalPrice}</td>
//                                     <td className="px-4 py-2 text-sm text-gray-700">
//                                         {new Date(order.orderDate).toLocaleString()}
//                                     </td>
//                                     <td className="px-4 py-2 text-center">
//                                         <button
//                                             className={`px-4 py-2 text-sm font-medium rounded-md transition ${order.refunded
//                                                     ? "bg-gray-400 text-gray-800 cursor-not-allowed"
//                                                     : "bg-green-500 text-white hover:bg-green-600"
//                                                 }`}
//                                             onClick={() => handleRefund(order.totalPrice, order.address.userId, order._id)}
//                                             disabled={order.refunded} // Disable the button if the order is refunded
//                                         >
//                                             {order.refunded ? "Refunded" : "Refund"}
//                                         </button>
//                                     </td>

//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ReturnProducts;

import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Swal from "sweetalert2";

const ReturnProducts = () => {
    const [returnedOrders, setReturnedOrders] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    
    useEffect(() => {
        fetchReturns();
    }, [pagination.currentPage]);

    const fetchReturns = async () => {
        try {
            const response = await axiosClient.get("/fetchreturns", {
                params: {
                    page: pagination.currentPage,
                    limit: 10, // Adjust the limit as needed
                },
            });
            console.log("Return response:", response.data.orders);
            setReturnedOrders(response.data.orders);
            setPagination({
                ...pagination,
                totalPages: response.data.pagination.totalPages,
            });
        } catch (error) {
            console.log("Error fetching returned orders:", error);
        }
    };

    const handleRefund = async (price, userId, orderid) => {
        const data = { price, userId, orderid };

        Swal.fire({
            title: "Are you sure?",
            text: `Refund ₹${price} to this user?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, refund it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const walletResponse = await axiosClient.post("/refundttransaction", data);
                    console.log("Wallet response:", walletResponse);
                    Swal.fire("Refunded!", "The amount has been refunded to the user's wallet.", "success");
                    fetchReturns();
                } catch (error) {
                    console.log("Error:", error);
                    Swal.fire("Error!", "Something went wrong while processing the refund.", "error");
                }
            }
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination({ ...pagination, currentPage: newPage });
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Returned Orders</h1>
            {returnedOrders.length === 0 ? (
                <p className="text-center text-gray-500">No returned orders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Order ID</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Username</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Product</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Total Price</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Order Date</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnedOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="border-t border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2 text-sm text-gray-700">{order._id}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{order.userId.username}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        {order.products.map((product, index) => (
                                            <p key={index} className="mb-1">{product.productName}</p>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700">₹{order.totalPrice}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        {new Date(order.orderDate).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition ${order.refunded
                                                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                                                    : "bg-green-500 text-white hover:bg-green-600"
                                                }`}
                                            onClick={() => handleRefund(order.totalPrice, order.address.userId, order._id)}
                                            disabled={order.refunded} // Disable the button if the order is refunded
                                        >
                                            {order.refunded ? "Refunded" : "Refund"}
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination controls */}
                    <div className="mt-4 flex justify-center space-x-4">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
                            disabled={pagination.currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="flex items-center">{pagination.currentPage} / {pagination.totalPages}</span>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
                            disabled={pagination.currentPage === pagination.totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnProducts;

