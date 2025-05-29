import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Autocomplete, Checkbox, ListItemText, CircularProgress, Alert
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
// Use type-only import for NewPropertyData
import { createProperty } from '../services/propertyService';
import type { NewPropertyData } from '../services/propertyService';

// Interfaces for dropdown data (could be shared from a types file eventually)
interface City { _id: string; city: string; /* stateId is no longer needed here if cities are global */}
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

interface CreatePropertyModalProps {
  open: boolean;
  onClose: () => void;
  onPropertyCreated: (newProperty: any) => void; // Adjust 'any' to the actual Property type if available
  // Data for dropdowns, passed from parent
  propertyTypes: PropertyType[];
  states: State[];
  cities: City[]; // Added cities prop to accept all cities
  amenities: Amenity[];
  tags: Tag[];
}

const CreatePropertyModal: React.FC<CreatePropertyModalProps> = ({
  open, onClose, onPropertyCreated,
  propertyTypes, states, cities, amenities, tags
}) => {
  const initialFormData: NewPropertyData = {
    title: '',
    typeId: '',
    price: 0,
    stateId: '',
    cityId: '', // Will be selected from the global list of cities
    areaSqFt: 0,
    bedrooms: 0,
    bathrooms: 0,
    amenityIds: [],
    tagIds: [],
    furnished: 'Unfurnished',
    availableFrom: new Date().toISOString().split('T')[0], // Default to today
    listedBy: 'Owner',
    listingType: 'rent'
  };
  const [formData, setFormData] = useState<NewPropertyData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form when modal opens/closes or dropdown data changes
    if (open) {
      setFormData(initialFormData);
      setError(null);
    }
  }, [open]); // Removed other dependencies to prevent form reset on prop changes while open

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
      // Basic validation example
      if (!formData.title || !formData.typeId || formData.price <= 0 || !formData.stateId || !formData.cityId || formData.areaSqFt <= 0) {
        setError("Please fill in all required fields correctly (Title, Type, Price, State, City, Area).");
        setIsSubmitting(false);
        return;
      }
      const newPropertyResponse = await createProperty(formData);
      // Assuming newPropertyResponse is the created property object or { message: ..., property: ... }
      // If it's { property: ... }, then use newPropertyResponse.property
      // For now, let's assume newPropertyResponse directly contains the property for simplicity
      // You might need to adjust this based on your actual API response structure
      const propertyToAdd = newPropertyResponse.property || newPropertyResponse;

      onPropertyCreated(propertyToAdd); 
      alert('Property listed successfully!');
      onClose(); 
    } catch (err: any) {
      console.error("Failed to list property:", err);
      setError(err.message || 'An unexpected error occurred while listing the property.');
    }
    setIsSubmitting(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" gutterBottom>List New Property</Typography>
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
        <TextField fullWidth label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms || ''} onChange={handleInputChange} margin="normal" InputProps={{ inputProps: { min: 0 } }} />
        <TextField fullWidth label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms || ''} onChange={handleInputChange} margin="normal" InputProps={{ inputProps: { min: 0 } }}/>

        <FormControl fullWidth margin="normal">
          <InputLabel>Furnished Status</InputLabel>
          <Select name="furnished" value={formData.furnished} label="Furnished Status" onChange={handleSelectChange as any /* TSEnumFix */}>
            {furnishedOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </Select>
        </FormControl>

        <Autocomplete multiple fullWidth options={amenities} getOptionLabel={(option) => option.name} value={amenities.filter(a => formData.amenityIds?.includes(a._id))} onChange={handleAmenityChange}
          renderInput={(params) => <TextField {...params} margin="normal" label="Amenities" />}
          renderOption={(props, option, { selected }) => <li {...props}><Checkbox checked={selected} /><ListItemText primary={option.name} /></li>}
        />

        <Autocomplete multiple fullWidth options={tags} getOptionLabel={(option) => option.name} value={tags.filter(t => formData.tagIds?.includes(t._id))} onChange={handleTagChange}
          renderInput={(params) => <TextField {...params} margin="normal" label="Tags" />}
          renderOption={(props, option, { selected }) => <li {...props}><Checkbox checked={selected} /><ListItemText primary={option.name} /></li>}
        />

        <TextField fullWidth label="Available From" name="availableFrom" type="date" value={formData.availableFrom} onChange={handleInputChange} margin="normal" InputLabelProps={{ shrink: true }} />

        <FormControl fullWidth margin="normal">
          <InputLabel>Listed By</InputLabel>
          <Select name="listedBy" value={formData.listedBy} label="Listed By" onChange={handleSelectChange as any /* TSEnumFix */}>
            {listedByOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Listing Type</InputLabel>
          <Select name="listingType" value={formData.listingType} label="Listing Type" onChange={handleSelectChange as any /* TSEnumFix */}>
            {listingTypeOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "List Property"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePropertyModal; 