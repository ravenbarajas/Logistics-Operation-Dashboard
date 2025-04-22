import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Server, 
  Database, 
  HardDrive, 
  Radio, 
  Cpu, 
  BarChart3, 
  AlertTriangle, 
  Clock 
} from "lucide-react";

export default function SystemStatusPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Simulated system status data
  const systemStatus = {
    overall: "operational", // operational, degraded, outage
    components: [
      { name: "API Gateway", status: "operational", latency: 48, uptime: 99.99 },
      { name: "Authentication Service", status: "operational", latency: 62, uptime: 99.97 },
      { name: "Database Cluster", status: "operational", latency: 87, uptime: 99.99 },
      { name: "Order Processing", status: "operational", latency: 105, uptime: 99.95 },
      { name: "Route Optimization", status: "degraded", latency: 246, uptime: 99.78 },
      { name: "Tracking Service", status: "operational", latency: 76, uptime: 99.98 },
      { name: "Map Renderer", status: "operational", latency: 93, uptime: 99.96 },
      { name: "Notification Service", status: "operational", latency: 68, uptime: 99.99 }
    ],
    metrics: {
      cpuUsage: 63,
      memoryUsage: 72,
      diskUsage: 51,
      networkUsage: 47
    },
    incidents: [
      {
        id: "INC-2023-08-11-001",
        title: "Route Optimization Service Degraded",
        status: "investigating",
        started: "2023-08-11T14:32:00Z",
        updated: "2023-08-11T15:15:00Z",
        description: "We're experiencing elevated latency in the route optimization service. Our engineers are investigating the issue."
      }
    ]
  };
  
  const handleRefresh = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsUpdating(false);
    }, 800);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-success text-success-foreground";
      case "degraded":
        return "bg-warning text-warning-foreground";
      case "outage":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4" />;
      case "outage":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const renderLatencyIndicator = (latency: number) => {
    let color = "bg-success";
    if (latency > 200) {
      color = "bg-destructive";
    } else if (latency > 100) {
      color = "bg-warning";
    }
    
    return (
      <div className="flex items-center">
        <span className="text-xs font-mono">{latency}ms</span>
        <div className={`ml-2 h-2 w-2 rounded-full ${color}`}></div>
      </div>
    );
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`relative px-2 ${
            systemStatus.overall !== "operational" 
              ? "border-warning text-warning" 
              : ""
          }`}
        >
          <Server className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">System Status</span>
          {systemStatus.overall !== "operational" && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-warning animate-pulse" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle>System Status</SheetTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1" 
              onClick={handleRefresh}
              disabled={isUpdating}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? "animate-spin" : ""}`} />
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
        </SheetHeader>
        
        {/* Overall Status */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Overall Status</h3>
            <Badge 
              variant="outline"
              className={getStatusColor(systemStatus.overall)}
            >
              <span className="flex items-center">
                {getStatusIcon(systemStatus.overall)}
                <span className="ml-1 capitalize">{systemStatus.overall}</span>
              </span>
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
        
        {/* System Resources */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">System Resources</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="flex items-center">
                  <Cpu className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>CPU Usage</span>
                </div>
                <span>{systemStatus.metrics.cpuUsage}%</span>
              </div>
              <Progress value={systemStatus.metrics.cpuUsage} className="h-1" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="flex items-center">
                  <Server className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>Memory Usage</span>
                </div>
                <span>{systemStatus.metrics.memoryUsage}%</span>
              </div>
              <Progress value={systemStatus.metrics.memoryUsage} className="h-1" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="flex items-center">
                  <HardDrive className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>Disk Usage</span>
                </div>
                <span>{systemStatus.metrics.diskUsage}%</span>
              </div>
              <Progress value={systemStatus.metrics.diskUsage} className="h-1" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="flex items-center">
                  <Radio className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span>Network Usage</span>
                </div>
                <span>{systemStatus.metrics.networkUsage}%</span>
              </div>
              <Progress value={systemStatus.metrics.networkUsage} className="h-1" />
            </div>
          </div>
        </div>
        
        {/* Service Status */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Service Status</h3>
          <div className="space-y-3">
            {systemStatus.components.map((component, index) => (
              <div key={component.name} className="flex justify-between items-center pb-2 border-b border-muted/50 last:border-0">
                <div>
                  <div className="text-sm font-medium">{component.name}</div>
                  <div className="text-xs text-muted-foreground">Uptime: {component.uptime}%</div>
                </div>
                <div className="flex items-center space-x-3">
                  {renderLatencyIndicator(component.latency)}
                  <Badge 
                    variant="outline"
                    className={`text-[10px] ${getStatusColor(component.status)}`}
                  >
                    {component.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Active Incidents */}
        {systemStatus.incidents.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Active Incidents</h3>
            <div className="space-y-4">
              {systemStatus.incidents.map((incident) => (
                <div 
                  key={incident.id}
                  className="p-3 border border-warning/30 bg-warning/10 rounded-md"
                >
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium">{incident.title}</h4>
                      <p className="text-xs mt-1">{incident.description}</p>
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {incident.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground ml-2">
                          Updated: {new Date(incident.updated).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
} 