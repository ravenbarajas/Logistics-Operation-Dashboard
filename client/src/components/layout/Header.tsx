import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DEFAULT_MODULE, MODULE_TITLES, ModuleType, MODULE_ROUTES } from "@/config";

type HeaderProps = {
  onMenuClick?: () => void;
  title?: string;
  isStandalone?: boolean;
};

export default function Header({ onMenuClick, title, isStandalone = false }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [notifications] = useState(1); // Mock notification count
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get module-specific colors or styles
  const getModuleStyles = (moduleType: ModuleType) => {
    const styles: Record<ModuleType, string> = {
      dashboard: "bg-blue-500/10",
      vehicles: "bg-green-500/10",
      shipments: "bg-purple-500/10",
      customers: "bg-amber-500/10",
      suppliers: "bg-pink-500/10",
      warehouse: "bg-teal-500/10",
      orders: "bg-orange-500/10",
      routes: "bg-sky-500/10",
      reports: "bg-indigo-500/10",
      analytics: "bg-emerald-500/10",
      settings: "bg-gray-500/10"
    };
    
    return styles[moduleType];
  };
  
  // Get the current module based on title or default
  const getCurrentModule = (): ModuleType => {
    if (!title) return DEFAULT_MODULE;
    
    for (const [module, moduleTitle] of Object.entries(MODULE_TITLES)) {
      if (moduleTitle === title) {
        return module as ModuleType;
      }
    }
    
    return DEFAULT_MODULE;
  };
  
  const currentModule = getCurrentModule();
  const moduleStyle = getModuleStyles(currentModule);
  
  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-border backdrop-blur-sm ${moduleStyle}`}>
      <div className="flex items-center">

      </div>
      
      {/* Additional module-specific buttons could go here for certain modules */}
      {currentModule === "vehicles" && (
        <div className="hidden md:flex items-center mr-auto ml-4 space-x-2">
          <Button variant="ghost" size="sm">Fleet Overview</Button>
          <Button variant="ghost" size="sm">Maintenance</Button>
          <Button variant="ghost" size="sm">Drivers</Button>
        </div>
      )}
      
      {currentModule === "customers" && (
        <div className="hidden md:flex items-center mr-auto ml-4 space-x-2">
          <Button variant="ghost" size="sm">Directory</Button>
          <Button variant="ghost" size="sm">Segmentation</Button>
          <Button variant="ghost" size="sm">Satisfaction</Button>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <form className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="search" 
            placeholder={`Search ${title || MODULE_TITLES[DEFAULT_MODULE]}...`}
            className="w-64 pl-10 pr-4 py-2 text-sm h-9"
          />
        </form>
        
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
          )}
        </Button>
        
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
