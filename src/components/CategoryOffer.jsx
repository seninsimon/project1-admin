import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, useParams } from 'react-router-dom';

const CategoryOffer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [catname, setCatname] = useState('');
    const [offerType, setOfferType] = useState('flat'); // Default to 'flat'
    const [offerValue, setOfferValue] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCateName();
    }, []);

    const fetchCateName = async () => {
        try {
            const response = await axiosClient.post('/categoryname', { id });
            setCatname(response.data.categoryDetails.categoryName);
        } catch (error) {
            console.error('Error fetching category name:', error);
        }
    };

    const handleOfferTypeChange = (e) => {
        setOfferType(e.target.value);
        setOfferValue(''); // Reset value when type changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for offer value
        if (offerValue <= 0) {
            setError('Offer value must be greater than 0.');
            return;
        }

        if (offerType === 'percentage' && offerValue > 100) {
            setError('Percentage discount cannot exceed 50%.');
            return;
        }

        if (offerType === 'flat' && offerValue > 500) {
            setError('Flat discount value cannot exceed 500.');
            return;
        }

        // Validation for expiry date
        const today = new Date().toISOString().split('T')[0]; // Get current date in yyyy-mm-dd format
        if (expiryDate < today) {
            setError('Expiry date cannot be in the past.');
            return;
        }

        setError(''); // Clear error if all validations pass

        const data = { offerType, offerValue, expiryDate, id };

        try {
            const response = await axiosClient.post('/categoryoffer', data);
            console.log('Response:', response);
            navigate('/offerdetails');
        } catch (error) {
            console.error('Error submitting offer:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Create Offer for <span className="text-indigo-600">{catname}</span> Category
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Offer Type */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Offer Type</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="offerType"
                                    value="flat"
                                    checked={offerType === 'flat'}
                                    onChange={handleOfferTypeChange}
                                    className="form-radio text-indigo-600"
                                />
                                <span className="ml-2 text-gray-700">Flat Discount</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="offerType"
                                    value="percentage"
                                    checked={offerType === 'percentage'}
                                    onChange={handleOfferTypeChange}
                                    className="form-radio text-indigo-600"
                                />
                                <span className="ml-2 text-gray-700">Percentage Discount</span>
                            </label>
                        </div>
                    </div>

                    {/* Offer Value */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Offer Value</label>
                        <input
                            type="number"
                            placeholder={offerType === 'flat' ? 'Enter flat amount' : 'Enter percentage'}
                            value={offerValue}
                            onChange={(e) => setOfferValue(e.target.value)}
                            required
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                            min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 transition duration-300"
                    >
                        Submit Offer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryOffer;
