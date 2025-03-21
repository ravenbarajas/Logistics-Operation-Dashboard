# LogiDash - Logistics Operations Dashboard

A comprehensive logistics operations dashboard prototype built with React, TypeScript, and Shadcn UI. This application provides a complete visualization platform for fleet management, shipment tracking, warehouse operations, and more.

![LogiDash Preview](./generated-icon.png)

## Features

### Dashboard & Analytics
- Real-time KPI monitoring with interactive charts
- Fleet status tracking and vehicle location mapping
- Order status and delivery performance metrics
- Interactive data visualization with Recharts

### Fleet Management
- Vehicle tracking and status monitoring
- Maintenance scheduling and alerts
- Performance metrics and fuel consumption analytics

### Shipment & Order Management
- Shipment tracking with status updates
- Order processing and management
- Delivery timeline visualization

### Warehouse & Inventory
- Warehouse capacity monitoring
- Inventory tracking and stock alerts
- Stock movement analysis

### Supplier Management
- Supplier performance metrics
- Delivery reliability tracking
- Evaluation and comparison tools

### Route Optimization
- Route planning and efficiency analysis
- Fuel consumption and emissions tracking
- Time and distance optimization

### Reporting
- Customizable reports generation
- Performance analysis and trend identification
- Data export capabilities

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI (Tailwind CSS based components)
- **State Management**: React Query
- **Routing**: Wouter
- **Visualization**: Recharts, Leaflet Maps
- **Backend**: Express (minimal API endpoints for demonstration)

## Theme & Design

- Fully responsive layout for desktop, tablet, and mobile
- Dark/light mode toggle with system preference detection
- Minimalist, clean interface with focus on data presentation
- Consistent use of Shadcn UI components and Tailwind CSS

## Project Structure

```
/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/      # Dashboard-specific components
│   │   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   │   └── ui/             # Shadcn UI components
│   │   ├── data/               # Mock data for demonstration
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions
│   │   ├── pages/              # Page components
│   │   └── App.tsx             # Main application component
├── server/                     # Minimal Express backend
└── shared/                     # Shared types and utilities
```

## Getting Started

For detailed setup and deployment instructions, see the [Deployment Guide](./DEPLOYMENT.md).

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5000`

## Usage

This prototype is designed to demonstrate the UI and interaction patterns for a logistics management system. It uses mock data for demonstration purposes and does not require any external API connections.

## Contributing

This project is a prototype and demonstration only. For customization or extension, fork the repository and modify as needed.

## License

This project is available for educational and demonstration purposes.