import { useState, useEffect } from "react";
import { Switch, Route, useLocation, useRoute, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Vehicles from "@/pages/Vehicles";
import Shipments from "@/pages/Shipments";
import Customers from "@/pages/Customers";
import Suppliers from "@/pages/Suppliers";
import Warehouse from "@/pages/Warehouse";
import OrderManagement from "@/pages/OrderManagement";
import RouteOptimization from "@/pages/RouteOptimization";
import Reports from "@/pages/Reports";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import OrdersLandingPage from "@/landing/orders/OrdersLandingPage";
import CustomersLandingPage from "@/landing/customers/CustomersLandingPage";
import ShipmentsLandingPage from "@/landing/shipments/ShipmentsLandingPage";
import VehiclesLandingPage from "@/landing/vehicles/VehiclesLandingPage";
import SuppliersLandingPage from "@/landing/suppliers/SuppliersLandingPage";
import WarehouseLandingPage from "@/landing/warehouse/WarehouseLandingPage";
import RoutesLandingPage from "@/landing/routes/RoutesLandingPage";
import ReportsLandingPage from "@/landing/reports/ReportsLandingPage";
import AnalyticsLandingPage from "@/landing/analytics/AnalyticsLandingPage";
import { DEFAULT_MODULE, MODULE_ROUTES, MODULE_TITLES, ModuleType } from "./config";

// Get the base path from the current URL
const getBasePath = (): string => {
  const pathSegments = window.location.pathname.split('/');
  // If running in subfolder, return that subfolder
  if (pathSegments.length > 2 && pathSegments[1] !== '') {
    return '/' + pathSegments[1];
  }
  return '';
};

// Create a custom makePath function
const makePath = (path: string): string => {
  const basePath = getBasePath();
  if (path.startsWith('/')) {
    return `${basePath}${path}`;
  }
  return `${basePath}/${path}`;
};

// Wrapper component to conditionally center content
function ContentWrapper({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  // Only center these specific pages
  const shouldCenter = [
    "/vehicles", 
    "/vehicles/inventory", 
    "/vehicles/drivers", 
    "/vehicles/maintenance", 
    "/vehicles/fuel", 
    "/shipments",
    "/shipments/tracking",
    "/shipments/exceptions",
    "/shipments/efficiency",
    "/shipments/environmental",
    "/analytics", 
    "/routes",
    "/routes/management",
    "/routes/traffic",
    "/routes/insights"
  ].includes(location);
  
  return (
    <div className={shouldCenter ? "container mx-auto" : ""}>
      {children}
    </div>
  );
}

// Define the standalone routes where sidebar should be hidden
const STANDALONE_ROUTES = [
  // Vehicles module
  "/vehicles",
  "/vehicles/inventory",
  "/vehicles/drivers",
  "/vehicles/maintenance",
  "/vehicles/fuel",
  
  // Shipment module
  "/shipments",
  "/shipments/tracking",
  "/shipments/exceptions",
  "/shipments/efficiency",
  "/shipments/environmental",
  
  // Customer module
  "/customers",
  "/customers/summary",
  "/customers/directory",
  "/customers/segmentation",
  "/customers/satisfaction",
  
  // Supplier module
  "/suppliers",
  "/suppliers/performance",
  "/suppliers/directory",
  "/suppliers/orders",
  "/suppliers/quality",
  
  // Warehouse module
  "/warehouse",
  "/warehouse/warehouses",
  "/warehouse/inventory",
  "/warehouse/analytics",
  "/warehouse/storage",
  
  // Orders module
  "/orders",
  "/orders/management",
  "/orders/analytics",
  "/orders/performance",
  "/orders/financials",
  
  // Routes module
  "/routes",
  "/routes/management",
  "/routes/optimization",
  "/routes/traffic",
  "/routes/insights",
  
  // Reports module
  "/reports",
  "/reports/recent",
  "/reports/templates",
  "/reports/scheduled",
  "/reports/builder",
  
  // Analytics module
  "/analytics",
  "/analytics/risk",
  "/analytics/performance",
  "/analytics/route",
  "/analytics/financial",
  
  // Settings
  "/settings"
];

// Secret links for navigation between modules
export const STANDALONE_LINKS = {
  dashboard: "/",
  vehicles: "/vehicles",
  shipments: "/shipments",
  customers: "/customers",
  suppliers: "/suppliers",
  warehouse: "/warehouse",
  orders: "/orders",
  routes: "/routes",
  reports: "/reports",
  analytics: "/analytics",
  settings: "/settings"
};

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const [isRootPath] = useRoute("/");
  
  // Default module redirection is now handled in main.tsx and index.html
  // No need for redirection logic here anymore
  
  // Check if current route should be standalone (without sidebar)
  const isStandalone = STANDALONE_ROUTES.some(route => location === route || location.startsWith(route));
  
  // Get the module title for header from our configuration
  const getModuleTitle = () => {
    for (const [module, path] of Object.entries(MODULE_ROUTES)) {
      if (location === path || location.startsWith(path)) {
        return MODULE_TITLES[module as ModuleType];
      }
    }
    return MODULE_TITLES.dashboard;
  };
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [sidebarOpen]);
  
  const toggleSidebar = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar - only show if not in standalone mode */}
      {!isStandalone && (
        <div className="hidden md:block">
          <Sidebar />
        </div>
      )}
      
      {/* Mobile Sidebar Overlay - only show if not in standalone mode */}
      {!isStandalone && (
        <div 
          className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Mobile Sidebar - only show if not in standalone mode */}
      {!isStandalone && (
        <div 
          className={`fixed top-0 left-0 z-50 w-64 h-screen transform transition-transform md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar isMobile onClose={() => setSidebarOpen(false)} />
        </div>
      )}
      
      {/* Main Content - adjust width when sidebar is hidden */}
      <main className={`flex-1 overflow-hidden flex flex-col ${isStandalone ? 'w-full' : ''}`}>
        <Header 
          onMenuClick={!isStandalone ? toggleSidebar : undefined}
          isStandalone={isStandalone}
          title={getModuleTitle()}
        />
        
        <div className="flex-1 overflow-auto p-0">
          <ContentWrapper>
            <Switch>
              <Route path="/">
                {() => <Dashboard />}
              </Route>
              <Route path="/vehicles">
                {() => <VehiclesLandingPage />}
              </Route>
              <Route path="/vehicles/inventory">
                {() => <Vehicles />}
              </Route>
              <Route path="/vehicles/drivers">
                {() => <Vehicles />}
              </Route>
              <Route path="/vehicles/maintenance">
                {() => <Vehicles />}
              </Route>
              <Route path="/vehicles/fuel">
                {() => <Vehicles />}
              </Route>
              <Route path="/shipments">
                {() => <ShipmentsLandingPage />}
              </Route>
              <Route path="/shipments/tracking">
                {() => <Shipments />}
              </Route>
              <Route path="/shipments/exceptions">
                {() => <Shipments />}
              </Route>
              <Route path="/shipments/efficiency">
                {() => <Shipments />}
              </Route>
              <Route path="/shipments/environmental">
                {() => <Shipments />}
              </Route>
              <Route path="/customers">
                {() => <CustomersLandingPage />}
              </Route>
              <Route path="/customers/summary">
                {() => <Customers />}
              </Route>
              <Route path="/customers/directory">
                {() => <Customers />}
              </Route>
              <Route path="/customers/segmentation">
                {() => <Customers />}
              </Route>
              <Route path="/customers/satisfaction">
                {() => <Customers />}
              </Route>
              <Route path="/suppliers">
                {() => <SuppliersLandingPage />}
              </Route>
              <Route path="/suppliers/performance">
                {() => <Suppliers />}
              </Route>
              <Route path="/suppliers/directory">
                {() => <Suppliers />}
              </Route>
              <Route path="/suppliers/orders">
                {() => <Suppliers />}
              </Route>
              <Route path="/suppliers/quality">
                {() => <Suppliers />}
              </Route>
              <Route path="/warehouse">
                {() => <WarehouseLandingPage />}
              </Route>
              <Route path="/warehouse/warehouses">
                {() => <Warehouse />}
              </Route>
              <Route path="/warehouse/inventory">
                {() => <Warehouse />}
              </Route>
              <Route path="/warehouse/analytics">
                {() => <Warehouse />}
              </Route>
              <Route path="/warehouse/storage">
                {() => <Warehouse />}
              </Route>
              <Route path="/orders">
                {() => <OrdersLandingPage />}
              </Route>
              <Route path="/orders/management">
                {() => <OrderManagement />}
              </Route>
              <Route path="/orders/analytics">
                {() => <OrderManagement />}
              </Route>
              <Route path="/orders/performance">
                {() => <OrderManagement />}
              </Route>
              <Route path="/orders/financials">
                {() => <OrderManagement />}
              </Route>
              <Route path="/routes">
                {() => <RoutesLandingPage />}
              </Route>
              <Route path="/routes/management">
                {() => <RouteOptimization />}
              </Route>
              <Route path="/routes/optimization">
                {() => <RouteOptimization />}
              </Route>
              <Route path="/routes/traffic">
                {() => <RouteOptimization />}
              </Route>
              <Route path="/routes/insights">
                {() => <RouteOptimization />}
              </Route>
              <Route path="/reports">
                {() => <ReportsLandingPage />}
              </Route>
              <Route path="/reports/recent">
                {() => <Reports />}
              </Route>
              <Route path="/reports/templates">
                {() => <Reports />}
              </Route>
              <Route path="/reports/scheduled">
                {() => <Reports />}
              </Route>
              <Route path="/reports/builder">
                {() => <Reports />}
              </Route>
              <Route path="/analytics">
                {() => <AnalyticsLandingPage />}
              </Route>
              <Route path="/analytics/risk">
                {() => <Analytics />}
              </Route>
              <Route path="/analytics/performance">
                {() => <Analytics />}
              </Route>
              <Route path="/analytics/route">
                {() => <Analytics />}
              </Route>
              <Route path="/analytics/financial">
                {() => <Analytics />}
              </Route>
              <Route path="/settings">
                {() => <Settings />}
              </Route>
              <Route>
                {() => <NotFound />}
              </Route>
            </Switch>
          </ContentWrapper>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
