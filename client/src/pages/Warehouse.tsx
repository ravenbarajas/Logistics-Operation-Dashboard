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
  Timer,
  BoxesIcon,
  LucideBoxes,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil
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
import { useLocation } from "wouter";

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
  const [pageSize, setPageSize] = useState(5);
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
  
  // Get current location
  const [location, setLocation] = useLocation();
  
  // Determine the default active tab based on the URL
  const getDefaultTab = () => {
    if (location.includes("/warehouse/inventory")) {
      return "inventory";
    } else if (location.includes("/warehouse/analytics")) {
      return "analytics";
    } else if (location.includes("/warehouse/storage")) {
      return "storage";
    }
    return "warehouses";
  };
  
  // Tab state
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  
  // Added for multiple selection functionality
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  
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
      setError(err instanceof Error ? err.message : 'Failed to delete inventory item');
    } finally {
      setLoading(false);
    }
  };

  // Add missing functions
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

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate warehouse statistics
  const totalWarehouses = warehouseList.length;
  const totalInventoryItems = inventoryItems.length;
  const totalInventoryUnits = inventoryItems.reduce((total, item) => total + (item.quantity || 0), 0);

  // Calculate average warehouse utilization
  const totalCapacity = warehouseList.reduce((total, wh) => total + (wh.capacity || 0), 0);
  const totalUtilization = warehouseList.reduce((total, wh) => total + (wh.currentUsage || 0), 0);
  const avgUtilization = totalCapacity > 0 ? (totalUtilization / totalCapacity) * 100 : 0;

  // Summary stats for the dashboard
  const totalInventoryValue = 1250000; // Example fixed value
  const fulfillmentRate = 94.8; // Example value
  
  // Get the current page name for the heading
  const getCurrentPageName = () => {
    switch (activeTab) {
      case "warehouses": return "Warehouse";
      case "inventory": return "Inventory";
      case "storage": return "Storage";
      case "analytics": return "Analytics";
      default: return "Warehouse";
    }
  };

  // Add utility functions for pagination
  const totalPages = Math.max(1, Math.ceil(filteredWarehouses.length / pageSize));
  const indexOfLastWarehouse = currentPage * pageSize;
  const indexOfFirstWarehouse = indexOfLastWarehouse - pageSize;
  const paginatedWarehouses = filteredWarehouses.slice(indexOfFirstWarehouse, indexOfLastWarehouse);

  // Add handler for warehouse selection
  const handleToggleWarehouseSelection = (warehouseId: string) => {
    setSelectedWarehouses(prev => {
      if (prev.includes(warehouseId)) {
        return prev.filter(id => id !== warehouseId);
      } else {
        return [...prev, warehouseId];
      }
    });
  };

  // Add enhanced pagination controls
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Add handler for page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Add batch status change functionality
  const handleBatchStatusChange = (status: string) => {
    // In a real application, you would make an API call to update the status of all selected warehouses
    console.log(`Changing status of ${selectedWarehouses.length} warehouses to ${status}`);
    
    // For demo purposes, update the warehouses in the client
    const updatedWarehouses = warehouseList.map(warehouse => {
      if (selectedWarehouses.includes(warehouse.id.toString())) {
        return { ...warehouse, status };
      }
      return warehouse;
    });
    
    setWarehouseList(updatedWarehouses);
    setFilteredWarehouses(updatedWarehouses);
    
    // Clear selection after batch operation
    setSelectedWarehouses([]);
  };

  // Add handler for viewing warehouse details
  const handleViewDetails = (warehouse: WarehouseType) => {
    // Implement view details functionality
    console.log("View details for warehouse:", warehouse);
  };

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
    item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getWarehouseName(item.warehouseId || 0).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter warehouses based on search and status
  useEffect(() => {
    let filtered = warehouseList;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(warehouse => 
        warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(warehouse => warehouse.status === statusFilter);
    }
    
    setFilteredWarehouses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [warehouseList, searchTerm, statusFilter]);

  // Define columns for inventory table
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
        <div className="font-medium flex items-center">
          <Package2 className="h-4 w-4 mr-2 text-primary" />
          {item.itemName}
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
          {getWarehouseName(item.warehouseId || 0)}
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
          {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'N/A'}
        </div>
      )
    }
  ];

  // Define actions for inventory table
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

  // Add inventory pagination and selection state
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryPageSize, setInventoryPageSize] = useState(5);
  const [inventorySearchTerm, setInventorySearchTerm] = useState("");
  const [selectedInventoryItems, setSelectedInventoryItems] = useState<string[]>([]);
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState("all");

  // Calculate inventory pagination
  const inventoryTotalPages = Math.max(1, Math.ceil(filteredInventory.length / inventoryPageSize));
  const inventoryLastIndex = inventoryPage * inventoryPageSize;
  const inventoryFirstIndex = inventoryLastIndex - inventoryPageSize;
  const paginatedInventory = filteredInventory.slice(inventoryFirstIndex, inventoryLastIndex);

  // Add inventory page change handler
  const handleInventoryPageChange = (page: number) => {
    setInventoryPage(page);
  };

  // Add inventory page size change handler
  const handleInventoryPageSizeChange = (size: number) => {
    setInventoryPageSize(size);
    setInventoryPage(1);
  };

  // Add inventory selection handler
  const handleToggleInventorySelection = (itemId: string) => {
    setSelectedInventoryItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Add batch operations for inventory
  const handleBatchInventoryOperation = (operation: string) => {
    console.log(`Performing ${operation} on ${selectedInventoryItems.length} inventory items`);
    // Clear selection after batch operation
    setSelectedInventoryItems([]);
  };

  // Add handler for tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL based on selected tab
    if (value === "warehouses") {
      setLocation("/warehouse");
    } else if (value === "inventory") {
      setLocation("/warehouse/inventory");
    } else if (value === "analytics") {
      setLocation("/warehouse/analytics");
    } else if (value === "storage") {
      setLocation("/warehouse/storage");
    }
  };

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Warehouse Management
          </h1>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <span>Current section: </span>
            <Badge className="ml-2">
              {getCurrentPageName()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={() => fetchData()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {activeTab === "warehouses" ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Total Warehouses</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{totalWarehouses}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+2 since last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Capacity Utilization</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{avgUtilization.toFixed(1)}%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+3.2% from last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Active Warehouses</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{warehouseList.filter(w => w.status === 'active').length}</div>
                <div className="flex items-center">
                  <div className="text-xs text-muted-foreground">{Math.round((warehouseList.filter(w => w.status === 'active').length / totalWarehouses) * 100)}% of total</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Average Capacity</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{totalWarehouses > 0 ? Math.round(totalCapacity / totalWarehouses).toLocaleString() : 0}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+5% from last year</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : activeTab === "inventory" ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Total Inventory Items</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{totalInventoryItems}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+24 since last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Total Units</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{totalInventoryUnits.toLocaleString()}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+328 units this month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Inventory Value</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+3.7% from last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Average Value/Item</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">
                  ${totalInventoryItems > 0 ? Math.round(totalInventoryValue / totalInventoryItems).toLocaleString() : 0}
                </div>
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1 text-amber-500" />
                  <p className="text-xs text-amber-500">-1.2% from last quarter</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : activeTab === "storage" ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Total Storage Locations</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">1,248</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+88 since last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Space Utilization</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">82.3%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-amber-500" />
                  <p className="text-xs text-amber-500">+2.1% from last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Empty Locations</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">221</div>
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-14 since last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Picking Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">94.7%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+1.3% from last quarter</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Order Fulfillment Rate</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">94.8%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+2.3% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Inventory Turnover</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">9.2x</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+0.8x from last year</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Picking Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">99.2%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+0.3% from last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Cost Per Order</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">$4.48</div>
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-$0.17 from last quarter</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Warehouse Operations Section */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6 space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="warehouses">
            <WarehouseIcon className="h-5 w-5 mr-2 text-primary" />
            Warehouse
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Boxes className="h-5 w-5 mr-2 text-primary" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="storage">
            <LayoutGrid className="h-5 w-5 mr-2 text-primary" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="warehouses">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Warehouse</CardTitle>
                <CardDescription>Manage your warehouses and storage facilities</CardDescription>
              </div>
              <Button onClick={handleAddWarehouse}>
                <Plus className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>
            </CardHeader>
            
            <div className="p-6 bg-background py-0 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search warehouses..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-8 w-full h-9"
                  />
                </div>
                
                <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(size) => handlePageSizeChange(Number(size))}
                  >
                    <SelectTrigger className="h-9 w-[70px]">
                      <SelectValue placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 25, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="h-9 ml-auto" onClick={fetchData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                </div>
          </div>
            
            {/* Batch Operations */}
            {selectedWarehouses.length > 0 && (
              <div className="p-3 bg-muted/30 border-b">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center">
                    <Badge variant="secondary" className="mr-2">{selectedWarehouses.length}</Badge>
                    <span className="text-sm font-medium">warehouses selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
                    <Select defaultValue="" onValueChange={(value) => value && handleBatchStatusChange(value)}>
                      <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="active">Set Active</SelectItem>
                        <SelectItem value="maintenance">Set Maintenance</SelectItem>
                        <SelectItem value="inactive">Set Inactive</SelectItem>
                </SelectContent>
              </Select>
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedWarehouses([])}>
                      Clear Selection
              </Button>
            </div>
          </div>
              </div>
            )}
            
        <CardContent className="p-0">
              {filteredWarehouses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 p-6">
                  <WarehouseIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-center mb-2">No warehouses found</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search filters to find what you're looking for." 
                      : "Get started by adding your first warehouse."}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Button onClick={handleAddWarehouse}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Warehouse
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 text-sm">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium w-[40px]">
                            <input
                              type="checkbox"
                              checked={selectedWarehouses.length === paginatedWarehouses.length && paginatedWarehouses.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedWarehouses(paginatedWarehouses.map(w => w.id.toString()));
                                } else {
                                  setSelectedWarehouses([]);
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </th>
                          <th className="py-3 px-4 text-left font-medium w-[60px]">ID</th>
                          <th className="py-3 px-4 text-left font-medium">Warehouse</th>
                          <th className="py-3 px-4 text-left font-medium">Location</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                          <th className="py-3 px-4 text-center font-medium">Capacity</th>
                          <th className="py-3 px-4 text-center font-medium">Usage</th>
                          <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {paginatedWarehouses.map((warehouse) => {
                          const statusColor = warehouse.status === 'active' ? 'green' : 
                            warehouse.status === 'maintenance' ? 'amber' : 'red';
                          const statusLabel = warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1);
                          
                          return (
                            <tr 
                              key={warehouse.id} 
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <input
                                  type="checkbox"
                                  checked={selectedWarehouses.includes(warehouse.id.toString())}
                                  onChange={() => handleToggleWarehouseSelection(warehouse.id.toString())}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </td>
                              <td className="py-3 px-4 text-sm">{warehouse.id}</td>
                              <td className="py-3 px-4">
                                <div className="font-medium flex items-center">
                                  <WarehouseIcon className="h-4 w-4 mr-2 text-primary" />
                                  {warehouse.name}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {warehouse.location && typeof warehouse.location === 'object' && 'lat' in warehouse.location && 'lng' in warehouse.location
                                    ? `${(warehouse.location.lat as number).toFixed(4)}, ${(warehouse.location.lng as number).toFixed(4)}`
                                    : 'N/A'}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
                                  {statusLabel}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-center">{warehouse.capacity} units</td>
                              <td className="py-3 px-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[80px]">
                                    <div 
                                      className="bg-primary h-2 rounded-full" 
                                      style={{ width: `${(warehouse.currentUsage / warehouse.capacity) * 100}%` }}
                                    />
                                  </div>
                                  <div className="text-xs mt-1 text-muted-foreground">
                                    {Math.round((warehouse.currentUsage / warehouse.capacity) * 100)}%
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleViewDetails(warehouse)} 
                                    className="h-8 w-8"
                                    title="View Details"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleEditWarehouse(warehouse)} 
                                    className="h-8 w-8"
                                    title="Edit Warehouse"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDeleteWarehouse(warehouse)} 
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    title="Delete Warehouse"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t">
                    <div className="flex items-center justify-between py-4 px-6">
                      <div className="flex-1 text-sm text-muted-foreground">
                        Showing {Math.min((currentPage - 1) * pageSize + 1, filteredWarehouses.length)} to {Math.min(currentPage * pageSize, filteredWarehouses.length)} of {filteredWarehouses.length} {filteredWarehouses.length === 1 ? 'warehouse' : 'warehouses'}
                </div>
                  
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8"
                        aria-label="First page"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {totalPages <= 5 ? (
                        // Show all pages if 5 or fewer
                        [...Array(totalPages)].map((_, i) => (
                          <Button
                            key={`page-${i+1}`}
                            variant={currentPage === i+1 ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(i+1)}
                            className="h-8 w-8"
                            aria-label={`Page ${i+1}`}
                            aria-current={currentPage === i+1 ? "page" : undefined}
                          >
                            {i+1}
                          </Button>
                        ))
                      ) : (
                        // Show limited pages with ellipsis
                        <>
                          <Button
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(1)}
                            className="h-8 w-8"
                            aria-label="Page 1"
                          >
                            1
                          </Button>
                          
                          {currentPage > 3 && <span className="mx-1">...</span>}
                          
                          {currentPage > 2 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePageChange(currentPage - 1)}
                              className="h-8 w-8"
                              aria-label={`Page ${currentPage - 1}`}
                            >
                              {currentPage - 1}
                            </Button>
                          )}
                          
                          {currentPage !== 1 && currentPage !== totalPages && (
                            <Button
                              variant="default"
                              size="icon"
                              onClick={() => handlePageChange(currentPage)}
                              className="h-8 w-8"
                              aria-label={`Page ${currentPage}`}
                              aria-current="page"
                            >
                              {currentPage}
                            </Button>
                          )}
                          
                          {currentPage < totalPages - 1 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePageChange(currentPage + 1)}
                              className="h-8 w-8"
                              aria-label={`Page ${currentPage + 1}`}
                            >
                              {currentPage + 1}
                            </Button>
                          )}
                          
                          {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                          
                          <Button
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(totalPages)}
                            className="h-8 w-8"
                            aria-label={`Page ${totalPages}`}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                        aria-label="Last page"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                </div>
                </div>
                  
                  <div className="flex-1 flex justify-end">
                    
          </div>
                      </div>
                      </div>
                      </div>
              )}
                  </CardContent>
                </Card>
        </TabsContent>
                
        <TabsContent value="inventory">
            <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Inventory Items</CardTitle>
                <CardDescription>Track and manage all inventory across warehouses</CardDescription>
              </div>
              <Button onClick={handleAddInventoryItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              </CardHeader>
            
            <div className="p-6 bg-background py-0 mb-6 ">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search inventory..."
                    value={inventorySearchTerm}
                    onChange={(e) => {
                      setInventorySearchTerm(e.target.value);
                      setInventoryPage(1);
                    }}
                    className="pl-8 w-full h-9"
                  />
                </div>
                
                <Select defaultValue={inventoryCategoryFilter} onValueChange={setInventoryCategoryFilter}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="raw">Raw Materials</SelectItem>
                    <SelectItem value="finished">Finished Goods</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                  <Select
                    value={inventoryPageSize.toString()}
                    onValueChange={(size) => handleInventoryPageSizeChange(Number(size))}
                  >
                    <SelectTrigger className="h-9 w-[70px]">
                      <SelectValue placeholder={inventoryPageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 25, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="h-9 ml-auto" onClick={fetchData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* Batch Operations */}
            {selectedInventoryItems.length > 0 && (
              <div className="p-3 bg-muted/30 border-b">
                <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center">
                    <Badge variant="secondary" className="mr-2">{selectedInventoryItems.length}</Badge>
                    <span className="text-sm font-medium">items selected</span>
                </div>
                  <div className="flex flex-wrap gap-2">
                    <Select defaultValue="" onValueChange={(value) => value && handleBatchInventoryOperation(value)}>
                      <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Batch Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="move">Move to Warehouse</SelectItem>
                        <SelectItem value="restock">Request Restock</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedInventoryItems([])}>
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <CardContent className="p-0">
              {filteredInventory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 p-6">
                  <Package2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-center mb-2">No inventory items found</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {inventorySearchTerm || inventoryCategoryFilter !== "all" 
                      ? "Try adjusting your search filters to find what you're looking for." 
                      : "Get started by adding your first inventory item."}
                  </p>
                  {!inventorySearchTerm && inventoryCategoryFilter === "all" && (
                    <Button onClick={handleAddInventoryItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Inventory Item
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 text-sm">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium w-[40px]">
                            <input
                              type="checkbox"
                              checked={selectedInventoryItems.length === paginatedInventory.length && paginatedInventory.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedInventoryItems(paginatedInventory.map(item => item.id.toString()));
                                } else {
                                  setSelectedInventoryItems([]);
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </th>
                          <th className="py-3 px-4 text-left font-medium w-[60px]">ID</th>
                          <th className="py-3 px-4 text-left font-medium">Item</th>
                          <th className="py-3 px-4 text-left font-medium">Warehouse</th>
                          <th className="py-3 px-4 text-center font-medium">Quantity</th>
                          <th className="py-3 px-4 text-left font-medium">Last Updated</th>
                          <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {paginatedInventory.map((item) => (
                          <tr key={item.id}>
                            <td className="py-2 px-4">
                              <input
                                type="checkbox"
                                checked={selectedInventoryItems.includes(item.id.toString())}
                                onChange={() => handleToggleInventorySelection(item.id.toString())}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </td>
                            <td className="py-2 px-4 text-sm">{item.id}</td>
                            <td className="py-2 px-4">
                              <div className="font-medium flex items-center">
                                <Package2 className="h-4 w-4 mr-2 text-primary" />
                                {item.itemName}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                <div className="flex items-center">
                                <WarehouseIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                {getWarehouseName(item.warehouseId || 0)}
                </div>
                            </td>
                            <td className="py-2 px-4 text-center">
                              <div className="flex flex-col items-center">
                                <div className="font-medium">{item.quantity}</div>
                                <div className="text-xs text-muted-foreground">
                                  {item.unit || 'units'}
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-4 text-sm">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'N/A'}
                              </div>
                            </td>
                            <td className="py-2 px-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => console.log('View details for', item.itemName)} 
                                  className="h-8 w-8"
                                  title="View Details"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEditInventoryItem(item)} 
                                  className="h-8 w-8"
                                  title="Edit Item"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteInventoryItem(item)} 
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  title="Delete Item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t">
                    <div className="flex items-center justify-between py-4 px-6">
                      <div className="flex-1 text-sm text-muted-foreground">
                        Showing {Math.min((inventoryPage - 1) * inventoryPageSize + 1, filteredInventory.length)} to {Math.min(inventoryPage * inventoryPageSize, filteredInventory.length)} of {filteredInventory.length} {filteredInventory.length === 1 ? 'item' : 'items'}
                      </div>
                      
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleInventoryPageChange(1)}
                            disabled={inventoryPage === 1}
                            className="h-8 w-8"
                            aria-label="First page"
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleInventoryPageChange(inventoryPage - 1)}
                            disabled={inventoryPage === 1}
                            className="h-8 w-8"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          {inventoryTotalPages <= 5 ? (
                            // Show all pages if 5 or fewer
                            [...Array(inventoryTotalPages)].map((_, i) => (
                              <Button
                                key={`inv-page-${i+1}`}
                                variant={inventoryPage === i+1 ? "default" : "outline"}
                                size="icon"
                                onClick={() => handleInventoryPageChange(i+1)}
                                className="h-8 w-8"
                                aria-label={`Page ${i+1}`}
                                aria-current={inventoryPage === i+1 ? "page" : undefined}
                              >
                                {i+1}
                              </Button>
                            ))
                          ) : (
                            // Show limited pages with ellipsis
                            <>
                              <Button
                                variant={inventoryPage === 1 ? "default" : "outline"}
                                size="icon"
                                onClick={() => handleInventoryPageChange(1)}
                                className="h-8 w-8"
                                aria-label="Page 1"
                              >
                                1
                              </Button>
                              
                              {inventoryPage > 3 && <span className="mx-1">...</span>}
                              
                              {inventoryPage > 2 && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleInventoryPageChange(inventoryPage - 1)}
                                  className="h-8 w-8"
                                  aria-label={`Page ${inventoryPage - 1}`}
                                >
                                  {inventoryPage - 1}
                                </Button>
                              )}
                              
                              {inventoryPage !== 1 && inventoryPage !== inventoryTotalPages && (
                                <Button
                                  variant="default"
                                  size="icon"
                                  onClick={() => handleInventoryPageChange(inventoryPage)}
                                  className="h-8 w-8"
                                  aria-label={`Page ${inventoryPage}`}
                                  aria-current="page"
                                >
                                  {inventoryPage}
                                </Button>
                              )}
                              
                              {inventoryPage < inventoryTotalPages - 1 && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleInventoryPageChange(inventoryPage + 1)}
                                  className="h-8 w-8"
                                  aria-label={`Page ${inventoryPage + 1}`}
                                >
                                  {inventoryPage + 1}
                                </Button>
                              )}
                              
                              {inventoryPage < inventoryTotalPages - 2 && <span className="mx-1">...</span>}
                              
                              <Button
                                variant={inventoryPage === inventoryTotalPages ? "default" : "outline"}
                                size="icon"
                                onClick={() => handleInventoryPageChange(inventoryTotalPages)}
                                className="h-8 w-8"
                                aria-label={`Page ${inventoryTotalPages}`}
                              >
                                {inventoryTotalPages}
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleInventoryPageChange(inventoryPage + 1)}
                            disabled={inventoryPage === inventoryTotalPages}
                            className="h-8 w-8"
                            aria-label="Next page"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleInventoryPageChange(inventoryTotalPages)}
                            disabled={inventoryPage === inventoryTotalPages}
                            className="h-8 w-8"
                            aria-label="Last page"
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex justify-end">
                        
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
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
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="kpis" className="w-full p-6 py-0 mb-6">
                <TabsList className="w-full grid grid-cols-4 mb-6">
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
        </TabsContent>
        
        <TabsContent value="storage">   
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle>Storage Management</CardTitle>
                <CardDescription>Manage storage locations, zones, and bin assignments</CardDescription>
              </div>
              <Button onClick={() => console.log("Add storage area")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Storage Area
              </Button>
            </CardHeader>
            
            <div className="p-6 py-0 bg-background">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search storage locations..."
                    className="pl-8 w-full h-9"
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Storage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pallet">Pallet Racking</SelectItem>
                    <SelectItem value="shelving">Shelving</SelectItem>
                    <SelectItem value="bins">Bin Storage</SelectItem>
                    <SelectItem value="bulk">Bulk Storage</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="h-9 ml-auto">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Storage Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,248</div>
                    <div className="text-xs text-muted-foreground">Across all warehouse facilities</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Space Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">82.3%</div>
                    <Progress value={82.3} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Empty Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">221</div>
                    <div className="text-xs text-muted-foreground">17.7% of total capacity</div>
                  </CardContent>
                </Card>
            </div>
              
              <div className="rounded-md border mb-6">
                <div className="bg-muted/50 px-4 py-3 flex justify-between items-center">
                  <h3 className="font-medium">Storage Area Map</h3>
                  <Select defaultValue="warehouse1">
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="warehouse1">Main Warehouse</SelectItem>
                      <SelectItem value="warehouse2">Distribution Center</SelectItem>
                      <SelectItem value="warehouse3">Fulfillment Center</SelectItem>
                </SelectContent>
              </Select>
                </div>
                
                <div className="p-6 flex justify-center">
                  <div className="grid grid-cols-10 gap-2 max-w-3xl">
                    {[...Array(100)].map((_, index) => {
                      // Generate some pattern for demo
                      const isFilled = Math.random() > 0.2;
                      const isHighPriority = Math.random() > 0.8;
                      const colorClass = isHighPriority ? "bg-red-100 border-red-300" : 
                                          isFilled ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300";
                      
                      return (
                        <div 
                          key={index} 
                          className={`h-12 border rounded flex items-center justify-center text-xs font-medium cursor-pointer hover:opacity-80 ${colorClass}`}
                        >
                          {String.fromCharCode(65 + Math.floor(index / 10))}{index % 10 + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="px-6 pb-4 flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                    <span className="text-sm">Empty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                    <span className="text-sm">Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-sm">High Priority</span>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-4">Storage Zone Breakdown</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Storage Type</TableHead>
                      <TableHead>Total Locations</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: "A", name: "Raw Materials", type: "Pallet Racking", total: 240, available: 42, utilization: 82.5 },
                      { id: "B", name: "Finished Goods", type: "Pallet Racking", total: 320, available: 58, utilization: 81.9 },
                      { id: "C", name: "Small Parts", type: "Shelving", total: 180, available: 23, utilization: 87.2 },
                      { id: "D", name: "Assembly Components", type: "Bin Storage", total: 425, available: 76, utilization: 82.1 },
                      { id: "E", name: "Shipping Supplies", type: "Bulk Storage", total: 83, available: 22, utilization: 73.5 },
                    ].map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.id}</TableCell>
                        <TableCell>{zone.name}</TableCell>
                        <TableCell>{zone.type}</TableCell>
                        <TableCell>{zone.total}</TableCell>
                        <TableCell>{zone.available}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={zone.utilization} className="h-2 w-24" />
                            <span className="text-sm">{zone.utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
              </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
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