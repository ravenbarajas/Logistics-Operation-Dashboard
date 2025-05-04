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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import {
  Receipt,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Calendar,
  DollarSign,
  Fuel,
  Calculator,
  UserRound
} from "lucide-react";

// Mock data
const monthlyFuelData = [
  { month: "June 2023", consumption: 2850, vehicles: 30, avgPrice: 3.45, cost: 9832 },
  { month: "July 2023", consumption: 2950, vehicles: 32, avgPrice: 3.48, cost: 10266 },
  { month: "August 2023", consumption: 3050, vehicles: 34, avgPrice: 3.51, cost: 10695 },
  { month: "September 2023", consumption: 2930, vehicles: 34, avgPrice: 3.47, cost: 10167 },
  { month: "October 2023", consumption: 2880, vehicles: 35, avgPrice: 3.40, cost: 9792 },
  { month: "November 2023", consumption: 2800, vehicles: 35, avgPrice: 3.35, cost: 9380 }
];

export function CostTab() {
  const [costCurrentPage, setCostCurrentPage] = useState(1);
  const [costPageSize] = useState(5);
  const [costSearchQuery, setCostSearchQuery] = useState("");
  const [costMonthFilter, setCostMonthFilter] = useState("all");

  return (
    <>
      <Card className="mt-4 mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <Receipt className="h-4 w-4 mr-2 text-primary" />
              Monthly Cost Breakdown
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
                  <TableHead>Month</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead className="text-right">Consumption</TableHead>
                  <TableHead className="text-right">Avg. Price</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyFuelData
                  .filter(month => {
                    const matchesSearch = costSearchQuery === "" ||
                      month.month.toLowerCase().includes(costSearchQuery.toLowerCase());
                    const matchesMonth = costMonthFilter === "all" || month.month === costMonthFilter;
                    return matchesSearch && matchesMonth;
                  })
                  .slice(
                    (costCurrentPage - 1) * costPageSize,
                    costCurrentPage * costPageSize
                  )
                  .map((month) => {
                    const prevMonth = monthlyFuelData[monthlyFuelData.indexOf(month) - 1];
                    const costChange = prevMonth ? month.cost - prevMonth.cost : 0;
                    const costChangePercentage = prevMonth ? ((costChange / prevMonth.cost) * 100).toFixed(1) : '0';
                    
                    return (
                      <TableRow key={month.month} className="group hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                            {month.month}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <UserRound className="h-4 w-4 text-muted-foreground mr-1" />
                              {month.vehicles}
                            </div>
                            {month.vehicles > (prevMonth?.vehicles || 0) && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                +{month.vehicles - (prevMonth?.vehicles || 0)}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              <Fuel className="h-4 w-4 text-muted-foreground mr-1" />
                              {month.consumption.toLocaleString()} gal
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Avg: {(month.consumption / month.vehicles).toFixed(1)} gal/vehicle
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                              ${month.avgPrice}/gal
                            </div>
                            {prevMonth && (
                              <div className={`text-xs ${month.avgPrice > prevMonth.avgPrice ? 'text-red-500' : 'text-green-500'}`}>
                                {month.avgPrice > prevMonth.avgPrice ? '↑' : '↓'} 
                                ${Math.abs(month.avgPrice - prevMonth.avgPrice).toFixed(2)} from prev
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="flex flex-col items-end">
                              <div className="font-medium">${month.cost.toLocaleString()}</div>
                              {prevMonth && (
                                <div className={`text-xs flex items-center ${costChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                  {costChange > 0 ? (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                  )}
                                  {costChangePercentage}%
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell colSpan={2} className="font-medium">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <Calculator className="h-4 w-4 mr-2 text-primary" />
                        Total / Average
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <div className="flex items-center justify-end">
                      <Fuel className="h-4 w-4 mr-2 text-primary" />
                      {monthlyFuelData.reduce((acc, curr) => acc + curr.consumption, 0).toLocaleString()} gal
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <div className="flex items-center justify-end">
                      <DollarSign className="h-4 w-4 mr-2 text-primary" />
                      ${(monthlyFuelData.reduce((acc, curr) => acc + curr.avgPrice, 0) / monthlyFuelData.length).toFixed(2)}/gal
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <div className="flex items-center justify-end">
                      <Receipt className="h-4 w-4 mr-2 text-primary" />
                      ${monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="border-t">
            <div className="flex items-center justify-between py-4 px-6">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing {Math.min((costCurrentPage - 1) * costPageSize + 1, monthlyFuelData.length)} to {Math.min(costCurrentPage * costPageSize, monthlyFuelData.length)} of {monthlyFuelData.length} entries
              </div>
              
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCostCurrentPage(1)}
                    disabled={costCurrentPage === 1}
                    className="h-8 w-8"
                    aria-label="First page"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCostCurrentPage(costCurrentPage - 1)}
                    disabled={costCurrentPage === 1}
                    className="h-8 w-8"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, Math.ceil(monthlyFuelData.length / costPageSize)) }).map((_, i) => (
                    <Button
                      key={i}
                      variant={costCurrentPage === i + 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCostCurrentPage(i + 1)}
                      className="h-8 w-8"
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCostCurrentPage(costCurrentPage + 1)}
                    disabled={costCurrentPage === Math.ceil(monthlyFuelData.length / costPageSize)}
                    className="h-8 w-8"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCostCurrentPage(Math.ceil(monthlyFuelData.length / costPageSize))}
                    disabled={costCurrentPage === Math.ceil(monthlyFuelData.length / costPageSize)}
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-primary" />
                Monthly Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyFuelData.map((month, index) => {
                  const prevMonth = index > 0 ? monthlyFuelData[index - 1] : null;
                  const costChange = prevMonth ? ((month.cost - prevMonth.cost) / prevMonth.cost * 100).toFixed(1) : '0';
                  const avgCostPerVehicle = (month.cost / month.vehicles).toFixed(2);
                  
                  return (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{month.month}</span>
                          <Badge variant="outline" className="text-xs">
                            {month.vehicles} vehicles
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <span className="font-medium">${month.cost.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              ${avgCostPerVehicle}/vehicle
                            </span>
                          </div>
                          {prevMonth && (
                            <div className={`flex items-center text-xs ${Number(costChange) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                              {Number(costChange) > 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(Number(costChange))}%
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(month.cost / 10695) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Fuel className="h-3 w-3 mr-1" />
                            {month.consumption.toLocaleString()} gallons
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {month.avgPrice}/gal avg. price
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4 mt-2 border-t">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Total Cost</div>
                      <div className="text-lg font-bold">
                        ${monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Over {monthlyFuelData.length} months</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Monthly Average</div>
                      <div className="text-lg font-bold">
                        ${Math.round(monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0) / monthlyFuelData.length).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Per month</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Cost Trend</div>
                      <div className="text-lg font-bold text-green-500">↓ 3.2%</div>
                      <div className="text-xs text-muted-foreground">Month over month</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* Cost Summary */}
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Receipt className="h-4 w-4 mr-2 text-primary" />
                Cost Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="p-3 bg-muted/20 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Total Expenses</span>
                      <span className="text-base font-bold">
                        ${monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total fuel expenses across all vehicles
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Average Monthly</span>
                        <span className="font-medium">
                          ${Math.round(monthlyFuelData.reduce((acc, curr) => acc + curr.cost, 0) / monthlyFuelData.length).toLocaleString()}
                        </span>
                      </div>
                      <Progress value={75} className="h-1.5" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Monthly budget utilization</span>
                        <span>75%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Per Vehicle Average</span>
                        <span className="font-medium">
                          ${Math.round(monthlyFuelData.reduce((acc, curr) => acc + (curr.cost / curr.vehicles), 0) / monthlyFuelData.length).toLocaleString()}
                        </span>
                      </div>
                      <Progress value={82} className="h-1.5" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Target efficiency</span>
                        <span>82%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-muted/20 rounded-md">
                      <div className="text-xs text-muted-foreground">Highest Month</div>
                      <div className="font-medium">${Math.max(...monthlyFuelData.map(m => m.cost)).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {monthlyFuelData.find(m => m.cost === Math.max(...monthlyFuelData.map(m => m.cost)))?.month}
                      </div>
                    </div>
                    <div className="p-2 bg-muted/20 rounded-md">
                      <div className="text-xs text-muted-foreground">Lowest Month</div>
                      <div className="font-medium">${Math.min(...monthlyFuelData.map(m => m.cost)).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {monthlyFuelData.find(m => m.cost === Math.min(...monthlyFuelData.map(m => m.cost)))?.month}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-1 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cost Distribution</span>
                      <Select defaultValue="6months">
                        <SelectTrigger className="h-7 text-xs w-[100px]">
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3months">3 Months</SelectItem>
                          <SelectItem value="6months">6 Months</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Fuel Costs</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-1" />
                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-muted-foreground">Maintenance</span>
                        <span>12%</span>
                      </div>
                      <Progress value={12} className="h-1" />
                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-muted-foreground">Other</span>
                        <span>3%</span>
                      </div>
                      <Progress value={3} className="h-1" />
                    </div>
                  </div>

                  <div className="pt-3 mt-1 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cost Trends</span>
                      <Badge variant="outline" className="text-xs">Last 30 Days</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-green-500" />
                          <span>Fuel Cost Trend</span>
                        </div>
                        <span className="text-green-500">-2.5%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-amber-500" />
                          <span>Maintenance Cost</span>
                        </div>
                        <span className="text-amber-500">+1.8%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-green-500" />
                          <span>Cost per Mile</span>
                        </div>
                        <span className="text-green-500">-3.2%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-green-500" />
                          <span>Overall Costs</span>
                        </div>
                        <span className="text-green-500">-1.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 