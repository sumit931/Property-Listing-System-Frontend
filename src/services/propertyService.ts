import axios from 'axios';

const API_URL = '/api'; // This will be rewritten by Vite proxy to remove /api before hitting backend

// Helper to get token and create auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// Fetch Cities
export const getCities = async () => {
  try {
    // Path matches Postman: /listingProperty/city (singular)
    // API_URL (/api) + /listingProperty/city -> proxied to http://localhost:3000/listingProperty/city
    const response = await axios.get(`${API_URL}/listingProperty/city`, { headers: getAuthHeaders() }); 
    // Extract the array from response.data.cities
    return Array.isArray(response.data.cities) ? response.data.cities : [];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

// Fetch States
export const getStates = async () => {
  try {
    // Assuming similar structure for states: /listingProperty/state and response.data.states
    const response = await axios.get(`${API_URL}/listingProperty/state`, { headers: getAuthHeaders() }); 
    return Array.isArray(response.data.states) ? response.data.states : [];
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

// Fetch Property Types
export const getPropertyTypes = async () => {
  try {
    // Assuming similar structure: /listingProperty/propertyType and response.data.propertyTypes
    const response = await axios.get(`${API_URL}/listingProperty/propertyType`, { headers: getAuthHeaders() });
    return Array.isArray(response.data.propertyTypes) ? response.data.propertyTypes : [];
  } catch (error) {
    console.error('Error fetching property types:', error);
    return []; 
  }
};

// Fetch Amenities
export const getAmenities = async () => {
  try {
    // Assuming similar structure: /listingProperty/amenity and response.data.amenities
    const response = await axios.get(`${API_URL}/listingProperty/amenity`, { headers: getAuthHeaders() });
    return Array.isArray(response.data.amenities) ? response.data.amenities : [];
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return [];
  }
};

// Fetch Property Tags
export const getPropertyTags = async () => {
  try {
    // Corrected path to /listingProperty/propertyTag to match the working backend endpoint
    const response = await axios.get(`${API_URL}/listingProperty/propertyTag`, { headers: getAuthHeaders() });
    // Assuming the response structure is { propertyTags: [...] } or { tags: [...] }
    // Let's be explicit and assume it's response.data.propertyTags based on the path
    // If it's response.data.tags, this will need adjustment.
    return Array.isArray(response.data.propertyTags) ? response.data.propertyTags : [];
  } catch (error) {
    console.error('Error fetching property tags:', error);
    return [];
  }
};

// Fetch Properties based on filters
export const searchProperties = async (filters: any) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v as string));
        } else {
          queryParams.append(key, value as string);
        }
      }
    });
    // Corrected path to include /property before query parameters
    const response = await axios.get(`${API_URL}/listingProperty/property?${queryParams.toString()}`, { headers: getAuthHeaders() });
    // Assuming the response structure is { properties: [...] }
    return Array.isArray(response.data.properties) ? response.data.properties : [];
  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
};

// Interface for the property data to be sent to the backend
// This should align with your backend's `postProperty` schema
export interface NewPropertyData {
  title: string;
  typeId: string; // Assuming property type ID
  price: number;
  stateId: string;
  cityId: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenityIds?: string[]; // Optional, as per schema
  tagIds?: string[];     // Optional, as per schema
  furnished: 'Furnished' | 'Unfurnished' | 'Semi';
  availableFrom: string; // Date string e.g., "YYYY-MM-DD"
  listedBy: 'Builder' | 'Owner' | 'Agent';
  listingType: 'sale' | 'rent';
  // colorTheme and rating are optional and might not be part of initial creation by user
  // isVerified is likely backend-set
}

export const createProperty = async (propertyData: NewPropertyData) => {
  try {
    // Corrected path to include /property for the POST request
    const response = await axios.post(`${API_URL}/listingProperty/property`, propertyData, {
      headers: getAuthHeaders()
    });
    // Assuming create returns the new property object directly or { message: ..., property: ...}
    // If it's nested, e.g., response.data.property, this part might need adjustment after successful creation.
    // For now, assume direct object or we'll see from successful response.
    return response.data; 
  } catch (error) {
    console.error('Error creating property:', error);
    if (axios.isAxiosError(error) && error.response) {
      // Try to throw the backend's error message if available
      throw error.response.data.message || error.response.data || error;
    }
    throw error;
  }
};

// Function to get cities by state ID (for dependent dropdowns)
export const getCitiesByState = async (stateId: string) => {
  try {
    // Assuming this endpoint is /cities?stateId=... on backend (after proxy rewrite of /api)
    // and returns { cities: [...] }
    const response = await axios.get(`${API_URL}/cities?stateId=${stateId}`, { headers: getAuthHeaders() });
    return Array.isArray(response.data.cities) ? response.data.cities : [];
  } catch (error) {
    console.error(`Error fetching cities for state ${stateId}:`, error);
    return [];
  }
};

// ... (updateProperty, deleteProperty services will be added later) 