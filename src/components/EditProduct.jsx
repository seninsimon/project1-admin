// import React, { useEffect, useState, useRef } from 'react';
// import axiosClient from '../api/axiosClient';
// import { useNavigate, useParams } from 'react-router-dom';
// import './AddProduct.css';
// import { editProductThunk } from '../features/productManagementSlice';
// import { useDispatch } from 'react-redux';
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
// import { toast } from 'react-toastify';


// const EditProduct = () => {
//     const [category, setCategory] = useState([]);
//     const { id } = useParams();
//     const [fetchedData, setFetchedData] = useState({
//         productName: '',
//         sku: '',
//         modelName: '',
//         price: '',
//         quantity: '',
//         description: '',
//         brand: '',
//         categoryName: '',
//         categoryId : {},
//         imageUrls: [],
//     });

//     const [images, setImages] = useState([]);
//     const [imageToCrop, setImageToCrop] = useState(null); // Image for cropping
//     const cropperRef = useRef(null);

//     const dispatch = useDispatch();

//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 const response = await axiosClient.get('/fetchcategory');
//                 setCategory(response.data.categoryDetails);
                
                
//             } catch (error) {
//                 console.error('Error fetching categories:', error);
//             }
//         };
//         fetchCategory();
//     }, []);

//     useEffect(() => {
//         const fetchDetails = async () => {
//             const response = await axiosClient.get(`/editproduct/${id}`);
//             console.log("edit fetch : ", response);
//             setFetchedData(response.data.editProducts);
//             setImages(response.data.editProducts.imageUrls);
//         };
//         fetchDetails();
//     }, [id]);


//     const navigate = useNavigate()

//     const [sub, setsub] = useState(false)

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setsub(!sub)
//         dispatch(editProductThunk({ id, fetchedData, images }))
//             .then(() => {
//                 navigate('/products')
//                 toast.success('Product updated successfully!', {
//                     position: 'top-center',
//                     autoClose: 3000, // Close after 3 seconds
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                 });
//             })
//             .catch(() => {
//                 setsub(!sub)
//             })
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImageToCrop(URL.createObjectURL(file)); // Load the image to the cropper
//         }
//     };

//     const handleCrop = () => {
//         const cropper = cropperRef.current.cropper;
//         const croppedCanvas = cropper.getCroppedCanvas();
//         croppedCanvas.toBlob((blob) => {
//             const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
//             setImages([...images, file]); // Add cropped image to the list
//             setImageToCrop(null); // Close cropper modal
//         });
//     };

//     const handleDeleteImage = (index) => {
//         const updatedImages = images.filter((_, i) => i !== index);
//         setImages(updatedImages);
//     };


//     const [btn , setbtn] = useState(false)

//     const handleChange = (e) => {

//         setbtn(true)
//         const { name, value } = e.target;
//         setFetchedData({ ...fetchedData, [name]: value });
//     };

//     return (
//         <div className="add-product-container">
//             <p className="text-orange-500 text-[20px] text-center">Edit Product Details</p>

//             <form className="add-product-form">
//                 <label htmlFor="">product name</label>
//                 <input
//                     type="text"
//                     name="productName"
//                     placeholder="Product Name"
//                     onChange={handleChange}
//                     className="input-field"
//                     value={fetchedData.productName}
//                 />
//                 <label htmlFor="">sku</label>
//                 <input
//                     type="text"
//                     name="sku"
//                     placeholder="SKU"
//                     onChange={handleChange}
//                     className="input-field"
//                     value={fetchedData.sku}
//                 />
//                 <label htmlFor="">model name</label>
//                 <input
//                     type="text"
//                     name="modelName"
//                     placeholder="Model Name"
//                     onChange={handleChange}
//                     className="input-field"
//                     value={fetchedData.modelName}
//                 />
//                 <label htmlFor="">Price</label>
//                 <input
//                     type="number"
//                     name="price"
//                     placeholder="Price"
//                     onChange={handleChange}
//                     className="input-field"
//                     value={fetchedData.price}
//                 />
//                 <label htmlFor="">Quantity</label>
//                 <input
//                     type="number"
//                     name="quantity"
//                     placeholder="Quantity"
//                     onChange={handleChange}
//                     className="input-field"
//                     value={fetchedData.quantity}
//                 />
//                 <label htmlFor="">description</label>
//                 <textarea
//                     name="description"
//                     placeholder="Description"
//                     onChange={handleChange}
//                     className="textarea-field"
//                     value={fetchedData.description}
//                 ></textarea>

//                 <label htmlFor="">Brand name</label>
//                 <input
//                     type="text"
//                     name="brand"
//                     placeholder="Brand Name"
//                     onChange={handleChange}
//                     className="input-field"
//                     value={fetchedData.brand}
//                 />
//                  <label htmlFor="">add images</label>
//                 <input
//                     type="file"
//                     name="imageUrl"
//                     multiple
//                     accept="image/*"
//                     className="file-input"
//                     onChange={handleFileChange}
//                 />

//                 {/* Cropping Modal */}
//                 {imageToCrop && (
//                     <div className="cropper-overlay">
//                         <div className="cropper-modal-content">
//                             <div className="cropper-modal-header">Crop Your Image</div>
//                             <div className="cropper-modal-body">
//                                 <Cropper
//                                     src={imageToCrop}
//                                     style={{ height: 400, width: '100%' }}
//                                     aspectRatio={1} // Adjust aspect ratio as needed
//                                     guides={true}
//                                     ref={cropperRef}
//                                 />
//                             </div>
//                             <div className="cropper-buttons">
//                                 <button type="button" onClick={handleCrop} className="primary-btn">
//                                     Crop & Save
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setImageToCrop(null)}
//                                     className="secondary-btn"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <div className="image-preview-container">
//                     {images.map((img, index) => (
//                         <div key={index} className="image-container">
//                             <img
//                                 src={typeof img === 'string' ? img : URL.createObjectURL(img)}
//                                 alt={`product-${index}`}
//                                 className="preview-image"
//                             />
//                             <button
//                                 type="button"
//                                 className="delete-button"
//                                 onClick={() => handleDeleteImage(index)}
//                             >
//                                 &times;
//                             </button>
//                         </div>
//                     ))}
//                 </div>

//                 <select
//                     name="categoryName"
//                     className="select-field"
//                     onChange={handleChange}
//                 >
//                     <option>Select Category</option>
//                     {category.map((cat, index) => (
//                         <option key={index} value={cat.categoryName}>
//                             {cat.categoryName}
//                         </option>

//                     ))}
//                 </select>

//                 <button className={btn ? 'bg-orange-400 p-3 rounded-lg cursor-pointer border-none ' : 'bg-slate-500 p-3 rounded-lg  border-none cursor-not-allowed opacity-50 '}
//                 disabled={btn ? false : true } 
//                 onClick={handleSubmit}>
//                     {
//                         sub ? "submitting..." : "submit"
//                     }
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default EditProduct;


import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, useParams } from 'react-router-dom';
import './AddProduct.css';
import { editProductThunk } from '../features/productManagementSlice';
import { useDispatch } from 'react-redux';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { toast } from 'react-toastify';

const EditProduct = () => {
    const [category, setCategory] = useState([]);
    const { id } = useParams();
    const [fetchedData, setFetchedData] = useState({
        productName: '',
        sku: '',
        modelName: '',
        price: '',
        quantity: '',
        description: '',
        brand: '',
        categoryName: '',
        categoryId : {},
        imageUrls: [],
    });

    const [images, setImages] = useState([]);
    const [imageToCrop, setImageToCrop] = useState(null); // Image for cropping
    const cropperRef = useRef(null);

    const dispatch = useDispatch();

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

    useEffect(() => {
        const fetchDetails = async () => {
            const response = await axiosClient.get(`/editproduct/${id}`);
            console.log("edit fetch : ", response);
            setFetchedData({
                ...response.data.editProducts,
                categoryName: response.data.editProducts.categoryId.categoryName
              });
              
           
            setImages(response.data.editProducts.imageUrls);
        };
        fetchDetails();
    }, [id]);

    const navigate = useNavigate()

    const [sub, setsub] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Add form validation check
        setsub(!sub)
        dispatch(editProductThunk({ id, fetchedData, images }))
            .then(() => {
                navigate('/products')
                toast.success('Product updated successfully!', {
                    position: 'top-center',
                    autoClose: 3000, // Close after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch(() => {
                setsub(!sub)
            })
    };

    // Validate the form fields
    const validateForm = () => {
        if (!fetchedData.productName || !fetchedData.sku || !fetchedData.modelName || !fetchedData.price || !fetchedData.quantity || !fetchedData.description || !fetchedData.brand || !fetchedData.categoryName) {
            toast.error("Please fill all the fields.");
            return false;
        }

        if (fetchedData.price <= 0) {
            toast.error("Price should be a positive number.");
            return false;
        }

        if (fetchedData.quantity < 0) {
            toast.error("Quantity cannot be negative.");
            return false;
        }

        if (images.length === 0) {
            toast.error("Please upload at least one image.");
            return false;
        }

        return true;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageToCrop(URL.createObjectURL(file)); // Load the image to the cropper
        }
    };

    const handleCrop = () => {
        const cropper = cropperRef.current.cropper;
        const croppedCanvas = cropper.getCroppedCanvas();
        croppedCanvas.toBlob((blob) => {
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            setImages([...images, file]); // Add cropped image to the list
            setImageToCrop(null); // Close cropper modal
        });
    };

    const handleDeleteImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    const [btn , setbtn] = useState(false)

    const handleChange = (e) => {
        setbtn(true)
        const { name, value } = e.target;
        setFetchedData({ ...fetchedData, [name]: value });
    };

    return (
        <div className="add-product-container">
            <p className="text-orange-500 text-[20px] text-center">Edit Product Details</p>

            <form className="add-product-form">
                <label htmlFor="">product name</label>
                <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    onChange={handleChange}
                    className="input-field"
                    value={fetchedData.productName}
                />
                <label htmlFor="">sku</label>
                <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    onChange={handleChange}
                    className="input-field"
                    value={fetchedData.sku}
                />
                <label htmlFor="">model name</label>
                <input
                    type="text"
                    name="modelName"
                    placeholder="Model Name"
                    onChange={handleChange}
                    className="input-field"
                    value={fetchedData.modelName}
                />
                <label htmlFor="">Price</label>
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    onChange={handleChange}
                    className="input-field"
                    value={fetchedData.price}
                />
                <label htmlFor="">Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    onChange={handleChange}
                    className="input-field"
                    value={fetchedData.quantity}
                />
                <label htmlFor="">description</label>
                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    className="textarea-field"
                    value={fetchedData.description}
                ></textarea>

                <label htmlFor="">Brand name</label>
                <input
                    type="text"
                    name="brand"
                    placeholder="Brand Name"
                    onChange={handleChange}
                    className="input-field"
                    value={fetchedData.brand}
                />
                 <label htmlFor="">add images</label>
                <input
                    type="file"
                    name="imageUrl"
                    multiple
                    accept="image/*"
                    className="file-input"
                    onChange={handleFileChange}
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

                <div className="image-preview-container">
                    {images.map((img, index) => (
                        <div key={index} className="image-container">
                            <img
                                src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                alt={`product-${index}`}
                                className="preview-image"
                            />
                            <button
                                type="button"
                                className="delete-button"
                                onClick={() => handleDeleteImage(index)}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                <select
                    name="categoryName"
                    className="select-field"
                    onChange={handleChange}
                    value={fetchedData.categoryName}
                >
                    <option>Select Category</option>
                    {category.map((cat, index) => (
                        <option key={index} value={cat.categoryName}>
                            {cat.categoryName}
                        </option>
                    ))}
                </select>

                <button className={btn ? 'bg-orange-400 p-3 rounded-lg cursor-pointer border-none ' : 'bg-slate-500 p-3 rounded-lg  border-none cursor-not-allowed opacity-50 '}
                disabled={btn ? false : true } 
                onClick={handleSubmit}>
                    {sub ? "submitting..." : "submit"}
                </button>
            </form>
        </div>
    );
};

export default EditProduct;

