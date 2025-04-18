import { useState, useEffect } from "react";
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
import { VehicleModal } from "@/components/vehicles/VehicleModal";
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

// Sample maintenance records data
const maintenanceRecords = [
  {
    id: 1,
    vehicleId: 1,
    vehicleName: "Delivery Truck 1",
    type: "routine",
    status: "completed" as const,
    date: new Date('2023-12-15'),
    cost: 450,
    description: "Regular maintenance and oil change",
    technician: "Mike Johnson"
  },
  {
    id: 2,
    vehicleId: 2,
    vehicleName: "Delivery Van 1",
    type: "repair",
    status: "completed" as const,
    date: new Date('2023-11-28'),
    cost: 825,
    description: "Brake replacement and suspension check",
    technician: "Sarah Rodriguez"
  },
  {
    id: 3,
    vehicleId: 3,
    vehicleName: "Cargo Truck 1",
    type: "inspection",
    status: "scheduled" as const,
    date: new Date('2024-02-12'),
    description: "Annual safety inspection",
    technician: "Quality Fleet Services"
  },
  {
    id: 4,
    vehicleId: 4,
    vehicleName: "Refrigerated Truck",
    type: "emergency",
    status: "completed" as const,
    date: new Date('2024-01-05'),
    cost: 1250,
    description: "Cooling system repair",
    technician: "TechCool Repairs"
  },
  {
    id: 5,
    vehicleId: 1,
    vehicleName: "Delivery Truck 1",
    type: "routine",
    status: "scheduled" as const,
    date: new Date('2024-03-10'),
    description: "Regular maintenance and filter replacement"
  },
  {
    id: 6,
    vehicleId: 5,
    vehicleName: "Electric Van",
    type: "inspection",
    status: "overdue" as const,
    date: new Date('2024-01-20'),
    description: "Battery system check"
  },
  {
    id: 7,
    vehicleId: 7,
    vehicleName: "City Delivery Van",
    type: "repair",
    status: "scheduled" as const,
    date: new Date('2024-02-28'),
    cost: 350,
    description: "Door latch replacement and alignment"
  }
];

// Sample fuel records data
const fuelRecords = [
  {
    id: 1,
    vehicleId: 1,
    vehicleName: "Delivery Truck 1",
    date: new Date('2024-01-05'),
    gallons: 45.6,
    cost: 147.2,
    mileage: 46500
  },
  {
    id: 2,
    vehicleId: 1,
    vehicleName: "Delivery Truck 1",
    date: new Date('2024-01-15'),
    gallons: 50.2,
    cost: 161.6,
    mileage: 47250,
    mpg: 14.9
  },
  {
    id: 3,
    vehicleId: 2,
    vehicleName: "Delivery Van 1",
    date: new Date('2024-01-08'),
    gallons: 28.4,
    cost: 91.5,
    mileage: 39200
  },
  {
    id: 4,
    vehicleId: 2,
    vehicleName: "Delivery Van 1",
    date: new Date('2024-01-20'),
    gallons: 25.7,
    cost: 82.8,
    mileage: 39850,
    mpg: 25.3
  },
  {
    id: 5,
    vehicleId: 4,
    vehicleName: "Refrigerated Truck",
    date: new Date('2024-01-12'),
    gallons: 42.3,
    cost: 136.2,
    mileage: 35800
  },
  {
    id: 6,
    vehicleId: 4,
    vehicleName: "Refrigerated Truck",
    date: new Date('2024-01-25'),
    gallons: 38.9,
    cost: 125.3,
    mileage: 36420,
    mpg: 15.9
  }
];

// Sample fuel analytics data
const vehicleFuelData = [
  {
    id: 1,
    name: "Heavy Trucks",
    type: "Heavy Duty",
    currentFuelLevel: 72,
    averageMPG: 12.5,
    monthlyFuelCost: [1250, 1350, 1480, 1320, 1460, 1520],
    fuelConsumption: [310, 325, 350, 320, 340, 365]
  },
  {
    id: 2,
    name: "Medium Trucks",
    type: "Medium Duty",
    currentFuelLevel: 45,
    averageMPG: 16.8,
    monthlyFuelCost: [980, 1050, 1120, 980, 1040, 1150],
    fuelConsumption: [240, 255, 275, 240, 255, 280]
  },
  {
    id: 3,
    name: "Light Vans",
    type: "Light Duty",
    currentFuelLevel: 88,
    averageMPG: 23.5,
    monthlyFuelCost: [620, 580, 650, 690, 720, 750],
    fuelConsumption: [160, 150, 170, 180, 190, 195]
  }
];

// Analytics data
const analyticsData = {
  vehicleTypes: [
    { name: 'Heavy Truck', value: 3 },
    { name: 'Medium Truck', value: 3 },
    { name: 'Light Van', value: 3 },
    { name: 'Specialty', value: 1 }
  ],
  vehicleStatus: [
    { name: 'Active', value: 7 },
    { name: 'Maintenance', value: 2 },
    { name: 'Inactive', value: 1 }
  ],
  fuelConsumption: [
    { name: 'Heavy Trucks', value: 365 },
    { name: 'Medium Trucks', value: 280 },
    { name: 'Light Vans', value: 195 },
    { name: 'Specialty', value: 120 }
  ],
  monthlyMileage: [
    { name: 'Sep', value: 28500 },
    { name: 'Oct', value: 32400 },
    { name: 'Nov', value: 30200 },
    { name: 'Dec', value: 27800 },
    { name: 'Jan', value: 34200 },
    { name: 'Feb', value: 36500 }
  ],
  metrics: {
    fuelEfficiency: [12.2, 16.4, 22.8, 11.9, 15.8, 22.5, 12.5, 16.9, 23.1, 12.8, 17.2, 23.5],
    maintenanceCosts: [4500, 3200, 1800, 3800, 2900, 1400, 5200, 3600, 2100, 4800, 3100, 1700],
    utilizationRate: [85, 75, 65, 82, 78, 68, 88, 80, 72, 90, 82, 76],
    idleTime: [8.5, 7.2, 6.1, 9.2, 5.4]
  }
};

// Add some sample data for the new tables
const vehicleAssignmentStats = [
  { departmentName: "Distribution", totalVehicles: 4, activeVehicles: 3, utilization: 85 },
  { departmentName: "Sales", totalVehicles: 3, activeVehicles: 2, utilization: 62 },
  { departmentName: "Support", totalVehicles: 2, activeVehicles: 2, utilization: 90 },
  { departmentName: "Administration", totalVehicles: 1, activeVehicles: 1, utilization: 45 }
];

const upcomingMaintenance = [
  { id: 101, vehicleName: "Delivery Truck 2", type: "Oil Change", date: new Date('2024-03-15'), estimatedCost: 150, status: "scheduled" },
  { id: 102, vehicleName: "Van 3", type: "Tire Rotation", date: new Date('2024-03-18'), estimatedCost: 80, status: "scheduled" },
  { id: 103, vehicleName: "Cargo Truck", type: "Inspection", date: new Date('2024-03-21'), estimatedCost: 120, status: "scheduled" },
  { id: 104, vehicleName: "Delivery Truck 3", type: "Brake Service", date: new Date('2024-03-25'), estimatedCost: 350, status: "pending" }
];

const vehicleActivityData = [
  { date: "2024-02-01", active: 6, maintenance: 3, inactive: 1 },
  { date: "2024-02-08", active: 7, maintenance: 2, inactive: 1 },
  { date: "2024-02-15", active: 8, maintenance: 1, inactive: 1 },
  { date: "2024-02-22", active: 7, maintenance: 2, inactive: 1 },
  { date: "2024-03-01", active: 6, maintenance: 3, inactive: 1 },
  { date: "2024-03-08", active: 7, maintenance: 2, inactive: 1 }
];

// Sample expanded fleet with location data for a medium-sized logistics company
const expandedFleetData: ExtendedVehicle[] = [
  {
    id: 1,
    name: "Heavy Truck #101",
    type: "Heavy Duty",
    status: "active",
    make: "Peterbilt",
    model: "579",
    year: 2022,
    licensePlate: "LGX-1457",
    vinNumber: "1XPWD40X1VD792003",
    currentLocation: null,
    lastMaintenance: new Date('2023-12-15'),
    nextMaintenance: new Date('2024-03-15'),
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2023-12-15'),
    fuelLevel: 72,
    mileage: 56500,
    location: { lat: 40.7128, lng: -74.0060, lastUpdated: new Date() }, // NYC
    assignedDriver: "Miguel Rodriguez",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 2,
    name: "Heavy Truck #102",
    type: "Heavy Duty",
    status: "active",
    make: "Kenworth",
    model: "T680",
    year: 2021,
    licensePlate: "LGX-8224",
    vinNumber: "1XKYD49X5VJ793412",
    currentLocation: null,
    lastMaintenance: new Date('2023-11-28'),
    nextMaintenance: new Date('2024-02-28'),
    createdAt: new Date('2021-10-10'),
    updatedAt: new Date('2023-11-28'),
    fuelLevel: 45,
    mileage: 76800,
    location: { lat: 34.0522, lng: -118.2437, lastUpdated: new Date() }, // LA
    assignedDriver: "David Chen",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 3,
    name: "Medium Truck #201",
    type: "Medium Duty",
    status: "active",
    make: "Freightliner",
    model: "M2 106",
    year: 2020,
    licensePlate: "LGX-5562",
    vinNumber: "1FVACXDT6FHHA2547",
    currentLocation: null,
    lastMaintenance: new Date('2023-10-15'),
    nextMaintenance: new Date('2024-01-15'),
    createdAt: new Date('2020-08-05'),
    updatedAt: new Date('2023-10-15'),
    fuelLevel: 80,
    mileage: 45000,
    location: { lat: 29.7604, lng: -95.3698, lastUpdated: new Date() }, // Houston
    assignedDriver: "Marcus Johnson",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 4,
    name: "Medium Truck #202",
    type: "Medium Duty",
    status: "maintenance",
    make: "Hino",
    model: "338",
    year: 2019,
    licensePlate: "LGX-2456",
    vinNumber: "5PVNJ8JH0G4S87712",
    currentLocation: null,
    lastMaintenance: new Date('2023-12-01'),
    nextMaintenance: new Date('2024-03-01'),
    createdAt: new Date('2019-05-20'),
    updatedAt: new Date('2023-12-01'),
    fuelLevel: 30,
    mileage: 85200,
    location: { lat: 41.8781, lng: -87.6298, lastUpdated: new Date() }, // Chicago
    assignedDriver: "Sarah Miller",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 5,
    name: "Medium Truck #203",
    type: "Medium Duty",
    status: "active",
    make: "Isuzu",
    model: "NPR-HD",
    year: 2021,
    licensePlate: "LGX-1078",
    vinNumber: "JALC4B16XP7000104",
    currentLocation: null,
    lastMaintenance: new Date('2023-09-15'),
    nextMaintenance: new Date('2024-01-15'),
    createdAt: new Date('2021-04-10'),
    updatedAt: new Date('2023-09-15'),
    fuelLevel: 65,
    mileage: 38500,
    location: { lat: 32.7767, lng: -96.7970, lastUpdated: new Date() }, // Dallas
    assignedDriver: "Jackson Lee",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 6,
    name: "Delivery Van #301",
    type: "Light Duty",
    status: "active",
    make: "Mercedes-Benz",
    model: "Sprinter",
    year: 2022,
    licensePlate: "LGX-7733",
    vinNumber: "WDZPE7CD0GP211339",
    currentLocation: null,
    lastMaintenance: new Date('2023-10-28'),
    nextMaintenance: new Date('2024-01-28'),
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2023-10-28'),
    fuelLevel: 82,
    mileage: 25600,
    location: { lat: 33.7490, lng: -84.3880, lastUpdated: new Date() }, // Atlanta
    assignedDriver: "Emily Wang",
    departmentId: 2,
    departmentName: "Sales"
  },
  {
    id: 7,
    name: "Delivery Van #302",
    type: "Light Duty",
    status: "active",
    make: "Ford",
    model: "Transit",
    year: 2021,
    licensePlate: "LGX-4219",
    vinNumber: "1FTYE2CM3GKA78544",
    currentLocation: null,
    lastMaintenance: new Date('2023-11-15'),
    nextMaintenance: new Date('2024-02-15'),
    createdAt: new Date('2021-05-20'),
    updatedAt: new Date('2023-11-15'),
    fuelLevel: 55,
    mileage: 32400,
    location: { lat: 39.9526, lng: -75.1652, lastUpdated: new Date() }, // Philadelphia
    assignedDriver: "Rachel Green",
    departmentId: 2,
    departmentName: "Sales"
  },
  {
    id: 8,
    name: "Delivery Van #303",
    type: "Light Duty",
    status: "maintenance",
    make: "RAM",
    model: "ProMaster",
    year: 2020,
    licensePlate: "LGX-9902",
    vinNumber: "3C6TRVDG7JE102484",
    currentLocation: null,
    lastMaintenance: new Date('2023-12-05'),
    nextMaintenance: new Date('2024-03-05'),
    createdAt: new Date('2020-07-12'),
    updatedAt: new Date('2023-12-05'),
    fuelLevel: 25,
    mileage: 48900,
    location: { lat: 38.9072, lng: -77.0369, lastUpdated: new Date() }, // DC
    assignedDriver: "Tyler Jackson",
    departmentId: 2,
    departmentName: "Sales"
  },
  {
    id: 9,
    name: "Cargo Van #401",
    type: "Light Duty",
    status: "active",
    make: "Chevrolet",
    model: "Express",
    year: 2020,
    licensePlate: "LGX-5511",
    vinNumber: "1GCWGBFG4K1123456",
    currentLocation: null,
    lastMaintenance: new Date('2023-11-20'),
    nextMaintenance: new Date('2024-02-20'),
    createdAt: new Date('2020-03-25'),
    updatedAt: new Date('2023-11-20'),
    fuelLevel: 70,
    mileage: 39700,
    location: { lat: 42.3601, lng: -71.0589, lastUpdated: new Date() }, // Boston
    assignedDriver: "Jessica Thomas",
    departmentId: 3,
    departmentName: "Support"
  },
  {
    id: 10,
    name: "Maintenance Truck",
    type: "Specialty",
    status: "active",
    make: "GMC",
    model: "Sierra 2500HD",
    year: 2021,
    licensePlate: "LGX-7890",
    vinNumber: "1GT49REY1MF204391",
    currentLocation: null,
    lastMaintenance: new Date('2023-10-10'),
    nextMaintenance: new Date('2024-01-10'),
    createdAt: new Date('2021-01-15'),
    updatedAt: new Date('2023-10-10'),
    fuelLevel: 60,
    mileage: 28500,
    location: { lat: 37.7749, lng: -122.4194, lastUpdated: new Date() }, // SF
    assignedDriver: "Chris Martinez",
    departmentId: 3,
    departmentName: "Support"
  },
  {
    id: 11,
    name: "Executive Car",
    type: "Light Duty",
    status: "active",
    make: "Tesla",
    model: "Model Y",
    year: 2022,
    licensePlate: "LGX-1234",
    vinNumber: "5YJ3E1EA9NF567890",
    currentLocation: null,
    lastMaintenance: new Date('2023-12-05'),
    nextMaintenance: new Date('2024-03-05'),
    createdAt: new Date('2022-02-10'),
    updatedAt: new Date('2023-12-05'),
    fuelLevel: 90,
    mileage: 15200,
    location: { lat: 47.6062, lng: -122.3321, lastUpdated: new Date() }, // Seattle
    assignedDriver: "Amanda Wilson",
    departmentId: 4,
    departmentName: "Administration"
  },
  {
    id: 12,
    name: "Refrigerated Truck",
    type: "Heavy Duty",
    status: "inactive",
    make: "Volvo",
    model: "VNL 760",
    year: 2019,
    licensePlate: "LGX-6543",
    vinNumber: "4V4NC9EH5KN123456",
    currentLocation: null,
    lastMaintenance: new Date('2023-08-20'),
    nextMaintenance: null,
    createdAt: new Date('2019-06-10'),
    updatedAt: new Date('2023-08-20'),
    fuelLevel: 15,
    mileage: 112500,
    location: { lat: 36.1699, lng: -115.1398, lastUpdated: new Date() }, // Las Vegas
    assignedDriver: undefined,
    departmentId: 1,
    departmentName: "Distribution"
  }
];

// Add this sample data near the top where other sample data is defined
const monthlyFuelData = [
  { month: 'Jan', consumption: 2850, cost: 9245, avgPrice: 3.25, vehicles: 8 },
  { month: 'Feb', consumption: 2650, cost: 8745, avgPrice: 3.30, vehicles: 8 },
  { month: 'Mar', consumption: 2950, cost: 9835, avgPrice: 3.33, vehicles: 9 },
  { month: 'Apr', consumption: 2750, cost: 9350, avgPrice: 3.40, vehicles: 9 },
  { month: 'May', consumption: 2800, cost: 9520, avgPrice: 3.40, vehicles: 9 },
  { month: 'Jun', consumption: 3100, cost: 10695, avgPrice: 3.45, vehicles: 10 }
];

const vehicleFuelConsumption = [
  { id: 'TR-101', name: 'Heavy Truck #101', type: 'Heavy Duty', lastMonth: 485, thisMonth: 512, efficiency: 92 },
  { id: 'TR-102', name: 'Heavy Truck #102', type: 'Heavy Duty', lastMonth: 465, thisMonth: 478, efficiency: 88 },
  { id: 'VN-201', name: 'Delivery Van #201', type: 'Light Duty', lastMonth: 225, thisMonth: 238, efficiency: 95 },
  { id: 'VN-202', name: 'Delivery Van #202', type: 'Light Duty', lastMonth: 215, thisMonth: 225, efficiency: 94 },
  { id: 'TR-103', name: 'Medium Truck #103', type: 'Medium Duty', lastMonth: 345, thisMonth: 368, efficiency: 90 }
];

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
  
  // Update the fetchData function to use the mock data enhancements
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Simulating API call with expanded data
      // In a real app, this would be an actual API call
      const vehiclesData = expandedFleetData;
      
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

  // Existing driver data
  const driversData = [
    {
      id: "1",
      name: "Michael Johnson",
      avatar: null,
      safetyScore: 94,
      fuelEfficiency: 87,
      timeManagement: 92,
      vehicleHandling: 88,
      customerSatisfaction: 95,
      idleTime: 8,
      mileage: 24568,
      trips: 342,
      incidents: 0
    },
    {
      id: "2",
      name: "Sarah Williams",
      avatar: null,
      safetyScore: 92,
      fuelEfficiency: 90,
      timeManagement: 85,
      vehicleHandling: 91,
      customerSatisfaction: 96,
      idleTime: 12,
      mileage: 18975,
      trips: 278,
      incidents: 1
    },
    {
      id: "3",
      name: "David Rodriguez",
      avatar: null,
      safetyScore: 88,
      fuelEfficiency: 82,
      timeManagement: 90,
      vehicleHandling: 85,
      customerSatisfaction: 89,
      idleTime: 14,
      mileage: 31250,
      trips: 405,
      incidents: 2
    },
    {
      id: "4",
      name: "Emily Chen",
      avatar: null,
      safetyScore: 96,
      fuelEfficiency: 94,
      timeManagement: 93,
      vehicleHandling: 92,
      customerSatisfaction: 97,
      idleTime: 6,
      mileage: 15820,
      trips: 215,
      incidents: 0
    },
    {
      id: "5",
      name: "James Wilson",
      avatar: null,
      safetyScore: 85,
      fuelEfficiency: 79,
      timeManagement: 82,
      vehicleHandling: 86,
      customerSatisfaction: 88,
      idleTime: 18,
      mileage: 28430,
      trips: 356,
      incidents: 3
    }
  ];

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
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fleet Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddVehicle}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Fleet Summary Cards Section */}
      {fleetSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fleetSummary.totalVehicles}</div>
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
              <div className="text-2xl font-bold text-green-500">{fleetSummary.activeVehicles}</div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{fleetSummary.activePercentage}% of total fleet</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{fleetSummary.inMaintenance}</div>
              <div className="flex items-center">
                <Settings className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{fleetSummary.maintenancePercentage}% of total fleet</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Out of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{fleetSummary.outOfService}</div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{fleetSummary.outOfServicePercentage}% of total fleet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interactive Fleet Map */}
      <div className="mb-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-background border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Map className="h-5 w-5 mr-2 text-primary" />
                  Fleet Location Overview
                </CardTitle>
                <CardDescription>Real-time locations and status of all fleet vehicles</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Map
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <FleetMap 
              vehicles={filteredVehicles as ExtendedVehicle[]} 
              height="400px"
              onVehicleSelect={handleViewDetails}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tab Content Section */}
      <div className="mb-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full md:w-auto">
            <TabsTrigger value="vehicles">
              <Truck className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Vehicles</span>
            </TabsTrigger>
            <TabsTrigger value="drivers">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Drivers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-background border-b">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-xl">
                        <Truck className="h-5 w-5 mr-2 text-primary" />
                        Vehicle Inventory
                      </CardTitle>
                      <CardDescription>Manage your fleet vehicles and their details</CardDescription>
                    </div>
                    <Button onClick={handleAddVehicle}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="relative w-full md:w-auto flex-1 max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search vehicles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                        <SelectItem value="maintenance">In Maintenance</SelectItem>
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
              </CardHeader>
              
              {/* Batch Operations */}
              {selectedVehicles.length > 0 && (
                <div className="p-3 bg-muted/30 border-b">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-2">{selectedVehicles.length}</Badge>
                      <span className="text-sm font-medium">vehicles selected</span>
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
                      <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedVehicles([])}>
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <CardContent className="p-0">
                {filteredVehicles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 p-6">
                    <Truck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-center mb-2">No vehicles found</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {searchQuery || statusFilter !== "all" 
                        ? "Try adjusting your search filters to find what you're looking for." 
                        : "Get started by adding your first vehicle to the fleet."}
                    </p>
                    {!searchQuery && statusFilter === "all" && (
                      <Button onClick={handleAddVehicle}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
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
                                checked={selectedVehicles.length === paginatedVehicles.length && paginatedVehicles.length > 0}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedVehicles(paginatedVehicles.map(v => v.id.toString()));
                                  } else {
                                    setSelectedVehicles([]);
                                  }
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </th>
                            <th className="py-3 px-4 text-left font-medium w-[60px]">ID</th>
                            <th className="py-3 px-4 text-left font-medium">Vehicle</th>
                            <th className="py-3 px-4 text-left font-medium">Type</th>
                            <th className="py-3 px-4 text-left font-medium">Status</th>
                            <th className="py-3 px-4 text-left font-medium">Last Maintenance</th>
                            <th className="py-3 px-4 text-center font-medium">Fuel</th>
                            <th className="py-3 px-4 text-right font-medium">Mileage</th>
                            <th className="py-3 px-4 text-left font-medium">Driver</th>
                            <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paginatedVehicles.map((vehicle) => {
                            const statusColor = vehicle.status === 'active' ? 'green' : 
                              vehicle.status === 'maintenance' ? 'amber' : 'red';
                            const statusLabel = vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1);
                            
                            return (
                              <tr 
                                key={vehicle.id} 
                                className="hover:bg-muted/50 transition-colors"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedVehicles.includes(vehicle.id.toString())}
                                    onChange={() => handleToggleVehicleSelection(vehicle.id.toString())}
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm">{vehicle.id}</td>
                                <td className="py-3 px-4">
                                  <div className="font-medium flex items-center">
                                    <Truck className="h-4 w-4 mr-2 text-primary" />
                                    {vehicle.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {(vehicle as ExtendedVehicle).make || 'N/A'} {(vehicle as ExtendedVehicle).model || ''} 
                                    {(vehicle as ExtendedVehicle).year ? ` (${(vehicle as ExtendedVehicle).year})` : ''}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm">{vehicle.type}</td>
                                <td className="py-3 px-4">
                                  <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
                                    {statusLabel}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  <div className="flex items-center">
                                    <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>
                                      {(vehicle as ExtendedVehicle).lastMaintenance 
                                        ? (typeof (vehicle as ExtendedVehicle).lastMaintenance === 'string' 
                                          ? (vehicle as ExtendedVehicle).lastMaintenance 
                                          : ((vehicle as ExtendedVehicle).lastMaintenance instanceof Date)
                                              ? (vehicle as ExtendedVehicle).lastMaintenance.toLocaleDateString()
                                              : String((vehicle as ExtendedVehicle).lastMaintenance))
                                        : "N/A"}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex flex-col items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[80px]">
                                      <div 
                                        className="bg-primary h-2 rounded-full" 
                                        style={{ width: `${(vehicle as ExtendedVehicle).fuelLevel ?? 0}%` }}
                                      />
                                    </div>
                                    <div className="text-xs mt-1 text-muted-foreground">
                                      {(vehicle as ExtendedVehicle).fuelLevel ?? 0}%
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-right">
                                  {(vehicle as ExtendedVehicle).mileage ? (vehicle as ExtendedVehicle).mileage.toLocaleString() : 0} mi
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  {(vehicle as ExtendedVehicle).assignedDriver || "Unassigned"}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleViewDetails(vehicle as ExtendedVehicle)} 
                                      className="h-8 w-8"
                                      title="View Details"
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleEditVehicle(vehicle)} 
                                      className="h-8 w-8"
                                      title="Edit Vehicle"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleDeleteVehicle(vehicle)} 
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                      title="Delete Vehicle"
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
                          Showing {Math.min((currentPage - 1) * pageSize + 1, filteredVehicles.length)} to {Math.min(currentPage * pageSize, filteredVehicles.length)} of {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
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

          <TabsContent value="drivers" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-background border-b">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-xl">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        Driver Performance Analysis
                      </CardTitle>
                      <CardDescription>Comprehensive metrics and analytics for your fleet drivers</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddDriver}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Driver
                    </Button>
                  </div>
                  
                  {/* Move the tabs here, above the search/filter controls */}
                  <Tabs defaultValue="drivers-table" className="w-full">
                    <TabsList>
                      <TabsTrigger value="drivers-table">
                        <User className="h-4 w-4 mr-2" />
                        Drivers Table
                      </TabsTrigger>
                      <TabsTrigger value="leaderboards">
                        <Award className="h-4 w-4 mr-2" />
                        Leaderboards
                      </TabsTrigger>
                      <TabsTrigger value="performance-kpis">
                        <Activity className="h-4 w-4 mr-2" />
                        Performance KPIs
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Move the search/filter controls inside the TabsContent for drivers-table */}
                    <TabsContent value="drivers-table" className="mt-4 p-0">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="relative w-full md:w-auto flex-1 max-w-sm">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search drivers..."
                            className="pl-8 w-full h-9"
                            value={driversSearch}
                            onChange={(e) => setDriversSearch(e.target.value)}
                          />
                        </div>
                        
                        <Select 
                          defaultValue={driversPerformanceFilter}
                          onValueChange={setDriversPerformanceFilter}
                        >
                          <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="Filter by performance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Drivers</SelectItem>
                            <SelectItem value="high">High Performers</SelectItem>
                            <SelectItem value="average">Average Performers</SelectItem>
                            <SelectItem value="low">Needs Improvement</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          defaultValue={driversSortMetric}
                          onValueChange={setDriversSortMetric}
                        >
                          <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="Sort by metric" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safety">Safety Score</SelectItem>
                            <SelectItem value="fuel">Fuel Efficiency</SelectItem>
                            <SelectItem value="time">Time Management</SelectItem>
                            <SelectItem value="handling">Vehicle Handling</SelectItem>
                            <SelectItem value="satisfaction">Customer Satisfaction</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                          <Select
                            value={driversPageSize.toString()}
                            onValueChange={(size) => {
                              setDriversPageSize(Number(size));
                              setDriversCurrentPage(1);
                            }}
                          >
                            <SelectTrigger className="h-9 w-[70px]">
                              <SelectValue placeholder={driversPageSize.toString()} />
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
                      
                      {/* Continue with the drivers table content */}
                      <div className="overflow-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50 text-sm">
                            <tr>
                              <th className="py-3 px-4 text-left font-medium w-[40px]">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300"
                                  checked={selectedDrivers.length === paginatedDrivers.length && paginatedDrivers.length > 0}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedDrivers(paginatedDrivers.map(d => d.id));
                                    } else {
                                      setSelectedDrivers([]);
                                    }
                                  }}
                                />
                              </th>
                              <th className="py-3 px-4 text-left font-medium w-[240px]">Driver</th>
                              <th className="py-3 px-4 text-center font-medium">Safety Score</th>
                              <th className="py-3 px-4 text-center font-medium">Fuel Efficiency</th>
                              <th className="py-3 px-4 text-center font-medium">Time Management</th>
                              <th className="py-3 px-4 text-center font-medium">Vehicle Handling</th>
                              <th className="py-3 px-4 text-center font-medium">Customer Satisfaction</th>
                              <th className="py-3 px-4 text-center font-medium">Overall Rating</th>
                              <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {paginatedDrivers.map(driver => {
                              const overallScore = Math.round(
                                (driver.safetyScore + 
                                driver.fuelEfficiency + 
                                driver.timeManagement + 
                                driver.vehicleHandling + 
                                driver.customerSatisfaction) / 5
                              );
                              
                              let performanceCategory = "average";
                              if (overallScore >= 90) performanceCategory = "high";
                              else if (overallScore < 85) performanceCategory = "low";
                              
                              const categoryColors = {
                                high: "green",
                                average: "blue",
                                low: "amber"
                              };
                              
                              const performanceColor = categoryColors[performanceCategory as keyof typeof categoryColors];
                              
                              return (
                                <tr key={driver.id} className="hover:bg-muted/50 transition-colors">
                                  <td className="py-3 px-4">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300"
                                      checked={selectedDrivers.includes(driver.id)}
                                      onChange={() => {
                                        if (selectedDrivers.includes(driver.id)) {
                                          setSelectedDrivers(selectedDrivers.filter(id => id !== driver.id));
                                        } else {
                                          setSelectedDrivers([...selectedDrivers, driver.id]);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                        <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white font-semibold`}>
                                          <User className="h-5 w-5" />
                                        </div>
                                      </div>
                                      <div>
                                        <div className="font-medium">{driver.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          ID: {driver.id} • {driver.trips} trips
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {driver.safetyScore}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {driver.fuelEfficiency}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      {driver.timeManagement}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                      {driver.vehicleHandling}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                      {driver.customerSatisfaction}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${performanceColor}-100 text-${performanceColor}-800`}>
                                      {overallScore}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleViewDriverDetails(driver)} 
                                        className="h-8 w-8"
                                        title="View Details"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleEditDriver(driver)} 
                                        className="h-8 w-8"
                                        title="Edit Driver"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDeleteDriver(driver)} 
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        title="Delete Driver"
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
                    </TabsContent>
                    
                    {/* The other tabs content remains the same */}
                    <TabsContent value="leaderboards" className="mt-0 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Award className="h-5 w-5 mr-2 text-yellow-500" />
                              Top Performers Overall
                            </CardTitle>
                            <CardDescription>Drivers with the highest combined scores</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[...driversData]
                                .sort((a, b) => {
                                  const aScore = (a.safetyScore + a.fuelEfficiency + a.timeManagement + a.vehicleHandling + a.customerSatisfaction) / 5;
                                  const bScore = (b.safetyScore + b.fuelEfficiency + b.timeManagement + b.vehicleHandling + b.customerSatisfaction) / 5;
                                  return bScore - aScore;
                                })
                                .slice(0, 5)
                                .map((driver, index) => {
                                  const overallScore = Math.round((driver.safetyScore + driver.fuelEfficiency + driver.timeManagement + driver.vehicleHandling + driver.customerSatisfaction) / 5);
                                  return (
                                    <div key={driver.id} className="flex items-center">
                                      <div className="w-8 text-center font-bold">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                      </div>
                                      <div className="flex items-center flex-1 ml-2">
                                        <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                          <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                            <User className="h-4 w-4" />
                                          </div>
                                        </div>
                                        <div className="font-medium">{driver.name}</div>
                                      </div>
                                      <div className="flex justify-end mr-2">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${overallScore >= 90 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                          {overallScore}%
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Shield className="h-5 w-5 mr-2 text-green-500" />
                              Safety Champions
                            </CardTitle>
                            <CardDescription>Drivers with the best safety records</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[...driversData]
                                .sort((a, b) => b.safetyScore - a.safetyScore)
                                .slice(0, 5)
                                .map((driver, index) => (
                                  <div key={driver.id} className="flex items-center">
                                    <div className="w-8 text-center font-bold">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex items-center flex-1 ml-2">
                                      <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                        <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                          <User className="h-4 w-4" />
                                        </div>
                                      </div>
                                      <div className="font-medium">{driver.name}</div>
                                    </div>
                                    <div className="flex justify-end mr-2">
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {driver.safetyScore}%
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Fuel className="h-5 w-5 mr-2 text-blue-500" />
                              Fuel Efficiency Leaders
                            </CardTitle>
                            <CardDescription>Drivers with the best fuel economy</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[...driversData]
                                .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
                                .slice(0, 5)
                                .map((driver, index) => (
                                  <div key={driver.id} className="flex items-center">
                                    <div className="w-8 text-center font-bold">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex items-center flex-1 ml-2">
                                      <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                        <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                          <User className="h-4 w-4" />
                                        </div>
                                      </div>
                                      <div className="font-medium">{driver.name}</div>
                                    </div>
                                    <div className="flex justify-end mr-2">
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {driver.fuelEfficiency}%
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <ThumbsUp className="h-5 w-5 mr-2 text-indigo-500" />
                              Customer Satisfaction Leaders
                            </CardTitle>
                            <CardDescription>Drivers with the best customer ratings</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[...driversData]
                                .sort((a, b) => b.customerSatisfaction - a.customerSatisfaction)
                                .slice(0, 5)
                                .map((driver, index) => (
                                  <div key={driver.id} className="flex items-center">
                                    <div className="w-8 text-center font-bold">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex items-center flex-1 ml-2">
                                      <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                        <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                          <User className="h-4 w-4" />
                                        </div>
                                      </div>
                                      <div className="font-medium">{driver.name}</div>
                                    </div>
                                    <div className="flex justify-end mr-2">
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {driver.customerSatisfaction}%
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="performance-kpis" className="mt-0 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Fleet Safety Score</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-500">
                              {Math.round(driversData.reduce((acc, driver) => acc + driver.safetyScore, 0) / driversData.length)}%
                            </div>
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Average driver safety rating</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-500">
                              {Math.round(driversData.reduce((acc, driver) => acc + driver.fuelEfficiency, 0) / driversData.length)}%
                            </div>
                            <div className="flex items-center">
                              <Fuel className="h-4 w-4 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Average fuel optimization</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-indigo-500">
                              {Math.round(driversData.reduce((acc, driver) => acc + driver.customerSatisfaction, 0) / driversData.length)}%
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Average customer rating</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                              Key Performance Indicators
                            </CardTitle>
                            <CardDescription>Critical metrics across all drivers</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                                  <span>Average Safety Score</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.safetyScore, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Fuel className="h-5 w-5 mr-2 text-blue-500" />
                                  <span>Average Fuel Efficiency</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.fuelEfficiency, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Clock className="h-5 w-5 mr-2 text-purple-500" />
                                  <span>Average Time Management</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.timeManagement, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Truck className="h-5 w-5 mr-2 text-orange-500" />
                                  <span>Average Vehicle Handling</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.vehicleHandling, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-5 w-5 mr-2 text-indigo-500" />
                                  <span>Average Customer Satisfaction</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.customerSatisfaction, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                                  <span>Incidents per Driver</span>
                                </div>
                                <div className="font-semibold">
                                  {(driversData.reduce((acc, driver) => acc + driver.incidents, 0) / driversData.length).toFixed(2)}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Map className="h-5 w-5 mr-2 text-cyan-500" />
                                  <span>Average Mileage per Driver</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.mileage, 0) / driversData.length).toLocaleString()} mi
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Activity className="h-5 w-5 mr-2 text-primary" />
                              Performance Distribution
                            </CardTitle>
                            <CardDescription>Driver performance by category</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-5">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">High Performers (90%+)</span>
                                  <span className="text-sm font-medium">
                                    {driversData.filter(d => 
                                      (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5 >= 90
                                    ).length} drivers
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div className="bg-green-500 h-2.5 rounded-full" style={{ 
                                    width: `${(driversData.filter(d => 
                                      (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5 >= 90
                                    ).length / driversData.length) * 100}%` 
                                  }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Average Performers (85-89%)</span>
                                  <span className="text-sm font-medium">
                                    {driversData.filter(d => {
                                      const avg = (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5;
                                      return avg >= 85 && avg < 90;
                                    }).length} drivers
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ 
                                    width: `${(driversData.filter(d => {
                                      const avg = (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5;
                                      return avg >= 85 && avg < 90;
                                    }).length / driversData.length) * 100}%` 
                                  }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Needs Improvement (Below 85%)</span>
                                  <span className="text-sm font-medium">
                                    {driversData.filter(d => 
                                      (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5 < 85
                                    ).length} drivers
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ 
                                    width: `${(driversData.filter(d => 
                                      (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5 < 85
                                    ).length / driversData.length) * 100}%` 
                                  }}></div>
                                </div>
                              </div>
                              
                              <div className="pt-4 border-t">
                                <h4 className="font-medium mb-3 text-sm">Incidents by Driver</h4>
                                <div className="grid grid-cols-5 gap-2">
                                  {driversData.map(driver => (
                                    <div key={driver.id} className="text-center">
                                      <div className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center ${
                                        driver.incidents === 0 
                                          ? 'bg-green-100 text-green-800' 
                                          : driver.incidents === 1 
                                            ? 'bg-amber-100 text-amber-800' 
                                            : 'bg-red-100 text-red-800'
                                      }`}>
                                        {driver.incidents}
                                      </div>
                                      <div className="text-xs mt-1 overflow-hidden text-ellipsis whitespace-nowrap" title={driver.name}>
                                        {driver.name.split(' ')[0]}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <BarChart className="h-5 w-5 mr-2 text-primary" />
                            Comparative Analytics
                          </CardTitle>
                          <CardDescription>Overall fleet performance analytics</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center text-muted-foreground">
                                <BarChart className="h-16 w-16 mx-auto mb-2 text-muted-foreground/50" />
                                <p>Performance comparison chart would be displayed here</p>
                                <p className="text-sm mt-2">Using the fleet performance data from all drivers</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Keep the pagination section outside the tabs */}
                
                {/* Pagination for Drivers */}
                <div className="border-t">
                  <div className="flex items-center justify-between py-4 px-6">
                    <div className="flex-1 text-sm text-muted-foreground">
                      Showing {Math.min((driversCurrentPage - 1) * driversPageSize + 1, filteredDrivers.length)} to {Math.min(driversCurrentPage * driversPageSize, filteredDrivers.length)} of {filteredDrivers.length} {filteredDrivers.length === 1 ? 'driver' : 'drivers'}
                    </div>
                    
                    <div className="flex-1 flex justify-center">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDriversCurrentPage(1)}
                          disabled={driversCurrentPage === 1}
                          className="h-8 w-8"
                          aria-label="First page"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDriversCurrentPage(driversCurrentPage - 1)}
                          disabled={driversCurrentPage === 1}
                          className="h-8 w-8"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        {driversTotalPages <= 5 ? (
                          // Show all pages if 5 or fewer
                          [...Array(driversTotalPages)].map((_, i) => (
                            <Button
                              key={`page-${i+1}`}
                              variant={driversCurrentPage === i+1 ? "default" : "outline"}
                              size="icon"
                              onClick={() => setDriversCurrentPage(i+1)}
                              className="h-8 w-8"
                              aria-label={`Page ${i+1}`}
                              aria-current={driversCurrentPage === i+1 ? "page" : undefined}
                            >
                              {i+1}
                            </Button>
                          ))
                        ) : (
                          // Show limited pages with ellipsis
                          <>
                            <Button
                              variant={driversCurrentPage === 1 ? "default" : "outline"}
                              size="icon"
                              onClick={() => setDriversCurrentPage(1)}
                              className="h-8 w-8"
                              aria-label="Page 1"
                            >
                              1
                            </Button>
                            
                            {driversCurrentPage > 3 && <span className="mx-1">...</span>}
                            
                            {driversCurrentPage > 2 && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setDriversCurrentPage(driversCurrentPage - 1)}
                                className="h-8 w-8"
                                aria-label={`Page ${driversCurrentPage - 1}`}
                              >
                                {driversCurrentPage - 1}
                              </Button>
                            )}
                            
                            {driversCurrentPage !== 1 && driversCurrentPage !== driversTotalPages && (
                              <Button
                                variant="default"
                                size="icon"
                                onClick={() => setDriversCurrentPage(driversCurrentPage)}
                                className="h-8 w-8"
                                aria-label={`Page ${driversCurrentPage}`}
                                aria-current="page"
                              >
                                {driversCurrentPage}
                              </Button>
                            )}
                            
                            {driversCurrentPage < driversTotalPages - 1 && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setDriversCurrentPage(driversCurrentPage + 1)}
                                className="h-8 w-8"
                                aria-label={`Page ${driversCurrentPage + 1}`}
                              >
                                {driversCurrentPage + 1}
                              </Button>
                            )}
                            
                            {driversCurrentPage < driversTotalPages - 2 && <span className="mx-1">...</span>}
                            
                            <Button
                              variant={driversCurrentPage === driversTotalPages ? "default" : "outline"}
                              size="icon"
                              onClick={() => setDriversCurrentPage(driversTotalPages)}
                              className="h-8 w-8"
                              aria-label={`Page ${driversTotalPages}`}
                            >
                              {driversTotalPages}
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDriversCurrentPage(driversCurrentPage + 1)}
                          disabled={driversCurrentPage === driversTotalPages}
                          className="h-8 w-8"
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDriversCurrentPage(driversTotalPages)}
                          disabled={driversCurrentPage === driversTotalPages}
                          className="h-8 w-8"
                          aria-label="Last page"
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Empty div to maintain balance in the layout */}
                    <div className="flex-1"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fleet Management Analytics Dashboard - Independent Components */}
      <div className="space-y-6 mb-8">
        {/* Enhanced Fleet Health Monitoring System */}
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="bg-background">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  Vehicle Health Monitoring System
                </CardTitle>
                <CardDescription>Real-time diagnostic metrics and predictive maintenance analysis</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Cpu className="h-4 w-4 mr-2" />
                  Run Diagnostics
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Real-time Status Overview */}
            <div className="border rounded-md mb-4 bg-muted/10">
              <div className="p-2 flex items-center border-b bg-muted/20">
                <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                <span className="text-sm font-medium">System Status: Operational</span>
                <span className="text-xs text-muted-foreground ml-auto">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 p-4">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Diagnostic Systems</div>
                  <div className="relative h-16 w-16">
                    <CircleDot className="h-16 w-16 text-green-500/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">100%</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium mt-1">Online</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Sensor Network</div>
                  <div className="relative h-16 w-16">
                    <CircleDot className="h-16 w-16 text-green-500/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">96%</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium mt-1">23/24 Online</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Data Relays</div>
                  <div className="relative h-16 w-16">
                    <CircleDot className="h-16 w-16 text-amber-500/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-amber-600">83%</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium mt-1">5/6 Online</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Cloud Sync</div>
                  <div className="relative h-16 w-16">
                    <CircleDot className="h-16 w-16 text-green-500/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">100%</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium mt-1">2m Ago</div>
                </div>
              </div>
            </div>
            
            {/* Technical Tabs for Different Views */}
            <Tabs defaultValue="diagnostic" className="w-full">
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="diagnostic" className="text-xs">
                  <Activity className="h-3.5 w-3.5 mr-1" />
                  Diagnostic
                </TabsTrigger>
                <TabsTrigger value="predictive" className="text-xs">
                  <BarChart className="h-3.5 w-3.5 mr-1" />
                  Predictive
                </TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="systems" className="text-xs">
                  <Cpu className="h-3.5 w-3.5 mr-1" />
                  Systems
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="diagnostic">
                <div className="flex justify-between items-center mb-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input 
                      className="pl-8 h-9 w-[250px]" 
                      placeholder="Search diagnostics..." 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="h-9 w-[150px]">
                        <SelectValue placeholder="Filter by vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Vehicles</SelectItem>
                        <SelectItem value="trucks">Trucks</SelectItem>
                        <SelectItem value="vans">Vans</SelectItem>
                        <SelectItem value="refrigerated">Refrigerated</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="recent">
                      <SelectTrigger className="h-9 w-[120px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="critical">Critical First</SelectItem>
                        <SelectItem value="vehicle">By Vehicle</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => alert("Filter applied!")}>
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => {
                        const dialog = document.getElementById("run-diagnostic-dialog") as HTMLDialogElement;
                        if (dialog) dialog.showModal();
                      }}
                    >
                      Run New
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <BarChart className="h-4 w-4 mr-2 text-primary" />
                            Component Health Distribution
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px]">
                          <div className="h-full flex flex-col justify-center">
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between items-center text-sm mb-1">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                    <span>Excellent (90-100%)</span>
                                  </div>
                                  <span className="font-medium">23 components</span>
                                </div>
                                <Progress value={46} className="h-2 bg-muted" />
                              </div>
                              <div>
                                <div className="flex justify-between items-center text-sm mb-1">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                    <span>Good (75-89%)</span>
                                  </div>
                                  <span className="font-medium">18 components</span>
                                </div>
                                <Progress value={36} className="h-2 bg-muted" />
                              </div>
                              <div>
                                <div className="flex justify-between items-center text-sm mb-1">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                                    <span>Fair (50-74%)</span>
                                  </div>
                                  <span className="font-medium">7 components</span>
                                </div>
                                <Progress value={14} className="h-2 bg-muted" />
                              </div>
                              <div>
                                <div className="flex justify-between items-center text-sm mb-1">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                    <span>Poor (0-49%)</span>
                                  </div>
                                  <span className="font-medium">2 components</span>
                                </div>
                                <Progress value={4} className="h-2 bg-muted" />
                              </div>
                            </div>
                            <div className="text-xs text-center text-muted-foreground mt-4">
                              Based on diagnostic data from 50 critical vehicle components
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Activity className="h-4 w-4 mr-2 text-primary" />
                            Fleet Health Trend Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px]">
                          <div className="h-full flex flex-col">
                            <div className="flex-1 grid grid-cols-6 grid-rows-3 gap-1 pb-4">
                              {Array.from({ length: 6 }).map((_, monthIdx) => (
                                <div key={`month-${monthIdx}`} className="flex flex-col">
                                  {Array.from({ length: 3 }).map((_, metricIdx) => {
                                    // Generate trend data with some randomness but overall upward trend
                                    const baseHeight = 30 + metricIdx * 15 + monthIdx * 3;
                                    const randomAdjustment = Math.sin(monthIdx) * 5;
                                    const height = baseHeight + randomAdjustment;
                                    
                                    // Get color based on metric type
                                    const colors = [
                                      'bg-blue-500 dark:bg-blue-600', 
                                      'bg-green-500 dark:bg-green-600', 
                                      'bg-purple-500 dark:bg-purple-600'
                                    ];
                                    
                                    return (
                                      <div 
                                        key={`metric-${metricIdx}-${monthIdx}`} 
                                        className={`${colors[metricIdx]} rounded-sm mt-auto`}
                                        style={{ height: `${height}%` }}
                                      ></div>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-6 text-xs text-center text-muted-foreground">
                              <div>Jan</div>
                              <div>Feb</div>
                              <div>Mar</div>
                              <div>Apr</div>
                              <div>May</div>
                              <div>Jun</div>
                            </div>
                            <div className="mt-3 flex justify-center items-center gap-4 text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                                <span>Engine</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                <span>Electrical</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                                <span>Drivetrain</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center">
                          <CircleDot className="h-4 w-4 mr-2 text-primary" />
                          Real-Time Diagnostic Data
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => alert("Diagnostic logs exported to CSV")}
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          Export Logs
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                                <span className="text-sm">ECU Status</span>
                              </div>
                              <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                                Normal
                              </Badge>
                            </div>
                            <Progress value={98} className="h-1" />
                            <span className="text-xs text-muted-foreground">Response time: 124ms</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                                <span className="text-sm">Sensor Network</span>
                              </div>
                              <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                                Normal
                              </Badge>
                            </div>
                            <Progress value={96} className="h-1" />
                            <span className="text-xs text-muted-foreground">Data throughput: 1.3 MB/s</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CircleDot className="h-3 w-3 text-amber-500 mr-2" />
                                <span className="text-sm">OBD Interface</span>
                              </div>
                              <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">
                                Degraded
                              </Badge>
                            </div>
                            <Progress value={83} className="h-1" />
                            <span className="text-xs text-muted-foreground">2 failed connections in 24h</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <CircleDot className="h-4 w-4 mr-2 text-primary" />
                          Component Health Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Engine</span>
                              <span className="text-sm font-medium text-green-600">92%</span>
                            </div>
                            <Progress value={92} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Transmission</span>
                              <span className="text-sm font-medium text-green-600">88%</span>
                            </div>
                            <Progress value={88} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Brakes</span>
                              <span className="text-sm font-medium text-amber-600">75%</span>
                            </div>
                            <Progress value={75} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Suspension</span>
                              <span className="text-sm font-medium text-green-600">95%</span>
                            </div>
                            <Progress value={95} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Electrical</span>
                              <span className="text-sm font-medium text-green-600">82%</span>
                            </div>
                            <Progress value={82} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Fluid Levels</span>
                              <span className="text-sm font-medium text-green-600">90%</span>
                            </div>
                            <Progress value={90} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Tires</span>
                              <span className="text-sm font-medium text-amber-600">62%</span>
                            </div>
                            <Progress value={62} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Battery</span>
                              <span className="text-sm font-medium text-red-600">45%</span>
                            </div>
                            <Progress value={45} className="h-1.5" />
                          </div>
                          <Button 
                            className="w-full mt-2" 
                            variant="outline" 
                            size="sm"
                            onClick={() => setComponentDetailsDialogOpen(true)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="predictive">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-base flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                        Failure Prediction Model
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => alert("Model settings opened")}
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Model Confidence</span>
                            <span className="text-sm font-medium">92.4%</span>
                          </div>
                          <Progress value={92.4} className="h-1.5" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Last updated: Today, 08:45 AM</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 px-2 text-xs"
                              onClick={() => alert("Model retrained with latest data")}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retrain
                            </Button>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Predictions by Vehicle Type</h4>
                            <Select defaultValue="6months">
                              <SelectTrigger className="h-7 text-xs w-[110px]">
                                <SelectValue placeholder="Time Range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30days">30 Days</SelectItem>
                                <SelectItem value="3months">3 Months</SelectItem>
                                <SelectItem value="6months">6 Months</SelectItem>
                                <SelectItem value="1year">1 Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                <span>Delivery Trucks</span>
                              </div>
                              <span>87% accuracy</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                                <span>Cargo Vans</span>
                              </div>
                              <span>93% accuracy</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                <span>Refrigerated Units</span>
                              </div>
                              <span>89% accuracy</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <Button 
                                className="w-full mt-2" 
                                variant="outline" 
                                size="sm"
                                onClick={() => alert("Detailed model accuracy report with precision and recall metrics for each component type")}
                              >
                                View Full Accuracy Report
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        Time-to-Failure Estimates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-3">
                        <Select defaultValue="high">
                          <SelectTrigger className="h-8 text-xs w-[120px]">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => alert("Maintenance schedule updated")}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule All
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div 
                          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                          onClick={() => setFailureDetailsDialogOpen(true)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Truck #103 - Battery</div>
                            <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">14 days</Badge>
                          </div>
                          <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Replace within 2 weeks - Confidence: 92%</div>
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert("Added to maintenance schedule");
                              }}
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              Schedule
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert("Dismissed from alerts");
                              }}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Van #205 - Front Tires</div>
                            <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">14 days</Badge>
                          </div>
                          <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Replace within 2 weeks - Confidence: 92%</div>
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert("Added to maintenance schedule");
                              }}
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              Schedule
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert("Dismissed from alerts");
                              }}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="alerts">
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-primary" />
                      Maintenance Alerts & Notifications
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => alert("Notification settings opened")}
                    >
                      <Bell className="h-3.5 w-3.5 mr-1" />
                      Configure
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <Tabs defaultValue="all" className="w-[400px]">
                        <TabsList>
                          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                          <TabsTrigger value="critical" className="text-xs">Critical</TabsTrigger>
                          <TabsTrigger value="warning" className="text-xs">Warning</TabsTrigger>
                          <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => alert("All alerts resolved")}
                      >
                        <CheckSquare className="h-3.5 w-3.5 mr-1" />
                        Resolve All
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                        <div className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-red-800 dark:text-red-400">Critical: Battery Replacement Required</div>
                              <Badge variant="outline" className="text-xs bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400">
                                Critical
                              </Badge>
                            </div>
                            <div className="text-xs text-red-800 dark:text-red-400 mt-1">Truck #103 - Battery voltage dropping below acceptable levels. Replacement recommended immediately.</div>
                            <div className="flex items-center mt-2 gap-2">
                              <span className="text-xs text-red-600 dark:text-red-500">92% Confidence</span>
                              <span className="text-xs text-red-600 dark:text-red-500">Detected: 2 days ago</span>
                              <div className="flex items-center ml-auto gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => alert("Scheduled for maintenance")}
                                >
                                  Schedule
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => alert("Alert resolved")}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                        <div className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Warning: Tire Wear Detection</div>
                              <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">
                                Warning
                              </Badge>
                            </div>
                            <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Van #205 - Front tires showing uneven wear pattern. Rotation recommended during next service.</div>
                            <div className="flex items-center mt-2 gap-2">
                              <span className="text-xs text-amber-600 dark:text-amber-500">85% Confidence</span>
                              <span className="text-xs text-amber-600 dark:text-amber-500">Detected: 5 days ago</span>
                              <div className="flex items-center ml-auto gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => alert("Scheduled for maintenance")}
                                >
                                  Schedule
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => alert("Alert resolved")}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                        <div className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Warning: Oil Change Due</div>
                              <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">
                                Warning
                              </Badge>
                            </div>
                            <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Truck #101 - Oil change due in 3 days. Current mileage: 32,450 miles.</div>
                            <div className="flex items-center mt-2 gap-2">
                              <span className="text-xs text-amber-600 dark:text-amber-500">Maintenance Interval</span>
                              <span className="text-xs text-amber-600 dark:text-amber-500">Due: June 29, 2023</span>
                              <div className="flex items-center ml-auto gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => alert("Scheduled for maintenance")}
                                >
                                  Schedule
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => alert("Alert resolved")}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                        <div className="flex items-start">
                          <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-blue-800 dark:text-blue-400">Info: Maintenance Completed</div>
                              <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400">
                                Info
                              </Badge>
                            </div>
                            <div className="text-xs text-blue-800 dark:text-blue-400 mt-1">Truck #102 - Regular maintenance completed. Next service due in 5,000 miles.</div>
                            <div className="flex items-center mt-2 gap-2">
                              <span className="text-xs text-blue-600 dark:text-blue-500">Completed: Today</span>
                              <div className="flex items-center ml-auto gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => alert("Alert dismissed")}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Continue with systems tab */}
              <TabsContent value="systems">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-base flex items-center">
                        <Cpu className="h-4 w-4 mr-2 text-primary" />
                        Diagnostic System Status
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => alert("System logs for the last 7 days displayed in a new window")}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Logs
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div 
                          className="flex justify-between items-center p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => alert("OBD Connection Service: 99.95% uptime, 24.3ms average response time, 1.2M requests/day")}
                        >
                          <div className="flex items-center">
                            <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                            <span className="text-sm font-medium">OBD Connection Service</span>
                          </div>
                          <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                            Online
                          </Badge>
                        </div>
                        <div 
                          className="flex justify-between items-center p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => alert("Fleet Tracking Service: 100% uptime, 18.7ms average response time, 5.6M location data points/day")}
                        >
                          <div className="flex items-center">
                            <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                            <span className="text-sm font-medium">Fleet Tracking Service</span>
                          </div>
                          <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                            Online
                          </Badge>
                        </div>
                        <div 
                          className="flex justify-between items-center p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => alert("Predictive Analytics API: 96.8% uptime, 220ms average response time, excessive load detected. Scaling up additional instances.")}
                        >
                          <div className="flex items-center">
                            <CircleDot className="h-3 w-3 text-amber-500 mr-2" />
                            <span className="text-sm font-medium">Predictive Analytics API</span>
                          </div>
                          <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">
                            Degraded
                          </Badge>
                        </div>
                        <div 
                          className="flex justify-between items-center p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => alert("Maintenance Database: 100% uptime, 32ms average query time, 180GB storage used (68%)")}
                        >
                          <div className="flex items-center">
                            <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                            <span className="text-sm font-medium">Maintenance Database</span>
                          </div>
                          <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                            Online
                          </Badge>
                        </div>
                        
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              alert("Comprehensive system diagnostic started. This will take approximately 2 minutes to complete. A notification will appear when finished.");
                              setTimeout(() => {
                                alert("System diagnostic completed. All services operational. Report available in System Health dashboard.");
                              }, 2000);
                            }}
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            Run System Diagnostic
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-primary" />
                        System Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">API Response Time</span>
                            <span className="text-sm font-medium">124ms</span>
                          </div>
                          <Progress value={92} className="h-1.5" />
                          <div className="flex items-center mt-1">
                            <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">-12ms from last week</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Server Load</span>
                            <span className="text-sm font-medium">42%</span>
                          </div>
                          <Progress value={42} className="h-1.5" />
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-amber-500 mr-1" />
                            <span className="text-xs text-amber-600">+8% from last week</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Data Processing</span>
                            <span className="text-sm font-medium">1.3 GB/hr</span>
                          </div>
                          <Progress value={65} className="h-1.5" />
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">+0.2 GB from last week</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Cloud Storage</span>
                            <span className="text-sm font-medium">68%</span>
                          </div>
                          <Progress value={68} className="h-1.5" />
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-amber-500 mr-1" />
                            <span className="text-xs text-amber-600">+5% from last week</span>
                          </div>
                        </div>
                        
                        {/* System Details Section */}
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full flex items-center justify-center"
                            onClick={() => setSystemDetailsVisible(!systemDetailsVisible)}
                          >
                            <ChevronDown className="h-3.5 w-3.5 mr-1" />
                            System Details
                          </Button>
                          
                          {systemDetailsVisible && (
                            <div className="mt-2 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Database Connections:</span>
                                <span>24/50</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cache Hit Rate:</span>
                                <span>92.5%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Average Query Time:</span>
                                <span>42ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span>API Rate Limit Used:</span>
                                <span>36%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-primary" />
                        System Security & Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                          <div className="flex items-start">
                            <Shield className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-green-800 dark:text-green-400">Security Status</div>
                              <div className="text-xs text-green-800 dark:text-green-400 mt-1">All systems secured. Last scan: 2 hours ago.</div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 h-7 px-2 text-xs"
                                onClick={() => alert("Security scan initiated")}
                              >
                                Run Scan
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                          <div className="flex items-start">
                            <Download className="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-blue-800 dark:text-blue-400">Software Updates</div>
                              <div className="text-xs text-blue-800 dark:text-blue-400 mt-1">System is up to date. Next check: 12 hours.</div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 h-7 px-2 text-xs"
                                onClick={() => alert("Update check initiated")}
                              >
                                Check Now
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                          <div className="flex items-start">
                            <DatabaseBackup className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Data Backup</div>
                              <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Last backup: 6 hours ago. Next backup: 18 hours.</div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 h-7 px-2 text-xs"
                                onClick={() => alert("Manual backup initiated")}
                              >
                                Backup Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">System Event Log</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={() => alert("Full log opened")}
                          >
                            View All
                          </Button>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="border-b pb-2">
                            <div className="flex items-center gap-2">
                              <CircleDot className="h-2 w-2 text-green-500" />
                              <span className="font-medium">System Startup</span>
                              <span className="text-xs text-muted-foreground ml-auto">Today, 08:00 AM</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">All services started successfully</div>
                          </div>
                          
                          <div className="border-b pb-2">
                            <div className="flex items-center gap-2">
                              <CircleDot className="h-2 w-2 text-blue-500" />
                              <span className="font-medium">Database Backup</span>
                              <span className="text-xs text-muted-foreground ml-auto">Today, 06:00 AM</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Automated backup completed successfully</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <CircleDot className="h-2 w-2 text-amber-500" />
                              <span className="font-medium">API Rate Limit Warning</span>
                              <span className="text-xs text-muted-foreground ml-auto">Yesterday, 04:32 PM</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Rate limit reached 80% threshold on /api/vehicles endpoint</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Fleet Management Analytics Dashboard */}
        <div className="mt-6 space-y-6">
          {/* Fuel Analytics & Optimization System */}
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="bg-background">
              <CardTitle className="text-xl flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-primary" />
                Fuel Analytics & Optimization System
              </CardTitle>
              <CardDescription>
                Track fuel consumption, costs, and optimize efficiency across your fleet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="consumption" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="consumption">
                    <Droplets className="h-4 w-4 mr-2" />
                    Consumption Analytics
                  </TabsTrigger>
                  <TabsTrigger value="cost">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Cost Tracking
                  </TabsTrigger>
                  <TabsTrigger value="efficiency">
                    <Gauge className="h-4 w-4 mr-2" />
                    Efficiency Monitoring
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="consumption">
                  {/* Vehicle-wise Consumption Details */}
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center">
                          <ClipboardList className="h-4 w-4 mr-2 text-primary" />
                          Vehicle-wise Consumption Details
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vehicle ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="text-right">Last Month</TableHead>
                              <TableHead className="text-right">This Month</TableHead>
                              <TableHead className="text-right">Change</TableHead>
                              <TableHead className="text-right">Efficiency</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vehicleFuelConsumption
                              .filter(vehicle => {
                                const matchesSearch = consumptionSearchQuery === "" ||
                                  vehicle.name.toLowerCase().includes(consumptionSearchQuery.toLowerCase()) ||
                                  vehicle.id.toLowerCase().includes(consumptionSearchQuery.toLowerCase());
                                const matchesType = consumptionTypeFilter === "all" || vehicle.type === consumptionTypeFilter;
                                return matchesSearch && matchesType;
                              })
                              .slice(
                                (consumptionCurrentPage - 1) * consumptionPageSize,
                                consumptionCurrentPage * consumptionPageSize
                              )
                              .map((vehicle) => {
                                const consumptionChange = vehicle.thisMonth - vehicle.lastMonth;
                                const changePercentage = ((consumptionChange) / vehicle.lastMonth * 100).toFixed(1);
                                
                                return (
                                  <TableRow key={vehicle.id} className="group hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">
                                      <div className="flex items-center">
                                        <Package className="h-4 w-4 text-muted-foreground mr-2" />
                                        {vehicle.id}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-col">
                                        <div className="font-medium">{vehicle.name}</div>
                                        <div className="text-xs text-muted-foreground">Last updated: Today, 2:30 PM</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="font-normal">
                                        {vehicle.type === 'Heavy Duty' && <Truck className="h-3 w-3 mr-1" />}
                                        {vehicle.type === 'Medium Duty' && <Truck className="h-3 w-3 mr-1" />}
                                        {vehicle.type === 'Light Duty' && <Car className="h-3 w-3 mr-1" />}
                                        {vehicle.type}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex flex-col items-end">
                                        <div>{vehicle.lastMonth} gal</div>
                                        <div className="text-xs text-muted-foreground">Previous month</div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex flex-col items-end">
                                        <div>{vehicle.thisMonth} gal</div>
                                        <div className="text-xs text-muted-foreground">Current month</div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end">
                                        <div className={`flex items-center ${consumptionChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                          {consumptionChange > 0 ? (
                                            <TrendingUp className="h-4 w-4 mr-1" />
                                          ) : (
                                            <TrendingDown className="h-4 w-4 mr-1" />
                                          )}
                                          <span>{Math.abs(consumptionChange)} gal</span>
                                          <span className="text-xs ml-1">({changePercentage}%)</span>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          vehicle.efficiency >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                          vehicle.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        }`}>
                                          <Gauge className="h-3 w-3 mr-1" />
                                          {vehicle.efficiency}%
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="border-t">
                        <div className="flex items-center justify-between py-4 px-6">
                          <div className="flex-1 text-sm text-muted-foreground">
                            Showing {Math.min((consumptionCurrentPage - 1) * consumptionPageSize + 1, vehicleFuelConsumption.length)} to {Math.min(consumptionCurrentPage * consumptionPageSize, vehicleFuelConsumption.length)} of {vehicleFuelConsumption.length} entries
                          </div>
                          
                          <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setConsumptionCurrentPage(1)}
                                disabled={consumptionCurrentPage === 1}
                                className="h-8 w-8"
                                aria-label="First page"
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setConsumptionCurrentPage(consumptionCurrentPage - 1)}
                                disabled={consumptionCurrentPage === 1}
                                className="h-8 w-8"
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              {Array.from({ length: Math.min(5, Math.ceil(vehicleFuelConsumption.length / consumptionPageSize)) }).map((_, i) => (
                                <Button
                                  key={i}
                                  variant={consumptionCurrentPage === i + 1 ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => setConsumptionCurrentPage(i + 1)}
                                  className="h-8 w-8"
                                >
                                  {i + 1}
                                </Button>
                              ))}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setConsumptionCurrentPage(consumptionCurrentPage + 1)}
                                disabled={consumptionCurrentPage === Math.ceil(vehicleFuelConsumption.length / consumptionPageSize)}
                                className="h-8 w-8"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setConsumptionCurrentPage(Math.ceil(vehicleFuelConsumption.length / consumptionPageSize))}
                                disabled={consumptionCurrentPage === Math.ceil(vehicleFuelConsumption.length / consumptionPageSize)}
                                className="h-8 w-8"
                                aria-label="Last page"
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">    
                    {/* Monthly Fuel Consumption */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Droplets className="h-4 w-4 mr-2 text-primary" />
                            Monthly Fuel Consumption
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {monthlyFuelData.map((month, index) => {
                              const prevMonth = index > 0 ? monthlyFuelData[index - 1] : null;
                              const consumptionChange = prevMonth ? ((month.consumption - prevMonth.consumption) / prevMonth.consumption * 100).toFixed(1) : '0';
                              const avgPerVehicle = (month.consumption / month.vehicles).toFixed(1);
                              
                              return (
                                <div key={month.month} className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{month.month}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {month.vehicles} vehicles
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="flex flex-col items-end">
                                        <span className="font-medium">{month.consumption.toLocaleString()} gal</span>
                                        <span className="text-xs text-muted-foreground">
                                          {avgPerVehicle} gal/vehicle
                                        </span>
                                      </div>
                                      {prevMonth && (
                                        <div className={`flex items-center text-xs ${Number(consumptionChange) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                          {Number(consumptionChange) > 0 ? (
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                          ) : (
                                            <TrendingDown className="h-3 w-3 mr-1" />
                                          )}
                                          {Math.abs(Number(consumptionChange))}%
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${(month.consumption / 3100) * 100}%` }}
                                      />
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                      <div className="flex items-center">
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        ${month.avgPrice}/gal
                                      </div>
                                      <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Daily avg: {(month.consumption / 30).toFixed(1)} gal
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div className="pt-4 border-t">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Total Consumption</div>
                                  <div className="text-lg font-bold">
                                    {monthlyFuelData.reduce((acc, curr) => acc + curr.consumption, 0).toLocaleString()} gal
                                  </div>
                                  <div className="text-xs text-muted-foreground">Over {monthlyFuelData.length} months</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Monthly Average</div>
                                  <div className="text-lg font-bold">
                                    {Math.round(monthlyFuelData.reduce((acc, curr) => acc + curr.consumption, 0) / monthlyFuelData.length).toLocaleString()} gal
                                  </div>
                                  <div className="text-xs text-muted-foreground">Per month</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Efficiency Trend</div>
                                  <div className="text-lg font-bold text-green-500">↑ 2.3%</div>
                                  <div className="text-xs text-muted-foreground">Month over month</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      {/* Consumption by Type */}
                      <Card className="h-full">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-base flex items-center">
                            <PieChart className="h-4 w-4 mr-2 text-primary" />
                            Consumption by Type
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-8">
                            {['Heavy Duty', 'Medium Duty', 'Light Duty'].map((type) => {
                              const vehicles = vehicleFuelConsumption.filter(v => v.type === type);
                              const totalConsumption = vehicles.reduce((acc, curr) => acc + curr.thisMonth, 0);
                              const lastMonthConsumption = vehicles.reduce((acc, curr) => acc + curr.lastMonth, 0);
                              const percentage = Math.round((totalConsumption / vehicleFuelConsumption.reduce((acc, curr) => acc + curr.thisMonth, 0)) * 100);
                              const change = ((totalConsumption - lastMonthConsumption) / lastMonthConsumption * 100).toFixed(1);
                              const avgEfficiency = Math.round(vehicles.reduce((acc, curr) => acc + curr.efficiency, 0) / vehicles.length);
                              
                              return (
                                <div key={type} className="space-y-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="flex items-center gap-3">
                                        {type === 'Heavy Duty' && <Truck className="h-4 w-4 text-blue-500" />}
                                        {type === 'Medium Duty' && <Truck className="h-4 w-4 text-green-500" />}
                                        {type === 'Light Duty' && <Car className="h-4 w-4 text-purple-500" />}
                                        <span className="font-medium">{type}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {vehicles.length} vehicles
                                        </Badge>
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-2">
                                        Avg efficiency: {avgEfficiency}%
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">{totalConsumption} gal</div>
                                      <div className={`text-xs flex items-center justify-end mt-1 ${Number(change) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {Number(change) > 0 ? (
                                          <TrendingUp className="h-3 w-3 mr-1" />
                                        ) : (
                                          <TrendingDown className="h-3 w-3 mr-1" />
                                        )}
                                        {Math.abs(Number(change))}% from last month
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Progress value={percentage} className="h-2.5" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>{percentage}% of total fleet</span>
                                      <span>{(totalConsumption / vehicles.length).toFixed(1)} gal/vehicle</span>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 bg-muted/20 rounded-md">
                                      <div className="text-xs text-muted-foreground mb-1">Min</div>
                                      <div className="font-medium">{Math.min(...vehicles.map(v => v.thisMonth))} gal</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted/20 rounded-md">
                                      <div className="text-xs text-muted-foreground mb-1">Avg</div>
                                      <div className="font-medium">{Math.round(totalConsumption / vehicles.length)} gal</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted/20 rounded-md">
                                      <div className="text-xs text-muted-foreground mb-1">Max</div>
                                      <div className="font-medium">{Math.max(...vehicles.map(v => v.thisMonth))} gal</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Find the cost tab content and replace with: */}
                <TabsContent value="cost">
                  <Card className="mt-4 mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center">
                          <Receipt className="h-4 w-4 mr-2 text-primary" />
                          Monthly Cost Breakdown
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>Vehicles</TableHead>
                              <TableHead className="text-right">Consumption</TableHead>
                              <TableHead className="text-right">Avg. Price</TableHead>
                              <TableHead className="text-right">Total Cost</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {monthlyFuelData
                              .filter(month => {
                                const matchesSearch = costSearchQuery === "" ||
                                  month.month.toLowerCase().includes(costSearchQuery.toLowerCase());
                                const matchesMonth = costMonthFilter === "all" || month.month === costMonthFilter;
                                return matchesSearch && matchesMonth;
                              })
                              .slice(
                                (costCurrentPage - 1) * costPageSize,
                                costCurrentPage * costPageSize
                              )
                              .map((month) => {
                                const prevMonth = monthlyFuelData[monthlyFuelData.indexOf(month) - 1];
                                const costChange = prevMonth ? month.cost - prevMonth.cost : 0;
                                const costChangePercentage = prevMonth ? ((costChange / prevMonth.cost) * 100).toFixed(1) : '0';
                                
                                return (
                                  <TableRow key={month.month} className="group hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                                        {month.month}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                          <UserRound className="h-4 w-4 text-muted-foreground mr-1" />
                                          {month.vehicles}
                                        </div>
                                        {month.vehicles > (prevMonth?.vehicles || 0) && (
                                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                            +{month.vehicles - (prevMonth?.vehicles || 0)}
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex flex-col items-end">
                                        <div className="flex items-center">
                                          <Fuel className="h-4 w-4 text-muted-foreground mr-1" />
                                          {month.consumption.toLocaleString()} gal
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          Avg: {(month.consumption / month.vehicles).toFixed(1)} gal/vehicle
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex flex-col items-end">
                                        <div className="flex items-center">
                                          <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                                          ${month.avgPrice}/gal
                                        </div>
                                        {prevMonth && (
                                          <div className={`text-xs ${month.avgPrice > prevMonth.avgPrice ? 'text-red-500' : 'text-green-500'}`}>
                                            {month.avgPrice > prevMonth.avgPrice ? '↑' : '↓'} 
                                            ${Math.abs(month.avgPrice - prevMonth.avgPrice).toFixed(2)} from prev
                                          </div>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <div className="flex flex-col items-end">
                                          <div className="font-medium">${month.cost.toLocaleString()}</div>
                                          {prevMonth && (
                                            <div className={`text-xs flex items-center ${costChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                              {costChange > 0 ? (
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                              ) : (
                                                <TrendingDown className="h-3 w-3 mr-1" />
                                              )}
                                              {costChangePercentage}%
                                            </div>
                                          )}
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            <TableRow className="font-medium bg-muted/50">
                              <TableCell colSpan={2} className="font-medium">
                                <div className="flex items-center">
                                  <Calculator className="h-4 w-4 mr-2 text-primary" />
                                  Total / Average
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                <div className="flex items-center justify-end">
                                  <Fuel className="h-4 w-4 mr-2 text-primary" />
                                  {monthlyFuelData.reduce((acc, curr) => acc + curr.consumption, 0).toLocaleString()} gal
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                <div className="flex items-center justify-end">
                                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                                  ${(monthlyFuelData.reduce((acc, curr) => acc + curr.avgPrice, 0) / monthlyFuelData.length).toFixed(2)}/gal
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                <div className="flex items-center justify-end">
                                  <Receipt className="h-4 w-4 mr-2 text-primary" />
                                  ${monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="border-t">
                        <div className="flex items-center justify-between py-4 px-6">
                          <div className="flex-1 text-sm text-muted-foreground">
                            Showing {Math.min((costCurrentPage - 1) * costPageSize + 1, monthlyFuelData.length)} to {Math.min(costCurrentPage * costPageSize, monthlyFuelData.length)} of {monthlyFuelData.length} entries
                          </div>
                          
                          <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCostCurrentPage(1)}
                                disabled={costCurrentPage === 1}
                                className="h-8 w-8"
                                aria-label="First page"
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCostCurrentPage(costCurrentPage - 1)}
                                disabled={costCurrentPage === 1}
                                className="h-8 w-8"
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              {Array.from({ length: Math.min(5, Math.ceil(monthlyFuelData.length / costPageSize)) }).map((_, i) => (
                                <Button
                                  key={i}
                                  variant={costCurrentPage === i + 1 ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => setCostCurrentPage(i + 1)}
                                  className="h-8 w-8"
                                >
                                  {i + 1}
                                </Button>
                              ))}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCostCurrentPage(costCurrentPage + 1)}
                                disabled={costCurrentPage === Math.ceil(monthlyFuelData.length / costPageSize)}
                                className="h-8 w-8"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCostCurrentPage(Math.ceil(monthlyFuelData.length / costPageSize))}
                                disabled={costCurrentPage === Math.ceil(monthlyFuelData.length / costPageSize)}
                                className="h-8 w-8"
                                aria-label="Last page"
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-primary" />
                            Monthly Cost Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {monthlyFuelData.map((month, index) => {
                              const prevMonth = index > 0 ? monthlyFuelData[index - 1] : null;
                              const costChange = prevMonth ? ((month.cost - prevMonth.cost) / prevMonth.cost * 100).toFixed(1) : '0';
                              const avgCostPerVehicle = (month.cost / month.vehicles).toFixed(2);
                              
                              return (
                                <div key={month.month} className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{month.month}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {month.vehicles} vehicles
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="flex flex-col items-end">
                                        <span className="font-medium">${month.cost.toLocaleString()}</span>
                                        <span className="text-xs text-muted-foreground mt-1">
                                          ${avgCostPerVehicle}/vehicle
                                        </span>
                                      </div>
                                      {prevMonth && (
                                        <div className={`flex items-center text-xs ${Number(costChange) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                          {Number(costChange) > 0 ? (
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                          ) : (
                                            <TrendingDown className="h-3 w-3 mr-1" />
                                          )}
                                          {Math.abs(Number(costChange))}%
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                      <div 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{ width: `${(month.cost / 10695) * 100}%` }}
                                      />
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                      <div className="flex items-center">
                                        <Fuel className="h-3 w-3 mr-1" />
                                        {month.consumption.toLocaleString()} gallons
                                      </div>
                                      <div className="flex items-center">
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        {month.avgPrice}/gal avg. price
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div className="pt-4 mt-2 border-t">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Total Cost</div>
                                  <div className="text-lg font-bold">
                                    ${monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Over {monthlyFuelData.length} months</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Monthly Average</div>
                                  <div className="text-lg font-bold">
                                    ${Math.round(monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0) / monthlyFuelData.length).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Per month</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Cost Trend</div>
                                  <div className="text-lg font-bold text-green-500">↓ 3.2%</div>
                                  <div className="text-xs text-muted-foreground">Month over month</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      {/* Cost Summary */}
                      <Card className="h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Receipt className="h-4 w-4 mr-2 text-primary" />
                            Cost Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-4">
                              <div className="p-3 bg-muted/20 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">Total Expenses</span>
                                  <span className="text-base font-bold">
                                    ${monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Total fuel expenses across all vehicles
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm">Average Monthly</span>
                                    <span className="font-medium">
                                      ${Math.round(monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0) / monthlyFuelData.length).toLocaleString()}
                                    </span>
                                  </div>
                                  <Progress value={75} className="h-1.5" />
                                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Monthly budget utilization</span>
                                    <span>75%</span>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm">Per Vehicle Average</span>
                                    <span className="font-medium">
                                      ${Math.round(monthlyFuelData.reduce((acc, curr) => acc + (curr.cost / curr.vehicles), 0) / monthlyFuelData.length).toLocaleString()}
                                    </span>
                                  </div>
                                  <Progress value={82} className="h-1.5" />
                                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Target efficiency</span>
                                    <span>82%</span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-2 bg-muted/20 rounded-md">
                                  <div className="text-xs text-muted-foreground">Highest Month</div>
                                  <div className="font-medium">${Math.max(...monthlyFuelData.map(m => m.cost)).toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {monthlyFuelData.find(m => m.cost === Math.max(...monthlyFuelData.map(m => m.cost)))?.month}
                                  </div>
                                </div>
                                <div className="p-2 bg-muted/20 rounded-md">
                                  <div className="text-xs text-muted-foreground">Lowest Month</div>
                                  <div className="font-medium">${Math.min(...monthlyFuelData.map(m => m.cost)).toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {monthlyFuelData.find(m => m.cost === Math.min(...monthlyFuelData.map(m => m.cost)))?.month}
                                  </div>
                                </div>
                              </div>

                              <div className="pt-3 mt-1 border-t">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Cost Distribution</span>
                                  <Select defaultValue="6months">
                                    <SelectTrigger className="h-7 text-xs w-[100px]">
                                      <SelectValue placeholder="Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="3months">3 Months</SelectItem>
                                      <SelectItem value="6months">6 Months</SelectItem>
                                      <SelectItem value="1year">1 Year</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Fuel Costs</span>
                                    <span>85%</span>
                                  </div>
                                  <Progress value={85} className="h-1" />
                                  <div className="flex justify-between text-xs mt-2">
                                    <span className="text-muted-foreground">Maintenance</span>
                                    <span>12%</span>
                                  </div>
                                  <Progress value={12} className="h-1" />
                                  <div className="flex justify-between text-xs mt-2">
                                    <span className="text-muted-foreground">Other</span>
                                    <span>3%</span>
                                  </div>
                                  <Progress value={3} className="h-1" />
                                </div>
                              </div>

                              <div className="pt-3 mt-1 border-t">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Cost Trends</span>
                                  <Badge variant="outline" className="text-xs">Last 30 Days</Badge>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <TrendingDown className="h-4 w-4 text-green-500" />
                                      <span>Fuel Cost Trend</span>
                                    </div>
                                    <span className="text-green-500">-2.5%</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="h-4 w-4 text-amber-500" />
                                      <span>Maintenance Cost</span>
                                    </div>
                                    <span className="text-amber-500">+1.8%</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <TrendingDown className="h-4 w-4 text-green-500" />
                                      <span>Cost per Mile</span>
                                    </div>
                                    <span className="text-green-500">-3.2%</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <TrendingDown className="h-4 w-4 text-green-500" />
                                      <span>Overall Costs</span>
                                    </div>
                                    <span className="text-green-500">-1.5%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="efficiency">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Gauge className="h-4 w-4 mr-2 text-primary" />
                          Fleet Efficiency Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Heavy Trucks - MPG</span>
                              <span className="text-sm font-medium">12.5 MPG</span>
                            </div>
                            <Progress value={42} className="h-1.5" />
                            <div className="flex items-center justify-end mt-1">
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                              <span className="text-xs text-green-600">+0.8 MPG from last quarter</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Medium Trucks - MPG</span>
                              <span className="text-sm font-medium">16.8 MPG</span>
                            </div>
                            <Progress value={56} className="h-1.5" />
                            <div className="flex items-center justify-end mt-1">
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                              <span className="text-xs text-green-600">+1.2 MPG from last quarter</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Light Vans - MPG</span>
                              <span className="text-sm font-medium">23.5 MPG</span>
                            </div>
                            <Progress value={78} className="h-1.5" />
                            <div className="flex items-center justify-end mt-1">
                              <TrendingDown className="h-3 w-3 text-amber-500 mr-1" />
                              <span className="text-xs text-amber-600">-0.5 MPG from last quarter</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                          Efficiency Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                            <div className="flex items-center">
                              <Battery className="h-4 w-4 text-blue-600 dark:text-blue-500 mr-2" />
                              <div className="text-sm font-medium text-blue-800 dark:text-blue-400">Idle Time Reduction</div>
                            </div>
                            <p className="text-xs text-blue-800 dark:text-blue-400 mt-1">
                              Reducing engine idle time by 10% could save approximately 120 gallons of fuel per month across the fleet.
                            </p>
                          </div>
                          
                          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                            <div className="flex items-center">
                              <Route className="h-4 w-4 text-green-600 dark:text-green-500 mr-2" />
                              <div className="text-sm font-medium text-green-800 dark:text-green-400">Route Optimization</div>
                            </div>
                            <p className="text-xs text-green-800 dark:text-green-400 mt-1">
                              Optimizing delivery routes could improve fuel efficiency by up to 15% for the distribution department.
                            </p>
                          </div>
                          
                          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                            <div className="flex items-center">
                              <Gauge className="h-4 w-4 text-amber-600 dark:text-amber-500 mr-2" />
                              <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Tire Pressure Monitoring</div>
                            </div>
                            <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
                              Regular tire pressure checks could improve MPG by 3.3% across the fleet.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

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
                            locationName={(selectedVehicle as ExtendedVehicle).location!.address}
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
                                      ? (selectedVehicle as ExtendedVehicle).lastMaintenance.toLocaleDateString()
                                      : String((selectedVehicle as ExtendedVehicle).lastMaintenance)) 
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Registration Expires:</span>
                              <span className="font-medium">
                                {(selectedVehicle as ExtendedVehicle).registrationExpiry ? new Date((selectedVehicle as ExtendedVehicle).registrationExpiry).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Insurance Expires:</span>
                              <span className="font-medium">
                                {(selectedVehicle as ExtendedVehicle).insuranceExpiry ? new Date((selectedVehicle as ExtendedVehicle).insuranceExpiry).toLocaleDateString() : 'N/A'}
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
        vehicle={selectedVehicle}
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