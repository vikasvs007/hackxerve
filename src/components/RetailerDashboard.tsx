import React, { useState } from 'react';
import { Package, Truck, MapPin, Plus, Clock, Calendar, User } from 'lucide-react';
import DeliveryRoute from './DeliveryRoute';

interface Delivery {
  id: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in-progress' | 'delivered';
  agentName?: string;
  estimatedTime?: string;
  orderDate: string;
  items: Array<{ name: string; quantity: number; unit: string; }>;
}

const RetailerDashboard: React.FC = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [deliveries] = useState<Delivery[]>([
    {
      id: 'DEL001',
      origin: 'Mysore',
      destination: 'Bangalore',
      status: 'pending',
      orderDate: '2024-02-15',
      items: [
        { name: 'Tomatoes', quantity: 100, unit: 'kg' },
        { name: 'Potatoes', quantity: 150, unit: 'kg' }
      ]
    },
    {
      id: 'DEL002',
      origin: 'Davangere',
      destination: 'Shimoga',
      status: 'in-progress',
      agentName: 'John Doe',
      estimatedTime: '2 hours',
      orderDate: '2024-02-15',
      items: [
        { name: 'Onions', quantity: 200, unit: 'kg' },
        { name: 'Carrots', quantity: 100, unit: 'kg' }
      ]
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Retailer Dashboard</h1>
          <p className="text-gray-600">Manage your deliveries and track shipments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Deliveries</p>
                <p className="text-2xl font-semibold">{deliveries.length}</p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-2xl font-semibold">
                  {deliveries.filter(d => d.status === 'in-progress').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Today</p>
                <p className="text-2xl font-semibold">
                  {deliveries.filter(d => d.status === 'delivered').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deliveries List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <Truck className="w-6 h-6 mr-2 text-green-600" />
                  Active Deliveries
                </h2>
                <button
                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedDelivery?.id === delivery.id
                        ? 'bg-green-50 border-2 border-green-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-800">
                          {delivery.origin} → {delivery.destination}
                        </p>
                        <p className="text-sm text-gray-600">ID: {delivery.id}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          delivery.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : delivery.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </div>
                    {delivery.agentName && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Agent: {delivery.agentName}
                      </p>
                    )}
                    {delivery.estimatedTime && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        ETA: {delivery.estimatedTime}
                      </p>
                    )}
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">Items:</p>
                      <ul className="list-disc list-inside">
                        {delivery.items.map((item, index) => (
                          <li key={index}>
                            {item.name}: {item.quantity} {item.unit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map and Directions */}
          <div className="lg:col-span-2">
            {selectedDelivery ? (
              <DeliveryRoute
                origin={selectedDelivery.origin}
                destination={selectedDelivery.destination}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg">Select a delivery to view route details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard; 