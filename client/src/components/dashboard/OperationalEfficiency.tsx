import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deliveryPerformanceData, fuelConsumptionData, costAnalysisData, costPerMileData } from "@/data/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Gauge, 
  Truck, 
  Fuel, 
  RotateCw, 
  Clock, 
  Timer, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap,
  Activity,
  TrendingUp,
  LineChart
} from "lucide-react";

interface OperationalEfficiencyProps {
  period: string;
}

export default function OperationalEfficiency({ period }: OperationalEfficiencyProps) {
  const [chartType, setChartType] = useState<"performance" | "utilization" | "cost">("performance");
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulated efficiency metrics
  const metrics = {
    deliveryTime: {
      value: 97.2,
      change: 2.8,
      trend: "up",
      target: 98.0
    },
    resourceUtilization: {
      value: 86.5,
      change: 1.3,
      trend: "up",
      target: 90.0
    },
    fuelEfficiency: {
      value: 92.4,
      change: 3.2,
      trend: "up",
      target: 95.0
    },
    maintenanceCompliance: {
      value: 94.8,
      change: 0.7,
      trend: "up",
      target: 98.0
    },
    costEfficiency: {
      value: 88.9,
      change: -1.2,
      trend: "down",
      target: 92.0
    }
  };
  
  // More detailed metrics for technical dashboard
  const detailedMetrics = {
    averageTripDuration: "3h 42m",
    averageLoadingTime: "28m",
    averageUnloadingTime: "22m",
    idleTimePercentage: "7.3%",
    fuelUsagePerKm: "0.38L",
    warehouseUtilization: "82.5%",
    maintenanceDowntime: "3.2%",
    vehicleTurnoverTime: "57m",
    crossDockingEfficiency: "84.6%",
    routeOptimizationScore: "89.2%"
  };
  
  // Resource utilization data for the chart
  const utilizationData = [
    { time: '00:00', trucks: 45, vans: 52 },
    { time: '04:00', trucks: 38, vans: 41 },
    { time: '08:00', trucks: 65, vans: 79 },
    { time: '12:00', trucks: 88, vans: 85 },
    { time: '16:00', trucks: 92, vans: 94 },
    { time: '20:00', trucks: 68, vans: 76 }
  ];
  
  // Cost data for the chart
  const costData = [
    costPerMileData[0], costPerMileData[1], costPerMileData[2],
    costPerMileData[3], costPerMileData[4], costPerMileData[5]
  ];
  
  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [chartType, period]);
  
  // Render performance chart
  const renderPerformanceChart = () => {
    return (
      <div className="h-[300px] flex items-center justify-center bg-muted/5 rounded-md p-4">
        <div className="w-full h-full relative flex">
          {/* Radar chart visualization */}
          <div className="w-3/4 h-full flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Radar background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-muted/20"></div>
                <div className="absolute w-3/4 h-3/4 rounded-full border border-muted/20"></div>
                <div className="absolute w-1/2 h-1/2 rounded-full border border-muted/20"></div>
                <div className="absolute w-1/4 h-1/4 rounded-full border border-muted/20"></div>
              </div>
              
              {/* Performance metrics */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="h-20 w-[2px] bg-gradient-to-t from-primary/10 to-primary"></div>
                <div className="text-xs mt-1">Delivery Time</div>
                <div className="text-xs font-semibold">{metrics.deliveryTime.value}%</div>
              </div>
              
              <div className="absolute top-1/4 right-0 translate-x-1/2 -translate-y-1/2 flex items-center">
                <div className="h-[2px] w-16 bg-gradient-to-r from-secondary/10 to-secondary"></div>
                <div className="ml-1">
                  <div className="text-xs">Resource</div>
                  <div className="text-xs font-semibold">{metrics.resourceUtilization.value}%</div>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 right-0 translate-y-1/2 flex items-center">
                <div className="h-[2px] w-16 bg-gradient-to-r from-accent/10 to-accent"></div>
                <div className="ml-1">
                  <div className="text-xs">Fuel</div>
                  <div className="text-xs font-semibold">{metrics.fuelEfficiency.value}%</div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
                <div className="text-xs mb-1">Route</div>
                <div className="text-xs font-semibold">89.2%</div>
                <div className="h-20 w-[2px] bg-gradient-to-b from-primary/10 to-primary"></div>
              </div>
              
              <div className="absolute bottom-1/4 left-0 -translate-x-1/2 translate-y-1/2 flex items-center flex-row-reverse">
                <div className="h-[2px] w-16 bg-gradient-to-l from-secondary/10 to-secondary"></div>
                <div className="mr-1">
                  <div className="text-xs">Maintenance</div>
                  <div className="text-xs font-semibold">{metrics.maintenanceCompliance.value}%</div>
                </div>
              </div>
              
              <div className="absolute top-1/4 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center flex-row-reverse">
                <div className="h-[2px] w-16 bg-gradient-to-l from-accent/10 to-accent"></div>
                <div className="mr-1">
                  <div className="text-xs">Cost</div>
                  <div className="text-xs font-semibold">{metrics.costEfficiency.value}%</div>
                </div>
              </div>
              
              {/* Radar chart shape */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[85%] bg-primary/10 rounded-full relative overflow-hidden">
                  {/* Performance shape */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-[2px] bg-primary/50" 
                       style={{ height: `${(metrics.deliveryTime.value - 60) / 40 * 100}%` }}></div>
                  <div className="absolute top-1/4 right-0 -translate-y-1/2 w-1/2 h-[2px] bg-secondary/50"
                       style={{ width: `${(metrics.resourceUtilization.value - 60) / 40 * 100}%` }}></div>
                  <div className="absolute bottom-1/4 right-0 translate-y-1/2 w-1/2 h-[2px] bg-accent/50"
                       style={{ width: `${(metrics.fuelEfficiency.value - 60) / 40 * 100}%` }}></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1/2 w-[2px] bg-primary/50"
                       style={{ height: `${((89.2) - 60) / 40 * 100}%` }}></div>
                  <div className="absolute bottom-1/4 left-0 translate-y-1/2 w-1/2 h-[2px] bg-secondary/50"
                       style={{ width: `${(metrics.maintenanceCompliance.value - 60) / 40 * 100}%` }}></div>
                  <div className="absolute top-1/4 left-0 -translate-y-1/2 w-1/2 h-[2px] bg-accent/50"
                       style={{ width: `${(metrics.costEfficiency.value - 60) / 40 * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="w-1/4 h-full flex flex-col justify-center space-y-3">
            <div className="text-xs font-semibold">Performance Metrics</div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <div className="text-xs">Current</div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full border border-muted-foreground mr-2"></div>
                <div className="text-xs">Target</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Scale: 60% - 100%
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render utilization chart
  const renderUtilizationChart = () => {
    return (
      <div className="h-[300px] flex flex-col">
        <div className="flex justify-between px-6 mb-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
            <span className="text-xs">Trucks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-secondary rounded-full mr-1"></div>
            <span className="text-xs">Vans</span>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-0.5 bg-success/50 border-dashed mr-1"></div>
            <span className="text-xs">Target (85%)</span>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-6 gap-4 px-4">
          {utilizationData.map((data, index) => (
            <div key={index} className="flex flex-col h-full">
              <div className="flex-1 relative flex flex-col-reverse">
                {/* Target line at 85% */}
                <div className="absolute left-0 right-0 h-[1px] bg-success/50 border-dashed" style={{ bottom: '85%' }}></div>
                
                {/* Trucks bar */}
                <div 
                  className="w-full bg-primary/80 rounded-t-sm mr-1"
                  style={{ height: `${data.trucks}%` }}
                ></div>
                
                {/* Vans bar */}
                <div 
                  className="w-full bg-secondary/80 rounded-t-sm absolute -right-2"
                  style={{ height: `${data.vans}%`, width: '40%' }}
                ></div>
              </div>
              <div className="text-xs text-center mt-2">{data.time}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render cost chart
  const renderCostChart = () => {
    return (
      <div className="h-[300px] w-full">
        <div className="flex justify-between px-6 mb-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
            <span className="text-xs">Heavy Truck</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-secondary rounded-full mr-1"></div>
            <span className="text-xs">Medium Truck</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent rounded-full mr-1"></div>
            <span className="text-xs">Delivery Van</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success rounded-full mr-1"></div>
            <span className="text-xs">Electric</span>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-6 gap-2 px-4 h-[250px]">
          {costData.map((data, index) => {
            // Find maximum value to scale the chart
            const maxValue = Math.max(data.heavyTruck, data.mediumTruck, data.deliveryVan, data.electric);
            const scale = 200 / maxValue; // 200px is our max bar height
            
            return (
              <div key={index} className="flex flex-col h-full">
                <div className="flex-1 relative flex items-end justify-center space-x-1">
                  {/* Heavy Truck bar */}
                  <div 
                    className="w-2 bg-primary rounded-t-sm" 
                    style={{ height: `${data.heavyTruck * scale}px` }}
                  ></div>
                  
                  {/* Medium Truck bar */}
                  <div 
                    className="w-2 bg-secondary rounded-t-sm" 
                    style={{ height: `${data.mediumTruck * scale}px` }}
                  ></div>
                  
                  {/* Delivery Van bar */}
                  <div 
                    className="w-2 bg-accent rounded-t-sm" 
                    style={{ height: `${data.deliveryVan * scale}px` }}
                  ></div>
                  
                  {/* Electric bar */}
                  <div 
                    className="w-2 bg-success rounded-t-sm" 
                    style={{ height: `${data.electric * scale}px` }}
                  ></div>
                </div>
                <div className="text-xs text-center mt-2">{data.month}</div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between px-8">
          <div className="text-xs text-muted-foreground">Cost per Mile ($)</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Operational Efficiency Metrics */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Operational KPIs</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-4">
            {/* Delivery Time Compliance */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Delivery Time Compliance</span>
                </div>
                <div className="flex items-center">
                  <Badge variant={metrics.deliveryTime.trend === "up" ? "success" : "destructive"} className="ml-1 text-[10px]">
                    {metrics.deliveryTime.trend === "up" ? "+" : ""}{metrics.deliveryTime.change}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.deliveryTime.value} 
                  max={100} 
                  className="h-2 flex-1" 
                />
                <span className="text-sm font-mono text-primary">{metrics.deliveryTime.value.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: {metrics.deliveryTime.target}%</span>
                <span>Last period: {(metrics.deliveryTime.value - metrics.deliveryTime.change).toFixed(1)}%</span>
              </div>
            </div>
            
            {/* Resource Utilization */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 mr-2 text-secondary" />
                  <span className="text-sm font-medium">Resource Utilization</span>
                </div>
                <div className="flex items-center">
                  <Badge variant={metrics.resourceUtilization.trend === "up" ? "success" : "destructive"} className="ml-1 text-[10px]">
                    {metrics.resourceUtilization.trend === "up" ? "+" : ""}{metrics.resourceUtilization.change}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.resourceUtilization.value} 
                  max={100} 
                  className="h-2 flex-1 bg-secondary" 
                />
                <span className="text-sm font-mono text-secondary">{metrics.resourceUtilization.value.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: {metrics.resourceUtilization.target}%</span>
                <span>Last period: {(metrics.resourceUtilization.value - metrics.resourceUtilization.change).toFixed(1)}%</span>
              </div>
            </div>
            
            {/* Fuel Efficiency */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 mr-2 text-accent" />
                  <span className="text-sm font-medium">Fuel Efficiency</span>
                </div>
                <div className="flex items-center">
                  <Badge variant={metrics.fuelEfficiency.trend === "up" ? "success" : "destructive"} className="ml-1 text-[10px]">
                    {metrics.fuelEfficiency.trend === "up" ? "+" : ""}{metrics.fuelEfficiency.change}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.fuelEfficiency.value} 
                  max={100} 
                  className="h-2 flex-1 bg-accent" 
                />
                <span className="text-sm font-mono text-accent">{metrics.fuelEfficiency.value.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: {metrics.fuelEfficiency.target}%</span>
                <span>Last period: {(metrics.fuelEfficiency.value - metrics.fuelEfficiency.change).toFixed(1)}%</span>
              </div>
            </div>
            
            {/* Maintenance Compliance */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <RotateCw className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Maintenance Compliance</span>
                </div>
                <div className="flex items-center">
                  <Badge variant={metrics.maintenanceCompliance.trend === "up" ? "success" : "destructive"} className="ml-1 text-[10px]">
                    {metrics.maintenanceCompliance.trend === "up" ? "+" : ""}{metrics.maintenanceCompliance.change}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.maintenanceCompliance.value} 
                  max={100} 
                  className="h-2 flex-1" 
                />
                <span className="text-sm font-mono text-primary">{metrics.maintenanceCompliance.value.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: {metrics.maintenanceCompliance.target}%</span>
                <span>Last period: {(metrics.maintenanceCompliance.value - metrics.maintenanceCompliance.change).toFixed(1)}%</span>
              </div>
            </div>
            
            {/* Cost Efficiency */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2 text-secondary" />
                  <span className="text-sm font-medium">Cost Efficiency</span>
                </div>
                <div className="flex items-center">
                  <Badge variant={metrics.costEfficiency.trend === "up" ? "success" : "destructive"} className="ml-1 text-[10px]">
                    {metrics.costEfficiency.trend === "up" ? "+" : ""}{metrics.costEfficiency.change}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.costEfficiency.value} 
                  max={100} 
                  className="h-2 flex-1 bg-secondary" 
                />
                <span className="text-sm font-mono text-secondary">{metrics.costEfficiency.value.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: {metrics.costEfficiency.target}%</span>
                <span>Last period: {(metrics.costEfficiency.value - metrics.costEfficiency.change).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Efficiency Charts */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">Efficiency Analysis</CardTitle>
          <div className="flex space-x-2">
            <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)} className="w-full">
              <TabsList className="grid grid-cols-3 w-[300px]">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="utilization">Utilization</TabsTrigger>
                <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[300px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                  {/* Animated placeholder for chart with data points */}
                  <div className="col-span-2 h-[200px] rounded-md bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground/60 flex flex-col items-center">
                      <BarChart className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-xs">Loading chart data...</span>
                    </div>
                  </div>
                  
                  {/* Technical KPI summary placeholder */}
                  <div className="space-y-2">
                    <div className="h-8 w-full rounded-sm bg-muted/20 animate-pulse"></div>
                    <div className="h-8 w-full rounded-sm bg-muted/20 animate-pulse"></div>
                    <div className="h-8 w-full rounded-sm bg-muted/20 animate-pulse"></div>
                    <div className="h-8 w-3/4 rounded-sm bg-muted/20 animate-pulse"></div>
                    <div className="h-8 w-full rounded-sm bg-muted/20 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Technical metrics placeholder */}
                <div className="grid grid-cols-4 gap-2 px-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-muted/10 rounded-md p-2 flex flex-col items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-muted/20 animate-pulse mb-1"></div>
                      <div className="h-3 w-16 rounded-sm bg-muted/20 animate-pulse mb-1"></div>
                      <div className="h-4 w-10 rounded-sm bg-muted/20 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {chartType === "performance" && renderPerformanceChart()}
                {chartType === "utilization" && renderUtilizationChart()}
                {chartType === "cost" && renderCostChart()}
              </>
            )}
          </div>
          
          {/* Key Metrics Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-muted/10 rounded-md p-2 text-center relative group overflow-hidden transition-all hover:bg-muted/20">
              <div className="flex justify-center mb-1 text-secondary">
                <Timer className="h-4 w-4" />
              </div>
              <div className="text-xs font-medium">Avg Trip Duration</div>
              <div className="text-sm font-bold flex items-center justify-center">
                {detailedMetrics.averageTripDuration}
                <span className="ml-1 text-[9px] text-success-foreground font-normal bg-success/20 rounded-full px-1">-4.2%</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary/20">
                <div className="h-full bg-secondary" style={{ width: '76%' }}></div>
              </div>
            </div>
            <div className="bg-muted/10 rounded-md p-2 text-center relative group overflow-hidden transition-all hover:bg-muted/20">
              <div className="flex justify-center mb-1 text-primary">
                <Package className="h-4 w-4" />
              </div>
              <div className="text-xs font-medium">Warehouse Utilization</div>
              <div className="text-sm font-bold flex items-center justify-center">
                {detailedMetrics.warehouseUtilization}
                <span className="ml-1 text-[9px] text-success-foreground font-normal bg-success/20 rounded-full px-1">+1.8%</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20">
                <div className="h-full bg-primary" style={{ width: '82.5%' }}></div>
              </div>
            </div>
            <div className="bg-muted/10 rounded-md p-2 text-center relative group overflow-hidden transition-all hover:bg-muted/20">
              <div className="flex justify-center mb-1 text-accent">
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-xs font-medium">Route Optimization</div>
              <div className="text-sm font-bold flex items-center justify-center">
                {detailedMetrics.routeOptimizationScore}
                <span className="ml-1 text-[9px] text-success-foreground font-normal bg-success/20 rounded-full px-1">+3.5%</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-accent/20">
                <div className="h-full bg-accent" style={{ width: '89.2%' }}></div>
              </div>
            </div>
            <div className="bg-muted/10 rounded-md p-2 text-center relative group overflow-hidden transition-all hover:bg-muted/20">
              <div className="flex justify-center mb-1 text-secondary">
                <Fuel className="h-4 w-4" />
              </div>
              <div className="text-xs font-medium">Fuel Usage/Km</div>
              <div className="text-sm font-bold flex items-center justify-center">
                {detailedMetrics.fuelUsagePerKm}
                <span className="ml-1 text-[9px] text-success-foreground font-normal bg-success/20 rounded-full px-1">-2.3%</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary/20">
                <div className="h-full bg-secondary" style={{ width: '62%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 