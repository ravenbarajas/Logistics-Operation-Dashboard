import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  Label,
} from "recharts";
import { Shipment } from "@shared/schema";
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  Clock,
  CalendarIcon,
  TruckIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TimerIcon,
  MapPinIcon,
  Calendar,
  Timer
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shipmentService } from "@/services/shipmentService";
import { Progress } from "@/components/ui/progress";

// Define the colors for the scatter plot
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface DeliveryTimePerformanceProps {
  shipments?: Shipment[];
}

interface TimeMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  delta?: number;
  status?: "positive" | "negative" | "neutral";
}

interface TimeWindowData {
  timeWindow: string;
  deliveries: number;
  onTime: number;
  avgDelay: number;
}

export function DeliveryTimePerformance({ shipments }: DeliveryTimePerformanceProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("month");
  const [deliveryMetrics, setDeliveryMetrics] = useState<TimeMetric[]>([]);
  const [timeWindowData, setTimeWindowData] = useState<TimeWindowData[]>([]);
  const [onTimeHistoryData, setOnTimeHistoryData] = useState<any[]>([]);
  const [delayDistribution, setDelayDistribution] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load data from service or mock data
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would fetch this data from an API
        const efficiencyData = await shipmentService.getEfficiencyMetrics();
        
        // Set delivery time metrics
        setDeliveryMetrics([
          {
            name: "On-Time Delivery Rate",
            value: efficiencyData.summary.onTimeDelivery,
            target: 95,
            unit: "%",
            delta: 1.2,
            status: "positive"
          },
          {
            name: "Average Delay Time",
            value: 14.5,
            target: 10,
            unit: "min",
            delta: -2.3,
            status: "positive"
          },
          {
            name: "Early Deliveries",
            value: 7.8,
            target: 5,
            unit: "%",
            delta: 0.5,
            status: "positive"
          },
          {
            name: "Severe Delays (>60min)",
            value: 2.4,
            target: 1,
            unit: "%",
            delta: -0.3,
            status: "positive"
          },
          {
            name: "Delivery Time Variance",
            value: 18.2,
            target: 15,
            unit: "min",
            delta: 1.5,
            status: "negative"
          },
          {
            name: "Average Transit Time",
            value: 245,
            target: 240,
            unit: "min",
            delta: -12,
            status: "positive"
          }
        ]);
        
        // Set time window data
        setTimeWindowData(efficiencyData.timeWindowAnalysis);
        
        // Set on-time history data based on timeframe
        setOnTimeHistoryData(
          timeframe === "month" 
            ? efficiencyData.historicalTrends.onTimeDelivery
            : [
                { month: "Jan", value: 90.1 },
                { month: "Feb", value: 90.5 },
                { month: "Mar", value: 91.2 },
                { month: "Apr", value: 91.5 },
                { month: "May", value: 91.9 },
                { month: "Jun", value: 92.2 },
                { month: "Jul", value: 92.4 }
              ]
        );
        
        // Set delay distribution data
        setDelayDistribution([
          { delay: 0, count: 45 },
          { delay: 5, count: 25 },
          { delay: 10, count: 15 },
          { delay: 15, count: 8 },
          { delay: 20, count: 4 },
          { delay: 30, count: 2 },
          { delay: 45, count: 0.7 },
          { delay: 60, count: 0.3 }
        ]);
      } catch (error) {
        console.error("Error loading delivery time performance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [timeframe]);
  
  // Format delta value for display
  const formatDelta = (delta: number | undefined, unit: string) => {
    if (delta === undefined) return "";
    
    const prefix = delta > 0 ? "+" : "";
    return `${prefix}${delta}${unit}`;
  };
  
  // Get status icon
  const getStatusIcon = (status: string | undefined, size: number = 4) => {
    switch (status) {
      case "positive":
        return <ArrowUpIcon className={`h-${size} w-${size} text-green-500`} />;
      case "negative":
        return <ArrowDownIcon className={`h-${size} w-${size} text-red-500`} />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Delivery Time Performance</CardTitle>
            <CardDescription>
              Analysis of on-time deliveries and delay metrics
            </CardDescription>
          </div>
          <Select
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 mx-6 mt-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeWindows">Time Windows</TabsTrigger>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deliveryMetrics.map((metric, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">{metric.name}</div>
                    <Badge 
                      variant={metric.status === "positive" ? "default" : 
                              metric.status === "negative" ? "destructive" : "outline"}
                      className={metric.status === "positive" ? "bg-green-500" : ""}
                    >
                      {formatDelta(metric.delta, metric.unit)}
                    </Badge>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">
                      {metric.value}{metric.unit}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Target: {metric.target}{metric.unit}</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
                    <div 
                      className={`h-full ${
                        metric.name === "Average Delay Time" || metric.name === "Severe Delays (>60min)" ? 
                          (metric.value < metric.target ? "bg-green-500" : "bg-red-500") :
                        metric.status === "positive" ? "bg-green-500" : 
                        metric.status === "negative" ? "bg-red-500" : "bg-amber-500"
                      }`} 
                      style={{ 
                        width: metric.name === "Average Delay Time" || metric.name === "Severe Delays (>60min)" ? 
                          `${(metric.value / (metric.target * 1.5)) * 100}%` :
                          `${(metric.value / (metric.target * 1.2)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="timeWindows" className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">On-Time Delivery by Time Window</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeWindowData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="timeWindow" />
                      <YAxis label={{ value: '%', position: 'insideLeft' }} domain={[80, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'On-Time Percentage']} />
                      <Legend />
                      <Bar dataKey="onTime" name="On-Time %" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Average Delay by Time Window</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeWindowData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="timeWindow" />
                      <YAxis label={{ value: 'minutes', position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value} mins`, 'Average Delay']} />
                      <Legend />
                      <Bar dataKey="avgDelay" name="Avg. Delay (min)" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4 md:col-span-2">
                <h3 className="font-medium mb-4">Delivery Volume by Time Window</h3>
                <div className="grid grid-cols-1 gap-4">
                  {timeWindowData.map((window, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-36 font-medium truncate mr-4">{window.timeWindow}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="flex items-center gap-1 text-sm">
                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            {window.deliveries} deliveries
                          </span>
                          <span className="flex items-center gap-1 font-semibold">
                            <CheckCircleIcon className={`h-3.5 w-3.5 ${window.onTime >= 95 ? 'text-green-500' : window.onTime >= 90 ? 'text-amber-500' : 'text-red-500'}`} />
                            {window.onTime}% on-time
                          </span>
                        </div>
                        <Progress
                          value={window.deliveries}
                          max={Math.max(...timeWindowData.map(w => w.deliveries))}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">On-Time Delivery Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={onTimeHistoryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[85, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'On-Time Percentage']} />
                      <Legend />
                      <ReferenceLine y={95} stroke="red" strokeDasharray="3 3" >
                        <Label value="Target 95%" position="right" />
                      </ReferenceLine>
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="On-Time %"
                        stroke="#0088FE"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Delay Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={delayDistribution}
                      margin={{ top: 20, right: 20, bottom: 5, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="delay" 
                        label={{ value: 'Delay (minutes)', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        label={{ value: '% of Deliveries', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage of Deliveries']} />
                      <Bar dataKey="count" name="% of Deliveries" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4 md:col-span-2">
                <h3 className="font-medium mb-4">Delivery Performance Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Key On-Time Performance Factors</h4>
                    <ul className="space-y-3">
                      <li className="flex gap-2 items-start">
                        <Timer className="h-5 w-5 mt-0.5 text-green-500" />
                        <div>
                          <span className="font-medium block">Dispatch Timing</span>
                          <span className="text-sm text-muted-foreground">Optimizing dispatch schedules improved on-time performance by 3.8%</span>
                        </div>
                      </li>
                      <li className="flex gap-2 items-start">
                        <MapPinIcon className="h-5 w-5 mt-0.5 text-blue-500" />
                        <div>
                          <span className="font-medium block">Route Optimization</span>
                          <span className="text-sm text-muted-foreground">Dynamic routing decreased average delivery time by 18 minutes</span>
                        </div>
                      </li>
                      <li className="flex gap-2 items-start">
                        <TruckIcon className="h-5 w-5 mt-0.5 text-amber-500" />
                        <div>
                          <span className="font-medium block">Vehicle Selection</span>
                          <span className="text-sm text-muted-foreground">Right-sizing vehicles for delivery zones improved efficiency by 5.2%</span>
                        </div>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Calendar className="h-5 w-5 mt-0.5 text-purple-500" />
                        <div>
                          <span className="font-medium block">Time Window Planning</span>
                          <span className="text-sm text-muted-foreground">Restructured delivery time windows reduced missed deliveries by 7.5%</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Delay Causes Analysis</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Traffic Congestion</span>
                          <span className="text-sm">42%</span>
                        </div>
                        <Progress value={42} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Weather Conditions</span>
                          <span className="text-sm">18%</span>
                        </div>
                        <Progress value={18} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Loading Delays</span>
                          <span className="text-sm">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Customer Availability</span>
                          <span className="text-sm">12%</span>
                        </div>
                        <Progress value={12} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Vehicle Issues</span>
                          <span className="text-sm">8%</span>
                        </div>
                        <Progress value={8} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Other Factors</span>
                          <span className="text-sm">5%</span>
                        </div>
                        <Progress value={5} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 