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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Shipment } from "@shared/schema";
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  PackageIcon,
  BoxIcon,
  TruckIcon,
  BarChart2Icon,
  PercentIcon,
  ScaleIcon,
  PackageOpenIcon
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

// The COLORS array for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#4CAF50'];

interface ShipmentLoadUtilizationProps {
  shipments?: Shipment[];
}

interface UtilizationMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  delta?: number;
  status?: "positive" | "negative" | "neutral";
}

interface VehicleUtilization {
  vehicle: string;
  capacity: number;
  utilized: number;
  efficiency: number;
}

export function ShipmentLoadUtilization({ shipments }: ShipmentLoadUtilizationProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("month");
  const [utilizationMetrics, setUtilizationMetrics] = useState<UtilizationMetric[]>([]);
  const [vehicleUtilizationData, setVehicleUtilizationData] = useState<VehicleUtilization[]>([]);
  const [utilizationTrends, setUtilizationTrends] = useState<any[]>([]);
  const [vehicleComparison, setVehicleComparison] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load data from service or mock data
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would fetch this data from an API
        const efficiencyData = await shipmentService.getEfficiencyMetrics();
        
        // Set load utilization metrics
        setUtilizationMetrics([
          {
            name: "Average Load Utilization",
            value: efficiencyData.summary.loadUtilization,
            target: 95,
            unit: "%",
            delta: 2.3,
            status: "positive"
          },
          {
            name: "Volumetric Efficiency",
            value: 86.4,
            target: 90,
            unit: "%",
            delta: 1.8,
            status: "positive"
          },
          {
            name: "Weight Utilization",
            value: 78.9,
            target: 85,
            unit: "%",
            delta: -1.2,
            status: "negative"
          },
          {
            name: "Empty Miles Percentage",
            value: 12.5,
            target: 10,
            unit: "%",
            delta: -0.8,
            status: "positive"
          },
          {
            name: "Load Balancing Score",
            value: 8.4,
            target: 9.0,
            unit: "",
            delta: 0.3,
            status: "positive"
          },
          {
            name: "Cost per Unit Shipped",
            value: 1.24,
            target: 1.15,
            unit: "$",
            delta: -0.05,
            status: "positive"
          }
        ]);
        
        // Set vehicle utilization data
        setVehicleUtilizationData(efficiencyData.loadUtilization);
        
        // Set utilization trends data based on timeframe
        setUtilizationTrends(
          timeframe === "month" 
            ? efficiencyData.historicalTrends.loadUtilization
            : [
                { month: "Jan", value: 85.1 },
                { month: "Feb", value: 85.8 },
                { month: "Mar", value: 86.5 },
                { month: "Apr", value: 87.2 },
                { month: "May", value: 88.3 },
                { month: "Jun", value: 89.0 },
                { month: "Jul", value: 89.5 }
              ]
        );
        
        // Set vehicle comparison data
        setVehicleComparison([
          { name: 'Box Truck - Small', capacity: 100, actual: 92, target: 95 },
          { name: 'Box Truck - Large', capacity: 100, actual: 90, target: 95 },
          { name: 'Semi Trailer', capacity: 100, actual: 85, target: 90 },
          { name: 'Flatbed', capacity: 100, actual: 90, target: 95 },
          { name: 'Refrigerated Truck', capacity: 100, actual: 85, target: 90 },
          { name: 'Van', capacity: 100, actual: 95, target: 95 }
        ]);
      } catch (error) {
        console.error("Error loading load utilization data:", error);
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
            <CardTitle className="text-lg font-semibold">Shipment Load Utilization</CardTitle>
            <CardDescription>
              Analysis of load space utilization and optimization metrics
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
            <TabsTrigger value="vehicles">Vehicle Utilization</TabsTrigger>
            <TabsTrigger value="trends">Utilization Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {utilizationMetrics.map((metric, index) => (
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
                        metric.name === "Empty Miles Percentage" ? 
                          (metric.value < metric.target ? "bg-green-500" : "bg-red-500") :
                        metric.status === "positive" ? "bg-green-500" : 
                        metric.status === "negative" ? "bg-red-500" : "bg-amber-500"
                      }`} 
                      style={{ 
                        width: metric.name === "Empty Miles Percentage" ? 
                          `${(metric.value / (metric.target * 1.5)) * 100}%` :
                          `${(metric.value / (metric.target * 1.2)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="vehicles" className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Vehicle Space Utilization</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={vehicleUtilizationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="vehicle" />
                      <YAxis label={{ value: '%', position: 'insideLeft' }} domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                      <Legend />
                      <Bar dataKey="efficiency" name="Utilization %" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Capacity vs. Utilization by Vehicle Type</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={vehicleUtilizationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="vehicle" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="capacity" name="Capacity" fill="#8884d8" />
                      <Bar dataKey="utilized" name="Utilized" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4 md:col-span-2">
                <h3 className="font-medium mb-4">Vehicle Load Utilization Performance</h3>
                <div className="grid grid-cols-1 gap-4">
                  {vehicleUtilizationData.map((vehicle, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-36 font-medium truncate mr-4">{vehicle.vehicle}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">{vehicle.utilized} / {vehicle.capacity} units</span>
                          <span className="font-semibold">{vehicle.efficiency}%</span>
                        </div>
                        <Progress
                          value={vehicle.efficiency}
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
                <h3 className="font-medium mb-4">Load Utilization Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={utilizationTrends}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Load Utilization %"
                        stroke="#0088FE"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Vehicle Load Performance Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={vehicleComparison}
                      margin={{ top: 20, right: 20, bottom: 5, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="actual" name="Actual %" fill="#0088FE" />
                      <Bar dataKey="target" name="Target %" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4 md:col-span-2">
                <h3 className="font-medium mb-4">Factors Affecting Load Utilization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Package Size", value: 32 },
                            { name: "Vehicle Type", value: 25 },
                            { name: "Load Planning", value: 18 },
                            { name: "Route Constraints", value: 15 },
                            { name: "Customer Demands", value: 10 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: "Package Size", value: 32 },
                            { name: "Vehicle Type", value: 25 },
                            { name: "Load Planning", value: 18 },
                            { name: "Route Constraints", value: 15 },
                            { name: "Customer Demands", value: 10 }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Impact on Utilization']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Optimization Opportunities</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <PackageIcon className="h-5 w-5 text-blue-500" />
                        <span>Standardize packaging dimensions for better stacking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BoxIcon className="h-5 w-5 text-green-500" />
                        <span>Implement advanced load planning algorithms</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <TruckIcon className="h-5 w-5 text-amber-500" />
                        <span>Optimize vehicle selection based on load characteristics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ScaleIcon className="h-5 w-5 text-purple-500" />
                        <span>Balance weight and volume constraints</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BarChart2Icon className="h-5 w-5 text-red-500" />
                        <span>Improve forecasting for better capacity planning</span>
                      </li>
                    </ul>
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