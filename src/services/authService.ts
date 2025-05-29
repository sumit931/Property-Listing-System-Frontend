import axios from 'axios';

const API_URL = '/auth'; // Changed from '/api/auth'

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
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    // You might want to decode the token to get user info
    // For now, just returning the presence of a token
    return { token }; 
  }
  return null;
}; 