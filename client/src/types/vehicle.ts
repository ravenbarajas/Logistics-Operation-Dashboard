import { Vehicle } from "@shared/schema";

export interface ExtendedVehicle extends Vehicle {
  make?: string;
  model?: string;
  year?: number;
  fuelLevel?: number;
  mileage?: number;
  location?: { lat: number; lng: number; lastUpdated: Date };
  assignedDriver?: string;
  vinNumber?: string;
  licensePlate?: string;
  insuranceExpiry?: Date;
  registrationExpiry?: Date;
  departmentId?: number;
  departmentName?: string;
} 