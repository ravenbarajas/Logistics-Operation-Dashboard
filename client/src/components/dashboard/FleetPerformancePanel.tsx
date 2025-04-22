import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { fleetData } from "@/data/mock-data";
import { 
  Truck, 
  BarChart, 
  Wrench, 
  Clock, 
  Layers, 
  AlertTriangle,
  Calendar,
  Fuel,
  Ruler,
  Timer
} from "lucide-react";

interface FleetPerformanceProps {
  isDataLoaded: boolean;
  period: string;
}

export default function FleetPerformancePanel({ isDataLoaded, period }: FleetPerformanceProps) {
  const [fleetMetrics, setFleetMetrics] = useState(fleetData);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);
  
  // Compute additional metrics
  const totalMilesDriven = 124890;
  const avgMilesPerVehicle = Math.round(totalMilesDriven / fleetMetrics.summary.totalVehicles);
  const fuelEfficiency = 7.8; // MPG
  const maintenanceCost = 347.82; // $ per vehicle per month
  const idleTime = 8.2; // % of total time
  
  // Load data and render chart
  useEffect(() => {
    if (!isDataLoaded) return;
    
    setIsLoading(true);
    
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Create fleet utilization chart
      if (chartRef.current && window.Chart && !chartInstance.current) {
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        
        // Sample data for different vehicle types
        const vehicleTypeData = {
          labels: ['Heavy Trucks', 'Medium Trucks', 'Delivery Vans', 'Refrigerated', 'Special'],
          datasets: [
            {
              label: 'Active',
              data: [18, 14, 8, 5, 2],
              backgroundColor: 'hsl(var(--success))',
            },
            {
              label: 'Maintenance',
              data: [2, 1, 1, 1, 1],
              backgroundColor: 'hsl(var(--warning))',
            },
            {
              label: 'Inactive',
              data: [0, 0, 0, 0, 0],
              backgroundColor: 'hsl(var(--muted))',
            }
          ]
        };
        
        chartInstance.current = new window.Chart(ctx, {
          type: 'bar',
          data: vehicleTypeData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false
                },
                ticks: {
                  color: 'hsl(var(--foreground))'
                }
              },
              y: {
                stacked: true,
                grid: {
                  color: 'hsla(var(--muted), 0.3)'
                },
                ticks: {
                  color: 'hsl(var(--foreground))'
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: 'hsl(var(--foreground))'
                }
              }
            }
          }
        });
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [isDataLoaded]);
  
  return (
    <div className="space-y-4">
      {/* Fleet Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vehicles Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fleet</p>
                <h3 className="text-2xl font-bold mt-1">{fleetMetrics.summary.totalVehicles}</h3>
                <div className="flex items-center text-xs mt-1">
                  <Badge variant="outline" className="text-[10px]">
                    {fleetMetrics.summary.newVehicles} new
                  </Badge>
                </div>
              </div>
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1 text-xs">
              <div className="space-y-0.5">
                <div className="text-muted-foreground">Active</div>
                <div className="font-semibold">{fleetMetrics.summary.activeVehicles}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-muted-foreground">Maintenance</div>
                <div className="font-semibold">{fleetMetrics.summary.inMaintenance}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-muted-foreground">Out of Service</div>
                <div className="font-semibold">{fleetMetrics.summary.outOfService}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Fleet Utilization Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fleet Utilization</p>
                <h3 className="text-2xl font-bold mt-1">{fleetMetrics.summary.activePercentage}%</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>Target: 90%</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                <BarChart className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Current Utilization</span>
                <span className="font-medium">{fleetMetrics.summary.activePercentage}%</span>
              </div>
              <Progress value={fleetMetrics.summary.activePercentage} className="h-1" />
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Idle Time: {idleTime}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Maintenance Status Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance Status</p>
                <h3 className="text-2xl font-bold mt-1">{fleetMetrics.maintenanceSchedule.filter(m => m.status === "scheduled").length}</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>Scheduled services</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-accent/10 text-accent">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1 text-xs">
              <div className="space-y-0.5">
                <div className="text-muted-foreground">Scheduled</div>
                <div className="font-semibold">{fleetMetrics.maintenanceSchedule.filter(m => m.status === "scheduled").length}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-muted-foreground">In Progress</div>
                <div className="font-semibold">{fleetMetrics.maintenanceSchedule.filter(m => m.status === "in-progress").length}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-muted-foreground">Completed</div>
                <div className="font-semibold">{fleetMetrics.maintenanceSchedule.filter(m => m.status === "completed").length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Metrics Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <h3 className="text-2xl font-bold mt-1">${maintenanceCost.toFixed(2)}</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>Maint. cost per vehicle</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Timer className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="p-1.5 rounded-md bg-muted/20 flex justify-between items-center">
                <div className="flex items-center">
                  <Ruler className="h-3.5 w-3.5 mr-1 text-secondary" />
                  <span>Avg. Miles</span>
                </div>
                <span className="font-semibold">{avgMilesPerVehicle}</span>
              </div>
              <div className="p-1.5 rounded-md bg-muted/20 flex justify-between items-center">
                <div className="flex items-center">
                  <Fuel className="h-3.5 w-3.5 mr-1 text-secondary" />
                  <span>MPG</span>
                </div>
                <span className="font-semibold">{fuelEfficiency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Fleet Composition Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Fleet Composition & Status</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="h-[280px] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-[280px] w-full" />
                </div>
              ) : (
                <canvas ref={chartRef} className="w-full h-full" />
              )}
            </div>
          </div>
          
          {/* Fleet Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-muted/20 border-t">
            <div className="bg-card p-3">
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <Truck className="h-3.5 w-3.5 mr-1.5" />
                <span>Utilization Rate</span>
              </div>
              <div className="text-lg font-semibold">{fleetMetrics.summary.activePercentage}%</div>
              <div className="text-xs text-muted-foreground">
                {fleetMetrics.changes.active}
              </div>
            </div>
            <div className="bg-card p-3">
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <Wrench className="h-3.5 w-3.5 mr-1.5" />
                <span>Maintenance Rate</span>
              </div>
              <div className="text-lg font-semibold">{fleetMetrics.summary.maintenancePercentage}%</div>
              <div className="text-xs text-muted-foreground">
                {fleetMetrics.changes.maintenance}
              </div>
            </div>
            <div className="bg-card p-3">
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                <span>Issues Reported</span>
              </div>
              <div className="text-lg font-semibold">4</div>
              <div className="text-xs text-muted-foreground">
                Last 24 hours
              </div>
            </div>
            <div className="bg-card p-3">
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <span>Next Service</span>
              </div>
              <div className="text-lg font-semibold">
                {fleetMetrics.upcoming[0]?.id || "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">
                {fleetMetrics.upcoming[0]?.date || "No upcoming service"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 