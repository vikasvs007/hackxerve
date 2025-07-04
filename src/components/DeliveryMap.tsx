import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface DeliveryMapProps {
  origin: string;
  destination: string;
}

interface DirectionsResponse {
  routes: Array<{
    legs: Array<{
      distance: { text: string };
      duration: { text: string };
    }>;
  }>;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ origin, destination }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://maps.gomaps.pro/maps/api/directions/json?origin=${encodeURIComponent(
            origin
          )}&destination=${encodeURIComponent(
            destination
          )}&key=AlzaSyplubBLrYqUCH-O7Xk_sKMz1sAZTVzizke`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch directions');
        }

        const data: DirectionsResponse = await response.json();

        if (data.routes && data.routes[0] && data.routes[0].legs && data.routes[0].legs[0]) {
          const leg = data.routes[0].legs[0];
          setDistance(leg.distance.text);
          setDuration(leg.duration.text);
        }
      } catch (err) {
        console.error('Error fetching directions:', err);
        setError('Unable to calculate route. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (origin && destination) {
      fetchDirections();
    }
  }, [origin, destination]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <p className="text-gray-700">{origin}</p>
          </div>
          <div className="border-l-2 border-dashed border-gray-300 h-8 ml-1.5" />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <p className="text-gray-700">{destination}</p>
          </div>
        </div>
      </div>
      
      {distance && duration && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Estimated Distance</p>
              <p className="text-lg font-semibold text-gray-900">{distance}</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <p className="text-sm text-gray-500">Estimated Time</p>
              <p className="text-lg font-semibold text-gray-900">{duration}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryMap; 