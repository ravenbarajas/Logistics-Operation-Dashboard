import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Route, 
  MapPin, 
  Truck, 
  Plus, 
  Clock, 
  Fuel, 
  RotateCcw,
  BarChart4,
  ArrowRight,
  Settings
} from "lucide-react";
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
  Cell
} from 'recharts';

// Route Data
const routes = [
  {
    id: "RT-3421",
    name: "Los Angeles to San Francisco",
    stops: 5,
    distance: "382 mi",
    duration: "5h 45m",
    status: "active",
    vehicle: "Truck #T-245",
    driver: "Michael Brown",
    fuelConsumption: "48 gal",
    co2Emission: "490 kg",
    startTime: "07:30 AM",
    expectedArrival: "01:15 PM"
  },
  {
    id: "RT-3422",
    name: "Seattle to Portland",
    stops: 3,
    distance: "174 mi",
    duration: "2h 50m",
    status: "active",
    vehicle: "Truck #T-248",
    driver: "Sarah Johnson",
    fuelConsumption: "22 gal",
    co2Emission: "225 kg",
    startTime: "08:00 AM",
    expectedArrival: "10:50 AM"
  },
  {
    id: "RT-3423",
    name: "Denver to Kansas City",
    stops: 4,
    distance: "600 mi",
    duration: "8h 30m",
    status: "scheduled",
    vehicle: "Truck #T-246",
    driver: "James Wilson",
    fuelConsumption: "75 gal",
    co2Emission: "760 kg",
    startTime: "06:00 AM",
    expectedArrival: "02:30 PM"
  },
  {
    id: "RT-3424",
    name: "Chicago to Indianapolis",
    stops: 2,
    distance: "183 mi",
    duration: "3h 10m",
    status: "completed",
    vehicle: "Van #V-427",
    driver: "Lisa Chen",
    fuelConsumption: "18 gal",
    co2Emission: "185 kg",
    startTime: "09:30 AM",
    expectedArrival: "12:40 PM"
  },
  {
    id: "RT-3425",
    name: "New York to Boston",
    stops: 3,
    distance: "215 mi",
    duration: "3h 45m",
    status: "scheduled",
    vehicle: "Van #V-428",
    driver: "David Martinez",
    fuelConsumption: "20 gal",
    co2Emission: "205 kg",
    startTime: "08:30 AM",
    expectedArrival: "12:15 PM"
  }
];

// Optimization summary data
const optimizationData = [
  { name: 'Before', distance: 1650, time: 24.5, fuel: 195, emissions: 1980 },
  { name: 'After', distance: 1554, time: 22.8, fuel: 183, emissions: 1865 }
];

// Efficiency improvement data
const efficiencyData = [
  { 
    name: 'Seattle to Portland', 
    distanceSaved: 12, 
    timeSaved: 0.3, 
    fuelSaved: 1.5, 
    emissionsSaved: 15 
  },
  { 
    name: 'Los Angeles to San Francisco', 
    distanceSaved: 28, 
    timeSaved: 0.5, 
    fuelSaved: 3.2, 
    emissionsSaved: 32 
  },
  { 
    name: 'Denver to Kansas City', 
    distanceSaved: 36, 
    timeSaved: 0.7, 
    fuelSaved: 4.5, 
    emissionsSaved: 45 
  },
  { 
    name: 'Chicago to Indianapolis', 
    distanceSaved: 8, 
    timeSaved: 0.2, 
    fuelSaved: 0.8, 
    emissionsSaved: 8 
  },
  { 
    name: 'New York to Boston', 
    distanceSaved: 12, 
    timeSaved: 0.3, 
    fuelSaved: 1.5, 
    emissionsSaved: 15 
  }
];

// Monthly trend data
const monthlyTrendData = [
  { month: 'Mar', distance: 32400, fuel: 4050, emissions: 41200 },
  { month: 'Apr', distance: 31800, fuel: 3980, emissions: 40500 },
  { month: 'May', distance: 30500, fuel: 3820, emissions: 38800 },
  { month: 'Jun', distance: 29200, fuel: 3650, emissions: 37100 },
  { month: 'Jul', distance: 28400, fuel: 3550, emissions: 36100 },
  { month: 'Aug', distance: 27500, fuel: 3440, emissions: 34900 },
];

export default function RouteOptimization() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Route Optimization</h1>
          <p className="text-muted-foreground">Optimize delivery routes for efficiency and cost savings</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button>
            <Route className="mr-2 h-4 w-4" />
            New Route Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Total</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">5</h3>
              <p className="text-muted-foreground text-sm">Active Routes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-muted-foreground text-sm">Total</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">17</h3>
              <p className="text-muted-foreground text-sm">Delivery Stops</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <span className="text-muted-foreground text-sm">Saved</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">1h 45m</h3>
              <p className="text-muted-foreground text-sm">Time Saved Today</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Fuel className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-muted-foreground text-sm">Saved</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">12%</h3>
              <p className="text-muted-foreground text-sm">Fuel Efficiency Gain</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Optimization Summary</CardTitle>
            <CardDescription>Comparison of routes before and after optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={optimizationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    yAxisId="left"
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                    label={{ value: 'Distance (mi)', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                    label={{ value: 'Time (hr)', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="distance" name="Distance (mi)" fill="hsl(var(--primary))" />
                  <Bar yAxisId="left" dataKey="fuel" name="Fuel (gal)" fill="#82ca9d" />
                  <Bar yAxisId="right" dataKey="time" name="Time (hr)" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="emissions" name="CO2 (kg)" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Route Efficiency Improvements</CardTitle>
            <CardDescription>Savings per route after optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={efficiencyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                    width={150}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="distanceSaved" name="Distance Saved (mi)" fill="hsl(var(--primary))" />
                  <Bar dataKey="timeSaved" name="Time Saved (hr)" fill="#8884d8" />
                  <Bar dataKey="fuelSaved" name="Fuel Saved (gal)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Efficiency Trend</CardTitle>
            <CardDescription>Showing route optimization gains over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrendData}
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
                    dataKey="distance" 
                    name="Total Distance (mi)"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fuel" 
                    name="Fuel Consumption (gal)"
                    stroke="#82ca9d" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emissions" 
                    name="CO2 Emissions (kg)"
                    stroke="#ffc658" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>New Route Optimization</CardTitle>
          <CardDescription>Generate optimized routes based on your preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Location</label>
                <Input placeholder="Enter start location" value="Los Angeles Distribution Center" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Stops</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Enter stop address" value="San Diego, CA" />
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Enter stop address" value="Irvine, CA" />
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Enter stop address" value="Bakersfield, CA" />
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Stop
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">End Location (Optional)</label>
                <Input placeholder="Enter end location" value="Los Angeles Distribution Center" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                <Select defaultValue="truck_large">
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck_large">Large Truck (53ft)</SelectItem>
                    <SelectItem value="truck_medium">Medium Truck (26ft)</SelectItem>
                    <SelectItem value="van">Delivery Van</SelectItem>
                    <SelectItem value="ev_van">Electric Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Departure Time</label>
                <Input type="time" value="08:00" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <Input type="date" value="2023-08-21" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Driver</label>
                <Select defaultValue="michael">
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="michael">Michael Brown</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="james">James Wilson</SelectItem>
                    <SelectItem value="lisa">Lisa Chen</SelectItem>
                    <SelectItem value="david">David Martinez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Optimization Priority</label>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Distance</span>
                      <span className="text-sm font-medium">High</span>
                    </div>
                    <Slider defaultValue={[80]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Time</span>
                      <span className="text-sm font-medium">Very High</span>
                    </div>
                    <Slider defaultValue={[90]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Fuel Efficiency</span>
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                    <Slider defaultValue={[60]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">CO2 Emissions</span>
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Generate Optimized Route
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Routes</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="templates">Route Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Active Routes</CardTitle>
              <CardDescription>Monitor and manage ongoing delivery routes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Vehicle / Driver</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.filter(route => route.status === 'active').map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.id}</TableCell>
                      <TableCell>{route.name}</TableCell>
                      <TableCell>
                        <div>
                          <div>{route.vehicle}</div>
                          <div className="text-sm text-muted-foreground">{route.driver}</div>
                        </div>
                      </TableCell>
                      <TableCell>{route.stops}</TableCell>
                      <TableCell>{route.distance}</TableCell>
                      <TableCell>{route.duration}</TableCell>
                      <TableCell>
                        <div>
                          <div>Start: {route.startTime}</div>
                          <div className="text-sm text-muted-foreground">ETA: {route.expectedArrival}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={route.status === 'active' ? 'success' : 'secondary'}>
                          {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Scheduled Routes</CardTitle>
              <CardDescription>Upcoming planned delivery routes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Vehicle / Driver</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.filter(route => route.status === 'scheduled').map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.id}</TableCell>
                      <TableCell>{route.name}</TableCell>
                      <TableCell>
                        <div>
                          <div>{route.vehicle}</div>
                          <div className="text-sm text-muted-foreground">{route.driver}</div>
                        </div>
                      </TableCell>
                      <TableCell>{route.stops}</TableCell>
                      <TableCell>{route.distance}</TableCell>
                      <TableCell>{route.duration}</TableCell>
                      <TableCell>
                        <div>
                          <div>Start: {route.startTime}</div>
                          <div className="text-sm text-muted-foreground">ETA: {route.expectedArrival}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={route.status === 'active' ? 'success' : 'warning'}>
                          {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Completed Routes</CardTitle>
              <CardDescription>Historical route data and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Vehicle / Driver</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Fuel / CO2</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.filter(route => route.status === 'completed').map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.id}</TableCell>
                      <TableCell>{route.name}</TableCell>
                      <TableCell>
                        <div>
                          <div>{route.vehicle}</div>
                          <div className="text-sm text-muted-foreground">{route.driver}</div>
                        </div>
                      </TableCell>
                      <TableCell>{route.stops}</TableCell>
                      <TableCell>{route.distance}</TableCell>
                      <TableCell>{route.duration}</TableCell>
                      <TableCell>
                        <div>
                          <div>Fuel: {route.fuelConsumption}</div>
                          <div className="text-sm text-muted-foreground">CO2: {route.co2Emission}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Route templates would be displayed here. These are reusable route patterns for frequent deliveries.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}