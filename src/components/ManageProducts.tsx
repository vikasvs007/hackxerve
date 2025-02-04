import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts, Product } from '../contexts/ProductContext';

const ManageProducts: React.FC = () => {
  const { user } = useAuth();
  const { getProductsByFarmer, addProduct, deleteProduct } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [error, setError] = useState<string>('');
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'farmerId' | 'farmerName'>>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    unit: 'kg',
    category: 'Vegetables',
  });

  useEffect(() => {
    if (user?.id) {
      const farmerProducts = getProductsByFarmer(user.id);
      setProducts(farmerProducts);
    }
  }, [user?.id, getProductsByFarmer]);

  const validateProduct = () => {
    if (newProduct.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (newProduct.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }
    setError('');
    return true;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProduct()) {
      return;
    }

    const productData = {
      ...newProduct,
      // Round price to 2 decimal places
      price: Math.round(newProduct.price * 100) / 100,
      // Round quantity to 3 decimal places
      quantity: Math.round(newProduct.quantity * 1000) / 1000,
      farmerId: user?.id || '',
      farmerName: user?.name || '',
    };

    addProduct(productData);
    setProducts(prev => [...prev, { ...productData, id: Date.now().toString() }]);
    setIsAddingProduct(false);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      unit: 'kg',
      category: 'Vegetables',
    });
    setError('');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      // Limit to 2 decimal places
      const formattedValue = Math.round(value * 100) / 100;
      setNewProduct({ ...newProduct, price: formattedValue });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      // Limit to 3 decimal places
      const formattedValue = Math.round(value * 1000) / 1000;
      setNewProduct({ ...newProduct, quantity: formattedValue });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="btn bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      {isAddingProduct && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (₹)
                  <span className="text-xs text-gray-500 ml-1">(up to 2 decimals)</span>
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={handlePriceChange}
                  step="0.01"
                  min="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                  <span className="text-xs text-gray-500 ml-1">(up to 3 decimals)</span>
                </label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={handleQuantityChange}
                  step="0.001"
                  min="0.001"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <select
                  value={newProduct.unit}
                  onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="piece">Piece</option>
                  <option value="dozen">Dozen</option>
                  <option value="quintal">Quintal</option>
                  <option value="ton">Ton</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingProduct(false);
                  setError('');
                }}
                className="btn bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <div className="flex gap-2">
                <button className="text-gray-600 hover:text-blue-600">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Price: ₹{product.price.toFixed(2)}/{product.unit}</span>
              <span>Stock: {product.quantity.toFixed(3)} {product.unit}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <span>Category: {product.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts; 
