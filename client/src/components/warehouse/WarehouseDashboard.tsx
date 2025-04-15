import React, { useState, useEffect } from "react";
import { InventorySummaryCards } from "@/components/warehouse/InventorySummaryCards";
import { InventoryCategoryChart } from "@/components/warehouse/InventoryCategoryChart";
import { StockMovementChart } from "@/components/warehouse/StockMovementChart";
import { WarehouseOperationsTabs } from "@/components/warehouse/WarehouseOperationsTabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { warehouseService } from "@/services/warehouseService";
import { inventoryService } from "@/services/inventoryService";
import { Plus, RefreshCw } from "lucide-react";

// Inventory by category data example
const inventoryByCategory = [
  { name: 'Electronics', value: 65 },
  { name: 'Furniture', value: 15 },
  { name: 'Apparel', value: 10 },
  { name: 'Food & Beverage', value: 5 },
  { name: 'Office Supplies', value: 5 }
];

// Stock movement data example
const stockMovement = [
  { month: 'Mar', inbound: 480, outbound: 420 },
  { month: 'Apr', inbound: 520, outbound: 450 },
  { month: 'May', inbound: 550, outbound: 500 },
  { month: 'Jun', inbound: 580, outbound: 520 },
  { month: 'Jul', inbound: 620, outbound: 580 },
  { month: 'Aug', inbound: 680, outbound: 620 },
];

export default function WarehouseDashboard() {
  const [warehouseList, setWarehouseList] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Summary stats for the dashboard
  const totalInventoryValue = 1250000; // Example fixed value
  const avgUtilization = 82.5; // Example value
  const totalItems = inventoryItems.length;
  const fulfillmentRate = 94.8; // Example value

  // Track stats changes for UI indicators
  const inventoryValueChange = 5.2;
  const spaceUtilizationChange = 1.8;
  const totalItemsChange = 24;
  const fulfillmentRateChange = -0.3;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [warehousesData, inventoryData] = await Promise.all([
        warehouseService.getWarehouses(),
        inventoryService.getInventoryItems()
      ]);
      setWarehouseList(warehousesData);
      setInventoryItems(inventoryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-500 mb-2">Error Loading Data</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create warehouse content for the tabs
  const warehouseContent = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-background border-b">
        <div>
          <CardTitle className="text-xl">Warehouses</CardTitle>
          <CardDescription>Manage your warehouses and storage facilities</CardDescription>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </CardHeader>
      <CardContent>
        {/* Warehouse content would be implemented here */}
        <p className="text-center py-6 text-muted-foreground">Warehouse management interface would be displayed here.</p>
      </CardContent>
    </Card>
  );

  // Create inventory content for the tabs
  const inventoryContent = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-background border-b">
        <div>
          <CardTitle className="text-xl">Inventory Items</CardTitle>
          <CardDescription>Track and manage all inventory across warehouses</CardDescription>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        {/* Inventory content would be implemented here */}
        <p className="text-center py-6 text-muted-foreground">Inventory management interface would be displayed here.</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Warehouse Management</h1>
        <div className="flex gap-2 items-center">
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <InventorySummaryCards
        totalInventoryValue={totalInventoryValue}
        spaceUtilization={avgUtilization}
        totalItems={totalItems}
        fulfillmentRate={fulfillmentRate}
        inventoryValueChange={inventoryValueChange}
        spaceUtilizationChange={spaceUtilizationChange}
        totalItemsChange={totalItemsChange}
        fulfillmentRateChange={fulfillmentRateChange}
      />
      
      {/* Warehouse Operations Section */}
      <WarehouseOperationsTabs
        warehouseData={warehouseList}
        inventoryData={inventoryItems}
        warehouseContent={warehouseContent}
        inventoryContent={inventoryContent}
      />
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <InventoryCategoryChart data={inventoryByCategory} />
        <StockMovementChart data={stockMovement} />
      </div>
    </div>
  );
} 