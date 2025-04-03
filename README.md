# LogiDash - Logistics Operations Dashboard

LogiDash is a comprehensive logistics operations dashboard that allows businesses to track fleet, shipments, warehouses, and more in real-time.

## Features

- **Dashboard & Analytics**: Real-time KPI monitoring, fleet status tracking, and interactive data visualization.
- **Fleet Management**: Vehicle tracking, maintenance scheduling, and performance metrics.
- **Shipment & Order Management**: Shipment tracking, order processing, and delivery timeline visualization.
- **Warehouse & Inventory**: Warehouse capacity monitoring, inventory tracking, and stock movement analysis.
- **Route Optimization**: Route planning, fuel consumption tracking, and time/distance optimization.
- **Reporting**: Customizable reports, performance analysis, and data export capabilities.

## Technology Stack

- **Frontend**: React, TypeScript, Shadcn UI (based on Tailwind CSS)
- **State Management**: React Query
- **Routing**: Wouter
- **Visualization**: Recharts and Leaflet Maps
- **Backend**: Express, Node.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- npm (v9 or later)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/logidash.git
cd logidash
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following content:

```env
# Database configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/logidash

# Node environment
NODE_ENV=development

# Server port
PORT=5000

# JWT secret for authentication (if implemented later)
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Set up the database

First, make sure PostgreSQL is running. Then run:

```bash
# Create database and tables
npm run db:setup
```

### 5. Run the application in development mode

```bash
npm run dev
```

The application should now be accessible at http://localhost:5000.

## Database Structure

LogiDash uses a PostgreSQL database with the following tables:

- **users**: User accounts and authentication information
- **vehicles**: Fleet data including vehicle status and location
- **warehouses**: Warehouse information including capacity and usage
- **inventory**: Inventory items stored in warehouses
- **shipments**: Shipment tracking information
- **routes**: Route planning and optimization data

## API Endpoints

### Users

- `GET /api/users/:id`: Get a user by ID
- `POST /api/users`: Create a new user

### Vehicles

- `GET /api/vehicles`: Get all vehicles
- `GET /api/vehicles/:id`: Get a vehicle by ID
- `POST /api/vehicles`: Create a new vehicle
- `PUT /api/vehicles/:id`: Update a vehicle
- `DELETE /api/vehicles/:id`: Delete a vehicle

### Warehouses

- `GET /api/warehouses`: Get all warehouses
- `GET /api/warehouses/:id`: Get a warehouse by ID
- `POST /api/warehouses`: Create a new warehouse
- `PUT /api/warehouses/:id`: Update a warehouse
- `DELETE /api/warehouses/:id`: Delete a warehouse

### Inventory

- `GET /api/inventory`: Get all inventory items
- `GET /api/inventory?warehouseId=1`: Get inventory items for a specific warehouse
- `GET /api/inventory/:id`: Get an inventory item by ID
- `POST /api/inventory`: Create a new inventory item
- `PUT /api/inventory/:id`: Update an inventory item
- `DELETE /api/inventory/:id`: Delete an inventory item

### Shipments

- `GET /api/shipments`: Get all shipments
- `GET /api/shipments/:id`: Get a shipment by ID
- `GET /api/shipments/:id?type=tracking`: Get a shipment by tracking number
- `POST /api/shipments`: Create a new shipment
- `PUT /api/shipments/:id`: Update a shipment
- `DELETE /api/shipments/:id`: Delete a shipment

### Routes

- `GET /api/routes`: Get all routes
- `GET /api/routes?vehicleId=1`: Get routes for a specific vehicle
- `GET /api/routes/:id`: Get a route by ID
- `POST /api/routes`: Create a new route
- `PUT /api/routes/:id`: Update a route
- `DELETE /api/routes/:id`: Delete a route

### Dashboard

- `GET /api/dashboard/summary`: Get a summary of all key metrics

## Production Deployment

To build and run the app in production mode:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## License

MIT