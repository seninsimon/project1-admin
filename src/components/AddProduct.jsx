

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { addProductThunk } from '../features/productManagementSlice';
import axiosClient from '../api/axiosClient';
import './AddProduct.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [productData, setProductData] = useState({
        productName: '',
        sku: '',
        modelName: '',
        price: '',
        quantity: '',
        description: '',
        brand: '',
        categoryName: '',
    });

    const [images, setImages] = useState([]);
    const [category, setCategory] = useState([]);
    const [imageToCrop, setImageToCrop] = useState(null); // Image for cropping
    const cropperRef = useRef(null);

    const [errors, setErrors] = useState({});

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axiosClient.get('/fetchcategory');
                setCategory(response.data.categoryDetails);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategory();
    }, []);

    // Handle form data input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    // Handle file input for images
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageToCrop(URL.createObjectURL(file)); // Load the image to the cropper
        }
    };

    // Handle cropping the image
    const handleCrop = () => {
        const cropper = cropperRef.current.cropper;
        const croppedCanvas = cropper.getCroppedCanvas();
        croppedCanvas.toBlob((blob) => {
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            setImages([...images, file]); // Add cropped image to the list
            setImageToCrop(null); // Close cropper modal
        });
    };

    // Handle deleting images
    const handleDeleteImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        // Update the input element's files
        const inputElement = document.querySelector('input[name="imageUrl"]');
        const dataTransfer = new DataTransfer();
        updatedImages.forEach((file) => {
            dataTransfer.items.add(file);
        });
        inputElement.files = dataTransfer.files;
    };

    // Validation function
    const validateForm = () => {
        const errors = {};

        // Required fields
        if (!productData.productName) errors.productName = 'Product Name is required';
        if (!productData.sku) errors.sku = 'SKU is required';
        if (!productData.modelName) errors.modelName = 'Model Name is required';
        if (!productData.price) errors.price = 'Price is required';
        if (productData.price <= 0) errors.price = 'Price must be a positive number';
        if (!productData.quantity) errors.quantity = 'Quantity is required';
        if (productData.quantity <= 0) errors.quantity = 'Quantity must be a positive number';
        if (!productData.description) errors.description = 'Description is required';
        if (!productData.brand) errors.brand = 'Brand Name is required';
        if (!productData.categoryName) errors.categoryName = 'Category is required';
        if (images.length === 0) errors.images = 'At least one image is required';

        setErrors(errors);

        // Return true if no errors
        return Object.keys(errors).length === 0;
    };

    // Handle adding the product
    const handleAddProduct = (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) return;

        dispatch(addProductThunk({ productData, images })).unwrap()
            .then(() => {
                navigate('/products');
                toast.success('Product added successfully!', {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch((error) => {
                toast.error('Failed to add product.', {
                    position: 'top-center',
                    autoClose: 3000,
                });
            });
    };

    return (
        <div className="add-product-container">
            <p className="text-orange-500 text-[20px]  text-center">Add Product Details</p>

            <form className="add-product-form">
                <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.productName}
                />
                {errors.productName && <div className="error text-red-600">{errors.productName}</div>}

                <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.sku}
                />
                {errors.sku && <div className="error text-red-600">{errors.sku}</div>}

                <input
                    type="text"
                    name="modelName"
                    placeholder="Model Name"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.modelName}
                />
                {errors.modelName && <div className="error text-red-600">{errors.modelName}</div>}

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.price}
                />
                {errors.price && <div className="error text-red-600">{errors.price}</div>}

                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.quantity}
                />
                {errors.quantity && <div className="error text-red-600">{errors.quantity}</div>}

                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    className="textarea-field"
                    value={productData.description}
                ></textarea>
                {errors.description && <div className="error text-red-600">{errors.description}</div>}

                <input
                    type="text"
                    name="brand"
                    placeholder="Brand Name"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.brand}
                />
                {errors.brand && <div className="error text-red-600">{errors.brand}</div>}

                <input
                    type="file"
                    name="imageUrl"
                    multiple
                    accept="image/*"
                    onChange={handleImage}
                    className="file-input"
                />
                {errors.images && <div className="error text-red-600  ">{errors.images}</div>}

                {/* Cropping Modal */}
                {imageToCrop && (
                    <div className="cropper-overlay">
                        <div className="cropper-modal-content">
                            <div className="cropper-modal-header">Crop Your Image</div>
                            <div className="cropper-modal-body">
                                <Cropper
                                    src={imageToCrop}
                                    style={{ height: 400, width: '100%' }}
                                    aspectRatio={1}
                                    guides={true}
                                    ref={cropperRef}
                                />
                            </div>
                            <div className="cropper-buttons">
                                <button type="button" onClick={handleCrop} className="primary-btn">
                                    Crop & Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageToCrop(null)}
                                    className="secondary-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Preview Section */}
                {images.length > 0 && (
                    <div className="image-preview">
                        {images.map((image, index) => (
                            <div key={index} className="image-item">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`upload-preview-${index}`}
                                    className="image-thumbnail"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(index)}
                                    className="delete-image-btn"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <select
                    name="categoryName"
                    onChange={handleChange}
                    className="select-field"
                    value={productData.categoryName}
                >
                    <option value="">Select Category</option>
                    {category.map((cat, index) => (
                        <option key={index} value={cat.categoryName}>
                            {cat.categoryName}
                        </option>
                    ))}
                </select>
                {errors.categoryName && <div className="error text-red-600">{errors.categoryName}</div>}

                <div className="button-group">
                    <button type="submit" onClick={handleAddProduct} className="primary-btn">
                        Add Product
                    </button>
                    <button type="button" className="secondary-btn">
                        Add Variant
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;

