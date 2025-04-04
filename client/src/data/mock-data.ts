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

// Cost analysis data
export const costAnalysisData = [
  { month: "Jan", fuel: 42500, maintenance: 18400, labor: 65200, insurance: 12500, other: 8300 },
  { month: "Feb", fuel: 40100, maintenance: 22300, labor: 64800, insurance: 12500, other: 7800 },
  { month: "Mar", fuel: 45600, maintenance: 16700, labor: 66100, insurance: 12500, other: 9100 },
  { month: "Apr", fuel: 48800, maintenance: 25600, labor: 65400, insurance: 12500, other: 8600 },
  { month: "May", fuel: 46200, maintenance: 19800, labor: 67300, insurance: 12500, other: 9400 },
  { month: "Jun", fuel: 32400, maintenance: 21900, labor: 68700, insurance: 12500, other: 7800 },
  { month: "Jul", fuel: 29000, maintenance: 17400, labor: 67600, insurance: 12500, other: 7200 }
];

// Maintenance cost breakdown by vehicle type
export const maintenanceCostByVehicleType = [
  { type: "Heavy Truck", preventive: 45, corrective: 32, emergency: 23 },
  { type: "Medium Truck", preventive: 52, corrective: 28, emergency: 20 },
  { type: "Delivery Van", preventive: 58, corrective: 25, emergency: 17 },
  { type: "Electric Vehicle", preventive: 68, corrective: 22, emergency: 10 }
];

// Cost per mile trends
export const costPerMileData = [
  { month: "Jan", heavyTruck: 1.72, mediumTruck: 1.45, deliveryVan: 0.95, electric: 0.62 },
  { month: "Feb", heavyTruck: 1.68, mediumTruck: 1.43, deliveryVan: 0.94, electric: 0.60 },
  { month: "Mar", heavyTruck: 1.76, mediumTruck: 1.46, deliveryVan: 0.98, electric: 0.61 },
  { month: "Apr", heavyTruck: 1.81, mediumTruck: 1.49, deliveryVan: 1.02, electric: 0.65 },
  { month: "May", heavyTruck: 1.78, mediumTruck: 1.47, deliveryVan: 1.00, electric: 0.64 },
  { month: "Jun", heavyTruck: 1.65, mediumTruck: 1.41, deliveryVan: 0.92, electric: 0.60 },
  { month: "Jul", heavyTruck: 1.58, mediumTruck: 1.38, deliveryVan: 0.90, electric: 0.59 }
];

// Sustainability metrics
export const sustainabilityData = [
  { quarter: "Q1 2022", carbonEmissions: 1250, fuelEfficiency: 7.8, electricVehicles: 5, renewableEnergy: 12 },
  { quarter: "Q2 2022", carbonEmissions: 1180, fuelEfficiency: 8.0, electricVehicles: 7, renewableEnergy: 15 },
  { quarter: "Q3 2022", carbonEmissions: 1140, fuelEfficiency: 8.1, electricVehicles: 8, renewableEnergy: 18 },
  { quarter: "Q4 2022", carbonEmissions: 1090, fuelEfficiency: 8.3, electricVehicles: 10, renewableEnergy: 22 },
  { quarter: "Q1 2023", carbonEmissions: 1020, fuelEfficiency: 8.4, electricVehicles: 12, renewableEnergy: 25 },
  { quarter: "Q2 2023", carbonEmissions: 950, fuelEfficiency: 8.6, electricVehicles: 15, renewableEnergy: 30 }
];

// Carbon offset projects
export const carbonOffsetProjects = [
  { project: "Reforestation Initiative", contribution: 48, offset: 320, status: "active" },
  { project: "Solar Farm Investment", contribution: 35, offset: 280, status: "active" },
  { project: "Wind Energy Credits", contribution: 12, offset: 150, status: "completed" },
  { project: "EV Charging Network", contribution: 5, offset: 80, status: "planning" }
];

// Emissions by vehicle type and distance
export const emissionsByVehicleData = [
  { type: "Heavy Diesel Truck", emissions: 1.55, distance: 420000 },
  { type: "Medium Diesel Truck", emissions: 0.95, distance: 380000 },
  { type: "Gasoline Van", emissions: 0.45, distance: 320000 },
  { type: "Hybrid Van", emissions: 0.28, distance: 180000 },
  { type: "Electric Vehicle", emissions: 0.05, distance: 85000 }
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

// Mock data for NetworkAnalytics component
export const networkAnalyticsData = {
  // Network metrics for the KPI cards
  networkMetrics: [
    { name: "Network Efficiency", value: "94.2%", change: 3.1, status: "positive" },
    { name: "Connection Reliability", value: "99.8%", change: 0.5, status: "positive" },
    { name: "Avg Transit Time", value: "2.4 days", change: -8.2, status: "positive" },
    { name: "Delivery Exceptions", value: "3.1%", change: 2.7, status: "negative" }
  ],
  
  // Hub performance data
  hubPerformance: [
    { hub: "Los Angeles", throughput: 15240, utilization: 87, deliveryTime: 1.8, delayRate: 2.4 },
    { hub: "Chicago", throughput: 12750, utilization: 92, deliveryTime: 1.6, delayRate: 1.7 },
    { hub: "New York", throughput: 14850, utilization: 95, deliveryTime: 2.1, delayRate: 3.2 },
    { hub: "Dallas", throughput: 9250, utilization: 81, deliveryTime: 1.9, delayRate: 2.8 },
    { hub: "Seattle", throughput: 7820, utilization: 78, deliveryTime: 2.3, delayRate: 3.5 },
    { hub: "Miami", throughput: 8640, utilization: 83, deliveryTime: 2.0, delayRate: 2.9 }
  ],
  
  // Route performance data
  routePerformance: [
    { route: "LA to Chicago", volume: 4200, time: 31.5, distance: 2015, cost: 1.42, congestion: 12.4 },
    { route: "NY to Miami", volume: 3850, time: 21.2, distance: 1280, cost: 1.31, congestion: 18.7 },
    { route: "Dallas to Seattle", volume: 3100, time: 35.7, distance: 2190, cost: 1.55, congestion: 8.2 },
    { route: "Chicago to NY", volume: 4720, time: 15.3, distance: 790, cost: 1.28, congestion: 23.5 },
    { route: "Miami to Dallas", volume: 2840, time: 24.8, distance: 1320, cost: 1.36, congestion: 9.1 }
  ],
  
  // Network volume data
  networkVolume: [
    { date: "2023-01", volume: 42500, forecast: null },
    { date: "2023-02", volume: 45200, forecast: null },
    { date: "2023-03", volume: 48700, forecast: null },
    { date: "2023-04", volume: 51300, forecast: null },
    { date: "2023-05", volume: 49800, forecast: null },
    { date: "2023-06", volume: 53400, forecast: null },
    { date: "2023-07", volume: 57200, forecast: null },
    { date: "2023-08", volume: 59500, forecast: null },
    { date: "2023-09", volume: 61200, forecast: null },
    { date: "2023-10", volume: 63800, forecast: null },
    { date: "2023-11", volume: 68400, forecast: null },
    { date: "2023-12", volume: 72500, forecast: null },
    { date: "2024-01", volume: 75200, forecast: null },
    { date: "2024-02", volume: 77800, forecast: 77800 },
    { date: "2024-03", volume: null, forecast: 80500 },
    { date: "2024-04", volume: null, forecast: 83700 },
    { date: "2024-05", volume: null, forecast: 87200 },
    { date: "2024-06", volume: null, forecast: 91500 }
  ],
  
  // Network bottlenecks
  bottlenecks: [
    { location: "Chicago Hub", severity: 8.2, impactedShipments: 1240, avgDelay: 5.8 },
    { location: "I-95 Corridor", severity: 7.5, impactedShipments: 980, avgDelay: 4.2 },
    { location: "LA Port", severity: 6.8, impactedShipments: 1850, avgDelay: 12.5 },
    { location: "Dallas Sort Facility", severity: 5.4, impactedShipments: 670, avgDelay: 3.1 },
    { location: "NY-NJ Bridge", severity: 7.9, impactedShipments: 1420, avgDelay: 7.3 }, 
    { location: "Miami Port", severity: 6.2, impactedShipments: 1550, avgDelay: 10.2 },
    { location: "Atlanta Hub", severity: 5.9, impactedShipments: 1100, avgDelay: 6.5 },
    { location: "Houston Port", severity: 5.6, impactedShipments: 1300, avgDelay: 8.4 },
    { location: "Seattle Hub", severity: 4.8, impactedShipments: 1050, avgDelay: 5.2 },
  ],
  
  // Connection matrix data
  connectionMatrix: [
    { from: "LA", to: "Chicago", strength: 8.7, volume: 4200 },
    { from: "LA", to: "Dallas", strength: 7.9, volume: 3600 },
    { from: "Chicago", to: "NY", strength: 9.2, volume: 4720 },
    { from: "NY", to: "Miami", strength: 8.4, volume: 3850 },
    { from: "Dallas", to: "Miami", strength: 7.5, volume: 2840 },
    { from: "Dallas", to: "Seattle", strength: 6.8, volume: 3100 },
    { from: "Seattle", to: "LA", strength: 8.1, volume: 3750 }
  ]
};

// Mock data for LogisticsPerformanceMatrix component
export const logisticsPerformanceData = {
  // Performance domains data with metrics
  performanceDomains: [
    {
      name: "Operations",
      icon: "Settings",
      score: 87,
      trend: 5,
      status: "good",
      metrics: [
        { name: "Process Efficiency", value: 92, target: 95, unit: "%", trend: 3 },
        { name: "Resource Utilization", value: 83, target: 90, unit: "%", trend: 7 },
        { name: "SLA Compliance", value: 96, target: 98, unit: "%", trend: 2 }
      ]
    },
    {
      name: "Transportation",
      icon: "Truck",
      score: 91,
      trend: 3,
      status: "excellent",
      metrics: [
        { name: "On-Time Delivery", value: 94, target: 95, unit: "%", trend: 2 },
        { name: "Fleet Utilization", value: 88, target: 90, unit: "%", trend: 5 },
        { name: "Cost per Mile", value: 1.24, target: 1.30, unit: "$", trend: 4 }
      ]
    },
    {
      name: "Warehousing",
      icon: "Warehouse",
      score: 76,
      trend: -2,
      status: "average",
      metrics: [
        { name: "Inventory Accuracy", value: 96, target: 99, unit: "%", trend: 1 },
        { name: "Space Utilization", value: 72, target: 85, unit: "%", trend: -4 },
        { name: "Order Accuracy", value: 98, target: 99.5, unit: "%", trend: 0.5 }
      ]
    },
    {
      name: "Customer Service",
      icon: "Users",
      score: 82,
      trend: 8,
      status: "good",
      metrics: [
        { name: "Satisfaction Score", value: 4.2, target: 4.5, unit: "/5", trend: 0.3 },
        { name: "Response Time", value: 4.8, target: 4.0, unit: "hrs", trend: -0.5 },
        { name: "Issue Resolution", value: 91, target: 95, unit: "%", trend: 4 }
      ]
    }
  ],
  
  // KPI trend data
  kpiTrend: [
    { category: "Delivery Performance", value: 94, target: 96 },
    { category: "Warehouse Efficiency", value: 83, target: 90 },
    { category: "Route Optimization", value: 78, target: 85 },
    { category: "Inventory Turnover", value: 12, target: 15 },
    { category: "Order Accuracy", value: 98, target: 99 },
    { category: "Customer Satisfaction", value: 4.2, target: 4.5 },
    { category: "Cost per Delivery", value: 32, target: 28 }
  ],
  
  // Daily performance tracking
  dailyPerformance: [
    { date: "Mon", operations: 84, delivery: 92, warehouse: 79, customer: 86 },
    { date: "Tue", operations: 86, delivery: 90, warehouse: 81, customer: 88 },
    { date: "Wed", operations: 82, delivery: 94, warehouse: 80, customer: 85 },
    { date: "Thu", operations: 89, delivery: 91, warehouse: 78, customer: 87 },
    { date: "Fri", operations: 91, delivery: 89, warehouse: 82, customer: 89 },
    { date: "Sat", operations: 85, delivery: 87, warehouse: 77, customer: 83 },
    { date: "Sun", operations: 78, delivery: 82, warehouse: 72, customer: 80 }
  ],
  
  // Risk assessment data
  riskAssessment: [
    { category: "Fuel Price Volatility", probability: 8, impact: 7, readiness: 6 },
    { category: "Labor Shortages", probability: 6, impact: 8, readiness: 5 },
    { category: "Weather Disruptions", probability: 7, impact: 9, readiness: 7 },
    { category: "IT System Failures", probability: 4, impact: 10, readiness: 8 },
    { category: "Regulatory Changes", probability: 5, impact: 6, readiness: 7 }
  ],
  
  // Improvement opportunities
  improvementOpportunities: [
    { area: "Route Optimization Algorithm", potential: 8, effort: 7, priority: 9 },
    { area: "Cross-dock Process Redesign", potential: 7, effort: 6, priority: 8 },
    { area: "Inventory Management System", potential: 9, effort: 9, priority: 7 },
    { area: "Driver Training Program", potential: 6, effort: 4, priority: 7 },
    { area: "Warehouse Layout Redesign", potential: 8, effort: 8, priority: 6 }
  ]
};
