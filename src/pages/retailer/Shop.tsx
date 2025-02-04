import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Card, CardContent } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

// Mock data - replace with API call
const mockProducts = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    price: 2.99,
    quantity: 100,
    image: '/images/tomatoes.jpg',
    farmer: 'John\'s Farm',
    category: 'vegetables'
  },
  {
    id: '2',
    name: 'Organic Apples',
    price: 3.99,
    quantity: 75,
    image: '/images/apples.jpg',
    farmer: 'Green Acres',
    category: 'fruits'
  },
  // Add more mock products...
];

const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuantityChange = (productId: string, change: number) => {
    setQuantities(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + change);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleAddToCart = (product: typeof mockProducts[0]) => {
    const quantity = quantities[product.id] || 0;
    if (quantity > 0) {
      addToCart(product, quantity);
      setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products or farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded-lg object-cover w-full h-48"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600">{product.farmer}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-gray-500">
                    Stock: {product.quantity}
                  </span>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={!quantities[product.id]}
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="w-8 text-center">
                      {quantities[product.id] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={quantities[product.id] >= product.quantity}
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!quantities[product.id]}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <Alert>
          <AlertDescription>
            No products found. Try adjusting your search or filters.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Shop; 