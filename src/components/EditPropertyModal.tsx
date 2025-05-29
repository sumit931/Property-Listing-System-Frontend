import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Autocomplete, Checkbox, ListItemText, CircularProgress, Alert
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { updateProperty } from '../services/propertyService';
import type { NewPropertyData } from '../services/propertyService';
import type { Property } from '../pages/SearchPropertyPage';

interface City { _id: string; city: string; }
interface State { _id: string; state: string; }
interface PropertyType { _id: string; type: string; }
interface Amenity { _id: string; name: string; }
interface Tag { _id: string; name: string; }

const furnishedOptions = ['Furnished', 'Unfurnished', 'Semi'];
const listingTypeOptions = ['sale', 'rent'];
const listedByOptions = ['Builder', 'Owner', 'Agent'];

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

interface EditPropertyModalProps {
  open: boolean;
  onClose: () => void;
  onPropertyUpdated: (updatedProperty: Property) => void;
  property: Property;
  propertyTypes: PropertyType[];
  states: State[];
  cities: City[];
  amenities: Amenity[];
  tags: Tag[];
}

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  open,
  onClose,
  onPropertyUpdated,
  property,
  propertyTypes,
  states,
  cities,
  amenities,
  tags
}) => {
  const [formData, setFormData] = useState<Partial<NewPropertyData>>({
    title: property.title,
    typeId: property.typeId || '',
    price: property.price,
    stateId: property.stateId || '',
    cityId: property.cityId || '',
    areaSqFt: property.areaSqFt,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    amenityIds: property.amenityIds || [],
    tagIds: property.tagIds || [],
    furnished: property.furnished as 'Furnished' | 'Unfurnished' | 'Semi',
    availableFrom: property.availableFrom,
    listedBy: property.listedBy as 'Builder' | 'Owner' | 'Agent',
    listingType: property.listingType
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        title: property.title,
        typeId: property.typeId || '',
        price: property.price,
        stateId: property.stateId || '',
        cityId: property.cityId || '',
        areaSqFt: property.areaSqFt,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenityIds: property.amenityIds || [],
        tagIds: property.tagIds || [],
        furnished: property.furnished as 'Furnished' | 'Unfurnished' | 'Semi',
        availableFrom: property.availableFrom,
        listedBy: property.listedBy as 'Builder' | 'Owner' | 'Agent',
        listingType: property.listingType
      });
      setError(null);
    }
  }, [open, property]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name!]: value
    }));
  };

  const handleAmenityChange = (event: React.SyntheticEvent, value: Amenity[]) => {
    setFormData(prev => ({ ...prev, amenityIds: value.map(option => option._id) }));
  };

  const handleTagChange = (event: React.SyntheticEvent, value: Tag[]) => {
    setFormData(prev => ({ ...prev, tagIds: value.map(option => option._id) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedProperty = await updateProperty(property._id, formData);
      onPropertyUpdated(updatedProperty);
      alert('Property updated successfully!');
      onClose();
    } catch (err: any) {
      console.error("Failed to update property:", err);
      setError(err.message || 'An unexpected error occurred while updating the property.');
    }
    setIsSubmitting(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" gutterBottom>Edit Property</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleInputChange} margin="normal" required />
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Property Type</InputLabel>
          <Select name="typeId" value={formData.typeId} label="Property Type" onChange={handleSelectChange}>
            {propertyTypes.map(pt => <MenuItem key={pt._id} value={pt._id}>{pt.type}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField fullWidth label="Price" name="price" type="number" value={formData.price || ''} onChange={handleInputChange} margin="normal" required InputProps={{ inputProps: { min: 1 } }} />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>State</InputLabel>
          <Select name="stateId" value={formData.stateId} label="State" onChange={handleSelectChange}>
            {states.map(s => <MenuItem key={s._id} value={s._id}>{s.state}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>City</InputLabel>
          <Select name="cityId" value={formData.cityId} label="City" onChange={handleSelectChange}>
            {Array.isArray(cities) && cities.map(c => <MenuItem key={c._id} value={c._id}>{c.city}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField fullWidth label="Area (sq ft)" name="areaSqFt" type="number" value={formData.areaSqFt || ''} onChange={handleInputChange} margin="normal" required InputProps={{ inputProps: { min: 1 } }} />

        <TextField fullWidth label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms || ''} onChange={handleInputChange} margin="normal" required InputProps={{ inputProps: { min: 0 } }} />

        <TextField fullWidth label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms || ''} onChange={handleInputChange} margin="normal" required InputProps={{ inputProps: { min: 0 } }} />

        <FormControl fullWidth margin="normal">
          <InputLabel>Furnished Status</InputLabel>
          <Select name="furnished" value={formData.furnished} label="Furnished Status" onChange={handleSelectChange}>
            {furnishedOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Available From"
          name="availableFrom"
          type="date"
          value={formData.availableFrom}
          onChange={handleInputChange}
          margin="normal"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Listed By</InputLabel>
          <Select name="listedBy" value={formData.listedBy} label="Listed By" onChange={handleSelectChange}>
            {listedByOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Listing Type</InputLabel>
          <Select name="listingType" value={formData.listingType} label="Listing Type" onChange={handleSelectChange}>
            {listingTypeOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          options={amenities}
          getOptionLabel={(option) => option.name}
          value={amenities.filter(option => formData.amenityIds?.includes(option._id))}
          onChange={handleAmenityChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Amenities"
              placeholder="Select Amenities"
              margin="normal"
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} />
              <ListItemText primary={option.name} />
            </li>
          )}
        />

        <Autocomplete
          multiple
          options={tags}
          getOptionLabel={(option) => option.name}
          value={tags.filter(option => formData.tagIds?.includes(option._id))}
          onChange={handleTagChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tags"
              placeholder="Select Tags"
              margin="normal"
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} />
              <ListItemText primary={option.name} />
            </li>
          )}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "Update Property"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditPropertyModal; 