import React from 'react';
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  ArrowBigRight,
  ArrowDown,
  ArrowUp,
  BarChartBig,
  CalendarIcon,
  CheckCircle2,
  Circle,
  CircleCheck,
  Clipboard,
  Clock,
  DollarSign,
  Globe,
  Package,
  PieChart as PieChartIcon,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Truck,
  XCircle
} from "lucide-react";

interface OrderCount {
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface OrderAnalyticsProps {
  totalOrders: number;
  orderCounts: OrderCount;
  timelineData?: any[];
  timelineView?: 'avg' | 'max' | 'min';
  setTimelineView?: (view: 'avg' | 'max' | 'min') => void;
}

export function OrderAnalytics({ 
  totalOrders, 
  orderCounts,
  timelineData = [],
  timelineView = 'avg',
  setTimelineView = () => {}
}: OrderAnalyticsProps) {
  
  const getTimelineTotalHours = (data: any[], view: 'avg' | 'max' | 'min'): string => {
    const total = data.reduce((acc, item) => {
      if (view === 'avg') return acc + item.hours;
      if (view === 'min') return acc + (item.minHours || item.hours);
      return acc + (item.maxHours || item.hours);
    }, 0);
    
    return total.toFixed(1);
  };

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
              <PieChartIcon className="h-3.5 w-3.5 mr-1" />
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
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Weekly Order Trends</CardTitle>
                    <CardDescription>4-week comparison with year-over-year growth</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { week: 'Week 1', thisYear: 245, lastYear: 210, growth: 16.7 },
                            { week: 'Week 2', thisYear: 285, lastYear: 232, growth: 22.8 },
                            { week: 'Week 3', thisYear: 255, lastYear: 258, growth: -1.2 },
                            { week: 'Week 4', thisYear: 290, lastYear: 240, growth: 20.8 },
                          ]}
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
                          data={[
                            { month: 'Jan', time: 3.2, target: 3.0 },
                            { month: 'Feb', time: 3.3, target: 3.0 },
                            { month: 'Mar', time: 3.0, target: 3.0 },
                            { month: 'Apr', time: 2.8, target: 2.8 },
                            { month: 'May', time: 2.7, target: 2.8 },
                            { month: 'Jun', time: 2.5, target: 2.8 },
                            { month: 'Jul', time: 2.4, target: 2.5 },
                            { month: 'Aug', time: 2.5, target: 2.5 },
                          ]}
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
                    <div className="mt-1 text-xl font-bold">{totalOrders}</div>
                    <div className="text-xs text-muted-foreground">+8% from last period</div>
          </CardContent>
        </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Avg Order Value</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">$348.50</div>
                    <div className="text-xs text-muted-foreground">+4.2% from last period</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Fulfillment Rate</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">96.8%</div>
                    <div className="text-xs text-muted-foreground">+1.2% from target</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Return Rate</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">3.2%</div>
                    <div className="text-xs text-muted-foreground">-0.5% from last period</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          
          {/* Additional tabs content can be added here */}
          {/* Order Status Tab */}
          <TabsContent value="status" className="p-0 pt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Order Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <div className="flex items-center p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="relative w-16 h-16 mr-3">
                            <svg className="w-16 h-16" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeDasharray={`${(orderCounts.processing / totalOrders) * 100}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                              <div className="text-xs font-semibold">{Math.round((orderCounts.processing / totalOrders) * 100)}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></div>
                              <div className="text-sm font-medium">Processing</div>
                            </div>
                            <div className="text-2xl font-bold">{orderCounts.processing}</div>
                            <div className="text-xs text-muted-foreground">Total orders in processing</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="relative w-16 h-16 mr-3">
                            <svg className="w-16 h-16" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeDasharray={`${(orderCounts.shipped / totalOrders) * 100}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                              <div className="text-xs font-semibold">{Math.round((orderCounts.shipped / totalOrders) * 100)}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></div>
                              <div className="text-sm font-medium">Shipped</div>
                            </div>
                            <div className="text-2xl font-bold">{orderCounts.shipped}</div>
                            <div className="text-xs text-muted-foreground">Total orders in transit</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="relative w-16 h-16 mr-3">
                            <svg className="w-16 h-16" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="3"
                                strokeDasharray={`${(orderCounts.delivered / totalOrders) * 100}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                              <div className="text-xs font-semibold">{Math.round((orderCounts.delivered / totalOrders) * 100)}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></div>
                              <div className="text-sm font-medium">Delivered</div>
                            </div>
                            <div className="text-2xl font-bold">{orderCounts.delivered}</div>
                            <div className="text-xs text-muted-foreground">Total orders delivered</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="relative w-16 h-16 mr-3">
                            <svg className="w-16 h-16" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#ec4899"
                                strokeWidth="3"
                                strokeDasharray={`${(orderCounts.cancelled / totalOrders) * 100}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                              <div className="text-xs font-semibold">{Math.round((orderCounts.cancelled / totalOrders) * 100)}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#ec4899] mr-2"></div>
                              <div className="text-sm font-medium">Cancelled</div>
                            </div>
                            <div className="text-2xl font-bold">{orderCounts.cancelled}</div>
                            <div className="text-xs text-muted-foreground">Total orders cancelled</div>
                          </div>
                        </div>
                        
                        <div className="col-span-2 mt-5 border-t pt-4 border-border">
                          <div className="text-sm font-medium mb-1">Order Status Progression</div>
                          <div className="flex items-center space-x-1">
                            <div className="h-2 bg-[#3b82f6] rounded-l-full" style={{ width: `${Math.round((orderCounts.processing / totalOrders) * 100)}%` }}></div>
                            <div className="h-2 bg-[#10b981]" style={{ width: `${Math.round((orderCounts.shipped / totalOrders) * 100)}%` }}></div>
                            <div className="h-2 bg-[#f59e0b]" style={{ width: `${Math.round((orderCounts.delivered / totalOrders) * 100)}%` }}></div>
                            <div className="h-2 bg-[#ec4899] rounded-r-full" style={{ width: `${Math.round((orderCounts.cancelled / totalOrders) * 100)}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6] mr-1"></span> Processing
                            </div>
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-[#10b981] mr-1"></span> Shipped
                            </div>
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-[#f59e0b] mr-1"></span> Delivered
                            </div>
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-[#ec4899] mr-1"></span> Cancelled
                            </div>
                          </div>
                          <div className="flex justify-between mt-3">
                            <div className="text-xs">
                              <div className="font-medium">Total Active Orders</div>
                              <div className="text-2xl font-bold">{totalOrders - orderCounts.cancelled}</div>
                            </div>
                            <div className="text-xs text-right">
                              <div className="font-medium">Completion Rate</div>
                              <div className="text-2xl font-bold">{Math.round((orderCounts.delivered / (totalOrders - orderCounts.cancelled)) * 100)}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Order Fulfillment Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center space-x-4 border-l-4 border-[#3b82f6] pl-4 py-2 bg-muted/10 rounded-r-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#3b82f6]/10">
                              <Clock className="h-5 w-5 text-[#3b82f6]" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-semibold">Order to Processing</div>
                            <div className="text-2xl font-bold">2.4 <span className="text-sm text-muted-foreground font-normal">hrs</span></div>
                            <div className="text-xs text-muted-foreground">Average time to start processing</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 border-l-4 border-[#10b981] pl-4 py-2 bg-muted/10 rounded-r-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#10b981]/10">
                              <Package className="h-5 w-5 text-[#10b981]" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-semibold">Processing to Shipped</div>
                            <div className="text-2xl font-bold">18.2 <span className="text-sm text-muted-foreground font-normal">hrs</span></div>
                            <div className="text-xs text-muted-foreground">Average packaging and handoff time</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 border-l-4 border-[#f59e0b] pl-4 py-2 bg-muted/10 rounded-r-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f59e0b]/10">
                              <Truck className="h-5 w-5 text-[#f59e0b]" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-semibold">Shipped to Delivered</div>
                            <div className="text-2xl font-bold">42.6 <span className="text-sm text-muted-foreground font-normal">hrs</span></div>
                            <div className="text-xs text-muted-foreground">Average transit time to customer</div>
                          </div>
                        </div>
                        
                        <div className="mt-2 px-2">
                          <div className="text-sm font-medium mb-1">Total Fulfillment Time</div>
                          <div className="flex items-center space-x-1">
                            <div className="h-1.5 bg-[#3b82f6] rounded-l-full w-1/6"></div>
                            <div className="h-1.5 bg-[#10b981] w-1/3"></div>
                            <div className="h-1.5 bg-[#f59e0b] rounded-r-full w-1/2"></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <div>Order Placed</div>
                            <div>63.2 hrs (2.6 days) Average</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Completion Rate</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">{Math.round((orderCounts.delivered / totalOrders) * 100)}%</div>
                      <div className="text-xs text-muted-foreground">
                        {orderCounts.delivered} of {totalOrders} orders completed
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Cancellation Rate</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">{Math.round((orderCounts.cancelled / totalOrders) * 100)}%</div>
                      <div className="text-xs text-muted-foreground">
                        {orderCounts.cancelled} of {totalOrders} orders cancelled
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">On-Time Delivery</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">94%</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(orderCounts.delivered * 0.94)} orders delivered on time
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Return Rate</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">2.3%</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(orderCounts.delivered * 0.023)} orders returned
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          
          {/* Processing Timeline Tab */}
          <TabsContent value="timeline" className="p-0 pt-0">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          Order Processing Timeline
                        </CardTitle>
                        <CardDescription>Process efficiency analysis & optimization</CardDescription>
                      </div>
                      <Select 
                        defaultValue="avg" 
                        onValueChange={(value) => setTimelineView(value as 'avg' | 'max' | 'min')}
                      >
                        <SelectTrigger className="h-8 text-xs w-[120px]">
                          <SelectValue placeholder="View Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="avg">Average Time</SelectItem>
                          <SelectItem value="max">Peak Times</SelectItem>
                          <SelectItem value="min">Optimal Times</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center mb-2 text-xs gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span>Optimal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span>Warning</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>Critical</span>
                      </div>
                      <div className="ml-auto flex items-center">
                        <span className="font-medium text-xs">
                          Total: {getTimelineTotalHours(timelineData, timelineView)}h
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {timelineData
                        .filter(item => timelineView === 'avg' || (
                          timelineView === 'min' ? item.minHours !== undefined : item.maxHours !== undefined
                        ))
                        .map((item, index) => {
                        // Calculate various metrics for visualization
                        const statusColors: Record<'optimal' | 'warning' | 'critical', string> = {
                          optimal: 'bg-emerald-500',
                          warning: 'bg-amber-500',
                          critical: 'bg-red-500'
                        };
                        
                        const nodeIcons: Record<'start' | 'process' | 'bottleneck' | 'external', React.ReactNode> = {
                          start: <CircleCheck className="h-3.5 w-3.5 text-blue-500" />,
                          process: <ArrowBigRight className="h-3.5 w-3.5 text-indigo-500" />,
                          bottleneck: <AlertTriangle className="h-3.5 w-3.5 text-red-500" />,
                          external: <Globe className="h-3.5 w-3.5 text-purple-500" />
                        };
                        
                        // Get the correct hours based on selected view
                        const displayHours = timelineView === 'avg' ? item.hours :
                                            timelineView === 'min' ? (item.minHours || item.hours) :
                                            (item.maxHours || item.hours);
                                            
                        // Get the status based on the current view
                        const displayStatus = timelineView === 'avg' 
                          ? item.status 
                          : timelineView === 'min' 
                            ? 'optimal'
                            : (displayHours > item.target * 1.2 ? 'critical' : 'warning');
                        
                        // Calculate width for Gantt-style bar
                        const maxInternalHours = timelineView === 'max' ? 15 : 10;
                        const maxWidth = item.stage === 'In Transit' || item.stage === 'Carrier Pickup'
                          ? `${Math.min(98, (displayHours / 60) * 100)}%`
                          : `${Math.min(98, (displayHours / maxInternalHours) * 100)}%`;
                        
                        // Calculate efficiency color
                        const efficiency = (item.target / displayHours) * 100;
                        const efficiencyColor = 
                          efficiency >= 95 ? 'text-emerald-500' :
                          efficiency >= 80 ? 'text-amber-500' : 'text-red-500';

                        // Calculate appropriate process rate based on view
                        const displayRate = timelineView === 'avg' ? item.processRate :
                                           timelineView === 'min' ? Math.min(100, item.processRate + 10) :
                                           Math.max(50, item.processRate - 15);
                          
                        return (
                          <div key={item.stage} className="relative group">
                            <div className="flex items-center h-10 rounded-md bg-card/60 hover:bg-card/80 transition-colors px-2">
                              {/* Process node indicator */}
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${item.nodeType === 'bottleneck' ? 'bg-red-100/50' : 'bg-blue-100/50'}`}>
                                {nodeIcons[item.nodeType as 'start' | 'process' | 'bottleneck' | 'external']}
                              </div>
                              
                              {/* Stage name */}
                              <div className="ml-2 w-40 overflow-hidden">
                                <div className="text-xs font-medium truncate">{item.stage}</div>
                                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                              </div>
                              
                              {/* Timeline bar visualization */}
                              <div className="flex-1 mx-2">
                                <div className="h-2.5 w-full bg-muted/30 rounded-sm overflow-hidden flex relative">
                                  {/* Actual time */}
                                  <div 
                                    className={`h-full ${statusColors[displayStatus as 'optimal' | 'warning' | 'critical']} flex items-center rounded-sm`} 
                                    style={{ width: maxWidth }}
                                  ></div>
                                  
                                  {/* Target marker */}
                                  <div 
                                    className="absolute h-full w-0.5 bg-white z-10" 
                                    style={{ 
                                      left: `${Math.min(98, (item.target / (item.stage === 'In Transit' || item.stage === 'Carrier Pickup' ? 60 : maxInternalHours)) * 100)}%`,
                                      boxShadow: '0 0 3px rgba(255,255,255,0.8)'
                                    }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Metrics */}
                              <div className="flex items-center gap-2 text-xs w-24 justify-end">
                                <div className="flex flex-col items-end">
                                  <div className="font-medium">{displayHours}h</div>
                                  <div className="text-xs text-muted-foreground">
                                    SLA: {item.sla}h
                                  </div>
                                </div>
                                <div 
                                  className={`w-8 h-5 rounded-sm flex items-center justify-center text-white text-xs font-medium ${statusColors[displayStatus as 'optimal' | 'warning' | 'critical']}`}
                                >
                                  {displayRate}%
                                </div>
                              </div>
                            </div>
                            
                            {/* Connector line */}
                            {index < timelineData.length - 1 && (
                              <div className="absolute left-3 top-10 w-0.5 h-2 bg-muted-foreground/30"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 py-2 border-t border-border/30 mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Last updated: Today, 14:32</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => setTimelineView('avg')}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Recalculate
                    </Button>
                  </CardFooter>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div>
                        <CardTitle className="text-base">Processing Stage Analysis</CardTitle>
                        <CardDescription>Bottleneck identification and optimization</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="overflow-auto max-h-[calc(100%-3rem)]">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium mb-1 flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                            Bottleneck Identification
                          </div>
                          <div className="bg-muted/20 rounded-md p-3 text-xs">
                            <p className="mb-2">The <span className="font-medium text-amber-500">Picking & Packing</span> stage has been identified as the primary bottleneck in the order processing pipeline.</p>
                            <div className="flex items-center mt-2">
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: '67%' }}></div>
                              </div>
                              <span className="ml-2 text-xs font-medium">67%</span>
                            </div>
                            <p className="mt-2 text-muted-foreground">Contributes to 67% of internal processing delays</p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1 flex items-center">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            Optimization Recommendations
                          </div>
                          <div className="bg-muted/20 rounded-md p-3 space-y-3">
                            <div className="flex items-start text-xs">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                                <span className="font-bold text-blue-500">1</span>
                              </div>
                              <div>
                                <p className="font-medium">Parallel Processing for Picking & Packing</p>
                                <p className="text-muted-foreground">Implement zone-based picking with multiple packers working simultaneously. Expected time reduction: 40%.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start text-xs">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                                <span className="font-bold text-green-500">2</span>
                              </div>
                              <div>
                                <p className="font-medium">Optimize Carrier Pickup Window</p>
                                <p className="text-muted-foreground">Reduce window by 2.5 hours by scheduling fixed pickup times. Coordination required with shipping partners.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start text-xs">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                                <span className="font-bold text-amber-500">3</span>
                              </div>
                              <div>
                                <p className="font-medium">Automate Inventory Allocation</p>
                                <p className="text-muted-foreground">Implement predictive modeling to pre-allocate inventory based on order patterns. Reduces manual intervention by 85%.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start text-xs">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-0.5">
                                <span className="font-bold text-purple-500">4</span>
                              </div>
                              <div>
                                <p className="font-medium">Streamline Order Verification</p>
                                <p className="text-muted-foreground">Replace manual verification with digital signature and automated fraud detection. Potential savings: 0.8 hours per order.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div>
                        <CardTitle className="text-base">Process Efficiency Metrics</CardTitle>
                        <CardDescription className="text-sm">Current performance against SLA targets</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-medium">Overall Process Efficiency</div>
                            <div className="text-sm font-semibold">68%</div>
                          </div>
                          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>0%</span>
                            <span>Target: 85%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm font-medium mb-2">Internal Processing</div>
                            <div className="flex justify-between items-center text-base">
                              <span className="text-sm">Actual</span>
                              <span className="font-medium">4.5 hours</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                              <span>Target</span>
                              <span>4.0 hours</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium mb-2">External Processing</div>
                            <div className="flex justify-between items-center text-base">
                              <span className="text-sm">Actual</span>
                              <span className="font-medium">63.7 hours</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                              <span>Target</span>
                              <span>64.0 hours</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-3">Stage Efficiency Breakdown</div>
                          <div className="space-y-2.5">
                            {[
                              { stage: 'Order Verification', efficiency: 83 },
                              { stage: 'Payment Processing', efficiency: 125 },
                              { stage: 'Inventory Allocation', efficiency: 125 },
                              { stage: 'Picking & Packing', efficiency: 67 },
                              { stage: 'Shipping Preparation', efficiency: 83 },
                            ].map(item => (
                              <div key={item.stage} className="flex items-center">
                                <div className="w-40 text-sm truncate">{item.stage}</div>
                                <div className="flex-1 mx-3">
                                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        item.efficiency >= 100 ? 'bg-emerald-500' : 
                                        item.efficiency >= 80 ? 'bg-amber-500' : 'bg-red-500'
                                      }`} 
                                      style={{ width: `${Math.min(100, item.efficiency)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="text-sm w-10 text-right font-medium">
                                  {item.efficiency}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Total Processing Time</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">8.5 <span className="text-sm font-normal">hours</span></div>
                      <div className="text-xs text-muted-foreground">Average from order to shipping</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Bottleneck Stage</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">Picking & Packing</div>
                      <div className="text-xs text-muted-foreground">1.5 hours (18% of total time)</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Optimization Potential</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">32%</div>
                      <div className="text-xs text-muted-foreground">Est. time savings with optimizations</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Process Efficiency</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">68%</div>
                      <div className="text-xs text-muted-foreground">Based on industry benchmarks</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          
          {/* Average Order Value Tab */}
          <TabsContent value="value" className="p-0 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">AOV Trend Analysis</CardTitle>
                    <CardDescription>Monthly trends with moving average and forecasting</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={[
                            { month: 'Jan', value: 320, ma3: null, ma6: null, forecast: null, benchmark: 310 },
                            { month: 'Feb', value: 332, ma3: null, ma6: null, forecast: null, benchmark: 310 },
                            { month: 'Mar', value: 301, ma3: 317.7, ma6: null, forecast: null, benchmark: 310 },
                            { month: 'Apr', value: 334, ma3: 322.3, ma6: null, forecast: null, benchmark: 325 },
                            { month: 'May', value: 390, ma3: 341.7, ma6: null, forecast: null, benchmark: 325 },
                            { month: 'Jun', value: 330, ma3: 351.3, ma6: 334.5, forecast: null, benchmark: 325 },
                            { month: 'Jul', value: 350, ma3: 356.7, ma6: 339.5, forecast: null, benchmark: 340 },
                            { month: 'Aug', value: 368, ma3: 349.3, ma6: 345.5, forecast: null, benchmark: 340 },
                            { month: 'Sep', value: 352, ma3: 356.7, ma6: 349.1, forecast: null, benchmark: 340 },
                            { month: 'Oct', value: null, ma3: null, ma6: null, forecast: 358, benchmark: 350 },
                            { month: 'Nov', value: null, ma3: null, ma6: null, forecast: 362, benchmark: 350 },
                            { month: 'Dec', value: null, ma3: null, ma6: null, forecast: 370, benchmark: 350 },
                          ]}
                          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}} 
                          />
                          <YAxis 
                            domain={[290, 400]}
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                            label={{ value: 'Order Value ($)', angle: -90, position: 'insideLeft', offset: -5 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value) => value ? [`$${value}`, ''] : ['-', '']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Legend />
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <Bar 
                            dataKey="value" 
                            name="Actual AOV" 
                            fill="url(#colorValue)"
                            radius={[4, 4, 0, 0]} 
                            barSize={20}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ma3" 
                            name="3-Month MA" 
                            stroke="#ff7300" 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ma6" 
                            name="6-Month MA" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="forecast" 
                            name="Forecast" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="benchmark" 
                            name="Benchmark" 
                            stroke="#d1495b" 
                            strokeWidth={1}
                            strokeDasharray="3 3"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">AOV Distribution Analysis</CardTitle>
                    <CardDescription>Order value segmentation and statistical analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { range: '<$100', count: 42, percentage: 8 },
                              { range: '$100-$200', count: 86, percentage: 17 },
                              { range: '$200-$300', count: 118, percentage: 24 },
                              { range: '$300-$400', count: 135, percentage: 27 },
                              { range: '$400-$500', count: 78, percentage: 16 },
                              { range: '>$500', count: 41, percentage: 8 },
                            ]}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="range" className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                            <YAxis className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                              formatter={(value, name) => [name === 'count' ? value : `${value}%`, name === 'count' ? 'Orders' : 'Percentage']}
                            />
                            <Bar dataKey="count" name="Orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="percentage" name="Percentage" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        <div className="border rounded-md p-3">
                          <div className="text-xs font-medium text-muted-foreground">Median</div>
                          <div className="text-lg font-bold">$342.50</div>
                          <div className="text-xs flex items-center">
                            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                            <span>+$18.30 YoY</span>
                          </div>
                        </div>
                        <div className="border rounded-md p-3">
                          <div className="text-xs font-medium text-muted-foreground">Std Deviation</div>
                          <div className="text-lg font-bold">$115.72</div>
                          <div className="text-xs flex items-center">
                            <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                            <span>-12.8% YoY</span>
                          </div>
                        </div>
                        <div className="border rounded-md p-3">
                          <div className="text-xs font-medium text-muted-foreground">MAD</div>
                          <div className="text-lg font-bold">$84.21</div>
                          <div className="text-xs flex items-center">
                            <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                            <span>-8.2% YoY</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-medium">Segmented AOV Analysis</CardTitle>
                        <CardDescription>Order value breakdown by category, customer segment, and region</CardDescription>
                      </div>
                      <Select defaultValue="category">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Select dimension" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category">Product Category</SelectItem>
                          <SelectItem value="segment">Customer Segment</SelectItem>
                          <SelectItem value="region">Region</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            type="number" 
                            dataKey="orderCount" 
                            name="Order Count" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}} 
                            label={{ value: 'Order Volume', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="aov" 
                            name="AOV" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}} 
                            label={{ value: 'Average Order Value ($)', angle: -90, position: 'insideLeft', offset: -5 }}
                            domain={[200, 500]}
                          />
                          <ZAxis 
                            type="number" 
                            dataKey="revenue" 
                            range={[60, 400]} 
                            name="Revenue" 
                          />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value, name) => {
                              if (name === 'AOV') return [`$${value}`, name];
                              if (name === 'Order Count') return [value, name];
                              if (name === 'Revenue') return [`$${(Number(value)/1000).toFixed(1)}k`, name];
                              return [value, name];
                            }}
                            labelFormatter={(label) => `${label}`}
                          />
                          <Legend />
                          <Scatter 
                            name="Product Categories" 
                            data={[
                              { name: 'Shipping Supplies', orderCount: 145, aov: 248, revenue: 35960 },
                              { name: 'Warehouse Equipment', orderCount: 78, aov: 478, revenue: 37284 },
                              { name: 'Safety Products', orderCount: 112, aov: 362, revenue: 40544 },
                              { name: 'Packaging Materials', orderCount: 189, aov: 295, revenue: 55755 },
                              { name: 'Transport Equipment', orderCount: 67, aov: 412, revenue: 27604 },
                              { name: 'Office Supplies', orderCount: 203, aov: 218, revenue: 44254 },
                            ]}
                            fill="#8884d8" 
                            shape="circle"
                            label={{ dataKey: 'name', position: 'top', fill: 'hsl(var(--foreground))', fontSize: 10 }}
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Monthly Growth</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">+4.2%</div>
                    <div className="text-xs text-muted-foreground">Compared to previous month</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <BarChartBig className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Highest Month</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">May ($390)</div>
                    <div className="text-xs text-muted-foreground">21.8% above average</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">YTD Average</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">$336.71</div>
                    <div className="text-xs text-muted-foreground">8.2% above forecast</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">AOV Elasticity</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">0.83</div>
                    <div className="text-xs text-muted-foreground">Expected growth with 5% price increase</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 