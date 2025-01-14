import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const OfferDetails = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchCategoryOffers();
  }, []);

  // Fetch category offers from the API
  const fetchCategoryOffers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get('/categoryofferdetails');
      setOffers(response.data.offerDetails || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to fetch offers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an offer
  const deleteOffer = async (id) => {
    try {
      await axiosClient.delete(`/categoryoffer/${id}`);
      setOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== id));
      toast.success('Offer removed successfully');
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error('Failed to remove offer. Please try again.');
    }
  };

  // Filter valid offers
  const filteredOffers = offers.filter((offer) => {
    const { value, expiryDate } = offer.discount || {};
    const isValidDiscount = value !== undefined && value > 0;
    const isNotExpired = expiryDate ? new Date(expiryDate) >= Date.now() : true;
    return isValidDiscount && isNotExpired;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Offer Details</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading offers...</p>
      ) : filteredOffers.length === 0 ? (
        <p className="text-center text-gray-500">No active offers available.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Category Name</th>
              <th className="py-2 px-4 border-b text-left">Discount Type</th>
              <th className="py-2 px-4 border-b text-left">Discount Value</th>
              <th className="py-2 px-4 border-b text-left">Expiry Date</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.map((offer) => (
              <tr key={offer._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{offer.categoryName}</td>
                <td className="py-2 px-4 border-b">
                  {offer.discount?.type || 'No Discount'}
                </td>
                <td className="py-2 px-4 border-b">
                  {offer.discount?.value || 'No Discount'}
                </td>
                <td className="py-2 px-4 border-b">
                  {offer.discount?.expiryDate
                    ? new Date(offer.discount.expiryDate).toLocaleDateString()
                    : 'Expired'}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => deleteOffer(offer._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Remove Discount
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OfferDetails;
