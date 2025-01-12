import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const OfferDetails = () => {
    const [offers, setOffers] = useState([]);


    useEffect(() => {
        fetchCategoryOffers();
    }, []);

    const fetchCategoryOffers = async () => {
        try {
            const response = await axiosClient.get('/categoryofferdetails');
            setOffers(response.data.offerDetails);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    const deleteOffer = async (id) => {
        try {
            const response = await axiosClient.delete(`/categoryoffer/${id}`);
            console.log(response);


            setOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== id));
        } catch (error) {
            console.error('Error deleting offer:', error);
        }
    };


    const filteredOffers = offers.filter((offer) => {
        const isValidDiscount = offer.discount?.value !== undefined && offer.discount?.value > 0;
        const isValidExpiry = offer.discount?.expiryDate
            ? new Date(offer.discount.expiryDate) >= new Date()
            : true;
        return isValidDiscount && isValidExpiry;
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Offer Details</h1>
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
                                {offer.discount?.type || 'N/A'}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {offer.discount?.value || 'N/A'}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {offer.discount?.expiryDate
                                    ? new Date(offer.discount.expiryDate).toLocaleDateString()
                                    : 'N/A'}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => deleteOffer(offer._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OfferDetails;
