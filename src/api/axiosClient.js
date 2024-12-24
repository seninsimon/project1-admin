import axios from 'axios';

// Create an Axios instance
const axiosClient = axios.create({
    baseURL: "http://localhost:3000", // Replace with your API base URL
});

// Request Interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // Add the token to the Authorization header if available
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle response errors
        console.error("Axios response error:", error.response || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;