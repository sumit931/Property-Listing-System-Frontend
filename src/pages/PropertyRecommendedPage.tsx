import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container, Alert, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRecommendedProperties } from '../services/propertyService';
import type { Property } from './SearchPropertyPage'; 
import PropertyCard from '../components/PropertyCard';

// Interface for the raw recommendation item from the API
interface RawRecommendation {
  _id: string;
  propertyId: string;
  recommendToUserEmail: string;
  recommendByUserId: string;
  property: {
    _id: string;
    title: string;
    price: number;
    areaSqFt: number;
    bedrooms: number;
    bathrooms: number;
    furnished: string;
    availableFrom: string;
    listedBy: string;
    colorTheme?: string;
    rating?: number;
    isVerified?: boolean;
    listingType: 'sale' | 'rent';
  };
  amenities: string[];
  tags: string[];
  state: string;
  city: string;
  propertyType: string;
  recommendedBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const PropertyRecommendedPage: React.FC = () => {
  const [displayProperties, setDisplayProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRecommendedProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const rawRecommendations: RawRecommendation[] = await getRecommendedProperties();
      if (Array.isArray(rawRecommendations)) {
        // Transform the raw recommendations into the structure PropertyCard expects
        const transformedProperties = rawRecommendations.map(rec => {
          if (!rec.property || typeof rec.property._id === 'undefined') {
            console.warn('Skipping recommendation due to missing or invalid nested property object:', rec);
            return null;
          }
          return {
            _id: rec.property._id,
            title: rec.property.title,
            type: rec.propertyType,
            price: rec.property.price,
            state: rec.state,
            city: rec.city,
            areaSqFt: rec.property.areaSqFt,
            bedrooms: rec.property.bedrooms,
            bathrooms: rec.property.bathrooms,
            amenities: rec.amenities,
            tags: rec.tags,
            furnished: rec.property.furnished,
            availableFrom: rec.property.availableFrom,
            listedBy: rec.property.listedBy,
            listingType: rec.property.listingType,
            colorTheme: rec.property.colorTheme,
            rating: rec.property.rating,
            isVerified: rec.property.isVerified,
            createdBy: rec.recommendByUserId
          } as Property;
        }).filter(p => p !== null) as Property[];
        
        setDisplayProperties(transformedProperties);
      } else {
        console.error("Data received for recommended properties is not an array of recommendations:", rawRecommendations);
        setDisplayProperties([]);
        setError('Failed to load property recommendations: Unexpected data format from service.');
      }
    } catch (err: any) {
      console.error('Error fetching or transforming recommended properties:', err);
      setError(err.message || 'Failed to fetch property recommendations. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendedProperties();
  }, []);

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
          Property Recommendations
        </Typography>
        <MuiButton variant="outlined" onClick={() => navigate('/')}> 
          Back to Home
        </MuiButton>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {displayProperties.length === 0 && !loading && !error && (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>
          No property recommendations available for you at the moment.
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'flex-start' }}>
        {displayProperties.map(property => (
          <PropertyCard 
            key={property._id}
            property={property} 
            showFavouriteActions={true}
          />
        ))}
      </Box>
    </Container>
  );
};

export default PropertyRecommendedPage; 