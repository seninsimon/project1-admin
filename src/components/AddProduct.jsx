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


    const navigate = useNavigate()

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

    const dispatch = useDispatch();

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

    // Handle adding the product
    const handleAddProduct = (e) => {
        e.preventDefault();
        dispatch(addProductThunk({ productData, images })).unwrap()
        .then(()=>
        {
            navigate('/products')
            toast.success('Product added successfully!', {
                position: 'top-center',
                autoClose: 3000, // Close after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
        
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
                <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.sku}
                />
                <input
                    type="text"
                    name="modelName"
                    placeholder="Model Name"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.modelName}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.price}
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.quantity}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    className="textarea-field"
                    value={productData.description}
                ></textarea>
                <input
                    type="text"
                    name="brand"
                    placeholder="Brand Name"
                    onChange={handleChange}
                    className="input-field"
                    value={productData.brand}
                />
                <input
                    type="file"
                    name="imageUrl"
                    multiple
                    accept="image/*"
                    onChange={handleImage}
                    className="file-input"
                />

                {/* Cropping Modal */}
                {imageToCrop && (
                    <div className="cropper-overlay">
                        <div className="cropper-modal-content">
                            <div className="cropper-modal-header">Crop Your Image</div>
                            <div className="cropper-modal-body">
                                <Cropper
                                    src={imageToCrop}
                                    style={{ height: 400, width: '100%' }}
                                    aspectRatio={1} // Adjust aspect ratio as needed
                                    guides={true}
                                    ref={cropperRef}
                                />
                                <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                                    Drag to adjust the crop area. Click "Crop & Save" when you're done.
                                </p>
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
