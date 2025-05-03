# Mock Data Directory

This directory contains mock data used throughout the application for development and testing purposes.

## Structure

- **shipments/** - Mock data related to shipment features
  - `shipments.json` - Basic shipment records with tracking information
  - `analytics.json` - Performance and analytics data for shipments
  - `routeEfficiency.json` - Data for route efficiency analysis
  - `environmentalImpact.json` - Environmental impact metrics and charts
  - `exceptions.json` - Shipment exceptions and resolution data
  - `index.ts` - Exports all mock data with type conversion (e.g., strings to Date objects)

## Usage

Import the mock data directly from the index files:

```typescript
import { shipments } from '@/mockData/shipments';
```

## Benefits of External JSON Files

1. **Separation of Concerns**: Keeps large data sets separate from UI components
2. **Reusability**: Enables the same data to be used across multiple components
3. **Maintainability**: Makes it easier to update mock data in one place
4. **Testing**: Facilitates consistent test data

## Future Improvements

The mock data structure is designed to be eventually replaced with real API calls, with minimal changes to the components that consume the data. 