import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center">
        {onMenuClick && !isStandalone && (
          <div className="md:hidden mr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Title for standalone mode */}
        {isStandalone && title && (
          <div className="flex items-center">
            <h1 className="text-lg font-medium">{title}</h1>
          </div>
        )}
        
        {/* Breadcrumb for non-standalone mode */}
        {!isStandalone && (
          <div className="hidden md:flex">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">Home</a>
                </li>
                <li className="text-muted-foreground">
                  <span>/</span>
                </li>
                <li>
                  <a href="#" className="font-medium">{title || 'Dashboard'}</a>
                </li>
              </ol>
            </nav>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <form className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="search" 
            placeholder="Search..." 
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
