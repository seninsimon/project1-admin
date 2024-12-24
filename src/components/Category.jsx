import React, { useEffect, useState } from 'react';
import './Category.css';
import { useDispatch, useSelector } from 'react-redux';
import { categoryAddThunk, categoryDeleteThunk, categoryEditThunk, fetchCategoryThunk } from '../features/categorySlice';

const Category = () => {
    const [editMode, setEditMode] = useState(false);
    const [categoryData, setCategoryData] = useState('');
    const [editId, setEditId] = useState('');
    const [cateName, setCategoryName] = useState('');

    const toggleEditMode = (id) => {
        setEditMode(!editMode);
        setEditId(id);
    };

    const { category } = useSelector((state) => state.category);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategoryThunk());
    }, [dispatch]);

    const handleAddCategory = () => {
        if (categoryData.trim() !== '') {
            dispatch(categoryAddThunk(categoryData))
                .then(() => {
                    setCategoryData('');
                    dispatch(fetchCategoryThunk());
                })
                .catch((error) => {
                    console.error('Failed to add category:', error);
                });
        }
    };

    const handleEdit = () => {
        setEditMode(!editMode);
        dispatch(categoryEditThunk({ editId, cateName }))
            .unwrap()
            .then(() => {
                dispatch(fetchCategoryThunk());
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDelete = (id) => {
        dispatch(categoryDeleteThunk(id))
            .unwrap()
            .then(() => {
                dispatch(fetchCategoryThunk());
            });
    };

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
                    {category.length > 0 ? (
                        category.map((cat) => (
                            <tr key={cat._id}>
                                <td>{cat.categoryName}</td>
                                <td>
                                    <button className={`status-btn ${cat.isActive ? 'active' : 'inactive'}`}>
                                        {cat.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td>
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

            <div className="add-category">
                <input
                    type="text"
                    placeholder="Enter category name"
                    className="add-input"
                    name="categoryName"
                    value={categoryData}
                    onChange={(e) => setCategoryData(e.target.value)}
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
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="save-btn" onClick={handleEdit}>
                                Save
                            </button>
                            <button className="cancel-btn" onClick={toggleEditMode}>
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
