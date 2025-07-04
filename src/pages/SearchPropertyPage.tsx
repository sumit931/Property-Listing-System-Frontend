import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCities, getStates, getPropertyTypes, getAmenities, getPropertyTags,
  searchProperties
} from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import {
  Box, Typography, CircularProgress, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Autocomplete, IconButton
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Define interfaces for the data structures
interface City {
  _id: string;
  city: string;
}

interface State {
  _id: string;
  state: string;
}

interface PropertyType {
  _id: string;
  type: string;
}

interface Amenity {
  _id: string;
  name: string;
}

interface Tag {
  _id: string;
  name: string;
}

export interface Property {
  _id: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: string;
  availableFrom: string;
  listedBy: string;
  tags: string[];
  colorTheme?: string;
  rating?: number;
  isVerified?: boolean;
  listingType: 'sale' | 'rent';
  createdBy?: string;
}

interface Filters {
  title: string;
  typeId: string;
  minPrice: string;
  maxPrice: string;
  stateId: string;
  cityId: string;
  minBedrooms: string;
  minBathrooms: string;
  amenityIds: string[];
  furnished: string;
  tagIds: string[];
  minRating: string;
  listingType: string;
  availableFrom: string;
}

const initialFilters: Filters = {
  title: '',
  typeId: '',
  minPrice: '',
  maxPrice: '',
  stateId: '',
  cityId: '',
  minBedrooms: '',
  minBathrooms: '',
  amenityIds: [],
  furnished: '',
  tagIds: [],
  minRating: '',
  listingType: '',
  availableFrom: '',
};

const furnishedOptions = ['Furnished', 'Unfurnished', 'Semi'];
const listingTypeOptions = ['sale', 'rent'];

const ITEM_SPACING = 2; // Corresponds to theme.spacing(2)

const SearchPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [amenities, setAmenitiesData] = useState<Amenity[]>([]);
  const [tags, setTagsData] = useState<Tag[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingInitialData(true);
        const [citiesData, statesData, propertyTypesData, amenitiesData, tagsData] = await Promise.all([
          getCities(),
          getStates(),
          getPropertyTypes(),
          getAmenities(),
          getPropertyTags(),
        ]);
        
        console.log("Fetched citiesData:", JSON.stringify(citiesData, null, 2));
        setCities(citiesData);

        console.log("Fetched statesData:", JSON.stringify(statesData, null, 2));
        setStates(statesData);

        console.log("Fetched propertyTypesData:", JSON.stringify(propertyTypesData, null, 2));
        setPropertyTypes(propertyTypesData);
        
        console.log("Fetched amenitiesData:", JSON.stringify(amenitiesData, null, 2));
        setAmenitiesData(amenitiesData);

        console.log("Fetched tagsData:", JSON.stringify(tagsData, null, 2));
        setTagsData(tagsData);

      } catch (error) {
        console.error("Failed to fetch initial data in Promise.all or set state:", error);
        setCities([]);
        setStates([]);
        setPropertyTypes([]);
        setAmenitiesData([]);
        setTagsData([]);
      } finally {
        setLoadingInitialData(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  
  const handleAmenityChange = (_event: React.SyntheticEvent, value: Amenity[]) => {
    setFilters(prev => ({ ...prev, amenityIds: value.map(option => option._id) }));
  };

  const handleTagChange = (_event: React.SyntheticEvent, value: Tag[]) => {
    setFilters(prev => ({ ...prev, tagIds: value.map(option => option._id) }));
  };

  const handleSearch = async () => {
    setLoadingSearch(true);
    try {
      const results = await searchProperties(filters);
      setProperties(results);
    } catch (error) {
      console.error("Failed to search properties:", error);
      setProperties([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setProperties([]);
  };

  const handleEditProperty = (property: Property) => {
    console.log("Edit property:", property);
    // TODO: Implement edit functionality (e.g., open a modal with a form)
  };

  const handleDeleteProperty = async (propertyId: string) => {
    console.log("Delete property:", propertyId);
    // TODO: Implement delete functionality (call service, then refresh list or remove from state)
    // Example: 
    // if (window.confirm("Are you sure you want to delete this property?")) {
    //   try {
    //     await deletePropertyService(propertyId);
    //     setProperties(prev => prev.filter(p => p._id !== propertyId));
    //   } catch (error) { console.error("Failed to delete property", error); }
    // }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loadingInitialData) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleGoHome} sx={{ mr: 1 }} aria-label="go back to home">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ mb: 0 }}>
            Search Properties
          </Typography>
        </Box>
      </Box>
      
      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: ITEM_SPACING, mb: 4 }}>
        {/* Min Price */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(16.666% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <TextField fullWidth label="Min Price" name="minPrice" type="number" value={filters.minPrice} onChange={handleInputChange} />
        </Box>
        {/* Max Price */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(16.666% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <TextField fullWidth label="Max Price" name="maxPrice" type="number" value={filters.maxPrice} onChange={handleInputChange} />
        </Box>

        {/* Min Bedrooms */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(16.666% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <TextField fullWidth label="Min Bedrooms" name="minBedrooms" type="number" value={filters.minBedrooms} onChange={handleInputChange} />
        </Box>
        {/* Min Bathrooms */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(16.666% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <TextField fullWidth label="Min Bathrooms" name="minBathrooms" type="number" value={filters.minBathrooms} onChange={handleInputChange} />
        </Box>

        {/* State Selection */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(16.666% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              name="stateId"
              value={filters.stateId}
              label="State"
              onChange={handleSelectChange}
            >
              <MenuItem value="">Any</MenuItem>
              {states.map((state) => (
                <MenuItem key={state._id} value={state._id}>
                  {state.state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* City Selection */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(16.666% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Select
              name="cityId"
              value={filters.cityId}
              label="City"
              onChange={handleSelectChange}
            >
              <MenuItem value="">Any</MenuItem>
              {cities.map((city) => (
                <MenuItem key={city._id} value={city._id}>
                  {city.city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Property Type Selection */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(16.666% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <FormControl fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Select
              name="typeId"
              value={filters.typeId}
              label="Property Type"
              onChange={handleSelectChange}
            >
              <MenuItem value="">Any</MenuItem>
              {propertyTypes.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {type.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Furnished Status */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(33.333% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <FormControl fullWidth>
            <InputLabel>Furnished Status</InputLabel>
            <Select name="furnished" value={filters.furnished} label="Furnished Status" onChange={handleSelectChange}>
              <MenuItem value=""><em>Any</em></MenuItem>
              {furnishedOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Listing Type */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(33.333% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <FormControl fullWidth>
            <InputLabel>Listing Type</InputLabel>
            <Select name="listingType" value={filters.listingType} label="Listing Type" onChange={handleSelectChange}>
              <MenuItem value=""><em>Any</em></MenuItem>
              {listingTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Min Rating */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(33.333% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <TextField fullWidth label="Min Rating (0-5)" name="minRating" type="number" value={filters.minRating} onChange={handleInputChange} inputProps={{ min: 0, max: 5 }} />
        </Box>

        {/* Available From */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)`, md: `calc(33.333% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <TextField
            fullWidth
            label="Available From"
            name="availableFrom"
            type="date"
            value={filters.availableFrom}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        
        {/* Amenities */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <Autocomplete
            multiple
            options={amenities}
            getOptionLabel={(option) => option.name}
            value={amenities.filter(option => filters.amenityIds.includes(option._id))}
            onChange={handleAmenityChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Amenities"
                placeholder="Select Amenities"
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                <Checkbox checked={filters.amenityIds.includes(option._id)} />
                <ListItemText primary={option.name} />
              </li>
            )}
          />
        </Box>

        {/* Tags */}
        <Box sx={{ width: { xs: '100%', sm: `calc(50% - ${ITEM_SPACING*4}px)` }, p: ITEM_SPACING / 2 }}>
          <Autocomplete
            multiple
            options={tags}
            getOptionLabel={(option) => option.name}
            value={tags.filter(option => filters.tagIds.includes(option._id))}
            onChange={handleTagChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Select Tags"
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                <Checkbox checked={filters.tagIds.includes(option._id)} />
                <ListItemText primary={option.name} />
              </li>
            )}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: ITEM_SPACING, mt: ITEM_SPACING, p: ITEM_SPACING / 2 }}>
          <Button variant="outlined" onClick={handleResetFilters} disabled={loadingSearch}>Reset</Button>
          <Button variant="contained" onClick={handleSearch} disabled={loadingSearch}>
            {loadingSearch ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
      </Box>

      {/* Property Listing Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Properties</Typography>
      {loadingSearch && <CircularProgress />}
      {!loadingSearch && properties.length === 0 && <Typography>No properties found. Try adjusting your filters.</Typography>}
      {!loadingSearch && properties.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: ITEM_SPACING, justifyContent: 'flex-start' }}>
          {properties.map(property => (
            <PropertyCard 
              key={property._id} 
              property={property} 
              onEdit={handleEditProperty} 
              onDelete={handleDeleteProperty} 
              showFavouriteActions={true}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchPropertyPage;