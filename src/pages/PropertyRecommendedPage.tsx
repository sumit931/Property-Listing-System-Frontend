import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container, Alert, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRecommendedProperties } from '../services/propertyService';
import type { Property } from './SearchPropertyPage'; 
import PropertyCard from '../components/PropertyCard';

// Interface for the raw recommendation item from the API
interface RawRecommendation {
  _id: string; // ID of the recommendation record itself
  propertyId: string;
  property: Property; // The core property details are nested here
  amenities: string[];
  tags: string[];
  state: string;
  city: string;
  propertyType: string; // This needs to be mapped to 'type' for PropertyCard
  // ... other fields like recommendToUserEmail, recommendByUserId, recommendedBy
}

const PropertyRecommendedPage: React.FC = () => {
  // Store the transformed properties suitable for PropertyCard
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
          // First, ensure rec.property exists and has an _id
          if (!rec.property || typeof rec.property._id === 'undefined') {
            console.warn('Skipping recommendation due to missing or invalid nested property object:', rec);
            return null; // Skip this malformed record
          }
          return {
            ...rec.property,         // Spread core property details (like title, price, _id from nested property)
            _id: rec.property._id,    // Ensure we use the actual property's ID for keys and actions
            type: rec.propertyType,   // Map propertyType to type
            city: rec.city,
            state: rec.state,
            amenities: rec.amenities,
            tags: rec.tags,
            // Ensure all fields expected by the Property interface are present, defaulting if necessary
            // Example: if Property expects createdBy and it's not in rec.property, you might add it as undefined or a default.
          } as Property; // Assert type after transformation
        }).filter(p => p !== null) as Property[]; // Filter out any nulls from malformed records
        
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

  // We might need a way to update the favourite status on the card if added from this page
  // For now, PropertyCard's internal state will handle the "Favourited" text change on click.

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
            key={property._id} // This should be the actual property's ID from rec.property._id
            property={property} 
            showFavouriteActions={true}
          />
        ))}
      </Box>
    </Container>
  );
};

export default PropertyRecommendedPage; 