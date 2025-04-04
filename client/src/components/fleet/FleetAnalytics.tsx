import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fuel, TrendingUp, Truck, AlertCircle, Clock, Calendar, Route } from "lucide-react";

// Types for metrics
interface VehicleMetrics {
  fuelEfficiency: number[];
  maintenanceCosts: number[];
  utilizationRate: number[];
  idleTime: number[];
}

interface FleetAnalyticsProps {
  // Sample data - in a real app this would come from an API or service
  vehicleTypes: { name: string, value: number }[];
  vehicleStatus: { name: string, value: number }[];
  fuelConsumption: { name: string, value: number }[];
  monthlyMileage: { name: string, value: number }[];
  metrics: VehicleMetrics;
}

// Define colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function FleetAnalytics({ 
  vehicleTypes, 
  vehicleStatus, 
  fuelConsumption, 
  monthlyMileage,
  metrics
}: FleetAnalyticsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Fleet Analytics</h2>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Analysis</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Vehicle Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  Vehicle Types Distribution
                </CardTitle>
                <CardDescription>Breakdown of fleet by vehicle type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vehicleTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {vehicleTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} vehicles`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Vehicle Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                  Vehicle Status
                </CardTitle>
                <CardDescription>Current status of all vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vehicleStatus}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {vehicleStatus.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.name === 'Active' ? '#16a34a' : 
                                 entry.name === 'Maintenance' ? '#eab308' : 
                                 entry.name === 'Inactive' ? '#dc2626' : COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} vehicles`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Monthly Mileage Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="h-5 w-5 mr-2 text-primary" />
                Monthly Mileage Trends
              </CardTitle>
              <CardDescription>Fleet mileage over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyMileage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} miles`, 'Distance']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Miles Traveled" 
                      stroke="#0088FE" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fuel" className="space-y-4">
          {/* Fuel Consumption by Vehicle Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-primary" />
                Fuel Consumption by Vehicle Type
              </CardTitle>
              <CardDescription>Monthly fuel usage analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fuelConsumption}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} gallons`, 'Consumption']} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Fuel Consumption (gallons)" 
                      fill="#0088FE" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Fuel Efficiency Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Fuel Efficiency Metrics
              </CardTitle>
              <CardDescription>Miles per gallon by vehicle over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: 'Jan', Truck1: metrics.fuelEfficiency[0], Truck2: metrics.fuelEfficiency[1], Truck3: metrics.fuelEfficiency[2] },
                      { name: 'Feb', Truck1: metrics.fuelEfficiency[3], Truck2: metrics.fuelEfficiency[4], Truck3: metrics.fuelEfficiency[5] },
                      { name: 'Mar', Truck1: metrics.fuelEfficiency[6], Truck2: metrics.fuelEfficiency[7], Truck3: metrics.fuelEfficiency[8] },
                      { name: 'Apr', Truck1: metrics.fuelEfficiency[9], Truck2: metrics.fuelEfficiency[10], Truck3: metrics.fuelEfficiency[11] }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} MPG`, 'Efficiency']} />
                    <Legend />
                    <Line type="monotone" dataKey="Truck1" stroke="#0088FE" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Truck2" stroke="#00C49F" />
                    <Line type="monotone" dataKey="Truck3" stroke="#FFBB28" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          {/* Maintenance Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Maintenance Costs
              </CardTitle>
              <CardDescription>Quarterly maintenance expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Q1', Repairs: metrics.maintenanceCosts[0], Routine: metrics.maintenanceCosts[1], Emergency: metrics.maintenanceCosts[2] },
                      { name: 'Q2', Repairs: metrics.maintenanceCosts[3], Routine: metrics.maintenanceCosts[4], Emergency: metrics.maintenanceCosts[5] },
                      { name: 'Q3', Repairs: metrics.maintenanceCosts[6], Routine: metrics.maintenanceCosts[7], Emergency: metrics.maintenanceCosts[8] },
                      { name: 'Q4', Repairs: metrics.maintenanceCosts[9], Routine: metrics.maintenanceCosts[10], Emergency: metrics.maintenanceCosts[11] },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
                    <Legend />
                    <Bar dataKey="Repairs" fill="#0088FE" />
                    <Bar dataKey="Routine" fill="#00C49F" />
                    <Bar dataKey="Emergency" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="utilization" className="space-y-4">
          {/* Utilization Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Vehicle Utilization Rate
              </CardTitle>
              <CardDescription>Percentage of time vehicles are in active use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: 'Jan', HeavyTrucks: metrics.utilizationRate[0], MediumTrucks: metrics.utilizationRate[1], LightVans: metrics.utilizationRate[2] },
                      { name: 'Feb', HeavyTrucks: metrics.utilizationRate[3], MediumTrucks: metrics.utilizationRate[4], LightVans: metrics.utilizationRate[5] },
                      { name: 'Mar', HeavyTrucks: metrics.utilizationRate[6], MediumTrucks: metrics.utilizationRate[7], LightVans: metrics.utilizationRate[8] },
                      { name: 'Apr', HeavyTrucks: metrics.utilizationRate[9], MediumTrucks: metrics.utilizationRate[10], LightVans: metrics.utilizationRate[11] },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                    <Legend />
                    <Line type="monotone" dataKey="HeavyTrucks" stroke="#0088FE" />
                    <Line type="monotone" dataKey="MediumTrucks" stroke="#00C49F" />
                    <Line type="monotone" dataKey="LightVans" stroke="#FFBB28" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Idle Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Idle Time Analysis
              </CardTitle>
              <CardDescription>Hours vehicles spend idle vs. in operation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Truck 1', Idle: metrics.idleTime[0], Operation: 24 - metrics.idleTime[0] },
                      { name: 'Truck 2', Idle: metrics.idleTime[1], Operation: 24 - metrics.idleTime[1] },
                      { name: 'Truck 3', Idle: metrics.idleTime[2], Operation: 24 - metrics.idleTime[2] },
                      { name: 'Van 1', Idle: metrics.idleTime[3], Operation: 24 - metrics.idleTime[3] },
                      { name: 'Van 2', Idle: metrics.idleTime[4], Operation: 24 - metrics.idleTime[4] },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} hours`, 'Time']} />
                    <Legend />
                    <Bar dataKey="Operation" stackId="a" fill="#00C49F" />
                    <Bar dataKey="Idle" stackId="a" fill="#FF8042" />
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