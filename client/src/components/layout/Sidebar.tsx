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
} from "lucide-react";

type SidebarProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

const navItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    href: "/",
  },
  {
    title: "Fleet Management",
    icon: <Truck className="mr-2 h-4 w-4" />,
    href: "/vehicles",
  },
  {
    title: "Shipments",
    icon: <Compass className="mr-2 h-4 w-4" />,
    href: "/shipments",
  },
  {
    title: "Analytics",
    icon: <BarChart className="mr-2 h-4 w-4" />,
    href: "/analytics",
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
    title: "Warehouse",
    icon: <LayoutGrid className="mr-2 h-4 w-4" />,
    href: "/warehouse",
  },
  {
    title: "Suppliers",
    icon: <Users className="mr-2 h-4 w-4" />,
    href: "/suppliers",
  },
  {
    title: "Reports",
    icon: <Table className="mr-2 h-4 w-4" />,
    href: "/reports",
  },
  {
    title: "Customers",
    icon: <UserRound className="mr-2 h-4 w-4" />,
    href: "/customers",
  },
  {
    title: "Settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    href: "/settings",
  },
];

export default function Sidebar({ isMobile, onClose }: SidebarProps) {
  const [location] = useLocation();
  
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
          {navItems.map((item) => (
            <li key={item.href} className="mb-1">
              <Link
                href={item.href}
                onClick={isMobile && onClose ? onClose : undefined}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
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
