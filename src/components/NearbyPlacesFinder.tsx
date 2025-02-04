import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Search, Loader } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: number;
  lat: number;
  lng: number;
  type: string;
  photo?: string;
  isOpen?: boolean;
  priceLevel?: number;
  phoneNumber?: string;
}

interface GoMapsPlace {
  place_id?: string;
  name?: string;
  vicinity?: string;
  rating?: number;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    }
  };
  types?: string[];
  photos?: Array<{
    getUrl?: (options: { maxWidth: number }) => string;
  }>;
  opening_hours?: {
    open_now?: boolean;
  };
  price_level?: number;
  formatted_phone_number?: string;
}

const NearbyPlacesFinder: React.FC = () => {
  const [latitude, setLatitude] = useState('12.9716');
  const [longitude, setLongitude] = useState('77.5946');
  const [radius, setRadius] = useState(10);
  const [searchName, setSearchName] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 4]); // min and max price level

  // Get API key from environment variable
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const searchNearbyPlaces = async () => {
    setLoading(true);
    setError('');
    setDebugInfo('Starting search...');

    try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid coordinates');
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('Coordinates out of valid range');
      }

      setDebugInfo('Fetching places from GoMaps API...');

      // Build the nearby search URL with all parameters
      const searchUrl = new URL('https://maps.gomaps.pro/maps/api/place/nearbysearch/json');
      
      interface SearchParams {
        key: string;
        location: string;
        radius: string;
        language: string;
        type: string;
        keyword?: string;
        opennow?: string;
        minprice?: string;
        maxprice?: string;
      }

      const params: SearchParams = {
        key: GOOGLE_MAPS_API_KEY,
        location: `${lat},${lng}`,
        radius: (radius * 1000).toString(), // Convert km to meters
        language: 'en',
        type: 'store', // Default to store type
      };

      // Add optional parameters
      if (searchName.trim()) {
        params.keyword = searchName.trim();
      }
      if (showOpenOnly) {
        params.opennow = 'true';
      }
      if (priceRange[0] > 0) {
        params.minprice = priceRange[0].toString();
      }
      if (priceRange[1] < 4) {
        params.maxprice = priceRange[1].toString();
      }

      // Add parameters to URL
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchUrl.searchParams.append(key, value);
        }
      });

      console.log('Request URL:', searchUrl.toString()); // For debugging

      const response = await fetch(searchUrl.toString());
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`GoMaps API error: ${data.status}`);
      }

      // Transform the results
      const transformedPlaces = await Promise.all(data.results.map(async (place: GoMapsPlace, index: number) => {
        // Fetch additional details including phone number if place_id exists
        let phoneNumber;
        if (place.place_id) {
          try {
            const detailsUrl = new URL('https://maps.gomaps.pro/maps/api/place/details/json');
            detailsUrl.searchParams.append('key', GOOGLE_MAPS_API_KEY);
            detailsUrl.searchParams.append('place_id', place.place_id);
            detailsUrl.searchParams.append('fields', 'formatted_phone_number');

            const detailsResponse = await fetch(detailsUrl.toString());
            const detailsData = await detailsResponse.json();
            
            if (detailsData.status === 'OK' && detailsData.result) {
              phoneNumber = detailsData.result.formatted_phone_number;
            }
          } catch (err) {
            console.error('Error fetching place details:', err);
          }
        }

        return {
          id: place.place_id || index.toString(),
          name: place.name || 'Unknown Place',
          address: place.vicinity || 'No address available',
          rating: place.rating || 0,
          distance: calculateDistance(
            lat,
            lng,
            place.geometry?.location.lat || lat,
            place.geometry?.location.lng || lng
          ),
          lat: place.geometry?.location.lat || lat,
          lng: place.geometry?.location.lng || lng,
          type: (place.types?.[0] || 'Unknown').replace('_', ' '),
          photo: place.photos?.[0]?.getUrl?.({ maxWidth: 400 }),
          isOpen: place.opening_hours?.open_now,
          priceLevel: place.price_level,
          phoneNumber
        };
      }));

      setPlaces(transformedPlaces.sort((a: Place, b: Place) => a.distance - b.distance));
      setDebugInfo(`Found ${transformedPlaces.length} places within ${radius}km`);

    } catch (err: any) {
      console.error('Search error:', err);
      setError('Error: ' + err.message);
      setDebugInfo('Error occurred during search: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setLoading(false);
          setDebugInfo('Retrieved current location');
        },
        (error) => {
          setError('Geolocation error: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const searchByLocation = async () => {
    if (!locationSearch.trim()) return;

    setLoading(true);
    setError('');
    setDebugInfo('Searching location...');

    try {
      const geocodeUrl = new URL('https://maps.gomaps.pro/maps/api/geocode/json');
      geocodeUrl.searchParams.append('key', GOOGLE_MAPS_API_KEY);
      geocodeUrl.searchParams.append('address', locationSearch.trim());

      const response = await fetch(geocodeUrl.toString());
      const data = await response.json();

      if (data.status === 'OK' && data.results?.[0]?.geometry?.location) {
        const { lat, lng } = data.results[0].geometry.location;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setDebugInfo(`Found location: ${data.results[0].formatted_address}`);
        
        // Automatically search for places in this location
        await searchNearbyPlaces();
      } else {
        throw new Error('Location not found');
      }
    } catch (err: any) {
      console.error('Geocoding error:', err);
      setError('Error finding location: ' + err.message);
      setDebugInfo('Error occurred during location search: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-6 p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Find Nearby Places</h2>
          <p className="text-sm text-gray-600 mt-2">
            Search by location name or use coordinates to find nearby places
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Location Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="e.g., Bangalore, MG Road, Central Park"
                className="flex-1 p-2 border rounded"
                onKeyDown={(e) => e.key === 'Enter' && searchByLocation()}
              />
              <button
                onClick={searchByLocation}
                disabled={loading || !locationSearch.trim()}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Search
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or use coordinates</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 12.9716"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 77.5946"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            onClick={getCurrentLocation}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Use My Current Location
          </button>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Name
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="e.g., supermarket, mall"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="openNow"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="openNow" className="text-sm text-gray-700">
              Show only open places
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <input
              type="range"
              min="0"
              max="4"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
            <div className="text-sm text-gray-600 text-center">
              {'$'.repeat(priceRange[0])} - {'$'.repeat(priceRange[1])}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Radius (km)
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 text-center">
              {radius} km
            </div>
          </div>

          <button
            onClick={searchNearbyPlaces}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Search Nearby Places
          </button>

          {error && (
            <div className="text-red-500 text-center p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          {debugInfo && (
            <div className="text-gray-600 text-sm bg-gray-50 p-2 rounded">
              Debug: {debugInfo}
            </div>
          )}
        </div>
      </Card>

      {places.length > 0 && (
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Found Places</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {places.length} results within {radius}km
              {searchName && ` matching "${searchName}"`}
              {showOpenOnly && ' (Open now)'}
            </p>
          </div>
          <div className="space-y-4">
            {places.map((place) => (
              <div
                key={place.id}
                className="p-4 border rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {place.photo && (
                    <img
                      src={place.photo}
                      alt={place.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{place.name}</h3>
                    <p className="text-gray-600">{place.address}</p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">
                        {place.distance.toFixed(1)}km away
                      </span>
                      <div className="flex items-center gap-2">
                        {place.isOpen !== undefined && (
                          <span className={place.isOpen ? 'text-green-600' : 'text-red-600'}>
                            {place.isOpen ? 'Open' : 'Closed'}
                          </span>
                        )}
                        <span className="text-yellow-600">
                          {place.rating > 0 ? `★ ${place.rating.toFixed(1)}` : 'No rating'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex justify-between text-sm text-gray-500">
                      <span>Type: {place.type}</span>
                      <div className="flex items-center gap-4">
                        {place.phoneNumber && (
                          <a 
                            href={`tel:${place.phoneNumber}`}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {place.phoneNumber}
                          </a>
                        )}
                        {place.priceLevel !== undefined && (
                          <span>{'$'.repeat(place.priceLevel)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default NearbyPlacesFinder; 