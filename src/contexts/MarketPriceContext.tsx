import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PriceData {
  crop: string;
  price: number;
  unit: string;
  location: string;
  date: string;
}

interface MarketPriceContextType {
  priceData: PriceData[];
  loading: boolean;
  error: string | null;
  refreshPrices: () => void;
}

const MarketPriceContext = createContext<MarketPriceContextType | undefined>(undefined);

export const useMarketPrices = () => {
  const context = useContext(MarketPriceContext);
  if (!context) {
    throw new Error('useMarketPrices must be used within a MarketPriceProvider');
  }
  return context;
};

export const MarketPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SAMPLE_PRICE_DATA: PriceData[] = [
    // Bottle Gourd
    { crop: 'Tonnes Bottle Gourd', price: 1300, unit: 'al', location: 'Bangalore', date: '2025-02-01T06:30:40.118461' },
    { crop: 'Tonnes Bottle Gourd', price: 1200, unit: 'al', location: 'Davangere', date: '2025-02-01T06:30:40.118521' },
    { crop: '5 Tonnes Bottle Gourd', price: 250, unit: 'al', location: 'Mysore', date: '2025-02-01T06:30:40.118570' },
    
    // Brinjal
    { crop: 'Tonnes Brinjal', price: 2900, unit: 'al', location: 'Bangalore', date: '2025-02-01T06:30:40.118617' },
    { crop: 'Tonnes Brinjal', price: 1500, unit: 'al', location: 'Chintamani', date: '2025-02-01T06:30:40.118756' },
    { crop: 'Tonnes Brinjal', price: 3000, unit: 'al', location: 'Ramanagara', date: '2025-02-01T06:30:40.118958' },
    { crop: 'Tonnes Brinjal', price: 1900, unit: 'al', location: 'Shimoga', date: '2025-02-01T06:30:40.119050' },
    { crop: '9 Tonnes Brinjal', price: 1900, unit: 'al', location: 'Mysore', date: '2025-02-01T06:30:40.118846' },

    // Cabbage
    { crop: 'Tonnes Cabbage', price: 900, unit: 'al', location: 'Bangalore', date: '2025-02-01T06:30:40.119094' },
    { crop: 'Tonnes Cabbage', price: 800, unit: 'al', location: 'Davangere', date: '2025-02-01T06:30:40.119185' },
    { crop: 'Tonnes Cabbage', price: 800, unit: 'al', location: 'Ramanagara', date: '2025-02-01T06:30:40.119276' },
    { crop: 'Tonnes Cabbage', price: 1383, unit: 'al', location: 'Santhesargur', date: '2025-02-01T06:30:40.119321' },
    { crop: 'Tonnes Cabbage', price: 400, unit: 'al', location: 'Shimoga', date: '2025-02-01T06:30:40.119365' },

    // Carrot
    { crop: 'Tonnes Carrot', price: 4400, unit: 'al', location: 'Bangalore', date: '2025-02-01T06:30:40.119682' },
    { crop: 'Tonnes Carrot', price: 2500, unit: 'al', location: 'Chintamani', date: '2025-02-01T06:30:40.119788' },
    { crop: 'Tonnes Carrot', price: 3500, unit: 'al', location: 'Davangere', date: '2025-02-01T06:30:40.119837' },
    { crop: 'Tonnes Carrot', price: 3950, unit: 'al', location: 'Hoskote', date: '2025-02-01T06:30:40.119883' },
    { crop: 'Tonnes Carrot', price: 3000, unit: 'al', location: 'Ramanagara', date: '2025-02-01T06:30:40.119985' },

    // Tomato
    { crop: 'Tonnes Tomato', price: 1100, unit: 'al', location: 'Bangalore', date: '2025-02-01T06:30:40.125525' },
    { crop: 'Tonnes Tomato', price: 500, unit: 'al', location: 'Davangere', date: '2025-02-01T06:30:40.125615' },
    { crop: 'Tonnes Tomato', price: 1500, unit: 'al', location: 'Gundlupet', date: '2025-02-01T06:30:40.125659' },
    { crop: 'Tonnes Tomato', price: 1800, unit: 'al', location: 'Ramanagara', date: '2025-02-01T06:30:40.125882' },
    { crop: 'Tonnes Tomato', price: 800, unit: 'al', location: 'Shimoga', date: '2025-02-01T06:30:40.126200' },

    // Green Chilly
    { crop: 'Tonnes Green Chilly', price: 4400, unit: 'al', location: 'Bangalore', date: '2025-02-01T06:30:40.122078' },
    { crop: 'Tonnes Green Chilly', price: 3000, unit: 'al', location: 'Chintamani', date: '2025-02-01T06:30:40.122205' },
    { crop: 'Tonnes Green Chilly', price: 2500, unit: 'al', location: 'Davangere', date: '2025-02-01T06:30:40.122434' },
    { crop: 'Tonnes Green Chilly', price: 3400, unit: 'al', location: 'Gundlupet', date: '2025-02-01T06:30:40.122491' },
    { crop: 'Tonnes Green Chilly', price: 5000, unit: 'al', location: 'Ramanagara', date: '2025-02-01T06:30:40.122646' }
  ];

  const refreshPrices = () => {
    setLoading(true);
    try {
      // Simulating API call with sample data
      setPriceData(SAMPLE_PRICE_DATA);
      setError(null);
    } catch (err) {
      setError('Failed to fetch market prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPrices();
  }, []);

  return (
    <MarketPriceContext.Provider value={{ priceData, loading, error, refreshPrices }}>
      {children}
    </MarketPriceContext.Provider>
  );
}; 