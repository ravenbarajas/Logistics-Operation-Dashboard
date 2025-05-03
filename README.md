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

### 3. Run the application in development mode

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