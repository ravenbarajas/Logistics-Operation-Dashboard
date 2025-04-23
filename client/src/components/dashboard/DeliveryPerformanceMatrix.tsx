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
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from "lucide-react";

interface DeliveryPerformanceMatrixProps {
  isDataLoaded: boolean;
  period: string;
}

export default function DeliveryPerformanceMatrix({ isDataLoaded, period }: DeliveryPerformanceMatrixProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"overview" | "trends" | "issues">("overview");
  const [trendsTimeframe, setTrendsTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");
  const timeframeChartRef = useRef<HTMLCanvasElement | null>(null);
  const timeframeChartInstance = useRef<any>(null);
  const distributionChartRef = useRef<HTMLCanvasElement | null>(null);
  const distributionChartInstance = useRef<any>(null);
  const trendsChartRef = useRef<HTMLCanvasElement | null>(null);
  const trendsChartInstance = useRef<any>(null);
  const carrierChartRef = useRef<HTMLCanvasElement | null>(null);
  const carrierChartInstance = useRef<any>(null);
  
  // Debug component initialization
  useEffect(() => {
    console.log("DeliveryPerformanceMatrix mounted");
    console.log("Initial isDataLoaded:", isDataLoaded);
    console.log("Initial period:", period);
    console.log("Initial view:", view);
    
    return () => {
      console.log("DeliveryPerformanceMatrix unmounted");
    };
  }, []);
  
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
  
  // Delivery performance trend data (last 12 weeks)
  const trendData = {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      onTimeData: [93.8, 94.2, 95.1, 93.9, 94.7, 96.2, 95.8],
      volumeData: [145, 168, 182, 176, 192, 120, 84]
    },
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
      onTimeData: [92.8, 93.1, 92.6, 93.4, 94.2, 93.8, 94.5, 93.9, 94.1, 94.7, 94.3, 94.2],
      volumeData: [840, 920, 905, 950, 1010, 980, 1020, 1050, 1080, 1100, 1050, 1070]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      onTimeData: [91.2, 91.8, 92.5, 93.1, 93.8, 94.2, 94.5, 94.3, 94.1, 94.2, 94.0, 93.7],
      volumeData: [3500, 3200, 3600, 3800, 4100, 4300, 4500, 4400, 4600, 4700, 4350, 4200]
    }
  };
  
  // Carrier performance data
  const carrierPerformance = [
    { name: "Express Logistics", onTime: 96.8, volume: 384, costPerPackage: 12.40 },
    { name: "Swift Delivery", onTime: 94.2, volume: 276, costPerPackage: 8.75 },
    { name: "Metro Couriers", onTime: 92.1, volume: 198, costPerPackage: 7.90 },
    { name: "Regional Express", onTime: 93.8, volume: 243, costPerPackage: 9.20 },
    { name: "City Runners", onTime: 91.3, volume: 112, costPerPackage: 6.80 }
  ];
  
  // Render charts when data is loaded
  useEffect(() => {
    if (!isDataLoaded) return;
    
    console.log("Chart rendering triggered");
    console.log("Current view:", view);
    console.log("Window.Chart available:", !!window.Chart);
    
    // Set loading state to trigger skeleton display
    setIsLoading(true);
    
    // Use a longer delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      console.log("Delayed chart rendering started");
      console.log("Chart refs available:", {
        timeframeChart: !!timeframeChartRef.current,
        distributionChart: !!distributionChartRef.current,
        trendsChart: !!trendsChartRef.current,
        carrierChart: !!carrierChartRef.current
      });
      
      // Only proceed if Chart.js is loaded
      if (!window.Chart) {
        console.error("Chart.js not loaded yet");
        setIsLoading(false);
        return;
      }
      
      try {
        if (timeframeChartRef.current && !timeframeChartInstance.current) {
          console.log("Creating timeframe chart");
          createTimeframeChart();
        }
        
        if (distributionChartRef.current && !distributionChartInstance.current) {
          console.log("Creating distribution chart");
          createDistributionChart();
        }
        
        if (view === "trends") {
          if (trendsChartRef.current) {
            if (trendsChartInstance.current) {
              console.log("Destroying existing trends chart");
              trendsChartInstance.current.destroy();
            }
            console.log("Creating trends chart");
            createTrendsChart();
          }
          
          if (carrierChartRef.current) {
            if (carrierChartInstance.current) {
              console.log("Destroying existing carrier chart");
              carrierChartInstance.current.destroy();
            }
            console.log("Creating carrier chart");
            createCarrierChart();
          }
        }
      } catch (error) {
        console.error("Error creating charts:", error);
      } finally {
        setIsLoading(false);
        console.log("Charts rendering complete, loading state set to false");
      }
    }, 1200); // Increased timeout to ensure DOM is fully rendered
    
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
      if (trendsChartInstance.current) {
        trendsChartInstance.current.destroy();
        trendsChartInstance.current = null;
      }
      if (carrierChartInstance.current) {
        carrierChartInstance.current.destroy();
        carrierChartInstance.current = null;
      }
    };
  }, [isDataLoaded, view, trendsTimeframe]);
  
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
  
  // Create delivery trends chart
  const createTrendsChart = () => {
    const ctx = trendsChartRef.current?.getContext('2d');
    if (!ctx) return;
    
    const selectedData = trendData[trendsTimeframe];
    
    const trendsData = {
      labels: selectedData.labels,
      datasets: [
        {
          label: 'On-Time Delivery %',
          data: selectedData.onTimeData,
          borderColor: 'hsl(var(--primary))',
          backgroundColor: 'hsla(var(--primary), 0.1)',
          fill: true,
          tension: 0.2,
          yAxisID: 'y',
          pointRadius: 3,
          pointBackgroundColor: 'hsl(var(--primary))'
        },
        {
          label: 'Delivery Volume',
          data: selectedData.volumeData,
          borderColor: 'hsl(var(--secondary))',
          backgroundColor: 'transparent',
          type: 'bar',
          yAxisID: 'y1',
          order: 2
        }
      ]
    };
    
    trendsChartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: trendsData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'hsl(var(--foreground))'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'On-Time %',
              color: 'hsl(var(--primary))',
              font: {
                size: 10
              }
            },
            min: Math.floor(Math.min(...selectedData.onTimeData) - 2),
            max: 100,
            grid: {
              color: 'hsla(var(--muted), 0.3)'
            },
            ticks: {
              color: 'hsl(var(--foreground))'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Volume',
              color: 'hsl(var(--secondary))',
              font: {
                size: 10
              }
            },
            min: 0,
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
            position: 'top',
            labels: {
              color: 'hsl(var(--foreground))',
              boxWidth: 12,
              padding: 10,
              font: {
                size: 11
              }
            }
          }
        }
      }
    });
  };
  
  // Create carrier performance chart
  const createCarrierChart = () => {
    const ctx = carrierChartRef.current?.getContext('2d');
    if (!ctx) return;
    
    const carrierData = {
      labels: carrierPerformance.map(carrier => carrier.name),
      datasets: [
        {
          label: 'On-Time %',
          data: carrierPerformance.map(carrier => carrier.onTime),
          backgroundColor: carrierPerformance.map(carrier => 
            carrier.onTime >= 95 ? 'hsla(var(--success), 0.7)' : 
            carrier.onTime >= 92 ? 'hsla(var(--primary), 0.7)' : 
            'hsla(var(--warning), 0.7)'
          ),
          borderColor: carrierPerformance.map(carrier => 
            carrier.onTime >= 95 ? 'hsl(var(--success))' : 
            carrier.onTime >= 92 ? 'hsl(var(--primary))' : 
            'hsl(var(--warning))'
          ),
          borderWidth: 1
        }
      ]
    };
    
    carrierChartInstance.current = new window.Chart(ctx, {
      type: 'bar',
      data: carrierData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: false,
            min: 88,
            max: 100,
            grid: {
              color: 'hsla(var(--muted), 0.3)'
            },
            ticks: {
              color: 'hsl(var(--foreground))'
            }
          },
          y: {
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
                const carrier = carrierPerformance[context.dataIndex];
                return [
                  `On-Time: ${context.raw}%`,
                  `Volume: ${carrier.volume} packages`,
                  `Cost: $${carrier.costPerPackage.toFixed(2)}/package`
                ];
              }
            }
          }
        }
      }
    });
  };
  
  // Trend stats calculations
  const calculateTrendStats = () => {
    const data = trendData[trendsTimeframe];
    const currentValue = data.onTimeData[data.onTimeData.length - 1];
    const previousValue = data.onTimeData[data.onTimeData.length - 2];
    const change = currentValue - previousValue;
    const percentChange = (change / previousValue) * 100;
    
    return {
      current: currentValue,
      previous: previousValue,
      change,
      percentChange,
      increasing: change > 0
    };
  };
  
  const trendStats = calculateTrendStats();
  
  // Check canvas elements after rendering
  useEffect(() => {
    console.log("Checking canvas elements");
    console.log("Overview tab canvas elements:", {
      timeframeChart: timeframeChartRef.current,
      distributionChart: distributionChartRef.current
    });
    
    if (view === "trends") {
      console.log("Trends tab canvas elements:", {
        trendsChart: trendsChartRef.current,
        carrierChart: carrierChartRef.current
      });
    }
  }, [view]);
  
  return (
    <div className="space-y-4" data-component="delivery-performance-matrix">
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
          </div>
        </CardHeader>
        <Tabs value={view} onValueChange={(value) => setView(value as any)} className="w-full">
          <div className="px-4 pb-2 border-b">
            <TabsList className="grid w-[300px] grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>
          </div>
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
              <div className="space-y-4">
                {/* Time period selector */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Delivery Performance Trends</h4>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant={trendsTimeframe === "daily" ? "default" : "outline"} 
                      className="h-8 text-xs"
                      onClick={() => setTrendsTimeframe("daily")}
                    >
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Daily
                    </Button>
                    <Button 
                      size="sm" 
                      variant={trendsTimeframe === "weekly" ? "default" : "outline"} 
                      className="h-8 text-xs"
                      onClick={() => setTrendsTimeframe("weekly")}
                    >
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Weekly
                    </Button>
                    <Button 
                      size="sm" 
                      variant={trendsTimeframe === "monthly" ? "default" : "outline"} 
                      className="h-8 text-xs"
                      onClick={() => setTrendsTimeframe("monthly")}
                    >
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Monthly
                    </Button>
                  </div>
                </div>
                
                {/* KPI Cards with trends */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* On-Time Delivery Trend */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">On-Time Delivery</p>
                          <div className="flex items-baseline gap-1">
                            <h3 className="text-xl font-bold">{trendStats.current.toFixed(1)}%</h3>
                            <div className={`flex items-center text-xs ${trendStats.increasing ? 'text-success' : 'text-destructive'}`}>
                              {trendStats.increasing ? (
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 mr-0.5" />
                              )}
                              {Math.abs(trendStats.percentChange).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <Badge variant={trendStats.increasing ? "success" : "destructive"} className="text-[10px]">
                          {trendStats.increasing ? "Improving" : "Declining"}
                        </Badge>
                      </div>
                      <Progress 
                        value={trendStats.current} 
                        max={100} 
                        className="h-1 mb-1"
                      />
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                        <div>
                          <span className="block">Previous</span>
                          <span className="font-medium">{trendStats.previous.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="block">Change</span>
                          <span className={`font-medium ${trendStats.increasing ? 'text-success' : 'text-destructive'}`}>
                            {trendStats.change > 0 ? '+' : ''}{trendStats.change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Average Delivery Time Trend */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Avg. Delivery Time</p>
                          <div className="flex items-baseline gap-1">
                            <h3 className="text-xl font-bold">{metrics.avgDeliveryTime}</h3>
                            <div className="flex items-center text-xs text-success">
                              <ArrowDownRight className="h-3 w-3 mr-0.5" />
                              2.3%
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          Last {trendsTimeframe}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-3">
                        <div>
                          <span className="block">Previous</span>
                          <span className="font-medium">2h 43m</span>
                        </div>
                        <div>
                          <span className="block">Target</span>
                          <span className="font-medium">2h 30m</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* First Attempt Success Rate */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">First Attempt Success</p>
                          <div className="flex items-baseline gap-1">
                            <h3 className="text-xl font-bold">{metrics.firstAttemptSuccess}%</h3>
                            <div className="flex items-center text-xs text-success">
                              <ArrowUpRight className="h-3 w-3 mr-0.5" />
                              0.8%
                            </div>
                          </div>
                        </div>
                        <Badge variant="success" className="text-[10px]">
                          Above Target
                        </Badge>
                      </div>
                      <Progress 
                        value={metrics.firstAttemptSuccess} 
                        max={100} 
                        className="h-1 mb-1"
                      />
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                        <div>
                          <span className="block">Previous</span>
                          <span className="font-medium">96.3%</span>
                        </div>
                        <div>
                          <span className="block">Target</span>
                          <span className="font-medium">95.0%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Performance Trend Chart */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-3">Delivery Performance Over Time</h4>
                    <div className="h-[280px] relative">
                      {isLoading ? (
                        <Skeleton className="h-full w-full" />
                      ) : (
                        <canvas ref={trendsChartRef} className="w-full h-full" />
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Carrier Performance Comparison */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Carrier Performance Comparison</h4>
                    <Select defaultValue="ontime">
                      <SelectTrigger className="h-8 w-[160px] text-xs">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ontime">On-Time Performance</SelectItem>
                        <SelectItem value="volume">Delivery Volume</SelectItem>
                        <SelectItem value="cost">Cost per Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <div className="h-[220px] relative">
                        {isLoading ? (
                          <Skeleton className="h-full w-full" />
                        ) : (
                          <canvas ref={carrierChartRef} className="w-full h-full" />
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-4">
                        {carrierPerformance.map((carrier) => (
                          <div key={carrier.name} className="text-xs">
                            <div className="font-medium">{carrier.name}</div>
                            <div className="flex justify-between mt-1">
                              <span className="text-muted-foreground">Volume:</span>
                              <span>{carrier.volume}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Cost:</span>
                              <span>${carrier.costPerPackage.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="issues" className="mt-2">
              <div className="space-y-4">
                {/* Issue Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-muted/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Total Issues</p>
                          <h3 className="text-xl font-bold mt-1">123</h3>
                        </div>
                        <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Issue Rate</span>
                          <span className="font-medium">5.8%</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-muted-foreground">Previous Period</span>
                          <div className="flex items-center text-success">
                            <ArrowDownRight className="h-3 w-3 mr-0.5" />
                            <span>-1.2%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Resolution Time</p>
                          <h3 className="text-xl font-bold mt-1">4.2 hrs</h3>
                        </div>
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <Clock className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Target Time</span>
                          <span className="font-medium">3.5 hrs</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-muted-foreground">Previous Average</span>
                          <div className="flex items-center text-destructive">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            <span>+0.3 hrs</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Customer Impact</p>
                          <h3 className="text-xl font-bold mt-1">Medium</h3>
                        </div>
                        <div className="p-2 rounded-full bg-warning/10 text-warning">
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Satisfaction Impact</span>
                          <span className="font-medium">-0.3 points</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-muted-foreground">Re-order Rate</span>
                          <span className="font-medium">92.4%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Top Issues List */}
                <Card>
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Top Delivery Issues</CardTitle>
                      <Select defaultValue="count">
                        <SelectTrigger className="h-8 w-[140px] text-xs">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="count">Occurrence Count</SelectItem>
                          <SelectItem value="impact">Customer Impact</SelectItem>
                          <SelectItem value="trend">Trend (% Change)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {deliveryIssues.map((issue, index) => (
                        <div 
                          key={issue.issue} 
                          className={`flex items-center justify-between p-4 ${
                            index < deliveryIssues.length - 1 ? 'border-b border-muted/30' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30 mr-3">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{issue.issue}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {issue.count} occurrences ({((issue.count / 123) * 100).toFixed(1)}% of total)
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge variant={issue.change > 0 ? "destructive" : "success"} className="text-[10px] mb-1">
                              {issue.change > 0 ? "+" : ""}{issue.change}%
                            </Badge>
                            <div className="w-[80px] h-[20px] bg-muted/10 rounded-sm overflow-hidden">
                              <div 
                                className={`h-full ${
                                  issue.change > 5 ? 'bg-destructive/60' : 
                                  issue.change > 0 ? 'bg-warning/60' : 
                                  'bg-success/60'
                                }`}
                                style={{ width: `${Math.min(Math.max(Math.abs(issue.change) * 5, 10), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Issue Resolution and Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-medium">Issue Resolution Times</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Address not found</span>
                          <span className="font-medium">5.4 hrs</span>
                        </div>
                        <Progress value={54} max={100} className="h-1 bg-muted/30" />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>Customer unavailable</span>
                          <span className="font-medium">3.2 hrs</span>
                        </div>
                        <Progress value={32} max={100} className="h-1 bg-muted/30" />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>Weather delay</span>
                          <span className="font-medium">6.8 hrs</span>
                        </div>
                        <Progress value={68} max={100} className="h-1 bg-muted/30" />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>Vehicle breakdown</span>
                          <span className="font-medium">7.5 hrs</span>
                        </div>
                        <Progress value={75} max={100} className="h-1 bg-muted/30" />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>Attempted delivery - no access</span>
                          <span className="font-medium">2.8 hrs</span>
                        </div>
                        <Progress value={28} max={100} className="h-1 bg-muted/30" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-medium">Recommended Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/5 rounded-md border border-muted/20">
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-sm">Improve Address Verification</div>
                            <Badge className="text-[10px]">High Priority</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Address issues increased by 2.1%. Implement real-time address verification at checkout to reduce incorrect addresses.
                          </div>
                        </div>
                        
                        <div className="p-3 bg-muted/5 rounded-md border border-muted/20">
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-sm">Weather Contingency Planning</div>
                            <Badge className="text-[10px]">Medium Priority</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Weather delays up 8.9%. Integrate weather forecasting into route planning and provide customers with proactive delay notifications.
                          </div>
                        </div>
                        
                        <div className="p-3 bg-muted/5 rounded-md border border-muted/20">
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-sm">Delivery Time Communication</div>
                            <Badge className="text-[10px]">Medium Priority</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Improve accuracy of delivery time estimates and implement SMS notifications for delivery windows to reduce "customer unavailable" issues.
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
} 