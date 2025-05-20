// Application configuration
// Change these settings when cloning the project for different environments

// Define module types for type safety
export type ModuleType = "dashboard" | "vehicles" | "shipments" | "customers" | "suppliers" | 
                         "warehouse" | "orders" | "routes" | "reports" | "analytics" | "settings";

// This controls which module loads by default when the application starts
export const DEFAULT_MODULE: ModuleType = "customers";

// Map of module names to their corresponding routes
export const MODULE_ROUTES: Record<ModuleType, string> = {
  dashboard: "/",
  vehicles: "/vehicles", // Landing Page works with this route
  shipments: "/shipments", // Landing Page works with this route
  customers: "/customers", // Landing Page works with this route
  suppliers: "/suppliers", // Landing Page works with this route
  warehouse: "/warehouse", // Landing Page works with this route
  orders: "/orders", // Landing Page works with this route
  routes: "/routes", // Landing Page works with this route
  reports: "/reports",
  analytics: "/analytics",
  settings: "/settings"
};

// Module titles for header
export const MODULE_TITLES: Record<ModuleType, string> = {
  dashboard: "Dashboard",
  vehicles: "Fleet Management",
  shipments: "Shipment Management",
  customers: "Customer Management",
  suppliers: "Supplier Management",
  warehouse: "Warehouse Management",
  orders: "Order Management",
  routes: "Route Optimization",
  reports: "Reports",
  analytics: "Analytics",
  settings: "Settings"
};