import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Plus, RefreshCw, Search, Filter, Pencil, Trash2, FileText, Truck, 
  CalendarClock, Fuel, Settings, AlertCircle, Map, TrendingUp, Activity, 
  User, Download, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, 
  Award, Shield, ThumbsUp, BarChart, BarChart3, Clock, X, Calendar, Wrench, AlertTriangle, 
  CheckCircle, Navigation, Check, CircleOff, DollarSign, Gauge, UserRound, 
  Route, MapPin, History, Cpu, CircleDot, TrendingDown, ClipboardList, 
  Package, MoreHorizontal, Battery, Cog, Droplets, PieChart, Zap, Receipt,
  Bell, CheckSquare, Info as InfoIcon, CircleDashed, ChevronDown, DatabaseBackup,
  Timer, AlertOctagon, Car, Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { fleetService, FleetSummary } from "@/services/fleetService";
import { Vehicle } from "@shared/schema";
import { VehicleModal, VehicleDetails } from "@/components/vehicles";
import { EnhancedTable } from "@/components/table/EnhancedTable";
import { FleetAnalytics } from "@/components/fleet/FleetAnalytics";
import { MaintenanceTracker } from "@/components/fleet/MaintenanceTracker";
import { FuelTracker } from "@/components/fleet/FuelTracker";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FleetMap } from "@/components/fleet/FleetMap";
import { ExtendedVehicle } from "@/types/vehicle";
import { VehicleHealthMonitor } from "@/components/fleet/VehicleHealthMonitor";
import { DriversPerformanceAnalyzer } from "@/components/fleet/DriversPerformanceAnalyzer";
import { Pagination } from "@/components/ui/pagination";
import { MapComponent } from "@/components/MapComponent";
import { formatDate, getMaintenanceStatus, addMockVehicleDetails } from "@/components/VehicleDetailsHelper";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

// Import the new tab components
import { VehicleInventoryTab } from "@/components/vehicles/VehicleInventoryTab";
import { DriversTab } from "@/components/vehicles/DriversTab";
import { MaintenanceTab } from "@/components/vehicles/MaintenanceTab";
import { FuelTab } from "@/components/vehicles/FuelTab";

// Import mock data from JSON files
import { 
  maintenanceRecords,
  fuelRecords,
  vehicleFuelData,
  vehicleTypes,
  vehicleStatus,
  fuelConsumption,
  monthlyMileage,
  metrics,
  vehicleAssignmentStats,
  upcomingMaintenance,
  vehicleActivityData,
  expandedFleetData,
  monthlyFuelData,
  vehicleFuelConsumption,
  drivers as driversData
} from '@/mockData/vehicles';

export default function Vehicles() {
  // Keep all the necessary state variables from before
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<ExtendedVehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<ExtendedVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [driverDetailsOpen, setDriverDetailsOpen] = useState(false);
  const [driverForEdit, setDriverForEdit] = useState<any>(null);
  const [driverEditModalOpen, setDriverEditModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<any>(null);
  const [driverDeleteDialogOpen, setDriverDeleteDialogOpen] = useState(false);
  const [systemDetailsVisible, setSystemDetailsVisible] = useState(false);
  const [systemSecurityDetailsVisible, setSystemSecurityDetailsVisible] = useState(false);
  
  // Add state variables for all the dialogs that were using getElementById
  const [failureDetailsDialogOpen, setFailureDetailsDialogOpen] = useState(false);
  const [componentDetailsDialogOpen, setComponentDetailsDialogOpen] = useState(false);
  
  // Add missing state variables needed for the component to work
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [groupByOption, setGroupByOption] = useState("");
  const [quickStatusOpen, setQuickStatusOpen] = useState(false);
  const [fleetSummary, setFleetSummary] = useState<FleetSummary | null>(null);
  const [selectedTab, setSelectedTab] = useState("vehicles");
  
  // Driver-related state variables
  const [driversSearch, setDriversSearch] = useState("");
  const [driversPerformanceFilter, setDriversPerformanceFilter] = useState("all");
  const [driversSortMetric, setDriversSortMetric] = useState("safety");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [driversCurrentPage, setDriversCurrentPage] = useState(1);
  const [driversPageSize, setDriversPageSize] = useState(5);
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);
  const [selectedDriverForDetails, setSelectedDriverForDetails] = useState<any>(null);
  const [driverDetailsPanelOpen, setDriverDetailsPanelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add these state variables near the top where other states are defined
  const [consumptionCurrentPage, setConsumptionCurrentPage] = useState(1);
  const [consumptionPageSize, setConsumptionPageSize] = useState(5);
  const [consumptionSearchQuery, setConsumptionSearchQuery] = useState("");
  const [consumptionTypeFilter, setConsumptionTypeFilter] = useState("all");

  const [costCurrentPage, setCostCurrentPage] = useState(1);
  const [costPageSize, setCostPageSize] = useState(5);
  const [costSearchQuery, setCostSearchQuery] = useState("");
  const [costMonthFilter, setCostMonthFilter] = useState("all");
  
  // Get current location - add this for tab navigation
  const [location] = useLocation();
  
  // Determine the default active tab based on the URL
  const getDefaultTab = () => {
    if (location.includes("/vehicles/inventory")) {
      return "vehicles";
    } else if (location.includes("/vehicles/drivers")) {
      return "drivers";
    } else if (location.includes("/vehicles/maintenance")) {
      return "maintenance";
    } else if (location.includes("/vehicles/fuel")) {
      return "fuel";
    }
    return "vehicles";
  };
  
  // Tab state - replace selectedTab with activeTab
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  
  // Update active tab when location changes
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/vehicles/inventory")) {
      setActiveTab("vehicles");
    } else if (path.includes("/vehicles/drivers")) {
      setActiveTab("drivers");
    } else if (path.includes("/vehicles/maintenance")) {
      setActiveTab("maintenance");
    } else if (path.includes("/vehicles/fuel")) {
      setActiveTab("fuel");
    } else if (path === "/vehicles") {
      window.history.replaceState({}, "", "/vehicles/inventory");
      setActiveTab("vehicles");
    }
  }, [location]);  // Use location from wouter to trigger this effect
  
  // Get the current page name for the heading
  const getCurrentPageName = () => {
    switch (activeTab) {
      case "vehicles": return "Vehicle Inventory";
      case "drivers": return "Driver Management";
      case "maintenance": return "Vehicle Maintenance";
      case "fuel": return "Fuel Consumption";
      default: return "Fleet";
    }
  };
  
  // Add tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Use window.history.pushState for client-side navigation without full page reload
    if (value === "vehicles") {
      window.history.pushState({}, "", "/vehicles/inventory");
    } else if (value === "drivers") {
      window.history.pushState({}, "", "/vehicles/drivers");
    } else if (value === "maintenance") {
      window.history.pushState({}, "", "/vehicles/maintenance");
    } else if (value === "fuel") {
      window.history.pushState({}, "", "/vehicles/fuel");
    }
  };
  
  // Update the fetchData function to use the imported mock data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Use the imported mock data
      const vehiclesData = expandedFleetData as ExtendedVehicle[];
      
      // Add mock details data for the demo
      const enhancedVehicles = addMockVehicleDetails(vehiclesData);
      
      const activeTrucks = enhancedVehicles.filter(v => v.status === 'active').length;
      const inMaintenance = enhancedVehicles.filter(v => v.status === 'maintenance').length;
      const outOfService = enhancedVehicles.filter(v => v.status === 'inactive').length;
      
      const summary: FleetSummary = {
        totalVehicles: enhancedVehicles.length,
        activeVehicles: activeTrucks,
        inMaintenance: inMaintenance,
        outOfService: outOfService,
        activePercentage: Math.round((activeTrucks / enhancedVehicles.length) * 100),
        maintenancePercentage: Math.round((inMaintenance / enhancedVehicles.length) * 100),
        outOfServicePercentage: Math.round((outOfService / enhancedVehicles.length) * 100),
      };
      
      setVehicles(enhancedVehicles);
      setFilteredVehicles(enhancedVehicles);
      setFleetSummary(summary);
      setTotalRecords(enhancedVehicles.length);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    
    try {
      // Remove the vehicle from the local state first for immediate UI update
      setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
      setFilteredVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
      
      // Call the API to delete the vehicle
      await fleetService.deleteVehicle(vehicleToDelete.id);
      
      // Update the fleet summary
      if (fleetSummary) {
        const newSummary = { ...fleetSummary };
        newSummary.totalVehicles--;
        if (vehicleToDelete.status === 'active') newSummary.activeVehicles--;
        else if (vehicleToDelete.status === 'maintenance') newSummary.inMaintenance--;
        else if (vehicleToDelete.status === 'inactive') newSummary.outOfService--;
        
        // Recalculate percentages
        newSummary.activePercentage = Math.round((newSummary.activeVehicles / newSummary.totalVehicles) * 100);
        newSummary.maintenancePercentage = Math.round((newSummary.inMaintenance / newSummary.totalVehicles) * 100);
        newSummary.outOfServicePercentage = Math.round((newSummary.outOfService / newSummary.totalVehicles) * 100);
        
        setFleetSummary(newSummary);
      }
      
      // Clear the selected vehicle and close the dialog
      setVehicleToDelete(null);
      setDeleteDialogOpen(false);
      
      // Show success message (if you have a toast notification system)
      // toast.success('Vehicle deleted successfully');
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      // Show error message (if you have a toast notification system)
      // toast.error('Failed to delete vehicle');
      
      // Refresh the data to ensure consistency
      await fetchData();
    }
  };

  const handleViewDetails = (vehicle: ExtendedVehicle) => {
    setSelectedVehicle(vehicle);
    setDriverDetailsOpen(true);
  };

  const handleBatchStatusChange = (status: string) => {
    console.log(`Change status to ${status} for vehicles:`, selectedVehicles);
    setQuickStatusOpen(false);
  };

  const handleToggleMap = () => {
    setShowMap(!showMap);
  };

  const handleToggleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedVehicles(filteredVehicles.map(v => v.id.toString()));
    } else {
      setSelectedVehicles([]);
    }
  };

  // Update filteredVehicles with useEffect instead of redeclaring it
  useEffect(() => {
    if (vehicles.length > 0) {
      const filtered = vehicles.filter(vehicle => {
        const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
        const matchesDepartment = departmentFilter === "all" || 
          (vehicle as ExtendedVehicle).departmentId?.toString() === departmentFilter;
        const matchesSearch = searchQuery === "" || 
          vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (vehicle as ExtendedVehicle).licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (vehicle as ExtendedVehicle).assignedDriver?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch && matchesDepartment;
      });
      
      setFilteredVehicles(filtered);
    }
  }, [vehicles, statusFilter, departmentFilter, searchQuery]);

  // Group vehicles if grouping is enabled
  const groupedVehicles = () => {
    if (!groupByOption || groupByOption === "none") return { "All Vehicles": filteredVehicles };
    
    return filteredVehicles.reduce((acc: Record<string, ExtendedVehicle[]>, vehicle) => {
      let groupKey = "Other";
      
      if (groupByOption === "type") {
        groupKey = vehicle.type || "Unspecified";
      } else if (groupByOption === "status") {
        groupKey = vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1);
      } else if (groupByOption === "department") {
        groupKey = (vehicle as ExtendedVehicle).departmentName || "Unassigned";
      }
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      
      acc[groupKey].push(vehicle as ExtendedVehicle);
      return acc;
    }, {});
  };

  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredVehicles.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };



  // Update filteredDrivers with useEffect instead of redeclaring it
  useEffect(() => {
    const filtered = driversData.filter((driver) => {
      // Calculate overall score
      const overallScore = Math.round(
        (driver.safetyScore + 
        driver.fuelEfficiency + 
        driver.timeManagement + 
        driver.vehicleHandling + 
        driver.customerSatisfaction) / 5
      );
      
      // Filter by performance category
      const matchesPerformance = 
        driversPerformanceFilter === "all" || 
        (driversPerformanceFilter === "high" && overallScore >= 90) ||
        (driversPerformanceFilter === "average" && overallScore >= 85 && overallScore < 90) ||
        (driversPerformanceFilter === "low" && overallScore < 85);
      
      // Filter by search query
      const matchesSearch = driversSearch.trim() === "" || 
        driver.name.toLowerCase().includes(driversSearch.toLowerCase());
      
      return matchesPerformance && matchesSearch;
    });
    
    setFilteredDrivers(filtered);
  }, [driversData, driversPerformanceFilter, driversSearch]);

  // Sort drivers based on selected metric - keep as is
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (driversSortMetric === "safety") {
      return b.safetyScore - a.safetyScore;
    } else if (driversSortMetric === "fuel") {
      return b.fuelEfficiency - a.fuelEfficiency;
    } else if (driversSortMetric === "time") {
      return b.timeManagement - a.timeManagement;
    } else if (driversSortMetric === "handling") {
      return b.vehicleHandling - a.vehicleHandling;
    } else if (driversSortMetric === "satisfaction") {
      return b.customerSatisfaction - a.customerSatisfaction;
    }
    return 0;
  });

  // Paginate drivers
  const driversTotalPages = Math.ceil(filteredDrivers.length / driversPageSize);
  const paginatedDrivers = sortedDrivers.slice(
    (driversCurrentPage - 1) * driversPageSize, 
    driversCurrentPage * driversPageSize
  );

  // Get a consistent color for driver avatar based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
    ];
    
    // Generate a consistent index based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Ensure positive index
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };

  // Get driver initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  // Handler for viewing driver details
  const handleViewDriverDetails = (driver: any) => {
    setSelectedDriverForDetails(driver);
    setDriverDetailsPanelOpen(true);
  };

  // Handler for editing driver
  const handleEditDriver = (driver: any) => {
    setDriverForEdit(driver);
    setDriverEditModalOpen(true);
  };

  // Handler for deleting driver
  const handleDeleteDriver = (driver: any) => {
    setDriverToDelete(driver);
    setDriverDeleteDialogOpen(true);
  };

  // Handler for confirming driver deletion
  const confirmDeleteDriver = () => {
    // In a real app, this would call an API to delete the driver
    console.log(`Deleting driver:`, driverToDelete);
    // Simulate successful deletion
    setDriverDeleteDialogOpen(false);
    setDriverToDelete(null);
    // In a real app, you would refresh the data here
  };

  const handleSubmitVehicle = async (vehicleData: any) => {
    try {
      const newVehicle = await fleetService.createVehicle(vehicleData);
      await fetchData();
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to create vehicle:', err);
    }
  };

  const handleAddDriver = () => {
    setDriverForEdit(null);
    setDriverEditModalOpen(true);
  };

  const handleSubmitDriver = async (driverData: any) => {
    try {
      // In a real app, this would be an API call
      const newDriver = {
        id: String(driversData.length + 1),
        name: driverData.name,
        avatar: null,
        safetyScore: 90,
        fuelEfficiency: 85,
        timeManagement: 88,
        vehicleHandling: 87,
        customerSatisfaction: 92,
        idleTime: 10,
        mileage: 0,
        trips: 0,
        incidents: 0
      };
      
      // Add to drivers data
      driversData.push(newDriver);
      setDriverEditModalOpen(false);
      // Refresh the filtered drivers
      setFilteredDrivers([...driversData]);
    } catch (err) {
      console.error('Failed to create driver:', err);
    }
  };

  // Replace 'loading' with 'isLoading'
  if (isLoading) {
    return <div className="container px-4 py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container px-4 py-8">
        <div className="text-red-500">Error: {error}</div>
        <Button onClick={fetchData} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <span>Current section: </span>
            <Badge className="ml-2">
              {getCurrentPageName()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Dynamic KPI Cards based on active tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {activeTab === "vehicles" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fleetSummary?.totalVehicles || 0}</div>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Fleet inventory count</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{fleetSummary?.activeVehicles || 0}</div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{fleetSummary?.activePercentage || 0}% of total fleet</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{fleetSummary?.inMaintenance || 0}</div>
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{fleetSummary?.maintenancePercentage || 0}% of total fleet</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Out of Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{fleetSummary?.outOfService || 0}</div>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{fleetSummary?.outOfServicePercentage || 0}% of total fleet</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "drivers" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{driversData.length}</div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Active driver count</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Safety Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {Math.round(driversData.reduce((acc, driver) => acc + driver.safetyScore, 0) / driversData.length)}%
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Driver safety rating</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {Math.round(driversData.reduce((acc, driver) => acc + driver.customerSatisfaction, 0) / driversData.length)}%
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Customer rating</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {driversData.reduce((acc, driver) => acc + driver.incidents, 0)}
                </div>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Safety incidents</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "maintenance" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceRecords.length}</div>
                <div className="flex items-center">
                  <ClipboardList className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Maintenance records</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {maintenanceRecords.filter(record => record.status === 'scheduled').length}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Upcoming maintenance</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {maintenanceRecords.filter(record => record.status === 'completed').length}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Finished service</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {maintenanceRecords.filter(record => record.status === 'overdue').length}
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Past due service</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "fuel" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {fuelRecords.reduce((acc, record) => acc + record.gallons, 0).toFixed(1)}
                </div>
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Gallons used</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  ${fuelRecords.reduce((acc, record) => acc + record.cost, 0).toFixed(2)}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Fuel expenses</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Price/Gallon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">
                  $
                  {(fuelRecords.reduce((acc, record) => acc + record.cost, 0) / 
                   fuelRecords.reduce((acc, record) => acc + record.gallons, 0)).toFixed(2)}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Average fuel cost</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. MPG</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {(fuelRecords
                    .filter(r => r.mpg)
                    .reduce((acc, r, i, arr) => acc + (r.mpg || 0), 0) / 
                    fuelRecords.filter(r => r.mpg).length || 0).toFixed(1)
                  }
                </div>
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Miles per gallon</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Fleet Management Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6 space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="vehicles">
            <Truck className="h-5 w-5 mr-2 text-primary" />
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="drivers">
            <User className="h-5 w-5 mr-2 text-primary" />
            Drivers
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="h-5 w-5 mr-2 text-primary" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="fuel">
            <Fuel className="h-5 w-5 mr-2 text-primary" />
            Fuel
          </TabsTrigger>
        </TabsList>
        
        {/* Content for Vehicle tab */}
        <TabsContent value="vehicles">
          <VehicleInventoryTab 
            vehicles={vehicles}
            filteredVehicles={filteredVehicles}
            selectedVehicles={selectedVehicles}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            pageSize={pageSize}
            setPageSize={setPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleToggleVehicleSelection={handleToggleVehicleSelection}
            handleEditVehicle={handleEditVehicle}
            handleDeleteVehicle={handleDeleteVehicle}
            handleViewDetails={handleViewDetails}
            handleAddVehicle={handleAddVehicle}
            handleBatchStatusChange={handleBatchStatusChange}
            refreshData={fetchData}
            fleetSummary={fleetSummary}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="drivers">
          <DriversTab
            driversData={driversData}
            filteredDrivers={filteredDrivers}
            driversSearch={driversSearch}
            setDriversSearch={setDriversSearch}
            driversPerformanceFilter={driversPerformanceFilter}
            setDriversPerformanceFilter={setDriversPerformanceFilter}
            driversSortMetric={driversSortMetric}
            setDriversSortMetric={setDriversSortMetric}
            driversPageSize={driversPageSize}
            setDriversPageSize={setDriversPageSize}
            driversCurrentPage={driversCurrentPage}
            setDriversCurrentPage={setDriversCurrentPage}
            selectedDrivers={selectedDrivers}
            setSelectedDrivers={setSelectedDrivers}
            handleViewDriverDetails={handleViewDriverDetails}
            handleEditDriver={handleEditDriver}
            handleDeleteDriver={handleDeleteDriver}
            handleAddDriver={handleAddDriver}
            refreshData={fetchData}
            getAvatarColor={getAvatarColor}
            getInitials={getInitials}
          />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceTab
            maintenanceRecords={maintenanceRecords}
            refreshData={fetchData}
            openComponentDetailsDialog={() => setComponentDetailsDialogOpen(true)}
            openFailureDetailsDialog={() => setFailureDetailsDialogOpen(true)}
            setSystemDetailsVisible={setSystemDetailsVisible}
            systemDetailsVisible={systemDetailsVisible}
            setSystemSecurityDetailsVisible={setSystemSecurityDetailsVisible}
            systemSecurityDetailsVisible={systemSecurityDetailsVisible}
          />
        </TabsContent>

        <TabsContent value="fuel">
          <FuelTab />
        </TabsContent>
      </Tabs>

      {/* Add the Edit Driver Modal */}
      <Dialog open={driverEditModalOpen} onOpenChange={setDriverEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{driverForEdit ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
            <DialogDescription>
              {driverForEdit ? 'Update driver information' : 'Add a new driver to your fleet'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Driver Name</Label>
              <Input id="name" placeholder="Full Name" defaultValue={driverForEdit?.name || ''} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Phone Number" defaultValue="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Email Address" defaultValue="driver@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="license">License Number</Label>
              <Input id="license" placeholder="License Number" defaultValue="DL12345678" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDriverEditModalOpen(false)}>Cancel</Button>
            <Button onClick={() => handleSubmitDriver({
              name: (document.getElementById('name') as HTMLInputElement)?.value,
              phone: (document.getElementById('phone') as HTMLInputElement)?.value,
              email: (document.getElementById('email') as HTMLInputElement)?.value,
              license: (document.getElementById('license') as HTMLInputElement)?.value,
              status: 'active'
            })}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add the Delete Driver Confirmation Dialog */}
      <AlertDialog open={driverDeleteDialogOpen} onOpenChange={setDriverDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {driverToDelete?.name} from your driver records.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDriver} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Component Details Dialog */}
      <Dialog open={componentDetailsDialogOpen} onOpenChange={setComponentDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Component Details</DialogTitle>
            <DialogDescription>
              Detailed view of vehicle component health and status
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="border rounded-md p-4">
              <h3 className="text-base font-medium mb-2">Battery System</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Voltage:</span>
                  <span className="font-medium">12.4V</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Load Test:</span>
                  <span className="font-medium text-amber-600">Weak</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Age:</span>
                  <span className="font-medium">24 months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recommended Action:</span>
                  <span className="font-medium text-red-600">Replace</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Maintenance History</h3>
                <div className="text-xs space-y-1">
                  <p>Last Checked: 15 days ago</p>
                  <p>Last Replaced: 24 months ago</p>
                  <p>Warranty: Expired</p>
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Performance Impact</h3>
                <div className="text-xs space-y-1">
                  <p>Starting Reliability: <span className="text-amber-600">Medium</span></p>
                  <p>Electrical Systems: <span className="text-amber-600">Affected</span></p>
                  <p>Fuel Efficiency: <span className="text-green-600">Normal</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setComponentDetailsDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                alert("Maintenance scheduled");
                setComponentDetailsDialogOpen(false);
              }}
            >
              Schedule Maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Failure Details Dialog */}
      <Dialog open={failureDetailsDialogOpen} onOpenChange={setFailureDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Failure Prediction Details</DialogTitle>
            <DialogDescription>
              Detailed analysis of predicted component failure
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex items-center space-x-4 pb-4 border-b">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div>
                <h3 className="text-base font-medium">Truck #103 - Battery Failure Predicted</h3>
                <p className="text-sm text-muted-foreground">Estimated time to failure: 14 days</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Prediction Confidence</h4>
                <div className="flex items-center">
                  <Progress value={92} className="h-2 flex-1" />
                  <span className="ml-2 text-sm font-medium">92%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Based on 245 similar failure patterns</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Key Indicators</h4>
                <ul className="text-sm space-y-1">
                  <li>• Voltage drop during engine start (10.8V, normal: {'>'}11.5V)</li>
                  <li>• Increased charging time (24min, normal: {'<'}15min)</li>
                  <li>• Decreased electrolyte specific gravity (1.210, normal: {'>'}1.250)</li>
                  <li>• Battery age exceeds recommended service life (24 months, recommended: 18-20 months)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Risk Assessment</h4>
                <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    Continued operation without battery replacement may result in unexpected vehicle breakdown within 2 weeks. Risk of electrical system damage increases after 7 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setFailureDetailsDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                alert("Maintenance scheduled");
                setFailureDetailsDialogOpen(false);
              }}
            >
              Schedule Maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vehicle Details Dialog */}
      <Dialog open={driverDetailsOpen} onOpenChange={setDriverDetailsOpen}>
        <DialogContent className="min-w-[50vw] h-[90vh] p-0">
          {selectedVehicle && (
            <div className="h-full flex flex-col">
              <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">Vehicle Details</DialogTitle>
                  <DialogDescription className="sr-only">Detailed information about the selected vehicle</DialogDescription>
                  <Button variant="ghost" size="icon" onClick={() => setDriverDetailsOpen(false)} className="rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto">
                {/* Top Row - Vehicle Details */}
                <div className="p-6 pb-3">
                  <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                    <Truck className="h-12 w-12 text-primary p-2 bg-primary/10 rounded-full" />
                    <div className="flex-1">
                      <h3 className="text-xl font-medium">{selectedVehicle.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={
                          selectedVehicle.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          selectedVehicle.status === 'maintenance' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }>
                          {selectedVehicle.status.charAt(0).toUpperCase() + selectedVehicle.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {(selectedVehicle as ExtendedVehicle).make || 'N/A'} {(selectedVehicle as ExtendedVehicle).model || 'N/A'} • {(selectedVehicle as ExtendedVehicle).year || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setDriverDetailsOpen(false);
                          handleEditVehicle(selectedVehicle);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Vehicle
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="px-6 grid grid-cols-4 gap-6">
                  {/* Left Column (spans 3 cols) */}
                  <div className="col-span-3 space-y-6">
                    {/* Second Row - Location Map */}
                    <Card className="shadow-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <Map className="h-4 w-4 mr-2 text-primary" />
                          Vehicle Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 h-[250px] overflow-hidden rounded-b-lg">
                        {(selectedVehicle as ExtendedVehicle).location ? (
                          <MapComponent 
                            location={(selectedVehicle as ExtendedVehicle).location!}
                            locationName={(selectedVehicle as ExtendedVehicle).location ? 
                              ((selectedVehicle as ExtendedVehicle).location as any).address || 
                              `${(selectedVehicle as ExtendedVehicle).location!.lat}, ${(selectedVehicle as ExtendedVehicle).location!.lng}` 
                              : 'Unknown'}
                          />
                        ) : (
                          <div className="h-full bg-muted/20 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <Map className="h-8 w-8 mx-auto mb-1 text-muted-foreground/50" />
                              <p className="text-sm">No location data available</p>
                              <p className="text-xs mt-1">Vehicle location tracking disabled or offline</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Third Row - Vehicle Information */}
                    <Card className="shadow-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          Vehicle Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">License Plate:</span>
                              <span className="font-mono font-medium">{(selectedVehicle as ExtendedVehicle).licensePlate || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">VIN:</span>
                              <span className="font-mono font-medium">{(selectedVehicle as ExtendedVehicle).vinNumber || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Mileage:</span>
                              <span className="font-medium">{(selectedVehicle as ExtendedVehicle).mileage?.toLocaleString() || '0'} mi</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Department:</span>
                              <span className="font-medium">{(selectedVehicle as ExtendedVehicle).departmentName || 'Unassigned'}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Last Maintenance:</span>
                              <span className="font-medium">
                                {(selectedVehicle as ExtendedVehicle).lastMaintenance 
                                  ? (typeof (selectedVehicle as ExtendedVehicle).lastMaintenance === 'string' 
                                    ? (selectedVehicle as ExtendedVehicle).lastMaintenance 
                                    : (selectedVehicle as ExtendedVehicle).lastMaintenance instanceof Date
                                      ? ((selectedVehicle as ExtendedVehicle).lastMaintenance as Date).toLocaleDateString()
                                      : String((selectedVehicle as ExtendedVehicle).lastMaintenance)) 
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Registration Expires:</span>
                              <span className="font-medium">
                                {(selectedVehicle as ExtendedVehicle).registrationExpiry ? 
                                  (typeof (selectedVehicle as ExtendedVehicle).registrationExpiry === 'string' 
                                    ? new Date((selectedVehicle as ExtendedVehicle).registrationExpiry as string).toLocaleDateString()
                                    : ((selectedVehicle as ExtendedVehicle).registrationExpiry as Date).toLocaleDateString())
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Insurance Expires:</span>
                              <span className="font-medium">
                                {(selectedVehicle as ExtendedVehicle).insuranceExpiry ? 
                                  (typeof (selectedVehicle as ExtendedVehicle).insuranceExpiry === 'string' 
                                    ? new Date((selectedVehicle as ExtendedVehicle).insuranceExpiry as string).toLocaleDateString()
                                    : ((selectedVehicle as ExtendedVehicle).insuranceExpiry as Date).toLocaleDateString())
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Assigned Driver:</span>
                              <span className="font-medium">{(selectedVehicle as ExtendedVehicle).assignedDriver || 'Unassigned'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-sm text-muted-foreground">Fuel Level:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div 
                                className={`h-2 rounded-full ${(selectedVehicle as ExtendedVehicle).fuelLevel! > 60 ? 'bg-green-500' : (selectedVehicle as ExtendedVehicle).fuelLevel! > 25 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${(selectedVehicle as ExtendedVehicle).fuelLevel || 0}%` }}
                              />
                            </div>
                            <span className="font-medium">{(selectedVehicle as ExtendedVehicle).fuelLevel || '0'}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Fourth Row - Grid with Performance Metrics and Fuel Records */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Performance Summary */}
                      <Card className="shadow-sm">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base flex items-center">
                            <Activity className="h-4 w-4 mr-2 text-primary" />
                            Performance Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 max-h-[250px] overflow-y-auto">
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Efficiency Rating</span>
                                <span className="font-medium">
                                  {(selectedVehicle as any).fuelEfficiency ? `${(selectedVehicle as any).fuelEfficiency}%` : 'N/A'}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div 
                                  className="bg-blue-500 h-1.5 rounded-full"
                                  style={{ width: `${(selectedVehicle as any).fuelEfficiency || 0}%` }}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Utilization Rate</span>
                                <span className="font-medium">
                                  {(selectedVehicle as any).utilizationRate ? `${(selectedVehicle as any).utilizationRate}%` : 'N/A'}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div 
                                  className="bg-purple-500 h-1.5 rounded-full"
                                  style={{ width: `${(selectedVehicle as any).utilizationRate || 0}%` }}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Maintenance Score</span>
                                <span className="font-medium">
                                  {(selectedVehicle as any).maintenanceScore ? `${(selectedVehicle as any).maintenanceScore}%` : 'N/A'}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full"
                                  style={{ width: `${(selectedVehicle as any).maintenanceScore || 0}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Monthly Cost Average</span>
                                <span className="text-sm font-medium text-primary">
                                  ${(selectedVehicle as any).monthlyCost?.toFixed(2) || '0.00'}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Based on maintenance and fuel records from the last 3 months
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Fuel History Summary */}
                      <Card className="shadow-sm">
                        <CardHeader className="p-4 flex flex-row items-center justify-between">
                          <CardTitle className="text-base flex items-center">
                            <Fuel className="h-4 w-4 mr-2 text-primary" />
                            Recent Fuel Records
                          </CardTitle>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">View All</Button>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 max-h-[250px] overflow-y-auto">
                          <div className="space-y-3 text-sm">
                            {fuelRecords
                              .filter(r => r.vehicleId === selectedVehicle.id)
                              .sort((a, b) => b.date.getTime() - a.date.getTime())
                              .slice(0, 3)
                              .map(record => (
                                <div key={record.id} className="p-2 border rounded-md">
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">{record.gallons.toFixed(2)} gallons</span>
                                    <span className="text-primary font-medium">${record.cost.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{record.date.toLocaleDateString()}</span>
                                    <span>{record.mileage.toLocaleString()} miles</span>
                                  </div>
                                  {record.mpg && (
                                    <div className="flex items-center mt-1">
                                      <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                        {record.mpg.toFixed(1)} MPG
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            {fuelRecords.filter(r => r.vehicleId === selectedVehicle.id).length === 0 && (
                              <div className="py-3 text-center text-muted-foreground">
                                <p>No fuel records found</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Right Column (Maintenance History) - spans vertically */}
                  <div className="col-span-1">
                    {/* Maintenance History Summary (spans vertically from row 2-5) */}
                    <Card className="shadow-sm h-full flex flex-col">
                      <CardHeader className="p-4 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center">
                            <Settings className="h-4 w-4 mr-2 text-primary" />
                            Maintenance History
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            Service records, repairs and maintenance schedule
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">View All</Button>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 flex-1 overflow-y-auto">
                        {(selectedVehicle as any).notes && (
                          <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                            <div className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Maintenance Note</div>
                                <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">{(selectedVehicle as any).notes}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4 border-b pb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Next Service</span>
                              <span className="text-sm font-medium">
                                {formatDate((selectedVehicle as any).nextServiceDue)}
                              </span>
                            </div>
                          </div>
                          <Badge variant={
                            getMaintenanceStatus((selectedVehicle as any).nextServiceDue) === 'overdue' ? 'destructive' :
                            getMaintenanceStatus((selectedVehicle as any).nextServiceDue) === 'due-soon' ? 'outline' :
                            'success'
                          }>
                            {getMaintenanceStatus((selectedVehicle as any).nextServiceDue) === 'overdue' ? 'Overdue' :
                             getMaintenanceStatus((selectedVehicle as any).nextServiceDue) === 'due-soon' ? 'Due Soon' :
                             'On Schedule'}
                          </Badge>
                        </div>

                        <div className="space-y-3 text-sm">
                          {maintenanceRecords
                            .filter(r => r.vehicleId === selectedVehicle.id)
                            .sort((a, b) => b.date.getTime() - a.date.getTime())
                            .map(record => (
                              <div key={record.id} className="p-3 border rounded-md hover:bg-muted/30 transition-colors">
                                <div className="flex justify-between mb-1.5">
                                  <div className="flex items-center">
                                    {record.type === 'oil change' && <Fuel className="h-3.5 w-3.5 mr-1.5 text-blue-500" />}
                                    {record.type === 'tire replacement' && <CircleOff className="h-3.5 w-3.5 mr-1.5 text-gray-500" />}
                                    {record.type === 'brake service' && <Gauge className="h-3.5 w-3.5 mr-1.5 text-red-500" />}
                                    {record.type === 'inspection' && <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />}
                                    {record.type === 'repair' && <Wrench className="h-3.5 w-3.5 mr-1.5 text-amber-500" />}
                                    {!['oil change', 'tire replacement', 'brake service', 'inspection', 'repair'].includes(record.type) && 
                                      <Settings className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                    }
                                    <span className="font-medium capitalize">{record.type}</span>
                                  </div>
                                  <Badge variant={
                                    record.status === 'completed' ? 'success' : 
                                    record.status === 'scheduled' ? 'outline' : 'destructive'
                                  } className="text-[10px] py-0 h-5">
                                    {record.status === 'completed' && <Check className="h-3 w-3 mr-1" />}
                                    {record.status === 'scheduled' && <Calendar className="h-3 w-3 mr-1" />}
                                    {record.status === 'canceled' && <X className="h-3 w-3 mr-1" />}
                                    {record.status}
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1.5 mb-1.5">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {record.date.toLocaleDateString()}
                                  </div>
                                  {record.cost && (
                                    <div className="flex items-center">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      ${record.cost.toFixed(2)}
                                    </div>
                                  )}
                                  {record.mileage && (
                                    <div className="flex items-center">
                                      <Gauge className="h-3 w-3 mr-1" />
                                      {record.mileage.toLocaleString()} mi
                                    </div>
                                  )}
                                  {record.technician && (
                                    <div className="flex items-center">
                                      <UserRound className="h-3 w-3 mr-1" />
                                      {record.technician}
                                    </div>
                                  )}
                                </div>
                                
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{record.description}</p>
                              </div>
                            ))}
                          {maintenanceRecords.filter(r => r.vehicleId === selectedVehicle.id).length === 0 && (
                            <div className="py-6 text-center text-muted-foreground">
                              <Settings className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                              <p className="text-sm">No maintenance records found</p>
                              <p className="text-xs mt-1">Regular maintenance records will appear here</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Schedule Service
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Driver Details Modal */}
      <Dialog open={driverDetailsPanelOpen} onOpenChange={setDriverDetailsPanelOpen} modal={true}>
        <DialogContent className="min-w-[50vw] h-[90vh] p-0">
          {selectedDriverForDetails && (
            <div className="h-full flex flex-col">
              <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">Driver Details</DialogTitle>
                  <DialogDescription className="sr-only">Detailed information about the selected driver</DialogDescription>
                  <Button variant="ghost" size="icon" onClick={() => setDriverDetailsPanelOpen(false)} className="rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto">
                {/* Driver Header Section */}
                <div className="p-6 pb-3">
                  <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center overflow-hidden ${getAvatarColor(selectedDriverForDetails.name)}`}>
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium">{selectedDriverForDetails.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Driver ID: {selectedDriverForDetails.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setDriverDetailsPanelOpen(false);
                          handleEditDriver(selectedDriverForDetails);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Driver
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Driver Details Content */}
                <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Performance Overview Card */}
                  <Card className="md:col-span-3">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-primary" />
                        Performance Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Safety Score</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.safetyScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.safetyScore}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Fuel Efficiency</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.fuelEfficiency}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.fuelEfficiency}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Time Management</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.timeManagement}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.timeManagement}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Vehicle Handling</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.vehicleHandling}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.vehicleHandling}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.customerSatisfaction}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.customerSatisfaction}%` }} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Stats and Activity Cards */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <BarChart className="h-4 w-4 mr-2 text-primary" />
                        Driver Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Route className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Total Mileage</span>
                        </div>
                        <span className="font-medium">{selectedDriverForDetails.mileage.toLocaleString()} mi</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Total Trips</span>
                        </div>
                        <span className="font-medium">{selectedDriverForDetails.trips}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Idle Time</span>
                        </div>
                        <span className="font-medium">{selectedDriverForDetails.idleTime}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Incidents</span>
                        </div>
                        <span className="font-medium">{selectedDriverForDetails.incidents}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <History className="h-4 w-4 mr-2 text-primary" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Placeholder for recent activity */}
                        <div className="text-sm text-muted-foreground text-center py-6">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p>Driver activity data will be displayed here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add VehicleModal component */}
      <VehicleModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        vehicle={selectedVehicle || undefined}
        onSubmit={handleSubmitVehicle}
      />

      {/* Add AlertDialog component for delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {vehicleToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}