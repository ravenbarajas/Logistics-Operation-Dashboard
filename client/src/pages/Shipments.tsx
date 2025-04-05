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
  
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipment Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddShipment}>
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Analytics Overview */}
      <div className="mb-6">
        
        {analyticsLoading || !summary ? (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            </CardContent>  
          </Card>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-2 p-2 bg-primary/10 rounded-full text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{summary.totalShipments}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1 gap-2">
                        <Badge variant="outline" className="font-normal rounded-sm">
                          {summary.inTransit} In Transit
                        </Badge>
                        <Badge variant="outline" className="font-normal rounded-sm">
                          {summary.pending} Pending
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">On Time Delivery Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-2 p-2 bg-green-500/10 rounded-full text-green-500">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{summary.onTimeDeliveryRate}%</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1 gap-2">
                        <Badge variant="destructive" className="font-normal rounded-sm">
                          {summary.delayedShipments} Delayed
                        </Badge>
                        <Badge variant="default" className="bg-green-500 font-normal rounded-sm">
                          {summary.delivered} Delivered
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-2 p-2 bg-blue-500/10 rounded-full text-blue-500">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{summary.averageDeliveryTime} hrs</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on {summary.delivered} completed shipments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-2 p-2 bg-amber-500/10 rounded-full text-amber-500">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{summary.totalDistance.toLocaleString()} mi</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Avg. {Math.round(summary.totalDistance / summary.totalShipments)} miles per shipment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    Monthly Shipment Performance
                  </CardTitle>
                  <CardDescription>
                    Number of shipments by status over time
                  </CardDescription>
          </CardHeader>
          <CardContent>
                  <AreaChart
                    className="h-72"
                    data={deliveryPerformanceData}
                    index="month"
                    categories={["On Time", "Delayed", "Cancelled"]}
                    colors={["emerald", "amber", "rose"]}
                    valueFormatter={(value: number) => `${value} shipments`}
                  />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    Shipment Volume by Region
                  </CardTitle>
                  <CardDescription>
                    Distribution of shipments across geographic regions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonutChart
                    className="h-72"
                    data={regionData}
                    category="value"
                    index="region"
                    colors={["indigo", "cyan", "amber", "emerald", "rose"]}
                    valueFormatter={(value: number) => `${value} shipments`}
                    label="Total Shipments"
                  />
                  <Legend
                    className="mt-3"
                    categories={regionData.map(r => r.region)}
                    colors={["indigo", "cyan", "amber", "emerald", "rose"]}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Operational KPIs Row */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Operational KPIs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {operationalKPIs.map((kpi, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{kpi.metric}</CardTitle>
          </CardHeader>
          <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{kpi.value}%</div>
                        <div className={`flex items-center ${
                          kpi.trend > 0 ? 'text-green-500' : kpi.trend < 0 ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {kpi.trend > 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : kpi.trend < 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                          ) : (
                            <LineChartIcon className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-sm">{Math.abs(kpi.trend)}%</span>
                        </div>
                      </div>
                      <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
                        <div 
                          className={`h-full ${kpi.value >= kpi.target ? 'bg-green-500' : 'bg-amber-500'}`} 
                          style={{ width: `${kpi.value}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground flex justify-between">
                        <span>Current</span>
                        <span>Target: {kpi.target}%</span>
                      </div>
          </CardContent>
        </Card>
                ))}
              </div>
            </div>
            
            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Route className="h-4 w-4 mr-2 text-primary" />
                    Route Efficiency by Category
                  </CardTitle>
                  <CardDescription>
                    Analysis of operational efficiency across different route types
                  </CardDescription>
          </CardHeader>
          <CardContent>
                  <BarChart
                    className="h-72"
                    data={routeEfficiencyData}
                    index="category"
                    categories={["efficiency", "target"]}
                    colors={["blue", "gray"]}
                    valueFormatter={(value: number) => `${value}%`}
                  />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Droplet className="h-4 w-4 mr-2 text-primary" />
                    CO₂ Emissions vs. Distance
                  </CardTitle>
                  <CardDescription>
                    Environmental impact relative to delivery distances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart
                    className="h-72"
                    data={emissionsData}
                    index="month"
                    categories={["emissions", "distance"]}
                    colors={["green", "blue"]}
                    valueFormatter={(value: number) => `${value}`}
                    yAxisWidth={60}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Carrier Performance */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-primary" />
                  Carrier Performance Analysis
                </CardTitle>
                <CardDescription>
                  Comparative analysis of carrier metrics across on-time performance, cost, and volume
                </CardDescription>
          </CardHeader>
          <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-center">On-Time Performance (%)</h4>
                    <BarChart
                      className="h-48"
                      data={carrierPerformance}
                      index="carrier"
                      categories={["onTime"]}
                      colors={["emerald"]}
                      valueFormatter={(value: number) => `${value}%`}
                      layout="vertical"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-center">Cost Efficiency ($)</h4>
                    <BarChart
                      className="h-48"
                      data={carrierPerformance}
                      index="carrier"
                      categories={["cost"]}
                      colors={["amber"]}
                      valueFormatter={(value: number) => `$${value}`}
                      layout="vertical"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-center">Shipment Volume</h4>
                    <BarChart
                      className="h-48"
                      data={carrierPerformance}
                      index="carrier"
                      categories={["volume"]}
                      colors={["indigo"]}
                      valueFormatter={(value: number) => `${value}`}
                      layout="vertical"
                    />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="font-medium">Best On-Time</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge className="bg-emerald-500">PremiumHaul</Badge>
                        <span className="text-xs">96%</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="font-medium">Most Cost-Effective</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge className="bg-amber-500">GlobalLogix</Badge>
                        <span className="text-xs">$4,800</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="font-medium">Highest Volume</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge className="bg-indigo-500">ExpressCarry</Badge>
                        <span className="text-xs">130 shipments</span>
                      </div>
                    </div>
                  </div>
                </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>
      
      <Tabs defaultValue="active" className="mb-8">
        <TabsList className="mb-4">
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
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Shipment Tracking - Only shown when a shipment is selected */}
      {selectedShipment && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <TruckIcon className="h-6 w-6 mr-2 text-primary" />
            Shipment Tracking
          </h2>
          <ShipmentTracking 
            shipment={selectedShipment} 
            onRefresh={fetchData}
          />
        </div>
      )}
      
      {/* Exception Handler Section */}
      <div className="mb-8">
        <ShipmentExceptionHandler 
          shipments={shipments} 
          onResolveException={(shipmentId, resolution) => {
            console.log(`Resolving exception for shipment ${shipmentId}: ${resolution}`);
            // You can add actual implementation here
          }}
          onRefresh={fetchData}
        />
      </div>
      
      {/* Route Efficiency Section */}
      <div className="mb-8">
        <RouteEfficiencyAnalyzer shipments={shipments} />
      </div>
      
      {/* Environmental Impact Section */}
      <div className="mb-8">
        <EnvironmentalImpactCalculator shipments={shipments} />
      </div>
      
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