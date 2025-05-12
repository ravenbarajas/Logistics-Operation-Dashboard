# Route Management Mock Data

This directory contains mock data for the Route Management system. The data is structured to be modular, reusable, and easy to maintain.

## Data Structure

- **routeData.json** - Contains route-related data including:
  - `activeRoutes` - Currently active/in-progress routes
  - `scheduledRoutes` - Planned routes not yet started
  - `completedRoutes` - Finished routes with completion details
  - `routeTemplates` - Reusable route templates

- **optimizationData.json** - Contains route optimization data:
  - `optimizationSummaryData` - Before/after comparison data
  - `routeComparisonData` - Original vs. optimized route waypoints
  - `efficiencyImprovementData` - Per-route efficiency metrics
  - `routePerformanceData` - Performance data for routes
  - `monthlyTrendData` - Monthly trend data for routes

- **trafficData.json** - Contains traffic-related information:
  - `trafficIncidents` - Traffic incidents affecting routes
  - `trafficRoads` - Road segments with congestion data
  - `trafficAutomatedActions` - Automated actions taken due to traffic

- **driverPerformanceData.json** - Contains driver performance metrics:
  - `driverPerformanceData` - Performance data for various metrics including overall, fuel efficiency, on-time delivery, and customer rating

## Usage

The mock data is exported through the `index.ts` file which provides properly typed data:

```typescript
// Import all data with proper typing
import {
  activeRoutes,
  scheduledRoutes,
  completedRoutes,
  routeTemplates,
  optimizationSummaryData,
  routeComparisonData,
  efficiencyImprovementData,
  routePerformanceData,
  monthlyTrendData,
  trafficIncidents,
  trafficRoads,
  trafficAutomatedActions,
  driverPerformanceData
} from "@/mockData/routes";

// Use the data in components
const Component = () => {
  const [routes, setRoutes] = useState(activeRoutes);
  // ...
}
```

## Benefits

- **Modularity** - Data is separated by domain/function
- **Reusability** - Data can be imported and used across multiple components
- **Type Safety** - All data is properly typed through the index.ts exports
- **Maintainability** - Easier to update and extend without affecting component logic 