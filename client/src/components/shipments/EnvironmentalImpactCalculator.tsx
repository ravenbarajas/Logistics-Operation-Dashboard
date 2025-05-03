import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Shipment } from "@shared/schema";
import { 
  Leaf, 
  FuelIcon, 
  TruckIcon, 
  CloudIcon, 
  DropletIcon, 
  TimerIcon, 
  BarChart3Icon,
  ArrowDownIcon,
  ArrowUpIcon,
  ThermometerIcon,
  TreesIcon
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shipmentService } from "@/services/shipmentService";

interface EnvironmentalImpactCalculatorProps {
  shipments: Shipment[];
}

interface EmissionMetric {
  name: string;
  value: number;
  change: number;
  unit: string;
  status: "positive" | "negative" | "neutral";
}

export function EnvironmentalImpactCalculator({ shipments }: EnvironmentalImpactCalculatorProps) {
  const [emissionMetrics, setEmissionMetrics] = useState<EmissionMetric[]>([]);
  const [emissionsByVehicleType, setEmissionsByVehicleType] = useState<any[]>([]);
  const [emissionsTrend, setEmissionsTrend] = useState<any[]>([]);
  const [fuelConsumption, setFuelConsumption] = useState<any[]>([]);
  const [comparisonPeriod, setComparisonPeriod] = useState("quarter");
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [emissionsPerMile, setEmissionsPerMile] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // COLORS for charts
  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#3F51B5'];
  
  useEffect(() => {
    loadEnvironmentalData();
  }, [shipments, comparisonPeriod]);
  
  const loadEnvironmentalData = async () => {
    setIsLoading(true);
    try {
      const data = await shipmentService.getEnvironmentalImpactData();
      
      // Set emission metrics
      setEmissionMetrics(data.metrics as EmissionMetric[]);
      
      // Set vehicle type emissions data
      setEmissionsByVehicleType(data.vehicleTypes);
      
      // Set emissions trend data
      setEmissionsTrend(data.emissionsTrend);
      
      // Set fuel consumption data
      setFuelConsumption(data.fuelConsumption);
      
      // Calculate summary data
      // Sum up total distance from all shipments
      const distance = shipments.reduce((total, shipment) => {
        return total + ((shipment as any).distance || 0);
      }, 0);
      
      setTotalDistance(distance);
      
      // Calculate emissions based on vehicle types and distances
      const calculatedTotalEmissions = Math.round(distance * 0.42); // 0.42 kg CO2 per mile
      setTotalEmissions(calculatedTotalEmissions);
      
      // Calculate emissions per mile
      setEmissionsPerMile(distance > 0 ? calculatedTotalEmissions / distance : 0);
    } catch (error) {
      console.error("Error loading environmental impact data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format change value with + or - prefix and unit
  const formatChange = (value: number, unit: string) => {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value}${unit}`;
  };
  
  return (
    <div className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border">
            <CardContent className="p-4 flex flex-col items-center">
              <FuelIcon className="h-8 w-8 text-amber-500 mb-2" />
              <div className="text-xl font-bold">{totalEmissions.toLocaleString()} kg</div>
              <div className="text-sm text-muted-foreground">Total CO2 Emissions</div>
              <div className="text-xs text-green-500 mt-1">4.2% below target</div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardContent className="p-4 flex flex-col items-center">
              <TruckIcon className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-xl font-bold">{totalDistance.toLocaleString()} miles</div>
              <div className="text-sm text-muted-foreground">Total Distance</div>
              <div className="text-xs text-muted-foreground mt-1">Across {shipments.length} shipments</div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardContent className="p-4 flex flex-col items-center">
              <CloudIcon className="h-8 w-8 text-gray-500 mb-2" />
              <div className="text-xl font-bold">{emissionsPerMile.toFixed(2)} kg/mile</div>
              <div className="text-sm text-muted-foreground">Emissions per Mile</div>
              <HoverCard>
                <HoverCardTrigger>
                  <div className="text-xs underline text-blue-500 mt-1 cursor-help">
                    How does this compare?
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="text-sm">
                    <strong>Industry averages:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Diesel trucks: 0.5-0.9 kg/mile</li>
                      <li>• Hybrid vehicles: 0.3-0.5 kg/mile</li>
                      <li>• Electric vehicles: 0.1-0.2 kg/mile</li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {emissionMetrics.map((metric, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">{metric.name}</div>
              <div className="text-2xl font-bold mb-1">
                {metric.value} {metric.unit}
              </div>
              <div className={`text-sm flex items-center ${
                metric.status === 'positive' ? 'text-green-500' : 
                metric.status === 'negative' ? 'text-red-500' : 'text-amber-500'
              }`}>
                {metric.status === 'positive' ? 
                  <ArrowDownIcon className="h-4 w-4 mr-1" /> : 
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                }
                {formatChange(metric.change, metric.unit)} from last {comparisonPeriod}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-4">
              <BarChart3Icon className="h-5 w-5 mr-2 text-blue-500" />
              <div className="font-medium">Emissions by Vehicle Type</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={emissionsByVehicleType}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" label={{ value: '%', position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'kg CO2', position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="value" name="Fleet %" fill="#2196F3" />
                  <Bar yAxisId="right" dataKey="emissions" name="Emissions (kg CO2)" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TreesIcon className="h-5 w-5 mr-2 text-green-500" />
                <div className="font-medium">Emissions Trend</div>
              </div>
              <Select
                value={comparisonPeriod}
                onValueChange={setComparisonPeriod}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="quarter">Quarterly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={emissionsTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="emissions"
                    name="CO2 Emissions (kg)"
                    stroke="#F44336"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="target"
                    name="Target (kg)"
                    stroke="#9E9E9E"
                    strokeDasharray="5 5"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="distance"
                    name="Distance (miles)"
                    stroke="#2196F3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <DropletIcon className="h-5 w-5 mr-2 text-amber-500" />
            <div className="font-medium">Fuel Consumption & Emissions</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fuelConsumption}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="consumption" name="Consumption" fill="#FF9800" />
                <Bar yAxisId="left" dataKey="cost" name="Cost ($)" fill="#9C27B0" />
                <Bar yAxisId="right" dataKey="emissions" name="Emissions (kg)" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </div>
  );
} 