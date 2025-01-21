import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const ProductOfferDetails = () => {
  const [offers, setOffers] = useState([]); // State to store product offers
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductOfferDetails();
  }, []);

  const fetchProductOfferDetails = async () => {
    try {
      const response = await axiosClient.get("/fetchproductofferdetails");
      const data = response.data.offers.filter(offer => offer.productOffer); // Exclude items with null productOffer
      setOffers(data);
    } catch (error) {
      console.error("Error fetching product offer details:", error);
      setError("Failed to fetch product offer details. Please try again.");
    }
  };

  const handleDeleteOffer = async (id) => {
    console.log(id);
    
    try {
      const response =   await axiosClient.delete(`/deleteproductoffer/${id}`);
      setOffers(prevOffers => prevOffers.filter(offer => offer._id !== id)); // Remove the deleted offer from the state
    } catch (error) {
      console.error("Error deleting product offer:", error);
      setError("Failed to delete the product offer. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Product Offer Details</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {offers.length > 0 ? (
        <table className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Product Name</th>
              <th className="py-2 px-4 text-left">Offer Type</th>
              <th className="py-2 px-4 text-left">Offer Value</th>
              <th className="py-2 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer._id} className="border-t">
                <td className="py-2 px-4">{offer.productName}</td>
                <td className="py-2 px-4 capitalize">{offer.productOffer.type}</td>
                <td className="py-2 px-4">{offer.productOffer.value}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDeleteOffer(offer._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700">No product offers available.</p>
      )}
    </div>
  );
};

export default ProductOfferDetails;
