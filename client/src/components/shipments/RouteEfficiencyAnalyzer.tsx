import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Shipment } from "@shared/schema";
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  RouteIcon,
  ClockIcon,
  FuelIcon,
  TruckIcon,
  ActivityIcon,
  AlertTriangleIcon
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RouteEfficiencyAnalyzerProps {
  shipments: Shipment[];
}

interface EfficiencyMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  delta?: number;
  status?: "positive" | "negative" | "neutral";
}

export function RouteEfficiencyAnalyzer({ shipments }: RouteEfficiencyAnalyzerProps) {
  const [activeTab, setActiveTab] = useState("metrics");
  const [timeframe, setTimeframe] = useState("week");
  const [routeMetrics, setRouteMetrics] = useState<EfficiencyMetric[]>([]);
  const [routeData, setRouteData] = useState<any[]>([]);
  const [routeComparisonData, setRouteComparisonData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate route metrics based on shipments data
    calculateMetrics();
    
    // Generate route comparison data
    generateRouteData();
  }, [shipments, timeframe]);
  
  const calculateMetrics = () => {
    // Filter shipments by completion status
    const completedShipments = shipments.filter(
      s => s.status === "delivered" && s.actualDelivery
    );
    
    // Initialize metrics with default values
    const metrics: EfficiencyMetric[] = [
      {
        name: "On-Time Delivery",
        value: 92.4,
        target: 95,
        unit: "%",
        delta: -2.6,
        status: "negative"
      },
      {
        name: "Avg Fuel Consumption",
        value: 8.7,
        target: 8.0,
        unit: "mpg",
        delta: 0.7,
        status: "positive"
      },
      {
        name: "Route Adherence",
        value: 97.2,
        target: 98,
        unit: "%",
        delta: -0.8,
        status: "negative"
      },
      {
        name: "Avg Load Factor",
        value: 82.5,
        target: 85,
        unit: "%",
        delta: -2.5,
        status: "negative"
      },
      {
        name: "Delivery Time Variance",
        value: 35,
        target: 30,
        unit: "min",
        delta: -5,
        status: "negative"
      },
      {
        name: "Stops per Route",
        value: 5.8,
        target: 6.0,
        unit: "stops",
        delta: -0.2,
        status: "neutral"
      }
    ];
    
    setRouteMetrics(metrics);
  };
  
  const generateRouteData = () => {
    // Sample route data points for different routes
    const routes = [
      { id: "R001", name: "Northeast Corridor" },
      { id: "R002", name: "West Coast Express" },
      { id: "R003", name: "Southern Circuit" },
      { id: "R004", name: "Midwest Route" },
      { id: "R005", name: "Coastal Highway" }
    ];
    
    // Generate efficiency metrics for each route
    const efficiencyData = routes.map(route => ({
      route: route.name,
      plannedTime: Math.floor(Math.random() * 5) + 6, // 6-10 hours
      actualTime: Math.floor(Math.random() * 6) + 5.5, // 5.5-11.5 hours
      efficiency: Math.floor(Math.random() * 20) + 85, // 85-105%
      fuelConsumption: Math.floor(Math.random() * 3) + 7, // 7-10 mpg
      distance: Math.floor(Math.random() * 300) + 200, // 200-500 miles
      loadFactor: Math.floor(Math.random() * 20) + 75, // 75-95%
    }));
    
    setRouteData(efficiencyData);
    
    // Generate comparison data
    const timePoints = timeframe === "week" 
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Week 1", "Week 2", "Week 3", "Week 4"];
    
    const comparisonData = timePoints.map(point => {
      const baseEfficiency = Math.floor(Math.random() * 10) + 85; // 85-95%
      
      return {
        name: point,
        actual: baseEfficiency,
        target: 95,
        fuelUsage: Math.floor(Math.random() * 100) + 250, // 250-350 gallons
        timeVariance: Math.floor(Math.random() * 40) - 20, // -20 to +20 minutes
      };
    });
    
    setRouteComparisonData(comparisonData);
  };
  
  // Format delta value for display
  const formatDelta = (delta: number | undefined, unit: string) => {
    if (delta === undefined) return "";
    
    const prefix = delta > 0 ? "+" : "";
    return `${prefix}${delta}${unit}`;
  };
  
  // Get status icon
  const getStatusIcon = (status: string | undefined, size: number = 4) => {
    switch (status) {
      case "positive":
        return <ArrowUpIcon className={`h-${size} w-${size} text-green-500`} />;
      case "negative":
        return <ArrowDownIcon className={`h-${size} w-${size} text-red-500`} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="overflow-hidden">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="metrics">Efficiency Metrics</TabsTrigger>
            <TabsTrigger value="routes">Route Comparison</TabsTrigger>
            <TabsTrigger value="trends">Efficiency Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {routeMetrics.map((metric, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{metric.name}</div>
                    <Badge 
                      variant={metric.status === "positive" ? "default" : 
                              metric.status === "negative" ? "destructive" : "outline"}
                      className={metric.status === "positive" ? "bg-green-500" : ""}
                    >
                      {formatDelta(metric.delta, metric.unit)}
                    </Badge>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">
                      {metric.value}{metric.unit}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Target: {metric.target}{metric.unit}</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
                    <div 
                      className={`h-full ${
                        metric.status === "positive" ? "bg-green-500" : 
                        metric.status === "negative" ? "bg-red-500" : "bg-amber-500"
                      }`} 
                      style={{ width: `${(metric.value / (metric.target * 1.2)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="routes" className="pt-2">
            <div className="border rounded-md p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={routeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="route" 
                      className="text-xs" 
                      tick={{fill: 'hsl(var(--foreground))'}}
                    />
                    <YAxis 
                      yAxisId="left"
                      className="text-xs" 
                      tick={{fill: 'hsl(var(--foreground))'}}
                      label={{ value: 'Time (hours)', angle: -90, position: 'insideLeft', offset: -10 }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      className="text-xs" 
                      tick={{fill: 'hsl(var(--foreground))'}}
                      label={{ value: 'Efficiency (%)', angle: 90, position: 'insideRight', offset: -10 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="plannedTime" name="Planned Time" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="actualTime" name="Actual Time" fill="#82ca9d" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="efficiency"
                      name="Efficiency"
                      stroke="#ff7300"
                      activeDot={{ r: 8 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-2">Most Efficient Route</div>
                  <div className="flex items-center text-green-500 mb-1">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    <span className="font-bold">
                      {routeData && routeData.length > 0 ? 
                        routeData.reduce((prev, current) => 
                          (prev.efficiency > current.efficiency) ? prev : current, routeData[0]).route
                        : 'No route data'
                      }
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Efficiency: {routeData && routeData.length > 0 ? 
                      Math.max(...routeData.map(r => r.efficiency)) : 'N/A'}%
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium mb-2">Least Efficient Route</div>
                  <div className="flex items-center text-red-500 mb-1">
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                    <span className="font-bold">
                      {routeData && routeData.length > 0 ? 
                        routeData.reduce((prev, current) => 
                          (prev.efficiency < current.efficiency) ? prev : current, routeData[0]).route
                        : 'No route data'
                      }
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Efficiency: {routeData && routeData.length > 0 ? 
                      Math.min(...routeData.map(r => r.efficiency)) : 'N/A'}%
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="pt-2">
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Efficiency Trends for {timeframe === "week" ? "This Week" : "This Month"}</span>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={routeComparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      className="text-xs" 
                      tick={{fill: 'hsl(var(--foreground))'}}
                    />
                    <YAxis 
                      className="text-xs" 
                      tick={{fill: 'hsl(var(--foreground))'}}
                      domain={[75, 100]}
                      label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft', offset: -10 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      name="Actual Efficiency" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      name="Target Efficiency" 
                      stroke="#82ca9d"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border rounded-md p-3">
                  <div className="flex items-center text-sm font-medium mb-1">
                    <FuelIcon className="h-4 w-4 mr-1 text-amber-500" />
                    Avg Fuel Usage
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.round(routeComparisonData.reduce((sum, item) => sum + item.fuelUsage, 0) / routeComparisonData.length)} gal
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="flex items-center text-sm font-medium mb-1">
                    <TruckIcon className="h-4 w-4 mr-1 text-blue-500" />
                    Avg Time Variance
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.round(routeComparisonData.reduce((sum, item) => sum + item.timeVariance, 0) / routeComparisonData.length)} min
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="flex items-center text-sm font-medium mb-1">
                    <ActivityIcon className="h-4 w-4 mr-1 text-green-500" />
                    Overall Efficiency
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.round(routeComparisonData.reduce((sum, item) => sum + item.actual, 0) / routeComparisonData.length)}%
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 p-3 border rounded-md bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-start">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div>
              <div className="font-medium text-sm">Optimization Opportunities</div>
              <p className="text-sm text-muted-foreground mt-1">
                Analysis suggests potential fuel savings of 8-12% through route optimization and 
                improved load balancing across regional hubs.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
} 