import React from 'react';
import { MapPin, ShoppingCart, Search, Menu, User, Star, Filter } from 'lucide-react';

const ShoppingInterface = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">FreshChain</h1>
            <div className="flex items-center gap-4">
              <button className="p-2"><MapPin /></button>
              <button className="p-2"><ShoppingCart /></button>
              <button className="p-2"><User /></button>
            </div>
          </div>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text"
              placeholder="Search fresh produce..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-800"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="container mx-auto p-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic'].map(category => (
            <button key={category} className="px-4 py-2 bg-white rounded-full shadow-sm whitespace-nowrap">
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-lg shadow p-3">
              <img src="/api/placeholder/200/200" alt="Product" className="w-full h-40 object-cover rounded-lg"/>
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm">4.5</span>
                </div>
                <h3 className="font-semibold mt-1">Fresh Product {i}</h3>
                <p className="text-sm text-gray-600">Farmer John</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">₹40/kg</span>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Overlay */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-green-600 text-white p-4 rounded-full shadow-lg">
          <ShoppingCart />
        </button>
      </div>
    </div>
  );
};

export default ShoppingInterface;
