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
    title: "Warehouse Management",
    icon: <LayoutGrid className="mr-2 h-4 w-4" />,
    children: [
      {
        title: "Dashboard",
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
          {navItems.map((item, index) => (
            <li key={item.href || index} className="mb-1">
              {item.children ? (
                <Accordion type="single" collapsible className="border-none shadow-none">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger 
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-muted no-underline",
                        "data-[state=open]:text-primary data-[state=open]:bg-muted/40",
                        "dark:text-white dark:hover:bg-muted/20 dark:data-[state=open]:bg-muted/30",
                        item.children.some(child => location === child.href) 
                          ? "text-primary font-medium dark:text-primary-foreground" 
                          : ""
                      )}
                    >
                      {item.icon}
                      {item.title}
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
                                location === child.href
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
                    location === item.href
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
