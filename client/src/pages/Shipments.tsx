import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Plus, Filter, Calendar, Clock, RefreshCw, MapPin, Edit, Trash, 
  ChevronDown, Package, Truck, User, FileText, ExternalLink, Clipboard, AlertCircle,
  BarChartBig, Activity, Zap, TrendingUp, Target, LineChart as LineChartIcon, Route, Droplet,
  AlertTriangleIcon, RouteIcon, Leaf, TruckIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShipmentModal } from "@/components/shipments/ShipmentModal";
import { shipmentService } from "@/services/shipmentService";
import { Shipment } from "@shared/schema";
import { EnhancedTable } from "@/components/table/EnhancedTable";
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
  ShipmentSummary,
  ShipmentPerformanceByMonth,
  ShipmentVolumeByRegion,
  TopCustomer,
  PerformanceMetrics,
} from "@/services/shipmentService";
import {
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  Legend,
} from "@tremor/react";
import { ShipmentTracking } from "@/components/shipments/ShipmentTracking";
import { RouteEfficiencyAnalyzer } from "@/components/shipments/RouteEfficiencyAnalyzer";
import { EnvironmentalImpactCalculator } from "@/components/shipments/EnvironmentalImpactCalculator";
import { ShipmentExceptionHandler } from "@/components/shipments/ShipmentExceptionHandler";
import { useLocation } from "wouter";

// Extended Shipment interface with additional properties that might be needed
interface ExtendedShipment extends Shipment {
  driver?: string;
  vehicle?: string;
  description?: string;
  origin?: string;
  destination?: string;
  estimatedArrival?: string;
  deliveryTime?: string;
  distance?: number;
  departureDate?: string;
  fuelConsumption?: number;
  co2Emissions?: number;
  routeEfficiency?: number;
  loadUtilization?: number;
}

export default function Shipments() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Analytics state
  const [summary, setSummary] = useState<ShipmentSummary | null>(null);
  const [performanceByMonth, setPerformanceByMonth] = useState<ShipmentPerformanceByMonth[]>([]);
  const [volumeByRegion, setVolumeByRegion] = useState<ShipmentVolumeByRegion[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [routeEfficiencyData, setRouteEfficiencyData] = useState<{category: string, efficiency: number, target: number}[]>([]);
  const [emissionsData, setEmissionsData] = useState<{month: string, emissions: number, distance: number}[]>([]);
  const [carrierPerformance, setCarrierPerformance] = useState<{carrier: string, onTime: number, cost: number, volume: number}[]>([]);
  const [operationalKPIs, setOperationalKPIs] = useState<{metric: string, value: number, target: number, trend: number}[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | undefined>();
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null);

  // Get tab from URL query parameter
  const getTabFromUrl = () => {
    const path = location;
    if (path.includes("/shipments/exceptions")) {
      return "exceptions";
    } else if (path.includes("/shipments/efficiency")) {
      return "efficiency";
    } else if (path.includes("/shipments/environmental")) {
      return "environmental";
    } else if (path === "/shipments") {
      // Redirect base path to tracking
      window.history.replaceState({}, "", "/shipments/tracking");
      return "tracking";
    }
    return "tracking"; // Default to tracking
  };
  
  // Add state for main tab navigation with initial value from URL
  const [mainTabValue, setMainTabValue] = useState(getTabFromUrl);
  const [trackingQuery, setTrackingQuery] = useState("");
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [trackedShipment, setTrackedShipment] = useState<Shipment | null>(null);

  // Update tab value whenever location changes (handles sidebar navigation)
  useEffect(() => {
    setMainTabValue(getTabFromUrl());
  }, [location]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const shipmentsData = await shipmentService.getShipments();
      setShipments(shipmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      setAnalyticsLoading(true);
      const [
        summaryData,
        performanceData,
        volumeData,
        customersData,
        metricsData
      ] = await Promise.all([
        shipmentService.getShipmentSummary(),
        shipmentService.getShipmentPerformanceByMonth(),
        shipmentService.getShipmentVolumeByRegion(),
        shipmentService.getTopCustomers(),
        shipmentService.getPerformanceMetrics()
      ]);

      setSummary(summaryData);
      setPerformanceByMonth(performanceData);
      setVolumeByRegion(volumeData);
      setTopCustomers(customersData);
      setPerformanceMetrics(metricsData);
      
      // Mock data for new analytics components
      setRouteEfficiencyData([
        { category: 'Urban', efficiency: 87, target: 90 },
        { category: 'Suburban', efficiency: 92, target: 95 },
        { category: 'Rural', efficiency: 76, target: 80 },
        { category: 'Highway', efficiency: 94, target: 95 },
        { category: 'International', efficiency: 81, target: 85 }
      ]);
      
      setEmissionsData([
        { month: 'Jan', emissions: 42, distance: 12400 },
        { month: 'Feb', emissions: 38, distance: 11200 },
        { month: 'Mar', emissions: 45, distance: 13500 },
        { month: 'Apr', emissions: 39, distance: 11800 },
        { month: 'May', emissions: 47, distance: 14100 },
        { month: 'Jun', emissions: 41, distance: 12300 }
      ]);
      
      setCarrierPerformance([
        { carrier: 'SpeedFreight', onTime: 94, cost: 5200, volume: 120 },
        { carrier: 'GlobalLogix', onTime: 88, cost: 4800, volume: 105 },
        { carrier: 'ExpressCarry', onTime: 92, cost: 5500, volume: 130 },
        { carrier: 'TransitPro', onTime: 90, cost: 5100, volume: 118 },
        { carrier: 'PremiumHaul', onTime: 96, cost: 5800, volume: 125 }
      ]);
      
      setOperationalKPIs([
        { metric: 'Warehouse Utilization', value: 78, target: 85, trend: 5 },
        { metric: 'Load Optimization', value: 92, target: 95, trend: 3 },
        { metric: 'Cross-dock Efficiency', value: 83, target: 90, trend: -2 },
        { metric: 'Fleet Utilization', value: 87, target: 90, trend: 4 },
        { metric: 'Inventory Accuracy', value: 96, target: 98, trend: 1 }
      ]);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAnalyticsData();
    
    // Listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      // When browser back/forward is used, we need to update our tab state
      // based on the new URL
      setMainTabValue(getTabFromUrl());
    };
    
    // Listen for URL changes to update the active tab
    window.addEventListener("popstate", handlePopState);
    
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleAddShipment = () => {
    setSelectedShipment(undefined);
    setModalOpen(true);
  };

  const handleEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setModalOpen(true);
  };

  const handleDeleteShipment = (shipment: Shipment) => {
    setShipmentToDelete(shipment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!shipmentToDelete) return;
    
    try {
      await shipmentService.deleteShipment(shipmentToDelete.id);
      await fetchData();
      setDeleteDialogOpen(false);
      setShipmentToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete shipment');
    }
  };

  // Calculate summary data from shipments
  const totalShipments = shipments.length;
  const inTransit = shipments.filter(s => s.status === 'in-transit').length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;
  const pending = shipments.filter(s => s.status === 'pending').length;
  
  // Filter shipments based on status for different tabs
  const activeShipments = shipments.filter(s => 
    s.status === 'in-transit' || s.status === 'processing'
  );
  
  const completedShipments = shipments.filter(s => 
    s.status === 'delivered' || s.status === 'cancelled'
  );
  
  const scheduledShipments = shipments.filter(s => 
    s.status === 'pending' || s.status === 'scheduled'
  );

  // Prepare data for charts
  const deliveryPerformanceData = performanceByMonth?.map(month => ({
    month: month.month,
    "On Time": month.onTimeDelivery,
    "Delayed": month.delayedDelivery,
    "Cancelled": month.cancelled,
    Total: month.totalShipments,
  })) || [];

  const regionData = volumeByRegion?.map(region => ({
    region: region.region,
    value: region.count,
    percentage: region.percentage,
  })) || [];
  
  // Filter shipments based on search query and status filter
  const filteredActiveShipments = activeShipments.filter((shipment: ExtendedShipment) => {
    const matchesSearch = searchQuery === "" || 
      (shipment.trackingNumber && shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (shipment.description && shipment.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const filteredCompletedShipments = completedShipments.filter((shipment: ExtendedShipment) => {
    return searchQuery === "" || 
      (shipment.trackingNumber && shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (shipment.description && shipment.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const filteredScheduledShipments = scheduledShipments.filter((shipment: ExtendedShipment) => {
    return searchQuery === "" || 
      (shipment.trackingNumber && shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (shipment.description && shipment.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Define columns for active shipments
  const activeShipmentColumns = [
    {
      id: "trackingNumber",
      header: "Tracking #",
      accessorKey: "trackingNumber",
      enableSorting: true,
      meta: {
        className: "w-[120px]"
      }
    },
    {
      id: "shipmentInfo",
      header: "Shipment Info",
      accessorKey: "description",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div>
          <div className="font-medium flex items-center">
            <Package className="h-4 w-4 mr-2 text-primary" />
            {shipment.description || 'Shipment'}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {shipment.origin} → {shipment.destination}
          </div>
        </div>
      )
    },
    {
      id: "assignedTo",
      header: "Assigned To",
      accessorKey: "driver",
      cell: (shipment: ExtendedShipment) => (
        <div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span>{shipment.driver || 'Unassigned'}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Truck className="h-3 w-3 mr-1.5" />
            <span>{shipment.vehicle || 'No vehicle'}</span>
          </div>
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true
    },
    {
      id: "estimatedArrival",
      header: "ETA",
      accessorKey: "estimatedArrival",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{shipment.estimatedArrival || 'Unknown'}</span>
        </div>
      )
    },
    {
      id: "distance",
      header: "Distance",
      accessorKey: "distance",
      enableSorting: true,
      meta: {
        align: "center" as const
      },
      cell: (shipment: ExtendedShipment) => (
        <div className="text-center">
          {shipment.distance ? `${shipment.distance} mi` : 'N/A'}
        </div>
      )
    }
  ];

  // Define columns for completed shipments
  const completedShipmentColumns = [
    {
      id: "trackingNumber",
      header: "Tracking #",
      accessorKey: "trackingNumber",
      enableSorting: true,
      meta: {
        className: "w-[120px]"
      }
    },
    {
      id: "shipmentInfo",
      header: "Shipment Info",
      accessorKey: "description",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div>
          <div className="font-medium flex items-center">
            <Package className="h-4 w-4 mr-2 text-primary" />
            {shipment.description || 'Shipment'}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {shipment.origin} → {shipment.destination}
          </div>
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true
    },
    {
      id: "deliveryTime",
      header: "Delivery Time",
      accessorKey: "deliveryTime",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{shipment.deliveryTime || 'Unknown'}</span>
        </div>
      )
    },
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer",
      enableSorting: true
    }
  ];

  // Define columns for scheduled shipments
  const scheduledShipmentColumns = [
    {
      id: "trackingNumber",
      header: "Tracking #",
      accessorKey: "trackingNumber",
      enableSorting: true,
      meta: {
        className: "w-[120px]"
      }
    },
    {
      id: "shipmentInfo",
      header: "Shipment Info",
      accessorKey: "description",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div>
          <div className="font-medium flex items-center">
            <Package className="h-4 w-4 mr-2 text-primary" />
            {shipment.description || 'Shipment'}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {shipment.origin} → {shipment.destination}
          </div>
        </div>
      )
    },
    {
      id: "departure",
      header: "Scheduled Departure",
      accessorKey: "departureDate",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{shipment.departureDate || 'Not scheduled'}</span>
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true
    },
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer",
      enableSorting: true
    }
  ];

  // Define actions for active shipments
  const activeShipmentActions = [
    {
      label: "View Details",
      icon: <FileText className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("View details", shipment.id)
    },
    {
      label: "Track Shipment",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("Track shipment", shipment.trackingNumber)
    },
    {
      label: "Edit Shipment",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEditShipment
    },
    {
      label: "Delete Shipment",
      icon: <Trash className="h-4 w-4" />,
      onClick: handleDeleteShipment,
      variant: "destructive" as const
    }
  ];

  // Define actions for completed shipments
  const completedShipmentActions = [
    {
      label: "View Details",
      icon: <FileText className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("View details", shipment.id)
    },
    {
      label: "Get Receipt",
      icon: <Clipboard className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("Get receipt", shipment.id)
    },
    {
      label: "Delete Record",
      icon: <Trash className="h-4 w-4" />,
      onClick: handleDeleteShipment,
      variant: "destructive" as const
    }
  ];

  // Define actions for scheduled shipments
  const scheduledShipmentActions = [
    {
      label: "View Details",
      icon: <FileText className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("View details", shipment.id)
    },
    {
      label: "Edit Shipment",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEditShipment
    },
    {
      label: "Start Shipment",
      icon: <AlertCircle className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("Start shipment", shipment.id)
    },
    {
      label: "Delete Shipment",
      icon: <Trash className="h-4 w-4" />,
      onClick: handleDeleteShipment,
      variant: "destructive" as const
    }
  ];

  // Status color map
  const statusColorMap = {
    "in-transit": { color: "green", label: "In Transit" },
    "processing": { color: "blue", label: "Processing" },
    "delivered": { color: "gray", label: "Delivered" },
    "cancelled": { color: "red", label: "Cancelled" },
    "pending": { color: "amber", label: "Pending" },
    "scheduled": { color: "purple", label: "Scheduled" }
  };
  
  // Handler for tracking shipments on the dedicated tracking tab
  const handleTrackShipment = () => {
    if (!trackingQuery) {
      setTrackingError("Please enter a tracking number");
      return;
    }
    
    const foundShipment = shipments.find(s => 
      s.trackingNumber && s.trackingNumber.toLowerCase().includes(trackingQuery.toLowerCase())
    );
    
    if (foundShipment) {
      setTrackedShipment(foundShipment);
      setTrackingError(null);
    } else {
      setTrackingError("No shipment found with that tracking number");
      setTrackedShipment(null);
    }
  };
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    // Set the tab state
    setMainTabValue(value);
    
    // Update URL without full page reload using path-based navigation
    if (value === "tracking") {
      window.history.pushState({}, "", "/shipments/tracking");
    } else if (value === "exceptions") {
      window.history.pushState({}, "", "/shipments/exceptions");
    } else if (value === "efficiency") {
      window.history.pushState({}, "", "/shipments/efficiency");
    } else if (value === "environmental") {
      window.history.pushState({}, "", "/shipments/environmental");
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipment Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddShipment}>
            <Plus className="h-4 w-4 mr-2" />
            Add Shipment
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Shipment Summary Cards Section - Different cards for each tab */}
      {summary && (
        <>
          {/* Tracking Tab KPIs */}
          {mainTabValue === "tracking" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalShipments}</div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">All time shipment count</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{summary.inTransit}</div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Currently in transit</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{summary.onTimeDeliveryRate}%</div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Deliveries on time</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">
                    {Math.round(summary.totalShipments * 0.05)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Completed deliveries today</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Exceptions Tab KPIs */}
          {mainTabValue === "exceptions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Exceptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{summary.delayedShipments}</div>
                  <div className="flex items-center">
                    <AlertTriangleIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Issues requiring attention</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {Math.round(summary.delayedShipments * 0.3)}
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">High priority issues</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">78%</div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Issues resolved within 24h</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">16.4 hrs</div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Average time to resolve</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Efficiency Tab KPIs */}
          {mainTabValue === "efficiency" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Route Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">87.3%</div>
                  <div className="flex items-center">
                    <RouteIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Average route optimization</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Miles per Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">32.6 mi</div>
                  <div className="flex items-center">
                    <TruckIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Average distance per delivery</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Load Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">81.4%</div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Average truck capacity used</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Delivery Density</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">5.7</div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Deliveries per route</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Environmental Tab KPIs */}
          {mainTabValue === "environmental" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CO₂ Emissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">-12.5%</div>
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Reduction from last quarter</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Fuel Consumption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">4.8 gal/100mi</div>
                  <div className="flex items-center">
                    <Droplet className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Average fuel efficiency</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Electric Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">23.4%</div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Of fleet using electric power</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">1,256 t</div>
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">CO₂ offset this year</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
      
      {/* Main Tabs Navigation */}
      <Tabs value={mainTabValue} onValueChange={handleTabChange} className="mb-8 space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="tracking" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Tracking
          </TabsTrigger>
          <TabsTrigger value="exceptions" className="flex items-center">
            <AlertTriangleIcon className="h-4 w-4 mr-2" />
            Exceptions
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center">
            <Route className="h-4 w-4 mr-2" />
            Efficiency
          </TabsTrigger>
          <TabsTrigger value="environmental" className="flex items-center">
            <Leaf className="h-4 w-4 mr-2" />
            Environmental
          </TabsTrigger>
        </TabsList>
        
        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-4">
          {/* Shipment Tracking Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-primary" />
                Shipment Tracking
              </CardTitle>
              <CardDescription>
                Enter a tracking number to view detailed shipment information and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Shipment Management Section */}
              <div className="mb-8">
                <Tabs defaultValue="active" className="mb-6 space-y-6">
                  <TabsList className="grid grid-cols-3 w-full md:w-auto">
                    <TabsTrigger value="active">Active Shipments ({filteredActiveShipments.length})</TabsTrigger>
                    <TabsTrigger value="history">Shipment History ({filteredCompletedShipments.length})</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled ({filteredScheduledShipments.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <CardTitle className="flex items-center mb-1">
                              <Truck className="h-5 w-5 mr-2 text-primary" />
                              Active Shipments ({filteredActiveShipments.length})
                            </CardTitle>
                        <CardDescription>Manage your current shipments in progress</CardDescription>
                          </div>
                          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="flex gap-2 items-center">
                            <div className="flex items-center">
                              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm mr-2">Status:</span>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="in-transit">In Transit</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="scheduled">Scheduled</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <EnhancedTable
                          data={filteredActiveShipments}
                          columns={activeShipmentColumns}
                          actions={activeShipmentActions}
                          searchKey="trackingNumber"
                          searchPlaceholder="Search by tracking number..."
                          statusKey="status"
                          statusMap={statusColorMap}
                          emptyMessage="No active shipments found"
                          onRowClick={(shipment) => setSelectedShipment(shipment)}
                          rowClassName="cursor-pointer hover:bg-muted/50"
                        />
                      </CardContent>
                      {selectedShipment && (
                        <ShipmentTracking 
                          shipment={selectedShipment} 
                          onRefresh={fetchData}
                        />
                      )}
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="history" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          Shipment History
                        </CardTitle>
                        <CardDescription>View completed and cancelled shipments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <EnhancedTable
                          data={filteredCompletedShipments}
                          columns={completedShipmentColumns}
                          actions={completedShipmentActions}
                          searchKey="trackingNumber"
                          searchPlaceholder="Search by tracking number..."
                          statusKey="status"
                          statusMap={statusColorMap}
                          emptyMessage="No shipment history found"
                          onRowClick={(shipment) => setSelectedShipment(shipment)}
                          rowClassName="cursor-pointer hover:bg-muted/50"
                        />
                      </CardContent>
                      {selectedShipment && (
                        <ShipmentTracking 
                          shipment={selectedShipment} 
                          onRefresh={fetchData}
                        />
                      )}
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="scheduled" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-primary" />
                          Scheduled Shipments
                        </CardTitle>
                        <CardDescription>Upcoming shipments waiting to be processed</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <EnhancedTable
                          data={filteredScheduledShipments}
                          columns={scheduledShipmentColumns}
                          actions={scheduledShipmentActions}
                          searchKey="trackingNumber"
                          searchPlaceholder="Search by tracking number..."
                          statusKey="status"
                          statusMap={statusColorMap}
                          emptyMessage="No scheduled shipments found"
                          onRowClick={(shipment) => setSelectedShipment(shipment)}
                          rowClassName="cursor-pointer hover:bg-muted/50"
                        />
                      </CardContent>
                      {selectedShipment && (
                        <ShipmentTracking 
                          shipment={selectedShipment} 
                          onRefresh={fetchData}
                        />
                      )}
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Exceptions Tab */}
        <TabsContent value="exceptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangleIcon className="h-5 w-5 mr-2 text-primary" />
                Shipment Exceptions
              </CardTitle>
              <CardDescription>Monitor and handle shipment exceptions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center p-4">Loading exception data...</div>
              ) : (
                <ShipmentExceptionHandler 
                  shipments={shipments} 
                  onResolveException={(shipmentId, resolution) => {
                    console.log(`Resolving exception for shipment ${shipmentId}: ${resolution}`);
                    // You can add actual implementation here
                  }}
                  onRefresh={fetchData}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Efficiency Tab */}
        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="h-5 w-5 mr-2 text-primary" />
                Route Efficiency
              </CardTitle>
              <CardDescription>Analyze and optimize your shipment routes</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center p-4">Loading efficiency data...</div>
              ) : (
                <RouteEfficiencyAnalyzer shipments={shipments} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Environmental Tab */}
        <TabsContent value="environmental" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-primary" />
                Environmental Impact
              </CardTitle>
              <CardDescription>Monitor and reduce the environmental footprint of your shipments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center p-4">Loading environmental data...</div>
              ) : (
                <EnvironmentalImpactCalculator shipments={shipments} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <ShipmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        shipment={selectedShipment}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the shipment with tracking number 
              {shipmentToDelete && ` ${shipmentToDelete.trackingNumber}`}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}