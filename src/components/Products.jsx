

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductThunk } from '../features/productManagementSlice';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Products = () => {
  const dispatch = useDispatch();

  const [blockfetch, setblockfetch] = useState(false)

  const handleBlock = async (id) => {
    const response = await axiosClient.put('/disableproduct', { id })
    console.log("response from server : ", response.data)
    setblockfetch(!blockfetch)
  }

  const { products } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProductThunk());
  }, [dispatch, blockfetch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) => 
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const navigate = useNavigate();
  const handleAddProduct = () => {
    navigate('/addproduct')
  }

  const handleEdit = (id) => {
    navigate(`/editproduct/${id}`)
  }

  return (
    <div className="p-5 bg-gray-100">
      <h1 className="text-2xl font-bold mb-5">Product Management</h1>

      <div className="flex justify-between mb-5">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 w-1/2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-center border border-gray-300">Image</th>
            <th className="p-3 text-center border border-gray-300">Product</th>
            <th className="p-3 text-center border border-gray-300">Model</th>
            <th className="p-3 text-center border border-gray-300">SKU</th>
            <th className="p-3 text-center border border-gray-300">Price</th>
            <th className="p-3 text-center border border-gray-300">Quantity</th>
            <th className="p-3 text-center border border-gray-300">Category</th>
            <th className="p-3 text-center border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="text-center p-3 border flex justify-center  border-gray-300">
                  <img src={product.imageUrls[0]} alt="" className="w-16 h-16  rounded-xl object-cover" />
                </td>
                <td className="text-center p-3 border border-gray-300">{product.productName}</td>
                <td className="text-center p-3 border border-gray-300">{product.modelName}</td>
                <td className="text-center p-3 border border-gray-300">{product.sku}</td>
                <td className="text-center p-3 border border-gray-300">{product.price}</td>
                <td className="text-center p-3 border border-gray-300">{product.quantity}</td>
                <td className="text-center p-3 border border-gray-300">{product.categoryId.categoryName}</td>
                <td className="text-center p-3 border border-gray-300">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleEdit(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 ml-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleBlock(product._id)}
                  >
                    {product.isDeleted ? <p>Unblock</p> : <p>Block</p>}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-3">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;

