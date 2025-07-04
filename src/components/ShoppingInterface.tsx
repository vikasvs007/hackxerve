import React, { useState } from 'react';
import { MapPin, ShoppingCart, Search, Star, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';

// Import the Product type from the ManageProducts component
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  category: string;
  image?: string;
}

// Access the mock products from ManageProducts
declare const MOCK_PRODUCTS: Product[];

const ShoppingInterface: React.FC = () => {
  const navigate = useNavigate();
  const { getAllProducts } = useProducts();
  const { addToCart, getItemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderQuantities, setOrderQuantities] = useState<{ [key: string]: number }>({});

  const products = getAllProducts();
  const cartItemCount = getItemCount();

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && product.category === selectedCategory;
  });

  const categories = ['all', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'];

  const handleQuantityChange = (productId: string, change: number) => {
    setOrderQuantities(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + change);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleAddToCart = (product: Product) => {
    const quantity = orderQuantities[product.id] || 0;
    if (quantity > 0) {
      addToCart(product, quantity);
      setOrderQuantities(prev => ({ ...prev, [product.id]: 0 }));
    }
  };

  const navigateToCart = () => {
    navigate('/retailer/cart');
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4 items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <button 
              onClick={navigateToCart}
              className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <div className="flex items-center text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm text-gray-600 ml-1">4.5</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">{product.description}</p>

              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin size={16} className="mr-1" />
                <span>{product.farmerName}</span>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                Category: {product.category}
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="text-green-600 font-semibold">
                  ₹{product.price.toFixed(2)}/{product.unit}
                </div>
                <div className="text-sm text-gray-500">
                  Available: {product.quantity.toFixed(3)} {product.unit}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    disabled={!orderQuantities[product.id]}
                  >
                    <Minus size={16} className={!orderQuantities[product.id] ? 'text-gray-300' : 'text-gray-600'} />
                  </button>
                  <span className="w-8 text-center">{orderQuantities[product.id] || 0}</span>
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    disabled={orderQuantities[product.id] >= product.quantity}
                  >
                    <Plus size={16} className={orderQuantities[product.id] >= product.quantity ? 'text-gray-300' : 'text-gray-600'} />
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!orderQuantities[product.id]}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    orderQuantities[product.id]
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={16} />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingInterface; 