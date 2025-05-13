import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { TrendingDown } from "lucide-react";
import { PerformanceAreaKey, DriverPerformanceData as IDriverPerformanceData } from "@/components/routes/types";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DriverPerformanceProps {
  driverPerformanceData: Record<PerformanceAreaKey, IDriverPerformanceData[]>; 
}

export function DriverPerformance({ driverPerformanceData }: DriverPerformanceProps) {
  const [performanceArea, setPerformanceArea] = useState<PerformanceAreaKey>('overall');

  return (
    <Card className="p-0">
      <CardHeader>
        <CardTitle>
          Driver Performance
        </CardTitle>
        <CardDescription>Advanced driver efficiency metrics and benchmarking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Advanced Driver Performance Dashboard */}
          <Card className="border-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="text-xs text-muted-foreground">Top Driver</div>
                <div className="text-xl font-bold mt-1">Alex K.</div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-green-500 font-medium">98.3%</span>
                  <TrendingDown className="h-3 w-3 ml-1 text-green-500" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">42 completed routes</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="text-xs text-muted-foreground">Fleet Efficiency</div>
                <div className="text-xl font-bold mt-1">86.4%</div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-green-500 font-medium">+3.2%</span>
                  <TrendingDown className="h-3 w-3 ml-1 text-green-500" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">From last month</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="text-xs text-muted-foreground">Training Needs</div>
                <div className="text-xl font-bold mt-1">4 Drivers</div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-amber-500 font-medium">Efficiency training</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Below 85% performance</div>
              </div>
            </div>
          </Card>
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 h-full">
              <div className="rounded-md border p-4 h-full">
                <h4 className="text-sm font-medium mb-3">Performance Overview</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-md bg-muted/30">
                      <div className="text-xs text-muted-foreground">Top Driver</div>
                      <div className="text-xl font-bold mt-1">Alex Kim</div>
                      <div className="text-xs text-green-500">98.3% rating</div>
                    </div>
                    <div className="p-2 rounded-md bg-muted/30">
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                      <div className="text-xl font-bold mt-1">92.6%</div>
                      <div className="text-xs text-green-500">+4.8% this month</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">On-time Deliveries</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Last 30 days</span>
                      <span>Target: 95%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Fuel Efficiency</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Last 30 days</span>
                      <span>Target: 90%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium">97%</span>
                    </div>
                    <Progress value={97} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Last 30 days</span>
                      <span>Target: 95%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="rounded-md border p-4 h-full">
                {/* Header and Dropdown for Performance Area */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Driver Performance Comparison</h4>
                  <Select value={performanceArea} onValueChange={(value) => setPerformanceArea(value as PerformanceAreaKey)}>
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue placeholder="Select performance area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overall">Overall Performance</SelectItem>
                      <SelectItem value="fuelEfficiency">Fuel Efficiency</SelectItem>
                      <SelectItem value="onTimeDelivery">On-time Delivery</SelectItem>
                      <SelectItem value="customerRating">Customer Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Chart component */}
                <div className="h-[250px] border-b mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={driverPerformanceData[performanceArea]}
                    >
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        // Dynamically format YAxis based on selected area
                        tickFormatter={(value) => {
                          switch (performanceArea) {
                            case 'fuelEfficiency':
                              return `${value} MPG`;
                            case 'customerRating':
                              return value.toFixed(1);
                            case 'onTimeDelivery':
                              return `${value}%`;
                            default:
                              return `${value}%`;
                          }
                        }}
                        domain={performanceArea === 'customerRating' ? [0, 5] : [0, 100]} // Adjust domain for rating
                      />
                      <Tooltip 
                        // Dynamically format Tooltip based on selected area
                        formatter={(value: number) => {
                          switch (performanceArea) {
                            case 'fuelEfficiency':
                              return [`${value} MPG`, 'Fuel Efficiency'];
                            case 'customerRating':
                              return [value.toFixed(1), 'Customer Rating'];
                            case 'onTimeDelivery':
                              return [`${value}%`, 'On-time Delivery'];
                            default:
                              return [`${value}%`, 'Overall Performance'];
                          }
                        }}
                      />
                      {/* Adjust Bar fill color based on performance area */}
                      <Bar dataKey="performance" fill={
                        performanceArea === 'fuelEfficiency' ? '#82ca9d' :
                        performanceArea === 'onTimeDelivery' ? '#ffc658' :
                        performanceArea === 'customerRating' ? '#a4de6c' :
                        '#8884d8'
                      } radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Leaderboards remain below the chart */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Top Performers</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium">Alex K. (98.3%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium">Sarah M. (97.8%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium">David W. (96.2%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Improvement Needed</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span className="text-xs font-medium">Robert J. (82.4%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span className="text-xs font-medium">Lisa T. (83.7%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span className="text-xs font-medium">Mark P. (84.1%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Performance Areas</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-medium">Fuel Efficiency</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium">On-time Delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <span className="text-xs font-medium">Customer Rating</span>
                      </div>
                    </div>
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