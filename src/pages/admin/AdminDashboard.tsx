import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import SupplyRouteCalculator from '../../components/SupplyRouteCalculator';

const AdminDashboard: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryStats } = useAdmin();
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    price: 0,
    supplier: '',
    category: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = getInventoryStats();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({ ...newItem, lastUpdated: new Date() });
    setNewItem({ name: '', quantity: 0, price: 0, supplier: '', category: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Items</h3>
            <p className="text-2xl font-bold">{stats.totalItems}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Value</h3>
            <p className="text-2xl font-bold">₹{stats.totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Low Stock Items</h3>
            <p className="text-2xl font-bold">{stats.lowStockItems.length}</p>
          </div>
        </div>

        {/* Inventory Management */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {showAddForm ? 'Cancel' : 'Add New Item'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Item
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => deleteInventoryItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Supply Route Calculator */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Supply Route Calculator</h2>
          <SupplyRouteCalculator
            source="Warehouse"
            destinations={[
              { place: "Store 1", demand: 1000 },
              { place: "Store 2", demand: 800 },
              { place: "Store 3", demand: 1200 },
              { place: "Store 4", demand: 500 }
            ]}
            totalSupply={3500}
            onDataUpdate={(routes) => console.log('Optimized routes:', routes)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 