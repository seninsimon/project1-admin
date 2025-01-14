import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const CouponDetails = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetchCouponDetails();
  }, []);

  const fetchCouponDetails = async () => {
    try {
      const response = await axiosClient.get('/coupondetails');
      setCoupons(response.data.coupondetails);
      
    } catch (error) {
      console.error('Error fetching coupon details:', error);
      toast.error('Failed to fetch coupon details');
    }
  };

  const deleteCoupon = async (id) => {
    try {
      const response = await axiosClient.delete(`/deletecoupon/${id}`);
      console.log(response);
      
      setCoupons(coupons.filter((coupon) => coupon._id !== id));
      toast.success('Coupon deleted successfully');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Coupon Details</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-gray-50">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Code</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Discount Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Expiry Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-b">
                <td className="px-4 py-2 text-sm text-gray-700">{coupon.code}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{coupon.discount}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {coupon.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Expired</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => deleteCoupon(coupon._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No coupons available</p>
        )}
      </div>
    </div>
  );
};

export default CouponDetails;
