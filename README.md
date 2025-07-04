# FreshChain Farmer Dashboard

A modern web application for connecting farmers, retailers, and administrators. The platform provides dashboards for each user type, inventory and product management, supply route optimization, and real-time data visualization.

## Features

- **Farmer Dashboard:**  
  - View crop health, weather, orders, and revenue stats  
  - Manage products and inventory  
  - View farm locations on a map  
  - Access market prices and video calls

- **Retailer Dashboard:**  
  - Track and manage deliveries  
  - Shopping interface to order products from farmers  
  - Cart and checkout system

- **Admin Dashboard:**  
  - Manage inventory (add, update, delete items)  
  - View inventory stats and low stock alerts  
  - Supply Route Calculator for optimal distribution

- **Supply Route Calculator:**  
  - Add destinations and demands  
  - Calculate optimal supply allocation and route sequence  
  - Visualize routes and priorities on a map  
  - Uses Google Maps Distance Matrix API

- **Product Management:**  
  - Add, update, and delete products  
  - Filter and search products by category, name, or farmer

- **Data Visualization:**  
  - Charts for demand, supply, and route analytics (Recharts)  
  - Interactive maps (Google Maps API)

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **State Management:** React Context API
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Maps:** @react-google-maps/api
- **API:** Google Maps Distance Matrix API

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/vikasvs007/hackxerve
   cd hackxerve1
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root with your Google Maps API key:
   ```
   VITE_DISTANCE_API_KEY=your_google_maps_api_key
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production:**
   ```sh
   npm run build
   # or
   yarn build
   ```

## Project Structure

```
hackxerve1/
├── src/
│   ├── components/         # Reusable UI and feature components
│   ├── contexts/           # React Contexts for state management
│   ├── pages/              # Page-level components (admin, retailer, etc.)
│   ├── App.tsx             # Main app entry
│   ├── main.tsx            # ReactDOM render
│   └── ...                 # Other utilities and assets
├── public/                 # Static assets
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Key Components

- **FarmerDashboard:** `src/farmer-dashboard.tsx`
- **RetailerDashboard:** `src/components/RetailerDashboard.tsx`
- **AdminDashboard:** `src/pages/admin/AdminDashboard.tsx`
- **SupplyRouteCalculator:** `src/components/SupplyRouteCalculator.tsx`
- **ProductContext:** `src/contexts/ProductContext.tsx`
- **CartContext:** `src/contexts/CartContext.tsx`
- **ShoppingInterface:** `src/components/ShoppingInterface.tsx`
- **FarmMap:** `src/components/FarmMap.tsx`

## Environment Variables

- `VITE_DISTANCE_API_KEY` — Your Google Maps API key (with Distance Matrix API enabled)

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

## Acknowledgements

- [Google Maps Platform](https://developers.google.com/maps)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/) 