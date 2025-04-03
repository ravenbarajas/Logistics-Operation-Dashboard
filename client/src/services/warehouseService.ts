import { Warehouse } from '@shared/schema';

// Mock data for warehouses
let mockWarehouses: Warehouse[] = [
  {
    id: 1,
    name: 'West Coast Distribution Center',
    location: { lat: 37.7749, lng: -122.4194 },
    capacity: 10000,
    currentUsage: 7500,
    status: 'active',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-10-20')
  },
  {
    id: 2,
    name: 'East Coast Hub',
    location: { lat: 40.7128, lng: -74.0060 },
    capacity: 15000,
    currentUsage: 10200,
    status: 'active',
    createdAt: new Date('2023-02-12'),
    updatedAt: new Date('2023-11-05')
  },
  {
    id: 3,
    name: 'Midwest Storage Facility',
    location: { lat: 41.8781, lng: -87.6298 },
    capacity: 8000,
    currentUsage: 4800,
    status: 'active',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-09-15')
  },
  {
    id: 4,
    name: 'Southern Distribution Center',
    location: { lat: 29.7604, lng: -95.3698 },
    capacity: 12000,
    currentUsage: 6000,
    status: 'maintenance',
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 5,
    name: 'Pacific Northwest Facility',
    location: { lat: 47.6062, lng: -122.3321 },
    capacity: 7500,
    currentUsage: 5200,
    status: 'active',
    createdAt: new Date('2023-05-18'),
    updatedAt: new Date('2023-10-30')
  }
];

export interface WarehouseSummary {
  totalWarehouses: number;
  activeWarehouses: number;
  totalCapacity: number;
  usedCapacity: number;
  utilizationPercentage: number;
}

export const warehouseService = {
  async getWarehouseSummary(): Promise<WarehouseSummary> {
    const totalWarehouses = mockWarehouses.length;
    const activeWarehouses = mockWarehouses.filter(w => w.status === 'active').length;
    const totalCapacity = mockWarehouses.reduce((sum, w) => sum + w.capacity, 0);
    const usedCapacity = mockWarehouses.reduce((sum, w) => sum + w.currentUsage, 0);
    const utilizationPercentage = Math.round((usedCapacity / totalCapacity) * 100);

    return {
      totalWarehouses,
      activeWarehouses,
      totalCapacity,
      usedCapacity,
      utilizationPercentage
    };
  },

  async getWarehouses(): Promise<Warehouse[]> {
    return [...mockWarehouses];
  },

  async getWarehouse(id: number): Promise<Warehouse> {
    const warehouse = mockWarehouses.find(w => w.id === id);
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    return { ...warehouse };
  },

  async createWarehouse(warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warehouse> {
    const newId = Math.max(0, ...mockWarehouses.map(w => w.id)) + 1;
    const now = new Date();
    const newWarehouse: Warehouse = {
      ...warehouse,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    
    mockWarehouses.push(newWarehouse);
    return { ...newWarehouse };
  },

  async updateWarehouse(id: number, warehouse: Partial<Warehouse>): Promise<Warehouse> {
    const index = mockWarehouses.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error('Warehouse not found');
    }
    
    const now = new Date();
    const updatedWarehouse = {
      ...mockWarehouses[index],
      ...warehouse,
      updatedAt: now
    };
    
    mockWarehouses[index] = updatedWarehouse;
    return { ...updatedWarehouse };
  },

  async deleteWarehouse(id: number): Promise<void> {
    const index = mockWarehouses.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error('Warehouse not found');
    }
    
    mockWarehouses.splice(index, 1);
  },
}; 