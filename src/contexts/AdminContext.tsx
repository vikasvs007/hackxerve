import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  supplier: string;
  category: string;
  lastUpdated: Date;
}

interface AdminContextType {
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  getInventoryStats: () => {
    totalItems: number;
    totalValue: number;
    lowStockItems: InventoryItem[];
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    setInventory([...inventory, newItem]);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, ...updates, lastUpdated: new Date() } : item
    ));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const getInventoryStats = () => {
    return {
      totalItems: inventory.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      lowStockItems: inventory.filter(item => item.quantity < 10),
    };
  };

  const value = {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryStats,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 