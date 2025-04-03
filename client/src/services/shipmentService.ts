import { Shipment } from '@shared/schema';

// Enhanced mock data
const mockShipments = [
  {
    id: 1,
    trackingNumber: "SHP-2024-001",
    status: "in-transit",
    originLocation: { lat: 37.7749, lng: -122.4194 },
    destinationLocation: { lat: 34.0522, lng: -118.2437 },
    estimatedDelivery: new Date('2024-02-18'),
    actualDelivery: null,
    vehicleId: 1,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-16'),
    // Additional custom properties
    customer: "Acme Corp",
    driver: "John Smith",
    vehicle: "Truck #VH-001",
    description: "Electronics Shipment",
    origin: "San Francisco, CA",
    destination: "Los Angeles, CA",
    estimatedArrival: "2024-02-18 15:30",
    distance: 382
  },
  {
    id: 2,
    trackingNumber: "SHP-2024-002",
    status: "delivered",
    originLocation: { lat: 41.8781, lng: -87.6298 },
    destinationLocation: { lat: 39.7684, lng: -86.1581 },
    estimatedDelivery: new Date('2024-02-14'),
    actualDelivery: new Date('2024-02-14'),
    vehicleId: 2,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-14'),
    // Additional custom properties
    customer: "Global Industries",
    driver: "Sarah Johnson",
    vehicle: "Van #VH-002",
    description: "Office Supplies",
    origin: "Chicago, IL",
    destination: "Indianapolis, IN",
    deliveryTime: "2024-02-14 11:25",
    distance: 184
  },
  {
    id: 3,
    trackingNumber: "SHP-2024-003",
    status: "processing",
    originLocation: { lat: 30.2672, lng: -97.7431 },
    destinationLocation: { lat: 32.7767, lng: -96.7970 },
    estimatedDelivery: new Date('2024-02-17'),
    actualDelivery: null,
    vehicleId: 3,
    createdAt: new Date('2024-02-16'),
    updatedAt: new Date('2024-02-16'),
    // Additional custom properties
    customer: "Tech Solutions",
    driver: "Michael Chen",
    vehicle: "Truck #VH-003",
    description: "Server Equipment",
    origin: "Austin, TX",
    destination: "Dallas, TX",
    estimatedArrival: "2024-02-17 18:00",
    distance: 195
  },
  {
    id: 4,
    trackingNumber: "SHP-2024-004",
    status: "scheduled",
    originLocation: { lat: 40.7128, lng: -74.0060 },
    destinationLocation: { lat: 42.3601, lng: -71.0589 },
    estimatedDelivery: new Date('2024-02-22'),
    actualDelivery: null,
    vehicleId: 5,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    // Additional custom properties
    customer: "Retail Partners",
    driver: "Emily Davis",
    vehicle: "Van #VH-005",
    description: "Clothing and Apparel",
    origin: "New York, NY",
    destination: "Boston, MA",
    departureDate: "2024-02-20",
    distance: 215
  },
  {
    id: 5,
    trackingNumber: "SHP-2024-005",
    status: "cancelled",
    originLocation: { lat: 25.7617, lng: -80.1918 },
    destinationLocation: { lat: 28.5383, lng: -81.3792 },
    estimatedDelivery: new Date('2024-02-15'),
    actualDelivery: null,
    vehicleId: null,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-11'),
    // Additional custom properties
    customer: "FoodCo Distributors",
    driver: "Unassigned",
    vehicle: "Unassigned",
    description: "Perishable Food Items",
    origin: "Miami, FL",
    destination: "Orlando, FL",
    distance: 235
  },
  {
    id: 6,
    trackingNumber: "SHP-2024-006",
    status: "in-transit",
    originLocation: { lat: 47.6062, lng: -122.3321 },
    destinationLocation: { lat: 45.5051, lng: -122.6750 },
    estimatedDelivery: new Date('2024-02-17'),
    actualDelivery: null,
    vehicleId: 9,
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-15'),
    // Additional custom properties
    customer: "Medical Supplies Inc",
    driver: "Robert Williams",
    vehicle: "Truck #VH-009",
    description: "Medical Equipment",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    estimatedArrival: "2024-02-17 09:45",
    distance: 174
  },
  {
    id: 7,
    trackingNumber: "SHP-2024-007",
    status: "delivered",
    originLocation: { lat: 39.7392, lng: -104.9903 },
    destinationLocation: { lat: 40.7608, lng: -111.8910 },
    estimatedDelivery: new Date('2024-02-11'),
    actualDelivery: new Date('2024-02-10'),
    vehicleId: 1,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-10'),
    // Additional custom properties
    customer: "Construction Materials Ltd",
    driver: "David Martinez",
    vehicle: "Truck #VH-001",
    description: "Building Materials",
    origin: "Denver, CO",
    destination: "Salt Lake City, UT",
    deliveryTime: "2024-02-10 16:15",
    distance: 371
  },
  {
    id: 8,
    trackingNumber: "SHP-2024-008",
    status: "pending",
    originLocation: { lat: 33.7490, lng: -84.3880 },
    destinationLocation: { lat: 35.2271, lng: -80.8431 },
    estimatedDelivery: new Date('2024-02-23'),
    actualDelivery: null,
    vehicleId: null,
    createdAt: new Date('2024-02-16'),
    updatedAt: new Date('2024-02-16'),
    // Additional custom properties
    customer: "Furniture Wholesale",
    driver: "Unassigned",
    vehicle: "Unassigned",
    description: "Office Furniture",
    origin: "Atlanta, GA",
    destination: "Charlotte, NC",
    departureDate: "2024-02-22",
    distance: 245
  },
  {
    id: 9,
    trackingNumber: "SHP-2024-009",
    status: "in-transit",
    originLocation: { lat: 29.7604, lng: -95.3698 },
    destinationLocation: { lat: 29.4241, lng: -98.4936 },
    estimatedDelivery: new Date('2024-02-17'),
    actualDelivery: null,
    vehicleId: 7,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-16'),
    // Additional custom properties
    customer: "Electronics Retailers",
    driver: "Lisa Thompson",
    vehicle: "Van #VH-007",
    description: "Consumer Electronics",
    origin: "Houston, TX",
    destination: "San Antonio, TX",
    estimatedArrival: "2024-02-17 14:20",
    distance: 197
  },
  {
    id: 10,
    trackingNumber: "SHP-2024-010",
    status: "scheduled",
    originLocation: { lat: 42.3314, lng: -83.0458 },
    destinationLocation: { lat: 41.4993, lng: -81.6944 },
    estimatedDelivery: new Date('2024-02-22'),
    actualDelivery: null,
    vehicleId: 4,
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-14'),
    // Additional custom properties
    customer: "Auto Parts Distributors",
    driver: "James Wilson",
    vehicle: "Truck #VH-004",
    description: "Automotive Components",
    origin: "Detroit, MI",
    destination: "Cleveland, OH",
    departureDate: "2024-02-21",
    distance: 169
  }
];

export interface ShipmentSummary {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  pending: number;
  onTimeDeliveryRate: number;
}

export const shipmentService = {
  async getShipmentSummary(): Promise<ShipmentSummary> {
    const totalShipments = mockShipments.length;
    const inTransit = mockShipments.filter(s => s.status === 'in-transit').length;
    const delivered = mockShipments.filter(s => s.status === 'delivered').length;
    const pending = mockShipments.filter(s => s.status === 'pending').length;
    
    // Calculate on-time delivery rate (delivered shipments that were delivered before or on estimated date)
    const onTimeDeliveries = mockShipments.filter(s => 
      s.status === 'delivered' && 
      s.actualDelivery && 
      s.estimatedDelivery && 
      s.actualDelivery <= s.estimatedDelivery
    ).length;
    
    const onTimeDeliveryRate = delivered > 0 ? Math.round((onTimeDeliveries / delivered) * 100) : 0;

    return {
      totalShipments,
      inTransit,
      delivered,
      pending,
      onTimeDeliveryRate
    };
  },

  async getShipments(): Promise<Shipment[]> {
    return [...mockShipments];
  },

  async getShipment(id: number): Promise<Shipment> {
    const shipment = mockShipments.find(s => s.id === id);
    if (!shipment) {
      throw new Error('Shipment not found');
    }
    return { ...shipment };
  },

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment> {
    const shipment = mockShipments.find(s => s.trackingNumber === trackingNumber);
    if (!shipment) {
      throw new Error('Shipment not found');
    }
    return { ...shipment };
  },

  async createShipment(shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
    const newId = Math.max(0, ...mockShipments.map(s => s.id)) + 1;
    const now = new Date();
    const newShipment: Shipment = {
      ...shipment,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    
    mockShipments.push(newShipment);
    return { ...newShipment };
  },

  async updateShipment(id: number, shipment: Partial<Shipment>): Promise<Shipment> {
    const index = mockShipments.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Shipment not found');
    }
    
    const now = new Date();
    const updatedShipment = {
      ...mockShipments[index],
      ...shipment,
      updatedAt: now
    };
    
    mockShipments[index] = updatedShipment;
    return { ...updatedShipment };
  },

  async deleteShipment(id: number): Promise<void> {
    const index = mockShipments.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Shipment not found');
    }
    
    mockShipments.splice(index, 1);
  },
}; 