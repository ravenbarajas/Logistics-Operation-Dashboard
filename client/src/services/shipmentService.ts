import { Shipment } from '@shared/schema';
import { 
  shipments as mockShipments,
  analyticsData,
  routeEfficiencyData,
  environmentalImpactData,
  exceptionsData
} from '@/mockData/shipments';

// New types for analytics
export interface ShipmentSummary {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  pending: number;
  onTimeDeliveryRate: number;
  averageDeliveryTime: number; // in hours
  totalDistance: number; // in miles
  delayedShipments: number;
}

export interface ShipmentPerformanceByMonth {
  month: string;
  totalShipments: number;
  onTimeDelivery: number;
  delayedDelivery: number;
  cancelled: number;
}

export interface ShipmentVolumeByRegion {
  region: string;
  count: number;
  percentage: number;
}

export interface TopCustomer {
  name: string;
  shipments: number;
  totalDistance: number;
  averageDeliveryTime: number;
}

export interface PerformanceMetrics {
  fuelEfficiency: number; // miles per gallon
  operationalCosts: number; // dollars
  loadUtilization: number; // percentage
}

export const shipmentService = {
  async getShipmentSummary(): Promise<ShipmentSummary> {
    // Return the summary from analytics data
    return analyticsData.summary;
  },
  
  async getShipmentPerformanceByMonth(): Promise<ShipmentPerformanceByMonth[]> {
    // Return the performance by month from analytics data
    return analyticsData.performanceByMonth;
  },
  
  async getShipmentVolumeByRegion(): Promise<ShipmentVolumeByRegion[]> {
    // Return the volume by region from analytics data
    return analyticsData.volumeByRegion;
  },
  
  async getTopCustomers(limit: number = 5): Promise<TopCustomer[]> {
    // Return the top customers from analytics data (limit if needed)
    return analyticsData.topCustomers.slice(0, limit);
  },
  
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    // Return the performance metrics from analytics data
    return analyticsData.performanceMetrics;
  },
  
  async getShipments(): Promise<Shipment[]> {
    return mockShipments;
  },
  
  async getShipment(id: number): Promise<Shipment> {
    const shipment = mockShipments.find(s => s.id === id);
    if (!shipment) {
      throw new Error(`Shipment with ID ${id} not found`);
    }
    return shipment;
  },
  
  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment> {
    const shipment = mockShipments.find(s => s.trackingNumber === trackingNumber);
    if (!shipment) {
      throw new Error(`Shipment with tracking number ${trackingNumber} not found`);
    }
    return shipment;
  },
  
  async createShipment(shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
    // Simulate API call to create a shipment
    const newShipment = {
      ...shipment,
      id: Math.max(...mockShipments.map(s => s.id)) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Shipment;
    
    return newShipment;
  },
  
  async updateShipment(id: number, shipment: Partial<Shipment>): Promise<Shipment> {
    // Simulate API call to update a shipment
    const existingShipment = await this.getShipment(id);
    
    const updatedShipment = {
      ...existingShipment,
      ...shipment,
      updatedAt: new Date()
    };
    
    return updatedShipment;
  },
  
  async deleteShipment(id: number): Promise<void> {
    // Simulate API call to delete a shipment
    // Just check if the shipment exists
    await this.getShipment(id);
    // In a real scenario, we would remove the shipment
  },
  
  async updateShipmentStatus(id: number, status: string): Promise<Shipment> {
    return this.updateShipment(id, { status });
  },

  // Helper method to get route efficiency data
  async getRouteEfficiencyData() {
    return routeEfficiencyData;
  },

  // Helper method to get environmental impact data
  async getEnvironmentalImpactData() {
    return environmentalImpactData;
  },

  // Helper method to get exceptions data
  async getExceptionsData() {
    return exceptionsData;
  }
}; 