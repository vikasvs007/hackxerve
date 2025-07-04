import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Plus, Trash2 } from 'lucide-react';

interface FarmLocation {
  id: number;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  description: string;
  type: string;
}

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946
};

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
};

const FarmMap: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [farmLocations, setFarmLocations] = useState<FarmLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<FarmLocation | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState<{
    name: string;
    description: string;
    type: string;
  }>({
    name: '',
    description: '',
    type: 'crop'
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const mapOptions = {
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi.business',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Keep default Bangalore coordinates
        }
      );
    }
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (isAddingLocation && event.latLng) {
      const newFarmLocation: FarmLocation = {
        id: Date.now(),
        name: newLocation.name || 'New Farm Location',
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
        description: newLocation.description || 'Farm location description',
        type: newLocation.type
      };

      setFarmLocations([...farmLocations, newFarmLocation]);
      setIsAddingLocation(false);
      setNewLocation({ name: '', description: '', type: 'crop' });
    }
  };

  const handleDeleteLocation = (locationId: number) => {
    setFarmLocations(farmLocations.filter(loc => loc.id !== locationId));
    setSelectedLocation(null);
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'crop':
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'livestock':
        return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      case 'storage':
        return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
  };

  return (
    <div className="chart-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Farm Locations</h2>
        <button
          className={`btn ${isAddingLocation ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
          onClick={() => setIsAddingLocation(!isAddingLocation)}
        >
          {isAddingLocation ? 'Cancel' : <><Plus size={16} /> Add Location</>}
        </button>
      </div>

      {isAddingLocation && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Add New Location</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Location Name"
              className="w-full p-2 border rounded"
              value={newLocation.name}
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={newLocation.description}
              onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded"
              value={newLocation.type}
              onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
            >
              <option value="crop">Crop Farm</option>
              <option value="livestock">Livestock Farm</option>
              <option value="storage">Storage Facility</option>
            </select>
            <p className="text-sm text-gray-600">Click on the map to add the location</p>
          </div>
        </div>
      )}

      <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        <LoadScript 
          googleMapsApiKey="AIzaSyCfM9DyyPMZqY-84K7ottW1G1CPxJ51rf4"
          onLoad={() => setIsLoaded(true)}
        >
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentPosition}
              zoom={13}
              options={mapOptions}
              onClick={handleMapClick}
            >
              {/* Current location marker */}
              <Marker
                position={currentPosition}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
              />

              {/* Farm location markers */}
              {farmLocations.map(location => (
                <Marker
                  key={location.id}
                  position={location.position}
                  onClick={() => setSelectedLocation(location)}
                  icon={{
                    url: getMarkerIcon(location.type),
                    scaledSize: new window.google.maps.Size(30, 30)
                  }}
                />
              ))}

              {selectedLocation && (
                <InfoWindow
                  position={selectedLocation.position}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="p-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800">{selectedLocation.name}</h3>
                      <button
                        onClick={() => handleDeleteLocation(selectedLocation.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{selectedLocation.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Type: {selectedLocation.type}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Lat: {selectedLocation.position.lat.toFixed(4)}</p>
                      <p>Lng: {selectedLocation.position.lng.toFixed(4)}</p>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </LoadScript>
      </div>
    </div>
  );
};

export default FarmMap; 