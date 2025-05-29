import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { getCurrentUser, logout } from './services/authService';

// A simple placeholder for the home page or other components
const HomePage = () => {
  const user = getCurrentUser();
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">Welcome to Property Listing</Typography>
      {user ? (
        <Typography>You are logged in.</Typography>
      ) : (
        <Typography>Please login or register.</Typography>
      )}
    </Box>
  );
};

const App: React.FC = () => {
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    // Force a re-render or redirect to home/login
    // This is a simple way, consider a state management solution for robust user state
    window.location.reload(); 
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Property Listing
          </Typography>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
