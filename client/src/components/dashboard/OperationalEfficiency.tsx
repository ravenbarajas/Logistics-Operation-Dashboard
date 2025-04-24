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
    // Status categorization for metrics
    const getStatusColor = (value: number, target: number): string => {
      const ratio = value / target;
      if (ratio >= 1) return "optimal";
      if (ratio >= 0.95) return "good";
      if (ratio >= 0.9) return "warning";
      return "critical";
    };
    
    // Calculate status for each metric
    const metricStatuses = {
      deliveryTime: getStatusColor(metrics.deliveryTime.value, metrics.deliveryTime.target),
      resourceUtilization: getStatusColor(metrics.resourceUtilization.value, metrics.resourceUtilization.target),
      fuelEfficiency: getStatusColor(metrics.fuelEfficiency.value, metrics.fuelEfficiency.target),
      routeOptimization: getStatusColor(89.2, 95.0),
      maintenanceCompliance: getStatusColor(metrics.maintenanceCompliance.value, metrics.maintenanceCompliance.target),
      costEfficiency: getStatusColor(metrics.costEfficiency.value, metrics.costEfficiency.target)
    };
    
    // Get color class based on status
    const getStatusColorClass = (status: string): string => {
      switch (status) {
        case "optimal": return "from-emerald-500/20 to-emerald-600";
        case "good": return "from-blue-500/20 to-blue-600";
        case "warning": return "from-amber-500/20 to-amber-600";
        case "critical": return "from-rose-500/20 to-rose-600";
        default: return "from-gray-500/20 to-gray-600";
      }
    };
    
    // Get background color based on status
    const getStatusBgClass = (status: string): string => {
      switch (status) {
        case "optimal": return "bg-emerald-500/10";
        case "good": return "bg-blue-500/10";
        case "warning": return "bg-amber-500/10";
        case "critical": return "bg-rose-500/10";
        default: return "bg-gray-500/10";
      }
    };
    
    // Get indicator dot color based on status
    const getStatusDotClass = (status: string): string => {
      switch (status) {
        case "optimal": return "bg-emerald-500";
        case "good": return "bg-blue-500";
        case "warning": return "bg-amber-500";
        case "critical": return "bg-rose-500";
        default: return "bg-gray-500";
      }
    };
    
    // Calculate overall performance score
    const overallScore = (
      metrics.deliveryTime.value + 
      metrics.resourceUtilization.value + 
      metrics.fuelEfficiency.value + 
      89.2 + 
      metrics.maintenanceCompliance.value + 
      metrics.costEfficiency.value
    ) / 6;
    
    const overallStatus = 
      overallScore >= 95 ? "optimal" :
      overallScore >= 90 ? "good" :
      overallScore >= 85 ? "warning" : "critical";
    
    return (
      <div className="h-[300px] flex items-center justify-center bg-card/60 dark:bg-card/20 rounded-md p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-secondary/5 rounded-full blur-xl"></div>
        
        <div className="w-full h-full relative flex">
          {/* Radar chart visualization */}
          <div className="w-3/4 h-full flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Radar background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-border/30 dark:border-border/20"></div>
                <div className="absolute w-3/4 h-3/4 rounded-full border border-border/30 dark:border-border/20"></div>
                <div className="absolute w-1/2 h-1/2 rounded-full border border-border/30 dark:border-border/20"></div>
                <div className="absolute w-1/4 h-1/4 rounded-full border border-border/30 dark:border-border/20"></div>
              </div>
              
              {/* Grid lines */}
              <div className="absolute inset-0">
                <div className="absolute w-full h-[1px] top-1/2 left-0 bg-border/20 dark:bg-border/10"></div>
                <div className="absolute h-full w-[1px] top-0 left-1/2 bg-border/20 dark:bg-border/10"></div>
                <div className="absolute w-full h-[1px] top-1/2 left-0 rotate-45 origin-center bg-border/20 dark:bg-border/10"></div>
                <div className="absolute w-full h-[1px] top-1/2 left-0 -rotate-45 origin-center bg-border/20 dark:bg-border/10"></div>
              </div>
              
              {/* Performance metrics */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`h-20 w-[2px] bg-gradient-to-t ${getStatusColorClass(metricStatuses.deliveryTime)}`}></div>
                <div className="text-sm mt-1 flex flex-col items-center">
                  <div className="font-medium">Delivery Time</div>
                  <div className="flex items-center">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${getStatusDotClass(metricStatuses.deliveryTime)} mr-1`}></span>
                    <span className="text-sm font-bold">{metrics.deliveryTime.value.toFixed(1)}%</span>
                    <span className={`ml-1 text-xs ${metrics.deliveryTime.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                      {metrics.deliveryTime.trend === "up" ? "↑" : "↓"}{Math.abs(metrics.deliveryTime.change).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/4 right-0 translate-x-1/2 -translate-y-1/2 flex items-center">
                <div className={`h-[2px] w-16 bg-gradient-to-r ${getStatusColorClass(metricStatuses.resourceUtilization)}`}></div>
                <div className="ml-1">
                  <div className="text-sm font-medium">Resource</div>
                  <div className="flex items-center">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${getStatusDotClass(metricStatuses.resourceUtilization)} mr-1`}></span>
                    <span className="text-sm font-bold">{metrics.resourceUtilization.value.toFixed(1)}%</span>
                    <span className={`ml-1 text-xs ${metrics.resourceUtilization.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                      {metrics.resourceUtilization.trend === "up" ? "↑" : "↓"}{Math.abs(metrics.resourceUtilization.change).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 right-0 translate-y-1/2 flex items-center">
                <div className={`h-[2px] w-16 bg-gradient-to-r ${getStatusColorClass(metricStatuses.fuelEfficiency)}`}></div>
                <div className="ml-1">
                  <div className="text-sm font-medium">Fuel</div>
                  <div className="flex items-center">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${getStatusDotClass(metricStatuses.fuelEfficiency)} mr-1`}></span>
                    <span className="text-sm font-bold">{metrics.fuelEfficiency.value.toFixed(1)}%</span>
                    <span className={`ml-1 text-xs ${metrics.fuelEfficiency.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                      {metrics.fuelEfficiency.trend === "up" ? "↑" : "↓"}{Math.abs(metrics.fuelEfficiency.change).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
                <div className="text-xs font-medium mb-1">Route</div>
                <div className="flex items-center mb-1">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${getStatusDotClass(metricStatuses.routeOptimization)} mr-1`}></span>
                  <span className="text-xs font-bold">89.2%</span>
                  <span className="ml-1 text-[9px] text-emerald-500">↑3.4%</span>
                </div>
                <div className={`h-20 w-[2px] bg-gradient-to-b ${getStatusColorClass(metricStatuses.routeOptimization)}`}></div>
              </div>
              
              <div className="absolute bottom-1/4 left-0 -translate-x-1/2 translate-y-1/2 flex items-center flex-row-reverse">
                <div className={`h-[2px] w-16 bg-gradient-to-l ${getStatusColorClass(metricStatuses.maintenanceCompliance)}`}></div>
                <div className="mr-1">
                  <div className="text-xs font-medium">Maintenance</div>
                  <div className="flex items-center justify-end">
                    <span className={`ml-1 text-[9px] ${metrics.maintenanceCompliance.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                      {metrics.maintenanceCompliance.trend === "up" ? "↑" : "↓"}{Math.abs(metrics.maintenanceCompliance.change).toFixed(1)}%
                    </span>
                    <span className="text-xs font-bold ml-1">{metrics.maintenanceCompliance.value.toFixed(1)}%</span>
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${getStatusDotClass(metricStatuses.maintenanceCompliance)} ml-1`}></span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/4 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center flex-row-reverse">
                <div className={`h-[2px] w-16 bg-gradient-to-l ${getStatusColorClass(metricStatuses.costEfficiency)}`}></div>
                <div className="mr-1">
                  <div className="text-xs font-medium">Cost</div>
                  <div className="flex items-center justify-end">
                    <span className={`ml-1 text-[9px] ${metrics.costEfficiency.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                      {metrics.costEfficiency.trend === "up" ? "↑" : "↓"}{Math.abs(metrics.costEfficiency.change).toFixed(1)}%
                    </span>
                    <span className="text-xs font-bold ml-1">{metrics.costEfficiency.value.toFixed(1)}%</span>
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${getStatusDotClass(metricStatuses.costEfficiency)} ml-1`}></span>
                  </div>
                </div>
              </div>
              
              {/* Radar chart shape */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-[85%] h-[85%] ${getStatusBgClass(overallStatus)} rounded-full relative overflow-hidden`}>
                  {/* Performance shape with glowing effect */}
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-[2px]" 
                    style={{ 
                      height: `${(metrics.deliveryTime.value - 60) / 40 * 100}%`,
                      background: `linear-gradient(to top, transparent, ${getStatusDotClass(metricStatuses.deliveryTime)})`,
                      boxShadow: `0 0 8px ${getStatusDotClass(metricStatuses.deliveryTime)}`
                    }}
                  ></div>
                  <div 
                    className="absolute top-1/4 right-0 -translate-y-1/2 w-1/2 h-[2px]"
                    style={{ 
                      width: `${(metrics.resourceUtilization.value - 60) / 40 * 100}%`,
                      background: `linear-gradient(to right, transparent, ${getStatusDotClass(metricStatuses.resourceUtilization)})`,
                      boxShadow: `0 0 8px ${getStatusDotClass(metricStatuses.resourceUtilization)}`
                    }}
                  ></div>
                  <div 
                    className="absolute bottom-1/4 right-0 translate-y-1/2 w-1/2 h-[2px]"
                    style={{ 
                      width: `${(metrics.fuelEfficiency.value - 60) / 40 * 100}%`,
                      background: `linear-gradient(to right, transparent, ${getStatusDotClass(metricStatuses.fuelEfficiency)})`,
                      boxShadow: `0 0 8px ${getStatusDotClass(metricStatuses.fuelEfficiency)}`
                    }}
                  ></div>
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1/2 w-[2px]"
                    style={{ 
                      height: `${((89.2) - 60) / 40 * 100}%`,
                      background: `linear-gradient(to bottom, transparent, ${getStatusDotClass(metricStatuses.routeOptimization)})`,
                      boxShadow: `0 0 8px ${getStatusDotClass(metricStatuses.routeOptimization)}`
                    }}
                  ></div>
                  <div 
                    className="absolute bottom-1/4 left-0 translate-y-1/2 w-1/2 h-[2px]"
                    style={{ 
                      width: `${(metrics.maintenanceCompliance.value - 60) / 40 * 100}%`,
                      background: `linear-gradient(to left, transparent, ${getStatusDotClass(metricStatuses.maintenanceCompliance)})`,
                      boxShadow: `0 0 8px ${getStatusDotClass(metricStatuses.maintenanceCompliance)}`
                    }}
                  ></div>
                  <div 
                    className="absolute top-1/4 left-0 -translate-y-1/2 w-1/2 h-[2px]"
                    style={{ 
                      width: `${(metrics.costEfficiency.value - 60) / 40 * 100}%`,
                      background: `linear-gradient(to left, transparent, ${getStatusDotClass(metricStatuses.costEfficiency)})`,
                      boxShadow: `0 0 8px ${getStatusDotClass(metricStatuses.costEfficiency)}`
                    }}
                  ></div>
                  
                  {/* Glowing dots at each data point */}
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full z-10" 
                    style={{ 
                      top: `${(metrics.deliveryTime.value - 60) / 40 * 100}%`,
                      backgroundColor: getStatusDotClass(metricStatuses.deliveryTime),
                      boxShadow: `0 0 6px ${getStatusDotClass(metricStatuses.deliveryTime)}` 
                    }}
                  ></div>
                  <div 
                    className="absolute top-1/4 right-0 w-2 h-2 rounded-full z-10" 
                    style={{ 
                      right: `${100 - (metrics.resourceUtilization.value - 60) / 40 * 100}%`,
                      backgroundColor: getStatusDotClass(metricStatuses.resourceUtilization),
                      boxShadow: `0 0 6px ${getStatusDotClass(metricStatuses.resourceUtilization)}` 
                    }}
                  ></div>
                  <div 
                    className="absolute bottom-1/4 right-0 w-2 h-2 rounded-full z-10" 
                    style={{ 
                      right: `${100 - (metrics.fuelEfficiency.value - 60) / 40 * 100}%`,
                      backgroundColor: getStatusDotClass(metricStatuses.fuelEfficiency),
                      boxShadow: `0 0 6px ${getStatusDotClass(metricStatuses.fuelEfficiency)}` 
                    }}
                  ></div>
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full z-10" 
                    style={{ 
                      bottom: `${(89.2 - 60) / 40 * 100}%`,
                      backgroundColor: getStatusDotClass(metricStatuses.routeOptimization),
                      boxShadow: `0 0 6px ${getStatusDotClass(metricStatuses.routeOptimization)}` 
                    }}
                  ></div>
                  <div 
                    className="absolute bottom-1/4 left-0 w-2 h-2 rounded-full z-10" 
                    style={{ 
                      left: `${100 - (metrics.maintenanceCompliance.value - 60) / 40 * 100}%`,
                      backgroundColor: getStatusDotClass(metricStatuses.maintenanceCompliance),
                      boxShadow: `0 0 6px ${getStatusDotClass(metricStatuses.maintenanceCompliance)}` 
                    }}
                  ></div>
                  <div 
                    className="absolute top-1/4 left-0 w-2 h-2 rounded-full z-10" 
                    style={{ 
                      left: `${100 - (metrics.costEfficiency.value - 60) / 40 * 100}%`,
                      backgroundColor: getStatusDotClass(metricStatuses.costEfficiency),
                      boxShadow: `0 0 6px ${getStatusDotClass(metricStatuses.costEfficiency)}` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend and metrics */}
          <div className="w-1/4 h-full flex flex-col justify-center">
            <div className={`p-3 mb-3 rounded-md ${getStatusBgClass(overallStatus)}`}>
              <div className="text-sm opacity-80 mb-1">Overall Score</div>
              <div className="text-2xl font-bold">{overallScore.toFixed(1)}%</div>
              <div className="text-xs mt-1 opacity-70">Target: 90.0%</div>
            </div>
            
            <div className="text-sm opacity-80 mb-2">Metrics</div>
            
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">Status</div>
              <div className="space-y-1.5">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                  <div className="text-xs">Excellent</div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <div className="text-xs">Good</div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                  <div className="text-xs">Needs Attention</div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div>
                  <div className="text-xs">Critical</div>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-muted-foreground pt-2 border-t border-border/20 dark:border-border/10">
                <div className="flex justify-between mb-1">
                  <span>Scale:</span>
                  <span>60% - 100%</span>
                </div>
                <div className="flex justify-between">
                  <span>Target avg:</span>
                  <span>{((
                    metrics.deliveryTime.target +
                    metrics.resourceUtilization.target +
                    metrics.fuelEfficiency.target +
                    95.0 +
                    metrics.maintenanceCompliance.target +
                    metrics.costEfficiency.target
                  ) / 6).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render utilization chart
  const renderUtilizationChart = () => {
    // Calculate efficiency status based on target (85%)
    const getUtilizationStatus = (value: number): string => {
      if (value >= 85) return "optimal";
      if (value >= 75) return "good";
      if (value >= 65) return "warning";
      return "critical";
    };
    
    // Get status color classes
    const getStatusColorClass = (status: string): string => {
      switch (status) {
        case "optimal": return "bg-emerald-500/80 dark:bg-emerald-500/70";
        case "good": return "bg-blue-500/80 dark:bg-blue-500/70";
        case "warning": return "bg-amber-500/80 dark:bg-amber-500/70";
        case "critical": return "bg-rose-500/80 dark:bg-rose-500/70";
        default: return "bg-gray-500/80 dark:bg-gray-500/70";
      }
    };
    
    // Get utilization label color
    const getUtilizationLabelColor = (status: string): string => {
      switch (status) {
        case "optimal": return "text-emerald-600 dark:text-emerald-400";
        case "good": return "text-blue-600 dark:text-blue-400";
        case "warning": return "text-amber-600 dark:text-amber-400";
        case "critical": return "text-rose-600 dark:text-rose-400";
        default: return "text-gray-600 dark:text-gray-400";
      }
    };
    
    // Calculate average utilization
    const averageTruckUtilization = parseFloat((utilizationData.reduce((sum, item) => sum + item.trucks, 0) / utilizationData.length).toFixed(1));
    const averageVanUtilization = parseFloat((utilizationData.reduce((sum, item) => sum + item.vans, 0) / utilizationData.length).toFixed(1));
    
    // Calculate peak utilization times
    const peakTruckUtil = utilizationData.reduce((max, item) => item.trucks > max.value ? {time: item.time, value: item.trucks} : max, {time: '', value: 0});
    const peakVanUtil = utilizationData.reduce((max, item) => item.vans > max.value ? {time: item.time, value: item.vans} : max, {time: '', value: 0});
    
    // Calculate under-utilization times
    const minTruckUtil = utilizationData.reduce((min, item) => item.trucks < min.value ? {time: item.time, value: item.trucks} : min, {time: '', value: 100});
    const minVanUtil = utilizationData.reduce((min, item) => item.vans < min.value ? {time: item.time, value: item.vans} : min, {time: '', value: 100});
    
    return (
      <div className="h-[300px] w-full flex flex-col bg-card/60 dark:bg-card/20 rounded-md relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-500/5 rounded-full blur-xl"></div>
        <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl"></div>
        
        {/* Header with stats */}
        <div className="px-4 py-2 border-b border-border/20 dark:border-border/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500/90 dark:bg-blue-500/80 rounded-sm mr-1.5"></div>
                <div className="text-sm">
                  <span className="text-muted-foreground mr-1">Trucks</span>
                  <span className={`font-bold ${getUtilizationLabelColor(getUtilizationStatus(averageTruckUtilization))}`}>
                    {averageTruckUtilization}%
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500/90 dark:bg-emerald-500/80 rounded-sm mr-1.5"></div>
                <div className="text-sm">
                  <span className="text-muted-foreground mr-1">Vans</span>
                  <span className={`font-bold ${getUtilizationLabelColor(getUtilizationStatus(averageVanUtilization))}`}>
                    {averageVanUtilization}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-xs px-2 py-0.5 bg-muted/20 dark:bg-muted/10 rounded-full text-muted-foreground">
                Target: 85%
              </div>
              <div className={`text-xs px-2 py-0.5 rounded-full ${
                averageTruckUtilization >= 85 || averageVanUtilization >= 85 ? 
                "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20" : 
                "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20"
              }`}>
                {averageTruckUtilization >= 85 || averageVanUtilization >= 85 ? "On Target" : "Below Target"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative overflow-hidden">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-4 text-xs text-muted-foreground font-mono z-10">
            <div>100%</div>
            <div>80%</div>
            <div>60%</div>
            <div>40%</div>
            <div>20%</div>
            <div>0%</div>
          </div>
          
          {/* Grid lines */}
          <div className="absolute left-8 right-0 top-0 bottom-0">
            <div className="h-full flex flex-col justify-between">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className="border-t border-border/10 dark:border-border/5 w-full h-0"></div>
              ))}
            </div>
          </div>
          
          {/* Target line */}
          <div 
            className="absolute left-8 right-0 h-0.5 bg-emerald-500/30 dark:bg-emerald-500/20 z-10"
            style={{ top: `${(1 - 85/100) * 100}%` }}
          >
            <div className="absolute right-2 -top-6 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-white/80 dark:bg-black/30 py-0.5 px-1.5 rounded shadow-sm border border-emerald-100 dark:border-emerald-900/30">
              Target: 85%
            </div>
          </div>
          
          {/* Chart area */}
          <div className="absolute inset-0 left-8 pt-4 pb-6 pr-4 overflow-hidden">
            <div className="w-full h-full flex gap-2">
              {utilizationData.map((data, index) => {
                const truckStatus = getUtilizationStatus(data.trucks);
                const vanStatus = getUtilizationStatus(data.vans);
                
                return (
                  <div key={index} className="flex-1 h-full flex flex-col">
                    <div className="flex-1 relative">
                      {/* Use relative positioning for better alignment */}
                      <div className="absolute bottom-0 inset-x-0 flex justify-center items-end space-x-2">
                        {/* Trucks bar with status color */}
                        <div className="group relative w-4 flex flex-col justify-end">
                          <div 
                            className={`w-full rounded-t-sm ${getStatusColorClass(truckStatus)}`}
                            style={{ height: `${data.trucks}%` }}
                          >
                            {/* Tooltip */}
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-foreground px-2 py-1 rounded shadow-md border border-border/20 text-[10px] whitespace-nowrap z-20">
                              <div className="font-medium">Trucks - {data.time}</div>
                              <div className="flex justify-between gap-2">
                                <span>Utilization:</span>
                                <span className="font-bold">{data.trucks}%</span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span>Status:</span>
                                <span className={`
                                  ${truckStatus === "optimal" ? "text-emerald-500" : ""}
                                  ${truckStatus === "good" ? "text-blue-500" : ""}
                                  ${truckStatus === "warning" ? "text-amber-500" : ""}
                                  ${truckStatus === "critical" ? "text-rose-500" : ""}
                                `}>
                                  {truckStatus === "optimal" ? "Excellent" : ""}
                                  {truckStatus === "good" ? "Good" : ""}
                                  {truckStatus === "warning" ? "Low" : ""}
                                  {truckStatus === "critical" ? "Critical" : ""}
                                </span>
                              </div>
                              <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-border/20 transform rotate-45"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Vans bar with status color */}
                        <div className="group relative w-4 flex flex-col justify-end">
                          <div 
                            className={`w-full rounded-t-sm ${getStatusColorClass(vanStatus)}`}
                            style={{ height: `${data.vans}%` }}
                          >
                            {/* Tooltip */}
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-foreground px-2 py-1 rounded shadow-md border border-border/20 text-[10px] whitespace-nowrap z-20">
                              <div className="font-medium">Vans - {data.time}</div>
                              <div className="flex justify-between gap-2">
                                <span>Utilization:</span>
                                <span className="font-bold">{data.vans}%</span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span>Status:</span>
                                <span className={`
                                  ${vanStatus === "optimal" ? "text-emerald-500" : ""}
                                  ${vanStatus === "good" ? "text-blue-500" : ""}
                                  ${vanStatus === "warning" ? "text-amber-500" : ""}
                                  ${vanStatus === "critical" ? "text-rose-500" : ""}
                                `}>
                                  {vanStatus === "optimal" ? "Excellent" : ""}
                                  {vanStatus === "good" ? "Good" : ""}
                                  {vanStatus === "warning" ? "Low" : ""}
                                  {vanStatus === "critical" ? "Critical" : ""}
                                </span>
                              </div>
                              <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-border/20 transform rotate-45"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="text-[9px] font-mono text-center mt-1 text-muted-foreground">
                      {data.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Insights footer */}
        <div className="px-4 py-2 border-t border-border/20 dark:border-border/10 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-between">
            <div className="flex items-center">
              <span className="font-medium mr-1">Peak Utilization:</span>
              <span className="font-mono mr-2">Trucks: {peakTruckUtil.value}% ({peakTruckUtil.time})</span>
              <span className="font-mono">Vans: {peakVanUtil.value}% ({peakVanUtil.time})</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-1">Under Utilization:</span>
              <span className="font-mono mr-2">Trucks: {minTruckUtil.value}% ({minTruckUtil.time})</span>
              <span className="font-mono">Vans: {minVanUtil.value}% ({minVanUtil.time})</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render cost chart
  const renderCostChart = () => {
    // Calculate cost metrics
    const maxValue = Math.max(...costData.flatMap(d => [d.heavyTruck, d.mediumTruck, d.deliveryVan, d.electric]));
    const minValue = Math.min(...costData.flatMap(d => [d.heavyTruck, d.mediumTruck, d.deliveryVan, d.electric]));
    
    // Calculate averages
    const avgHeavyTruck = parseFloat((costData.reduce((sum, data) => sum + data.heavyTruck, 0) / costData.length).toFixed(2));
    const avgMediumTruck = parseFloat((costData.reduce((sum, data) => sum + data.mediumTruck, 0) / costData.length).toFixed(2));
    const avgDeliveryVan = parseFloat((costData.reduce((sum, data) => sum + data.deliveryVan, 0) / costData.length).toFixed(2));
    const avgElectric = parseFloat((costData.reduce((sum, data) => sum + data.electric, 0) / costData.length).toFixed(2));
    
    // Calculate cost trends
    const firstMonth = costData[0];
    const lastMonth = costData[costData.length - 1];
    
    const heavyTruckTrend = parseFloat(((lastMonth.heavyTruck - firstMonth.heavyTruck) / firstMonth.heavyTruck * 100).toFixed(1));
    const mediumTruckTrend = parseFloat(((lastMonth.mediumTruck - firstMonth.mediumTruck) / firstMonth.mediumTruck * 100).toFixed(1));
    const deliveryVanTrend = parseFloat(((lastMonth.deliveryVan - firstMonth.deliveryVan) / firstMonth.deliveryVan * 100).toFixed(1));
    const electricTrend = parseFloat(((lastMonth.electric - firstMonth.electric) / firstMonth.electric * 100).toFixed(1));
    
    // Calculate most cost-effective vehicle type
    const costEffectiveType = [
      {type: "Heavy Truck", avg: avgHeavyTruck, color: "bg-blue-500", textColor: "text-blue-500"},
      {type: "Medium Truck", avg: avgMediumTruck, color: "bg-indigo-500", textColor: "text-indigo-500"},
      {type: "Delivery Van", avg: avgDeliveryVan, color: "bg-violet-500", textColor: "text-violet-500"},
      {type: "Electric", avg: avgElectric, color: "bg-emerald-500", textColor: "text-emerald-500"}
    ].sort((a, b) => a.avg - b.avg)[0];
    
    // Calculate total fleet cost
    const totalFleetCost = parseFloat((avgHeavyTruck + avgMediumTruck + avgDeliveryVan + avgElectric).toFixed(2));
    
    // Check if electric is more cost-effective than traditional vehicles
    const isElectricEfficient = avgElectric < avgHeavyTruck && avgElectric < avgMediumTruck && avgElectric < avgDeliveryVan;
    
    return (
      <div className="h-[300px] w-full flex flex-col bg-card/60 dark:bg-card/20 rounded-md relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-6 -top-6 w-20 h-20 bg-violet-500/5 rounded-full blur-xl"></div>
        <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl"></div>
        
        {/* Header with quick stats */}
        <div className="px-4 py-2 border-b border-border/20 dark:border-border/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium flex items-center gap-1">
              Cost Per Mile (USD)
              {isElectricEfficient && (
                <div className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  Electric Cost-Efficient
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm mr-1"></div>
                <span>Heavy Truck</span>
                <span className="ml-1 font-mono font-bold">${avgHeavyTruck}</span>
                <span className={`ml-1 ${heavyTruckTrend <= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {heavyTruckTrend <= 0 ? "↓" : "↑"}{Math.abs(heavyTruckTrend)}%
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm mr-1"></div>
                <span>Medium Truck</span>
                <span className="ml-1 font-mono font-bold">${avgMediumTruck}</span>
                <span className={`ml-1 ${mediumTruckTrend <= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {mediumTruckTrend <= 0 ? "↓" : "↑"}{Math.abs(mediumTruckTrend)}%
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 bg-violet-500 rounded-sm mr-1"></div>
                <span>Delivery Van</span>
                <span className="ml-1 font-mono font-bold">${avgDeliveryVan}</span>
                <span className={`ml-1 ${deliveryVanTrend <= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {deliveryVanTrend <= 0 ? "↓" : "↑"}{Math.abs(deliveryVanTrend)}%
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm mr-1"></div>
                <span>Electric</span>
                <span className="ml-1 font-mono font-bold">${avgElectric}</span>
                <span className={`ml-1 ${electricTrend <= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {electricTrend <= 0 ? "↓" : "↑"}{Math.abs(electricTrend)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between py-4 text-xs text-muted-foreground font-mono z-10">
            <div className="mr-1 text-right">${maxValue.toFixed(2)}</div>
            <div className="mr-1 text-right">${(maxValue*0.8).toFixed(2)}</div>
            <div className="mr-1 text-right">${(maxValue*0.6).toFixed(2)}</div>
            <div className="mr-1 text-right">${(maxValue*0.4).toFixed(2)}</div>
            <div className="mr-1 text-right">${(maxValue*0.2).toFixed(2)}</div>
            <div className="mr-1 text-right">$0.00</div>
          </div>
          
          {/* Grid lines */}
          <div className="absolute left-10 right-0 top-0 bottom-0">
            <div className="h-full flex flex-col justify-between">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className="border-t border-border/10 dark:border-border/5 w-full h-0"></div>
              ))}
            </div>
          </div>
          
          {/* Most efficient line */}
          <div 
            className="absolute left-10 right-0 h-0.5 bg-emerald-500/20 dark:bg-emerald-500/10 z-10"
            style={{ top: `${(1 - costEffectiveType.avg/maxValue) * 100}%` }}
          >
            <div className="absolute left-2 -top-6 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-white/80 dark:bg-black/30 py-0.5 px-1.5 rounded shadow-sm border border-emerald-100 dark:border-emerald-900/30">
              Most Efficient: {costEffectiveType.type} (${costEffectiveType.avg})
            </div>
          </div>
          
          {/* Chart bars */}
          <div className="absolute inset-0 left-10 pt-4 pb-6 pr-4 overflow-hidden">
            <div className="w-full h-full flex gap-2 relative">
              {costData.map((data, index) => (
                <div key={index} className="flex-1 h-full flex flex-col">
                  <div className="flex-1 relative">
                    {/* Connect lines between points (trend lines) */}
                    {index < costData.length - 1 && (
                      <>
                        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                          <line 
                            x1="50%" 
                            y1={`${(1 - data.heavyTruck / maxValue) * 100}%`} 
                            x2="calc(100% + 4px)" 
                            y2={`${(1 - costData[index + 1].heavyTruck / maxValue) * 100}%`} 
                            stroke="rgba(59, 130, 246, 0.3)" 
                            strokeWidth="1" 
                            strokeDasharray="2,2" 
                          />
                          <line 
                            x1="50%" 
                            y1={`${(1 - data.mediumTruck / maxValue) * 100}%`} 
                            x2="calc(100% + 4px)" 
                            y2={`${(1 - costData[index + 1].mediumTruck / maxValue) * 100}%`} 
                            stroke="rgba(99, 102, 241, 0.3)" 
                            strokeWidth="1" 
                            strokeDasharray="2,2" 
                          />
                          <line 
                            x1="50%" 
                            y1={`${(1 - data.deliveryVan / maxValue) * 100}%`} 
                            x2="calc(100% + 4px)" 
                            y2={`${(1 - costData[index + 1].deliveryVan / maxValue) * 100}%`} 
                            stroke="rgba(139, 92, 246, 0.3)" 
                            strokeWidth="1" 
                            strokeDasharray="2,2" 
                          />
                          <line 
                            x1="50%" 
                            y1={`${(1 - data.electric / maxValue) * 100}%`} 
                            x2="calc(100% + 4px)" 
                            y2={`${(1 - costData[index + 1].electric / maxValue) * 100}%`} 
                            stroke="rgba(16, 185, 129, 0.3)" 
                            strokeWidth="1" 
                            strokeDasharray="2,2" 
                          />
                        </svg>
                      </>
                    )}
                    
                    {/* Bottom to top ordering for better visual layering */}
                    <div className="absolute inset-0 flex justify-center items-end space-x-1.5">
                      {/* Heavy Truck */}
                      <div className="group relative w-2.5 flex flex-col justify-end">
                        <div 
                          className="w-full bg-blue-500/90 dark:bg-blue-500/80 rounded-t-sm"
                          style={{ height: `${(data.heavyTruck / maxValue) * 100}%` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-foreground px-2 py-1 rounded shadow-md border border-border/20 text-[10px] whitespace-nowrap z-20">
                            <div className="font-medium">Heavy Truck - {data.month}</div>
                            <div className="flex justify-between gap-2">
                              <span>Cost per Mile:</span>
                              <span className="font-bold">${data.heavyTruck.toFixed(2)}</span>
                            </div>
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-border/20 transform rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Medium Truck */}
                      <div className="group relative w-2.5 flex flex-col justify-end">
                        <div 
                          className="w-full bg-indigo-500/90 dark:bg-indigo-500/80 rounded-t-sm" 
                          style={{ height: `${(data.mediumTruck / maxValue) * 100}%` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-foreground px-2 py-1 rounded shadow-md border border-border/20 text-[10px] whitespace-nowrap z-20">
                            <div className="font-medium">Medium Truck - {data.month}</div>
                            <div className="flex justify-between gap-2">
                              <span>Cost per Mile:</span>
                              <span className="font-bold">${data.mediumTruck.toFixed(2)}</span>
                            </div>
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-border/20 transform rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Delivery Van */}
                      <div className="group relative w-2.5 flex flex-col justify-end">
                        <div 
                          className="w-full bg-violet-500/90 dark:bg-violet-500/80 rounded-t-sm" 
                          style={{ height: `${(data.deliveryVan / maxValue) * 100}%` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-foreground px-2 py-1 rounded shadow-md border border-border/20 text-[10px] whitespace-nowrap z-20">
                            <div className="font-medium">Delivery Van - {data.month}</div>
                            <div className="flex justify-between gap-2">
                              <span>Cost per Mile:</span>
                              <span className="font-bold">${data.deliveryVan.toFixed(2)}</span>
                            </div>
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-border/20 transform rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Electric */}
                      <div className="group relative w-2.5 flex flex-col justify-end">
                        <div 
                          className="w-full bg-emerald-500/90 dark:bg-emerald-500/80 rounded-t-sm" 
                          style={{ height: `${(data.electric / maxValue) * 100}%` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-foreground px-2 py-1 rounded shadow-md border border-border/20 text-[10px] whitespace-nowrap z-20">
                            <div className="font-medium">Electric - {data.month}</div>
                            <div className="flex justify-between gap-2">
                              <span>Cost per Mile:</span>
                              <span className="font-bold">${data.electric.toFixed(2)}</span>
                            </div>
                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-border/20 transform rotate-45"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="text-[9px] font-medium text-center mt-1 text-muted-foreground">
                    {data.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Insights footer */}
        <div className="px-4 py-2 border-t border-border/20 dark:border-border/10 flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center">
            <div className="font-medium mr-2">
              Total Fleet Cost: <span className="text-foreground font-bold">${totalFleetCost}</span>
            </div>
            <div className="font-medium">
              Cost Range: <span className="text-foreground font-bold">${minValue.toFixed(2)} - ${maxValue.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className={`text-xs px-2 py-0.5 rounded-full ${
              costEffectiveType.type === "Electric" ? 
              "bg-emerald-500/10 text-emerald-500" : 
              "bg-blue-500/10 text-blue-500"
            }`}>
              Most Cost-Effective: {costEffectiveType.type}
            </div>
            {electricTrend < 0 && (
              <div className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                Electric Cost ↓ {Math.abs(electricTrend)}%
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Render performance indicators
  const renderPerformanceIndicators = () => {
    // Define the indicators object that was missing
    const indicators = {
      onTimeDelivery: 87.5,
      idleTime: 12.3,
      fuelEfficiency: 25.8,
      driverScore: 89.2,
      isHigherBetter: true
    };
    
    // Mock data for other areas of the component
    const fuelData = Array(180).fill(null).map((_, i) => ({
      date: new Date(Date.now() - (179 - i) * 24 * 60 * 60 * 1000).toISOString(),
      mpg: 20 + Math.random() * 10,
      cost: 50 + Math.random() * 30,
      miles: 100 + Math.random() * 50,
      vehicleType: ['Heavy Truck', 'Medium Truck', 'Delivery Van', 'Electric'][Math.floor(Math.random() * 4)]
    }));

    const safetyData = Array(12).fill(null).map((_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      overall: 75 + Math.random() * 20,
      incidents: Math.floor(Math.random() * 5)
    }));

    const maintenanceData = Array(50).fill(null).map((_, i) => ({
      id: `VEH-${1000 + i}`,
      type: ['Heavy Truck', 'Medium Truck', 'Delivery Van', 'Electric'][Math.floor(Math.random() * 4)],
      status: ['in-service', 'maintenance-needed', 'in-maintenance'][Math.floor(Math.random() * 3)],
      daysSinceLastMaintenance: Math.floor(Math.random() * 120),
      lastMaintenanceCost: 200 + Math.random() * 1000,
      lastServiceDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      serviceDue: Math.random() > 0.7,
      maintenanceCost: 200 + Math.random() * 1000,
      breakdowns: Math.floor(Math.random() * 3),
      downtime: Math.floor(Math.random() * 24),
      maintenanceType: Math.random() > 0.6 ? 'preventive' : 'reactive'
    }));

    // Additional missing variables and functions
    const lowestScoreArea = "Braking";
    
    const getMPGColor = (mpg: number) => {
      if (mpg >= 25) return "bg-emerald-500";
      if (mpg >= 20) return "bg-amber-500";
      return "bg-rose-500";
    };
    
    const normalizeValue = (value: number) => {
      return Math.min(Math.max(value, 0), 100);
    };

    // Helper function to determine status class based on value
    const getStatusClass = (value: number, isHigherBetter: boolean = true) => {
      if (isHigherBetter) {
        if (value >= 90) return "text-emerald-500";
        if (value >= 75) return "text-amber-500";
        return "text-rose-500";
      } else {
        if (value <= 10) return "text-emerald-500";
        if (value <= 25) return "text-amber-500";
        return "text-rose-500";
      }
    };
    
    // Helper for percentage change icon and color
    const renderPercentageChange = (current: number, previous: number) => {
      const percentChange = parseFloat(((current - previous) / previous * 100).toFixed(1));
      const isPositive = percentChange > 0;
      const isImprovement = (indicators.isHigherBetter && isPositive) || (!indicators.isHigherBetter && !isPositive);
      
      return (
        <span className={`inline-flex items-center text-xs font-medium ml-2 ${isImprovement ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(percentChange)}%
        </span>
      );
    };
    
    // Helper for rendering progress bars
    const renderProgressBar = (value: number, isHigherBetter: boolean = true) => {
      // Determine gradient colors based on value and whether higher is better
      let gradientClass = '';
      
      if (isHigherBetter) {
        if (value >= 90) gradientClass = 'bg-gradient-to-r from-emerald-500 to-emerald-400';
        else if (value >= 75) gradientClass = 'bg-gradient-to-r from-amber-500 to-amber-400';
        else gradientClass = 'bg-gradient-to-r from-rose-500 to-rose-400';
      } else {
        if (value <= 10) gradientClass = 'bg-gradient-to-r from-emerald-500 to-emerald-400';
        else if (value <= 25) gradientClass = 'bg-gradient-to-r from-amber-500 to-amber-400';
        else gradientClass = 'bg-gradient-to-r from-rose-500 to-rose-400';
      }
      
      const progressWidth = isHigherBetter ? value : 100 - value;
      
      return (
        <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className={`h-full ${gradientClass} rounded-full`} 
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      );
    };
    
    // Calculate month-over-month changes
    const previousOnTimeDelivery = indicators.onTimeDelivery - 2.5;
    const previousIdleTime = indicators.idleTime + 1.2;
    const previousFuelEfficiency = indicators.fuelEfficiency - 0.8;
    const previousDriverScore = indicators.driverScore - 3.2;
    
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On-Time Delivery */}
        <div className="relative p-0 bg-card/60 dark:bg-card/20 rounded-md overflow-hidden group">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6 blur-lg"></div>
          
          <div className="flex flex-col h-full justify-between gap-2">
            <div className="text-xs text-muted-foreground font-medium">On-Time Delivery</div>
            
            <div className="flex items-baseline gap-2">
              <div className={`text-2xl font-bold tracking-tight ${getStatusClass(indicators.onTimeDelivery)}`}>
                {indicators.onTimeDelivery}%
              </div>
              {renderPercentageChange(indicators.onTimeDelivery, previousOnTimeDelivery)}
            </div>
            
            {renderProgressBar(indicators.onTimeDelivery)}
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-[10px] font-medium text-muted-foreground">
                Target: 95%
              </div>
              <div className="text-[10px] font-medium bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full">
                {indicators.onTimeDelivery >= 85 ? 'On Target' : 'Needs Improvement'}
              </div>
            </div>
            
            {/* Tooltip with more details */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/90 dark:bg-card/90 p-4 flex flex-col justify-center items-center text-xs">
              <div className="font-medium mb-1">On-Time Delivery Details</div>
              <div className="space-y-1 w-full">
                <div className="flex justify-between">
                  <span>Daily Average:</span>
                  <span className="font-medium">{(indicators.onTimeDelivery - 0.8).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekend Performance:</span>
                  <span className="font-medium">{(indicators.onTimeDelivery + 1.2).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rush Hour Impact:</span>
                  <span className="font-medium">-2.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>Month-over-Month:</span>
                  <span className={indicators.onTimeDelivery > previousOnTimeDelivery ? "text-emerald-500" : "text-rose-500"}>
                    {indicators.onTimeDelivery > previousOnTimeDelivery ? "+" : ""}
                    {(indicators.onTimeDelivery - previousOnTimeDelivery).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Idle Time */}
        <div className="relative p-0 bg-card/60 dark:bg-card/20 rounded-md overflow-hidden group">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6 blur-lg"></div>
          
          <div className="flex flex-col h-full justify-between gap-2">
            <div className="text-xs text-muted-foreground font-medium">Idle Time</div>
            
            <div className="flex items-baseline gap-2">
              <div className={`text-2xl font-bold tracking-tight ${getStatusClass(indicators.idleTime, false)}`}>
                {indicators.idleTime}%
              </div>
              {renderPercentageChange(indicators.idleTime, previousIdleTime)}
            </div>
            
            {renderProgressBar(indicators.idleTime, false)}
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-[10px] font-medium text-muted-foreground">
                Target: &lt;10%
              </div>
              <div className={`text-[10px] font-medium ${
                indicators.idleTime <= 10 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : "bg-amber-500/10 text-amber-500"
              } px-1.5 py-0.5 rounded-full`}>
                {indicators.idleTime <= 10 ? 'Optimal' : 'Reduce Idle Time'}
              </div>
            </div>
            
            {/* Tooltip with more details */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/90 dark:bg-card/90 p-4 flex flex-col justify-center items-center text-xs">
              <div className="font-medium mb-1">Idle Time Details</div>
              <div className="space-y-1 w-full">
                <div className="flex justify-between">
                  <span>Morning Rush:</span>
                  <span className="font-medium">{(indicators.idleTime + 3.5).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Midday Average:</span>
                  <span className="font-medium">{(indicators.idleTime - 1.8).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Evening Rush:</span>
                  <span className="font-medium">{(indicators.idleTime + 2.7).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Month-over-Month:</span>
                  <span className={indicators.idleTime < previousIdleTime ? "text-emerald-500" : "text-rose-500"}>
                    {indicators.idleTime < previousIdleTime ? "" : "+"}
                    {(indicators.idleTime - previousIdleTime).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fuel Efficiency */}
        <div className="relative p-0 bg-card/60 dark:bg-card/20 rounded-md overflow-hidden group">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6 blur-lg"></div>
          
          <div className="flex flex-col h-full justify-between gap-2">
            <div className="text-xs text-muted-foreground font-medium">Fuel Efficiency</div>
            
            <div className="flex items-baseline gap-2">
              <div className={`text-2xl font-bold tracking-tight ${getStatusClass(indicators.fuelEfficiency)}`}>
                {indicators.fuelEfficiency}
              </div>
              <span className="text-xs text-muted-foreground">mpg</span>
              {renderPercentageChange(indicators.fuelEfficiency, previousFuelEfficiency)}
            </div>
            
            {renderProgressBar(indicators.fuelEfficiency/30 * 100)}
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-[10px] font-medium text-muted-foreground">
                Target: 25mpg
              </div>
              <div className={`text-[10px] font-medium ${
                indicators.fuelEfficiency >= 25 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : "bg-amber-500/10 text-amber-500"
              } px-1.5 py-0.5 rounded-full`}>
                {indicators.fuelEfficiency >= 25 ? 'Above Target' : 'Near Target'}
              </div>
            </div>
            
            {/* Tooltip with more details */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/90 dark:bg-card/90 p-4 flex flex-col justify-center items-center text-xs">
              <div className="font-medium mb-1">Fuel Efficiency Details</div>
              <div className="space-y-1 w-full">
                <div className="flex justify-between">
                  <span>Heavy Trucks:</span>
                  <span className="font-medium">{(indicators.fuelEfficiency - 5.2).toFixed(1)} mpg</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Trucks:</span>
                  <span className="font-medium">{(indicators.fuelEfficiency + 0.8).toFixed(1)} mpg</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Vans:</span>
                  <span className="font-medium">{(indicators.fuelEfficiency + 5.3).toFixed(1)} mpg</span>
                </div>
                <div className="flex justify-between">
                  <span>Month-over-Month:</span>
                  <span className={indicators.fuelEfficiency > previousFuelEfficiency ? "text-emerald-500" : "text-rose-500"}>
                    {indicators.fuelEfficiency > previousFuelEfficiency ? "+" : ""}
                    {(indicators.fuelEfficiency - previousFuelEfficiency).toFixed(1)} mpg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Driver Safety Score */}
        <div className="relative p-0 bg-card/60 dark:bg-card/20 rounded-md overflow-hidden group">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6 blur-lg"></div>
          
          <div className="flex flex-col h-full justify-between gap-2">
            <div className="text-xs text-muted-foreground font-medium">Driver Safety Score</div>
            
            <div className="flex items-baseline gap-2">
              <div className={`text-2xl font-bold tracking-tight ${getStatusClass(indicators.driverScore)}`}>
                {indicators.driverScore}
              </div>
              <span className="text-xs text-muted-foreground">/100</span>
              {renderPercentageChange(indicators.driverScore, previousDriverScore)}
            </div>
            
            {renderProgressBar(indicators.driverScore)}
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-[10px] font-medium text-muted-foreground">
                Target: 85+
              </div>
              <div className={`text-[10px] font-medium ${
                indicators.driverScore >= 85 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : "bg-amber-500/10 text-amber-500"
              } px-1.5 py-0.5 rounded-full`}>
                {indicators.driverScore >= 85 ? 'Excellent' : 'Good'}
              </div>
            </div>
            
            {/* Tooltip with more details */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/90 dark:bg-card/90 p-4 flex flex-col justify-center items-center text-xs">
              <div className="font-medium mb-1">Driver Safety Details</div>
              <div className="space-y-1 w-full">
                <div className="flex justify-between">
                  <span>Acceleration:</span>
                  <span className="font-medium">{(indicators.driverScore - 2).toFixed(1)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Braking:</span>
                  <span className="font-medium">{(indicators.driverScore - 4).toFixed(1)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Cornering:</span>
                  <span className="font-medium">{(indicators.driverScore + 1).toFixed(1)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Month-over-Month:</span>
                  <span className={indicators.driverScore > previousDriverScore ? "text-emerald-500" : "text-rose-500"}>
                    {indicators.driverScore > previousDriverScore ? "+" : ""}
                    {(indicators.driverScore - previousDriverScore).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render fuel efficiency chart
  const renderFuelEfficiency = () => {
    // Define monthNames
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Define mock safety data
    const safetyData = Array(12).fill(null).map((_, i) => ({
      month: monthNames[i],
      overall: 75 + Math.random() * 20,
      incidents: Math.floor(Math.random() * 5)
    }));
    
    // Define lowestScoreArea
    const lowestScoreArea = "Braking";
    
    // Define mock fuel data covering a full year to ensure all months have data
    const fuelData = [];
    // Create data for the last 365 days to ensure all months have data
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 365); // Go back a full year
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Add some seasonal variation to make the chart more interesting
      const seasonalFactor = 1 + 0.2 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
      
      fuelData.push({
        date: date.toISOString(),
        mpg: (20 + Math.random() * 10) * seasonalFactor,
        cost: 50 + Math.random() * 30,
        miles: 100 + Math.random() * 50,
        vehicleType: ['Heavy Truck', 'Medium Truck', 'Delivery Van', 'Electric'][Math.floor(Math.random() * 4)]
      });
    }
    
    // Initialize monthly averages array with 12 empty month objects
    const monthlyAverages = Array(12).fill(null).map(() => ({ total: 0, count: 0 }));
    
    // Aggregate data by month
    fuelData.forEach(record => {
      const month = new Date(record.date).getMonth();
      monthlyAverages[month].total += record.mpg;
      monthlyAverages[month].count += 1;
    });
    
    // Calculate average MPG for each month
    const monthlyMPG = monthlyAverages.map(m => m.count > 0 ? m.total / m.count : 0);
    
    // Calculate min, max and average MPG values with a minimum threshold to avoid scaling issues
    const allMPG = fuelData.map(d => d.mpg);
    const avgMPG = allMPG.reduce((sum, mpg) => sum + mpg, 0) / allMPG.length;
    const maxMPG = Math.max(...monthlyMPG); // Use max of monthly averages, not individual records
    const minMPG = Math.min(...monthlyMPG.filter(mpg => mpg > 0));
    
    // Calculate minimum threshold for bar height to avoid tiny bars
    const minDisplayHeight = maxMPG * 0.15; // 15% of max as minimum for visibility
    
    // Calculate fuel costs
    const totalFuelCost = fuelData.reduce((sum, record) => sum + record.cost, 0);
    const avgCostPerMile = totalFuelCost / fuelData.reduce((sum, record) => sum + record.miles, 0);
    
    // Calculate trend (comparing last 3 months to previous 3 months)
    const last3MonthsData = fuelData.slice(-90);
    const previous3MonthsData = fuelData.slice(-180, -90);
    
    const last3MonthsAvg = last3MonthsData.reduce((sum, record) => sum + record.mpg, 0) / last3MonthsData.length;
    const previous3MonthsAvg = previous3MonthsData.length > 0 
      ? previous3MonthsData.reduce((sum, record) => sum + record.mpg, 0) / previous3MonthsData.length
      : 0;
      
    const efficiencyTrend = previous3MonthsAvg > 0 
      ? ((last3MonthsAvg - previous3MonthsAvg) / previous3MonthsAvg * 100).toFixed(1)
      : '0.0';
    
    const isPositiveTrend = parseFloat(efficiencyTrend) >= 0;
    
    // Get insights by vehicle type
    const efficiencyByType = fuelData.reduce((acc, record) => {
      if (!acc[record.vehicleType]) {
        acc[record.vehicleType] = { total: 0, count: 0 };
      }
      acc[record.vehicleType].total += record.mpg;
      acc[record.vehicleType].count += 1;
      return acc;
    }, {} as Record<string, { total: number, count: number }>);
    
    const avgByType = Object.entries(efficiencyByType).map(([type, data]) => ({
      type,
      mpg: data.total / data.count
    })).sort((a, b) => b.mpg - a.mpg);
    
    const mostEfficientType = avgByType[0]?.type || 'N/A';
    const leastEfficientType = avgByType[avgByType.length - 1]?.type || 'N/A';
    
    // Helper function to get color based on MPG value
    const getMPGColor = (mpg: number) => {
      if (mpg >= avgMPG * 1.1) return 'bg-emerald-500';
      if (mpg >= avgMPG * 0.9) return 'bg-amber-500';
      return 'bg-rose-500';
    };
    
    const getMPGTextColor = (mpg: number) => {
      if (mpg >= avgMPG * 1.1) return 'text-emerald-500';
      if (mpg >= avgMPG * 0.9) return 'text-amber-500';
      return 'text-rose-500';
    };
    
    return (
      <div className="relative bg-card/60 dark:bg-card/20 rounded-md overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full -ml-10 -mb-10 blur-xl"></div>
        
        <div className="p-0">
          {/* Header with quick stats */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Fleet Fuel Efficiency</h3>
              <p className="text-sm text-muted-foreground">MPG and fuel consumption metrics</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-blue-500">
                {avgMPG.toFixed(1)}
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-muted-foreground">Average MPG</span>
                <span className={`flex items-center ${isPositiveTrend ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isPositiveTrend ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                      <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                      <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                    </svg>
                  )}
                  {Math.abs(parseFloat(efficiencyTrend))}% {isPositiveTrend ? 'improvement' : 'decrease'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Monthly trend chart */}
          <div className="h-20 mb-4">
            <div className="flex h-full items-end">
              {monthlyMPG.map((mpg, i) => {
                // Calculate bar height with a minimum visibility threshold
                const heightPercentage = mpg > 0 
                  ? Math.max((mpg / maxMPG) * 100, 15) // At least 15% height for visibility
                  : 0;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center" style={{ minWidth: '1.5rem' }}>
                    <div 
                      className={`w-4 ${getMPGColor(mpg)} rounded-sm transition-all duration-300`} 
                      style={{ height: `${heightPercentage}%`, minHeight: mpg > 0 ? '32px' : '0' }}
                    ></div>
                    
                    {/* X-axis labels */}
                    <div className="text-[10px] text-muted-foreground mt-2">{monthNames[i % 12]}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-muted/20 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Max MPG</div>
              <div className="text-lg font-medium text-emerald-500">{maxMPG.toFixed(1)}</div>
            </div>
            
            <div className="bg-muted/20 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Min MPG</div>
              <div className="text-lg font-medium text-amber-500">{minMPG.toFixed(1)}</div>
            </div>
            
            <div className="bg-muted/20 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Cost per Mile</div>
              <div className="text-lg font-medium">${avgCostPerMile.toFixed(2)}</div>
            </div>
            
            <div className="bg-muted/20 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Total Fuel Cost</div>
              <div className="text-lg font-medium">${totalFuelCost.toLocaleString()}</div>
            </div>
          </div>
          
          {/* Vehicle type comparison */}
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">Efficiency by Vehicle Type</div>
            <div className="space-y-2">
              {avgByType.map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-24 text-xs truncate">{item.type}</div>
                  <div className="flex-1">
                    <div className="w-full bg-muted/30 rounded-full h-1.5">
                      <div 
                        className={`${getMPGColor(item.mpg)} h-1.5 rounded-full`} 
                        style={{ width: `${(item.mpg / maxMPG) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs ml-2 font-medium">
                    {item.mpg.toFixed(1)} mpg
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Insights footer */}
          <div className="mt-4 pt-3 border-t border-muted/20">
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-xs">
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Most Efficient:</span>
                <span className="font-medium text-emerald-500">{mostEfficientType}</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Least Efficient:</span>
                <span className="font-medium text-rose-500">{leastEfficientType}</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Target MPG:</span>
                <span className="font-medium">25.0+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render maintenance chart
  const renderMaintenance = () => {
    // Define maintenanceData if it doesn't exist
    const maintenanceData = Array(50).fill(null).map((_, i) => ({
      id: `VEH-${1000 + i}`,
      type: ['Heavy Truck', 'Medium Truck', 'Delivery Van', 'Electric'][Math.floor(Math.random() * 4)],
      status: ['in-service', 'maintenance-needed', 'in-maintenance'][Math.floor(Math.random() * 3)],
      daysSinceLastMaintenance: Math.floor(Math.random() * 120),
      lastMaintenanceCost: 200 + Math.random() * 1000,
      lastServiceDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      serviceDue: Math.random() > 0.7,
      maintenanceCost: 200 + Math.random() * 1000,
      breakdowns: Math.floor(Math.random() * 3),
      downtime: Math.floor(Math.random() * 24),
      maintenanceType: Math.random() > 0.6 ? 'preventive' : 'reactive'
    }));
    
    // Calculate metrics for maintenance data
    const totalVehicles = maintenanceData.length;
    const vehiclesInService = maintenanceData.filter(v => v.status === 'in-service').length;
    const vehiclesRequiringMaintenance = maintenanceData.filter(v => v.status === 'maintenance-needed').length;
    const vehiclesInMaintenance = maintenanceData.filter(v => v.status === 'in-maintenance').length;
    const fleetAvailability = (vehiclesInService / totalVehicles * 100).toFixed(1);
    
    // Calculate averages and ranges
    const allDaysSinceMaintenance = maintenanceData.map(v => v.daysSinceLastMaintenance);
    const avgDaysSinceMaintenance = allDaysSinceMaintenance.reduce((sum, days) => sum + days, 0) / allDaysSinceMaintenance.length;
    const maxDaysSinceMaintenance = Math.max(...allDaysSinceMaintenance);
    
    // Calculate average cost per vehicle
    const avgMaintenanceCost = maintenanceData.reduce((sum, v) => sum + v.lastMaintenanceCost, 0) / totalVehicles;
    
    // Upcoming maintenance count
    const upcomingMaintenance = maintenanceData.filter(v => v.daysSinceLastMaintenance > 80 && v.status === 'in-service').length;
    
    // Vehicle types with maintenance info
    const maintenanceByType = {
      'Heavy Truck': maintenanceData.filter(v => v.type === 'Heavy Truck').length,
      'Medium Truck': maintenanceData.filter(v => v.type === 'Medium Truck').length,
      'Delivery Van': maintenanceData.filter(v => v.type === 'Delivery Van').length,
      'Electric': maintenanceData.filter(v => v.type === 'Electric').length,
    };
    
    // Helper function to get color for maintenance status
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'in-service': return 'bg-emerald-500';
        case 'maintenance-needed': return 'bg-amber-500';
        case 'in-maintenance': return 'bg-rose-500';
        default: return 'bg-slate-400';
      }
    };
    
    const getStatusTextColor = (status: string) => {
      switch (status) {
        case 'in-service': return 'text-emerald-500';
        case 'maintenance-needed': return 'text-amber-500';
        case 'in-maintenance': return 'text-rose-500';
        default: return 'text-slate-400';
      }
    };
    
    return (
      <div className="relative overflow-hidden">
        {/* Decorative elements with reduced opacity */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/3 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/3 rounded-full -ml-10 -mb-10 blur-xl"></div>
        
        <div className="p-4">
          {/* Header with quick stats */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Fleet Maintenance Status</h3>
              <p className="text-sm text-muted-foreground">Current maintenance metrics and vehicle status</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-emerald-500">
                {fleetAvailability}%
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-muted-foreground">Fleet Availability</span>
                <span className="text-muted-foreground">{vehiclesInService} of {totalVehicles} vehicles</span>
              </div>
            </div>
          </div>
          
          {/* Status grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-muted/10 rounded-md p-3">
              <span className="text-xs text-muted-foreground">In Service</span>
              <div className="flex items-center mt-1">
                <span className="text-lg font-medium text-emerald-500">{vehiclesInService}</span>
                <span className="text-xs ml-1 text-muted-foreground">vehicles</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1 mt-2">
                <div 
                  className="bg-emerald-500 h-1 rounded-full" 
                  style={{ width: `${(vehiclesInService / totalVehicles) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-muted/10 rounded-md p-3">
              <span className="text-xs text-muted-foreground">Needs Maintenance</span>
              <div className="flex items-center mt-1">
                <span className="text-lg font-medium text-amber-500">{vehiclesRequiringMaintenance}</span>
                <span className="text-xs ml-1 text-muted-foreground">vehicles</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1 mt-2">
                <div 
                  className="bg-amber-500 h-1 rounded-full" 
                  style={{ width: `${(vehiclesRequiringMaintenance / totalVehicles) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-muted/10 rounded-md p-3">
              <span className="text-xs text-muted-foreground">In Maintenance</span>
              <div className="flex items-center mt-1">
                <span className="text-lg font-medium text-rose-500">{vehiclesInMaintenance}</span>
                <span className="text-xs ml-1 text-muted-foreground">vehicles</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1 mt-2">
                <div 
                  className="bg-rose-500 h-1 rounded-full" 
                  style={{ width: `${(vehiclesInMaintenance / totalVehicles) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Maintenance table */}
          <div className="bg-muted/10 rounded-md p-3 mb-4">
            <div className="flex justify-between mb-2">
              <h4 className="text-sm font-medium">Recent Maintenance Records</h4>
              <span className="text-xs text-muted-foreground">
                {maintenanceData.filter(v => v.status !== 'in-service').length} vehicles requiring attention
              </span>
            </div>
            
            <div className="max-h-[200px] overflow-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Vehicle ID</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Last Service</th>
                    <th className="px-3 py-2">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/20">
                  {maintenanceData.slice(0, 2).map((vehicle, index) => (
                    <tr key={index} className="group hover:bg-muted/20">
                      <td className="px-3 py-2 text-sm">{vehicle.id}</td>
                      <td className="px-3 py-2 text-sm">{vehicle.type}</td>
                      <td className="px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                          <span className={getStatusTextColor(vehicle.status)}>
                            {vehicle.status === 'in-service' ? 'In Service' : 
                             vehicle.status === 'maintenance-needed' ? 'Needs Maintenance' : 'In Maintenance'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm">{vehicle.daysSinceLastMaintenance} days</td>
                      <td className="px-3 py-2 text-sm">${vehicle.lastMaintenanceCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render maintenance insights chart
  const renderMaintenanceInsights = () => {
    // Define maintenanceData if it doesn't exist
    const maintenanceData = Array(50).fill(null).map((_, i) => ({
      id: `VEH-${1000 + i}`,
      type: ['Heavy Truck', 'Medium Truck', 'Delivery Van', 'Electric'][Math.floor(Math.random() * 4)],
      status: ['in-service', 'maintenance-needed', 'in-maintenance'][Math.floor(Math.random() * 3)],
      daysSinceLastMaintenance: Math.floor(Math.random() * 120),
      lastMaintenanceCost: 200 + Math.random() * 1000,
      lastServiceDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      serviceDue: Math.random() > 0.7,
      maintenanceCost: 200 + Math.random() * 1000,
      breakdowns: Math.floor(Math.random() * 3),
      downtime: Math.floor(Math.random() * 24),
      maintenanceType: Math.random() > 0.6 ? 'preventive' : 'reactive'
    }));
    
    // Calculate maintenance metrics
    const totalVehicles = maintenanceData.length;
    const vehiclesServiced = maintenanceData.filter(v => v.lastServiceDate).length;
    const serviceDue = maintenanceData.filter(v => v.serviceDue).length;
    const serviceRate = (vehiclesServiced / totalVehicles) * 100;
    
    // Calculate average maintenance costs
    const totalCost = maintenanceData.reduce((sum, v) => sum + v.maintenanceCost, 0);
    const avgCostPerVehicle = totalCost / totalVehicles;
    
    // Calculate breakdown frequency
    const breakdowns = maintenanceData.reduce((sum, v) => sum + v.breakdowns, 0);
    const breakdownRate = (breakdowns / totalVehicles) * 100;
    
    // Calculate average downtime
    const totalDowntime = maintenanceData.reduce((sum, v) => sum + v.downtime, 0);
    const avgDowntime = totalDowntime / totalVehicles;
    
    // Preventive vs reactive maintenance
    const preventiveMaintCount = maintenanceData.filter(v => v.maintenanceType === 'preventive').length;
    const reactiveMaintCount = maintenanceData.filter(v => v.maintenanceType === 'reactive').length;
    const preventiveRate = (preventiveMaintCount / totalVehicles) * 100;
    
    // Maintenance cost by vehicle type
    const costByType = maintenanceData.reduce((acc, vehicle) => {
      if (!acc[vehicle.type]) {
        acc[vehicle.type] = { cost: 0, count: 0 };
      }
      acc[vehicle.type].cost += vehicle.maintenanceCost;
      acc[vehicle.type].count++;
      return acc;
    }, {} as Record<string, { cost: number, count: number }>);
    
    const typeEfficiency = Object.entries(costByType)
      .map(([type, data]) => ({
        type,
        avgCost: data.cost / data.count,
        count: data.count
      }))
      .sort((a, b) => a.avgCost - b.avgCost);
    
    // Helper function to get color based on maintenance efficiency
    const getMaintenanceColor = (value: number, isLowerBetter: boolean = true) => {
      const threshold = isLowerBetter ? 
        [30, 70] : // Lower is better (breakdown rate, costs)
        [70, 30];  // Higher is better (service rate)
      
      if (isLowerBetter) {
        if (value <= threshold[0]) return 'bg-emerald-500';
        if (value <= threshold[1]) return 'bg-amber-500';
        return 'bg-rose-500';
      } else {
        if (value >= threshold[0]) return 'bg-emerald-500';
        if (value >= threshold[1]) return 'bg-amber-500';
        return 'bg-rose-500';
      }
    };
    
    const getMaintenanceTextColor = (value: number, isLowerBetter: boolean = true) => {
      const threshold = isLowerBetter ? 
        [30, 70] : // Lower is better (breakdown rate, costs)
        [70, 30];  // Higher is better (service rate)
      
      if (isLowerBetter) {
        if (value <= threshold[0]) return 'text-emerald-500';
        if (value <= threshold[1]) return 'text-amber-500';
        return 'text-rose-500';
      } else {
        if (value >= threshold[0]) return 'text-emerald-500';
        if (value >= threshold[1]) return 'text-amber-500';
        return 'text-rose-500';
      }
    };
    
    return (
      <div className="relative overflow-hidden">
        {/* Decorative elements with reduced opacity */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/3 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/3 rounded-full -ml-10 -mb-10 blur-xl"></div>
        
        <div className="p-4">
          {/* Header with quick stats */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Maintenance Insights</h3>
              <p className="text-sm text-muted-foreground">Fleet health and maintenance efficiency</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`text-3xl font-bold ${getMaintenanceTextColor(serviceRate, true)}`}>
                {serviceRate.toFixed(1)}%
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-muted-foreground">Service Rate</span>
                <span className="text-muted-foreground">
                  {vehiclesServiced} of {totalVehicles} vehicles
                </span>
              </div>
            </div>
          </div>
          
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-muted/5 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Avg Cost/Vehicle</div>
              <div className="text-lg font-medium">${avgCostPerVehicle.toFixed(2)}</div>
            </div>
            
            <div className="bg-muted/5 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Breakdown Rate</div>
              <div className={`text-lg font-medium ${getMaintenanceTextColor(breakdownRate)}`}>
                {breakdownRate.toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-muted/5 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Avg Downtime</div>
              <div className="text-lg font-medium">{avgDowntime.toFixed(1)} hrs</div>
            </div>
            
            <div className="bg-muted/5 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">Service Due</div>
              <div className="text-lg font-medium">{serviceDue} vehicles</div>
            </div>
          </div>
          
          {/* Maintenance insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-muted/5 p-3 rounded-md">
              <h4 className="text-xs font-medium mb-2">Maintenance Type Distribution</h4>
              
              <div className="flex items-center mb-3">
                <div className="w-24 text-xs">Preventive</div>
                <div className="flex-1">
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{ width: `${preventiveRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs ml-2">
                  {preventiveMaintCount} ({preventiveRate.toFixed(1)}%)
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-xs">Reactive</div>
                <div className="flex-1">
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div 
                      className="bg-rose-500 h-2 rounded-full" 
                      style={{ width: `${100 - preventiveRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs ml-2">
                  {reactiveMaintCount} ({(100 - preventiveRate).toFixed(1)}%)
                </div>
              </div>
              
              <div className="mt-3 text-xs text-muted-foreground">
                Preventive maintenance helps reduce costly breakdowns and improves fleet reliability.
              </div>
            </div>
            
            {/* Vehicle type maintenance cost */}
            <div className="bg-muted/5 p-3 rounded-md">
              <h4 className="text-xs font-medium mb-2">Cost by Vehicle Type</h4>
              <div className="space-y-2">
                {typeEfficiency.map((type, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-24 text-xs truncate">{type.type}</div>
                    <div className="flex-1">
                      <div className="w-full bg-muted/30 rounded-full h-1.5">
                        <div 
                          className={getMaintenanceColor(type.avgCost / (avgCostPerVehicle * 2) * 100)} 
                          style={{ width: `${Math.min((type.avgCost / (avgCostPerVehicle * 2)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs ml-2">
                      ${type.avgCost.toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Insights footer */}
          <div className="pt-3 border-t border-muted/20">
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-xs">
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Total Maintenance Cost:</span>
                <span className="font-medium">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Preventive Ratio:</span>
                <span className={`font-medium ${getMaintenanceTextColor(preventiveRate, false)}`}>
                  {preventiveRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Total Downtime:</span>
                <span className="font-medium">
                  {totalDowntime} hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Performance Indicators */}
      <Card className="p-6 shadow-sm overflow-hidden relative">
        {/* Remove background color but keep decorative elements with reduced opacity */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/3 rounded-full -mr-16 -mt-16 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/3 rounded-full -ml-16 -mb-16 blur-xl"></div>
        <h3 className="text-xl font-semibold mb-1">Performance Metrics</h3>
        <p className="text-sm text-muted-foreground mb-6">Key operational performance indicators</p>
        {renderPerformanceIndicators()}
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="p-6 shadow-sm overflow-hidden relative">
          {/* Remove the background color but keep decorative elements with reduced opacity */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/3 rounded-full -mr-16 -mt-16 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/3 rounded-full -ml-16 -mb-16 blur-xl"></div>
          <h3 className="text-xl font-semibold mb-1">Operational Performance</h3>
          <p className="text-sm text-muted-foreground mb-6">Key performance indicators for the {period.toLowerCase()} period</p>
          {renderPerformanceChart()}
        </Card>

        {/* Fuel Efficiency Chart */}
        <Card className="p-6 shadow-sm overflow-hidden relative">
          {/* Remove background color but keep decorative elements with reduced opacity */}
          {renderFuelEfficiency()}
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Utilization Chart */}
        <Card className="p-6 shadow-sm overflow-hidden relative">
          {/* Remove background color but keep decorative elements with reduced opacity */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/3 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/3 rounded-full -ml-10 -mb-10 blur-xl"></div>
          <h3 className="text-xl font-semibold mb-1">Resource Utilization</h3>
          <p className="text-sm text-muted-foreground mb-6">Fleet and equipment usage efficiency</p>
          {renderUtilizationChart()}
        </Card>
        
        {/* Cost Chart */}
        <Card className="p-6 shadow-sm overflow-hidden relative">
          {/* Remove background color but keep decorative elements with reduced opacity */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/3 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/3 rounded-full -ml-10 -mb-10 blur-xl"></div>
          <h3 className="text-xl font-semibold mb-1">Cost Analysis</h3>
          <p className="text-sm text-muted-foreground mb-6">Operational costs and expense tracking</p>
          {renderCostChart()}
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Chart */}
        <Card className="p-0 h-auto">
          {renderMaintenance()}
        </Card>
        
        {/* Maintenance Insights Chart */}
        <Card className="p-0 h-auto">
          {renderMaintenanceInsights()}
        </Card>
      </div>
    </div>
  );
} 