import { useRef, useEffect, useState } from "react";
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
  LineChart,
  Truck,
  AlertCircle,
  Clock,
  Terminal,
  Layers,
  Command,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Brain,
  Sparkles,
  CalendarRange,
  LayoutDashboard,
  RefreshCcw,
  SlidersHorizontal,
  FlaskConical,
  BarChart,
  ArrowRight,
  Sigma,
  BrainCircuit,
  MonitorSmartphone,
  Settings,
  BarChart4,
  Eye,
  Cpu
} from "lucide-react";

// Mock data - this would come from your API in a real app
import { costAnalysisData, predictiveMockData, forecastData } from "@/data/mock-data";

interface PredictiveAnalyticsProps {
  period: string;
  isDataLoaded: boolean;
}

export default function PredictiveAnalytics({ period, isDataLoaded }: PredictiveAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("forecast");
  const [selectedMetric, setSelectedMetric] = useState("cost");
  const [confidenceLevel, setConfidenceLevel] = useState("medium");
  const [modelVersion, setModelVersion] = useState("v2.4");
  const [predictionHorizon, setPredictionHorizon] = useState("30");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  const costForecastChartRef = useRef<HTMLDivElement>(null);
  const maintenancePredictionChartRef = useRef<HTMLDivElement>(null);
  const fuelPriceTrendChartRef = useRef<HTMLDivElement>(null);
  const anomalyPredictionChartRef = useRef<HTMLDivElement>(null);

  // Mock prediction data - in a real app, this would come from your ML model API
  const predictiveData = {
    modelInfo: {
      name: "LogiPredict ML v2.4",
      lastTrained: "2023-08-15",
      accuracy: 92.7,
      confidence: {
        low: 85,
        medium: 90,
        high: 95
      }
    },
    costForecast: {
      current: 124500,
      predicted: 130200,
      percentChange: 4.6,
      trend: "increasing",
      factors: [
        { name: "Fuel Prices", impact: 2.8, direction: "up" },
        { name: "Maintenance Cycles", impact: 1.5, direction: "up" },
        { name: "Labor Costs", impact: 0.3, direction: "up" }
      ],
      confidenceInterval: {
        low: [128000, 132400],
        medium: [126800, 133600],
        high: [125500, 134900]
      }
    },
    maintenancePrediction: {
      nextMajorDate: "2023-10-15", // This is a date 45 days from when you view this
      predictedCost: 28500,
      vehiclesAffected: 12,
      riskLevel: "medium",
      components: [
        { name: "Brake Systems", vehicles: 5, urgency: "high" },
        { name: "Engine Diagnostics", vehicles: 8, urgency: "medium" },
        { name: "Transmission", vehicles: 2, urgency: "low" }
      ]
    },
    anomalyPrediction: {
      potentialAnomalies: 3,
      categories: [
        { name: "Fuel Consumption", probability: 0.82, impact: "high", date: "Next 14 days" },
        { name: "Route Efficiency", probability: 0.67, impact: "medium", date: "Next 30 days" },
        { name: "Repair Costs", probability: 0.54, impact: "high", date: "Next 30 days" }
      ],
      accuracy: 88.5
    },
    optimizationOpportunities: [
      { 
        category: "Routes", 
        potential: 4.2, 
        savings: 12400,
        difficulty: "medium",
        timeframe: "1-2 months"
      },
      { 
        category: "Preventive Maintenance", 
        potential: 6.8, 
        savings: 18600,
        difficulty: "easy",
        timeframe: "Immediate"
      },
      { 
        category: "Fleet Rotation", 
        potential: 5.1, 
        savings: 15800,
        difficulty: "complex",
        timeframe: "3-6 months"
      }
    ],
    insightMetrics: [
      { name: "Cost per Mile Trend", value: "Decreasing", change: -2.3, status: "positive" },
      { name: "Vehicle Uptime", value: "94.8%", change: 1.2, status: "positive" },
      { name: "Maintenance Efficiency", value: "Rising", change: 3.5, status: "positive" },
      { name: "Fuel Efficiency", value: "Stable", change: 0.1, status: "neutral" }
    ]
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Helper functions for consistent styling
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "positive":
        return "text-emerald-500";
      case "neutral":
        return "text-blue-500";
      case "negative":
        return "text-amber-500";
      case "critical":
        return "text-rose-500";
      default:
        return "text-gray-500";
    }
  };
  
  const getStatusBgClass = (status: string): string => {
    switch (status) {
      case "positive":
        return "bg-emerald-500/10";
      case "neutral":
        return "bg-blue-500/10";
      case "negative":
        return "bg-amber-500/10";
      case "critical":
        return "bg-rose-500/10";
      default:
        return "bg-gray-500/10";
    }
  };
  
  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case "low":
        return "text-blue-500";
      case "medium":
        return "text-amber-500";
      case "high":
        return "text-rose-500";
      default:
        return "text-gray-500";
    }
  };
  
  const getUrgencyBgClass = (urgency: string): string => {
    switch (urgency) {
      case "low":
        return "bg-blue-500/10";
      case "medium":
        return "bg-amber-500/10";
      case "high":
        return "bg-rose-500/10";
      default:
        return "bg-gray-500/10";
    }
  };
  
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "easy":
        return "text-emerald-500";
      case "medium":
        return "text-amber-500";
      case "complex":
        return "text-rose-500";
      default:
        return "text-gray-500";
    }
  };
  
  const renderTrendIndicator = (trend: string | number, isPositiveGood: boolean = true) => {
    const isPositive = typeof trend === 'string' 
      ? trend.startsWith("+") 
      : trend > 0;
    
    const isNeutral = typeof trend === 'string' 
      ? trend === "0%" || trend === "0" 
      : trend === 0;
    
    if (isNeutral) {
      return (
        <span className="text-muted-foreground text-xs font-medium">
          No change
        </span>
      );
    }
    
    const isGood = isPositiveGood ? isPositive : !isPositive;
    
    return (
      <span className={`text-xs font-medium inline-flex items-center ${isGood ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3 mr-0.5" />
        ) : (
          <ArrowDownRight className="h-3 w-3 mr-0.5" />
        )}
        {typeof trend === 'string' ? trend.replace("+", "") : `${Math.abs(trend)}%`}
      </span>
    );
  };
  
  const renderConfidenceLevel = (level: string) => {
    const confidence = predictiveData.modelInfo.confidence[level as keyof typeof predictiveData.modelInfo.confidence];
    
    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground capitalize">{level} confidence</span>
          <span className="text-xs font-medium">{confidence}%</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full ${level === 'low' ? 'bg-blue-500' : level === 'medium' ? 'bg-emerald-500' : 'bg-indigo-500'} rounded-full`} 
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    );
  };
  
  // Initialize charts
  useEffect(() => {
    if (isDataLoaded && window.ApexCharts) {
      // Cost Forecast Chart
      if (costForecastChartRef.current) {
        const chart = new window.ApexCharts(costForecastChartRef.current, {
          series: [{
            name: 'Predicted Cost',
            data: [124000, 126500, 128200, 130200, 132500, 134800]
          }, {
            name: 'Confidence (Low)',
            data: [122000, 124000, 126000, 128000, 130000, 132400]
          }, {
            name: 'Confidence (High)',
            data: [126000, 129000, 131500, 133600, 136000, 138500]
          }],
          chart: {
            type: 'area',
            height: 300,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          colors: ['#6366f1', '#93c5fd', '#a5b4fc'],
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
            width: [2, 1, 1]
          },
          markers: {
            size: 0
          },
          xaxis: {
            categories: ['Current', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
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
                return formatCurrency(val);
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
                return formatCurrency(val);
              }
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12px',
            fontFamily: 'inherit'
          }
        });
        
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
      
      // Maintenance Prediction Chart
      if (maintenancePredictionChartRef.current) {
        const chart = new window.ApexCharts(maintenancePredictionChartRef.current, {
          series: [{
            name: 'Maintenance Cost',
            data: [18500, 22000, 28500, 15000, 23000]
          }],
          chart: {
            type: 'bar',
            height: 200,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              distributed: true,
              borderRadius: 4,
              columnWidth: '60%',
            }
          },
          colors: ['#0ea5e9', '#a855f7', '#f59e0b', '#10b981', '#6366f1'],
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: ['Sept', 'Oct', 'Nov', 'Dec', 'Jan'],
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
                return formatCurrency(val);
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
                return formatCurrency(val);
              }
            }
          },
          legend: {
            show: false
          }
        });
        
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
      
      // Anomaly Prediction Chart
      if (anomalyPredictionChartRef.current) {
        const chart = new window.ApexCharts(anomalyPredictionChartRef.current, {
          series: [{
            name: 'Normal Range',
            type: 'rangeArea',
            data: [
              { x: 'Jan', y: [2800, 4000] },
              { x: 'Feb', y: [3000, 4200] },
              { x: 'Mar', y: [3200, 4400] },
              { x: 'Apr', y: [3000, 4300] },
              { x: 'May', y: [3200, 4500] },
              { x: 'Jun', y: [3400, 4700] },
              { x: 'Jul', y: [3300, 4600] },
              { x: 'Aug', y: [3400, 4800] },
              { x: 'Sep', y: [3600, 5000] },
              { x: 'Oct', y: [3800, 5200] },
              { x: 'Nov', y: [4000, 5500] },
              { x: 'Dec', y: [4200, 5800] }
            ]
          }, {
            name: 'Actual Cost',
            type: 'line',
            data: [
              { x: 'Jan', y: 3400 },
              { x: 'Feb', y: 3600 },
              { x: 'Mar', y: 3700 },
              { x: 'Apr', y: 3800 },
              { x: 'May', y: 4000 },
              { x: 'Jun', y: 4200 },
              { x: 'Jul', y: 4100 },
              { x: 'Aug', y: 4300 },
              { x: 'Sep', y: 4600 },
              { x: 'Oct', y: 5100 },
              { x: 'Nov', y: 5700 },
              { x: 'Dec', y: 6000 }
            ]
          }, {
            name: 'Anomaly Threshold',
            type: 'line',
            data: [
              { x: 'Jan', y: 4100 },
              { x: 'Feb', y: 4300 },
              { x: 'Mar', y: 4400 },
              { x: 'Apr', y: 4500 },
              { x: 'May', y: 4600 },
              { x: 'Jun', y: 4800 },
              { x: 'Jul', y: 4900 },
              { x: 'Aug', y: 5000 },
              { x: 'Sep', y: 5200 },
              { x: 'Oct', y: 5300 },
              { x: 'Nov', y: 5500 },
              { x: 'Dec', y: 5600 }
            ]
          }],
          chart: {
            height: 300,
            type: 'rangeArea',
            animations: {
              speed: 500
            },
            toolbar: {
              show: false
            }
          },
          colors: ['#e2e8f0', '#6366f1', '#f43f5e'],
          fill: {
            opacity: [0.2, 1, 1]
          },
          stroke: {
            curve: 'straight',
            width: [0, 2, 2],
            dashArray: [0, 0, 5]
          },
          markers: {
            size: [0, 4, 4],
            strokeWidth: 2,
            hover: {
              size: 6
            }
          },
          xaxis: {
            type: 'category',
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
                return formatCurrency(val);
              },
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          tooltip: {
            theme: 'dark',
            shared: true,
            intersect: false,
            y: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12px',
            fontFamily: 'inherit'
          }
        });
        
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
    }
  }, [isDataLoaded, period, activeTab, selectedMetric, confidenceLevel, predictionHorizon]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">Predictive Analytics Center</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground bg-muted/50 py-1 px-2 rounded-md flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-0 text-xs">
            ML MODEL: {modelVersion}
          </Badge>
          <div className="w-[140px]">
            <Select value={predictionHorizon} onValueChange={setPredictionHorizon}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Forecast Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="forecast" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="forecast" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Maintenance</span>
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Anomalies</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Optimization</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecast" className="space-y-4">
          {/* Cost Forecast Overview */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Predicted Cost Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Predicted Cost</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(predictiveData.costForecast.predicted)}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {renderTrendIndicator(predictiveData.costForecast.percentChange.toString() + "%", false)}
                  <span className="ml-1">from current ({formatCurrency(predictiveData.costForecast.current)})</span>
                </p>
                <div className="mt-3">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${Math.min(predictiveData.costForecast.percentChange * 10, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Prediction for next {predictionHorizon} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Model Accuracy Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{predictiveData.modelInfo.accuracy}%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span>Last trained: {predictiveData.modelInfo.lastTrained}</span>
                </p>
                <div className="mt-3">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${predictiveData.modelInfo.accuracy}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Confidence Intervals Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confidence Levels</CardTitle>
                <Sigma className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                {renderConfidenceLevel('low')}
                {renderConfidenceLevel('medium')}
                {renderConfidenceLevel('high')}
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                    <SelectTrigger className="w-full h-7 text-xs mt-1">
                      <SelectValue placeholder="Confidence Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Confidence</SelectItem>
                      <SelectItem value="medium">Medium Confidence</SelectItem>
                      <SelectItem value="high">High Confidence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Key Factors Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Key Influencing Factors</CardTitle>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {predictiveData.costForecast.factors.map((factor, index) => (
                    <div key={index} className="px-6 py-2 flex items-center justify-between">
                      <span className="text-sm">{factor.name}</span>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium ${factor.direction === 'up' ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {factor.direction === 'up' ? (
                            <ArrowUpRight className="h-3 w-3 inline mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 inline mr-1" />
                          )}
                          {factor.impact}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Cost Forecast Chart and Insights */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            {/* Cost Forecast Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Cost Forecast</CardTitle>
                <CardDescription>Predicted costs for the next {predictionHorizon} days with {confidenceLevel} confidence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]" ref={costForecastChartRef}></div>
              </CardContent>
            </Card>
            
            {/* Insight Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Predictive Insights</CardTitle>
                <CardDescription>Key metrics from the predictive model</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {predictiveData.insightMetrics.map((metric, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <Badge variant="outline" className={`${getStatusBgClass(metric.status)} border-0`}>
                          <span className={getStatusColor(metric.status)}>
                            {metric.value}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-muted-foreground mr-2">
                          {metric.change !== 0 ? renderTrendIndicator(metric.change, metric.status === "positive") : "No change"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          {/* Maintenance Prediction Content */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            {/* Next Major Maintenance */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Maintenance Forecast</CardTitle>
                <CardDescription>Predicted maintenance needs and costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Next Major Maintenance</h3>
                      <p className="text-muted-foreground">Predicted for {predictiveData.maintenancePrediction.nextMajorDate}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getUrgencyBgClass(predictiveData.maintenancePrediction.riskLevel)} border-0`}
                    >
                      <span className={getUrgencyColor(predictiveData.maintenancePrediction.riskLevel)}>
                        {predictiveData.maintenancePrediction.riskLevel.toUpperCase()} RISK
                      </span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-xl font-bold">{formatCurrency(predictiveData.maintenancePrediction.predictedCost)}</div>
                      <div className="text-xs text-muted-foreground">Predicted Cost</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-xl font-bold">{predictiveData.maintenancePrediction.vehiclesAffected}</div>
                      <div className="text-xs text-muted-foreground">Vehicles Affected</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-xl font-bold">{predictiveData.maintenancePrediction.components.length}</div>
                      <div className="text-xs text-muted-foreground">Component Types</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2">Affected Components</h4>
                    <div className="space-y-2">
                      {predictiveData.maintenancePrediction.components.map((component, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                          <div>
                            <div className="font-medium">{component.name}</div>
                            <div className="text-xs text-muted-foreground">{component.vehicles} vehicles affected</div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${getUrgencyBgClass(component.urgency)} border-0 ml-2`}
                          >
                            <span className={getUrgencyColor(component.urgency)}>
                              {component.urgency.toUpperCase()}
                            </span>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-[200px]" ref={maintenancePredictionChartRef}></div>
              </CardContent>
            </Card>
            
            {/* Maintenance Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Calendar</CardTitle>
                <CardDescription>Upcoming predicted maintenance events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-md border-l-4 border-l-amber-500">
                    <div className="text-sm font-medium">Major Fleet Service</div>
                    <div className="text-xs text-muted-foreground">Oct 15, 2023 • {formatCurrency(28500)}</div>
                    <div className="mt-1 flex items-center">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-0 text-xs">
                        MEDIUM RISK
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">12 vehicles</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md border-l-4 border-l-rose-500">
                    <div className="text-sm font-medium">Brake System Overhaul</div>
                    <div className="text-xs text-muted-foreground">Nov 3, 2023 • {formatCurrency(12800)}</div>
                    <div className="mt-1 flex items-center">
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-0 text-xs">
                        HIGH RISK
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">5 vehicles</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md border-l-4 border-l-blue-500">
                    <div className="text-sm font-medium">Routine Service</div>
                    <div className="text-xs text-muted-foreground">Nov 22, 2023 • {formatCurrency(8500)}</div>
                    <div className="mt-1 flex items-center">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-0 text-xs">
                        LOW RISK
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">18 vehicles</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md border-l-4 border-l-blue-500">
                    <div className="text-sm font-medium">Tire Replacement</div>
                    <div className="text-xs text-muted-foreground">Dec 8, 2023 • {formatCurrency(14200)}</div>
                    <div className="mt-1 flex items-center">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-0 text-xs">
                        LOW RISK
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">9 vehicles</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="anomalies" className="space-y-4">
          {/* Anomaly Prediction Tab */}
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Prediction</CardTitle>
              <CardDescription>AI-detected potential anomalies and their probabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Potential Issues</h3>
                    <Badge variant={predictiveData.anomalyPrediction.potentialAnomalies > 0 ? "outline" : "secondary"} className="font-mono">
                      {predictiveData.anomalyPrediction.potentialAnomalies} DETECTED
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {predictiveData.anomalyPrediction.categories.map((anomaly, index) => (
                      <Card key={index} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{anomaly.name}</div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <CalendarRange className="h-3 w-3 mr-1" />
                                <span>{anomaly.date}</span>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`${anomaly.impact === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'} border-0`}
                            >
                              {anomaly.impact.toUpperCase()} IMPACT
                            </Badge>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Probability</span>
                              <span className="font-medium">{Math.round(anomaly.probability * 100)}%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${anomaly.probability > 0.7 ? 'bg-rose-500' : 'bg-amber-500'} rounded-full`}
                                style={{ width: `${anomaly.probability * 100}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Gauge className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Prediction Accuracy</span>
                      </div>
                      <span className="font-medium">{predictiveData.anomalyPrediction.accuracy}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${predictiveData.anomalyPrediction.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="h-[300px]" ref={anomalyPredictionChartRef}></div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Recommended Actions</h4>
                    <div className="space-y-2">
                      <div className="bg-blue-500/10 p-3 rounded-md">
                        <div className="flex items-center text-blue-500">
                          <Eye className="h-4 w-4 mr-2" />
                          <span className="font-medium">Increase monitoring frequency on fuel consumption</span>
                        </div>
                      </div>
                      <div className="bg-emerald-500/10 p-3 rounded-md">
                        <div className="flex items-center text-emerald-500">
                          <FlaskConical className="h-4 w-4 mr-2" />
                          <span className="font-medium">Schedule diagnostic tests for identified route anomalies</span>
                        </div>
                      </div>
                      <div className="bg-amber-500/10 p-3 rounded-md">
                        <div className="flex items-center text-amber-500">
                          <Settings className="h-4 w-4 mr-2" />
                          <span className="font-medium">Plan preventive maintenance for vehicles showing repair cost trend</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimization" className="space-y-4">
          {/* Optimization Opportunities Tab */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Opportunities</CardTitle>
              <CardDescription>AI-detected opportunities to reduce costs and improve efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {predictiveData.optimizationOpportunities.map((opportunity, index) => (
                  <Card key={index} className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{opportunity.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/50 p-3 rounded-lg grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Potential Savings</div>
                          <div className="text-xl font-bold">{formatCurrency(opportunity.savings)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Improvement</div>
                          <div className="text-xl font-bold text-emerald-500">{opportunity.potential}%</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Implementation</span>
                          <Badge 
                            variant="outline" 
                            className={`${getUrgencyBgClass(opportunity.difficulty)} border-0`}
                          >
                            <span className={getUrgencyColor(opportunity.difficulty)}>{opportunity.difficulty.toUpperCase()}</span>
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">Timeframe: {opportunity.timeframe}</div>
                        
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${opportunity.potential * 10}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Total Optimization Potential</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total Potential Savings</div>
                      <div className="text-2xl font-bold">{formatCurrency(
                        predictiveData.optimizationOpportunities.reduce((sum, item) => sum + item.savings, 0)
                      )}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Average Improvement</div>
                      <div className="text-2xl font-bold">{(
                        predictiveData.optimizationOpportunities.reduce((sum, item) => sum + item.potential, 0) / 
                        predictiveData.optimizationOpportunities.length
                      ).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Implementation Timeline</div>
                      <div className="text-2xl font-bold">1-6 months</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 