import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShoppingCart, BarChartBig, Truck, Clock, Package, DollarSign, Calendar as CalendarIcon,
  RefreshCw, AlertTriangle, Clipboard, CheckCircle2, XCircle, TrendingUp, Activity, ArrowUp, ArrowDown
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart,
  Pie, Cell, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Scatter, ScatterChart,
  ZAxis, ComposedChart, ReferenceLine
} from 'recharts';

import {
  orderStatusData,
  orderVolumeData,
  weeklyOrderTrends,
  deliveryPerformance,
  volumeAndRevenue,
  COLORS
} from "@/mockData/orders";

const OrderAnalyticsTab = () => {
  const [selectedTimeInterval, setSelectedTimeInterval] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Order Status Analytics</CardTitle>
            <CardDescription>Key metrics and performance indicators for orders</CardDescription>
          </div>
          
          {/* Filtering options */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              Last 7 Days
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              Last Quarter
            </Button>
            <Button variant="outline" size="sm" className="h-8" asChild>
              <div className="flex items-center cursor-pointer">
                <Clipboard className="h-3.5 w-3.5 mr-1" />
                Export Data
              </div>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="volume" className="w-full p-6 pt-0">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="volume" className="text-xs">
              <BarChartBig className="h-3.5 w-3.5 mr-1" />
              Volume & Revenue
            </TabsTrigger>
            <TabsTrigger value="status" className="text-xs">
              <RechartsPieChart className="h-3.5 w-3.5 mr-1" />
              Order Status
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Processing Timeline
            </TabsTrigger>
            <TabsTrigger value="value" className="text-xs">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              Average Order Value
            </TabsTrigger>
          </TabsList>
          
          {/* Volume & Revenue Tab */}
          <TabsContent value="volume" className="p-0 pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[
                    { date: 'Aug 12', orders: 32, revenue: 9800, target: 30, forecast: 32, anomaly: false },
                    { date: 'Aug 13', orders: 28, revenue: 8600, target: 30, forecast: 31, anomaly: false },
                    { date: 'Aug 14', orders: 35, revenue: 11200, target: 30, forecast: 33, anomaly: false },
                    { date: 'Aug 15', orders: 42, revenue: 13500, target: 32, forecast: 35, anomaly: true },
                    { date: 'Aug 16', orders: 38, revenue: 12100, target: 32, forecast: 34, anomaly: false },
                    { date: 'Aug 17', orders: 45, revenue: 14800, target: 32, forecast: 36, anomaly: true },
                    { date: 'Aug 18', orders: 40, revenue: 13200, target: 34, forecast: 38, anomaly: false },
                  ]}
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    yAxisId="left"
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                    label={{ value: 'Orders', angle: -90, position: 'insideLeft', offset: -5 }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                    label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight', offset: -5 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`$${value}`, 'Revenue'];
                      if (name === 'target') return [value, 'Target Orders'];
                      if (name === 'forecast') return [value, 'Forecasted Orders'];
                      return [value, typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name];
                    }}
                  />
                  <Legend />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Bar 
                    yAxisId="left"
                    dataKey="orders" 
                    name="Orders" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="target" 
                    name="Target" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="forecast" 
                    name="Forecast" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                  <Scatter
                    yAxisId="left"
                    dataKey="orders"
                    fill="#ff0000"
                    name="Anomaly"
                    shape="circle"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Weekly Order Trends & Order-to-Delivery Performance charts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Weekly Order Trends</CardTitle>
                  <CardDescription>4-week comparison with year-over-year growth</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={weeklyOrderTrends}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="week" 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <YAxis 
                          yAxisId="left"
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          domain={[-20, 40]}
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                          label={{ value: 'Growth %', angle: 90, position: 'insideRight' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }}
                          formatter={(value, name) => {
                            if (name === 'growth') return [`${value}%`, 'YoY Growth'];
                            return [value, name === 'thisYear' ? 'This Year' : 'Last Year'];
                          }}
                        />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="thisYear" 
                          name="This Year" 
                          stroke="hsl(var(--primary))" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="lastYear" 
                          name="Last Year" 
                          stroke="#82ca9d" 
                          strokeWidth={2}
                          strokeDasharray="3 3"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="growth"
                          name="Growth"
                          fill="#8884d8"
                          radius={[4, 4, 0, 0]}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Order-to-Delivery Performance</CardTitle>
                  <CardDescription>Time from order placement to delivery completion</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={deliveryPerformance}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="month" 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <YAxis 
                          className="text-xs" 
                          label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }}
                          formatter={(value, name) => {
                            return [`${value} days`, name === 'time' ? 'Actual Time' : 'Target Time'];
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="time" 
                          name="Delivery Time" 
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorTime)" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="target" 
                          name="Target Time" 
                          stroke="#ff7300" 
                          strokeWidth={2}
                          strokeDasharray="3 3"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-background shadow-none">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Total Orders</span>
                  </div>
                  <div className="mt-1 text-xl font-bold">{volumeAndRevenue.totalOrders}</div>
                  <div className="text-xs text-muted-foreground">+8% from last period</div>
                </CardContent>
              </Card>
              <Card className="bg-background shadow-none">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Avg Order Value</span>
                  </div>
                  <div className="mt-1 text-xl font-bold">{volumeAndRevenue.avgOrderValue}</div>
                  <div className="text-xs text-muted-foreground">+4.2% from last period</div>
                </CardContent>
              </Card>
              <Card className="bg-background shadow-none">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Fulfillment Rate</span>
                  </div>
                  <div className="mt-1 text-xl font-bold">{volumeAndRevenue.fulfillmentRate}</div>
                  <div className="text-xs text-muted-foreground">+1.2% from target</div>
                </CardContent>
              </Card>
              <Card className="bg-background shadow-none">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Return Rate</span>
                  </div>
                  <div className="mt-1 text-xl font-bold">{volumeAndRevenue.returnRate}</div>
                  <div className="text-xs text-muted-foreground">-0.5% from last period</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Order Status Tab */}
          <TabsContent value="status" className="p-0 pt-0">
            {/* Order Status Tab content would go here - truncating for brevity */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Distribution card content */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Order Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Order status distribution content */}
                    <div className="text-center p-10">Order status distribution visualization</div>
                  </CardContent>
                </Card>
                
                {/* Order Fulfillment Timeline card content */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Order Fulfillment Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Order fulfillment timeline content */}
                    <div className="text-center p-10">Order fulfillment timeline visualization</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Status metrics KPIs */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Completion Rate</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">94%</div>
                    <div className="text-xs text-muted-foreground">
                      522 of 555 orders completed
                    </div>
                  </CardContent>
                </Card>
                
                {/* Additional status metric cards would go here */}
              </div>
            </div>
          </TabsContent>
          
          {/* Processing Timeline Tab */}
          <TabsContent value="timeline" className="p-0 pt-0">
            {/* Processing Timeline Tab content would go here */}
            <div className="text-center p-20">Processing Timeline content</div>
          </TabsContent>
          
          {/* Average Order Value Tab */}
          <TabsContent value="value" className="p-0 pt-0">
            {/* Average Order Value Tab content would go here */}
            <div className="text-center p-20">Average Order Value content</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderAnalyticsTab; 