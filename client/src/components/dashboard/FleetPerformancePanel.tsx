import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { fleetData } from "@/data/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Timer,
  User,
  Award,
  TrendingUp,
  Gauge,
  ActivitySquare,
  BarChart3,
  LineChart,
  RotateCw,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  ShieldAlert,
  Settings,
  Route,
  PieChart,
  HelpCircle,
  Phone,
  MessageCircle,
  Headphones,
  Command,
  Terminal,
  FileWarning
} from "lucide-react";

interface FleetPerformanceProps {
  isDataLoaded: boolean;
  period: string;
}

export default function FleetPerformancePanel({ isDataLoaded, period }: FleetPerformanceProps) {
  const [view, setView] = useState<"dashboard" | "fleet" | "drivers">("dashboard");
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "quarter">("week");
  const [isLoading, setIsLoading] = useState(true);
  const fleetChartRef = useRef<HTMLCanvasElement | null>(null);
  const driverChartRef = useRef<HTMLCanvasElement | null>(null);
  const maintenanceChartRef = useRef<HTMLCanvasElement | null>(null);
  const incidentChartRef = useRef<HTMLCanvasElement | null>(null);
  const fleetChartInstance = useRef<any>(null);
  const driverChartInstance = useRef<any>(null);
  const maintenanceChartInstance = useRef<any>(null);
  const incidentChartInstance = useRef<any>(null);
  
  // Timestamp for "live" updates
  const [timestamp, setTimestamp] = useState(new Date());
  const [fleetMetrics, setFleetMetrics] = useState(fleetData);
  
  // Mock fleet performance metrics with additional command center data
  const fleetPerformanceMetrics = {
    overallStatus: "operational", // operational, degraded, alert
    summary: {
      totalVehicles: fleetMetrics.summary.totalVehicles,
      activeVehicles: fleetMetrics.summary.activeVehicles,
      inMaintenance: fleetMetrics.summary.inMaintenance,
      outOfService: fleetMetrics.summary.outOfService,
      activePercentage: fleetMetrics.summary.activePercentage,
      maintenancePercentage: fleetMetrics.summary.maintenancePercentage,
      alertCount: 4,
      criticalAlerts: 1,
      anomaliesDetected: 2
    },
    utilization: {
      rate: 87.5,
      trend: "+2.3%",
      status: "optimal", // optimal, good, warning, critical
      idleTime: 8.2,
      idleTimeTrend: "-1.4%",
      peakHours: "14:00-16:00",
      lowHours: "01:00-04:00",
      targetUtilization: 90.0,
      utilizationByType: [
        { type: "Heavy Trucks", utilization: 92 },
        { type: "Medium Trucks", utilization: 88 },
        { type: "Delivery Vans", utilization: 83 },
        { type: "Refrigerated", utilization: 91 },
        { type: "Special", utilization: 76 }
      ]
    },
    maintenance: {
      compliance: 94.2,
      trend: "+0.8%",
      status: "good",
      scheduled: fleetMetrics.maintenanceSchedule.filter(m => m.status === "scheduled").length,
      inProgress: fleetMetrics.maintenanceSchedule.filter(m => m.status === "in-progress").length,
      completed: fleetMetrics.maintenanceSchedule.filter(m => m.status === "completed").length,
      averageCost: 347.82,
      averageDowntime: "3.2 hours",
      predictiveMaintenance: {
        vehiclesAtRisk: 3,
        estimatedSavings: "$4,580",
        nextScheduled: fleetMetrics.upcoming[0] || null
      }
    },
    fuelEfficiency: {
      overall: 7.8, // MPG
      trend: "+0.3 MPG",
      status: "good",
      byVehicleType: [
        { type: "Heavy Trucks", mpg: 5.2 },
        { type: "Medium Trucks", mpg: 8.4 },
        { type: "Delivery Vans", mpg: 12.6 },
        { type: "Refrigerated", mpg: 6.8 },
        { type: "Special", mpg: 5.9 }
      ],
      totalConsumption: "12,480 gallons",
      totalCost: "$43,680",
      mostEfficientRoute: "LA to Phoenix",
      leastEfficientRoute: "Seattle to Portland (mountainous)"
    },
    safety: {
      incidentRate: 0.5, // per 100,000 miles
      trend: "-0.2",
      status: "optimal",
      incidents: {
        total: 3,
        minor: 2,
        major: 1,
        preventable: 2,
        nonPreventable: 1
      },
      riskAssessment: {
        highRiskDrivers: 2,
        highRiskVehicles: 1,
        highRiskRoutes: 3
      }
    }
  };
  
  // Mock driver performance metrics for command center
  const driverPerformanceMetrics = {
    overallStatus: "optimal", // optimal, good, warning, critical
    summary: {
      totalDrivers: 56,
      activeDrivers: 48,
      onBreak: 5,
      offDuty: 3,
      activePercentage: 85.7,
      alertCount: 2,
      anomaliesDetected: 1
    },
    performance: {
      overallScore: 92,
      trend: "+1.5",
      status: "optimal",
      categories: [
        { name: "Safety", score: 94, trend: "+2.1" },
        { name: "Delivery Time", score: 91, trend: "+0.8" },
        { name: "Customer Service", score: 93, trend: "+1.2" },
        { name: "Vehicle Handling", score: 89, trend: "+0.5" },
        { name: "Protocol Adherence", score: 95, trend: "+2.3" }
      ],
      topDrivers: [
        { id: "D-112", name: "John Miller", score: 98, trips: 42, status: "active" },
        { id: "D-087", name: "Sarah Johnson", score: 96, trips: 38, status: "active" },
        { id: "D-054", name: "David Chen", score: 95, trips: 45, status: "break" }
      ],
      improvementNeeded: [
        { id: "D-023", name: "Mark Wilson", score: 72, trips: 28, status: "active", issues: ["safety", "time"] },
        { id: "D-091", name: "Anna Garcia", score: 75, trips: 32, status: "active", issues: ["handling", "safety"] }
      ]
    },
    safety: {
      score: 92,
      trend: "+2.3",
      status: "optimal",
      incidents: {
        total: 2,
        nearMisses: 5,
        hardBraking: 12,
        rapidAcceleration: 8,
        speeding: 7
      },
      trainingCompliance: 97.5,
      certificationStatus: 100
    },
    productivity: {
      deliveriesPerHour: 2.8,
      trend: "+0.2",
      status: "good", 
      onTimePercentage: 94.5,
      earlyDeliveries: 12,
      lateDeliveries: 8,
      averageDelay: 8.2,
      averageLoadTime: 24.5,
      averageUnloadTime: 18.3
    },
    training: {
      completed: 43,
      inProgress: 8,
      scheduled: 5,
      complianceRate: 96.8,
      modules: [
        { name: "Safety Refresher", completion: 98.2 },
        { name: "Eco-driving", completion: 92.5 },
        { name: "Customer Service", completion: 95.7 },
        { name: "New Route Training", completion: 88.4 },
        { name: "Vehicle Handling", completion: 94.2 }
      ]
    }
  };
  
  // Live fleet status - vehicles requiring attention
  const liveFleetAlerts = [
    { id: "T-248", type: "Heavy Truck", alert: "Check Engine Light", severity: "warning", time: "10 min ago", location: "I-5 North, mile 78" },
    { id: "V-427", type: "Delivery Van", alert: "Low Tire Pressure", severity: "info", time: "25 min ago", location: "Downtown Seattle" },
    { id: "T-250", type: "Heavy Truck", alert: "Engine Overheating", severity: "critical", time: "8 min ago", location: "I-90 East, mile 42" },
    { id: "T-252", type: "Medium Truck", alert: "Fuel Level Critical", severity: "warning", time: "15 min ago", location: "Route 405, exit 22" }
  ];
  
  // Live driver alerts
  const liveDriverAlerts = [
    { id: "D-076", name: "Kevin Zhang", alert: "Extended Break Time", severity: "info", time: "18 min ago", location: "Rest Stop 24, I-5" },
    { id: "D-044", name: "Maria Rodriguez", alert: "Speeding Alert", severity: "warning", time: "7 min ago", location: "Highway 99, mile 134" },
    { id: "D-023", name: "Mark Wilson", alert: "Hard Braking Incident", severity: "warning", time: "12 min ago", location: "Downtown Portland" }
  ];
  
  // Timepoint utilization data for charts
  const utilizationData = [
    { time: '00:00', trucks: 45, vans: 52, total: 48 },
    { time: '01:00', trucks: 42, vans: 48, total: 44 },
    { time: '02:00', trucks: 40, vans: 45, total: 42 },
    { time: '03:00', trucks: 38, vans: 41, total: 39 },
    { time: '04:00', trucks: 38, vans: 41, total: 39 },
    { time: '05:00', trucks: 42, vans: 44, total: 42 },
    { time: '06:00', trucks: 48, vans: 52, total: 49 },
    { time: '07:00', trucks: 58, vans: 62, total: 60 },
    { time: '08:00', trucks: 65, vans: 79, total: 70 },
    { time: '09:00', trucks: 75, vans: 82, total: 78 },
    { time: '10:00', trucks: 80, vans: 84, total: 82 },
    { time: '11:00', trucks: 85, vans: 86, total: 85 },
    { time: '12:00', trucks: 88, vans: 85, total: 87 },
    { time: '13:00', trucks: 90, vans: 88, total: 89 },
    { time: '14:00', trucks: 92, vans: 91, total: 92 },
    { time: '15:00', trucks: 92, vans: 94, total: 92 },
    { time: '16:00', trucks: 92, vans: 94, total: 93 },
    { time: '17:00', trucks: 91, vans: 92, total: 92 },
    { time: '18:00', trucks: 85, vans: 88, total: 86 },
    { time: '19:00', trucks: 75, vans: 82, total: 78 },
    { time: '20:00', trucks: 68, vans: 76, total: 71 },
    { time: '21:00', trucks: 62, vans: 68, total: 64 },
    { time: '22:00', trucks: 55, vans: 60, total: 57 },
    { time: '23:00', trucks: 48, vans: 55, total: 50 }
  ];
  
  // Monthly fuel efficiency data
  const fuelEfficiencyData = [
    { month: 'Jan', mpg: 7.4, cost: 24560 },
    { month: 'Feb', mpg: 7.3, cost: 25420 },
    { month: 'Mar', mpg: 7.5, cost: 23980 },
    { month: 'Apr', mpg: 7.6, cost: 22760 },
    { month: 'May', mpg: 7.8, cost: 21840 },
    { month: 'Jun', mpg: 8.0, cost: 21250 },
    { month: 'Jul', mpg: 8.1, cost: 20640 },
    { month: 'Aug', mpg: 8.0, cost: 20980 },
    { month: 'Sep', mpg: 7.9, cost: 25340 },
    { month: 'Oct', mpg: 7.7, cost: 22450 },
    { month: 'Nov', mpg: 7.6, cost: 23120 },
    { month: 'Dec', mpg: 7.4, cost: 24890 }
  ];
  
  // Maintenance history data
  const maintenanceHistoryData = [
    { month: 'Jan', preventive: 18, reactive: 7, cost: 34290 },
    { month: 'Feb', preventive: 16, reactive: 8, cost: 35680 },
    { month: 'Mar', preventive: 22, reactive: 6, cost: 32450 },
    { month: 'Apr', preventive: 20, reactive: 5, cost: 30120 },
    { month: 'May', preventive: 24, reactive: 5, cost: 29840 },
    { month: 'Jun', preventive: 26, reactive: 4, cost: 28560 },
    { month: 'Jul', preventive: 28, reactive: 3, cost: 27240 },
    { month: 'Aug', preventive: 25, reactive: 4, cost: 28750 },
    { month: 'Sep', preventive: 24, reactive: 4, cost: 29240 },
    { month: 'Oct', preventive: 22, reactive: 5, cost: 30680 },
    { month: 'Nov', preventive: 18, reactive: 6, cost: 32450 },
    { month: 'Dec', preventive: 20, reactive: 6, cost: 31890 }
  ];
  
  // Safety incident data
  const safetyIncidentData = [
    { month: 'Jan', minor: 2, major: 1, rate: 0.7 },
    { month: 'Feb', minor: 3, major: 0, rate: 0.8 },
    { month: 'Mar', minor: 1, major: 1, rate: 0.6 },
    { month: 'Apr', minor: 2, major: 0, rate: 0.5 },
    { month: 'May', minor: 1, major: 0, rate: 0.3 },
    { month: 'Jun', minor: 0, major: 1, rate: 0.4 },
    { month: 'Jul', minor: 1, major: 0, rate: 0.2 },
    { month: 'Aug', minor: 2, major: 0, rate: 0.5 },
    { month: 'Sep', minor: 1, major: 0, rate: 0.3 },
    { month: 'Oct', minor: 1, major: 1, rate: 0.6 },
    { month: 'Nov', minor: 2, major: 0, rate: 0.5 },
    { month: 'Dec', minor: 2, major: 0, rate: 0.5 }
  ];
  
  // Compute additional fleet metrics
  const totalMilesDriven = 124890;
  const avgMilesPerVehicle = Math.round(totalMilesDriven / fleetMetrics.summary.totalVehicles);
  const fuelEfficiency = 7.8; // MPG
  const maintenanceCost = 347.82; // $ per vehicle per month
  const idleTime = 8.2; // % of total time
  const maintenanceComplianceRate = 94.2; // percentage
  
  // Mock driver metrics data
  const driverMetrics = {
    summary: {
      totalDrivers: 56,
      activeDrivers: 48,
      onBreak: 5,
      offDuty: 3,
      newDrivers: 2,
      activePercentage: 85.7,
      breakPercentage: 8.9,
      offDutyPercentage: 5.4
    },
    status: {
      active: 48,
      break: 5,
      offDuty: 3,
    },
    changes: {
      active: "+2 from yesterday",
      break: "+1 from yesterday",
      offDuty: "-3 from yesterday",
    },
    safety: {
      safetyScore: 92,
      incidents: 2,
      nearMisses: 5,
      hardBraking: 12,
      rapidAcceleration: 8
    },
    timekeeping: {
      onTimePercentage: 94.5,
      averageDelay: 8.2, // minutes
      earlyArrivals: 12,
      lateArrivals: 8
    },
    performance: {
      topDrivers: [
        { id: "D-112", name: "John Miller", score: 98, trips: 42 },
        { id: "D-087", name: "Sarah Johnson", score: 96, trips: 38 },
        { id: "D-054", name: "David Chen", score: 95, trips: 45 }
      ],
      improvementNeeded: [
        { id: "D-023", name: "Mark Wilson", score: 72, trips: 28 },
        { id: "D-091", name: "Anna Garcia", score: 75, trips: 32 }
      ]
    },
    training: [
      {
        driverId: "D-023",
        trainingType: "Safety refresher",
        scheduledDate: "Aug 18, 2023",
        status: "scheduled",
        priority: "high"
      },
      {
        driverId: "D-091",
        trainingType: "Eco-driving techniques",
        scheduledDate: "Aug 21, 2023",
        status: "scheduled",
        priority: "medium"
      },
      {
        driverId: "D-045",
        trainingType: "Customer service",
        scheduledDate: "Aug 14, 2023",
        status: "in-progress",
        priority: "medium"
      },
      {
        driverId: "D-078",
        trainingType: "New route familiarization",
        scheduledDate: "Aug 10, 2023",
        status: "completed",
        priority: "low"
      }
    ],
    upcoming: [
      {
        id: "D-023",
        type: "Training",
        service: "Safety refresher",
        date: "Aug 18",
      },
      {
        id: "D-091",
        type: "Training",
        service: "Eco-driving",
        date: "Aug 21",
      },
    ]
  };
  
  // Compute additional driver metrics
  const totalDeliveries = 1248;
  const avgDeliveriesPerDriver = Math.round(totalDeliveries / driverMetrics.summary.totalDrivers);
  const avgSatisfactionScore = 4.7; // out of 5
  const driverFuelEfficiencyScore = 86; // percentage
  const complianceRate = 98.2; // percentage
  
  // Simulate live command center updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimestamp(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Initialize loading
  useEffect(() => {
    if (!isDataLoaded) return;
    
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isDataLoaded, view, timeRange]);
  
  // Create charts
  useEffect(() => {
    if (!isDataLoaded || isLoading) return;
    
    // Create fleet composition chart
    if (fleetChartRef.current && window.Chart && !fleetChartInstance.current) {
      const ctx = fleetChartRef.current.getContext('2d');
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
      
      fleetChartInstance.current = new window.Chart(ctx, {
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
    
    // Create driver radar chart
    if (driverChartRef.current && window.Chart && !driverChartInstance.current) {
      const ctx = driverChartRef.current.getContext('2d');
      if (!ctx) return;
      
      // Sample data for different performance metrics
      const performanceData = {
        labels: driverPerformanceMetrics.performance.categories.map(c => c.name),
        datasets: [
          {
            label: 'Current Period',
            data: driverPerformanceMetrics.performance.categories.map(c => c.score),
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
            data: driverPerformanceMetrics.performance.categories.map(c => {
              const trendValue = parseFloat(c.trend.replace("+", ""));
              return c.score - trendValue;
            }),
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
      
      driverChartInstance.current = new window.Chart(ctx, {
        type: 'radar',
        data: performanceData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              min: 70,
              max: 100,
              ticks: {
                stepSize: 10,
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
                boxWidth: 6
              }
            },
            tooltip: {
              callbacks: {
                label: function(context: { dataset: { label: string }, raw: number }) {
                  return `${context.dataset.label}: ${context.raw}`;
                }
              }
            }
          }
        }
      });
    }
    
    return () => {
      if (fleetChartInstance.current) {
        fleetChartInstance.current.destroy();
        fleetChartInstance.current = null;
      }
      if (driverChartInstance.current) {
        driverChartInstance.current.destroy();
        driverChartInstance.current = null;
      }
      if (maintenanceChartInstance.current) {
        maintenanceChartInstance.current.destroy();
        maintenanceChartInstance.current = null;
      }
      if (incidentChartInstance.current) {
        incidentChartInstance.current.destroy();
        incidentChartInstance.current = null;
      }
    };
  }, [isDataLoaded, isLoading, period, view, timeRange]);
  
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
        return <FileWarning className="h-4 w-4 text-rose-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
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
  
  // Render status badges
  const renderFleetStatusBadge = () => {
    switch(fleetPerformanceMetrics.overallStatus) {
      case "operational":
        return (
          <Badge className="bg-emerald-500 text-white font-semibold">
            Operational
          </Badge>
        );
      case "degraded":
        return (
          <Badge className="bg-amber-500 text-white font-semibold">
            Degraded
          </Badge>
        );
      case "alert":
        return (
          <Badge className="bg-rose-500 text-white font-semibold">
            Alert
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
  
  // Render driver status badge
  const renderDriverStatusBadge = () => {
    switch(driverPerformanceMetrics.overallStatus) {
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

  // Render dashboard overview
  const renderCommandCenter = () => {
    return (
      <div className="space-y-4">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fleet Status Panel */}
          <Card>
            <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium p-0">Fleet Status</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <div className="grid grid-cols-3 gap-3 mb-2">
                <div className="flex flex-col items-center justify-center p-2 bg-muted/10 rounded-md">
                  <div className="text-2xl font-bold">{fleetPerformanceMetrics.summary.totalVehicles}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-emerald-500/10 rounded-md text-emerald-600 dark:text-emerald-400">
                  <div className="text-2xl font-bold">{fleetPerformanceMetrics.summary.activeVehicles}</div>
                  <div className="text-xs">Active</div>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-amber-500/10 rounded-md text-amber-600 dark:text-amber-400">
                  <div className="text-2xl font-bold">{fleetPerformanceMetrics.summary.inMaintenance}</div>
                  <div className="text-xs">In Maint.</div>
                </div>
              </div>
              
              {/* Alert Section */}
              <div className="p-2 bg-muted/20 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs font-medium">Active Alerts</div>
                  <Badge variant={fleetPerformanceMetrics.summary.criticalAlerts > 0 ? "destructive" : "outline"} className="text-[10px]">
                    {fleetPerformanceMetrics.summary.criticalAlerts} Critical
                  </Badge>
                </div>
                <div className="text-sm font-bold">{fleetPerformanceMetrics.summary.alertCount} Issues Detected</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {fleetPerformanceMetrics.summary.anomaliesDetected} anomalies detected in the last 24 hours
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Fleet Utilization Panel */}
          <Card>
            <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium p-0">Fleet Utilization</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex justify-between items-baseline mb-2">
                <div className="flex items-baseline">
                  <div className={`text-2xl font-bold ${getStatusTextColor(fleetPerformanceMetrics.utilization.status)}`}>
                    {fleetPerformanceMetrics.utilization.rate}%
                  </div>
                  <div className="ml-2">{renderTrendIndicator(fleetPerformanceMetrics.utilization.trend)}</div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Target: {fleetPerformanceMetrics.utilization.targetUtilization}%
                </div>
              </div>
              
              {renderProgressBar(fleetPerformanceMetrics.utilization.rate, fleetPerformanceMetrics.utilization.targetUtilization)}
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2 bg-muted/10 rounded-md">
                  <div className="text-xs text-muted-foreground">Idle Time</div>
                  <div className="flex items-baseline">
                    <div className="text-lg font-medium">{fleetPerformanceMetrics.utilization.idleTime}%</div>
                    <div className="ml-2">{renderTrendIndicator(fleetPerformanceMetrics.utilization.idleTimeTrend)}</div>
                  </div>
                </div>
                <div className="p-2 bg-muted/10 rounded-md">
                  <div className="text-xs text-muted-foreground">Peak Hours</div>
                  <div className="text-lg font-medium">{fleetPerformanceMetrics.utilization.peakHours}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Maintenance Status Panel */}
          <Card>
            <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium p-0">Maintenance Status</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex justify-between items-baseline mb-2">
                <div className="flex items-baseline">
                  <div className={`text-2xl font-bold ${getStatusTextColor(fleetPerformanceMetrics.maintenance.status)}`}>
                    {fleetPerformanceMetrics.maintenance.compliance}%
                  </div>
                  <div className="ml-2">{renderTrendIndicator(fleetPerformanceMetrics.maintenance.trend)}</div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Compliance Rate
                </div>
              </div>
              
              {renderProgressBar(fleetPerformanceMetrics.maintenance.compliance)}
              
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="flex flex-col items-center p-2 bg-blue-500/10 rounded-md text-center">
                  <div className="text-sm font-semibold">{fleetPerformanceMetrics.maintenance.scheduled}</div>
                  <div className="text-[10px] text-muted-foreground">Scheduled</div>
                </div>
                <div className="flex flex-col items-center p-2 bg-amber-500/10 rounded-md text-center">
                  <div className="text-sm font-semibold">{fleetPerformanceMetrics.maintenance.inProgress}</div>
                  <div className="text-[10px] text-muted-foreground">In Progress</div>
                </div>
                <div className="flex flex-col items-center p-2 bg-emerald-500/10 rounded-md text-center">
                  <div className="text-sm font-semibold">{fleetPerformanceMetrics.maintenance.completed}</div>
                  <div className="text-[10px] text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Driver Status Panel */}
          <Card>
            <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium p-0">Driver Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex justify-between items-baseline mb-2">
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{driverPerformanceMetrics.summary.totalDrivers}</div>
                  <div className="ml-2 flex flex-col">
                    <span className="text-xs text-muted-foreground">Total Drivers</span>
                    <span className="text-xs">{renderDriverStatusBadge()}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 mb-3">
                <div className="flex flex-col items-center justify-center p-2 bg-emerald-500/10 rounded-md">
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{driverPerformanceMetrics.summary.activeDrivers}</div>
                  <div className="text-[10px] text-muted-foreground">Active</div>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-blue-500/10 rounded-md">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">{driverPerformanceMetrics.summary.onBreak}</div>
                  <div className="text-[10px] text-muted-foreground">On Break</div>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-muted/10 rounded-md">
                  <div className="text-sm font-semibold">{driverPerformanceMetrics.summary.offDuty}</div>
                  <div className="text-[10px] text-muted-foreground">Off Duty</div>
                </div>
              </div>
              
              {/* Alert Section */}
              <div className="p-2 bg-muted/20 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-medium">Performance Score</div>
                  <Badge variant="outline" className="text-[10px]">
                    {driverPerformanceMetrics.performance.overallScore}/100
                  </Badge>
                </div>
                <div className="mt-1">
                  {renderProgressBar(driverPerformanceMetrics.performance.overallScore)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left Column - Fleet Utilization Chart */}
          <Card className="xl:col-span-2 shadow-sm border border-border">
            <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Fleet Utilization <span className="text-xs text-muted-foreground">(24 hours)</span></CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-muted-foreground">Fleet Average</span>
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-muted-foreground">Trucks</span>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-muted-foreground">Vans</span>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <div className="h-[280px]">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <RotateCw className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Loading data...</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>100%</span>
                        <span>Utilization Rate</span>
                        <span>0%</span>
                      </div>
                      
                      <div className="flex-1 relative">
                        {/* Time markers */}
                        <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-muted-foreground">
                          {['00:00', '06:00', '12:00', '18:00', '23:00'].map((time) => (
                            <span key={time}>{time}</span>
                          ))}
                        </div>
                        
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                          {[0, 25, 50, 75, 100].map((value) => (
                            <div key={value} className="w-full h-px bg-muted/30" style={{ top: `${100 - value}%` }} />
                          ))}
                        </div>
                        
                        {/* Data lines */}
                        <div className="absolute inset-0 pt-4 pb-6">
                          {/* Fleet Average Line */}
                          <svg className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="fleetGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.01" />
                              </linearGradient>
                            </defs>
                            <path
                              d={`
                                M0,${100 - utilizationData[0].total}
                                ${utilizationData.map((d, i) => 
                                  `L${(i / (utilizationData.length - 1)) * 950},${100 - d.total}`
                                ).join(' ')}
                              `}
                              fill="none"
                              stroke="hsl(var(--primary))"
                              strokeWidth="2"
                              className="transition-all duration-500"
                            />
                            <path
                              d={`
                                M0,${100 - utilizationData[0].total}
                                ${utilizationData.map((d, i) => 
                                  `L${(i / (utilizationData.length - 1)) * 100},${100 - d.total}`
                                ).join(' ')}
                                L100,100 L0,100 Z
                              `}
                              fill="url(#fleetGradient)"
                              className="transition-all duration-500"
                            />
                            
                            {/* Data points */}
                            {utilizationData.map((d, i) => {
                              // Display points evenly across the graph
                              if (i % 4 === 0 || i === utilizationData.length - 1) {
                                return (
                                  <circle
                                    key={i}
                                    cx={`${(i / (utilizationData.length - 1)) * 100}%`}
                                    cy={`${100 - d.total}%`}
                                    r="3"
                                    fill="hsl(var(--primary))"
                                    className="transition-all duration-500"
                                  />
                                );
                              }
                              return null;
                            })}
                          </svg>
                          
                          {/* Trucks Line */}
                          <svg className="w-full h-full overflow-visible absolute inset-0">
                            <path
                              d={`
                                M0,${100 - utilizationData[0].trucks}
                                ${utilizationData.map((d, i) => 
                                  `L${(i / (utilizationData.length - 1)) * 950},${100 - d.trucks}`
                                ).join(' ')}
                              `}
                              fill="none"
                              stroke="rgb(14, 165, 233)"
                              strokeWidth="1.5"
                              strokeDasharray="3,3"
                              className="transition-all duration-500"
                            />

                            {/* Add data points */}
                            {utilizationData.map((d, i) => {
                              // Display fewer points for cleaner look
                              if (i % 6 === 0 || i === utilizationData.length - 1) {
                                return (
                                  <circle
                                    key={i}
                                    cx={`${(i / (utilizationData.length - 1)) * 100}%`}
                                    cy={`${100 - d.trucks}%`}
                                    r="2"
                                    fill="rgb(14, 165, 233)"
                                    className="transition-all duration-500"
                                  />
                                );
                              }
                              return null;
                            })}
                          </svg>
                          
                          {/* Vans Line */}
                          <svg className="w-full h-full overflow-visible absolute inset-0">
                            <path
                              d={`
                                M0,${100 - utilizationData[0].vans}
                                ${utilizationData.map((d, i) => 
                                  `L${(i / (utilizationData.length - 1)) * 950},${100 - d.vans}`
                                ).join(' ')}
                              `}
                              fill="none"
                              stroke="rgb(245, 158, 11)"
                              strokeWidth="1.5"
                              strokeDasharray="3,3"
                              className="transition-all duration-500"
                            />

                            {/* Add data points */}
                            {utilizationData.map((d, i) => {
                              // Display fewer points for cleaner look
                              if (i % 6 === 0 || i === utilizationData.length - 1) {
                                return (
                                  <circle
                                    key={i}
                                    cx={`${(i / (utilizationData.length - 1)) * 100}%`}
                                    cy={`${100 - d.vans}%`}
                                    r="2"
                                    fill="rgb(245, 158, 11)"
                                    className="transition-all duration-500"
                                  />
                                );
                              }
                              return null;
                            })}
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Key insights */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="p-2 bg-muted/10 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Avg. Utilization</div>
                    <Badge className="text-[10px]" variant="secondary">24h</Badge>
                  </div>
                  <div className="text-lg font-medium mt-1">{fleetPerformanceMetrics.utilization.rate}%</div>
                </div>
                <div className="p-2 bg-muted/10 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Peak Utilization</div>
                    <Badge className="text-[10px]" variant="secondary">24h</Badge>
                  </div>
                  <div className="text-lg font-medium mt-1">92% at 15:00</div>
                </div>
                <div className="p-2 bg-muted/10 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Low Utilization</div>
                    <Badge className="text-[10px]" variant="secondary">24h</Badge>
                  </div>
                  <div className="text-lg font-medium mt-1">38% at 03:00</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Right Column - Live Alerts */}
          <Card className="xl:col-span-1 shadow-sm border border-border">
            <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Live Alerts</CardTitle>
              </div>
              <Badge variant={liveFleetAlerts.some(a => a.severity === "critical") ? "destructive" : "outline"} className="text-[10px]">
                {liveFleetAlerts.length + liveDriverAlerts.length} Active
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[330px] px-4">
                <div className="pt-2 space-y-2">
                  <div className="p-2 bg-card/60 border-b border-border/20">
                    <div className="text-xs font-semibold mb-1 text-muted-foreground">Vehicle Alerts</div>
                      {liveFleetAlerts.map((alert, i) => (
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
                  </div>
                  
                  <div className="p-2 bg-card/60">
                    <div className="text-xs font-semibold mb-1 text-muted-foreground">Driver Alerts</div>
                    {liveDriverAlerts.map((alert, i) => (
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
                  </div>
                </div>
              </ScrollArea>
              <div className="flex justify-between items-center p-3 border-t mt-1">
              <div className="text-xs text-muted-foreground">
                Updated 2 minutes ago
              </div>
            </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fuel Efficiency Performance */}
          <Card className="shadow-sm border border-border">
            <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
              </div>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">Fleet Average</div>
                  <div className="text-2xl font-bold">{fleetPerformanceMetrics.fuelEfficiency.overall} MPG</div>
                  <div className="text-xs">{renderTrendIndicator(fleetPerformanceMetrics.fuelEfficiency.trend)}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-muted/10 rounded-md">
                    <div className="text-xs text-muted-foreground">Consumption</div>
                    <div className="text-sm font-medium">{fleetPerformanceMetrics.fuelEfficiency.totalConsumption}</div>
                  </div>
                  <div className="p-2 bg-muted/10 rounded-md">
                    <div className="text-xs text-muted-foreground">Total Cost</div>
                    <div className="text-sm font-medium">{fleetPerformanceMetrics.fuelEfficiency.totalCost}</div>
                  </div>
                </div>
              </div>
              
              <div className="h-[180px]">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <RotateCw className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Loading data...</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex-1 relative">
                        {/* Axis labels and grid */}
                        <div className="absolute left-0 bottom-0 top-0 flex flex-col justify-between items-start text-xs text-muted-foreground">
                          <span>9</span>
                          <span>8</span>
                          <span>7</span>
                          <span>6</span>
                        </div>
                        
                        <div className="absolute right-0 bottom-0 top-0 flex flex-col justify-between items-end text-xs text-muted-foreground">
                          <span>30K</span>
                          <span>25K</span>
                          <span>20K</span>
                          <span>15K</span>
                        </div>
                        
                        {/* Month labels */}
                        <div className="absolute left-8 right-8 bottom-0 flex justify-between text-xs text-muted-foreground">
                          {fuelEfficiencyData.filter((_, i) => i % 2 === 0).map((d) => (
                            <span key={d.month}>{d.month}</span>
                          ))}
                        </div>
                        
                        {/* Grid lines */}
                        <div className="absolute inset-x-8 inset-y-4 flex flex-col justify-between pointer-events-none">
                          {[0, 1, 2, 3].map((value) => (
                            <div key={value} className="w-full h-px bg-muted/30" />
                          ))}
                        </div>
                        
                        {/* Chart content */}
                        <div className="absolute inset-x-8 inset-y-4">
                          {/* MPG Bar Chart */}
                          <div className="absolute inset-0 flex items-end justify-between">
                            {fuelEfficiencyData.map((d, i) => {
                              // Normalize MPG value between 0-100% (using 6-9 MPG range)
                              const mpgPercentage = ((d.mpg - 6) / 3) * 100;
                              return (
                                <div key={i} className="flex-1 h-full flex items-end mx-0.5">
                                  <div 
                                    className="w-full bg-blue-500/80 rounded-t transition-all duration-500"
                                    style={{ height: `${mpgPercentage}%` }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Cost Line Chart */}
                          <svg className="w-full h-full overflow-visible absolute inset-0">
                            <path
                              d={`
                                M0,${100 - ((fuelEfficiencyData[0].cost - 20000) / 10000) * 100}
                                ${fuelEfficiencyData.map((d, i) => {
                                  // Normalize cost between 0-100% (using 20K-30K range)
                                  const costPercentage = ((d.cost - 20000) / 10000) * 100;
                                  return `L${(i / (fuelEfficiencyData.length - 1)) * 650},${100 - costPercentage}`;
                                }).join(' ')}
                              `}
                              fill="none"
                              stroke="rgb(245, 158, 11)"
                              strokeWidth="2"
                              strokeDasharray="4,4"
                              className="transition-all duration-500"
                            />
                            
                            {/* Data points */}
                            {fuelEfficiencyData.map((d, i) => {
                              // Display points at more regular intervals for better visualization
                              if (i % 2 === 0 || i === fuelEfficiencyData.length - 1) {
                                const costPercentage = ((d.cost - 20000) / 10000) * 100;
                                return (
                                  <circle
                                    key={i}
                                    cx={`${(i / (fuelEfficiencyData.length - 1)) * 100}%`}
                                    cy={`${100 - costPercentage}%`}
                                    r="3"
                                    fill="rgb(245, 158, 11)"
                                    className="transition-all duration-500"
                                  />
                                );
                              }
                              return null;
                            })}
                          </svg>
                        </div>
                        
                        {/* Legend */}
                        <div className="absolute top-1 left-0 right-0 flex justify-center">
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-sm bg-blue-500 mr-1"></div>
                              <span className="text-muted-foreground">MPG</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                              <span className="text-muted-foreground">Cost</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Top Fleet Insights */}
          <Card className="shadow-sm border border-border">
            <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Key Insights</CardTitle>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 bg-muted/10 rounded-md border border-border/10">
                  <div className="text-xs text-muted-foreground">Predicted Maintenance</div>
                  <div className="text-xl font-bold text-amber-500">{fleetPerformanceMetrics.maintenance.predictiveMaintenance.vehiclesAtRisk}</div>
                  <div className="text-xs">Vehicles requiring attention</div>
                </div>
                
                <div className="p-2 bg-muted/10 rounded-md border border-border/10">
                  <div className="text-xs text-muted-foreground">Efficiency by Vehicle</div>
                  <div className="text-xl font-bold text-emerald-500">{fleetPerformanceMetrics.fuelEfficiency.byVehicleType[2].type}</div>
                  <div className="text-xs">Most efficient: {fleetPerformanceMetrics.fuelEfficiency.byVehicleType[2].mpg} MPG</div>
                </div>
                
                <div className="p-2 bg-muted/10 rounded-md border border-border/10">
                  <div className="text-xs text-muted-foreground">Driver Performance</div>
                  <div className="text-xl font-bold text-blue-500">{driverPerformanceMetrics.performance.overallScore}</div>
                  <div className="text-xs">Avg. score (out of 100)</div>
                </div>
                
                <div className="p-2 bg-muted/10 rounded-md border border-border/10">
                  <div className="text-xs text-muted-foreground">Safety Score</div>
                  <div className="text-xl font-bold text-emerald-500">{fleetPerformanceMetrics.safety.incidentRate}</div>
                  <div className="text-xs">Incidents per 100k miles</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 bg-amber-500/10 rounded-md">
                  <div className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                    <span>High Idle Time: {idleTime}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {idleTime}% of fleet time spent idling exceeds target of 5%
                  </div>
                </div>
                
                <div className="p-2 bg-blue-500/10 rounded-md">
                  <div className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    <span>Route Optimization</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Optimizing Seattle to Portland route could save up to $1,248/month
                  </div>
                </div>
                
                <div className="p-2 bg-emerald-500/10 rounded-md">
                  <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    <span>Maintenance Savings</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Predictive maintenance has saved {fleetPerformanceMetrics.maintenance.predictiveMaintenance.estimatedSavings} this month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {renderCommandCenter()}
    </div>
  );
}

export { FleetPerformancePanel }; 