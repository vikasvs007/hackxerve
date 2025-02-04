import React, { useState, useEffect } from 'react';
import { Route, AlertTriangle, TrendingUp, MapPin, Plus, X, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Predefined distances from Mandya (in km)
const PREDEFINED_DISTANCES = {
  "Bangalore": 98,
  "Mysuru": 45,
  "Hassan": 85,
  "Chikkamagaluru": 185,
  "Tumkur": 155,
  "Chamarajanagar": 90,
  "Kodagu": 135,
  "Ramanagara": 75
};

interface Destination {
  place: string;
  demand: number;
  distance?: number;
  duration?: string;
  allocatedSupply?: number;
  efficiency?: number;
  unmetDemand?: number;
  efficiencyScore?: number;
  sequence?: number;
}

interface SupplyRouteCalculatorProps {
  source: string;
  destinations: Destination[];
  totalSupply: number;
  onDataUpdate?: (optimizedRoutes: Destination[]) => void;
}

const SupplyRouteCalculator: React.FC<SupplyRouteCalculatorProps> = ({
  source: initialSource,
  destinations: initialDestinations,
  totalSupply: initialTotalSupply,
  onDataUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState(initialSource);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [totalSupply, setTotalSupply] = useState(initialTotalSupply);
  const [optimizedRoutes, setOptimizedRoutes] = useState<Destination[]>([]);
  const [remainingSupply, setRemainingSupply] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [newDestination, setNewDestination] = useState({ place: "", demand: 0 });

  // Fetch distances from the API
  const fetchDistanceMatrix = async (origin: string, destinations: string[]) => {
    try {
      setLoading(true);
      const destinationsStr = destinations.join('|');
      
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/distancematrix/json?` +
        `origins=${encodeURIComponent(origin)}&` +
        `destinations=${encodeURIComponent(destinationsStr)}&` +
        `units=metric&` +
        `mode=driving&` +
        `key=${import.meta.env.VITE_DISTANCE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch distance data');
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`API Error: ${data.status}`);
      }

      // Process the API response
      const distances = data.rows[0].elements.map((element: any) => ({
        distance: element.distance.value / 1000, // Convert to km
        duration: element.duration.text
      }));

      return distances;
    } catch (err: any) {
      setError(`API Error: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calculate efficiency score (lower distance and higher supply is better)
  const calculateEfficiencyScore = (distance: number, supply: number) => {
    return (supply / distance) * 100;
  };

  const calculateTotalDistance = (routes: Destination[]) => {
    return routes.reduce((acc, curr) => acc + (Number(curr.distance) * 2), 0); // Round trip
  };

  // Get route recommendation
  const getRouteRecommendation = (routes: Destination[]) => {
    return routes.map(dest => ({
      place: dest.place,
      recommendation: dest.distance && dest.distance < 100 ? 'High Priority' : 
                     dest.distance && dest.distance < 150 ? 'Medium Priority' : 'Low Priority',
      reason: `${dest.distance?.toFixed(1)}km distance, ${dest.demand}kg demand`
    }));
  };

  // Add new destination
  const handleAddDestination = async () => {
    if (newDestination.place && newDestination.demand) {
      try {
        const distances = await fetchDistanceMatrix(source, [newDestination.place]);
        if (distances && distances[0]) {
          const destinationWithDistance = {
            ...newDestination,
            distance: distances[0].distance,
            duration: distances[0].duration
          };
          setDestinations([...destinations, destinationWithDistance]);
          setNewDestination({ place: "", demand: 0 });
        }
      } catch (err) {
        setError("Failed to fetch distance for new destination");
      }
    }
  };

  // Remove destination
  const handleRemoveDestination = (index: number) => {
    setDestinations(destinations.filter((_, idx) => idx !== index));
  };

  // Optimize routes based on distance and demand
  const optimizeRoutes = (routeDestinations: Destination[]) => {
    // Sort destinations by distance (nearest first)
    const sortedDestinations = [...routeDestinations].sort((a, b) => 
      (a.distance || 0) - (b.distance || 0)
    );
    
    let remaining = totalSupply;
    const optimizedDestinations = sortedDestinations.map((dest, index) => {
      const allocatedSupply = Math.min(dest.demand, remaining);
      remaining -= allocatedSupply;
      
      return {
        ...dest,
        sequence: index + 1,
        allocatedSupply,
        efficiencyScore: calculateEfficiencyScore(dest.distance || 0, allocatedSupply),
        unmetDemand: Math.max(0, dest.demand - allocatedSupply)
      };
    });

    setRemainingSupply(remaining);
    setTotalDistance(calculateTotalDistance(optimizedDestinations));

    if (onDataUpdate) {
      onDataUpdate(optimizedDestinations);
    }

    return optimizedDestinations;
  };

  // Update distances when source changes
  useEffect(() => {
    const updateDistances = async () => {
      if (destinations.length > 0) {
        const places = destinations.map(d => d.place);
        const distances = await fetchDistanceMatrix(source, places);
        if (distances) {
          const updatedDestinations = destinations.map((dest, index) => ({
            ...dest,
            distance: distances[index].distance,
            duration: distances[index].duration
          }));
          setDestinations(updatedDestinations);
        }
      }
    };

    updateDistances();
  }, [source]);

  // Calculate routes when destinations change
  useEffect(() => {
    if (destinations.length > 0) {
      const optimized = optimizeRoutes(destinations);
      setOptimizedRoutes(optimized);
    }
  }, [destinations, totalSupply]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );

  const recommendations = getRouteRecommendation(optimizedRoutes);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-green-600 flex items-center gap-2">
            <Route className="w-6 h-6" />
            Supply Route Distribution
          </h1>
          <p className="text-gray-600">Add destinations and calculate optimal routes</p>
        </header>

        {/* Input Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Route Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Source Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Location</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Enter source location"
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Total Supply Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Supply (kg)</label>
                <input
                  type="number"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(Number(e.target.value))}
                  placeholder="Enter total supply"
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Destinations List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinations</label>
                <div className="space-y-2">
                  {destinations.map((dest, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <span className="flex-1">{dest.place}</span>
                      <span className="flex-1">{dest.demand}kg</span>
                      <span className="flex-1">{dest.distance?.toFixed(1)}km</span>
                      <span className="flex-1">{dest.duration}</span>
                      <button
                        onClick={() => handleRemoveDestination(idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Destination Input */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newDestination.place}
                  onChange={(e) => setNewDestination({ ...newDestination, place: e.target.value })}
                  placeholder="Destination name"
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  value={newDestination.demand || ""}
                  onChange={(e) => setNewDestination({ ...newDestination, demand: Number(e.target.value) })}
                  placeholder="Demand (kg)"
                  className="p-2 border rounded"
                />
              </div>
              <button
                onClick={handleAddDestination}
                disabled={!newDestination.place || !newDestination.demand}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Destination
              </button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {destinations.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Route Details */}
            <Card>
              <CardHeader>
                <CardTitle>Route Details</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Priority-based Route Recommendations */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Delivery Priorities</h3>
                  <div className="space-y-2">
                    {recommendations.map((rec, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded flex items-center justify-between ${
                          rec.recommendation === 'High Priority' ? 'bg-green-50' :
                          rec.recommendation === 'Medium Priority' ? 'bg-yellow-50' :
                          'bg-red-50'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{rec.place}</p>
                          <p className="text-sm text-gray-600">{rec.reason}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          rec.recommendation === 'High Priority' ? 'bg-green-100 text-green-800' :
                          rec.recommendation === 'Medium Priority' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rec.recommendation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supply Allocation */}
                <div>
                  <h3 className="font-medium mb-2">Supply Allocation</h3>
                  <div className="space-y-2">
                    {optimizedRoutes.map((route, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{route.place}</span>
                          <span>{route.allocatedSupply}kg / {route.demand}kg</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 rounded-full h-2"
                            style={{ width: `${((route.allocatedSupply || 0) / route.demand) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Route Sequence Visualization */}
                <div className="mt-8 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <Route className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Route Sequence</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100 shadow-sm">
                    {/* Total Distance Header */}
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600 mb-1">Total Round Trip Distance</p>
                        <p className="text-3xl font-bold text-green-700">{totalDistance.toFixed(1)} km</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <MapPin className="w-4 h-4" />
                        <span>Starting from {source}</span>
                      </div>
                    </div>

                    {/* Route Steps with Arrows */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Source Start */}
                      <div className="flex-shrink-0">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-green-500 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800">{source}</span>
                        </div>
                      </div>

                      {/* Route Steps */}
                      {optimizedRoutes.map((route, idx) => (
                        <React.Fragment key={idx}>
                          {/* Arrow */}
                          <div className="flex-shrink-0 flex items-center">
                            <div className="h-0.5 w-8 bg-green-500" />
                            <div className="text-green-500">
                              <ArrowRight className="w-6 h-6" />
                            </div>
                            <div className="h-0.5 w-2 bg-green-500" />
                          </div>

                          {/* Destination */}
                          <div className="flex-shrink-0">
                            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-green-200 flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-sm font-bold text-green-600">{route.sequence}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-green-800">{route.place}</span>
                                <span className="text-xs text-green-600">{route.distance?.toFixed(1)} km</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}

                      {/* Final Arrow back to source */}
                      <div className="flex-shrink-0 flex items-center">
                        <div className="h-0.5 w-8 bg-green-500" />
                        <div className="text-green-500">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                        <div className="h-0.5 w-2 bg-green-500" />
                      </div>

                      {/* Return to Source */}
                      <div className="flex-shrink-0">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-green-500 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800">{source}</span>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 pt-4 border-t border-green-100 flex items-center gap-4 text-sm text-green-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Source Location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                        <span>Delivery Stop</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        <span>Travel Direction</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Distribution Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Charts */}
                {optimizedRoutes.length > 0 && (
                  <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                      <BarChart data={optimizedRoutes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="place" />
                        <YAxis yAxisId="left" orientation="left" stroke="#059669" />
                        <YAxis yAxisId="right" orientation="right" stroke="#2563eb" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="demand" name="Demand (kg)" fill="#059669" />
                        <Bar yAxisId="right" dataKey="distance" name="Distance (km)" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-sm text-blue-600 font-medium">Supply Coverage</p>
                    <p className="text-xl font-bold text-blue-700">
                      {((totalSupply / optimizedRoutes.reduce((acc, curr) => acc + curr.demand, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Optimization Suggestions */}
                <div className="mt-6 bg-yellow-50 p-4 rounded">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    Optimization Suggestions
                  </h4>
                  <ul className="text-sm space-y-1">
                    {optimizedRoutes
                      .filter(dest => (dest.unmetDemand || 0) > 0)
                      .map((dest, idx) => (
                        <li key={idx} className="text-gray-600">
                          • {dest.place}: Unmet demand of {dest.unmetDemand}kg
                        </li>
                      ))}
                    {remainingSupply > 0 && (
                      <li className="text-gray-600">
                        • Unused supply: {remainingSupply}kg could be allocated to closer destinations
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyRouteCalculator; 