import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Clock, 
  Package, 
  Fuel, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  Search,
  AlertTriangle,
  ClipboardCheck,
  Activity,
  Zap
} from "lucide-react";
import { kpiData, fleetData, costAnalysisData } from "@/data/mock-data";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdvancedKpiGridProps {
  period: string;
}

export default function AdvancedKpiGrid({ period }: AdvancedKpiGridProps) {
  const [data, setData] = useState(kpiData);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading based on the selected period
  useEffect(() => {
    setIsLoading(true);
    
    // Simulated API call with timeout
    const timer = setTimeout(() => {
      // Make minor data variations based on the selected period
      const variationFactor = 
        period === "today" ? 0.98 :
        period === "yesterday" ? 0.95 :
        period === "7days" ? 1.0 :
        period === "30days" ? 1.02 :
        period === "90days" ? 1.05 : 1.08;
      
      const adjustedData = {
        ...kpiData,
        activeVehicles: {
          ...kpiData.activeVehicles,
          active: Math.round(kpiData.activeVehicles.active * variationFactor),
          utilization: Math.min(100, kpiData.activeVehicles.utilization * variationFactor)
        },
        onTimeDeliveries: {
          ...kpiData.onTimeDeliveries,
          percentage: Math.min(100, kpiData.onTimeDeliveries.percentage * variationFactor),
          change: kpiData.onTimeDeliveries.change * variationFactor
        },
        pendingOrders: {
          ...kpiData.pendingOrders,
          total: Math.round(kpiData.pendingOrders.total * (2 - variationFactor)),
          urgent: Math.round(kpiData.pendingOrders.urgent * (2 - variationFactor)),
          normal: Math.round(kpiData.pendingOrders.normal * (2 - variationFactor))
        },
        fuelEfficiency: {
          ...kpiData.fuelEfficiency,
          value: Number((kpiData.fuelEfficiency.value * (2 - variationFactor)).toFixed(1)),
          change: kpiData.fuelEfficiency.change * variationFactor
        }
      };
      
      setData(adjustedData);
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [period]);
  
  // Calculate additional metrics
  const operationalEfficiency = 92.7;
  const routeOptimization = 87.4;
  const costPerMile = 1.68;
  const costPerMileChange = -2.4;
  const maintenanceIndex = 94.5;
  const warningCount = 3;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Fleet Utilization Card */}
      <Card className="overflow-hidden border-l-4 border-l-primary">
        <CardContent className="p-4">
          {isLoading ? (
            <KpiSkeleton />
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fleet Utilization</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <h3 className="text-2xl font-bold mt-1">{data.activeVehicles.active}/{data.activeVehicles.total}</h3>
                          <Badge variant="outline" className="ml-1 font-mono text-xs">
                            {data.activeVehicles.utilization.toFixed(1)}%
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Total fleet capacity: {data.activeVehicles.total} vehicles</p>
                        <p className="text-xs">Active vehicles: {data.activeVehicles.active}</p>
                        <p className="text-xs">Maintenance: {fleetData.status.maintenance}</p>
                        <p className="text-xs">Inactive: {fleetData.status.inactive}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Heavy: {Math.round(data.activeVehicles.active * 0.45)}</span>
                    <span className="text-muted-foreground">Medium: {Math.round(data.activeVehicles.active * 0.35)}</span>
                    <span className="text-muted-foreground">Light: {Math.round(data.activeVehicles.active * 0.2)}</span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Truck className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Utilization Rate</span>
                  <span className="font-medium">{data.activeVehicles.utilization.toFixed(1)}%</span>
                </div>
                <Progress value={data.activeVehicles.utilization} className="h-1" />
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1">
                <div className="text-center px-1 py-0.5 bg-primary/5 rounded text-xs">
                  <div className="font-medium">{Math.round(data.activeVehicles.active * 0.92)}</div>
                  <div className="text-[10px] text-muted-foreground">On Route</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-primary/5 rounded text-xs">
                  <div className="font-medium">{Math.round(data.activeVehicles.active * 0.08)}</div>
                  <div className="text-[10px] text-muted-foreground">Loading</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-primary/5 rounded text-xs">
                  <div className="font-medium">{fleetData.status.maintenance}</div>
                  <div className="text-[10px] text-muted-foreground">Service</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delivery Performance Card */}
      <Card className="overflow-hidden border-l-4 border-l-secondary">
        <CardContent className="p-4">
          {isLoading ? (
            <KpiSkeleton />
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Performance</p>
                  <div className="flex items-center gap-1">
                    <h3 className="text-2xl font-bold mt-1">{data.onTimeDeliveries.percentage.toFixed(1)}%</h3>
                    <Badge variant={data.onTimeDeliveries.change > 0 ? "success" : "destructive"} className="ml-1 text-[10px]">
                      {data.onTimeDeliveries.change > 0 ? "+" : ""}{data.onTimeDeliveries.change.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Avg. delay: 18 min</span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>On-Time Rate</span>
                  <span className="font-medium">{data.onTimeDeliveries.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={data.onTimeDeliveries.percentage} className="h-1 bg-secondary" />
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1">
                <div className="text-center px-1 py-0.5 bg-secondary/5 rounded text-xs">
                  <div className="font-medium">{Math.round(data.onTimeDeliveries.percentage)}%</div>
                  <div className="text-[10px] text-muted-foreground">On Time</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-secondary/5 rounded text-xs">
                  <div className="font-medium">{Math.round(100 - data.onTimeDeliveries.percentage)}%</div>
                  <div className="text-[10px] text-muted-foreground">Delayed</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-secondary/5 rounded text-xs">
                  <div className="font-medium">94.8%</div>
                  <div className="text-[10px] text-muted-foreground">Target</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Pending Orders Card */}
      <Card className="overflow-hidden border-l-4 border-l-accent">
        <CardContent className="p-4">
          {isLoading ? (
            <KpiSkeleton />
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Processing</p>
                  <div className="flex items-center gap-1">
                    <h3 className="text-2xl font-bold mt-1">{data.pendingOrders.total}</h3>
                    <Badge variant="outline" className="ml-1 font-mono text-xs">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-baseline mt-1 text-xs text-muted-foreground">
                    <span className="text-destructive font-medium mr-1">
                      {data.pendingOrders.urgent} urgent
                    </span>
                    <span>/ {data.pendingOrders.total - data.pendingOrders.urgent} standard</span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Processing Rate</span>
                  <span className="font-medium">
                    {Math.round(data.pendingOrders.total * 0.15)} orders/hour
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Progress value={75} className="h-1 flex-1" />
                  <span className="text-xs font-medium">75%</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1">
                <div className="text-center px-1 py-0.5 bg-accent/5 rounded text-xs">
                  <div className="font-medium">{data.pendingOrders.total}</div>
                  <div className="text-[10px] text-muted-foreground">Pending</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-accent/5 rounded text-xs">
                  <div className="font-medium">{Math.round(data.pendingOrders.total * 0.4)}</div>
                  <div className="text-[10px] text-muted-foreground">Processing</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-accent/5 rounded text-xs">
                  <div className="font-medium">{Math.round(data.pendingOrders.total * 1.2)}</div>
                  <div className="text-[10px] text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Operational Efficiency Card */}
      <Card className="overflow-hidden border-l-4 border-l-primary">
        <CardContent className="p-4">
          {isLoading ? (
            <KpiSkeleton />
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Operational Metrics</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <h3 className="text-2xl font-bold mt-1">{operationalEfficiency.toFixed(1)}%</h3>
                          <Badge variant="success" className="ml-1 text-[10px]">
                            +1.8%
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Overall operational efficiency score</p>
                        <p className="text-xs">Calculated from: delivery time, fuel usage, resource allocation</p>
                        <p className="text-xs">Target: 95%</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>vs. 90.6% industry avg.</span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Optimization Score</span>
                  <span className="font-medium">{routeOptimization.toFixed(1)}%</span>
                </div>
                <Progress value={routeOptimization} className="h-1" />
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1">
                <div className="text-center px-1 py-0.5 bg-primary/5 rounded text-xs">
                  <div className="font-medium">{costPerMile.toFixed(2)}</div>
                  <div className="text-[10px] text-muted-foreground">$/Mile</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-primary/5 rounded text-xs">
                  <div className="font-medium">{maintenanceIndex.toFixed(1)}%</div>
                  <div className="text-[10px] text-muted-foreground">Maint. Index</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-destructive/10 rounded text-xs">
                  <div className="font-medium flex items-center justify-center">
                    <AlertTriangle className="h-3 w-3 mr-0.5 text-destructive" />
                    <span>{warningCount}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">Alerts</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-1 w-full" />
      </div>
      <div className="grid grid-cols-3 gap-1 pt-1">
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  );
} 