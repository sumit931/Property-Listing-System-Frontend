import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, IconButton, Chip, Stack, Tooltip } from '@mui/material';
import { getCurrentUser } from '../services/authService';
import type { Property } from '../pages/SearchPropertyPage'; // Import Property interface
import { addToFavourites } from '../services/propertyService'; // Add this
import RecommendPropertyModal from './RecommendPropertyModal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';

// Removed local Property interface definition

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
  showFavouriteActions?: boolean;
  onRemoveFromFavourites?: (propertyId: string) => void;
  isExplicitlyOwner?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onEdit, 
  onDelete, 
  showFavouriteActions = true,
  onRemoveFromFavourites,
  isExplicitlyOwner = false
}) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const currentUser = getCurrentUser();
  const showOwnerActions = (isExplicitlyOwner || (currentUser && currentUser._id && property.createdBy === currentUser._id)) && onEdit && onDelete;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const handleFavouriteClick = async () => {
    if (!property || !property._id) {
      console.error('Property ID is missing for AddToFavourite');
      alert('Cannot add to favourites: Property ID is missing.');
      return;
    }
    try {
      await addToFavourites(property._id);
      setIsFavourite(true);
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  const handleRecommendClick = () => {
    setIsRecommendModalOpen(true);
  };

  const handleRemoveFromFavourites = () => {
    if (onRemoveFromFavourites && property._id) {
      onRemoveFromFavourites(property._id);
    }
  };

  const isOwner = isExplicitlyOwner || (currentUser && property.createdBy === currentUser._id);

  return (
    <>
      <Card sx={{ width: { xs: '100%', sm: `calc(50% - 8px)`, md: `calc(33.333% - 16px)` }, m: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {property.title}
          </Typography>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            ₹{property.price.toLocaleString()} {property.listingType === 'rent' ? '/ month' : ''}
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
        <CardActions sx={{ justifyContent: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {showOwnerActions && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
              <Button size="small" onClick={() => onEdit!(property)}>Edit</Button>
              <Button size="small" color="error" onClick={() => onDelete!(property._id)}>Delete</Button>
            </Box>
          )}
          
          {showFavouriteActions && (
            <IconButton onClick={handleFavouriteClick} color="primary">
              {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          )}

          {onRemoveFromFavourites && (
            <Button 
              variant="contained" 
              color="warning"
              onClick={handleRemoveFromFavourites} 
              sx={{ width: '100%', mt: 1 }}
            >
              Remove from Favourites
            </Button>
          )}

          <IconButton onClick={handleRecommendClick} color="primary">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>

      <RecommendPropertyModal
        open={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
        propertyId={property._id}
        propertyTitle={property.title}
      />
    </>
  );
};

export default PropertyCard; 