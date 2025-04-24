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
  Truck as TruckIcon2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const deliveryVolumeChartRef = useRef<HTMLCanvasElement | null>(null);
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
    const ctx = deliveryVolumeChartRef.current?.getContext('2d');
    if (!ctx) return;
    
    const labels = dailyDeliveryVolume.map(d => d.hour);
    const completedData = dailyDeliveryVolume.map(d => d.completed);
    const scheduledData = dailyDeliveryVolume.map(d => d.scheduled);
    
    deliveryVolumeChartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Completed',
            data: completedData,
            borderColor: 'hsl(var(--primary))',
            backgroundColor: 'hsla(var(--primary), 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          },
          {
            label: 'Scheduled',
            data: scheduledData,
            borderColor: 'rgb(14, 165, 233)',
            borderDash: [3, 3],
            borderWidth: 2,
            tension: 0.3,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 6,
              color: 'hsl(var(--foreground))',
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'hsl(var(--foreground))',
              maxRotation: 0,
              autoSkip: true,
              autoSkipPadding: 20,
              font: {
                size: 10
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              color: 'hsl(var(--foreground))'
            },
            grid: {
              color: 'hsla(var(--muted), 0.2)'
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
  
  return (
    <div className="space-y-4" data-component="delivery-performance-matrix">
      {/* Command Header Bar */}
      <div className="bg-card rounded-lg p-3 flex items-center justify-between shadow-sm border border-border">
        <div className="flex items-center gap-3">
          <div className="flex-1 text-right text-xs text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">Status: </span>
              {renderDeliveryStatusBadge()}
            </div>
            <div className="text-[10px] font-mono">
              Last Updated: {timestamp.toLocaleTimeString()}
            </div>
          </div>
          
          <Select defaultValue={trendsTimeframe} onValueChange={(value) => setTrendsTimeframe(value as any)}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Delivery KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On-Time Delivery Rate */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="bg-muted/20 p-3 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            </div>
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
        <Card className="shadow-sm border border-border">
          <CardHeader className="bg-muted/20 p-3 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">Delivery Time</CardTitle>
            </div>
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
        <Card className="shadow-sm border border-border">
          <CardHeader className="bg-muted/20 p-3 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </div>
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
        <Card className="shadow-sm border border-border">
          <CardHeader className="bg-muted/20 p-3 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            </div>
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
        <Card className="xl:col-span-2 shadow-sm border border-border">
          <CardHeader className="bg-muted/20 p-3 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">Daily Delivery Volume</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs text-muted-foreground">Completed</span>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-muted-foreground">Scheduled</span>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <div className="h-[280px]">
              <canvas ref={deliveryVolumeChartRef} className="w-full h-full" />
            </div>
            
            {/* Key insights */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="p-2 bg-muted/10 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">Active Shipments</div>
                  <Badge className="text-[10px]" variant="secondary">Now</Badge>
                </div>
                <div className="text-lg font-medium mt-1">{metrics.activeShipments}</div>
              </div>
              <div className="p-2 bg-muted/10 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">Completed Today</div>
                  <Badge className="text-[10px]" variant="secondary">Today</Badge>
                </div>
                <div className="text-lg font-medium mt-1">{metrics.completedToday}</div>
              </div>
              <div className="p-2 bg-muted/10 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">Peak Hour</div>
                  <Badge className="text-[10px]" variant="secondary">Today</Badge>
                </div>
                <div className="text-lg font-medium mt-1">14:00-15:00</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right Column - Live Alerts */}
        <Card className="xl:col-span-1 shadow-sm border border-border">
          <CardHeader className="bg-muted/20 p-3 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">Live Delivery Alerts</CardTitle>
            </div>
            <Badge variant={liveDeliveryAlerts.some(a => a.severity === "critical") ? "destructive" : "outline"} className="text-[10px]">
              {liveDeliveryAlerts.length} Active
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[290px] overflow-y-auto">
              <div className="p-2 bg-card/60">
                {liveDeliveryAlerts.map((alert, i) => (
                  <div key={i} className="mb-2 last:mb-0 p-2 bg-muted/10 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-xs flex items-center">
                        {getAlertIcon(alert.severity)}
                        <span className="ml-1">{alert.id}</span>
                      </div>
                      <Badge variant={
                        alert.severity === "critical" ? "destructive" : 
                        alert.severity === "warning" ? "default" : 
                        "secondary"
                      } className="text-[10px] py-0 px-1.5 h-4">
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="text-sm">{alert.alert}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
                      <span>{alert.location}</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                ))}
                
                <div className="p-2 mt-3 border-t border-border/30 pt-3">
                  <h4 className="text-xs font-medium mb-2">Status Summary</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted/10 rounded-md">
                      <div className="text-xs text-muted-foreground">In Transit</div>
                      <div className="text-sm font-medium">184</div>
                    </div>
                    <div className="p-2 bg-muted/10 rounded-md">
                      <div className="text-xs text-muted-foreground">Out for Delivery</div>
                      <div className="text-sm font-medium">64</div>
                    </div>
                    <div className="p-2 bg-muted/10 rounded-md">
                      <div className="text-xs text-muted-foreground">Pending Pickup</div>
                      <div className="text-sm font-medium">37</div>
                    </div>
                    <div className="p-2 bg-muted/10 rounded-md">
                      <div className="text-xs text-muted-foreground">Delayed</div>
                      <div className="text-sm font-medium text-amber-500">12</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delivery Performance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance Metrics */}
        <Card className="lg:col-span-1 shadow-sm border border-border">
          <CardHeader className="bg-muted/20 p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
              <Badge variant="outline" className="text-[10px]">Last 30 Days</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* On-Time Delivery */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>On-Time Delivery</span>
                  <span className="font-medium">{metrics.onTimeDelivery}%</span>
                </div>
                <Progress value={metrics.onTimeDelivery} max={100} className="h-2" />
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>Target: 95%</span>
                  <div className="flex items-center text-emerald-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    <span>0.8%</span>
                  </div>
                </div>
              </div>
              
              {/* First Attempt Success */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>First Attempt Success</span>
                  <span className="font-medium">{metrics.firstAttemptSuccess}%</span>
                </div>
                <Progress value={metrics.firstAttemptSuccess} max={100} className="h-2" />
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>Target: 98%</span>
                  <div className="flex items-center text-rose-500">
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    <span>0.2%</span>
                  </div>
                </div>
              </div>
              
              {/* Delivery Time */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Avg. Delivery Time</span>
                  <span className="font-medium">{metrics.avgDeliveryTime}</span>
                </div>
                <Progress value={75} max={100} className="h-2" />
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>Target: 2h 30m</span>
                  <div className="flex items-center text-rose-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    <span>8m</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Delivery Status Breakdown</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-sm">On Time</span>
                  </div>
                  <span className="text-sm font-medium">{metrics.onTimeDelivery}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Early</span>
                  </div>
                  <span className="text-sm font-medium">{metrics.earlyDeliveries}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm">Late</span>
                  </div>
                  <span className="text-sm font-medium">{metrics.lateDeliveries}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
                    <span className="text-sm">Failed</span>
                  </div>
                  <span className="text-sm font-medium">{metrics.failedDeliveries}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Delivery Time Distribution */}
        <Card className="lg:col-span-2 shadow-sm border border-border">
          <CardHeader className="bg-muted/20 p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Delivery Performance Analysis</CardTitle>
              <div className="flex items-center space-x-2">
                <Select defaultValue="time">
                  <SelectTrigger className="h-7 w-[140px] text-xs">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Time Distribution</SelectItem>
                    <SelectItem value="status">Status Distribution</SelectItem>
                    <SelectItem value="region">Regional Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-6">
              {/* Main Chart */}
              <div className="h-[280px] relative">
                <canvas ref={timeframeChartRef} className="w-full h-full" />
              </div>
              
              {/* Regional Performance */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Regional Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {regionalPerformance.map((region) => (
                    <div key={region.region} className="p-2 bg-muted/10 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{region.region}</span>
                        <Badge variant={region.onTime >= 95 ? "success" : region.onTime >= 90 ? "outline" : "destructive"} className="text-[10px]">
                          {region.onTime}%
                        </Badge>
                      </div>
                      <Progress 
                        value={region.onTime} 
                        max={100} 
                        className={`h-1 mt-2 ${
                          region.onTime >= 95 
                            ? "bg-success" 
                            : region.onTime >= 90 
                              ? "bg-primary" 
                              : "bg-destructive"
                        }`}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {region.volume} packages
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Key Insights */}
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-muted/10 rounded-md">
                <div className="flex items-center text-sm font-medium">
                  <Clock className="h-4 w-4 mr-1.5 text-primary" />
                  Peak Delivery Time
                </div>
                <div className="mt-1 text-xl font-bold">14:00-15:00</div>
                <div className="text-xs text-muted-foreground">Highest volume: 82 deliveries</div>
              </div>
              
              <div className="p-3 bg-muted/10 rounded-md">
                <div className="flex items-center text-sm font-medium">
                  <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" />
                  Delayed Hotspot
                </div>
                <div className="mt-1 text-xl font-bold">Northeast</div>
                <div className="text-xs text-muted-foreground">8.2% late delivery rate</div>
              </div>
              
              <div className="p-3 bg-muted/10 rounded-md">
                <div className="flex items-center text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1.5 text-emerald-500" />
                  Most Improved
                </div>
                <div className="mt-1 text-xl font-bold">West Region</div>
                <div className="text-xs text-muted-foreground">+2.8% on-time performance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Command Center Footer */}
      <div className="bg-card rounded-lg flex items-center justify-between p-2 text-xs text-muted-foreground border border-border">
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>
            <span>Delivery System Online</span>
          </div>
          <div className="flex items-center">
            <Package className="h-3.5 w-3.5 mr-1" />
            <span>Active Shipments: {metrics.activeShipments}</span>
          </div>
          <div className="flex items-center">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            <span>Open Alerts: {metrics.alertCount}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Command className="h-3.5 w-3.5 mr-1" />
          <span className="font-mono">DELIVERY CONTROL v1.2.8</span>
        </div>
      </div>
    </div>
  );
}