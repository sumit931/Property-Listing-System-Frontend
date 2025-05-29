import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = getCurrentUser();
  const location = useLocation();

  if (!currentUser) {
    // User not authenticated, redirect to login page
    // Pass the current location in state so we can redirect back after login (optional)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the requested component
  return children;
};

export default ProtectedRoute; 