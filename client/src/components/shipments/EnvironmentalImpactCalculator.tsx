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
  
  // COLORS for charts
  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#3F51B5'];
  
  useEffect(() => {
    calculateEnvironmentalMetrics();
    generateEmissionsData();
  }, [shipments, comparisonPeriod]);
  
  const calculateEnvironmentalMetrics = () => {
    // Sum total distance from all shipments
    const distance = shipments.reduce((total, shipment) => {
      return total + ((shipment as any).distance || 0);
    }, 0);
    
    setTotalDistance(distance);
    
    // Calculate emissions based on vehicle types and distances
    const calculatedTotalEmissions = Math.round(distance * 0.42); // 0.42 kg CO2 per mile as a simple estimation
    setTotalEmissions(calculatedTotalEmissions);
    
    // Calculate emissions per mile
    setEmissionsPerMile(distance > 0 ? calculatedTotalEmissions / distance : 0);
    
    // Set metrics with some sample data
    setEmissionMetrics([
      {
        name: "CO2 Emissions",
        value: calculatedTotalEmissions,
        change: -4.2,
        unit: "kg",
        status: "positive"
      },
      {
        name: "Fuel Efficiency",
        value: 8.6,
        change: 0.4,
        unit: "mpg",
        status: "positive"
      },
      {
        name: "Alternative Fuel Usage",
        value: 12.8,
        change: 2.7,
        unit: "%",
        status: "positive"
      },
      {
        name: "Empty Miles",
        value: 8.4,
        change: -1.3,
        unit: "%",
        status: "positive"
      }
    ]);
  };
  
  const generateEmissionsData = () => {
    // Generate vehicle type emissions data
    const vehicleData = [
      { name: "Diesel Truck", value: 62, emissions: 248 },
      { name: "Electric Van", value: 8, emissions: 16 },
      { name: "Hybrid Truck", value: 15, emissions: 45 },
      { name: "CNG Truck", value: 10, emissions: 28 },
      { name: "Traditional Van", value: 5, emissions: 15 }
    ];
    
    setEmissionsByVehicleType(vehicleData);
    
    // Generate emissions trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    const trendData = Array(12).fill(0).map((_, index) => {
      // Create a pattern with a general downward trend
      const baseEmission = 650 - (index * 15) + (Math.random() * 50 - 25);
      const target = 500 - (index * 10);
      
      return {
        name: months[index],
        emissions: Math.max(0, Math.round(baseEmission)),
        target: Math.round(target),
        distance: Math.round(baseEmission * 2.3),
        isCurrent: index === currentMonth
      };
    });
    
    setEmissionsTrend(trendData);
    
    // Generate fuel consumption data
    const fuelData = [
      { name: "Diesel", consumption: 3840, cost: 14592, emissions: 248 },
      { name: "Gasoline", consumption: 1260, cost: 4536, emissions: 96 },
      { name: "Electricity", consumption: 4800, cost: 720, emissions: 16 }, // kWh
      { name: "CNG", consumption: 3200, cost: 3840, emissions: 28 }, // GGE
    ];
    
    setFuelConsumption(fuelData);
  };
  
  // Format change value with + or - prefix and unit
  const formatChange = (value: number, unit: string) => {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value}${unit}`;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              <div className="flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-green-500" />
                Environmental Impact Analysis
              </div>
            </CardTitle>
            <CardDescription>
              Carbon footprint and sustainability metrics for your logistics operations
            </CardDescription>
          </div>
          <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4">
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
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="emissions" 
                    name="CO2 Emissions (kg)" 
                    fill="#4CAF50" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-4">
              <DropletIcon className="h-5 w-5 mr-2 text-amber-500" />
              <div className="font-medium">Fuel Consumption Analysis</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fuelConsumption}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="consumption"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {fuelConsumption.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value, name, props) => {
                      if (name === "consumption") {
                        const fuelType = props.payload.name;
                        return [`${value} ${fuelType === "Electricity" ? "kWh" : fuelType === "CNG" ? "GGE" : "gallons"}`, "Consumption"];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <TimerIcon className="h-5 w-5 mr-2 text-blue-500" />
            <div className="font-medium">Emissions Trend Over Time</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={emissionsTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs" 
                  tick={{fill: 'hsl(var(--foreground))'}}
                />
                <YAxis 
                  className="text-xs" 
                  tick={{fill: 'hsl(var(--foreground))'}}
                  yAxisId="left"
                />
                <YAxis 
                  className="text-xs" 
                  tick={{fill: 'hsl(var(--foreground))'}}
                  yAxisId="right"
                  orientation="right"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }}
                />
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
                  name="Target Emissions (kg)" 
                  stroke="#4CAF50"
                  strokeDasharray="5 5"
                  strokeWidth={2}
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
        
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
          <div className="flex items-start">
            <TreesIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
            <div>
              <div className="font-medium mb-1">Sustainability Initiatives</div>
              <div className="text-sm text-muted-foreground mb-4">
                Based on your current emissions, here are the sustainability initiatives that could have the most impact:
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
                  <div className="font-medium text-sm mb-1">Electric Vehicle Transition</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Potential reduction of 120,000 kg CO2/year
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                    <div className="h-full bg-green-500" style={{ width: "75%" }} />
                  </div>
                  <div className="text-xs text-right mt-1 text-muted-foreground">
                    Impact: High
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
                  <div className="font-medium text-sm mb-1">Route Optimization</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Potential reduction of 84,000 kg CO2/year
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                    <div className="h-full bg-green-500" style={{ width: "60%" }} />
                  </div>
                  <div className="text-xs text-right mt-1 text-muted-foreground">
                    Impact: Medium
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
                  <div className="font-medium text-sm mb-1">Load Consolidation</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Potential reduction of 65,000 kg CO2/year
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                    <div className="h-full bg-green-500" style={{ width: "45%" }} />
                  </div>
                  <div className="text-xs text-right mt-1 text-muted-foreground">
                    Impact: Medium
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 