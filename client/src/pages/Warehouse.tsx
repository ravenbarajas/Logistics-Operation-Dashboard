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
  Package2,
  DollarSign,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  Filter,
  Download,
  Split,
  Map,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  BarChart3,
  ShoppingCart,
  BarChart4,
  BarChart2,
  ShieldCheck,
  GalleryThumbnails,
  SquareStack,
  Users,
  Shield,
  FileSpreadsheet,
  FileText,
  Activity,
  Copy,
  Trash2,
  Loader2,
  Timer
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
  Pie,
  LineChart,
  Line,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Label
} from "@/components/ui/label";
import {
  Checkbox
} from "@/components/ui/checkbox";

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

// Define an interface for the warehouse data
interface Warehouse {
  id: number;
  name: string;
  location: unknown;
  capacity: number;
  currentUsage: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  itemName?: string;
  warehouseId?: number;
  quantity?: number;
  inventoryValue?: number;
  utilization?: number;
}

export default function Warehouse() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | undefined>(undefined);
  const [warehouseList, setWarehouseList] = useState<WarehouseType[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<WarehouseType[]>([]);
  const [inventoryItems, setInventoryItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
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
      const [warehousesData, inventoryData] = await Promise.all([
        warehouseService.getWarehouses(),
        inventoryService.getInventoryItems()
      ]);
      setWarehouseList(warehousesData);
      setFilteredWarehouses(warehousesData);
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
    const warehouse = warehouseList.find(w => w.id === id);
    return warehouse ? warehouse.name : 'Unknown';
  };

  // Filter inventory items based on search query
  const filteredInventory = inventoryItems.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getWarehouseName(item.warehouseId).toLowerCase().includes(searchTerm.toLowerCase())
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

  // Calculate warehouse statistics
  const totalWarehouses = warehouseList.length;
  const totalInventoryItems = filteredInventory.length;
  const totalInventoryUnits = filteredInventory.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate average warehouse utilization
  const totalCapacity = warehouseList.reduce((total, wh) => total + (wh.capacity || 0), 0);
  const totalUtilization = warehouseList.reduce((total, wh) => total + (wh.currentUsage || 0), 0);
  const avgUtilization = totalWarehouses > 0 ? Math.round((totalUtilization / totalCapacity) * 100) / 100 : 0;

  // Summary metrics calculation
  // Using a fixed sample value since we don't have actual inventory value data
  const totalInventoryValue = 1250000; // Example fixed value
  
  const averageUtilizationPercentage = avgUtilization * 100;
  
  const totalItems = totalInventoryItems;
  
  const fulfillmentRate = 94.8; // Example value, could be calculated from actual data
  
  // Warehouse stock status counts
  const lowStockItems = 42;
  const optimalStockItems = 325;
  const overstockItems = 86;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Warehouse Management</h1>
        <div className="flex gap-2 items-center">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Warehouse
          </Button>
          <Button variant="outline" onClick={() => setWarehouseList(warehouseList)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
            <div className="flex items-center">
              <ArrowUp className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">Space Utilization</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold">{averageUtilizationPercentage.toFixed(1)}%</div>
            <div className="flex items-center">
              <ArrowUp className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">+1.8% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">Total Inventory Items</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
            <div className="flex items-center">
              <ArrowUp className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">+24 new items this month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">Order Fulfillment Rate</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold">{fulfillmentRate}%</div>
            <div className="flex items-center">
              <ArrowDown className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">-0.3% from last week</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Warehouse Operations Section */}
      <Tabs defaultValue="warehouses" className="mb-6 space-y-6">
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
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
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>
            </CardHeader>
            <CardContent>
              <EnhancedTable
                data={warehouseList}
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
                emptyMessage={loading ? "Loading inventory..." : error ? error : searchTerm ? "No items match your search." : "No inventory items found."}
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

      {/* Warehouse Operations Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Warehouse Operations</CardTitle>
              <CardDescription>Efficiency metrics and performance tracking for warehouse activities</CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select defaultValue="week">
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="picking" className="w-full p-4">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="picking">
                <GalleryThumbnails className="h-4 w-4 mr-2" />
                Picking & Packing
              </TabsTrigger>
              <TabsTrigger value="space">
                <SquareStack className="h-4 w-4 mr-2" />
                Space Utilization
              </TabsTrigger>
              <TabsTrigger value="workforce">
                <Users className="h-4 w-4 mr-2" />
                Workforce
              </TabsTrigger>
              <TabsTrigger value="safety">
                <Shield className="h-4 w-4 mr-2" />
                Safety & Compliance
              </TabsTrigger>
            </TabsList>
            
            {/* Picking & Packing Tab */}
            <TabsContent value="picking" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-0 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Picking Efficiency</CardTitle>
                    <CardDescription>Items picked per hour by section</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { section: "Electronics", current: 42, target: 45, previous: 38 },
                          { section: "Clothing", current: 68, target: 65, previous: 62 },
                          { section: "Home Goods", current: 53, target: 55, previous: 50 },
                          { section: "Appliances", current: 32, target: 35, previous: 30 },
                          { section: "Sports", current: 48, target: 50, previous: 45 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="section" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="current" name="Current Rate" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="previous" name="Previous Period" fill="#93c5fd" radius={[0, 4, 4, 0]} />
                        <ReferenceLine x={50} stroke="#10b981" label={{ value: 'Target', position: 'top', fill: '#10b981' }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Order Fulfillment Timeline</CardTitle>
                    <CardDescription>Time spent at each stage of order processing</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { stage: "Order Receipt", time: 5, target: 5 },
                          { stage: "Order Verification", time: 12, target: 10 },
                          { stage: "Picking", time: 28, target: 25 },
                          { stage: "Quality Check", time: 8, target: 10 },
                          { stage: "Packing", time: 15, target: 15 },
                          { stage: "Shipping Prep", time: 10, target: 10 },
                          { stage: "Handoff to Carrier", time: 12, target: 10 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="stage" />
                        <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="time" 
                          name="Actual Time (min)" 
                          fill="#3b82f6" 
                          radius={[4, 4, 0, 0]}
                          background={{ fill: '#eee' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="target" 
                          name="Target Time (min)" 
                          stroke="#f59e0b" 
                          strokeWidth={2} 
                          dot={{ r: 4 }} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="pb-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Picking & Packing Performance</CardTitle>
                    <CardDescription>Daily performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Shift</TableHead>
                            <TableHead>Items Picked</TableHead>
                            <TableHead>Orders Packed</TableHead>
                            <TableHead>Pick Rate</TableHead>
                            <TableHead>Pack Rate</TableHead>
                            <TableHead>Accuracy</TableHead>
                            <TableHead>Efficiency</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { shift: "Morning (6am-2pm)", picked: 1250, packed: 350, pickRate: 156, packRate: 44, accuracy: 99.2, efficiency: 95.8 },
                            { shift: "Afternoon (2pm-10pm)", picked: 1420, packed: 395, pickRate: 178, packRate: 49, accuracy: 98.7, efficiency: 97.2 },
                            { shift: "Night (10pm-6am)", picked: 980, packed: 280, pickRate: 123, packRate: 35, accuracy: 99.4, efficiency: 94.5 },
                            { shift: "Weekend", picked: 850, packed: 240, pickRate: 106, packRate: 30, accuracy: 98.9, efficiency: 93.2 },
                          ].map((shift, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{shift.shift}</TableCell>
                              <TableCell>{shift.picked}</TableCell>
                              <TableCell>{shift.packed}</TableCell>
                              <TableCell>{shift.pickRate}/hr</TableCell>
                              <TableCell>{shift.packRate}/hr</TableCell>
                              <TableCell>{shift.accuracy}%</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={shift.efficiency} className="h-2 w-24" />
                                  <span>{shift.efficiency}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Space Utilization Tab */}
            <TabsContent value="space" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-0 mb-4">
                <Card className="col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Warehouse Space Utilization</CardTitle>
                    <CardDescription>Current space usage by storage type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: "Rack Storage", used: 85, capacity: 100, efficiency: 85 },
                          { type: "Bin Storage", used: 450, capacity: 500, efficiency: 90 },
                          { type: "Floor Storage", used: 1200, capacity: 1500, efficiency: 80 },
                          { type: "Mezzanine", used: 250, capacity: 300, efficiency: 83 },
                          { type: "Cold Storage", used: 180, capacity: 200, efficiency: 90 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="used" name="Used Space (m²)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="capacity" name="Total Capacity (m²)" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Space Efficiency</CardTitle>
                    <CardDescription>Storage area utilization %</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Optimal (80-90%)", value: 60, fill: "#10b981" },
                            { name: "Under-utilized (<80%)", value: 15, fill: "#f59e0b" },
                            { name: "Over-utilized (>90%)", value: 25, fill: "#ef4444" }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip formatter={(value) => [`${value}%`, 'Storage Areas']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="pb-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Storage Area Heatmap</CardTitle>
                    <CardDescription>Visualizing warehouse space utilization density</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted h-80 rounded-md flex items-center justify-center relative overflow-hidden">
                      <div className="w-full h-full p-4">
                        <div className="grid grid-cols-6 grid-rows-4 gap-2 h-full">
                          {Array.from({ length: 24 }).map((_, i) => {
                            const utilization = Math.floor(70 + Math.random() * 30);
                            let bgColor = "bg-green-200 dark:bg-green-900/30";
                            
                            if (utilization > 90) {
                              bgColor = "bg-red-200 dark:bg-red-900/30";
                            } else if (utilization > 80) {
                              bgColor = "bg-amber-200 dark:bg-amber-900/30";
                            }
                            
                            return (
                              <div 
                                key={i} 
                                className={`${bgColor} rounded-md flex flex-col items-center justify-center p-2 text-center`}
                              >
                                <span className="text-xs">Zone {String.fromCharCode(65 + Math.floor(i / 6))}{i % 6 + 1}</span>
                                <span className="font-bold text-sm">{utilization}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-green-200 dark:bg-green-900/30 rounded-sm"></div>
                          <span>Optimal (&lt;80%)</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-amber-200 dark:bg-amber-900/30 rounded-sm"></div>
                          <span>Warning (80-90%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-200 dark:bg-red-900/30 rounded-sm"></div>
                          <span>Critical (&gt;90%)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Workforce Tab */}
            <TabsContent value="workforce" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-0 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Labor Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87.3%</div>
                    <Progress value={87.3} className="h-2 mt-2" />
                    <div className="flex items-center mt-2">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">1.8% from last month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Staff Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">91.2%</div>
                    <Progress value={91.2} className="h-2 mt-2" />
                    <div className="flex items-center mt-2">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">2.4% from last month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">168</div>
                    <div className="flex items-center mt-2">
                      <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">12% from last month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Staff Absence Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <Progress value={3.2} max={10} className="h-2 mt-2" />
                    <div className="flex items-center mt-2">
                      <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">0.5% from last month</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Staff Productivity</CardTitle>
                    <CardDescription>Units processed per hour by department</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { department: "Receiving", current: 38, target: 40, previous: 35 },
                          { department: "Picking", current: 52, target: 50, previous: 48 },
                          { department: "Packing", current: 45, target: 45, previous: 42 },
                          { department: "Shipping", current: 58, target: 55, previous: 53 },
                          { department: "Returns", current: 32, target: 35, previous: 30 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="department" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="current" name="Current Rate" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="previous" name="Previous Period" fill="#93c5fd" radius={[0, 4, 4, 0]} />
                        <ReferenceLine x={45} stroke="#10b981" label={{ value: 'Target Avg', position: 'top', fill: '#10b981' }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Workforce Allocation</CardTitle>
                    <CardDescription>Staff distribution by department and shift</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { shift: "Morning", receiving: 12, picking: 25, packing: 18, shipping: 15, returns: 8 },
                          { shift: "Afternoon", receiving: 10, picking: 22, packing: 20, shipping: 12, returns: 6 },
                          { shift: "Night", receiving: 6, picking: 15, packing: 12, shipping: 8, returns: 4 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="shift" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="receiving" name="Receiving" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="picking" name="Picking" stackId="a" fill="#10b981" />
                        <Bar dataKey="packing" name="Packing" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="shipping" name="Shipping" stackId="a" fill="#8b5cf6" />
                        <Bar dataKey="returns" name="Returns" stackId="a" fill="#ec4899" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="pb-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Staff Performance Metrics</CardTitle>
                    <CardDescription>Individual performance ratings and metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Productivity</TableHead>
                            <TableHead>Accuracy</TableHead>
                            <TableHead>Attendance</TableHead>
                            <TableHead>Training</TableHead>
                            <TableHead>Overall</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { name: "James Wilson", department: "Picking", productivity: 94, accuracy: 98, attendance: 100, training: 85 },
                            { name: "Sarah Johnson", department: "Packing", productivity: 102, accuracy: 99, attendance: 96, training: 90 },
                            { name: "Michael Lee", department: "Receiving", productivity: 86, accuracy: 92, attendance: 98, training: 95 },
                            { name: "Emma Davis", department: "Shipping", productivity: 110, accuracy: 97, attendance: 94, training: 80 },
                            { name: "Robert Garcia", department: "Returns", productivity: 88, accuracy: 95, attendance: 100, training: 85 },
                          ].map((employee, index) => {
                            const overall = Math.round((employee.productivity * 0.4 + employee.accuracy * 0.3 + employee.attendance * 0.2 + employee.training * 0.1) / 100 * 100);
                            
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.department}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress 
                                      value={employee.productivity} 
                                      max={120}
                                      className="h-2 w-16" 
                                    />
                                    <span className={employee.productivity >= 100 ? "text-green-500" : ""}>{employee.productivity}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={employee.accuracy} className="h-2 w-16" />
                                    <span>{employee.accuracy}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={employee.attendance} className="h-2 w-16" />
                                    <span>{employee.attendance}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={employee.training} className="h-2 w-16" />
                                    <span>{employee.training}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress 
                                      value={overall} 
                                      className={`h-2 w-16 ${
                                        overall >= 95 ? "bg-green-500" : 
                                        overall >= 85 ? "bg-amber-500" : 
                                        "bg-red-500"
                                      }`} 
                                    />
                                    <span className="font-bold">{overall}%</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Safety & Compliance Tab */}
            <TabsContent value="safety" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-0 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94.5%</div>
                    <Progress value={94.5} className="h-2 mt-2" />
                    <div className="flex items-center mt-2">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">2.1% from last quarter</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Days Since Last Incident</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78</div>
                    <div className="flex items-center mt-2">
                      <Shield className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">Previous record: 63 days</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98.2%</div>
                    <Progress value={98.2} className="h-2 mt-2" />
                    <div className="flex items-center mt-2">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">0.7% from last audit</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Open Safety Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <div className="flex items-center mt-2">
                      <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">3 fewer than last month</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Incident Types</CardTitle>
                    <CardDescription>Last 12 months breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Slip/Fall", value: 12, fill: "#3b82f6" },
                            { name: "Manual Handling", value: 18, fill: "#10b981" },
                            { name: "Equipment", value: 8, fill: "#f59e0b" },
                            { name: "Vehicle", value: 5, fill: "#8b5cf6" },
                            { name: "Other", value: 3, fill: "#ec4899" }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip formatter={(value) => [`${value} incidents`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Incidents Over Time</CardTitle>
                    <CardDescription>Monthly incident count and severity</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={[
                          { month: 'Aug', incidents: 6, nearMiss: 12, severity: 2.1 },
                          { month: 'Sep', incidents: 4, nearMiss: 8, severity: 1.8 },
                          { month: 'Oct', incidents: 7, nearMiss: 15, severity: 2.2 },
                          { month: 'Nov', incidents: 5, nearMiss: 10, severity: 1.9 },
                          { month: 'Dec', incidents: 3, nearMiss: 7, severity: 1.5 },
                          { month: 'Jan', incidents: 5, nearMiss: 11, severity: 1.7 },
                          { month: 'Feb', incidents: 4, nearMiss: 9, severity: 1.6 },
                          { month: 'Mar', incidents: 2, nearMiss: 6, severity: 1.3 },
                          { month: 'Apr', incidents: 3, nearMiss: 8, severity: 1.4 },
                          { month: 'May', incidents: 2, nearMiss: 5, severity: 1.2 },
                          { month: 'Jun', incidents: 1, nearMiss: 4, severity: 1.0 },
                          { month: 'Jul', incidents: 2, nearMiss: 6, severity: 1.1 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 3]} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="incidents" name="Incidents" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="left" dataKey="nearMiss" name="Near Misses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="severity" name="Avg Severity (1-5)" stroke="#3b82f6" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Compliance Audit Results</CardTitle>
                    <CardDescription>Latest compliance status by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { category: "Fire Safety", score: 97, items: 18, open: 1 },
                        { category: "Chemical Storage", score: 100, items: 12, open: 0 },
                        { category: "Equipment Safety", score: 95, items: 24, open: 2 },
                        { category: "Emergency Procedures", score: 98, items: 15, open: 1 },
                        { category: "Personal Protective Equipment", score: 99, items: 10, open: 0 },
                        { category: "Ergonomics", score: 96, items: 8, open: 1 },
                        { category: "Material Handling", score: 98, items: 14, open: 1 },
                        { category: "Training Documentation", score: 100, items: 20, open: 0 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-1/4">
                            <p className="text-sm font-medium">{item.category}</p>
                          </div>
                          <div className="w-1/4">
                            <Progress 
                              value={item.score} 
                              className="h-2" 
                            />
                          </div>
                          <div className="w-1/4 flex justify-between items-center pl-4">
                            <p className={`text-sm font-bold ${
                              item.score >= 95 ? "text-green-500" : 
                              item.score >= 90 ? "text-amber-500" : 
                              "text-red-500"
                            }`}>{item.score}%</p>
                          </div>
                          <div className="w-1/4 flex justify-end">
                            <Badge variant={item.open > 0 ? "outline" : "secondary"}>
                              {item.open} open of {item.items}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Safety Training Status</CardTitle>
                    <CardDescription>Employee training compliance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-500">92%</div>
                          <div className="text-sm text-muted-foreground">Fully Trained</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-amber-500">6%</div>
                          <div className="text-sm text-muted-foreground">Training Due</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-500">2%</div>
                          <div className="text-sm text-muted-foreground">Overdue</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Training Module</TableHead>
                            <TableHead>Completion Rate</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { module: "General Safety", rate: 100, updated: "May 12, 2023", status: "Compliant" },
                            { module: "Equipment Operation", rate: 95, updated: "Jun 03, 2023", status: "Compliant" },
                            { module: "Hazardous Materials", rate: 98, updated: "Apr 28, 2023", status: "Compliant" },
                            { module: "Emergency Response", rate: 94, updated: "Jun 15, 2023", status: "Attention Needed" },
                            { module: "Ergonomics", rate: 88, updated: "Mar 22, 2023", status: "Action Required" }
                          ].map((training, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{training.module}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress 
                                    value={training.rate} 
                                    className={`h-2 w-24 ${
                                      training.rate >= 95 ? "" : 
                                      training.rate >= 90 ? "bg-amber-500" : 
                                      "bg-red-500"
                                    }`}
                                  />
                                  <span>{training.rate}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{training.updated}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  training.status === "Compliant" ? "default" : 
                                  training.status === "Attention Needed" ? "outline" : 
                                  "destructive"
                                }>
                                  {training.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Warehouse Analytics Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Warehouse Analytics</CardTitle>
              <CardDescription>Comprehensive data analysis and reporting for warehouse operations</CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select defaultValue="quarter">
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" className="h-9">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="kpis" className="w-full p-4">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="kpis">
                <Activity className="h-4 w-4 mr-2" />
                Operational KPIs
              </TabsTrigger>
              <TabsTrigger value="costs">
                <DollarSign className="h-4 w-4 mr-2" />
                Cost Analysis
              </TabsTrigger>
              <TabsTrigger value="trends">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trend Analysis
              </TabsTrigger>
              <TabsTrigger value="reports">
                <FileText className="h-4 w-4 mr-2" />
                Custom Reports
              </TabsTrigger>
            </TabsList>
            
            {/* Operational KPIs Tab */}
            <TabsContent value="kpis" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-0 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Order Fulfillment Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94.8%</div>
                    <Progress value={94.8} className="h-2 mt-2" />
                    <div className="flex items-center mt-2">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">2.3% from last period</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">97.6%</div>
                    <Progress value={97.6} className="h-2 mt-2" />
                    <div className="flex items-center mt-2">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">0.8% from last period</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Picking Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">99.2%</div>
                    <Progress value={99.2} className="h-2 mt-2" />
                    <div className="flex items-center mt-2">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">0.3% from last period</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">On-Time Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92.5%</div>
                    <Progress value={92.5} className="h-2 mt-2" />
                    <div className="flex items-center mt-2">
                      <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
                      <p className="text-xs text-red-500">1.2% from last period</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">KPI Performance Trends</CardTitle>
                    <CardDescription>Tracking key metrics over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', fulfillment: 91.2, accuracy: 96.5, picking: 98.8, shipping: 93.5 },
                          { month: 'Feb', fulfillment: 92.0, accuracy: 96.8, picking: 98.9, shipping: 94.0 },
                          { month: 'Mar', fulfillment: 92.5, accuracy: 97.0, picking: 99.0, shipping: 93.8 },
                          { month: 'Apr', fulfillment: 93.1, accuracy: 97.2, picking: 99.1, shipping: 93.5 },
                          { month: 'May', fulfillment: 93.8, accuracy: 97.4, picking: 99.0, shipping: 94.2 },
                          { month: 'Jun', fulfillment: 94.5, accuracy: 97.5, picking: 99.2, shipping: 94.8 },
                          { month: 'Jul', fulfillment: 94.8, accuracy: 97.6, picking: 99.2, shipping: 92.5 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[90, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="fulfillment" name="Order Fulfillment" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="accuracy" name="Inventory Accuracy" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="picking" name="Picking Accuracy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="shipping" name="On-Time Shipping" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Warehouse KPI Scorecard</CardTitle>
                    <CardDescription>Performance summary across all metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Order Fulfillment Rate", value: 94.8, target: 95, status: "good" },
                        { name: "Inventory Accuracy", value: 97.6, target: 98, status: "good" },
                        { name: "Picking Accuracy", value: 99.2, target: 99, status: "good" },
                        { name: "On-Time Shipping", value: 92.5, target: 95, status: "warning" },
                        { name: "Space Utilization", value: 82.5, target: 85, status: "good" },
                        { name: "Labor Efficiency", value: 88.4, target: 90, status: "warning" },
                        { name: "Equipment Utilization", value: 76.2, target: 80, status: "warning" },
                        { name: "Inventory Turnover", value: 9.2, target: 8, status: "good" },
                        { name: "Perfect Order Rate", value: 91.5, target: 95, status: "warning" },
                      ].map((kpi, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-1/3">
                            <p className="text-sm font-medium">{kpi.name}</p>
                          </div>
                          <div className="w-1/3">
                            <Progress 
                              value={(kpi.value / kpi.target) * 100 > 100 ? 100 : (kpi.value / kpi.target) * 100} 
                              className="h-2" 
                            />
                          </div>
                          <div className="w-1/3 flex justify-between items-center pl-4">
                            <p className={`text-sm font-bold ${
                              kpi.status === "good" ? "text-green-500" : 
                              kpi.status === "warning" ? "text-amber-500" : 
                              "text-red-500"
                            }`}>{kpi.value}{kpi.name === "Inventory Turnover" ? "x" : "%"}</p>
                            <p className="text-xs text-muted-foreground">Target: {kpi.target}{kpi.name === "Inventory Turnover" ? "x" : "%"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Cost Analysis Tab */}
            <TabsContent value="costs" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Cost Breakdown</CardTitle>
                    <CardDescription>Warehouse operational costs by category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Labor", value: 45, fill: "#3b82f6" },
                            { name: "Facilities", value: 25, fill: "#10b981" },
                            { name: "Equipment", value: 15, fill: "#f59e0b" },
                            { name: "Technology", value: 8, fill: "#8b5cf6" },
                            { name: "Utilities", value: 7, fill: "#ec4899" }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage of Total Cost']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Cost Per Order</CardTitle>
                    <CardDescription>Monthly cost per order processed</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', cost: 4.85, industry: 5.20 },
                          { month: 'Feb', cost: 4.92, industry: 5.18 },
                          { month: 'Mar', cost: 4.78, industry: 5.15 },
                          { month: 'Apr', cost: 4.65, industry: 5.12 },
                          { month: 'May', cost: 4.58, industry: 5.10 },
                          { month: 'Jun', cost: 4.52, industry: 5.08 },
                          { month: 'Jul', cost: 4.48, industry: 5.05 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Cost per Order']} />
                        <Legend />
                        <Line type="monotone" dataKey="cost" name="Our Cost" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="industry" name="Industry Avg" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="pb-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Cost Breakdown</CardTitle>
                    <CardDescription>Detailed cost analysis by category and month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Labor</TableHead>
                            <TableHead>Facilities</TableHead>
                            <TableHead>Equipment</TableHead>
                            <TableHead>Technology</TableHead>
                            <TableHead>Utilities</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Cost/Order</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { month: "Jan", labor: 125800, facilities: 68400, equipment: 42500, technology: 22800, utilities: 18500, orders: 57500 },
                            { month: "Feb", labor: 128900, facilities: 68400, equipment: 43200, technology: 22800, utilities: 19600, orders: 57300 },
                            { month: "Mar", labor: 127500, facilities: 68400, equipment: 41800, technology: 23500, utilities: 19200, orders: 58900 },
                            { month: "Apr", labor: 124200, facilities: 68400, equipment: 40500, technology: 23500, utilities: 18100, orders: 59200 },
                            { month: "May", labor: 126800, facilities: 68400, equipment: 41200, technology: 23500, utilities: 17800, orders: 60600 },
                            { month: "Jun", labor: 129500, facilities: 68400, equipment: 42800, technology: 23500, utilities: 17500, orders: 62300 },
                            { month: "Jul", labor: 132200, facilities: 68400, equipment: 43600, technology: 23500, utilities: 17900, orders: 63800 },
                          ].map((data, index) => {
                            const total = data.labor + data.facilities + data.equipment + data.technology + data.utilities;
                            const costPerOrder = (total / data.orders).toFixed(2);
                            
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{data.month}</TableCell>
                                <TableCell>${(data.labor / 1000).toFixed(1)}K</TableCell>
                                <TableCell>${(data.facilities / 1000).toFixed(1)}K</TableCell>
                                <TableCell>${(data.equipment / 1000).toFixed(1)}K</TableCell>
                                <TableCell>${(data.technology / 1000).toFixed(1)}K</TableCell>
                                <TableCell>${(data.utilities / 1000).toFixed(1)}K</TableCell>
                                <TableCell className="font-bold">${(total / 1000).toFixed(1)}K</TableCell>
                                <TableCell>{(data.orders / 1000).toFixed(1)}K</TableCell>
                                <TableCell className="font-bold">${costPerOrder}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Trend Analysis Tab */}
            <TabsContent value="trends" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Inventory Turnover Trends</CardTitle>
                    <CardDescription>Quarterly inventory turns by category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { quarter: 'Q3 2022', electronics: 8.2, clothing: 6.8, food: 12.5, furniture: 4.2, automotive: 5.5 },
                          { quarter: 'Q4 2022', electronics: 9.1, clothing: 7.5, food: 13.2, furniture: 4.0, automotive: 5.8 },
                          { quarter: 'Q1 2023', electronics: 8.5, clothing: 6.9, food: 12.8, furniture: 3.8, automotive: 5.6 },
                          { quarter: 'Q2 2023', electronics: 9.5, clothing: 7.2, food: 13.5, furniture: 4.3, automotive: 6.1 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="quarter" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="electronics" name="Electronics" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="clothing" name="Clothing" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="food" name="Food" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="furniture" name="Furniture" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="automotive" name="Automotive" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Seasonal Demand Patterns</CardTitle>
                    <CardDescription>Monthly order volume by year</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', y2023: 57500, y2022: 51200, y2021: 45800 },
                          { month: 'Feb', y2023: 57300, y2022: 52500, y2021: 46200 },
                          { month: 'Mar', y2023: 58900, y2022: 54100, y2021: 47500 },
                          { month: 'Apr', y2023: 59200, y2022: 53800, y2021: 48100 },
                          { month: 'May', y2023: 60600, y2022: 55200, y2021: 49800 },
                          { month: 'Jun', y2023: 62300, y2022: 56800, y2021: 51200 },
                          { month: 'Jul', y2023: 63800, y2022: 58500, y2021: 52800 },
                          { month: 'Aug', y2023: null, y2022: 59200, y2021: 53500 },
                          { month: 'Sep', y2023: null, y2022: 62800, y2021: 56200 },
                          { month: 'Oct', y2023: null, y2022: 68500, y2021: 61800 },
                          { month: 'Nov', y2023: null, y2022: 78200, y2021: 72500 },
                          { month: 'Dec', y2023: null, y2022: 85400, y2021: 78900 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="y2023" name="2023" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="y2022" name="2022" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="y2021" name="2021" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Custom Reports Tab */}
            <TabsContent value="reports" className="p-0">
              <div className="p-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Report Builder</CardTitle>
                    <CardDescription>Create custom warehouse reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Report Type</label>
                        <Select defaultValue="inventory">
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inventory">Inventory</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="productivity">Productivity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Date Range</label>
                        <Select defaultValue="quarter">
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Last Week</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                            <SelectItem value="quarter">Last Quarter</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Format</label>
                        <Select defaultValue="xlsx">
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="xlsx">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 mb-4">
                      <h4 className="text-sm font-medium mb-2">Report Sections</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          "Inventory Summary", "Stock Levels", "Inventory Value", "Turnover Rate",
                          "Order Fulfillment", "Picking Efficiency", "Space Utilization", "Labor Productivity"
                        ].map((section, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`section-${index}`} checked={index < 5} />
                            <label htmlFor={`section-${index}`} className="text-sm">
                              {section}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Preview</Button>
                      <Button>Generate Report</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recent Reports</CardTitle>
                      <CardDescription>Previously generated reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Report Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Date Range</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Format</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              { name: "Q2 Inventory Summary", type: "Inventory", range: "Apr-Jun 2023", created: "Jul 05, 2023", format: "XLSX" },
                              { name: "June Operations Report", type: "Operations", range: "Jun 2023", created: "Jul 03, 2023", format: "PDF" },
                              { name: "Inventory Value Analysis", type: "Financial", range: "Q2 2023", created: "Jul 02, 2023", format: "XLSX" },
                              { name: "Labor Productivity", type: "Productivity", range: "Jan-Jun 2023", created: "Jun 30, 2023", format: "PDF" },
                              { name: "Stock Level Alert Report", type: "Inventory", range: "Last 30 days", created: "Jun 25, 2023", format: "CSV" },
                            ].map((report, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{report.name}</TableCell>
                                <TableCell>{report.type}</TableCell>
                                <TableCell>{report.range}</TableCell>
                                <TableCell>{report.created}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{report.format}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
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

      {/* Keep the existing modal code */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Warehouse</DialogTitle>
            <DialogDescription>
              Enter the details for the new warehouse location.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input id="location" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input id="capacity" type="number" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Warehouse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}