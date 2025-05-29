import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SearchPropertyPage from './pages/SearchPropertyPage';
import LikedPropertyPage from './pages/LikedPropertyPage';
import SuggestedPropertyPage from './pages/SuggestedPropertyPage';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentUser } from './services/authService';

// WelcomePage component (simple inline component for '/' if user is not logged in, or can be a separate file)
const WelcomePage: React.FC = () => (
  <div>
    <h1>Welcome to the Property Listing App!</h1>
    <p>Please log in or register to continue.</p>
    {/* You can add links to login/register here if desired */}
  </div>
);

const App: React.FC = () => {
  const currentUser = getCurrentUser();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Route for welcoming unauthenticated users to root, or redirecting authenticated users to HomePage */}
        <Route 
          path="/welcome" 
          element={currentUser ? <Navigate to="/" replace /> : <WelcomePage />} 
        />

        {/* Protected routes wrapped by ProtectedRoute */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/search-property" 
          element={
            <ProtectedRoute>
              <SearchPropertyPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/liked-property" 
          element={
            <ProtectedRoute>
              <LikedPropertyPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/suggested-property" 
          element={
            <ProtectedRoute>
              <SuggestedPropertyPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback for any other path - redirect to welcome or home based on auth */}
        <Route path="*" element={currentUser ? <Navigate to="/" replace /> : <Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
