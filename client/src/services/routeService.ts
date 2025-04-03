import { Route } from '@shared/schema';

// Mock data for routes
let mockRoutes: Route[] = [
  {
    id: 1,
    vehicleId: 1,
    startLocation: { lat: 37.7749, lng: -122.4194 },
    endLocation: { lat: 40.7128, lng: -74.0060 },
    status: 'active',
    distance: '4690.5',
    estimatedDuration: 2580, // in minutes
    actualDuration: null,
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-10')
  },
  {
    id: 2,
    vehicleId: 3,
    startLocation: { lat: 34.0522, lng: -118.2437 },
    endLocation: { lat: 41.8781, lng: -87.6298 },
    status: 'completed',
    distance: '3278.2',
    estimatedDuration: 1860,
    actualDuration: 1920,
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-24')
  },
  {
    id: 3,
    vehicleId: 2,
    startLocation: { lat: 39.7392, lng: -104.9903 },
    endLocation: { lat: 32.7767, lng: -96.7970 },
    status: 'completed',
    distance: '1065.3',
    estimatedDuration: 780,
    actualDuration: 750,
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-29')
  },
  {
    id: 4,
    vehicleId: 5,
    startLocation: { lat: 47.6062, lng: -122.3321 },
    endLocation: { lat: 45.5051, lng: -122.6750 },
    status: 'active',
    distance: '280.1',
    estimatedDuration: 180,
    actualDuration: null,
    createdAt: new Date('2023-11-18'),
    updatedAt: new Date('2023-11-26')
  },
  {
    id: 5,
    vehicleId: 4,
    startLocation: { lat: 36.1699, lng: -115.1398 },
    endLocation: { lat: 33.4484, lng: -112.0740 },
    status: 'planned',
    distance: '472.8',
    estimatedDuration: 300,
    actualDuration: null,
    createdAt: new Date('2023-11-25'),
    updatedAt: new Date('2023-11-25')
  }
];

export interface RouteSummary {
  totalRoutes: number;
  activeRoutes: number;
  completedRoutes: number;
  plannedRoutes: number;
  averageRouteDistance: number;
  totalDistance: number;
}

// Interface for route optimization parameters
export interface RouteOptimizationParams {
  vehicleIds: number[];
  strategy: string;
  maxStops: number;
  maxDistance: number;
  avoidTolls: boolean;
  avoidHighways: boolean;
  prioritizeDeliveries: boolean;
}

export const routeService = {
  async getRouteSummary(): Promise<RouteSummary> {
    const totalRoutes = mockRoutes.length;
    const activeRoutes = mockRoutes.filter(r => r.status === 'active').length;
    const completedRoutes = mockRoutes.filter(r => r.status === 'completed').length;
    const plannedRoutes = mockRoutes.filter(r => r.status === 'planned').length;
    
    // Calculate total and average distance
    let totalDistance = 0;
    for (const route of mockRoutes) {
      if (route.distance) {
        totalDistance += parseFloat(route.distance);
      }
    }
    const averageRouteDistance = totalRoutes > 0 ? totalDistance / totalRoutes : 0;

    return {
      totalRoutes,
      activeRoutes,
      completedRoutes,
      plannedRoutes,
      averageRouteDistance: Math.round(averageRouteDistance * 10) / 10,
      totalDistance: Math.round(totalDistance)
    };
  },

  async getRoutes(): Promise<Route[]> {
    return [...mockRoutes];
  },

  async getRoutesByVehicle(vehicleId: number): Promise<Route[]> {
    return mockRoutes.filter(r => r.vehicleId === vehicleId);
  },

  async getRoute(id: number): Promise<Route> {
    const route = mockRoutes.find(r => r.id === id);
    if (!route) {
      throw new Error('Route not found');
    }
    return { ...route };
  },

  async createRoute(route: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<Route> {
    const newId = Math.max(0, ...mockRoutes.map(r => r.id)) + 1;
    const now = new Date();
    const newRoute: Route = {
      ...route,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    
    mockRoutes.push(newRoute);
    return { ...newRoute };
  },

  async updateRoute(id: number, route: Partial<Route>): Promise<Route> {
    const index = mockRoutes.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Route not found');
    }
    
    const now = new Date();
    const updatedRoute = {
      ...mockRoutes[index],
      ...route,
      updatedAt: now
    };
    
    mockRoutes[index] = updatedRoute;
    return { ...updatedRoute };
  },

  async deleteRoute(id: number): Promise<void> {
    const index = mockRoutes.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Route not found');
    }
    
    mockRoutes.splice(index, 1);
  },

  // New method for route optimization
  async optimizeRoutes(params: RouteOptimizationParams): Promise<Route[]> {
    // In a real app, this would make a call to a route optimization service
    // For this mock app, we'll simulate optimization by generating fake optimized routes
    
    const { vehicleIds, strategy, maxStops, maxDistance } = params;
    const optimizedRoutes: Route[] = [];
    const now = new Date();
    
    // Generate a new optimized route for each vehicle
    for (const vehicleId of vehicleIds) {
      // Generate random coordinates for stops based on strategy
      let startLat = 37.7749;
      let startLng = -122.4194;
      let endLat = 39.7392;
      let endLng = -104.9903;
      
      // Adjust route parameters based on strategy
      let distanceValue = '0';
      let estimatedDurationValue = 0;
      
      switch (strategy) {
        case 'distance':
          // Shortest distance strategy
          distanceValue = (Math.random() * maxDistance * 0.7).toFixed(1);
          estimatedDurationValue = Math.round(parseFloat(distanceValue) * 0.8);
          break;
        case 'time':
          // Fastest route strategy
          distanceValue = (Math.random() * maxDistance * 0.9).toFixed(1);
          estimatedDurationValue = Math.round(parseFloat(distanceValue) * 0.6);
          break;
        case 'fuel':
          // Fuel efficiency strategy
          distanceValue = (Math.random() * maxDistance * 0.85).toFixed(1);
          estimatedDurationValue = Math.round(parseFloat(distanceValue) * 0.75);
          break;
        case 'balanced':
        default:
          // Balanced strategy
          distanceValue = (Math.random() * maxDistance * 0.8).toFixed(1);
          estimatedDurationValue = Math.round(parseFloat(distanceValue) * 0.7);
          break;
      }
      
      // Create new optimized route
      const newRouteId = Math.max(0, ...mockRoutes.map(r => r.id)) + optimizedRoutes.length + 1;
      
      const newRoute: Route = {
        id: newRouteId,
        vehicleId,
        startLocation: { lat: startLat, lng: startLng },
        endLocation: { lat: endLat, lng: endLng },
        status: 'planned',
        distance: distanceValue,
        estimatedDuration: estimatedDurationValue,
        actualDuration: null,
        createdAt: now,
        updatedAt: now
      };
      
      optimizedRoutes.push(newRoute);
      mockRoutes.push(newRoute);
    }
    
    return optimizedRoutes;
  }
}; 