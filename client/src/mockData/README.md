# Mock Data Structure

This directory contains mock data for the application, organized by feature area. Each feature area has its own directory with one or more JSON files and an `index.ts` file that handles loading and preparing the data.

## Directory Structure

```
mockData/
├── vehicles/
│   ├── fleetData.json         - Vehicle fleet data
│   ├── maintenanceData.json   - Maintenance records and activities
│   ├── fuelData.json          - Fuel consumption and efficiency data
│   ├── analyticsData.json     - Analytics and statistics data
│   ├── driversData.json       - Driver profiles and performance data
│   └── index.ts               - Data loader and exporter
└── README.md                  - This file
```

## Usage

Import the mock data in your component:

```typescript
// Import individual data sets
import { 
  expandedFleetData, 
  maintenanceRecords, 
  fuelRecords,
  drivers 
} from '@/mockData/vehicles';

// Or import everything as a namespaced object
import vehicleMockData from '@/mockData/vehicles';

// Then use the data
const vehicles = vehicleMockData.fleet.vehicles;
const maintenance = vehicleMockData.maintenance.records;
const drivers = vehicleMockData.drivers;
```

## Data Conversion

The `index.ts` file in each directory handles any necessary data conversions, such as converting string dates to JavaScript Date objects. This ensures that the mock data closely resembles what would be returned from a real API.

## Benefits

- **Modularity**: Mock data is separated from component code
- **Reusability**: The same mock data can be used across multiple components
- **Maintenance**: Easy to update mock data in a single location
- **Type Safety**: TypeScript types ensure data consistency

## Adding New Mock Data

To add new mock data:

1. Create a new JSON file in the appropriate directory
2. Update the `index.ts` file to include your new data
3. Export the data with appropriate conversions if needed 