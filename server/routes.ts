import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertUserSchema, 
  insertVehicleSchema, 
  insertWarehouseSchema, 
  insertInventorySchema, 
  insertShipmentSchema, 
  insertRouteSchema 
} from "@shared/schema";

// Helper function to handle validation and API responses
const validateRequest = (schema: z.ZodType<any>) => {
  return (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: true,
          message: validationError.message
        });
      }
      return res.status(500).json({ 
        error: true,
        message: "Internal server error during validation" 
      });
    }
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // ==================
  // Fleet Management Routes
  // ==================
  app.get('/api/fleet/summary', async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      const totalVehicles = vehicles.length;
      const activeVehicles = vehicles.filter(v => v.status === 'active').length;
      const inMaintenance = vehicles.filter(v => v.status === 'maintenance').length;
      const outOfService = vehicles.filter(v => v.status === 'inactive').length;
      
      res.json({
        totalVehicles,
        activeVehicles,
        inMaintenance,
        outOfService,
        activePercentage: totalVehicles ? Math.round((activeVehicles / totalVehicles) * 100) : 0,
        maintenancePercentage: totalVehicles ? Math.round((inMaintenance / totalVehicles) * 100) : 0,
        outOfServicePercentage: totalVehicles ? Math.round((outOfService / totalVehicles) * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching fleet summary:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch fleet summary' });
    }
  });

  app.get('/api/fleet/vehicles', async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch vehicles' });
    }
  });

  app.get('/api/fleet/vehicles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }

      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ error: true, message: 'Vehicle not found' });
      }
      res.json(vehicle);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch vehicle' });
    }
  });

  app.post('/api/fleet/vehicles', validateRequest(insertVehicleSchema), async (req, res) => {
    try {
      const vehicle = await storage.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({ error: true, message: 'Failed to create vehicle' });
    }
  });

  app.put('/api/fleet/vehicles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }

      const vehicle = await storage.updateVehicle(id, req.body);
      if (!vehicle) {
        return res.status(404).json({ error: true, message: 'Vehicle not found' });
      }
      res.json(vehicle);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      res.status(500).json({ error: true, message: 'Failed to update vehicle' });
    }
  });

  app.delete('/api/fleet/vehicles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }

      const success = await storage.deleteVehicle(id);
      if (!success) {
        return res.status(404).json({ error: true, message: 'Vehicle not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      res.status(500).json({ error: true, message: 'Failed to delete vehicle' });
    }
  });
  
  // ==================
  // User Routes
  // ==================
  app.get('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.post('/api/users', validateRequest(insertUserSchema), async (req, res) => {
    try {
      const existing = await storage.getUserByUsername(req.body.username);
      if (existing) {
        return res.status(409).json({ error: true, message: "Username already exists" });
      }
      
      const user = await storage.createUser(req.body);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  // ==================
  // Vehicle Routes
  // ==================
  app.get('/api/vehicles', async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.get('/api/vehicles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ error: true, message: "Vehicle not found" });
      }
      
      res.json(vehicle);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.post('/api/vehicles', validateRequest(insertVehicleSchema), async (req, res) => {
    try {
      const vehicle = await storage.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.put('/api/vehicles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      // Check if vehicle exists
      const existingVehicle = await storage.getVehicle(id);
      if (!existingVehicle) {
        return res.status(404).json({ error: true, message: "Vehicle not found" });
      }
      
      const updatedVehicle = await storage.updateVehicle(id, req.body);
      res.json(updatedVehicle);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.delete('/api/vehicles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const result = await storage.deleteVehicle(id);
      if (!result) {
        return res.status(404).json({ error: true, message: "Vehicle not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  // ==================
  // Warehouse Routes
  // ==================
  app.get('/api/warehouses', async (req, res) => {
    try {
      const warehouses = await storage.getWarehouses();
      res.json(warehouses);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.get('/api/warehouses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const warehouse = await storage.getWarehouse(id);
      if (!warehouse) {
        return res.status(404).json({ error: true, message: "Warehouse not found" });
      }
      
      res.json(warehouse);
    } catch (error) {
      console.error('Error fetching warehouse:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.post('/api/warehouses', validateRequest(insertWarehouseSchema), async (req, res) => {
    try {
      const warehouse = await storage.createWarehouse(req.body);
      res.status(201).json(warehouse);
    } catch (error) {
      console.error('Error creating warehouse:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.put('/api/warehouses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const existingWarehouse = await storage.getWarehouse(id);
      if (!existingWarehouse) {
        return res.status(404).json({ error: true, message: "Warehouse not found" });
      }
      
      const updatedWarehouse = await storage.updateWarehouse(id, req.body);
      res.json(updatedWarehouse);
    } catch (error) {
      console.error('Error updating warehouse:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.delete('/api/warehouses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const result = await storage.deleteWarehouse(id);
      if (!result) {
        return res.status(404).json({ error: true, message: "Warehouse not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });

  // ==================
  // Inventory Routes
  // ==================
  app.get('/api/inventory', async (req, res) => {
    try {
      const warehouseId = req.query.warehouseId ? parseInt(req.query.warehouseId as string) : undefined;
      
      let inventoryItems;
      if (warehouseId && !isNaN(warehouseId)) {
        inventoryItems = await storage.getInventoryItemsForWarehouse(warehouseId);
      } else {
        inventoryItems = await storage.getInventoryItems();
      }
      
      res.json(inventoryItems);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.get('/api/inventory/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const inventoryItem = await storage.getInventoryItem(id);
      if (!inventoryItem) {
        return res.status(404).json({ error: true, message: "Inventory item not found" });
      }
      
      res.json(inventoryItem);
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.post('/api/inventory', validateRequest(insertInventorySchema), async (req, res) => {
    try {
      const inventoryItem = await storage.createInventoryItem(req.body);
      res.status(201).json(inventoryItem);
    } catch (error) {
      console.error('Error creating inventory item:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.put('/api/inventory/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const existingItem = await storage.getInventoryItem(id);
      if (!existingItem) {
        return res.status(404).json({ error: true, message: "Inventory item not found" });
      }
      
      const updatedItem = await storage.updateInventoryItem(id, req.body);
      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating inventory item:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.delete('/api/inventory/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const result = await storage.deleteInventoryItem(id);
      if (!result) {
        return res.status(404).json({ error: true, message: "Inventory item not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });

  // ==================
  // Shipment Routes
  // ==================
  app.get('/api/shipments', async (req, res) => {
    try {
      const shipments = await storage.getShipments();
      res.json(shipments);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.get('/api/shipments/:id', async (req, res) => {
    try {
      // Check if we're looking for a tracking number
      if (req.query.type === 'tracking') {
        const trackingNumber = req.params.id as string;
        const shipment = await storage.getShipmentByTrackingNumber(trackingNumber);
        if (!shipment) {
          return res.status(404).json({ error: true, message: "Shipment not found" });
        }
        return res.json(shipment);
      }
      
      // Otherwise, get by ID
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const shipment = await storage.getShipment(id);
      if (!shipment) {
        return res.status(404).json({ error: true, message: "Shipment not found" });
      }
      
      res.json(shipment);
    } catch (error) {
      console.error('Error fetching shipment:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.post('/api/shipments', validateRequest(insertShipmentSchema), async (req, res) => {
    try {
      const shipment = await storage.createShipment(req.body);
      res.status(201).json(shipment);
    } catch (error) {
      console.error('Error creating shipment:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.put('/api/shipments/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const existingShipment = await storage.getShipment(id);
      if (!existingShipment) {
        return res.status(404).json({ error: true, message: "Shipment not found" });
      }
      
      const updatedShipment = await storage.updateShipment(id, req.body);
      res.json(updatedShipment);
    } catch (error) {
      console.error('Error updating shipment:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.delete('/api/shipments/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const result = await storage.deleteShipment(id);
      if (!result) {
        return res.status(404).json({ error: true, message: "Shipment not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting shipment:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });

  // ==================
  // Route Routes
  // ==================
  app.get('/api/routes', async (req, res) => {
    try {
      const vehicleId = req.query.vehicleId ? parseInt(req.query.vehicleId as string) : undefined;
      
      let routes;
      if (vehicleId && !isNaN(vehicleId)) {
        routes = await storage.getRoutesByVehicle(vehicleId);
      } else {
        routes = await storage.getRoutes();
      }
      
      res.json(routes);
    } catch (error) {
      console.error('Error fetching routes:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.get('/api/routes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const route = await storage.getRoute(id);
      if (!route) {
        return res.status(404).json({ error: true, message: "Route not found" });
      }
      
      res.json(route);
    } catch (error) {
      console.error('Error fetching route:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.post('/api/routes', validateRequest(insertRouteSchema), async (req, res) => {
    try {
      const route = await storage.createRoute(req.body);
      res.status(201).json(route);
    } catch (error) {
      console.error('Error creating route:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.put('/api/routes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const existingRoute = await storage.getRoute(id);
      if (!existingRoute) {
        return res.status(404).json({ error: true, message: "Route not found" });
      }
      
      const updatedRoute = await storage.updateRoute(id, req.body);
      res.json(updatedRoute);
    } catch (error) {
      console.error('Error updating route:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  app.delete('/api/routes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
      }
      
      const result = await storage.deleteRoute(id);
      if (!result) {
        return res.status(404).json({ error: true, message: "Route not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting route:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });

  // Dashboard Summary Endpoint
  app.get('/api/dashboard/summary', async (req, res) => {
    try {
      // Get counts of various entities
      const vehicles = await storage.getVehicles();
      const warehouses = await storage.getWarehouses();
      const shipments = await storage.getShipments();
      const inventoryItems = await storage.getInventoryItems();
      
      // Calculate statistics
      const activeVehicles = vehicles.filter(v => v.status === 'active').length;
      const totalVehicles = vehicles.length;
      
      const activeShipments = shipments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled').length;
      const totalShipments = shipments.length;
      
      const warehouseCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
      const warehouseUsage = warehouses.reduce((sum, w) => sum + w.currentUsage, 0);
      const capacityUtilization = warehouseCapacity > 0 ? (warehouseUsage / warehouseCapacity) * 100 : 0;
      
      res.json({
        vehicleStats: {
          total: totalVehicles,
          active: activeVehicles,
          utilization: totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0
        },
        shipmentStats: {
          total: totalShipments,
          active: activeShipments,
          completed: shipments.filter(s => s.status === 'delivered').length
        },
        warehouseStats: {
          count: warehouses.length,
          capacityUtilization: capacityUtilization.toFixed(2),
          totalItems: inventoryItems.length
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });

  return httpServer;
}
