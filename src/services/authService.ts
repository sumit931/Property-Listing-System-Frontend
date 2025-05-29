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
  const token = localStorage.getItem('token');
  if (token) {
    // Placeholder for JWT decoding. Replace with actual JWT decoding logic.
    // Example with a hypothetical jwt_decode function:
    // try {
    //   const decodedToken: { _id: string, email: string, iat: number, exp: number } = jwt_decode(token);
    //   return { token, _id: decodedToken._id, email: decodedToken.email };
    // } catch (error) {
    //   console.error("Failed to decode token:", error);
    //   localStorage.removeItem('token'); // Invalid token, remove it
    //   return null;
    // }

    // For demonstration, assuming token itself contains some user info or is an object after decoding
    // YOU MUST REPLACE THIS WITH ACTUAL JWT DECODING that extracts user._id
    // This is a placeholder and will not work without a real decode function.
    // Let's simulate that the decoded token might have an _id directly for now.
    // This is NOT secure and NOT how JWTs work directly but for flow purposes:
    const decodedUser = { _id: 'mockUserId-replace-me', token: token }; // SIMULATED
    return decodedUser;
  }
  return null;
}; 