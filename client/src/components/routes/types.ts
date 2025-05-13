// Types for route-related components

export interface RouteData {
  id: string;
  name: string;
  status: string;
  driver: string;
  vehicle: string;
  startLocation: string;
  endLocation: string;
  origin?: string;  // Added optional property to fix error
  destination?: string; // Added optional property to fix error
  startTime?: string;
  endTime?: string;
  departureDate: string;
  stops: number;
  distance: number;
  duration: number;
  actualDuration?: number;
  completionRate?: number;
  routeType: string;
  priority: string;
  notes?: string;
  [key: string]: any; // Allow any additional properties
}

export interface MergedRouteData extends RouteData {
  origin: string;
  destination: string;
  startLocation: string;
  endLocation: string;
}

export interface RoutesState {
  active: MergedRouteData[];
  scheduled: MergedRouteData[];
  completed: MergedRouteData[];
  templates: MergedRouteData[];
}

export interface RouteSummary {
  totalRoutes: number;
  activeRoutes: number;
  completedRoutes: number;
  scheduledRoutes: number;
  averageRouteDistance: number;
  totalDistance: number;
  averageRouteTime: number;
  [key: string]: any; // Allow any additional properties
}

export interface TrafficIncident {
  id: number;
  x: number;
  y: number;
  lat: number;
  lng: number;
  severity: 'low' | 'medium' | 'high';
  type: string;
  location: string;
  duration: string;
  affectedRoutes?: string[];
}

export type IncidentSeverity = 'low' | 'medium' | 'high';

export interface TrafficRoad {
  id: string;
  path: string;
  congestion: 'low' | 'medium' | 'high';
  name?: string;
  coordinates?: Array<{lat: number, lng: number}>;
}

export type CongestionLevel = 'low' | 'medium' | 'high';

export type PerformanceAreaKey = 'overall' | 'fuelEfficiency' | 'onTimeDelivery' | 'customerRating';

export interface DriverPerformanceData {
  name: string;
  performance: number;
}

export interface AutomatedAction {
  action: string;
  time: string;
  icon: string;
  color: string;
} 