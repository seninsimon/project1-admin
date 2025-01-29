import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';


const ProductOffer = () => {
  const { id } = useParams();
  const [offerType, setOfferType] = useState("");
  const [offerValue, setOfferValue] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [productName , setproductName] = useState("")

  const navigate = useNavigate()

  const handleOfferTypeChange = (e) => {
    setOfferType(e.target.value);
    setError("");
  };

  const handleOfferValueChange = (e) => {
    setOfferValue(e.target.value);
    setError("");
  };

  const validateAndSubmit = async (e) => {
    e.preventDefault();

    if (!offerType) {
      setError("Please select an offer type.");
      return;
    }

    if (!offerValue || isNaN(offerValue) || offerValue <= 0) {
      setError("Please enter a valid offer value.");
      return;
    }

    if (offerType === "flat" && offerValue > 500) {
      setError("Flat offer value cannot exceed 500.");
      return;
    }

    if (offerType === "percentage" && offerValue > 50) {
      setError("Percentage offer value cannot exceed 50%.");
      return;
    }

    try {
      const response = await axiosClient.post(`/productoffer/${id}`, {
        productOffer: {
          type: offerType,
          value: Number(offerValue),
        },
      });

      setSuccessMessage("Product offer updated successfully!");
      navigate('/productofferdetails')

    } catch (err) {
      console.error("Error updating product offer:", err);
      setError("Failed to update the product offer. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Set Product Offer</h1>
        <form onSubmit={validateAndSubmit} className="space-y-4">
          {/* Offer Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Offer Type:</label>
            <select
              value={offerType}
              onChange={handleOfferTypeChange}
              className="w-full border rounded-lg p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="flat">Flat</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          {/* Offer Value */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Offer Value:</label>
            <input
              type="number"
              value={offerValue}
              onChange={handleOfferValueChange}
              placeholder="Enter value"
              className="w-full border rounded-lg p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error or Success Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Submit Offer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductOffer;
