import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container, Alert, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getFavouriteProperties, removeFromFavourites } from '../services/propertyService';
import type { Property } from './SearchPropertyPage';
import PropertyCard from '../components/PropertyCard';

const LikedPropertyPage: React.FC = () => {
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchLikedProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFavouriteProperties();
      if (Array.isArray(data)) {
        setLikedProperties(data);
      } else {
        console.error("Data received for liked properties is not an array:", data);
        setLikedProperties([]);
        setError('Failed to load liked properties: Unexpected data format.');
      }
    } catch (err: any) {
      console.error('Error fetching liked properties:', err);
      setError(err.message || 'Failed to fetch liked properties. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLikedProperties();
  }, []);

  const handleRemoveFromFavourites = async (propertyId: string) => {
    try {
      await removeFromFavourites(propertyId);
      setLikedProperties(prevProperties => prevProperties.filter(p => p._id !== propertyId));
      alert('Property removed from favourites successfully!');
    } catch (err: any) {
      console.error('Error removing from favourites:', err);
      alert(`Failed to remove from favourites: ${err.message || 'Please try again.'}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Liked Properties
        </Typography>
        <MuiButton variant="outlined" onClick={() => navigate('/')}> 
          Back to Home
        </MuiButton>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {likedProperties.length === 0 && !loading && !error && (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>
          You haven't liked any properties yet.
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'flex-start' }}>
        {likedProperties.map(property => (
          <PropertyCard 
            key={property._id} 
            property={property} 
            onRemoveFromFavourites={handleRemoveFromFavourites}
          />
        ))}
      </Box>
    </Container>
  );
};

export default LikedPropertyPage; 