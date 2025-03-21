// Mock data for the logistics dashboard

// KPI data
export const kpiData = {
  activeVehicles: {
    total: 48,
    active: 42,
    utilization: 87.5,
  },
  onTimeDeliveries: {
    percentage: 94.2,
    change: 1.5,
  },
  pendingOrders: {
    total: 153,
    urgent: 12,
    normal: 141,
  },
  fuelEfficiency: {
    value: 8.4,
    unit: "L/100km",
    change: -3.2,
  },
};

// Vehicle location data for map
export const vehicleLocations = [
  { id: "T-245", name: "Truck #T-245", status: "active", lat: 37.7749, lng: -122.4194 },
  { id: "T-246", name: "Truck #T-246", status: "active", lat: 37.3352, lng: -121.8811 },
  { id: "V-427", name: "Van #V-427", status: "active", lat: 37.5485, lng: -121.9886 },
  { id: "V-428", name: "Van #V-428", status: "idle", lat: 37.6688, lng: -122.0808 },
  { id: "T-248", name: "Truck #T-248", status: "active", lat: 37.9577, lng: -122.3476 },
  { id: "T-249", name: "Truck #T-249", status: "delayed", lat: 38.5816, lng: -121.4944 },
];

// Route data for map
export const routePoints = [
  [37.7749, -122.4194], // San Francisco
  [37.6688, -122.0808], // Hayward
  [37.3352, -121.8811], // San Jose
  [36.9741, -122.0308], // Santa Cruz
  [36.6002, -121.8947], // Monterey
];

// Geofence data for map
export const geofencePoints = [
  [37.8, -122.5],
  [37.8, -122.3],
  [37.6, -122.3],
  [37.6, -122.5],
];

// Shipment status data
export const activeShipments = [
  {
    id: "3842",
    route: "Los Angeles to San Francisco",
    status: "in-transit",
    origin: "Los Angeles, CA",
    destination: "San Francisco, CA",
    eta: "Today, 03:45 PM",
    vehicle: "Truck #T-245",
    items: 12,
    timeline: [
      {
        title: "Picked up from warehouse",
        time: "Today, 09:15 AM",
        completed: true,
      },
      {
        title: "Departed Los Angeles",
        time: "Today, 10:30 AM",
        completed: true,
      },
      {
        title: "In transit",
        time: "ETA: Today, 03:45 PM",
        completed: true,
        current: true,
      },
      {
        title: "Delivery in San Francisco",
        time: "Expected: Today, 03:45 PM",
        completed: false,
      },
    ],
  },
  {
    id: "3839",
    route: "Seattle to Portland",
    status: "delayed",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    eta: "Today, 02:30 PM",
    vehicle: "Truck #T-248",
    items: 8,
    timeline: [
      {
        title: "Picked up from warehouse",
        time: "Today, 08:00 AM",
        completed: true,
      },
      {
        title: "Departed Seattle",
        time: "Today, 08:45 AM",
        completed: true,
      },
      {
        title: "Delayed - Traffic congestion",
        time: "Updated ETA: Today, 02:30 PM",
        completed: true,
        current: true,
        delayed: true,
      },
      {
        title: "Delivery in Portland",
        time: "Expected: Today, 02:30 PM",
        completed: false,
      },
    ],
  },
  {
    id: "3836",
    route: "Denver to Kansas City",
    status: "in-transit",
    origin: "Denver, CO",
    destination: "Kansas City, MO",
    eta: "Today, 06:15 PM",
    vehicle: "Truck #T-246",
    items: 15,
    timeline: [
      {
        title: "Picked up from warehouse",
        time: "Today, 07:30 AM",
        completed: true,
      },
      {
        title: "In transit",
        time: "ETA: Today, 06:15 PM",
        completed: true,
        current: true,
      },
    ],
  },
  {
    id: "3835",
    route: "Chicago to Indianapolis",
    status: "delivered",
    origin: "Chicago, IL",
    destination: "Indianapolis, IN",
    eta: "Today, 12:30 PM",
    vehicle: "Van #V-427",
    items: 6,
    timeline: [
      {
        title: "Picked up from warehouse",
        time: "Today, 06:30 AM",
        completed: true,
      },
      {
        title: "Departed Chicago",
        time: "Today, 07:15 AM",
        completed: true,
      },
      {
        title: "Arrived in Indianapolis",
        time: "Today, 12:15 PM",
        completed: true,
      },
      {
        title: "Delivered to customer",
        time: "Today, 12:30 PM",
        completed: true,
      },
    ],
  },
  {
    id: "3834",
    route: "New York to Boston",
    status: "pending",
    origin: "New York, NY",
    destination: "Boston, MA",
    eta: "Tomorrow, 10:00 AM",
    vehicle: "Van #V-428",
    items: 9,
    timeline: [
      {
        title: "Order processed",
        time: "Today, 02:30 PM",
        completed: true,
      },
      {
        title: "Scheduled for pickup",
        time: "Tomorrow, 07:00 AM",
        completed: false,
      },
    ],
  },
];

// Orders data
export const orders = [
  {
    id: "3842",
    customer: "Acme Inc.",
    from: "Los Angeles, CA",
    to: "San Francisco, CA",
    status: "In Transit",
    date: "Aug 10, 2023",
  },
  {
    id: "3839",
    customer: "TechCorp",
    from: "Seattle, WA",
    to: "Portland, OR",
    status: "Delayed",
    date: "Aug 10, 2023",
  },
  {
    id: "3836",
    customer: "GlobalTrade",
    from: "Denver, CO",
    to: "Kansas City, MO",
    status: "In Transit",
    date: "Aug 10, 2023",
  },
  {
    id: "3835",
    customer: "Metro Supplies",
    from: "Chicago, IL",
    to: "Indianapolis, IN",
    status: "Delivered",
    date: "Aug 9, 2023",
  },
  {
    id: "3834",
    customer: "East Coast Distribution",
    from: "New York, NY",
    to: "Boston, MA",
    status: "Delivered",
    date: "Aug 9, 2023",
  },
];

// Fleet status data
export const fleetData = {
  summary: {
    totalVehicles: 48,
    activeVehicles: 42,
    inMaintenance: 6,
    outOfService: 0,
    newVehicles: 3,
    activePercentage: 87.5,
    maintenancePercentage: 12.5,
    outOfServicePercentage: 0
  },
  status: {
    active: 42,
    maintenance: 6,
    inactive: 0,
  },
  changes: {
    active: "+3 from yesterday",
    maintenance: "-1 from yesterday",
    inactive: "No change",
  },
  vehicles: [
    {
      id: "T-245",
      name: "Truck #T-245",
      type: "Heavy Truck",
      status: "active",
      lastLocation: "San Francisco, CA",
      lastUpdated: "10 min ago"
    },
    {
      id: "T-246",
      name: "Truck #T-246",
      type: "Heavy Truck",
      status: "active",
      lastLocation: "San Jose, CA",
      lastUpdated: "15 min ago"
    },
    {
      id: "V-427",
      name: "Van #V-427",
      type: "Delivery Van",
      status: "active",
      lastLocation: "Oakland, CA",
      lastUpdated: "25 min ago"
    },
    {
      id: "V-428",
      name: "Van #V-428",
      type: "Delivery Van",
      status: "idle",
      lastLocation: "Santa Clara, CA",
      lastUpdated: "35 min ago"
    },
    {
      id: "T-248",
      name: "Truck #T-248",
      type: "Medium Truck",
      status: "active",
      lastLocation: "Sacramento, CA",
      lastUpdated: "45 min ago"
    },
    {
      id: "T-249",
      name: "Truck #T-249",
      type: "Medium Truck",
      status: "maintenance",
      lastLocation: "Fremont, CA",
      lastUpdated: "1 hour ago"
    },
    {
      id: "T-250",
      name: "Truck #T-250",
      type: "Heavy Truck",
      status: "maintenance",
      lastLocation: "Palo Alto, CA",
      lastUpdated: "2 hours ago"
    },
    {
      id: "T-251",
      name: "Truck #T-251", 
      type: "Heavy Truck",
      status: "out-of-service",
      lastLocation: "Mountain View, CA",
      lastUpdated: "3 hours ago"
    }
  ],
  maintenanceSchedule: [
    {
      vehicleId: "T-238",
      serviceType: "Regular maintenance",
      scheduledDate: "Aug 15, 2023",
      status: "scheduled",
      priority: "medium"
    },
    {
      vehicleId: "V-427",
      serviceType: "Tire replacement",
      scheduledDate: "Aug 17, 2023",
      status: "scheduled",
      priority: "high"
    },
    {
      vehicleId: "T-249",
      serviceType: "Engine inspection",
      scheduledDate: "Aug 12, 2023",
      status: "in-progress",
      priority: "high"
    },
    {
      vehicleId: "T-250",
      serviceType: "Brake system overhaul",
      scheduledDate: "Aug 10, 2023",
      status: "completed",
      priority: "high"
    },
    {
      vehicleId: "V-422",
      serviceType: "Oil change",
      scheduledDate: "Aug 8, 2023",
      status: "completed",
      priority: "low"
    }
  ],
  upcoming: [
    {
      id: "T-238",
      type: "Truck",
      service: "Regular service",
      date: "Aug 15",
    },
    {
      id: "V-427",
      type: "Van",
      service: "Tire replacement",
      date: "Aug 17",
    },
  ],
};

// Performance chart data
export const deliveryPerformanceData = [
  { date: "Mon", onTime: 92, late: 8 },
  { date: "Tue", onTime: 93, late: 7 },
  { date: "Wed", onTime: 90, late: 10 },
  { date: "Thu", onTime: 94, late: 6 },
  { date: "Fri", onTime: 97, late: 3 },
  { date: "Sat", onTime: 95, late: 5 },
  { date: "Sun", onTime: 94, late: 6 }
];

// Fuel consumption data
export const fuelConsumptionData = [
  { month: "Jan", diesel: 1250, gasoline: 850, electric: 320 },
  { month: "Feb", diesel: 1180, gasoline: 880, electric: 350 },
  { month: "Mar", diesel: 1300, gasoline: 920, electric: 410 },
  { month: "Apr", diesel: 1420, gasoline: 850, electric: 450 },
  { month: "May", diesel: 1350, gasoline: 750, electric: 520 },
  { month: "Jun", diesel: 950, gasoline: 680, electric: 580 },
  { month: "Jul", diesel: 850, gasoline: 720, electric: 620 }
];

// Alert data
export const alertsData = [
  {
    type: "error",
    title: "Geofence Breach Alert",
    message: "Truck #T-245 has left the designated route. Location: Hwy 101, near San Jose.",
    time: "10 min ago",
  },
  {
    type: "warning",
    title: "Maintenance Warning",
    message: "Van #V-108 is due for maintenance in 3 days. Schedule service soon.",
    time: "1 hour ago",
  },
  {
    type: "info",
    title: "Inventory Alert",
    message: "Warehouse A - Low stock of 5 items. Review inventory report.",
    time: "3 hours ago",
  },
];
