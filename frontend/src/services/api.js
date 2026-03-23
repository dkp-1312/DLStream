import axios from "axios";


// Create an axios instance with a base URL
export const API = axios.create({
    baseURL: import.meta.env.backend_url || "http://localhost:3000", // Replace with your backend URL
    withCredentials: true, // Include cookies for authentication if needed
});



// Example: Function to make a POST request to the login endpoint
export const login = async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
};

// Function to handle signup
export const signup = async (userData) => {
    const response = await API.post("/auth/signup", userData);
    return response.data;
};

export default API;