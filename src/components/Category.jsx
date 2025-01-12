
import React, { useEffect, useState } from 'react';
import './Category.css';
import { useDispatch, useSelector } from 'react-redux';
import { categoryAddThunk, categoryDeleteThunk, categoryEditThunk, fetchCategoryThunk } from '../features/categorySlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Category = () => {
    const [editMode, setEditMode] = useState(false);
    const [categoryData, setCategoryData] = useState('');
    const [editId, setEditId] = useState('');
    const [cateName, setCategoryName] = useState('');

    const { category } = useSelector((state) => state.category);
    const dispatch = useDispatch();

    const categoriesPerPage = 10;  // Number of categories per page
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchCategoryThunk());
    }, [dispatch]);

    // Handle Add Category
    const handleAddCategory = () => {
        const lowerCaseCategory = categoryData.trim().toLowerCase();

        if (!lowerCaseCategory) return;
        if (category.some((cat) => cat.categoryName === lowerCaseCategory)) {
            toast.error("Category already exists");
            return;
        }

        dispatch(categoryAddThunk(lowerCaseCategory))
            .then(() => {
                setCategoryData('');
                dispatch(fetchCategoryThunk());
            })
            .catch((error) => {
                console.error('Failed to add category:', error);
            });
    };

    // Handle Edit Category
    const handleEdit = () => {
        const lowerCaseCategory = cateName.trim().toLowerCase();

        if (!lowerCaseCategory) return;
        if (category.some((cat) => cat.categoryName === lowerCaseCategory && cat._id !== editId)) {
            toast.error("Category already exists");
            return;
        }

        dispatch(categoryEditThunk({ editId, cateName: lowerCaseCategory }))
            .unwrap()
            .then(() => {
                setEditMode(false);
                setCategoryName('');
                dispatch(fetchCategoryThunk());
            })
            .catch((error) => {
                console.error('Failed to edit category:', error);
            });
    };

    // Handle Delete Category
    const handleDelete = (id) => {
        dispatch(categoryDeleteThunk(id))
            .unwrap()
            .then(() => {
                dispatch(fetchCategoryThunk());
            });
    };

    // Toggle Edit Mode
    const toggleEditMode = (id) => {
        setEditMode(true);
        setEditId(id);
        const selectedCategory = category.find((cat) => cat._id === id);
        if (selectedCategory) {
            setCategoryName(selectedCategory.categoryName);
        }
    };

    // Calculate which categories to display based on the current page
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = category.slice(indexOfFirstCategory, indexOfLastCategory);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Total Pages Calculation
    const totalPages = Math.ceil(category.length / categoriesPerPage);


    const navigate = useNavigate()


    const handleAddOffer = (categoryid) => {

        navigate(`/categoryoffer/${categoryid}`)

    }




    return (
        <div className="category-management">
            <h1>Category Management</h1>

            <table className="category-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>

                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCategories.length > 0 ? (
                        currentCategories.map((cat) => (
                            <tr key={cat._id}>
                                <td>{cat.categoryName}</td>
                                <td>
                                    <button className={`status-btn ${cat.isActive ? 'active' : 'inactive'}`}>
                                        {cat.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td>
                                    <button className='border p-1 bg-green-400 rounded-lg'
                                        onClick={() => handleAddOffer(cat._id)}
                                    >

                                        Add Offer
                                    </button>
                                    <button className="action-btn edit" onClick={() => toggleEditMode(cat._id)}>
                                        Edit
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(cat._id)}>
                                        {cat.isActive ? 'Block' : <span className="unblock-text">Unblock</span>}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No categories available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination flex items-center justify-center space-x-4 mt-4">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-400"
                >
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-2">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`pagination-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-400"
                >
                    Next
                </button>
            </div>

            <div className="add-category">
                <input
                    type="text"
                    placeholder="Enter category name"
                    className="add-input"
                    name="categoryName"
                    value={categoryData}
                    onChange={(e) => setCategoryData(e.target.value.toLowerCase())}
                />
                <button className="add-btn" onClick={handleAddCategory}>
                    Add Category
                </button>
            </div>

            {editMode && (
                <div className="edit-modal">
                    <div className="modal-content">
                        <h2>Edit Category</h2>
                        <input
                            type="text"
                            placeholder="Enter category name"
                            className="edit-input"
                            value={cateName}
                            onChange={(e) => setCategoryName(e.target.value.toLowerCase())}
                        />
                        <div className="modal-actions">
                            <button className="save-btn" onClick={handleEdit}>
                                Save
                            </button>
                            <button className="cancel-btn" onClick={() => setEditMode(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>


            )}
        </div>
    );
};

export default Category;

