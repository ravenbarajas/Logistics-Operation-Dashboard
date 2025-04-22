import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { deliveryPerformanceData, orders, activeShipments } from "@/data/mock-data";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  AlertTriangle,
  Timer,
  UploadCloud,
  User,
  Truck,
  MapPin,
  Package
} from "lucide-react";

interface DeliveryPerformanceMatrixProps {
  isDataLoaded: boolean;
  period: string;
}

export default function DeliveryPerformanceMatrix({ isDataLoaded, period }: DeliveryPerformanceMatrixProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"overview" | "trends" | "issues">("overview");
  const timeframeChartRef = useRef<HTMLCanvasElement | null>(null);
  const timeframeChartInstance = useRef<any>(null);
  const distributionChartRef = useRef<HTMLCanvasElement | null>(null);
  const distributionChartInstance = useRef<any>(null);
  
  // Delivery performance KPIs
  const metrics = {
    onTimeDelivery: 94.2,
    avgDeliveryTime: "2h 38m",
    deliveryAttempts: 1.08,
    customerSatisfaction: 4.7,
    earlyDeliveries: 5.8,
    lateDeliveries: 5.8,
    failedDeliveries: 1.2,
    avgDelayTime: "26m",
    firstAttemptSuccess: 97.1
  };
  
  // Delivery performance by region
  const regionalPerformance = [
    { region: "West", onTime: 96.7, volume: 418 },
    { region: "Midwest", onTime: 93.4, volume: 321 },
    { region: "Northeast", onTime: 91.8, volume: 384 },
    { region: "South", onTime: 94.9, volume: 402 },
    { region: "International", onTime: 87.2, volume: 98 }
  ];
  
  // Common issues
  const deliveryIssues = [
    { issue: "Address not found", count: 28, change: +2.1 },
    { issue: "Customer unavailable", count: 42, change: -4.5 },
    { issue: "Weather delay", count: 17, change: +8.9 },
    { issue: "Vehicle breakdown", count: 5, change: -1.2 },
    { issue: "Attempted delivery - no access", count: 31, change: +0.9 }
  ];
  
  // Render charts when data is loaded
  useEffect(() => {
    if (!isDataLoaded) return;
    
    setIsLoading(true);
    
    // Simulate API call
    const timer = setTimeout(() => {
      if (timeframeChartRef.current && window.Chart && !timeframeChartInstance.current) {
        createTimeframeChart();
      }
      
      if (distributionChartRef.current && window.Chart && !distributionChartInstance.current) {
        createDistributionChart();
      }
      
      setIsLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timer);
      if (timeframeChartInstance.current) {
        timeframeChartInstance.current.destroy();
        timeframeChartInstance.current = null;
      }
      if (distributionChartInstance.current) {
        distributionChartInstance.current.destroy();
        distributionChartInstance.current = null;
      }
    };
  }, [isDataLoaded, view]);
  
  // Create delivery timeframe chart
  const createTimeframeChart = () => {
    const ctx = timeframeChartRef.current?.getContext('2d');
    if (!ctx) return;
    
    // Simulated data for delivery time distribution
    const timeframeData = {
      labels: ['6-8 AM', '8-10 AM', '10-12 PM', '12-2 PM', '2-4 PM', '4-6 PM', '6-8 PM', '8-10 PM'],
      datasets: [{
        label: 'Delivery Volume',
        data: [42, 78, 126, 145, 132, 108, 64, 28],
        backgroundColor: 'hsla(var(--primary), 0.7)',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 1
      }]
    };
    
    timeframeChartInstance.current = new window.Chart(ctx, {
      type: 'bar',
      data: timeframeData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'hsla(var(--muted), 0.3)'
            },
            ticks: {
              color: 'hsl(var(--foreground))'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'hsl(var(--foreground))'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return `Volume: ${context.raw} deliveries`;
              }
            }
          }
        }
      }
    });
  };
  
  // Create delivery time distribution chart
  const createDistributionChart = () => {
    const ctx = distributionChartRef.current?.getContext('2d');
    if (!ctx) return;
    
    // Simulated data for delivery status distribution
    const distributionData = {
      labels: ['Early', 'On Time', 'Late < 30m', 'Late 30-60m', 'Late > 60m', 'Failed'],
      datasets: [{
        data: [5.8, 88.4, 3.4, 1.2, 0.4, 0.8],
        backgroundColor: [
          'hsla(var(--success), 0.7)',
          'hsla(var(--primary), 0.7)',
          'hsla(var(--warning), 0.5)',
          'hsla(var(--warning), 0.7)',
          'hsla(var(--destructive), 0.5)',
          'hsla(var(--destructive), 0.7)'
        ],
        borderColor: [
          'hsl(var(--success))',
          'hsl(var(--primary))',
          'hsl(var(--warning))',
          'hsl(var(--warning))',
          'hsl(var(--destructive))',
          'hsl(var(--destructive))'
        ],
        borderWidth: 1
      }]
    };
    
    distributionChartInstance.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: distributionData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'hsl(var(--foreground))',
              boxWidth: 12,
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
  };
  
  return (
    <div className="space-y-4">
      {/* Delivery KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On-Time Delivery Rate */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On-Time Rate</p>
                <h3 className="text-2xl font-bold mt-1">{metrics.onTimeDelivery}%</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>Target: 95%</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Performance</span>
                <span className="font-medium">{metrics.onTimeDelivery}%</span>
              </div>
              <Progress value={metrics.onTimeDelivery} max={100} className="h-1" />
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-success mr-1"></span>
                  <span>Early: {metrics.earlyDeliveries}%</span>
                </div>
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-destructive mr-1"></span>
                  <span>Late: {metrics.lateDeliveries}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Average Delivery Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Delivery Time</p>
                <h3 className="text-2xl font-bold mt-1">{metrics.avgDeliveryTime}</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>From pickup to delivery</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                <Timer className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Pickup to Transit</span>
                  <span className="font-medium">38m avg.</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-muted-foreground">Transit Time</span>
                  <span className="font-medium">1h 42m avg.</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Delivery Time</span>
                  <span className="font-medium">18m avg.</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-muted-foreground">Delay Time</span>
                  <span className="font-medium">{metrics.avgDelayTime} avg.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Delivery Attempts */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <h3 className="text-2xl font-bold mt-1">{metrics.firstAttemptSuccess}%</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>First attempt delivery success</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-accent/10 text-accent">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>First Attempt Success</span>
                <span className="font-medium">{metrics.firstAttemptSuccess}%</span>
              </div>
              <Progress value={metrics.firstAttemptSuccess} max={100} className="h-1" />
              <div className="flex items-center justify-between text-xs mt-3">
                <span className="text-muted-foreground">Avg. Attempts per Delivery</span>
                <span className="font-medium">{metrics.deliveryAttempts}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Failed Deliveries</span>
                <span className="font-medium">{metrics.failedDeliveries}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Satisfaction */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
                <h3 className="text-2xl font-bold mt-1">{metrics.customerSatisfaction}/5</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>Based on delivery feedback</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              {/* Star rating visualization */}
              <div className="flex space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div 
                    key={star} 
                    className={`h-2 flex-1 rounded-sm ${
                      star <= Math.floor(metrics.customerSatisfaction) 
                        ? "bg-primary" 
                        : star === Math.ceil(metrics.customerSatisfaction) && star > Math.floor(metrics.customerSatisfaction)
                          ? "bg-gradient-to-r from-primary to-muted/30"
                          : "bg-muted/30"
                    }`} 
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                <div className="p-1 bg-muted/10 rounded">
                  <div className="font-medium">98.2%</div>
                  <div className="text-[10px] text-muted-foreground">On Time</div>
                </div>
                <div className="p-1 bg-muted/10 rounded">
                  <div className="font-medium">96.7%</div>
                  <div className="text-[10px] text-muted-foreground">Accuracy</div>
                </div>
                <div className="p-1 bg-muted/10 rounded">
                  <div className="font-medium">94.1%</div>
                  <div className="text-[10px] text-muted-foreground">Driver Rating</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Delivery Performance Analysis</CardTitle>
            <Tabs value={view} onValueChange={(value) => setView(value as any)} className="w-full">
              <TabsList className="grid w-[300px] grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <TabsContent value="overview" className="mt-2 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Delivery Time Distribution */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Delivery Time Distribution</h4>
                <div className="h-[240px] relative">
                  {isLoading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <canvas ref={timeframeChartRef} className="w-full h-full" />
                  )}
                </div>
              </div>
              
              {/* Delivery Status Distribution */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Delivery Status Distribution</h4>
                <div className="h-[240px] relative">
                  {isLoading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <canvas ref={distributionChartRef} className="w-full h-full" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Delivery Performance by Region */}
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">Regional Performance</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {regionalPerformance.map((region) => (
                  <Card key={region.region} className="bg-muted/5 border-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>{region.region}</span>
                        <Badge variant={region.onTime >= 95 ? "success" : region.onTime >= 90 ? "outline" : "destructive"} className="text-[10px]">
                          {region.onTime}%
                        </Badge>
                      </div>
                      <Progress 
                        value={region.onTime} 
                        max={100} 
                        className={`h-1 ${
                          region.onTime >= 95 
                            ? "bg-success" 
                            : region.onTime >= 90 
                              ? "bg-primary" 
                              : "bg-destructive"
                        }`}
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        Volume: {region.volume} packages
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-2">
            <div className="text-sm mb-3">
              Delivery trend data visualization would go here...
            </div>
          </TabsContent>
          
          <TabsContent value="issues" className="mt-2">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Top Delivery Issues</h4>
              <div className="space-y-2">
                {deliveryIssues.map((issue) => (
                  <div key={issue.issue} className="flex items-center justify-between p-2 border-b border-muted/30 last:border-b-0">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-warning mr-2" />
                      <div>
                        <div className="text-sm">{issue.issue}</div>
                        <div className="text-xs text-muted-foreground">Count: {issue.count}</div>
                      </div>
                    </div>
                    <Badge variant={issue.change > 0 ? "destructive" : "success"} className="text-[10px]">
                      {issue.change > 0 ? "+" : ""}{issue.change}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
} 