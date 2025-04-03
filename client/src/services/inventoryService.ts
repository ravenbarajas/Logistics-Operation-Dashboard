import { Inventory } from '@shared/schema';

// Mock data for inventory
let mockInventory: Inventory[] = [
  {
    id: 1,
    warehouseId: 1,
    itemName: 'Laptop Computers',
    quantity: 250,
    unit: 'units',
    lastUpdated: new Date('2023-11-10')
  },
  {
    id: 2,
    warehouseId: 1,
    itemName: 'Office Chairs',
    quantity: 120,
    unit: 'units',
    lastUpdated: new Date('2023-11-15')
  },
  {
    id: 3,
    warehouseId: 2,
    itemName: 'Smartphones',
    quantity: 500,
    unit: 'units',
    lastUpdated: new Date('2023-11-20')
  },
  {
    id: 4,
    warehouseId: 2,
    itemName: 'Headphones',
    quantity: 300,
    unit: 'units',
    lastUpdated: new Date('2023-11-25')
  },
  {
    id: 5,
    warehouseId: 3,
    itemName: 'Computer Monitors',
    quantity: 150,
    unit: 'units',
    lastUpdated: new Date('2023-11-15')
  },
  {
    id: 6,
    warehouseId: 3,
    itemName: 'Keyboards',
    quantity: 200,
    unit: 'units',
    lastUpdated: new Date('2023-11-12')
  },
  {
    id: 7,
    warehouseId: 4,
    itemName: 'Printers',
    quantity: 80,
    unit: 'units',
    lastUpdated: new Date('2023-11-18')
  },
  {
    id: 8,
    warehouseId: 5,
    itemName: 'USB Drives',
    quantity: 1000,
    unit: 'units',
    lastUpdated: new Date('2023-11-22')
  }
];

export interface InventorySummary {
  totalItems: number;
  totalQuantity: number;
  itemsByWarehouse: Record<number, number>;
  lowStockItems: number;
}

export const inventoryService = {
  async getInventorySummary(): Promise<InventorySummary> {
    const totalItems = mockInventory.length;
    const totalQuantity = mockInventory.reduce((sum, item) => sum + item.quantity, 0);
    
    // Group items by warehouse
    const itemsByWarehouse: Record<number, number> = {};
    mockInventory.forEach(item => {
      if (!itemsByWarehouse[item.warehouseId]) {
        itemsByWarehouse[item.warehouseId] = 0;
      }
      itemsByWarehouse[item.warehouseId]++;
    });
    
    // Simulate low stock (items with quantity less than 100)
    const lowStockItems = mockInventory.filter(item => item.quantity < 100).length;

    return {
      totalItems,
      totalQuantity,
      itemsByWarehouse,
      lowStockItems
    };
  },

  async getInventoryItems(): Promise<Inventory[]> {
    return [...mockInventory];
  },

  async getInventoryItemsForWarehouse(warehouseId: number): Promise<Inventory[]> {
    return mockInventory.filter(item => item.warehouseId === warehouseId);
  },

  async getInventoryItem(id: number): Promise<Inventory> {
    const item = mockInventory.find(item => item.id === id);
    if (!item) {
      throw new Error('Inventory item not found');
    }
    return { ...item };
  },

  async createInventoryItem(item: Omit<Inventory, 'id'>): Promise<Inventory> {
    const newId = Math.max(0, ...mockInventory.map(item => item.id)) + 1;
    const newItem: Inventory = {
      ...item,
      id: newId,
      lastUpdated: new Date()
    };
    
    mockInventory.push(newItem);
    return { ...newItem };
  },

  async updateInventoryItem(id: number, item: Partial<Inventory>): Promise<Inventory> {
    const index = mockInventory.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Inventory item not found');
    }
    
    const updatedItem = {
      ...mockInventory[index],
      ...item,
      lastUpdated: new Date()
    };
    
    mockInventory[index] = updatedItem;
    return { ...updatedItem };
  },

  async deleteInventoryItem(id: number): Promise<void> {
    const index = mockInventory.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Inventory item not found');
    }
    
    mockInventory.splice(index, 1);
  },
}; 