import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

// Mock data - replace with API call
const mockOrders = [
  {
    id: '1',
    date: '2024-02-01',
    status: 'delivered',
    total: 156.78,
    items: [
      { name: 'Fresh Tomatoes', quantity: 5, price: 2.99 },
      { name: 'Organic Apples', quantity: 3, price: 3.99 }
    ]
  },
  {
    id: '2',
    date: '2024-01-30',
    status: 'processing',
    total: 89.97,
    items: [
      { name: 'Carrots', quantity: 2, price: 1.99 },
      { name: 'Potatoes', quantity: 4, price: 2.49 }
    ]
  },
  // Add more mock orders...
];

const statusColors = {
  processing: 'text-blue-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-600'
};

const statusIcons = {
  processing: <Clock className="w-5 h-5" />,
  delivered: <CheckCircle className="w-5 h-5" />,
  cancelled: <XCircle className="w-5 h-5" />
};

const Orders: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredOrders = selectedStatus === 'all'
    ? mockOrders
    : mockOrders.filter(order => order.status === selectedStatus);

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex gap-4">
        {['all', 'processing', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg border-2 transition-colors
              ${selectedStatus === status
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-200'
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <Card key={order.id}>
            <CardContent className="p-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">Order #{order.id}</span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`flex items-center gap-2 ${statusColors[order.status as keyof typeof statusColors]}`}>
                  {statusIcons[order.status as keyof typeof statusIcons]}
                  <span className="font-medium">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-b py-4 mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2">Item</th>
                      <th className="pb-2">Quantity</th>
                      <th className="pb-2 text-right">Price</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-2 text-right">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Total */}
              <div className="flex justify-between items-center">
                <div className="text-gray-500">Total Amount</div>
                <div className="text-xl font-bold text-green-600">
                  ${order.total.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Orders */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
          <p className="text-gray-500">
            {selectedStatus === 'all'
              ? "You haven't placed any orders yet"
              : `No ${selectedStatus} orders found`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders; 