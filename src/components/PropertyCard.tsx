import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import { getCurrentUser } from '../services/authService';
import type { Property } from '../pages/SearchPropertyPage'; // Import Property interface

// Removed local Property interface definition

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete }) => {
  const currentUser = getCurrentUser();
  // Ensure currentUser and _id exist before comparing
  const isOwner = currentUser && currentUser._id && property.createdBy === currentUser._id;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <Card sx={{ width: { xs: '100%', sm: `calc(50% - 8px)`, md: `calc(33.333% - 16px)` }, m: 1, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {property.title}
        </Typography>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          ${property.price.toLocaleString()} {property.listingType === 'rent' ? '/ month' : ''}
        </Typography>
        {/* Displaying type which should come from property.type (assuming it's populated by backend) */}
        <Typography variant="body2" color="text.secondary">Type: {property.type}</Typography>
        <Typography variant="body2" color="text.secondary">Location: {property.city}, {property.state}</Typography>
        <Typography variant="body2" color="text.secondary">Area: {property.areaSqFt} sq ft</Typography>
        <Typography variant="body2" color="text.secondary">Beds: {property.bedrooms}, Baths: {property.bathrooms}</Typography>
        <Typography variant="body2" color="text.secondary">Furnished: {property.furnished}</Typography>
        <Typography variant="body2" color="text.secondary">Available: {formatDate(property.availableFrom)}</Typography>
        {property.amenities && property.amenities.length > 0 && (
          <Typography variant="body2" color="text.secondary">Amenities: {property.amenities.join(', ')}</Typography>
        )}
         {/* Display tags if available */}
        {property.tags && property.tags.length > 0 && (
            <Typography variant="body2" color="text.secondary">Tags: {property.tags.join(', ')}</Typography>
        )}
        <Typography variant="body2" color="text.secondary">Listed By: {property.listedBy}</Typography>
      </CardContent>
      {isOwner && (
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => onEdit(property)}>Edit</Button>
          <Button size="small" color="error" onClick={() => onDelete(property._id)}>Delete</Button>
        </CardActions>
      )}
    </Card>
  );
};

export default PropertyCard; 