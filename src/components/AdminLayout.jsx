import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {

  const navigate = useNavigate()


  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/adminlogin')
  }

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate('/adminlogin')
    }
  }, [navigate])




  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>
        <nav>
          <ul className="admin-nav-list">
            <li className="admin-nav-item">
              <Link to="/dashboard" className="admin-nav-link">Dashboard</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/category" className="admin-nav-link">Category</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/products" className="admin-nav-link">Products</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/orders" className="admin-nav-link">Orders</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/usermanagement" className="admin-nav-link">User Management</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/returnproducts" className="admin-nav-link">Return Products</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/offerdetails" className="admin-nav-link">Category Offer Details</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/couponmanagement" className="admin-nav-link">Coupon Management</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/coupondetails" className="admin-nav-link">Coupon Details</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/productofferdetails" className="admin-nav-link">Product Offer Details</Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/topanalyticspage" className="admin-nav-link">Top Analytics</Link>
            </li>
           

            
            <button
              onClick={handleLogout}
              className="px-4 py-2 mt-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-all duration-300"
            >
              Logout
            </button>

          </ul>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
