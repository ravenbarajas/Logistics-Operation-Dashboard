import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Compass,
  Heart,
  BarChart,
  RouteOff,
  Truck,
  LayoutGrid,
  Users,
  Table,
  Calendar,
  UserRound,
  Settings,
  ChevronDown,
  Package,
  Boxes,
  Activity,
  BarChart3,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SidebarProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

type NavItemChild = {
  title: string;
  href: string;
};

type NavItem = {
  title: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavItemChild[];
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    href: "/",
  },
  {
    title: "Fleet Management",
    icon: <Truck className="mr-2 h-4 w-4" />,
    children: [
      {
        title: "Vehicle Inventory",
        href: "/vehicles/inventory",
      },
      {
        title: "Driver Performance",
        href: "/vehicles/drivers",
      },
      {
        title: "Vehicle Maintenance",
        href: "/vehicles/maintenance",
      },
      {
        title: "Fuel Consumption",
        href: "/vehicles/fuel",
      },
    ],
  },
  {
    title: "Shipment Management",
    icon: <Package className="mr-2 h-4 w-4" />,
    children: [
      {
        title: "Shipment Tracking",
        href: "/shipments/tracking",
      },
      {
        title: "Shipment Exception",
        href: "/shipments/exceptions",
      },
      {
        title: "Shipment Efficiency",
        href: "/shipments/efficiency",
      },
      {
        title: "Environmental Impact",
        href: "/shipments/environmental",
      },
    ],
  },
  {
    title: "Analytics",
    icon: <BarChart className="mr-2 h-4 w-4" />,
    children: [
      {
        title: "Risk Analytics",
        href: "/analytics/risk",
      },
      {
        title: "Performance Insights",
        href: "/analytics/performance",
      },
      {
        title: "Route Analytics",
        href: "/analytics/route",
      },
      {
        title: "Financial Analytics",
        href: "/analytics/financial",
      },
    ],
  },
  {
    title: "Route Optimization",
    icon: <RouteOff className="mr-2 h-4 w-4" />,
    href: "/routes",
  },
  {
    title: "Order Management",
    icon: <Heart className="mr-2 h-4 w-4" />,
    href: "/orders",
  },
  {
    title: "Warehouse Management",
    icon: <LayoutGrid className="mr-2 h-4 w-4" />,
    children: [
      {
        title: "Warehouse",
        href: "/warehouse",
      },
      {
        title: "Inventory",
        href: "/warehouse/inventory",
      },
      {
        title: "Storage",
        href: "/warehouse/storage",
      },
      {
        title: "Analytics",
        href: "/warehouse/analytics",
      },
    ],
  },
  {
    title: "Supplier Management",
    icon: <Users className="mr-2 h-4 w-4" />,
    children: [
      {
        title: "Performance",
        href: "/suppliers/performance",
      },
      {
        title: "Directory",
        href: "/suppliers/directory",
      },
      {
        title: "Purchase Orders",
        href: "/suppliers/orders",
      },
      {
        title: "Quality Analysis",
        href: "/suppliers/quality",
      },
    ],
  },
  {
    title: "Reports",
    icon: <Table className="mr-2 h-4 w-4" />,
    children: [
      {
        title: "Recent Reports",
        href: "/reports/recent",
      },
      {
        title: "Report Templates",
        href: "/reports/templates",
      },
      {
        title: "Scheduled Reports",
        href: "/reports/scheduled",
      },
      {
        title: "Custom Report Builder",
        href: "/reports/builder",
      },
    ],
  },
  {
    title: "Customers",
    icon: <UserRound className="mr-2 h-4 w-4" />,
    children: [
      {
        title: "Customer Summary",
        href: "/customers/summary",
      },
      {
        title: "Customer Directory",
        href: "/customers/directory",
      },
      {
        title: "Customer Segmentation",
        href: "/customers/segmentation",
      },
      {
        title: "Customer Satisfaction",
        href: "/customers/satisfaction",
      },
    ],
  },
  {
    title: "Settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    href: "/settings",
  },
];

export default function Sidebar({ isMobile, onClose }: SidebarProps) {
  const [location] = useLocation();
  
  // Helper function to check if a path is active, accounting for query parameters
  const isPathActive = (path: string) => {
    // For paths without query parameters
    if (!path.includes('?')) {
      // For the shipments paths with nested routes
      if (path === '/shipments') {
        return location === '/shipments';
      }
      
      if (path.startsWith('/shipments/')) {
        return location === path;
      }
      
      // For other paths, check exact match or if location starts with the path (for nested routes)
      return location === path || (location.startsWith(path) && location.includes('?'));
    }
    
    // For paths with query parameters
    const [basePath, queryString] = path.split('?');
    
    // If location doesn't start with base path, it's not active
    if (!location.startsWith(basePath)) return false;
    
    // If no query parameters in current location, it's not active
    if (!location.includes('?')) return false;
    
    // Extract query parameters
    const locationQueryString = location.split('?')[1];
    
    // For shipments page, check the tab parameter specifically
    if (basePath === '/shipments') {
      const tabInPath = new URLSearchParams(queryString).get('tab');
      const tabInLocation = new URLSearchParams(locationQueryString).get('tab');
      return tabInPath === tabInLocation;
    }
    
    // For other pages with query params, check if they are the same
    return queryString === locationQueryString;
  };
  
  return (
    <aside className="flex flex-col w-64 border-r border-border bg-card text-card-foreground h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Truck className="text-primary" />
          <h1 className="text-lg font-bold">LogiDash</h1>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2">
          {navItems.map((item, index) => (
            <li key={item.href || index} className="mb-1">
              {item.children ? (
                <Accordion type="single" collapsible className="border-none shadow-none">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger 
                      className={cn(
                        "flex justify-between items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-muted no-underline",
                        "data-[state=open]:text-primary data-[state=open]:bg-muted/40",
                        "dark:text-white dark:hover:bg-muted/20 dark:data-[state=open]:bg-muted/30",
                        item.children.some(child => isPathActive(child.href)) 
                          ? "text-primary font-medium dark:text-primary-foreground" 
                          : ""
                      )}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="text-left">{item.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-0 px-0">
                      <ul className="pl-6 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={isMobile && onClose ? onClose : undefined}
                              className={cn(
                                "flex items-center px-4 py-2 text-sm rounded-md",
                                isPathActive(child.href)
                                  ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
                                  : "hover:bg-muted dark:hover:bg-muted/20 dark:text-foreground"
                              )}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={item.href!}
                  onClick={isMobile && onClose ? onClose : undefined}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    isPathActive(item.href!)
                      ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
                      : "hover:bg-muted dark:hover:bg-muted/20 dark:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-muted mr-2 overflow-hidden">
            {/* We don't include actual images per the requirements */}
            <div className="w-full h-full bg-primary/30"></div>
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">Fleet Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
