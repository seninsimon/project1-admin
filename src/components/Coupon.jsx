import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Coupon = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleCreateCoupon = async () => {
    if (!code.trim()) {
      toast.error('Coupon code is required');
      return;
    }
    if (!discount || discount <= 0 || discount > 50) {
      toast.error('Discount must be between 1 and 50%');
      return;
    }
    if (!expiryDate || new Date(expiryDate) < new Date()) {
      toast.error('Expiry date must be in the future');
      return;
    }

    try {
      const response = await axiosClient.post('/createcoupon', { code, discount, expiryDate });
      console.log('Coupon created response:', response);
      toast.success('Coupon created successfully');
      navigate('/coupondetails');

      // Reset fields
      setCode('');
      setDiscount('');
      setExpiryDate('');
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error('Failed to create coupon');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Create Coupon</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Coupon Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full border rounded p-2"
          placeholder="Enter coupon code"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Discount (%)</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Enter discount percentage (Max: 50%)"
          onBlur={() => {
            if (discount > 50) {
              toast.error('Discount cannot exceed 50%');
              setDiscount(50);
            }
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Expiry Date</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="w-full border rounded p-2"
          min={new Date().toISOString().split('T')[0]} // Prevents selecting past dates
        />
      </div>
      <button
        onClick={handleCreateCoupon}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Create Coupon
      </button>
    </div>
  );
};

export default Coupon;
    