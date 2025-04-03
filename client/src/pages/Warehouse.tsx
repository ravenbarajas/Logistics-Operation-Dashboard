import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Progress 
} from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Warehouse as WarehouseIcon, 
  Search, 
  MoreHorizontal, 
  AlertTriangle, 
  Clock, 
  Boxes,
  ArrowRightLeft,
  Plus,
  Edit,
  Trash,
  RefreshCw,
  MapPin,
  Calendar,
  Package2
} from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie
} from 'recharts';

import { WarehouseModal } from "@/components/warehouse/WarehouseModal";
import { InventoryItemModal } from "@/components/inventory/InventoryItemModal";
import { warehouseService } from "@/services/warehouseService";
import { inventoryService } from "@/services/inventoryService";
import { Warehouse as WarehouseType, Inventory } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Import EnhancedTable
import { EnhancedTable } from "@/components/table/EnhancedTable";

// Inventory by category
const inventoryByCategory = [
  { name: 'Electronics', value: 65 },
  { name: 'Furniture', value: 15 },
  { name: 'Apparel', value: 10 },
  { name: 'Food & Beverage', value: 5 },
  { name: 'Office Supplies', value: 5 }
];

// Stock movement data
const stockMovement = [
  { month: 'Mar', inbound: 480, outbound: 420 },
  { month: 'Apr', inbound: 520, outbound: 450 },
  { month: 'May', inbound: 550, outbound: 500 },
  { month: 'Jun', inbound: 580, outbound: 520 },
  { month: 'Jul', inbound: 620, outbound: 580 },
  { month: 'Aug', inbound: 680, outbound: 620 },
];

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Warehouse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehousesData, setWarehousesData] = useState<WarehouseType[]>([]);
  const [inventoryItems, setInventoryItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType | undefined>();
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<Inventory | undefined>();
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<WarehouseType | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Inventory | null>(null);
  const [itemDeleteDialogOpen, setItemDeleteDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [warehousesData, inventoryItems] = await Promise.all([
        warehouseService.getWarehouses(),
        inventoryService.getInventoryItems()
      ]);
      setWarehousesData(warehousesData);
      setInventoryItems(inventoryItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddWarehouse = () => {
    setSelectedWarehouse(undefined);
    setWarehouseModalOpen(true);
  };

  const handleEditWarehouse = (warehouse: WarehouseType) => {
    setSelectedWarehouse(warehouse);
    setWarehouseModalOpen(true);
  };

  const handleDeleteWarehouse = (warehouse: WarehouseType) => {
    setWarehouseToDelete(warehouse);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteWarehouse = async () => {
    if (!warehouseToDelete) return;
    
    try {
      await warehouseService.deleteWarehouse(warehouseToDelete.id);
      await fetchData();
      setDeleteDialogOpen(false);
      setWarehouseToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete warehouse');
    }
  };

  const handleAddInventoryItem = () => {
    setSelectedInventoryItem(undefined);
    setInventoryModalOpen(true);
  };

  const handleEditInventoryItem = (item: Inventory) => {
    setSelectedInventoryItem(item);
    setInventoryModalOpen(true);
  };

  const handleDeleteInventoryItem = (item: Inventory) => {
    setItemToDelete(item);
    setItemDeleteDialogOpen(true);
  };

  const confirmDeleteInventoryItem = async () => {
    if (!itemToDelete) return;
    
    try {
      await inventoryService.deleteInventoryItem(itemToDelete.id);
      await fetchData();
      setItemDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete inventory item');
    }
  };

  const getWarehouseName = (id: number) => {
    const warehouse = warehousesData.find(w => w.id === id);
    return warehouse ? warehouse.name : 'Unknown';
  };

  // Filter inventory items based on search query
  const filteredInventory = inventoryItems.filter(item => 
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getWarehouseName(item.warehouseId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define columns for the warehouse table
  const warehouseColumns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      enableSorting: true,
      meta: {
        className: "w-[80px]"
      }
    },
    {
      id: "name",
      header: "Warehouse",
      accessorKey: "name",
      enableSorting: true,
      cell: (warehouse: WarehouseType) => (
        <div>
          <div className="font-medium flex items-center">
            <WarehouseIcon className="h-4 w-4 mr-2 text-primary" />
            {warehouse.name}
          </div>
        </div>
      )
    },
    {
      id: "location",
      header: "Location",
      accessorKey: "location",
      cell: (warehouse: WarehouseType) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          {warehouse.location && typeof warehouse.location === 'object' && 'lat' in warehouse.location && 'lng' in warehouse.location
            ? `${(warehouse.location.lat as number).toFixed(4)}, ${(warehouse.location.lng as number).toFixed(4)}`
            : 'N/A'}
        </div>
      )
    },
    {
      id: "capacity",
      header: "Capacity",
      accessorKey: "capacity",
      enableSorting: true,
      cell: (warehouse: WarehouseType) => (
        <div className="flex flex-col gap-1">
          <Progress value={(warehouse.currentUsage / warehouse.capacity) * 100} className="h-2" />
          <div className="flex justify-between text-xs">
            <span>{warehouse.currentUsage} used</span>
            <span>{Math.round((warehouse.currentUsage / warehouse.capacity) * 100)}%</span>
          </div>
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true
    }
  ];

  // Define actions for the warehouse table
  const warehouseActions = [
    {
      label: "Edit Warehouse",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEditWarehouse
    },
    {
      label: "Delete Warehouse",
      icon: <Trash className="h-4 w-4" />,
      onClick: handleDeleteWarehouse,
      variant: "destructive" as const
    }
  ];

  // Define columns for the inventory table
  const inventoryColumns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      enableSorting: true,
      meta: {
        className: "w-[80px]"
      }
    },
    {
      id: "itemName",
      header: "Item Name",
      accessorKey: "itemName",
      enableSorting: true,
      cell: (item: Inventory) => (
        <div>
          <div className="font-medium flex items-center">
            <Package2 className="h-4 w-4 mr-2 text-primary" />
            {item.itemName}
          </div>
        </div>
      )
    },
    {
      id: "warehouseId",
      header: "Warehouse",
      accessorKey: "warehouseId",
      enableSorting: true,
      cell: (item: Inventory) => (
        <div className="flex items-center">
          <WarehouseIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          {getWarehouseName(item.warehouseId)}
        </div>
      )
    },
    {
      id: "quantity",
      header: "Quantity",
      accessorKey: "quantity",
      enableSorting: true,
      cell: (item: Inventory) => (
        <div className="flex items-center gap-2">
          <span>{item.quantity}</span>
          <span className="text-xs text-muted-foreground">{item.unit || 'units'}</span>
        </div>
      )
    },
    {
      id: "lastUpdated",
      header: "Last Updated",
      accessorKey: "lastUpdated",
      enableSorting: true,
      cell: (item: Inventory) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {new Date(item.lastUpdated).toLocaleDateString()}
        </div>
      )
    }
  ];

  // Define actions for the inventory table
  const inventoryActions = [
    {
      label: "Edit Item",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEditInventoryItem
    },
    {
      label: "Delete Item",
      icon: <Trash className="h-4 w-4" />,
      onClick: handleDeleteInventoryItem,
      variant: "destructive" as const
    }
  ];

  // Status color map
  const statusColorMap = {
    active: { color: "green", label: "Active" },
    maintenance: { color: "amber", label: "Maintenance" },
    inactive: { color: "red", label: "Inactive" }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Warehouse Management</h1>
          <p className="text-muted-foreground">Inventory tracking and warehouse operations</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] md:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddWarehouse}>
            <Plus className="h-4 w-4 mr-2" />
            Add Warehouse
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <WarehouseIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Total</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{warehousesData.length}</h3>
              <p className="text-muted-foreground text-sm">Warehouses</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-muted-foreground text-sm">Total</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{inventoryItems.length}</h3>
              <p className="text-muted-foreground text-sm">Inventory Items</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <span className="text-muted-foreground text-sm">Alerts</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">3</h3>
              <p className="text-muted-foreground text-sm">Low Stock Items</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <ArrowRightLeft className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-muted-foreground text-sm">Today</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">28</h3>
              <p className="text-muted-foreground text-sm">Stock Movements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="warehouses" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="warehouses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <WarehouseIcon className="h-5 w-5 mr-2 text-primary" />
                  Warehouses
                </CardTitle>
                <CardDescription>Manage your warehouses and storage facilities</CardDescription>
              </div>
              <Button onClick={handleAddWarehouse}>
                <Plus className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>
            </CardHeader>
            <CardContent>
              <EnhancedTable
                data={warehousesData}
                columns={warehouseColumns}
                actions={warehouseActions}
                searchKey="name"
                searchPlaceholder="Search warehouses..."
                statusKey="status"
                statusMap={statusColorMap}
                emptyMessage={loading ? "Loading warehouses..." : error ? error : "No warehouses found. Add one to get started."}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Boxes className="h-5 w-5 mr-2 text-primary" />
                  Inventory Items
                </CardTitle>
                <CardDescription>Track and manage all inventory across warehouses</CardDescription>
              </div>
              <Button onClick={handleAddInventoryItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <EnhancedTable
                data={filteredInventory}
                columns={inventoryColumns}
                actions={inventoryActions}
                searchKey="itemName"
                searchPlaceholder="Search inventory items..."
                emptyMessage={loading ? "Loading inventory..." : error ? error : searchQuery ? "No items match your search." : "No inventory items found."}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="operations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
                <CardDescription>Distribution of items across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {inventoryByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement</CardTitle>
                <CardDescription>Inbound vs outbound inventory over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stockMovement}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inbound" name="Inbound" fill="#0088FE" />
                      <Bar dataKey="outbound" name="Outbound" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <WarehouseModal
        isOpen={warehouseModalOpen}
        onClose={() => setWarehouseModalOpen(false)}
        warehouse={selectedWarehouse}
        onSuccess={fetchData}
      />
      
      <InventoryItemModal
        isOpen={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
        item={selectedInventoryItem}
        onSuccess={fetchData}
      />

      {/* Delete dialogs */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the warehouse
              {warehouseToDelete && ` "${warehouseToDelete.name}"`} and all associated inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteWarehouse}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={itemDeleteDialogOpen} onOpenChange={setItemDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the inventory item
              {itemToDelete && ` "${itemToDelete.itemName}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInventoryItem}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}