import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

interface DeliveryRouteProps {
  origin: string;
  destination: string;
}

const MAPS_API_KEY = 'AlzaSyDKk3hJYmXFdjC2JFfoK23tFoZeu1fut2H';
const API_ENDPOINT = 'https://maps.gomaps.pro/maps/api/directions/json';

const DeliveryRoute: React.FC<DeliveryRouteProps> = ({ origin, destination }) => {
  const [directions, setDirections] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDirections = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_ENDPOINT}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${MAPS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch directions');
      }

      const data = await response.json();
      if (data.status === 'OK') {
        setDirections(data);
        setError(null);
      } else {
        setError('Could not find directions for the specified route');
      }
    } catch (err) {
      setError('Error fetching directions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (origin && destination) {
      fetchDirections();
    }
  }, [origin, destination]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!directions) {
    return null;
  }

  const route = directions.routes[0];
  const leg = route.legs[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Route Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">From</p>
            <p className="font-medium">{leg.start_address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">To</p>
            <p className="font-medium">{leg.end_address}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Distance</p>
            <p className="font-medium">{leg.distance.text}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="font-medium">{leg.duration.text}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Step by Step Directions</h3>
        <div className="space-y-4">
          {leg.steps.map((step: any, index: number) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium">{index + 1}</span>
              </div>
              <div>
                <p className="text-gray-700" 
                   dangerouslySetInnerHTML={{ __html: step.html_instructions }} />
                <p className="text-sm text-gray-500 mt-1">
                  {step.distance.text} - {step.duration.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <LoadScript googleMapsApiKey={MAPS_API_KEY}>
          <GoogleMap
            mapContainerClassName="w-full h-96 rounded-lg"
            center={{
              lat: leg.start_location.lat,
              lng: leg.start_location.lng
            }}
            zoom={12}
          >
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: '#22C55E',
                    strokeWeight: 4
                  }
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default DeliveryRoute; 