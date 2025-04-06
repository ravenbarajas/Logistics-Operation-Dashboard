import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, TrendingUp, Clock, AlertTriangle, Fuel, 
  MapPin, Award, ThumbsUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DriverPerformance {
  id: string;
  name: string;
  avatar?: string;
  safetyScore: number;
  fuelEfficiency: number;
  timeManagement: number;
  vehicleHandling: number;
  customerSatisfaction: number;
  idleTime: number;
  mileage: number;
  trips: number;
  incidents: number;
}

interface DriversPerformanceAnalyzerProps {
  drivers: DriverPerformance[];
  selectedDriverId?: string;
  onSelectDriver?: (driverId: string) => void;
}

const COLORS = ['#16a34a', '#eab308', '#dc2626', '#3b82f6', '#8b5cf6'];

export function DriversPerformanceAnalyzer({ 
  drivers, 
  selectedDriverId, 
  onSelectDriver 
}: DriversPerformanceAnalyzerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDriver, setSelectedDriver] = useState(
    selectedDriverId || (drivers.length > 0 ? drivers[0].id : '')
  );
  
  // Find the currently selected driver
  const currentDriver = drivers.find(d => d.id === selectedDriver) || drivers[0];

  const handleDriverChange = (driverId: string) => {
    setSelectedDriver(driverId);
    if (onSelectDriver) {
      onSelectDriver(driverId);
    }
  };

  // Sample historical data
  const performanceHistory = [
    { month: 'Oct', safety: 88, efficiency: 76, time: 92 },
    { month: 'Nov', safety: 90, efficiency: 78, time: 94 },
    { month: 'Dec', safety: 92, efficiency: 85, time: 93 },
    { month: 'Jan', safety: 89, efficiency: 84, time: 90 },
    { month: 'Feb', safety: 91, efficiency: 87, time: 89 },
    { month: 'Mar', safety: 94, efficiency: 90, time: 91 },
  ];

  // Sample comparison data (between drivers)
  const driverComparison = drivers.map(driver => ({
    name: driver.name.split(' ')[0],
    safety: driver.safetyScore,
    efficiency: driver.fuelEfficiency,
    timeManagement: driver.timeManagement,
  }));

  // Driver rankings
  const driverRankings = [...drivers]
    .sort((a, b) => 
      ((a.safetyScore + a.fuelEfficiency + a.timeManagement + a.vehicleHandling + a.customerSatisfaction) / 5) - 
      ((b.safetyScore + b.fuelEfficiency + b.timeManagement + b.vehicleHandling + b.customerSatisfaction) / 5)
    )
    .reverse()
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        
        <div className="mt-2 md:mt-0">
          <select 
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={selectedDriver}
            onChange={(e) => handleDriverChange(e.target.value)}
          >
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="comparison">Driver Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {currentDriver && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Driver Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentDriver.avatar} />
                    <AvatarFallback>{currentDriver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{currentDriver.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-green-500">Safety Score: {currentDriver.safetyScore}%</Badge>
                      <Badge className="bg-blue-500">{currentDriver.trips} Trips</Badge>
                      <Badge className="bg-amber-500">{currentDriver.mileage.toLocaleString()} Miles</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Performance Trends
                </CardTitle>
                <CardDescription>
                  Key metrics over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" domain={[60, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`]}
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="safety" 
                        name="Safety Score" 
                        stroke="#16a34a" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="efficiency" 
                        name="Fuel Efficiency" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="time" 
                        name="Time Management" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Current performance rating by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { name: 'Safety', value: currentDriver.safetyScore },
                        { name: 'Fuel', value: currentDriver.fuelEfficiency },
                        { name: 'Time', value: currentDriver.timeManagement },
                        { name: 'Handling', value: currentDriver.vehicleHandling },
                        { name: 'Customer', value: currentDriver.customerSatisfaction },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-xs" />
                      <YAxis dataKey="name" type="category" className="text-xs" width={70} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`]}
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 4, 4, 0]}
                        label={{ position: 'right', formatter: (value) => `${value}%` }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Idle Time
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-col items-center py-4">
                  <div className="text-5xl font-bold text-blue-500 mb-2">{currentDriver.idleTime}%</div>
                  <p className="text-sm text-muted-foreground text-center">
                    Vehicle idle time percentage
                  </p>
                  <Badge className="mt-2" variant={currentDriver.idleTime < 15 ? "default" : "destructive"}>
                    {currentDriver.idleTime < 15 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                  Incidents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-col items-center py-4">
                  <div className="text-5xl font-bold text-amber-500 mb-2">{currentDriver.incidents}</div>
                  <p className="text-sm text-muted-foreground text-center">
                    Reported incidents in past 12 months
                  </p>
                  <Badge 
                    className="mt-2" 
                    variant={currentDriver.incidents === 0 ? "default" : 
                             currentDriver.incidents < 2 ? "secondary" : "destructive"}
                  >
                    {currentDriver.incidents === 0 ? "Excellent" : 
                     currentDriver.incidents < 2 ? "Good" : "Attention Required"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Fuel className="h-5 w-5 mr-2 text-primary" />
                  Fuel Economy
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-col items-center py-4">
                  <div className="text-5xl font-bold text-green-500 mb-2">{currentDriver.fuelEfficiency}%</div>
                  <p className="text-sm text-muted-foreground text-center">
                    Fuel efficiency rating
                  </p>
                  <Badge 
                    className="mt-2" 
                    variant={currentDriver.fuelEfficiency > 85 ? "default" : 
                             currentDriver.fuelEfficiency > 70 ? "secondary" : "destructive"}
                  >
                    {currentDriver.fuelEfficiency > 85 ? "Excellent" : 
                     currentDriver.fuelEfficiency > 70 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <ThumbsUp className="h-5 w-5 mr-2 text-primary" />
                Driver Rankings
              </CardTitle>
              <CardDescription>
                Top performing drivers across all metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {driverRankings.map((driver, index) => {
                  const average = Math.round(
                    (driver.safetyScore + driver.fuelEfficiency + 
                     driver.timeManagement + driver.vehicleHandling + 
                     driver.customerSatisfaction) / 5
                  );
                  
                  return (
                    <div key={driver.id} className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0 ? 'bg-amber-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-amber-700' :
                        'bg-gray-200 dark:bg-gray-800'
                      } text-white font-bold`}>
                        {index + 1}
                      </div>
                      
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={driver.avatar} />
                        <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {driver.trips} trips • {driver.mileage.toLocaleString()} miles
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <Badge variant={
                          average > 90 ? "default" :
                          average > 80 ? "secondary" :
                          "outline"
                        }>
                          {average}% Overall
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Driver Performance Comparison
              </CardTitle>
              <CardDescription>
                Compare key metrics across all drivers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={driverComparison}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis domain={[50, 100]} className="text-xs" />
                    <Tooltip 
                      formatter={(value) => [`${value}%`]}
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="safety" name="Safety Score" fill="#16a34a" />
                    <Bar dataKey="efficiency" name="Fuel Efficiency" fill="#3b82f6" />
                    <Bar dataKey="timeManagement" name="Time Management" fill="#8b5cf6" />
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