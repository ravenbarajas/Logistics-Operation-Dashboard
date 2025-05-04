import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import {
  ClipboardList,
  Download,
  RefreshCw,
  Package,
  Truck,
  Car,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Gauge,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Calendar,
  Droplets,
  PieChart,
  DollarSign,
  Clock
} from "lucide-react";

// Mock data
const vehicleFuelConsumption = [
  { id: "VH001", name: "Freightliner Cascadia", type: "Heavy Duty", lastMonth: 480, thisMonth: 465, efficiency: 92 },
  { id: "VH002", name: "Kenworth T680", type: "Heavy Duty", lastMonth: 495, thisMonth: 510, efficiency: 88 },
  { id: "VH003", name: "Peterbilt 579", type: "Heavy Duty", lastMonth: 450, thisMonth: 440, efficiency: 93 },
  { id: "VH004", name: "Volvo VNL 860", type: "Heavy Duty", lastMonth: 520, thisMonth: 505, efficiency: 87 },
  { id: "VM001", name: "Isuzu NPR HD", type: "Medium Duty", lastMonth: 280, thisMonth: 265, efficiency: 94 },
  { id: "VM002", name: "Hino 268A", type: "Medium Duty", lastMonth: 300, thisMonth: 315, efficiency: 91 },
  { id: "VM003", name: "Ford F-650", type: "Medium Duty", lastMonth: 290, thisMonth: 285, efficiency: 90 },
  { id: "VL001", name: "Ford Transit", type: "Light Duty", lastMonth: 180, thisMonth: 165, efficiency: 95 },
  { id: "VL002", name: "Mercedes Sprinter", type: "Light Duty", lastMonth: 160, thisMonth: 170, efficiency: 96 },
  { id: "VL003", name: "RAM ProMaster", type: "Light Duty", lastMonth: 155, thisMonth: 150, efficiency: 97 }
];

const monthlyFuelData = [
  { month: "June 2023", consumption: 2850, vehicles: 30, avgPrice: 3.45, cost: 9832 },
  { month: "July 2023", consumption: 2950, vehicles: 32, avgPrice: 3.48, cost: 10266 },
  { month: "August 2023", consumption: 3050, vehicles: 34, avgPrice: 3.51, cost: 10695 },
  { month: "September 2023", consumption: 2930, vehicles: 34, avgPrice: 3.47, cost: 10167 },
  { month: "October 2023", consumption: 2880, vehicles: 35, avgPrice: 3.40, cost: 9792 },
  { month: "November 2023", consumption: 2800, vehicles: 35, avgPrice: 3.35, cost: 9380 }
];

export function ConsumptionTab() {
  const [consumptionCurrentPage, setConsumptionCurrentPage] = useState(1);
  const [consumptionPageSize] = useState(5);
  const [consumptionSearchQuery, setConsumptionSearchQuery] = useState("");
  const [consumptionTypeFilter, setConsumptionTypeFilter] = useState("all");

  return (
    <>
      {/* Vehicle-wise Consumption Details */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <ClipboardList className="h-4 w-4 mr-2 text-primary" />
              Vehicle-wise Consumption Details
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Last Month</TableHead>
                  <TableHead className="text-right">This Month</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">Efficiency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleFuelConsumption
                  .filter(vehicle => {
                    const matchesSearch = consumptionSearchQuery === "" ||
                      vehicle.name.toLowerCase().includes(consumptionSearchQuery.toLowerCase()) ||
                      vehicle.id.toLowerCase().includes(consumptionSearchQuery.toLowerCase());
                    const matchesType = consumptionTypeFilter === "all" || vehicle.type === consumptionTypeFilter;
                    return matchesSearch && matchesType;
                  })
                  .slice(
                    (consumptionCurrentPage - 1) * consumptionPageSize,
                    consumptionCurrentPage * consumptionPageSize
                  )
                  .map((vehicle) => {
                    const consumptionChange = vehicle.thisMonth - vehicle.lastMonth;
                    const changePercentage = ((consumptionChange) / vehicle.lastMonth * 100).toFixed(1);
                    
                    return (
                      <TableRow key={vehicle.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 text-muted-foreground mr-2" />
                            {vehicle.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium">{vehicle.name}</div>
                            <div className="text-xs text-muted-foreground">Last updated: Today, 2:30 PM</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {vehicle.type === 'Heavy Duty' && <Truck className="h-3 w-3 mr-1" />}
                            {vehicle.type === 'Medium Duty' && <Truck className="h-3 w-3 mr-1" />}
                            {vehicle.type === 'Light Duty' && <Car className="h-3 w-3 mr-1" />}
                            {vehicle.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <div>{vehicle.lastMonth} gal</div>
                            <div className="text-xs text-muted-foreground">Previous month</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <div>{vehicle.thisMonth} gal</div>
                            <div className="text-xs text-muted-foreground">Current month</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <div className={`flex items-center ${consumptionChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                              {consumptionChange > 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              <span>{Math.abs(consumptionChange)} gal</span>
                              <span className="text-xs ml-1">({changePercentage}%)</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              vehicle.efficiency >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                              vehicle.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              <Gauge className="h-3 w-3 mr-1" />
                              {vehicle.efficiency}%
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          
          <div className="border-t">
            <div className="flex items-center justify-between py-4 px-6">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing {Math.min((consumptionCurrentPage - 1) * consumptionPageSize + 1, vehicleFuelConsumption.length)} to {Math.min(consumptionCurrentPage * consumptionPageSize, vehicleFuelConsumption.length)} of {vehicleFuelConsumption.length} entries
              </div>
              
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setConsumptionCurrentPage(1)}
                    disabled={consumptionCurrentPage === 1}
                    className="h-8 w-8"
                    aria-label="First page"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setConsumptionCurrentPage(consumptionCurrentPage - 1)}
                    disabled={consumptionCurrentPage === 1}
                    className="h-8 w-8"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, Math.ceil(vehicleFuelConsumption.length / consumptionPageSize)) }).map((_, i) => (
                    <Button
                      key={i}
                      variant={consumptionCurrentPage === i + 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => setConsumptionCurrentPage(i + 1)}
                      className="h-8 w-8"
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setConsumptionCurrentPage(consumptionCurrentPage + 1)}
                    disabled={consumptionCurrentPage === Math.ceil(vehicleFuelConsumption.length / consumptionPageSize)}
                    className="h-8 w-8"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setConsumptionCurrentPage(Math.ceil(vehicleFuelConsumption.length / consumptionPageSize))}
                    disabled={consumptionCurrentPage === Math.ceil(vehicleFuelConsumption.length / consumptionPageSize)}
                    className="h-8 w-8"
                    aria-label="Last page"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">    
          {/* Monthly Fuel Consumption */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Droplets className="h-4 w-4 mr-2 text-primary" />
                Monthly Fuel Consumption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyFuelData.map((month, index) => {
                  const prevMonth = index > 0 ? monthlyFuelData[index - 1] : null;
                  const consumptionChange = prevMonth ? ((month.consumption - prevMonth.consumption) / prevMonth.consumption * 100).toFixed(1) : '0';
                  const avgPerVehicle = (month.consumption / month.vehicles).toFixed(1);
                  
                  return (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{month.month}</span>
                          <Badge variant="outline" className="text-xs">
                            {month.vehicles} vehicles
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <span className="font-medium">{month.consumption.toLocaleString()} gal</span>
                            <span className="text-xs text-muted-foreground">
                              {avgPerVehicle} gal/vehicle
                            </span>
                          </div>
                          {prevMonth && (
                            <div className={`flex items-center text-xs ${Number(consumptionChange) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                              {Number(consumptionChange) > 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(Number(consumptionChange))}%
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(month.consumption / 3100) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${month.avgPrice}/gal
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Daily avg: {(month.consumption / 30).toFixed(1)} gal
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Total Consumption</div>
                      <div className="text-lg font-bold">
                        {monthlyFuelData.reduce((acc, curr) => acc + curr.consumption, 0).toLocaleString()} gal
                      </div>
                      <div className="text-xs text-muted-foreground">Over {monthlyFuelData.length} months</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Monthly Average</div>
                      <div className="text-lg font-bold">
                        {Math.round(monthlyFuelData.reduce((acc, curr) => acc + curr.consumption, 0) / monthlyFuelData.length).toLocaleString()} gal
                      </div>
                      <div className="text-xs text-muted-foreground">Per month</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Efficiency Trend</div>
                      <div className="text-lg font-bold text-green-500">↑ 2.3%</div>
                      <div className="text-xs text-muted-foreground">Month over month</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          {/* Consumption by Type */}
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center">
                <PieChart className="h-4 w-4 mr-2 text-primary" />
                Consumption by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {['Heavy Duty', 'Medium Duty', 'Light Duty'].map((type) => {
                  const vehicles = vehicleFuelConsumption.filter(v => v.type === type);
                  const totalConsumption = vehicles.reduce((acc, curr) => acc + curr.thisMonth, 0);
                  const lastMonthConsumption = vehicles.reduce((acc, curr) => acc + curr.lastMonth, 0);
                  const percentage = Math.round((totalConsumption / vehicleFuelConsumption.reduce((acc, curr) => acc + curr.thisMonth, 0)) * 100);
                  const change = ((totalConsumption - lastMonthConsumption) / lastMonthConsumption * 100).toFixed(1);
                  const avgEfficiency = Math.round(vehicles.reduce((acc, curr) => acc + curr.efficiency, 0) / vehicles.length);
                  
                  return (
                    <div key={type} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3">
                            {type === 'Heavy Duty' && <Truck className="h-4 w-4 text-blue-500" />}
                            {type === 'Medium Duty' && <Truck className="h-4 w-4 text-green-500" />}
                            {type === 'Light Duty' && <Car className="h-4 w-4 text-purple-500" />}
                            <span className="font-medium">{type}</span>
                            <Badge variant="outline" className="text-xs">
                              {vehicles.length} vehicles
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Avg efficiency: {avgEfficiency}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{totalConsumption} gal</div>
                          <div className={`text-xs flex items-center justify-end mt-1 ${Number(change) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {Number(change) > 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(Number(change))}% from last month
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Progress value={percentage} className="h-2.5" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{percentage}% of total fleet</span>
                          <span>{(totalConsumption / vehicles.length).toFixed(1)} gal/vehicle</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-muted/20 rounded-md">
                          <div className="text-xs text-muted-foreground mb-1">Min</div>
                          <div className="font-medium">{Math.min(...vehicles.map(v => v.thisMonth))} gal</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-md">
                          <div className="text-xs text-muted-foreground mb-1">Avg</div>
                          <div className="font-medium">{Math.round(totalConsumption / vehicles.length)} gal</div>
                        </div>
                        <div className="text-center p-3 bg-muted/20 rounded-md">
                          <div className="text-xs text-muted-foreground mb-1">Max</div>
                          <div className="font-medium">{Math.max(...vehicles.map(v => v.thisMonth))} gal</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 