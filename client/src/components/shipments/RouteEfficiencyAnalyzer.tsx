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
} from "recharts";
import { Shipment } from "@shared/schema";
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  RouteIcon,
  ClockIcon,
  FuelIcon,
  TruckIcon,
  ActivityIcon,
  AlertTriangleIcon
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

interface RouteEfficiencyAnalyzerProps {
  shipments: Shipment[];
}

interface EfficiencyMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  delta?: number;
  status?: "positive" | "negative" | "neutral";
}

export function RouteEfficiencyAnalyzer({ shipments }: RouteEfficiencyAnalyzerProps) {
  const [activeTab, setActiveTab] = useState("metrics");
  const [timeframe, setTimeframe] = useState("week");
  const [routeMetrics, setRouteMetrics] = useState<EfficiencyMetric[]>([]);
  const [routeData, setRouteData] = useState<any[]>([]);
  const [routeComparisonData, setRouteComparisonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load data from service
    const loadData = async () => {
      setIsLoading(true);
      try {
        const efficiencyData = await shipmentService.getRouteEfficiencyData();
        
        // Set route metrics - ensure they match EfficiencyMetric type
        setRouteMetrics(efficiencyData.metrics as EfficiencyMetric[]);
        
        // Set route data
        setRouteData(efficiencyData.routeData);
        
        // Set comparison data based on timeframe
        setRouteComparisonData(
          timeframe === "week" 
            ? efficiencyData.weeklyComparison 
            : efficiencyData.monthlyComparison
        );
      } catch (error) {
        console.error("Error loading route efficiency data:", error);
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
    <div className="overflow-hidden">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="metrics">Efficiency Metrics</TabsTrigger>
            <TabsTrigger value="routes">Route Comparison</TabsTrigger>
            <TabsTrigger value="trends">Efficiency Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {routeMetrics.map((metric, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{metric.name}</div>
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
                        metric.status === "positive" ? "bg-green-500" : 
                        metric.status === "negative" ? "bg-red-500" : "bg-amber-500"
                      }`} 
                      style={{ width: `${(metric.value / (metric.target * 1.2)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="routes" className="pt-2">
            <div className="border rounded-md p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={routeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="route" 
                      className="text-xs" 
                    />
                    <YAxis yAxisId="left" orientation="left" label={{ value: '%', position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'hours', position: 'insideRight' }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="efficiency" name="Efficiency %" fill="#4CAF50" />
                    <Bar yAxisId="right" dataKey="actualTime" name="Actual Time (hrs)" fill="#2196F3" />
                    <Bar yAxisId="right" dataKey="plannedTime" name="Planned Time (hrs)" fill="#9E9E9E" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="pt-2">
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="font-medium">Route Efficiency Over Time</div>
                <div>
                  <Select
                    value={timeframe}
                    onValueChange={setTimeframe}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Weekly</SelectItem>
                      <SelectItem value="month">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={routeComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" domain={[75, 100]} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="actual"
                      name="Actual Efficiency %"
                      stroke="#4CAF50"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="target"
                      name="Target Efficiency %"
                      stroke="#9E9E9E"
                      strokeDasharray="5 5"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="timeVariance"
                      name="Time Variance (min)"
                      stroke="#F44336"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
} 