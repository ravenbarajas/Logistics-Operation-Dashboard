// Import all JSON data
import routeDataJson from './routeData.json';
import optimizationDataJson from './optimizationData.json';
import trafficDataJson from './trafficData.json';
import driverPerformanceDataJson from './driverPerformanceData.json';

// Explicitly type the imported JSON data
import { TrafficIncident, TrafficRoad } from '@/components/maps/TrafficMap';
import { RouteData as RouteTableData } from '@/components/routes/RouteTable';

// Type definitions for route data in JSON files
export interface MockRouteData {
  id: string;
  name: string;
  status: string;
  routeType: string;
  driver: string;
  vehicle: string;
  departureDate?: string;
  departureTime?: string;
  estimatedArrival?: string;
  origin: string;
  destination: string;
  stops: number;
  distance: number;
  duration: number;
  completionRate?: number;
  startTime?: string;
  endTime?: string;
  actualDuration?: number;
  lastUsed?: string;
  usageCount?: number;
}

// Create a merged interface that works with both data models
export interface MergedRouteData extends Partial<MockRouteData>, Partial<RouteTableData> {
  id: string;
  name: string;
  vehicle: string;
  driver: string;
  stops: number;
  distance: number;
  duration: number;
  status: string;
  // Optional fields from both types
  origin?: string;
  destination?: string;
  startLocation?: string;
  endLocation?: string;
}

// Type definitions for optimization data
export interface OptimizationSummary {
  name: string;
  before: number;
  after: number;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
}

export interface RouteComparison {
  name: string;
  stops: number;
  waypoints: RouteWaypoint[];
  distance: number;
  duration: number;
}

export interface RouteComparisonData {
  originalRoute: RouteComparison;
  optimizedRoute: RouteComparison;
}

export interface EfficiencyData {
  name: string;
  distance: number;
  time: number;
  fuel: number;
  emissions: number;
}

export interface MonthlyTrend {
  month: string;
  distance: number;
  fuel: number;
  emissions: number;
}

// Type definitions for driver performance
export interface DriverPerformanceData {
  name: string;
  performance: number;
}

export interface TrafficAction {
  action: string;
  icon: string;
  color: string;
  time: string;
}

// Helper function to map mock data to RouteTable compatible data
const mapToRouteTableData = (route: any): RouteTableData => {
  return {
    ...route,
    startLocation: route.origin,
    endLocation: route.destination,
    // Add any other fields that RouteTable expects
    fuelConsumption: route.fuelConsumption || 0,
    co2Emissions: route.co2Emissions || 0
  };
};

// Export typed data with property mapping
export const activeRoutes = routeDataJson.activeRoutes.map(mapToRouteTableData);
export const scheduledRoutes = routeDataJson.scheduledRoutes.map(mapToRouteTableData);
export const completedRoutes = routeDataJson.completedRoutes.map(mapToRouteTableData);
export const routeTemplates = routeDataJson.routeTemplates.map(mapToRouteTableData);

export const optimizationSummaryData = optimizationDataJson.optimizationSummaryData as OptimizationSummary[];
export const routeComparisonData = optimizationDataJson.routeComparisonData as RouteComparisonData;
export const efficiencyImprovementData = optimizationDataJson.efficiencyImprovementData as EfficiencyData[];
export const routePerformanceData = optimizationDataJson.routePerformanceData as EfficiencyData[];
export const monthlyTrendData = optimizationDataJson.monthlyTrendData as MonthlyTrend[];

export const trafficIncidents = trafficDataJson.trafficIncidents as TrafficIncident[];
export const trafficRoads = trafficDataJson.trafficRoads as TrafficRoad[];
export const trafficAutomatedActions = trafficDataJson.trafficAutomatedActions as TrafficAction[];

export const driverPerformanceData = driverPerformanceDataJson.driverPerformanceData as Record<string, DriverPerformanceData[]>;

// Export original JSON for any direct imports
export {
  routeDataJson,
  optimizationDataJson,
  trafficDataJson,
  driverPerformanceDataJson
}; 