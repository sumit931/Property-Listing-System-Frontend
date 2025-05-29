import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container, Alert, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getMyListedProperties, deleteProperty, getPropertyTypes, getStates, getCities, getAmenities, getPropertyTags } from '../services/propertyService';
import type { Property } from './SearchPropertyPage'; 
import PropertyCard from '../components/PropertyCard';
import EditPropertyModal from '../components/EditPropertyModal';
import CreatePropertyModal from '../components/CreatePropertyModal';

const MyListedPropertiesPage: React.FC = () => {
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const fetchDropdownData = async () => {
    try {
      const [types, statesData, citiesData, amenitiesData, tagsData] = await Promise.all([
        getPropertyTypes(),
        getStates(),
        getCities(),
        getAmenities(),
        getPropertyTags()
      ]);
      setPropertyTypes(types);
      setStates(statesData);
      setCities(citiesData);
      setAmenities(amenitiesData);
      setTags(tagsData);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  const fetchMyProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyListedProperties();
      if (Array.isArray(data)) {
        setMyProperties(data);
      } else {
        console.error("Data received for my listed properties is not an array:", data);
        setMyProperties([]);
        setError('Failed to load your listed properties: Unexpected data format.');
      }
    } catch (err: any) {
      console.error('Error fetching my listed properties:', err);
      setError(err.message || 'Failed to fetch your listed properties. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDropdownData();
    fetchMyProperties();
  }, []);

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handlePropertyUpdated = (updatedProperty: Property) => {
    setMyProperties(prevProperties => 
      prevProperties.map(p => p._id === updatedProperty._id ? updatedProperty : p)
    );
  };

  const handlePropertyCreated = (newProperty: Property) => {
    setMyProperties(prevProperties => [newProperty, ...prevProperties]);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await deleteProperty(propertyId);
        setMyProperties(prevProperties => prevProperties.filter(p => p._id !== propertyId));
        alert('Property deleted successfully!');
      } catch (err: any) {
        console.error("Failed to delete property:", err);
        alert(`Failed to delete property: ${err.message || 'Please try again.'}`);
      }
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
          My Listed Properties
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <MuiButton variant="contained" color="primary" onClick={() => setIsCreateModalOpen(true)}>
            List Property
          </MuiButton>
          <MuiButton variant="outlined" onClick={() => navigate('/')}> 
            Back to Home
          </MuiButton>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {myProperties.length === 0 && !loading && !error && (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>
          You haven't listed any properties yet.
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'flex-start' }}>
        {myProperties.map(property => (
          <PropertyCard 
            key={property._id} 
            property={property} 
            onEdit={handleEditProperty}
            onDelete={handleDeleteProperty}
            showFavouriteActions={false}
            isExplicitlyOwner={true}
          />
        ))}
      </Box>

      {selectedProperty && (
        <EditPropertyModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProperty(null);
          }}
          onPropertyUpdated={handlePropertyUpdated}
          property={selectedProperty}
          propertyTypes={propertyTypes}
          states={states}
          cities={cities}
          amenities={amenities}
          tags={tags}
        />
      )}

      <CreatePropertyModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onPropertyCreated={handlePropertyCreated}
        propertyTypes={propertyTypes}
        states={states}
        cities={cities}
        amenities={amenities}
        tags={tags}
      />
    </Container>
  );
};

export default MyListedPropertiesPage; 