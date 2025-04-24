import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { 
  CreditCard, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  BarChart4,
  LineChart,
  Truck,
  AlertCircle,
  Timer,
  Zap,
  RotateCw,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  Terminal,
  Layers,
  Command,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Wallet,
  CircleDollarSign,
  Users,
  Building,
  HardDrive,
  Settings,
  FileBarChart
} from "lucide-react";
import { costAnalysisData, maintenanceCostByVehicleType, costPerMileData, fleetData } from "@/data/mock-data";

interface CostAnalyticsDashboardProps {
  period: string;
  isDataLoaded: boolean;
}

export default function CostAnalyticsDashboard({ period, isDataLoaded }: CostAnalyticsDashboardProps) {
  const [currentView, setCurrentView] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState("total");
  const [costsLoaded, setCostsLoaded] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date());
  const [commandMode, setCommandMode] = useState<"normal" | "detailed" | "alert">("normal");
  const [activeTab, setActiveTab] = useState("overview");
  
  const costBreakdownChartRef = useRef<HTMLDivElement>(null);
  const costPerMileChartRef = useRef<HTMLDivElement>(null);
  const maintenanceBreakdownRef = useRef<HTMLDivElement>(null);
  
  // Store the cost breakdown chart instance
  const costBreakdownChartInstance = useRef<any>(null);
  
  const currentPeriodData = costAnalysisData.slice(-1)[0];
  const previousPeriodData = costAnalysisData.slice(-2)[0];
  
  // Mock cost performance metrics with command center data
  const costPerformanceMetrics = {
    overallStatus: "optimal", // optimal, good, warning, critical, alert
    summary: {
      totalCost: currentPeriodData.fuel + currentPeriodData.maintenance + 
                 currentPeriodData.labor + currentPeriodData.insurance + 
                 currentPeriodData.other,
      previousCost: previousPeriodData.fuel + previousPeriodData.maintenance + 
                    previousPeriodData.labor + previousPeriodData.insurance + 
                    previousPeriodData.other,
      costPerMile: 1.82,
      costPerDelivery: 27.65,
      anomaliesDetected: 2,
      alertCount: 3
    },
    categories: {
      fuel: {
        cost: currentPeriodData.fuel,
        previousCost: previousPeriodData.fuel,
        change: ((currentPeriodData.fuel - previousPeriodData.fuel) / previousPeriodData.fuel) * 100,
        status: ((currentPeriodData.fuel - previousPeriodData.fuel) / previousPeriodData.fuel) * 100 > 5 ? "warning" : "optimal",
        anomalies: [
          { type: "spike", description: "12% increase in Route B32", severity: "critical" }
        ]
      },
      maintenance: {
        cost: currentPeriodData.maintenance,
        previousCost: previousPeriodData.maintenance,
        change: ((currentPeriodData.maintenance - previousPeriodData.maintenance) / previousPeriodData.maintenance) * 100,
        status: "good",
        breakdown: {
          preventive: 65,
          corrective: 25,
          emergency: 10
        },
        anomalies: [
          { type: "trend", description: "Increasing costs for Heavy Trucks", severity: "warning" }
        ]
      },
      labor: {
        cost: currentPeriodData.labor,
        previousCost: previousPeriodData.labor,
        change: ((currentPeriodData.labor - previousPeriodData.labor) / previousPeriodData.labor) * 100,
        status: "optimal",
        anomalies: [
          { type: "variance", description: "+8% in Chicago Hub", severity: "warning" }
        ]
      },
      insurance: {
        cost: currentPeriodData.insurance,
        previousCost: previousPeriodData.insurance,
        change: ((currentPeriodData.insurance - previousPeriodData.insurance) / previousPeriodData.insurance) * 100,
        status: "optimal",
        anomalies: []
      },
      other: {
        cost: currentPeriodData.other,
        previousCost: previousPeriodData.other,
        change: ((currentPeriodData.other - previousPeriodData.other) / previousPeriodData.other) * 100,
        status: "optimal",
        anomalies: []
      }
    },
    vehicleTypes: {
      heavyTruck: {
        costPerMile: 1.92,
        change: -2.5,
        status: "warning"
      },
      mediumTruck: {
        costPerMile: 1.47,
        change: -4.2,
        status: "good"
      },
      deliveryVan: {
        costPerMile: 1.18,
        change: -3.8,
        status: "optimal"
      },
      electric: {
        costPerMile: 0.95,
        change: -1.2,
        status: "optimal"
      }
    },
    facilities: [
      { name: "Chicago Hub", costIndex: 112, status: "warning", trend: "+8.2%" },
      { name: "Dallas Center", costIndex: 97, status: "optimal", trend: "-2.1%" },
      { name: "LA Warehouse", costIndex: 108, status: "good", trend: "+1.8%" },
      { name: "NYC Distribution", costIndex: 116, status: "warning", trend: "+5.4%" },
      { name: "Atlanta Terminal", costIndex: 95, status: "optimal", trend: "-3.2%" }
    ],
    efficiency: {
      overall: 88.5,
      trend: "+2.3%",
      topPerformers: [
        { route: "Dallas-Houston", efficiency: 94.2 },
        { route: "Chicago-Milwaukee", efficiency: 93.8 }
      ],
      improvementAreas: [
        { route: "NYC-Boston", efficiency: 76.3 },
        { route: "Seattle-Portland", efficiency: 79.8 }
      ]
    }
  };
  
  // Calculate totals and changes
  const totalCurrentCosts = currentPeriodData.fuel + currentPeriodData.maintenance + 
                          currentPeriodData.labor + currentPeriodData.insurance + 
                          currentPeriodData.other;
  const totalPreviousCosts = previousPeriodData.fuel + previousPeriodData.maintenance + 
                           previousPeriodData.labor + previousPeriodData.insurance + 
                           previousPeriodData.other;
  const totalChange = ((totalCurrentCosts - totalPreviousCosts) / totalPreviousCosts) * 100;
  
  // Calculate cost per delivery metrics
  const deliveriesThisMonth = 4250;
  const deliveriesLastMonth = 4120;
  const costPerDelivery = (totalCurrentCosts / deliveriesThisMonth).toFixed(2);
  const costPerDeliveryLastMonth = (totalPreviousCosts / deliveriesLastMonth).toFixed(2);
  const costPerDeliveryChange = ((parseFloat(costPerDelivery) - parseFloat(costPerDeliveryLastMonth)) / parseFloat(costPerDeliveryLastMonth)) * 100;
  
  // Calculate cost distributions
  const fuelPercentage = Math.round((currentPeriodData.fuel / totalCurrentCosts) * 100);
  const maintenancePercentage = Math.round((currentPeriodData.maintenance / totalCurrentCosts) * 100);
  const laborPercentage = Math.round((currentPeriodData.labor / totalCurrentCosts) * 100);
  const insurancePercentage = Math.round((currentPeriodData.insurance / totalCurrentCosts) * 100);
  const otherPercentage = Math.round((currentPeriodData.other / totalCurrentCosts) * 100);
  
  // Format currency function
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Update timestamp to simulate live data
  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date());
    }, 15000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Helper functions for consistent styling
  const getStatusColor = (status: string): string => {
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
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
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
  
  // Render the command center header
  const renderCommandCenterHeader = () => {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Command className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-xl font-bold">Cost Analytics Command Center</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground bg-muted/50 py-1 px-2 rounded-md flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{timestamp.toLocaleTimeString()}</span>
            </div>
            <Badge variant={costPerformanceMetrics.summary.alertCount > 0 ? "destructive" : "outline"} className="font-mono text-xs">
              {costPerformanceMetrics.summary.alertCount > 0 ? 
                `${costPerformanceMetrics.summary.alertCount} ALERTS` : 
                "SYSTEM NOMINAL"}
            </Badge>
            <div className="w-[120px]">
              <Select value={period}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge 
            variant="outline" 
            className={`${getStatusBgClass(costPerformanceMetrics.overallStatus)} border-0 text-xs`}
          >
            <span className={getStatusTextColor(costPerformanceMetrics.overallStatus)}>
              STATUS: {costPerformanceMetrics.overallStatus.toUpperCase()}
            </span>
          </Badge>
          <span className="text-xs text-muted-foreground">
            Period: {period} | Data last refreshed: {timestamp.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  // Initialize charts
  useEffect(() => {
    if (isDataLoaded && window.ApexCharts) {
      setCostsLoaded(true);
      
      // Cost breakdown chart
      if (costBreakdownChartRef.current) {
        // Clean up previous instance if it exists
        if (costBreakdownChartInstance.current) {
          costBreakdownChartInstance.current.destroy();
        }
        
        const chart = new window.ApexCharts(costBreakdownChartRef.current, {
          series: [{
            name: 'Cost',
            data: [
              currentPeriodData.fuel,
              currentPeriodData.maintenance,
              currentPeriodData.labor,
              currentPeriodData.insurance,
              currentPeriodData.other
            ]
          }],
          chart: {
            type: 'bar',
            height: 230,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '60%',
              borderRadius: 4,
              distributed: true,
            }
          },
          colors: ['#0ea5e9', '#a855f7', '#10b981', '#f59e0b', '#6b7280'],
          dataLabels: {
            enabled: true,
            formatter: function(val: number) {
              return formatCurrency(val);
            },
            offsetX: 10,
            style: {
              fontSize: '11px',
              fontFamily: 'inherit',
              fontWeight: 'normal',
            }
          },
          xaxis: {
            categories: ['Fuel', 'Maintenance', 'Labor', 'Insurance', 'Other'],
            labels: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          legend: {
            show: false
          }
        });
        
        chart.render();
        costBreakdownChartInstance.current = chart;
      }
      
      // Cost per mile chart
      if (costPerMileChartRef.current) {
        const chart = new window.ApexCharts(costPerMileChartRef.current, {
          series: [{
            name: 'Cost per Mile',
            data: costPerMileData.map(d => d.costPerMile)
          }],
          chart: {
            type: 'area',
            height: 250,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          colors: ['#10b981'],
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.2,
              stops: [0, 90, 100]
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          xaxis: {
            categories: costPerMileData.map(d => d.month),
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          yaxis: {
            labels: {
              formatter: function(val: number) {
                return '$' + val.toFixed(2);
              },
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return '$' + val.toFixed(2) + ' per mile';
              }
            }
          },
          legend: {
            show: false
          }
        });
        
        chart.render();
      }
      
      // Maintenance breakdown chart
      if (maintenanceBreakdownRef.current) {
        const chart = new window.ApexCharts(maintenanceBreakdownRef.current, {
          series: maintenanceCostByVehicleType.map(item => item.cost),
          chart: {
            type: 'donut',
            height: 250,
            toolbar: {
              show: false
            }
          },
          colors: ['#0ea5e9', '#10b981', '#a855f7', '#f59e0b'],
          labels: maintenanceCostByVehicleType.map(item => item.type),
          dataLabels: {
            enabled: true,
            formatter: function(val: number) {
              return val.toFixed(1) + '%';
            },
            style: {
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: 'normal',
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          legend: {
            position: 'bottom',
            fontSize: '12px',
            fontFamily: 'inherit'
          }
        });
        
        chart.render();
      }
      
      // Clean up all charts on unmount
      return () => {
        // Properly clean up chart instances
        if (costBreakdownChartInstance.current) {
          costBreakdownChartInstance.current.destroy();
        }
      };
    }
  }, [isDataLoaded, period, currentPeriodData]);
  
  // Handle tab changes for the Cost Breakdown Chart
  useEffect(() => {
    if (activeTab === "overview" && isDataLoaded && window.ApexCharts && costBreakdownChartRef.current) {
      // Reinitialize the Cost Breakdown Chart when returning to the overview tab
      setTimeout(() => {
        if (costBreakdownChartInstance.current) {
          costBreakdownChartInstance.current.destroy();
        }
        
        const chart = new window.ApexCharts(costBreakdownChartRef.current, {
          series: [{
            name: 'Cost',
            data: [
              currentPeriodData.fuel,
              currentPeriodData.maintenance,
              currentPeriodData.labor,
              currentPeriodData.insurance,
              currentPeriodData.other
            ]
          }],
          chart: {
            type: 'bar',
            height: 230,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '60%',
              borderRadius: 4,
              distributed: true,
            }
          },
          colors: ['#0ea5e9', '#a855f7', '#10b981', '#f59e0b', '#6b7280'],
          dataLabels: {
            enabled: true,
            formatter: function(val: number) {
              return formatCurrency(val);
            },
            offsetX: 10,
            style: {
              fontSize: '11px',
              fontFamily: 'inherit',
              fontWeight: 'normal',
            }
          },
          xaxis: {
            categories: ['Fuel', 'Maintenance', 'Labor', 'Insurance', 'Other'],
            labels: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          legend: {
            show: false
          }
        });
        
        chart.render();
        costBreakdownChartInstance.current = chart;
      }, 100);
    }
  }, [activeTab, isDataLoaded, currentPeriodData]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (costBreakdownChartInstance.current) {
        costBreakdownChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {renderCommandCenterHeader()}
      
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Command className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" /> 
            <span>Breakdown</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>Trends</span>
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>Anomalies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Overview Tab Content */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Cost KPI Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalCurrentCosts)}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {renderTrendIndicator(totalChange.toFixed(1) + "%")}
                  <span className="ml-1">from previous {period}</span>
                </p>
                <div className="mt-3">
                  {renderProgressBar(90, 100, false)}
                </div>
              </CardContent>
            </Card>
            
            {/* Cost Per Mile KPI Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Per Mile</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${costPerformanceMetrics.summary.costPerMile.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {renderTrendIndicator("-1.2%")}
                  <span className="ml-1">from previous {period}</span>
                </p>
                <div className="mt-3">
                  {renderProgressBar(85, 100, false)}
                </div>
              </CardContent>
            </Card>
            
            {/* Cost Per Delivery KPI Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Per Delivery</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${costPerformanceMetrics.summary.costPerDelivery.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {renderTrendIndicator("-2.8%")}
                  <span className="ml-1">from previous {period}</span>
                </p>
                <div className="mt-3">
                  {renderProgressBar(88, 100, false)}
                </div>
              </CardContent>
            </Card>
            
            {/* Anomaly Count KPI Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{costPerformanceMetrics.summary.anomaliesDetected}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {costPerformanceMetrics.summary.anomaliesDetected > 0 ? (
                    <Badge variant="destructive" className="text-[10px]">NEEDS ATTENTION</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 text-[10px] border-0">ALL CLEAR</Badge>
                  )}
                </p>
                <div className="mt-3">
                  <Separator />
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Last scan: 2 min ago</span>
                    <RotateCw className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            {/* Cost Breakdown Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Current cost breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]" ref={costBreakdownChartRef}></div>
              </CardContent>
            </Card>
            
            {/* Status Cards */}
            <div className="space-y-4">
              {/* Cost Category Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Category Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    {Object.entries(costPerformanceMetrics.categories).map(([category, data]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={`w-2 h-2 p-0 rounded-full ${getStatusBgClass(data.status)}`} />
                          <span className="text-sm capitalize">{category}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs font-medium ${getStatusTextColor(data.status)}`}>
                            {data.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Alert Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Alert Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {costPerformanceMetrics.summary.alertCount > 0 ? (
                    <div className="space-y-2">
                      {Object.values(costPerformanceMetrics.categories)
                        .flatMap(category => category.anomalies)
                        .slice(0, 3)
                        .map((anomaly, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            {getAlertIcon(anomaly.severity)}
                            <div>
                              <p className="font-medium">{anomaly.type}: {anomaly.description}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-6">
                      <div className="text-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-medium">All systems normal</p>
                        <p className="text-xs text-muted-foreground">No anomalies detected</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Vehicle Type Cost Metrics */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(costPerformanceMetrics.vehicleTypes).map(([vehicleType, data]) => (
              <Card key={vehicleType}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium capitalize">{vehicleType.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">${data.costPerMile.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/mile</span></div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getStatusBgClass(data.status)} border-0`}>
                      <span className={getStatusTextColor(data.status)}>{data.status.toUpperCase()}</span>
                    </Badge>
                    {renderTrendIndicator(data.change.toString() + "%")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="breakdown" className="space-y-4">
          {/* Breakdown Tab Content */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown Analysis</CardTitle>
              <CardDescription>Detailed breakdown of costs by category and subcategory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Cost Category Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                    {Object.entries(costPerformanceMetrics.categories).map(([category, data]) => (
                      <Card key={category} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-sm font-medium capitalize mb-1">{category}</div>
                          <div className="text-lg font-bold">{formatCurrency(data.cost)}</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            {renderTrendIndicator(data.change.toFixed(1) + "%")}
                            <span className="ml-1">vs prev. {period}</span>
                          </div>
                          <div className="mt-2">
                            <div className="w-full h-2 bg-muted rounded-full">
                              <div 
                                className={`h-full ${getStatusColor(data.status)} rounded-full`} 
                                style={{ width: `${Math.max(Math.abs(data.change), 5)}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          {/* Trends Tab Content */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Cost Trend Analysis</CardTitle>
                <CardDescription>Historical cost trends and forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[280px]">
                  <CostTrendChart data={costAnalysisData} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Category Trend Summary</CardTitle>
                <CardDescription>Comparison of major cost categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Fuel Trend */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-sm font-medium">Fuel</span>
                      </div>
                      <span className={`text-xs ${costPerformanceMetrics.categories.fuel.change > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {costPerformanceMetrics.categories.fuel.change > 0 ? '↑' : '↓'} 
                        {Math.abs(costPerformanceMetrics.categories.fuel.change).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div 
                        className="h-full bg-blue-400 rounded-full" 
                        style={{ width: `${Math.min(Math.abs(costPerformanceMetrics.categories.fuel.change) * 2, 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Current: {formatCurrency(costPerformanceMetrics.categories.fuel.cost)}
                    </div>
                  </div>
                  
                  {/* Maintenance Trend */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className="text-sm font-medium">Maintenance</span>
                      </div>
                      <span className={`text-xs ${costPerformanceMetrics.categories.maintenance.change > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {costPerformanceMetrics.categories.maintenance.change > 0 ? '↑' : '↓'} 
                        {Math.abs(costPerformanceMetrics.categories.maintenance.change).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div 
                        className="h-full bg-purple-400 rounded-full" 
                        style={{ width: `${Math.min(Math.abs(costPerformanceMetrics.categories.maintenance.change) * 2, 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Current: {formatCurrency(costPerformanceMetrics.categories.maintenance.cost)}
                    </div>
                  </div>
                  
                  {/* Labor Trend */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="text-sm font-medium">Labor</span>
                      </div>
                      <span className={`text-xs ${costPerformanceMetrics.categories.labor.change > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {costPerformanceMetrics.categories.labor.change > 0 ? '↑' : '↓'} 
                        {Math.abs(costPerformanceMetrics.categories.labor.change).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div 
                        className="h-full bg-emerald-400 rounded-full" 
                        style={{ width: `${Math.min(Math.abs(costPerformanceMetrics.categories.labor.change) * 2, 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Current: {formatCurrency(costPerformanceMetrics.categories.labor.cost)}
                    </div>
                  </div>
                  
                  {/* Insurance Trend */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        <span className="text-sm font-medium">Insurance</span>
                      </div>
                      <span className={`text-xs ${costPerformanceMetrics.categories.insurance.change > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {costPerformanceMetrics.categories.insurance.change > 0 ? '↑' : '↓'} 
                        {Math.abs(costPerformanceMetrics.categories.insurance.change).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div 
                        className="h-full bg-amber-400 rounded-full" 
                        style={{ width: `${Math.min(Math.abs(costPerformanceMetrics.categories.insurance.change) * 2, 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Current: {formatCurrency(costPerformanceMetrics.categories.insurance.cost)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="anomalies" className="space-y-4">
          {/* Anomalies Tab Content */}
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>Detected anomalies and cost outliers</CardDescription>
            </CardHeader>
            <CardContent>
              {costPerformanceMetrics.summary.anomaliesDetected > 0 ? (
                <div className="space-y-4">
                  {Object.entries(costPerformanceMetrics.categories)
                    .filter(([_, data]) => data.anomalies.length > 0)
                    .map(([category, data]) => (
                      <div key={category} className="space-y-2">
                        <h3 className="text-sm font-semibold capitalize">{category} Anomalies</h3>
                        {data.anomalies.map((anomaly, idx) => (
                          <Card key={idx} className={`border-l-4 ${anomaly.severity === 'critical' ? 'border-l-rose-500' : 'border-l-amber-500'}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-medium">{anomaly.description}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Detected in {category} category, {anomaly.type} pattern
                                  </div>
                                </div>
                                <Badge variant={anomaly.severity === 'critical' ? 'destructive' : 'outline'} className={anomaly.severity !== 'critical' ? 'bg-amber-500/10 text-amber-500 border-0' : ''}>
                                  {anomaly.severity.toUpperCase()}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">All Systems Normal</h3>
                    <p className="text-muted-foreground">No anomalies detected in the current {period}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Cost Trend Chart Component - Streamlined version
const CostTrendChart: React.FC<{ data: typeof costAnalysisData }> = ({ data }) => {
  const trendData = data.map(month => ({
    month: month.month,
    total: month.fuel + month.maintenance + month.labor + month.insurance + month.other,
    fuel: month.fuel,
    maintenance: month.maintenance,
    labor: month.labor
  }));
  
  return (
    <div className="w-full h-full">
      {/* Compact legend */}
      <div className="flex justify-end mb-2 gap-2 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <span>Total</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span>Fuel</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
          <span>Maintenance</span>
        </div>
      </div>
      
      {/* Chart area */}
      <div className="h-[240px] w-full">
        {/* We're using a simple approach for visualization */}
        <div className="relative h-full w-full">
          {/* Background grid */}
          <div className="absolute inset-0 grid grid-rows-4 w-full h-full">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-full border-t border-dashed border-muted"></div>
            ))}
          </div>
          
          {/* Chart content */}
          <div className="absolute inset-0 flex items-end">
            {trendData.map((month, idx) => {
              // Calculate relative heights
              const maxValue = Math.max(...trendData.map(d => d.total)) * 1.1;
              const totalHeight = (month.total / maxValue) * 100;
              const fuelHeight = (month.fuel / maxValue) * 100;
              const maintenanceHeight = (month.maintenance / maxValue) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  {/* Data point */}
                  <div className="relative w-full flex justify-center mb-5">
                    {/* Simplified small bar */}
                    <div className="w-[6px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[6px] bg-indigo-500 rounded-full"
                        style={{ height: `${totalHeight}%` }}>
                      </div>
                    </div>
                    
                    {/* Line connecting points */}
                    {idx < trendData.length - 1 && (
                      <div className="absolute top-0 right-0 h-0.5 bg-indigo-500/40 w-full transform -translate-y-1/2"
                        style={{ 
                          width: '50%', 
                          right: 0,
                          top: `${100 - totalHeight}%`
                        }}>
                      </div>
                    )}
                    {idx > 0 && (
                      <div className="absolute top-0 left-0 h-0.5 bg-indigo-500/40 w-full transform -translate-y-1/2"
                        style={{ 
                          width: '50%', 
                          left: 0,
                          top: `${100 - totalHeight}%`
                        }}>
                      </div>
                    )}
                    
                    {/* Data point marker */}
                    <div className="absolute w-2 h-2 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-900"
                      style={{ bottom: `${totalHeight}%`, transform: 'translateY(50%)' }}>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform translate-y-full
                                  opacity-0 hover:opacity-100 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] 
                                  shadow pointer-events-none transition-opacity z-10 whitespace-nowrap"
                      style={{ bottom: `${totalHeight}%` }}>
                      ${month.total.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* X-axis label */}
                  <div className="text-[9px] text-center text-muted-foreground mt-1">
                    {month.month}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis labels (simplified) */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-1 text-right pr-1">
            {[0, 1, 2].map(i => {
              const maxValue = Math.max(...trendData.map(d => d.total));
              const value = Math.round(maxValue * (1 - (i / 2)));
              return (
                <div key={i} className="text-[9px] text-muted-foreground">
                  {i === 0 ? `$${value.toLocaleString()}` : `$${value.toLocaleString()}`}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Quick stats summary */}
      <div className="flex justify-between items-center mt-2 text-[10px] text-muted-foreground">
        <span>
          {trendData[trendData.length - 1].total > trendData[0].total ? (
            <span className="text-rose-500">↑ {((trendData[trendData.length - 1].total - trendData[0].total) / trendData[0].total * 100).toFixed(1)}%</span>
          ) : (
            <span className="text-emerald-500">↓ {((trendData[trendData.length - 1].total - trendData[0].total) / trendData[0].total * 100).toFixed(1)}%</span>
          )}
          <span> from start</span>
        </span>
        <span>Last: ${trendData[trendData.length - 1].total.toLocaleString()}</span>
      </div>
    </div>
  );
}; 