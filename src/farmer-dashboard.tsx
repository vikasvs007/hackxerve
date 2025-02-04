import React, { useState } from 'react';
import {
  BarChart3,
  Cloud,
  Leaf,
  Tractor,
  Box,
  Video,
  Users,
  Bell,
  Settings,
  LineChart,
  Calendar,
  DollarSign,
  Package,
  Thermometer,
  Activity,
  Menu,
  X,
  ShoppingBag,
  MapPin,
  Route,
  TrendingUp
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import VideoCall from './components/VideoCall';
import FarmMap from './components/FarmMap';
import ShoppingInterface from './components/ShoppingInterface';
import NearbyPlacesFinder from './components/NearbyPlacesFinder';
import SupplyRouteCalculator from './components/SupplyRouteCalculator';
import ManageProducts from './components/ManageProducts';
import { MarketPriceProvider } from './contexts/MarketPriceContext';
import MarketPrices from './components/MarketPrices';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, color = 'bg-white' }) => (
  <div className={`stat-card ${color} p-6 rounded-xl shadow-sm`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-xl font-bold mt-1">{value}</h3>
        {trend && <p className="text-green-500 text-sm mt-2">{trend}</p>}
      </div>
      <div className="text-green-600 transition-transform duration-300 hover:scale-110">{icon}</div>
    </div>
  </div>
);

const FarmerDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'market-prices', label: 'Market Prices', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'weather', label: 'Weather', icon: <Cloud className="w-5 h-5" /> },
    { id: 'crops', label: 'Crops', icon: <Leaf className="w-5 h-5" /> },
    { id: 'machinery', label: 'Machinery', icon: <Tractor className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Box className="w-5 h-5" /> },
    { id: 'shop', label: 'Shop', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'video-calls', label: 'Video Calls', icon: <Video className="w-5 h-5" /> },
    { id: 'nearby', label: 'Nearby', icon: <MapPin className="w-5 h-5" /> },
    { id: 'routes', label: 'Supply Routes', icon: <Route className="w-5 h-5" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'market-prices':
        return (
          <MarketPriceProvider>
            <MarketPrices />
          </MarketPriceProvider>
        );
      case 'video-calls':
        return <VideoCall />;
      case 'shop':
        return <ManageProducts />;
      case 'nearby':
        return <NearbyPlacesFinder />;
      case 'routes':
        return (
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
        );
      case 'dashboard':
        return (
          <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <DashboardCard
                title="Crop Health Index"
                value="92%"
                icon={<Activity className="w-6 h-6" />}
                trend="+2.5% from last week"
              />
              <DashboardCard
                title="Temperature"
                value="24°C"
                icon={<Thermometer className="w-6 h-6" />}
                color="bg-blue-50"
              />
              <DashboardCard
                title="Active Orders"
                value="12"
                icon={<Package className="w-6 h-6" />}
                color="bg-green-50"
              />
              <DashboardCard
                title="Revenue (MTD)"
                value="₹125,000"
                icon={<DollarSign className="w-6 h-6" />}
                trend="+18% vs last month"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Yield Forecast</h2>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <LineChart className="w-8 h-8" />
                  <span className="ml-2">Chart will be implemented here</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Resource Usage</h2>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <BarChart3 className="w-8 h-8" />
                  <span className="ml-2">Chart will be implemented here</span>
                </div>
              </div>
            </div>

            {/* Farm Map */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
              <h2 className="text-lg font-semibold mb-4">Farm Overview</h2>
              <FarmMap />
            </div>

            {/* Calendar and Tasks */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>View Calendar</span>
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Fertilizer Application - Field A</h3>
                    <p className="text-sm text-gray-500">Scheduled for tomorrow</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Pending
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Machinery Maintenance</h3>
                    <p className="text-sm text-gray-500">Due in 3 days</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold">{selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1)}</h2>
            <p className="text-gray-500 mt-2">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-600">FreshChain</h1>
              <p className="text-sm text-gray-500">Farmer Dashboard</p>
            </div>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="mt-8 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedMenu(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors
                  ${selectedMenu === item.id 
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between mb-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Bell className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default FarmerDashboard; 