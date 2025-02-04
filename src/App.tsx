import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { AdminProvider } from './contexts/AdminContext';
import { MarketPriceProvider } from './contexts/MarketPriceContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import FarmerDashboard from './farmer-dashboard';
import RetailerDashboard from './pages/retailer/RetailerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Shop from './components/ShoppingInterface';
import Cart from './pages/retailer/Cart';
import Orders from './pages/retailer/Orders';
import Profile from './pages/retailer/Profile';
import VideoCall from './components/VideoCall';
import NearbyPlacesFinder from './components/NearbyPlacesFinder';
import SupplyRouteCalculator from './components/SupplyRouteCalculator';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <ProductProvider>
            <CartProvider>
              <MarketPriceProvider>
                <div className="min-h-screen bg-gray-50 font-sans">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute allowedUserTypes={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Farmer Routes */}
                    <Route
                      path="/farmer/*"
                      element={
                        <ProtectedRoute allowedUserTypes={['farmer']}>
                          <Routes>
                            <Route path="/" element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<FarmerDashboard />} />
                            <Route path="video-call" element={<VideoCall />} />
                            <Route path="nearby-places" element={<NearbyPlacesFinder />} />
                            <Route path="supply-routes" element={
                              <SupplyRouteCalculator
                                source="Mandya"
                                destinations={[
                                  { place: "Bangalore", demand: 2000 },
                                  { place: "Mysuru", demand: 1500 },
                                  { place: "Hassan", demand: 800 },
                                  { place: "Chikkamagaluru", demand: 700 }
                                ]}
                                totalSupply={5000}
                                onDataUpdate={(routes) => console.log('Optimized routes:', routes)}
                              />
                            } />
                          </Routes>
                        </ProtectedRoute>
                      }
                    />

                    {/* Retailer Routes */}
                    <Route
                      path="/retailer/*"
                      element={
                        <ProtectedRoute allowedUserTypes={['retailer']}>
                          <Routes>
                            <Route path="/" element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<RetailerDashboard />} />
                            <Route path="shop" element={<Shop />} />
                            <Route path="cart" element={<Cart />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="profile" element={<Profile />} />
                          </Routes>
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </div>
              </MarketPriceProvider>
            </CartProvider>
          </ProductProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 