import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
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

// Wrapper component to conditionally center content
function ContentWrapper({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  // Only center these specific pages
  const shouldCenter = ["/vehicles", "/shipments", "/analytics", "/routes"].includes(location);
  
  return (
    <div className={shouldCenter ? "container mx-auto" : ""}>
      {children}
    </div>
  );
}

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 left-0 z-50 w-64 h-screen transform transition-transform md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar isMobile onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header onMenuClick={toggleSidebar} />
        
        <div className="flex-1 overflow-auto">
          <ContentWrapper>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/vehicles" component={Vehicles} />
              <Route path="/shipments" component={Shipments} />
              <Route path="/customers" component={Customers} />
              <Route path="/suppliers">
                {() => {
                  window.location.pathname = "/suppliers/performance";
                  return null;
                }}
              </Route>
              <Route path="/suppliers/performance" component={Suppliers} />
              <Route path="/suppliers/directory" component={Suppliers} />
              <Route path="/suppliers/orders" component={Suppliers} />
              <Route path="/suppliers/quality" component={Suppliers} />
              <Route path="/warehouse" component={Warehouse} />
              <Route path="/warehouse/inventory" component={Warehouse} />
              <Route path="/warehouse/analytics" component={Warehouse} />
              <Route path="/warehouse/storage" component={Warehouse} />
              <Route path="/orders" component={OrderManagement} />
              <Route path="/routes" component={RouteOptimization} />
              <Route path="/reports">
                {() => {
                  window.location.pathname = "/reports/recent";
                  return null;
                }}
              </Route>
              <Route path="/reports/recent" component={Reports} />
              <Route path="/reports/templates" component={Reports} />
              <Route path="/reports/scheduled" component={Reports} />
              <Route path="/reports/builder" component={Reports} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
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
      <ThemeProvider defaultTheme="light">
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
