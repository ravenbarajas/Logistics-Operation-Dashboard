import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import { Fuel, Plus, TrendingUp, DollarSign, BarChart3, AlertCircle } from "lucide-react";

// Types for fuel records
interface FuelRecord {
  id: number;
  vehicleId: number;
  vehicleName: string;
  date: Date;
  gallons: number;
  cost: number;
  mileage: number;
  mpg?: number;
}

interface VehicleFuelData {
  id: number;
  name: string;
  type: string;
  currentFuelLevel: number;
  averageMPG: number;
  monthlyFuelCost: number[];
  fuelConsumption: number[];
}

interface FuelTrackerProps {
  records: FuelRecord[];
  vehicles: Array<{ id: number, name: string, type: string }>;
  vehiclesFuelData: VehicleFuelData[];
  onAddFuelRecord?: (record: Omit<FuelRecord, 'id' | 'mpg'>) => void;
}

export function FuelTracker({ records, vehicles, vehiclesFuelData, onAddFuelRecord }: FuelTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<FuelRecord>>({
    date: new Date(),
    gallons: 0,
    cost: 0,
    mileage: 0
  });
  
  // Calculate fuel efficiency
  const calculateFuelEfficiency = (records: FuelRecord[]) => {
    // Sort records by date and vehicle
    const sortedRecords = [...records].sort((a, b) => 
      a.vehicleId === b.vehicleId 
        ? a.date.getTime() - b.date.getTime()
        : a.vehicleId - b.vehicleId
    );
    
    // Process records to calculate MPG between consecutive fills
    const processedRecords: FuelRecord[] = [];
    let prevRecord: FuelRecord | null = null;
    
    for (const record of sortedRecords) {
      let mpg = undefined;
      
      if (prevRecord && prevRecord.vehicleId === record.vehicleId && prevRecord.mileage < record.mileage) {
        // Calculate miles per gallon
        mpg = (record.mileage - prevRecord.mileage) / record.gallons;
      }
      
      processedRecords.push({
        ...record,
        mpg
      });
      
      prevRecord = record;
    }
    
    return processedRecords;
  };
  
  const processedRecords = calculateFuelEfficiency(records);
  
  // Get month names for the past 6 months for charts
  const getLastSixMonths = () => {
    const months = [];
    const date = new Date();
    for (let i = 0; i < 6; i++) {
      date.setMonth(date.getMonth() - (i === 0 ? 0 : 1));
      months.unshift(date.toLocaleDateString('en-US', { month: 'short' }));
    }
    return months;
  };
  
  const lastSixMonths = getLastSixMonths();
  
  // Prepare monthly consumption data for charts
  const monthlyConsumptionData = lastSixMonths.map((month, index) => {
    const result: any = { name: month };
    
    vehiclesFuelData.forEach(vehicle => {
      result[vehicle.name] = vehicle.fuelConsumption[index];
    });
    
    return result;
  });
  
  // Prepare monthly cost data for charts
  const monthlyCostData = lastSixMonths.map((month, index) => {
    const result: any = { name: month };
    
    vehiclesFuelData.forEach(vehicle => {
      result[vehicle.name] = vehicle.monthlyFuelCost[index];
    });
    
    return result;
  });
  
  // Calculate total fuel consumption, cost, and average MPG
  const totalGallons = processedRecords.reduce((sum, record) => sum + record.gallons, 0);
  const totalCost = processedRecords.reduce((sum, record) => sum + record.cost, 0);
  const validMpgRecords = processedRecords.filter(record => record.mpg !== undefined);
  const averageMpg = validMpgRecords.length > 0 
    ? validMpgRecords.reduce((sum, record) => sum + (record.mpg || 0), 0) / validMpgRecords.length 
    : 0;
  
  // Handle form submission for new fuel record
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddFuelRecord && newRecord.vehicleId && newRecord.gallons) {
      const vehicle = vehicles.find(v => v.id === newRecord.vehicleId);
      onAddFuelRecord({
        vehicleId: newRecord.vehicleId,
        vehicleName: vehicle?.name || '',
        date: newRecord.date || new Date(),
        gallons: newRecord.gallons || 0,
        cost: newRecord.cost || 0,
        mileage: newRecord.mileage || 0
      });
      setIsAddDialogOpen(false);
      setNewRecord({
        date: new Date(),
        gallons: 0,
        cost: 0,
        mileage: 0
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fuel Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Fuel Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Fuel Record</DialogTitle>
                <DialogDescription>
                  Record a new fuel purchase for a vehicle.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select 
                    onValueChange={(value) => setNewRecord({...newRecord, vehicleId: parseInt(value)})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      onChange={(e) => setNewRecord({...newRecord, date: new Date(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="mileage">Odometer Reading</Label>
                    <Input 
                      id="mileage" 
                      type="number" 
                      placeholder="Current mileage" 
                      onChange={(e) => setNewRecord({...newRecord, mileage: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="gallons">Gallons</Label>
                    <Input 
                      id="gallons" 
                      type="number" 
                      step="0.01" 
                      placeholder="Gallons filled" 
                      onChange={(e) => setNewRecord({...newRecord, gallons: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="cost">Total Cost</Label>
                    <Input 
                      id="cost" 
                      type="number" 
                      step="0.01" 
                      placeholder="Total cost" 
                      onChange={(e) => setNewRecord({...newRecord, cost: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Record</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGallons.toFixed(2)} gallons</div>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Average: ${(totalCost / totalGallons).toFixed(2)}/gallon
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Fuel Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMpg.toFixed(2)} MPG</div>
            <p className="text-xs text-muted-foreground">
              From {validMpgRecords.length} fill-ups
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-primary" />
                Current Fuel Levels
              </CardTitle>
              <CardDescription>Current fuel status of all vehicles in the fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vehiclesFuelData.map(vehicle => (
                  <div key={vehicle.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{vehicle.name}</span>
                      <span>{vehicle.currentFuelLevel}%</span>
                    </div>
                    <Progress value={vehicle.currentFuelLevel} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{vehicle.type}</span>
                      <span>Avg. {vehicle.averageMPG.toFixed(1)} MPG</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Low Fuel Warning */}
          {vehiclesFuelData.some(v => v.currentFuelLevel < 25) && (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {vehiclesFuelData.filter(v => v.currentFuelLevel < 25).length} vehicles are running low on fuel (below 25%).
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Monthly Fuel Consumption
              </CardTitle>
              <CardDescription>Consumption trends over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyConsumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} gallons`, 'Consumption']} />
                    <Legend />
                    {vehiclesFuelData.map((vehicle, index) => (
                      <Bar 
                        key={vehicle.id}
                        dataKey={vehicle.name} 
                        stackId="a"
                        fill={`hsl(${index * 40}, 70%, 50%)`} 
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-primary" />
                Detailed Consumption
              </CardTitle>
              <CardDescription>Breakdown of fuel consumption by vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyConsumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} gallons`, 'Consumption']} />
                    <Legend />
                    {vehiclesFuelData.map((vehicle, index) => (
                      <Area 
                        key={vehicle.id}
                        type="monotone"
                        dataKey={vehicle.name} 
                        fill={`hsl(${index * 40}, 70%, 50%, 0.2)`}
                        stroke={`hsl(${index * 40}, 70%, 50%)`}
                      />
                    ))}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fuel Consumption Records</CardTitle>
              <CardDescription>Detailed log of all fuel purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Gallons</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead>MPG</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedRecords.length > 0 ? (
                    processedRecords
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .slice(0, 10)
                      .map(record => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date.toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{record.vehicleName}</TableCell>
                        <TableCell>{record.gallons.toFixed(2)}</TableCell>
                        <TableCell>${record.cost.toFixed(2)}</TableCell>
                        <TableCell>{record.mileage.toLocaleString()}</TableCell>
                        <TableCell>{record.mpg ? record.mpg.toFixed(2) : 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No fuel records available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Showing latest 10 records out of {processedRecords.length}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="cost" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Fuel Cost Analysis
              </CardTitle>
              <CardDescription>Monthly fuel expenditure breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyCostData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                    <Legend />
                    {vehiclesFuelData.map((vehicle, index) => (
                      <Line 
                        key={vehicle.id}
                        type="monotone" 
                        dataKey={vehicle.name} 
                        stroke={`hsl(${index * 40}, 70%, 50%)`}
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Cost per Mile
              </CardTitle>
              <CardDescription>Cost efficiency comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vehiclesFuelData.map(v => ({
                      name: v.name,
                      value: (v.monthlyFuelCost.reduce((a, b) => a + b, 0) / 6) / v.averageMPG
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(3)} per mile`, 'Cost']} />
                    <Legend />
                    <Bar dataKey="value" name="Cost per Mile" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Fuel Efficiency (MPG)
              </CardTitle>
              <CardDescription>Miles per gallon achieved by each vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vehiclesFuelData.map(v => ({
                      name: v.name,
                      value: v.averageMPG
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)} MPG`, 'Efficiency']} />
                    <Legend />
                    <Bar dataKey="value" name="Average MPG" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Records</CardTitle>
              <CardDescription>Fuel efficiency records from fill-ups</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead>Miles Driven</TableHead>
                    <TableHead>Gallons</TableHead>
                    <TableHead>MPG</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validMpgRecords.length > 0 ? (
                    validMpgRecords
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .slice(0, 10)
                      .map((record, index, array) => {
                        const prevRecord = array[index + 1];
                        const milesDriven = prevRecord ? record.mileage - prevRecord.mileage : 'N/A';
                        
                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.vehicleName}</TableCell>
                            <TableCell>{record.date.toLocaleDateString()}</TableCell>
                            <TableCell>{record.mileage.toLocaleString()}</TableCell>
                            <TableCell>{typeof milesDriven === 'number' ? milesDriven.toLocaleString() : milesDriven}</TableCell>
                            <TableCell>{record.gallons.toFixed(2)}</TableCell>
                            <TableCell className="font-medium">{record.mpg?.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No efficiency records available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Showing latest 10 records with calculated MPG
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 