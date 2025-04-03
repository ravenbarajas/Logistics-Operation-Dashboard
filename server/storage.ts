import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config();

import { 
  users, vehicles, warehouses, inventory, shipments, routes,
  type User, type InsertUser,
  type Vehicle, type InsertVehicle,
  type Warehouse, type InsertWarehouse,
  type Inventory, type InsertInventory,
  type Shipment, type InsertShipment,
  type Route, type InsertRoute
} from '@shared/schema';

// Database interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vehicle operations
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  
  // Warehouse operations
  getWarehouses(): Promise<Warehouse[]>;
  getWarehouse(id: number): Promise<Warehouse | undefined>;
  createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse>;
  updateWarehouse(id: number, warehouse: Partial<InsertWarehouse>): Promise<Warehouse | undefined>;
  deleteWarehouse(id: number): Promise<boolean>;
  
  // Inventory operations
  getInventoryItems(): Promise<Inventory[]>;
  getInventoryItemsForWarehouse(warehouseId: number): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  
  // Shipment operations
  getShipments(): Promise<Shipment[]>;
  getShipment(id: number): Promise<Shipment | undefined>;
  getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipment(id: number, shipment: Partial<InsertShipment>): Promise<Shipment | undefined>;
  deleteShipment(id: number): Promise<boolean>;
  
  // Route operations
  getRoutes(): Promise<Route[]>;
  getRoutesByVehicle(vehicleId: number): Promise<Route[]>;
  getRoute(id: number): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  updateRoute(id: number, route: Partial<InsertRoute>): Promise<Route | undefined>;
  deleteRoute(id: number): Promise<boolean>;
}

// PostgreSQL implementation
export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    // Set a default connection string if DATABASE_URL is not defined
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin123@localhost:5432/logidash';
    
    const pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    this.db = drizzle(pool);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  // Vehicle operations
  async getVehicles(): Promise<Vehicle[]> {
    return await this.db.select().from(vehicles);
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const result = await this.db.select().from(vehicles).where(eq(vehicles.id, id));
    return result[0];
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const result = await this.db.insert(vehicles).values(vehicle).returning();
    return result[0];
  }

  async updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const result = await this.db.update(vehicles)
      .set({ ...vehicle, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning();
    return result[0];
  }

  async deleteVehicle(id: number): Promise<boolean> {
    const result = await this.db.delete(vehicles).where(eq(vehicles.id, id)).returning();
    return result.length > 0;
  }

  // Warehouse operations
  async getWarehouses(): Promise<Warehouse[]> {
    return await this.db.select().from(warehouses);
  }

  async getWarehouse(id: number): Promise<Warehouse | undefined> {
    const result = await this.db.select().from(warehouses).where(eq(warehouses.id, id));
    return result[0];
  }

  async createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse> {
    const result = await this.db.insert(warehouses).values(warehouse).returning();
    return result[0];
  }

  async updateWarehouse(id: number, warehouse: Partial<InsertWarehouse>): Promise<Warehouse | undefined> {
    const result = await this.db.update(warehouses)
      .set({ ...warehouse, updatedAt: new Date() })
      .where(eq(warehouses.id, id))
      .returning();
    return result[0];
  }

  async deleteWarehouse(id: number): Promise<boolean> {
    const result = await this.db.delete(warehouses).where(eq(warehouses.id, id)).returning();
    return result.length > 0;
  }

  // Inventory operations
  async getInventoryItems(): Promise<Inventory[]> {
    return await this.db.select().from(inventory);
  }

  async getInventoryItemsForWarehouse(warehouseId: number): Promise<Inventory[]> {
    return await this.db.select().from(inventory).where(eq(inventory.warehouseId, warehouseId));
  }

  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    const result = await this.db.select().from(inventory).where(eq(inventory.id, id));
    return result[0];
  }

  async createInventoryItem(item: InsertInventory): Promise<Inventory> {
    const result = await this.db.insert(inventory).values(item).returning();
    return result[0];
  }

  async updateInventoryItem(id: number, item: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const result = await this.db.update(inventory)
      .set({ ...item, lastUpdated: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return result[0];
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await this.db.delete(inventory).where(eq(inventory.id, id)).returning();
    return result.length > 0;
  }

  // Shipment operations
  async getShipments(): Promise<Shipment[]> {
    return await this.db.select().from(shipments);
  }

  async getShipment(id: number): Promise<Shipment | undefined> {
    const result = await this.db.select().from(shipments).where(eq(shipments.id, id));
    return result[0];
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | undefined> {
    const result = await this.db.select().from(shipments).where(eq(shipments.trackingNumber, trackingNumber));
    return result[0];
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const result = await this.db.insert(shipments).values(shipment).returning();
    return result[0];
  }

  async updateShipment(id: number, shipment: Partial<InsertShipment>): Promise<Shipment | undefined> {
    const result = await this.db.update(shipments)
      .set({ ...shipment, updatedAt: new Date() })
      .where(eq(shipments.id, id))
      .returning();
    return result[0];
  }

  async deleteShipment(id: number): Promise<boolean> {
    const result = await this.db.delete(shipments).where(eq(shipments.id, id)).returning();
    return result.length > 0;
  }

  // Route operations
  async getRoutes(): Promise<Route[]> {
    return await this.db.select().from(routes);
  }

  async getRoutesByVehicle(vehicleId: number): Promise<Route[]> {
    return await this.db.select().from(routes).where(eq(routes.vehicleId, vehicleId));
  }

  async getRoute(id: number): Promise<Route | undefined> {
    const result = await this.db.select().from(routes).where(eq(routes.id, id));
    return result[0];
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const result = await this.db.insert(routes).values(route).returning();
    return result[0];
  }

  async updateRoute(id: number, route: Partial<InsertRoute>): Promise<Route | undefined> {
    const result = await this.db.update(routes)
      .set({ ...route, updatedAt: new Date() })
      .where(eq(routes.id, id))
      .returning();
    return result[0];
  }

  async deleteRoute(id: number): Promise<boolean> {
    const result = await this.db.delete(routes).where(eq(routes.id, id)).returning();
    return result.length > 0;
  }
}

// Create and export storage instance
export const storage = new PostgresStorage();
