import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        // Redirect to login page if no token is found
        return <Navigate to="/adminlogin" replace />;
    }

    return children; // Render protected content if authenticated
};

export default ProtectedRoute;
