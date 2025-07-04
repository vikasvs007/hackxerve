import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  image?: string;
  category: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByFarmer: (farmerId: string) => Product[];
  getAllProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Initial mock data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    description: 'Organically grown tomatoes',
    price: 40,
    quantity: 100,
    unit: 'kg',
    farmerId: '1',
    farmerName: 'John Farmer',
    category: 'Vegetables',
    image: 'https://example.com/tomatoes.jpg'
  },
  {
    id: '2',
    name: 'Potatoes',
    description: 'Farm fresh potatoes',
    price: 30,
    quantity: 150,
    unit: 'kg',
    farmerId: '1',
    farmerName: 'John Farmer',
    category: 'Vegetables',
    image: 'https://example.com/potatoes.jpg'
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  const getProductsByFarmer = (farmerId: string) => {
    return products.filter(product => product.farmerId === farmerId);
  };

  const getAllProducts = () => {
    return products;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByFarmer,
        getAllProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 