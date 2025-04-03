import { Vehicle } from '@shared/schema';

// Define an extended interface for the Vehicle type that includes additional properties
export interface ExtendedVehicle extends Vehicle {
  make?: string;
  model?: string;
  year?: number;
  fuelLevel?: number;
  mileage?: number;
}

export interface FleetSummary {
  totalVehicles: number;
  activeVehicles: number;
  inMaintenance: number;
  outOfService: number;
  activePercentage: number;
  maintenancePercentage: number;
  outOfServicePercentage: number;
}

// Enhanced mock data with numeric IDs
const mockVehicles = [
  {
    id: 1,
    name: "Delivery Truck 1",
    type: "Heavy Truck",
    status: "active",
    currentLocation: { lat: 37.7749, lng: -122.4194 },
    lastMaintenance: new Date('2023-11-15'),
    nextMaintenance: new Date('2024-01-15'),
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-10-15'),
    make: "Volvo",
    model: "FH16",
    year: 2022,
    fuelLevel: 75,
    mileage: 45890
  },
  {
    id: 2,
    name: "Delivery Van 1",
    type: "Light Van",
    status: "active",
    currentLocation: { lat: 34.0522, lng: -118.2437 },
    lastMaintenance: new Date('2023-12-05'),
    nextMaintenance: new Date('2024-02-10'),
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-11-10'),
    make: "Mercedes",
    model: "Sprinter",
    year: 2021,
    fuelLevel: 62,
    mileage: 38750
  },
  {
    id: 3,
    name: "Cargo Truck 1",
    type: "Medium Truck",
    status: "maintenance",
    currentLocation: { lat: 40.7128, lng: -74.0060 },
    lastMaintenance: new Date('2024-01-10'),
    nextMaintenance: new Date('2024-03-20'),
    createdAt: new Date('2023-07-05'),
    updatedAt: new Date('2023-09-20'),
    make: "MAN",
    model: "TGX",
    year: 2020,
    fuelLevel: 30,
    mileage: 87600
  },
  {
    id: 4,
    name: "Refrigerated Truck",
    type: "Specialty",
    status: "active",
    currentLocation: { lat: 41.8781, lng: -87.6298 },
    lastMaintenance: new Date('2023-10-22'),
    nextMaintenance: new Date('2024-04-05'),
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2023-12-05'),
    make: "Scania",
    model: "R Series",
    year: 2021,
    fuelLevel: 80,
    mileage: 35240
  },
  {
    id: 5,
    name: "Electric Van",
    type: "Light Van",
    status: "active",
    currentLocation: { lat: 42.3601, lng: -71.0589 },
    lastMaintenance: new Date('2024-02-01'),
    nextMaintenance: new Date('2024-02-25'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-08-25'),
    make: "Rivian",
    model: "Electric Delivery Van",
    year: 2023,
    fuelLevel: 45,
    mileage: 12500
  },
  {
    id: 6,
    name: "Heavy Hauler",
    type: "Heavy Truck",
    status: "inactive",
    currentLocation: { lat: 40.7128, lng: -74.0060 },
    lastMaintenance: new Date('2023-09-15'),
    nextMaintenance: new Date('2024-03-15'),
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2023-09-15'),
    make: "Kenworth",
    model: "T680",
    year: 2019,
    fuelLevel: 10,
    mileage: 125780
  },
  {
    id: 7,
    name: "City Delivery Van",
    type: "Light Van",
    status: "active",
    currentLocation: { lat: 34.0522, lng: -118.2437 },
    lastMaintenance: new Date('2024-01-25'),
    nextMaintenance: new Date('2024-02-25'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-25'),
    make: "Ford",
    model: "Transit",
    year: 2022,
    fuelLevel: 68,
    mileage: 27830
  },
  {
    id: 8,
    name: "Flatbed Truck",
    type: "Medium Truck",
    status: "maintenance",
    currentLocation: { lat: 41.8781, lng: -87.6298 },
    lastMaintenance: new Date('2023-12-12'),
    nextMaintenance: new Date('2024-02-12'),
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-12-12'),
    make: "Isuzu",
    model: "FTR",
    year: 2020,
    fuelLevel: 25,
    mileage: 65400
  },
  {
    id: 9,
    name: "Long Haul Truck",
    type: "Heavy Truck",
    status: "active",
    currentLocation: { lat: 29.7604, lng: -95.3698 },
    lastMaintenance: new Date('2023-11-30'),
    nextMaintenance: new Date('2024-02-28'),
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-11-30'),
    make: "Freightliner",
    model: "Cascadia",
    year: 2021,
    fuelLevel: 85,
    mileage: 98700
  },
  {
    id: 10,
    name: "Box Truck",
    type: "Medium Truck",
    status: "active",
    currentLocation: { lat: 37.7749, lng: -122.4194 },
    lastMaintenance: new Date('2024-02-05'),
    nextMaintenance: new Date('2024-03-05'),
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-02-05'),
    make: "Hino",
    model: "268A",
    year: 2022,
    fuelLevel: 92,
    mileage: 18650
  }
];

export const fleetService = {
  async getFleetSummary(): Promise<FleetSummary> {
    // Calculate summary from mock data
    const totalVehicles = mockVehicles.length;
    const activeVehicles = mockVehicles.filter(v => v.status === 'active').length;
    const inMaintenance = mockVehicles.filter(v => v.status === 'maintenance').length;
    const outOfService = mockVehicles.filter(v => v.status === 'inactive').length;

    return {
      totalVehicles,
      activeVehicles,
      inMaintenance,
      outOfService,
      activePercentage: Math.round((activeVehicles / totalVehicles) * 100),
      maintenancePercentage: Math.round((inMaintenance / totalVehicles) * 100),
      outOfServicePercentage: Math.round((outOfService / totalVehicles) * 100)
    };
  },

  async getVehicles(): Promise<Vehicle[]> {
    return [...mockVehicles];
  },

  async getVehicle(id: number): Promise<Vehicle> {
    const vehicle = mockVehicles.find(v => v.id === id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return { ...vehicle };
  },

  async createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const newId = Math.max(0, ...mockVehicles.map(v => v.id)) + 1;
    const now = new Date();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    
    mockVehicles.push(newVehicle);
    return { ...newVehicle };
  },

  async updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const index = mockVehicles.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Vehicle not found');
    }
    
    const now = new Date();
    const updatedVehicle = {
      ...mockVehicles[index],
      ...vehicle,
      updatedAt: now
    };
    
    mockVehicles[index] = updatedVehicle;
    return { ...updatedVehicle };
  },

  async deleteVehicle(id: number): Promise<void> {
    const index = mockVehicles.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Vehicle not found');
    }
    
    mockVehicles.splice(index, 1);
  },
}; 