# Vehicles Mock Data Directory

This directory contains mock data used throughout the vehicles module of the application for development and testing purposes.

## Structure

- **fleetData.json** - Basic vehicle records with details
- **maintenanceData.json** - Vehicle maintenance records and scheduled maintenance
- **fuelData.json** - Fuel consumption and related metrics
- **analyticsData.json** - Analytics data for the fleet dashboard
- **driversData.json** - Driver information and performance metrics
- **index.ts** - Exports all mock data with type conversion (e.g., strings to Date objects)

## Usage

Import the mock data directly from the index file:

```typescript
import { 
  expandedFleetData, 
  maintenanceRecords, 
  fuelRecords 
} from '@/mockData/vehicles';
```

Or import specific groups of related data:

```typescript
import vehicleMockData from '@/mockData/vehicles';

// Access specific categories
const fleetData = vehicleMockData.fleet.vehicles;
const maintenanceData = vehicleMockData.maintenance.records;
const driverData = vehicleMockData.drivers;
```

## Benefits of External JSON Files

1. **Separation of Concerns**: Keeps large data sets separate from UI components
2. **Reusability**: Enables the same data to be used across multiple components
3. **Maintainability**: Makes it easier to update mock data in one place
4. **Testing**: Facilitates consistent test data

## Future Improvements

The mock data structure is designed to be eventually replaced with real API calls, with minimal changes to the components that consume the data. 