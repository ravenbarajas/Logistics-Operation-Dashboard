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
    status: "In Transit",
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
    status: "Delayed",
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
    status: "In Transit",
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
export const deliveryPerformanceData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  onTimeData: [92, 93, 90, 94, 97, 95, 94],
  delayedData: [8, 7, 10, 6, 3, 5, 6],
};

// Fuel consumption data
export const fuelConsumptionData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  values: [1250, 1180, 1300, 1420, 1350, 950, 850],
};

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
