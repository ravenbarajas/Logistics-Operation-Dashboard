import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Calendar,
  RotateCw,
  Zap,
  Activity,
  ShieldAlert,
  Route,
  PieChart,
  Command,
  Users,
  Cloud,
  Truck as TruckIcon,
  Truck as TruckIcon2,
  RefreshCcw,
  MoreHorizontal,
  Star,
  ChevronRight
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  // New chart references
  const deliveryVolumeChartRef = useRef<HTMLDivElement>(null);
  const deliveryVolumeChartInstance = useRef<any>(null);
  const regionalComparisonChartRef = useRef<HTMLCanvasElement | null>(null);
  const regionalComparisonChartInstance = useRef<any>(null);
  const performanceRadarChartRef = useRef<HTMLCanvasElement | null>(null);
  const performanceRadarChartInstance = useRef<any>(null);
  
  // Timestamp for "live" updates
  const [timestamp, setTimestamp] = useState(new Date());
  
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
    overallStatus: "optimal", // optimal, good, warning, critical
    onTimeDelivery: 94.2,
    avgDeliveryTime: "2h 38m",
    deliveryAttempts: 1.08,
    customerSatisfaction: 4.7,
    earlyDeliveries: 5.8,
    lateDeliveries: 5.8,
    failedDeliveries: 1.2,
    avgDelayTime: "26m",
    firstAttemptSuccess: 97.1,
    activeShipments: 248,
    completedToday: 382,
    alertCount: 3,
    criticalAlerts: 1
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
    { issue: "Address not found", count: 28, change: +2.1, status: "warning" },
    { issue: "Customer unavailable", count: 42, change: -4.5, status: "info" },
    { issue: "Weather delay", count: 17, change: +8.9, status: "warning" },
    { issue: "Vehicle breakdown", count: 5, change: -1.2, status: "critical" },
    { issue: "Attempted delivery - no access", count: 31, change: +0.9, status: "info" }
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
  
  // Live delivery alerts
  const liveDeliveryAlerts = [
    { id: "D-1248", type: "Express", alert: "Delayed in Transit", severity: "warning", time: "12 min ago", location: "Downtown Seattle" },
    { id: "D-1305", type: "Standard", alert: "Address Not Found", severity: "info", time: "25 min ago", location: "Bellevue, WA" },
    { id: "D-1186", type: "Priority", alert: "Failed Delivery Attempt", severity: "critical", time: "8 min ago", location: "Portland, OR" }
  ];
  
  // Daily delivery volume data
  const dailyDeliveryVolume = [
    { hour: '06:00', completed: 18, scheduled: 20 },
    { hour: '07:00', completed: 25, scheduled: 26 },
    { hour: '08:00', completed: 42, scheduled: 45 },
    { hour: '09:00', completed: 58, scheduled: 60 },
    { hour: '10:00', completed: 68, scheduled: 72 },
    { hour: '11:00', completed: 75, scheduled: 78 },
    { hour: '12:00', completed: 62, scheduled: 68 },
    { hour: '13:00', completed: 70, scheduled: 75 },
    { hour: '14:00', completed: 82, scheduled: 85 },
    { hour: '15:00', completed: 76, scheduled: 80 },
    { hour: '16:00', completed: 65, scheduled: 70 },
    { hour: '17:00', completed: 48, scheduled: 52 },
    { hour: '18:00', completed: 32, scheduled: 38 },
    { hour: '19:00', completed: 22, scheduled: 25 },
    { hour: '20:00', completed: 15, scheduled: 18 }
  ];
  
  // Simulate live command center updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimestamp(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Helper functions for status colors and styling
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "optimal":
      case "operational":
        return "bg-emerald-500";
      case "good":
        return "bg-blue-500";
      case "warning":
      case "degraded":
        return "bg-amber-500";
      case "critical":
      case "alert":
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusTextColor = (status: string): string => {
    switch (status) {
      case "optimal":
      case "operational":
        return "text-emerald-500";
      case "good":
        return "text-blue-500";
      case "warning":
      case "degraded":
        return "text-amber-500";
      case "critical":
      case "alert":
        return "text-rose-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBgClass = (status: string): string => {
    switch (status) {
      case "optimal":
      case "operational":
        return "bg-emerald-500/10";
      case "good":
        return "bg-blue-500/10";
      case "warning":
      case "degraded":
        return "bg-amber-500/10";
      case "critical":
      case "alert":
        return "bg-rose-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderTrendIndicator = (trend: string) => {
    const isPositive = trend.startsWith("+");
    const isNeutral = trend === "0%" || trend === "0";
    
    if (isNeutral) {
      return (
        <span className="text-muted-foreground text-xs font-medium">
          No change
        </span>
      );
    }
    
    return (
      <span className={`text-xs font-medium inline-flex items-center ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3 mr-0.5" />
        ) : (
          <ArrowDownRight className="h-3 w-3 mr-0.5" />
        )}
        {trend.replace("+", "")}
      </span>
    );
  };

  const renderProgressBar = (value: number, target: number = 100, isHigherBetter: boolean = true) => {
    const normalizedValue = Math.min(value, 100); // Ensure we don't exceed 100%
    
    let statusClass = "";
    if (isHigherBetter) {
      if (value >= 95) {
        statusClass = "bg-emerald-500";
      } else if (value >= 80) {
        statusClass = "bg-blue-500";
      } else if (value >= 60) {
        statusClass = "bg-amber-500";
      } else {
        statusClass = "bg-rose-500";
      }
    } else {
      if (value <= 20) {
        statusClass = "bg-emerald-500";
      } else if (value <= 40) {
        statusClass = "bg-blue-500";
      } else if (value <= 70) {
        statusClass = "bg-amber-500";
      } else {
        statusClass = "bg-rose-500";
      }
    }
    
    return (
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${statusClass} rounded-full`} 
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    );
  };
  
  // Render status badge
  const renderDeliveryStatusBadge = () => {
    switch(metrics.overallStatus) {
      case "optimal":
        return (
          <Badge className="bg-emerald-500 text-white font-semibold">
            Optimal
          </Badge>
        );
      case "good":
        return (
          <Badge className="bg-blue-500 text-white font-semibold">
            Good
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-500 text-white font-semibold">
            Warning
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-rose-500 text-white font-semibold">
            Critical
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 text-white font-semibold">
            Unknown
          </Badge>
        );
    }
  };
  
  // Initialize loading
  useEffect(() => {
    if (!isDataLoaded) return;
    
    // Remove loading state - directly render charts
    setIsLoading(false);
    
    // Create charts immediately after component mounts
    if (timeframeChartRef.current && !timeframeChartInstance.current) {
      createTimeframeChart();
    }
    
    if (distributionChartRef.current && !distributionChartInstance.current) {
      createDistributionChart();
    }
    
    if (deliveryVolumeChartRef.current && !deliveryVolumeChartInstance.current) {
      createDeliveryVolumeChart();
    }
    
    if (trendsChartRef.current && !trendsChartInstance.current) {
      createTrendsChart();
    }
    
    if (carrierChartRef.current && !carrierChartInstance.current) {
      createCarrierChart();
    }
    
    if (performanceRadarChartRef.current && !performanceRadarChartInstance.current) {
      createPerformanceRadarChart();
    }
    
    if (regionalComparisonChartRef.current && !regionalComparisonChartInstance.current) {
      createRegionalComparisonChart();
    }
    
    return () => {
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
      if (deliveryVolumeChartInstance.current) {
        deliveryVolumeChartInstance.current.destroy();
        deliveryVolumeChartInstance.current = null;
      }
      if (regionalComparisonChartInstance.current) {
        regionalComparisonChartInstance.current.destroy();
        regionalComparisonChartInstance.current = null;
      }
      if (performanceRadarChartInstance.current) {
        performanceRadarChartInstance.current.destroy();
        performanceRadarChartInstance.current = null;
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
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Indigo
          'rgba(124, 58, 237, 0.8)',   // Purple
          'rgba(139, 92, 246, 0.8)',   // Violet
          'rgba(79, 70, 229, 0.8)',    // Indigo darker
          'rgba(16, 185, 129, 0.8)',   // Emerald
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(14, 165, 233, 0.8)',   // Sky
          'rgba(6, 182, 212, 0.8)'     // Cyan
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(124, 58, 237)',
          'rgb(139, 92, 246)',
          'rgb(79, 70, 229)',
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(14, 165, 233)',
          'rgb(6, 182, 212)'
        ],
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
        hoverBorderColor: 'rgb(99, 102, 241)'
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
              color: 'rgba(160, 160, 160, 0.2)' // Light gray that works in both modes
            },
            ticks: {
              color: 'rgba(200, 200, 200, 0.8)' // Light text color for dark mode
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(200, 200, 200, 0.8)' // Light text color for dark mode
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'rgba(200, 200, 200, 0.8)', // Light text for dark mode
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(20, 20, 20, 0.9)', // Dark tooltip background
            titleColor: 'rgba(240, 240, 240, 1)',     // Light title text
            bodyColor: 'rgba(240, 240, 240, 1)',      // Light body text
            borderColor: 'rgba(99, 102, 241, 0.8)',   // Indigo border
            borderWidth: 1,
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
              padding: 15,
              font: {
                size: 11
              }
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
  
  // Create delivery volume chart
  const createDeliveryVolumeChart = () => {
    if (deliveryVolumeChartRef.current && window.ApexCharts) {
      // If there's an existing chart instance, destroy it first
      if (deliveryVolumeChartInstance.current) {
        deliveryVolumeChartInstance.current.destroy();
      }
      
      // Create new ApexCharts instance with the div element
      const options = {
        series: [{
          name: 'Completed',
          data: [423, 465, 512, 387, 425, 489, 523]
        }, {
          name: 'In Transit',
          data: [95, 84, 72, 89, 103, 95, 78]
        }, {
          name: 'Delayed',
          data: [23, 18, 14, 33, 24, 12, 17]
        }],
        chart: {
          type: 'bar',
          height: 300,
          stacked: true,
          toolbar: {
            show: false
          }
        },
        colors: ['#6366f1', '#f59e0b', '#ef4444'],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 2,
            columnWidth: '55%',
          },
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetY: 0
        },
        fill: {
          opacity: 1
        }
      };

      // Create and store the chart instance
      deliveryVolumeChartInstance.current = new window.ApexCharts(deliveryVolumeChartRef.current, options);
      deliveryVolumeChartInstance.current.render();
    }
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
  
  // Create regional comparison chart
  const createRegionalComparisonChart = () => {
    const ctx = regionalComparisonChartRef.current?.getContext('2d');
    if (!ctx) return;
    
    const regions = regionalPerformance.map(r => r.region);
    const onTimeData = regionalPerformance.map(r => r.onTime);
    const volumeData = regionalPerformance.map(r => r.volume);
    
    regionalComparisonChartInstance.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: regions,
        datasets: [
          {
            label: 'On-Time %',
            data: onTimeData,
            backgroundColor: onTimeData.map(val => 
              val >= 95 ? 'hsla(var(--success), 0.7)' : 
              val >= 90 ? 'hsla(var(--primary), 0.7)' : 
              'hsla(var(--warning), 0.7)'
            ),
            borderColor: onTimeData.map(val => 
              val >= 95 ? 'hsl(var(--success))' : 
              val >= 90 ? 'hsl(var(--primary))' : 
              'hsl(var(--warning))'
            ),
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Volume',
            data: volumeData,
            backgroundColor: 'hsla(var(--secondary), 0.5)',
            borderColor: 'hsl(var(--secondary))',
            borderWidth: 1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
            position: 'left',
            min: 85,
            max: 100,
            grid: {
              color: 'hsla(var(--muted), 0.3)'
            },
            ticks: {
              color: 'hsl(var(--foreground))'
            },
            title: {
              display: true,
              text: 'On-Time %',
              color: 'hsl(var(--primary))'
            }
          },
          y1: {
            position: 'right',
            grid: {
              display: false
            },
            ticks: {
              color: 'hsl(var(--foreground))'
            },
            title: {
              display: true,
              text: 'Volume',
              color: 'hsl(var(--secondary))'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              color: 'hsl(var(--foreground))',
              font: {
                size: 11
              }
            }
          }
        }
      }
    });
  };
  
  // Create performance radar chart
  const createPerformanceRadarChart = () => {
    const ctx = performanceRadarChartRef.current?.getContext('2d');
    if (!ctx) return;
    
    // Performance metrics data
    const performanceData = {
      labels: ['On-Time Delivery', 'Customer Satisfaction', 'First Attempt Success', 'Handling Quality', 'Cost Efficiency'],
      datasets: [
        {
          label: 'Current Period',
          data: [94.2, 94.0, 97.1, 92.5, 88.3],
          backgroundColor: 'rgba(99, 102, 241, 0.4)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(99, 102, 241)'
        },
        {
          label: 'Previous Period',
          data: [92.6, 93.2, 96.3, 91.8, 87.5],
          backgroundColor: 'rgba(14, 165, 233, 0.2)',
          borderColor: 'rgb(14, 165, 233)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(14, 165, 233)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(14, 165, 233)'
        }
      ]
    };
    
    performanceRadarChartInstance.current = new window.Chart(ctx, {
      type: 'radar',
      data: performanceData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: false,
            min: 80,
            max: 100,
            ticks: {
              stepSize: 5,
              display: false
            },
            grid: {
              color: 'hsla(var(--muted), 0.3)'
            },
            angleLines: {
              color: 'hsla(var(--muted), 0.3)'
            },
            pointLabels: {
              color: 'hsl(var(--foreground))',
              font: {
                size: 11
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'hsl(var(--foreground))',
              usePointStyle: true,
              boxWidth: 6,
              font: {
                size: 11
              }
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
  
  // Function to calculate total volume with proper typing
  const calculateTotalVolume = (): number => {
    // Since we're using mock data, create a fixed calculation
    return 4527; // Total of all delivery volumes across regions
  };
  
  return (
    <div className="space-y-4" data-component="delivery-performance-matrix">
      {/* Delivery KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On-Time Delivery Rate */}
        <Card>
          <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium p-0">On-Time Delivery</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex justify-between items-baseline mb-2">
              <div className="flex items-baseline">
                <div className={`text-2xl font-bold ${getStatusTextColor(metrics.onTimeDelivery >= 95 ? "optimal" : metrics.onTimeDelivery >= 90 ? "good" : "warning")}`}>
                  {metrics.onTimeDelivery}%
                </div>
                <div className="ml-2">
                  {renderTrendIndicator("+0.8%")}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Target: 95%
              </div>
            </div>
            
            {renderProgressBar(metrics.onTimeDelivery, 95)}
            
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="p-2 bg-muted/10 rounded-md">
                <div className="text-xs text-muted-foreground">Early</div>
                <div className="flex items-baseline">
                  <div className="text-sm font-medium text-emerald-500">{metrics.earlyDeliveries}%</div>
                </div>
              </div>
              <div className="p-2 bg-muted/10 rounded-md">
                <div className="text-xs text-muted-foreground">Late</div>
                <div className="flex items-baseline">
                  <div className="text-sm font-medium text-amber-500">{metrics.lateDeliveries}%</div>
                </div>
              </div>
              <div className="p-2 bg-muted/10 rounded-md">
                <div className="text-xs text-muted-foreground">Failed</div>
                <div className="flex items-baseline">
                  <div className="text-sm font-medium text-rose-500">{metrics.failedDeliveries}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Average Delivery Time */}
        <Card>
          <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium p-0">Delivery Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex justify-between items-baseline mb-2">
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{metrics.avgDeliveryTime}</div>
                <div className="ml-2">
                  {renderTrendIndicator("-5m")}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                From pickup to delivery
              </div>
            </div>
            
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted/10 rounded-md">
                  <div className="text-xs text-muted-foreground">Pickup to Transit</div>
                  <div className="text-sm font-medium">38m avg.</div>
                </div>
                <div className="p-2 bg-muted/10 rounded-md">
                  <div className="text-xs text-muted-foreground">Transit Time</div>
                  <div className="text-sm font-medium">1h 42m avg.</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted/10 rounded-md">
                  <div className="text-xs text-muted-foreground">Delivery Time</div>
                  <div className="text-sm font-medium">18m avg.</div>
                </div>
                <div className="p-2 bg-muted/10 rounded-md">
                  <div className="text-xs text-muted-foreground">Delay Time</div>
                  <div className="text-sm font-medium">{metrics.avgDelayTime} avg.</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Delivery Attempts */}
        <Card>
          <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium p-0">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex justify-between items-baseline mb-2">
              <div className="flex items-baseline">
                <div className={`text-2xl font-bold ${getStatusTextColor("optimal")}`}>
                  {metrics.firstAttemptSuccess}%
                </div>
                <div className="ml-2">
                  {renderTrendIndicator("+0.8%")}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                First attempt delivery
              </div>
            </div>
            
            {renderProgressBar(metrics.firstAttemptSuccess)}
            
            <div className="p-2 bg-muted/10 rounded-md mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">Avg. Attempts</div>
                  <div className="text-sm font-medium">{metrics.deliveryAttempts}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Failed Deliveries</div>
                  <div className="text-sm font-medium">{metrics.failedDeliveries}%</div>
                </div>
              </div>
            </div>
            
            <div className="p-2 bg-emerald-500/10 rounded-md mt-2">
              <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Zap className="h-3.5 w-3.5 mr-1" />
                <span>Above Target</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                First attempt success rate exceeds target of 95%
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Satisfaction */}
        <Card>
          <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium p-0">Customer Satisfaction</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex justify-between items-baseline mb-2">
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">{metrics.customerSatisfaction}/5</div>
                <div className="ml-2">
                  {renderTrendIndicator("+0.1")}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Based on delivery feedback
              </div>
            </div>
            
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
            
            <div className="grid grid-cols-3 gap-1 text-center text-xs mt-3">
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
          </CardContent>
        </Card>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column - Delivery Volume Chart */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex flex-col space-y-1">
              <CardTitle className="text-lg font-semibold">Daily Delivery Volume</CardTitle>
              <CardDescription>Performance across regions and carriers</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="daily">
                <SelectTrigger className="w-32 text-xs">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div ref={deliveryVolumeChartRef} className="h-[300px] w-full" />
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium">{calculateTotalVolume().toLocaleString()} Deliveries</div>
                <div className="text-xs text-muted-foreground">Total volume across all regions</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-xs">In Transit</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-xs">Delayed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right Column - Live Alerts */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex flex-col space-y-1">
              <CardTitle className="text-lg font-semibold">Delivery Performance Analysis</CardTitle>
              <CardDescription>Key metrics and insights</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* On-Time Delivery Rate */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">On-Time Delivery Rate</span>
                  <div className="flex items-center text-xs font-medium text-emerald-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    1.2%
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-bold">94.2%</span>
                  <span className="text-xs text-muted-foreground">Target: 95%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${94.2}%` }}
                  />
                </div>
              </div>
              
              {/* Average Delivery Time */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">Average Delivery Time</span>
                  <div className="flex items-center text-xs font-medium text-emerald-500">
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    5m
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-bold">1h 24m</span>
                  <span className="text-xs text-muted-foreground">Target: 1h 30m</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(84/90) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* First Attempt Success */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">First Attempt Success</span>
                  <div className="flex items-center text-xs font-medium text-emerald-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    0.8%
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-bold">92.5%</span>
                  <span className="text-xs text-muted-foreground">Target: 90%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(92.5/90) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Customer Satisfaction */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <div className="flex items-center text-xs font-medium text-emerald-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    0.1
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-bold">4.6/5</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-3 w-3 ${star <= Math.floor(4.6) ? 'fill-yellow-500 text-yellow-500' : 
                                             star === Math.ceil(4.6) && star > Math.floor(4.6) ? 'fill-yellow-500/50 text-yellow-500/50' : 
                                             'text-muted'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${(4.6/5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delivery Performance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance Metrics */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex flex-col space-y-1">
              <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
              <CardDescription>Last 30 days summary</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-0">Last 30 Days</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-5">
              {/* On-Time Delivery */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">On-Time Delivery</span>
                  <div className="flex items-center text-xs font-medium text-emerald-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    0.8%
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-bold">{metrics.onTimeDelivery}%</span>
                  <span className="text-xs text-muted-foreground">Target: 95%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${metrics.onTimeDelivery}%` }}
                  />
                </div>
              </div>
              
              {/* First Attempt Success */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">First Attempt Success</span>
                  <div className="flex items-center text-xs font-medium text-rose-500">
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    0.2%
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-bold">{metrics.firstAttemptSuccess}%</span>
                  <span className="text-xs text-muted-foreground">Target: 98%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${metrics.firstAttemptSuccess}%` }}
                  />
                </div>
              </div>
              
              {/* Delivery Time */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">Avg. Delivery Time</span>
                  <div className="flex items-center text-xs font-medium text-rose-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    8m
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-bold">{metrics.avgDeliveryTime}</span>
                  <span className="text-xs text-muted-foreground">Target: 2h 30m</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: "75%" }}
                  />
                </div>
              </div>
            </div>
            
            {/* Delivery Status Breakdown */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Delivery Status Breakdown</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/20 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-sm">On Time</span>
                  </div>
                  <span className="text-xl font-bold">{metrics.onTimeDelivery}%</span>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Early</span>
                  </div>
                  <span className="text-xl font-bold">{metrics.earlyDeliveries}%</span>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm">Late</span>
                  </div>
                  <span className="text-xl font-bold">{metrics.lateDeliveries}%</span>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
                    <span className="text-sm">Failed</span>
                  </div>
                  <span className="text-xl font-bold">{metrics.failedDeliveries}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Delivery Performance Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex flex-col space-y-1">
              <CardTitle className="text-lg font-semibold">Delivery Performance Analysis</CardTitle>
              <CardDescription>Time distribution and regional metrics</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="time">
                <SelectTrigger className="w-[130px] text-xs">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time Distribution</SelectItem>
                  <SelectItem value="status">Status Distribution</SelectItem>
                  <SelectItem value="region">Regional Performance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Main Chart */}
              <div className="h-[280px]">
                <canvas ref={timeframeChartRef} className="w-full h-full" />
              </div>
              
              {/* Regional Performance */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Regional Performance</h3>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                    View All
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {regionalPerformance.map((region) => (
                    <Card key={region.region} className="border-0 shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{region.region}</span>
                          <Badge 
                            variant="outline" 
                            className={`${
                              region.onTime >= 95 ? 'bg-emerald-500/10 text-emerald-500' : 
                              region.onTime >= 90 ? 'bg-blue-500/10 text-blue-500' : 
                              'bg-amber-500/10 text-amber-500'
                            } border-0 text-xs`}
                          >
                            {region.onTime}%
                          </Badge>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                          <div 
                            className={`h-full ${
                              region.onTime >= 95 ? 'bg-emerald-500' : 
                              region.onTime >= 90 ? 'bg-blue-500' : 
                              'bg-amber-500'
                            } rounded-full`}
                            style={{ width: `${region.onTime}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{region.volume.toLocaleString()} packages</span>
                          <div className="flex items-center">
                            {region.onTime >= regionalPerformance[2].onTime ? (
                              <span className="text-emerald-500 flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                2.1%
                              </span>
                            ) : (
                              <span className="text-rose-500 flex items-center">
                                <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                1.8%
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Key Insights */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="flex items-center text-sm font-medium">
                    <Clock className="h-4 w-4 mr-1.5 text-primary" />
                    Peak Delivery Time
                  </div>
                  <div className="mt-1 text-xl font-bold">14:00-15:00</div>
                  <div className="text-xs text-muted-foreground">82 deliveries (highest)</div>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="flex items-center text-sm font-medium">
                    <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" />
                    Delayed Hotspot
                  </div>
                  <div className="mt-1 text-xl font-bold">Northeast</div>
                  <div className="text-xs text-muted-foreground">8.2% late delivery rate</div>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="flex items-center text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1.5 text-emerald-500" />
                    Most Improved
                  </div>
                  <div className="mt-1 text-xl font-bold">West Region</div>
                  <div className="text-xs text-muted-foreground">+2.8% on-time performance</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}