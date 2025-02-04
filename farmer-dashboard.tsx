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
} from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, color = 'bg-white' }) => (
  <div className={`${color} p-6 rounded-xl shadow-sm`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend && <p className="text-green-500 text-sm mt-2">{trend}</p>}
      </div>
      <div className="text-green-600">{icon}</div>
    </div>
  </div>
);

const FarmerDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 /> },
    { id: 'weather', label: 'Weather', icon: <Cloud /> },
    { id: 'crops', label: 'Crops', icon: <Leaf /> },
    { id: 'machinery', label: 'Machinery', icon: <Tractor /> },
    { id: 'inventory', label: 'Inventory', icon: <Box /> },
    { id: 'video-calls', label: 'Video Calls', icon: <Video /> },
    { id: 'team', label: 'Team', icon: <Users /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-600">FreshChain</h1>
          <p className="text-gray-500 text-sm">Farmer Dashboard</p>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedMenu(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left
                ${selectedMenu === item.id ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, John</h1>
            <p className="text-gray-500">Here's what's happening on your farm today</p>
          </div>
          <div className="flex gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Bell />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Settings />
            </button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Crop Health Index"
            value="92%"
            icon={<Activity />}
            trend="+2.5% from last week"
          />
          <DashboardCard
            title="Temperature"
            value="24°C"
            icon={<Thermometer />}
            color="bg-blue-50"
          />
          <DashboardCard
            title="Active Orders"
            value="12"
            icon={<Package />}
            color="bg-green-50"
          />
          <DashboardCard
            title="Revenue (MTD)"
            value="₹125,000"
            icon={<DollarSign />}
            trend="+18% vs last month"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Yield Forecast</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <LineChart />
              <span className="ml-2">Chart will be implemented here</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Resource Usage</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <BarChart3 />
              <span className="ml-2">Chart will be implemented here</span>
            </div>
          </div>
        </div>

        {/* Calendar and Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
            <button className="flex items-center gap-2 text-green-600">
              <Calendar className="w-4 h-4" />
              <span>View Calendar</span>
            </button>
          </div>
          <div className="space-y-4">
            {/* Sample tasks - will be dynamic in the final implementation */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Fertilizer Application - Field A</h3>
                <p className="text-sm text-gray-500">Scheduled for tomorrow</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Machinery Maintenance</h3>
                <p className="text-sm text-gray-500">Due in 3 days</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Scheduled</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard; 