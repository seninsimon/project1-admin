import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLoginThunk } from '../features/adminLoginSlice';
import './AdminLogin.css';

const AdminLogin = () => {
    const [adminLoginData, setAdminLoginData] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    useEffect(()=>
    {
        const token = localStorage.getItem("adminToken")
        if(token)
        navigate('/')
    },[navigate])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminLoginData({ ...adminLoginData, [name]: value });
    };

    const dispatch = useDispatch();

    const handleAdminLogin = (e) => {
        e.preventDefault();

        dispatch(adminLoginThunk(adminLoginData))
            .unwrap()
            .then(() => {
                navigate('/dashboard');
            })
            .catch((error) => console.log('Admin login denied! ', error));
    };

    return (
        <div className="admin-login-container">
            <form className="admin-login-form">
                <h2>Admin Portal</h2>

                <label htmlFor="username" className="admin-login-label">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter admin username"
                    onChange={handleChange}
                />

                <label htmlFor="password" className="admin-login-label">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter admin password"
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    onClick={handleAdminLogin}
                    className="admin-login-button"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
