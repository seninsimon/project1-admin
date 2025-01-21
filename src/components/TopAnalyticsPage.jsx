import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const TopAnalyticsPage = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [topBrands, setTopBrands] = useState([]);

    const fetchTopData = async () => {
        try {
            // Fetch top products
            const productsResponse = await axiosClient.get('/top10products');
            setTopProducts(productsResponse.data);

            // Fetch top categories
            const categoriesResponse = await axiosClient.get('/top10categories');
            setTopCategories(categoriesResponse.data);

            // Fetch top brands
            const brandsResponse = await axiosClient.get('/top10brands');
            setTopBrands(brandsResponse.data);
        } catch (error) {
            console.error('Error fetching top analytics data:', error);
        }
    };

    useEffect(() => {
        fetchTopData();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                Admin Analytics Dashboard
            </h1>

            {/* Top Products */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Top 10 Products
                </h2>
                <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Rank</th>
                            <th className="py-3 px-4 text-left">Product Name</th>
                            <th className="py-3 px-4 text-left">Quantity Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProducts.map((product, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                            >
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4">{product.productName}</td>
                                <td className="py-3 px-4">{product.totalQuantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Top Categories */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Top 10 Categories
                </h2>
                <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Rank</th>
                            <th className="py-3 px-4 text-left">Category Name</th>
                            <th className="py-3 px-4 text-left">Quantity Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topCategories.map((category, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                            >
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4">{category.categoryName}</td>
                                <td className="py-3 px-4">{category.totalQuantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Top Brands */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Top 10 Brands
                </h2>
                <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Rank</th>
                            <th className="py-3 px-4 text-left">Brand Name</th>
                            <th className="py-3 px-4 text-left">Quantity Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topBrands.map((brand, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                            >
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4">{brand.brand}</td>
                                <td className="py-3 px-4">{brand.totalQuantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopAnalyticsPage;
