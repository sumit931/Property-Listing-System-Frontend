import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/auth';

export const register = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const login = async (credentials: any) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    // Store the token in localStorage or a state management solution
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const logout = () => {
  // Remove the token from localStorage
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Decode the JWT token (it's in format: header.payload.signature)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decodedToken = JSON.parse(jsonPayload);
      return { _id: decodedToken._id, token: token };
    } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem('token'); // Invalid token, remove it
      return null;
    }
  }
  return null;
};