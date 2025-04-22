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
  Zap 
} from "lucide-react";

interface OperationalEfficiencyProps {
  period: string;
}

export default function OperationalEfficiency({ period }: OperationalEfficiencyProps) {
  const [chartType, setChartType] = useState<"performance" | "utilization" | "cost">("performance");
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);
  
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
  
  // Unified render function for charts
  useEffect(() => {
    if (!chartRef.current || !window.Chart) return;
    
    // Clean up existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    setIsLoading(true);
    
    // Simulated API call with timeout
    const timer = setTimeout(() => {
      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;
      
      // Chart configuration based on selected type
      let chartConfig;
      
      if (chartType === "performance") {
        // Performance metrics chart
        chartConfig = {
          type: 'radar',
          data: {
            labels: [
              'Delivery Time Adherence',
              'Resource Utilization',
              'Fuel Efficiency',
              'Route Optimization',
              'Maintenance Compliance',
              'Cost Efficiency'
            ],
            datasets: [{
              label: 'Current',
              data: [
                metrics.deliveryTime.value,
                metrics.resourceUtilization.value,
                metrics.fuelEfficiency.value,
                89.2, // Route Optimization
                metrics.maintenanceCompliance.value,
                metrics.costEfficiency.value
              ],
              backgroundColor: 'hsla(var(--primary), 0.2)',
              borderColor: 'hsl(var(--primary))',
              pointBackgroundColor: 'hsl(var(--primary))',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'hsl(var(--primary))',
              borderWidth: 2
            }, {
              label: 'Target',
              data: [
                metrics.deliveryTime.target,
                metrics.resourceUtilization.target,
                metrics.fuelEfficiency.target,
                95.0, // Route Optimization target
                metrics.maintenanceCompliance.target,
                metrics.costEfficiency.target
              ],
              backgroundColor: 'hsla(var(--muted), 0.1)',
              borderColor: 'hsl(var(--muted-foreground))',
              pointBackgroundColor: 'hsl(var(--muted-foreground))',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'hsl(var(--muted-foreground))',
              borderWidth: 1,
              borderDash: [5, 5]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 60,
                max: 100,
                ticks: {
                  display: false
                },
                pointLabels: {
                  color: 'hsl(var(--foreground))',
                  font: {
                    size: 10
                  }
                },
                grid: {
                  color: 'hsla(var(--muted), 0.3)'
                },
                angleLines: {
                  color: 'hsla(var(--muted), 0.3)'
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: 'hsl(var(--foreground))',
                  usePointStyle: true,
                  pointStyleWidth: 8
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    return `${context.dataset.label}: ${context.raw}%`;
                  }
                }
              }
            }
          }
        };
      } else if (chartType === "utilization") {
        // Resource utilization chart
        const utilizationData = [
          { time: '00:00', trucks: 45, vans: 52 },
          { time: '04:00', trucks: 38, vans: 41 },
          { time: '08:00', trucks: 65, vans: 79 },
          { time: '12:00', trucks: 88, vans: 85 },
          { time: '16:00', trucks: 92, vans: 94 },
          { time: '20:00', trucks: 68, vans: 76 }
        ];
        
        chartConfig = {
          type: 'line',
          data: {
            labels: utilizationData.map(d => d.time),
            datasets: [{
              label: 'Trucks',
              data: utilizationData.map(d => d.trucks),
              borderColor: 'hsl(var(--primary))',
              backgroundColor: 'hsla(var(--primary), 0.2)',
              tension: 0.3,
              fill: true
            }, {
              label: 'Vans',
              data: utilizationData.map(d => d.vans),
              borderColor: 'hsl(var(--secondary))',
              backgroundColor: 'hsla(var(--secondary), 0.2)',
              tension: 0.3,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Utilization %',
                  color: 'hsl(var(--foreground))'
                },
                ticks: {
                  callback: function(value: any) {
                    return value + '%';
                  },
                  color: 'hsl(var(--foreground))'
                },
                grid: {
                  color: 'hsla(var(--muted), 0.3)'
                }
              },
              x: {
                ticks: {
                  color: 'hsl(var(--foreground))'
                },
                grid: {
                  color: 'hsla(var(--muted), 0.3)'
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: 'hsl(var(--foreground))'
                }
              },
              annotation: {
                annotations: {
                  line1: {
                    type: 'line',
                    yMin: 85,
                    yMax: 85,
                    borderColor: 'hsla(var(--success), 0.5)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    label: {
                      display: true,
                      content: 'Target: 85%',
                      position: 'end',
                      color: 'hsla(var(--success), 0.8)',
                      font: {
                        size: 10
                      }
                    }
                  }
                }
              }
            }
          }
        };
      } else if (chartType === "cost") {
        // Cost efficiency chart
        const costData = [
          costPerMileData[0],
          costPerMileData[1],
          costPerMileData[2],
          costPerMileData[3],
          costPerMileData[4],
          costPerMileData[5]
        ];
        
        chartConfig = {
          type: 'bar',
          data: {
            labels: costData.map(d => d.month),
            datasets: [{
              label: 'Heavy Truck',
              data: costData.map(d => d.heavyTruck),
              backgroundColor: 'hsl(var(--primary))'
            }, {
              label: 'Medium Truck',
              data: costData.map(d => d.mediumTruck),
              backgroundColor: 'hsl(var(--secondary))'
            }, {
              label: 'Delivery Van',
              data: costData.map(d => d.deliveryVan),
              backgroundColor: 'hsl(var(--accent))'
            }, {
              label: 'Electric',
              data: costData.map(d => d.electric),
              backgroundColor: 'hsl(var(--success))'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Cost per Mile ($)',
                  color: 'hsl(var(--foreground))'
                },
                ticks: {
                  callback: function(value: any) {
                    return '$' + value.toFixed(2);
                  },
                  color: 'hsl(var(--foreground))'
                },
                grid: {
                  color: 'hsla(var(--muted), 0.3)'
                }
              },
              x: {
                ticks: {
                  color: 'hsl(var(--foreground))'
                },
                grid: {
                  color: 'hsla(var(--muted), 0.3)'
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
        };
      }
      
      if (chartConfig) {
        chartInstance.current = new window.Chart(ctx, chartConfig);
      }
      
      setIsLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, period]);
  
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
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <canvas ref={chartRef} className="w-full h-full" />
            )}
          </div>
          
          {/* Key Metrics Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-muted/10 rounded-md p-2 text-center">
              <div className="flex justify-center mb-1 text-secondary">
                <Timer className="h-4 w-4" />
              </div>
              <div className="text-xs font-medium">Avg Trip Duration</div>
              <div className="text-sm font-bold">{detailedMetrics.averageTripDuration}</div>
            </div>
            <div className="bg-muted/10 rounded-md p-2 text-center">
              <div className="flex justify-center mb-1 text-primary">
                <Package className="h-4 w-4" />
              </div>
              <div className="text-xs font-medium">Warehouse Utilization</div>
              <div className="text-sm font-bold">{detailedMetrics.warehouseUtilization}</div>
            </div>
            <div className="bg-muted/10 rounded-md p-2 text-center">
              <div className="flex justify-center mb-1 text-accent">
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-xs font-medium">Route Optimization</div>
              <div className="text-sm font-bold">{detailedMetrics.routeOptimizationScore}</div>
            </div>
            <div className="bg-muted/10 rounded-md p-2 text-center">
              <div className="flex justify-center mb-1 text-secondary">
                <Fuel className="h-4 w-4" />
              </div>
              <div className="text-xs font-medium">Fuel Usage/Km</div>
              <div className="text-sm font-bold">{detailedMetrics.fuelUsagePerKm}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 