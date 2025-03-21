import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  Calendar, 
  Download, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Share2, 
  RefreshCw 
} from "lucide-react";
import { fuelConsumptionData, deliveryPerformanceData } from "@/data/mock-data";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Analytics() {
  // Sample data for various charts
  const monthlyDeliveries = [
    { name: "Jan", total: 452 },
    { name: "Feb", total: 478 },
    { name: "Mar", total: 512 },
    { name: "Apr", total: 495 },
    { name: "May", total: 540 },
    { name: "Jun", total: 580 },
    { name: "Jul", total: 605 },
    { name: "Aug", total: 617 },
    { name: "Sep", total: 589 },
    { name: "Oct", total: 570 },
    { name: "Nov", total: 610 },
    { name: "Dec", total: 652 },
  ];
  
  const routeEfficiencyData = [
    { route: "SF to LA", plannedTime: 8.2, actualTime: 8.5, efficiency: 96 },
    { route: "Portland to Seattle", plannedTime: 3.1, actualTime: 3.0, efficiency: 103 },
    { route: "LA to Las Vegas", plannedTime: 4.5, actualTime: 4.2, efficiency: 107 },
    { route: "Seattle to Boise", plannedTime: 7.3, actualTime: 7.9, efficiency: 92 },
    { route: "SF to Portland", plannedTime: 9.5, actualTime: 10.2, efficiency: 93 },
    { route: "LA to Phoenix", plannedTime: 5.8, actualTime: 5.7, efficiency: 102 },
  ];
  
  const transportModeData = [
    { name: "Truck", value: 65 },
    { name: "Van", value: 20 },
    { name: "Rail", value: 10 },
    { name: "Air", value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <div className="flex gap-2">
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6,290</div>
            <p className="text-xs text-muted-foreground">+8.2% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">94.8%</div>
            <p className="text-xs text-muted-foreground">+2.4% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5 hrs</div>
            <p className="text-xs text-muted-foreground">-5% from previous month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">8.2 mpg</div>
            <p className="text-xs text-muted-foreground">+0.4 mpg from target</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Deliveries</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="2023">
                  <SelectTrigger className="w-[100px] h-8">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>Number of deliveries completed each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyDeliveries}>
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
                  <Bar 
                    dataKey="total" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Delivery Performance</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="quarter">
                  <SelectTrigger className="w-[130px] h-8">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>On-time vs late delivery performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={deliveryPerformanceData}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
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
                  <Area 
                    type="monotone" 
                    dataKey="onTime" 
                    stackId="1" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.6}
                    name="On Time"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="late" 
                    stackId="1" 
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive))" 
                    fillOpacity={0.6}
                    name="Late"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Route Efficiency Analysis</CardTitle>
            <CardDescription>Planned vs actual delivery times by route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={routeEfficiencyData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    dataKey="route" 
                    type="category" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="plannedTime" name="Planned Time (hrs)" fill="hsl(var(--primary))" />
                  <Bar dataKey="actualTime" name="Actual Time (hrs)" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transport Mode Distribution</CardTitle>
            <CardDescription>Breakdown of shipments by transport type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transportModeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {transportModeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="fuel" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="fuel">Fuel Analytics</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Consumption Trends</CardTitle>
              <CardDescription>Monthly consumption patterns across fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={fuelConsumptionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
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
                    <Line 
                      type="monotone" 
                      dataKey="diesel" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line type="monotone" dataKey="gasoline" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="electric" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cost">
          <Card>
            <CardHeader>
              <CardTitle>Operational Cost Breakdown</CardTitle>
              <CardDescription>Analysis of transportation costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Fuel', value: 42 },
                        { name: 'Maintenance', value: 18 },
                        { name: 'Driver Wages', value: 28 },
                        { name: 'Insurance', value: 8 },
                        { name: 'Other', value: 4 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {transportModeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sustainability">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Footprint</CardTitle>
              <CardDescription>CO2 emissions by transport mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Q1', truck: 145, train: 45, electric: 20 },
                      { name: 'Q2', truck: 158, train: 48, electric: 28 },
                      { name: 'Q3', truck: 132, train: 52, electric: 35 },
                      { name: 'Q4', truck: 142, train: 50, electric: 40 },
                    ]}
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
                    <Bar dataKey="truck" name="Diesel Trucks" fill="#FF8042" />
                    <Bar dataKey="train" name="Rail Transport" fill="#FFBB28" />
                    <Bar dataKey="electric" name="Electric Vehicles" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}