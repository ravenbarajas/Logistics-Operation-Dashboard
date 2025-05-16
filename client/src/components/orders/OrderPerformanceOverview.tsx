import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart, Search, MoreHorizontal, TrendingUp, Truck, Clock, Package,DollarSign,Calendar as CalendarIcon,
  Plus, RefreshCw, AlertTriangle, Clipboard, Filter, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronsLeft,
  ChevronsRight, FileText, Pencil, Trash2, FileEdit, BarChartBig, SendHorizonal, ArrowDown, ArrowUp, ArrowBigRight,
  CalendarDays, CircleCheck, Globe, PieChart, Activity, ArrowUpDown, MapPin
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart,
  Pie, Cell, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Scatter, ScatterChart,
  ZAxis, ComposedChart, ReferenceLine
} from 'recharts';
import {
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart as RechartsBarChart
} from "recharts";
import { Badge } from "@/components/ui/badge";

const OrderPerformanceOverview = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-background shadow-none">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Performance Score</span>
            </div>
            <div className="mt-1 text-xl font-bold">87.4</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+3.2 pts from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background shadow-none">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Processing Time</span>
            </div>
            <div className="mt-1 text-xl font-bold">3.2h</div>
            <div className="text-xs text-muted-foreground">-14% from baseline</div>
          </CardContent>
        </Card>

        <Card className="bg-background shadow-none">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <div className="mt-1 text-xl font-bold">98.7%</div>
            <div className="text-xs text-muted-foreground">Target: 95% | Above goal</div>
          </CardContent>
        </Card>

        <Card className="bg-background shadow-none">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Issue Count</span>
            </div>
            <div className="mt-1 text-xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">5 high | 7 medium priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Order Performance Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Order Performance Calendar Heatmap</CardTitle>
            <CardDescription>Daily success rates and processing volumes</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="mb-3 flex items-center justify-between">
              <Select defaultValue="april">
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January 2024</SelectItem>
                  <SelectItem value="february">February 2024</SelectItem>
                  <SelectItem value="march">March 2024</SelectItem>
                  <SelectItem value="april">April 2024</SelectItem>
                  <SelectItem value="may">May 2024</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2 text-xs items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-destructive/20 border border-destructive/30"></div>
                  <span>&lt;90%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-amber-500/20 border border-amber-500/30"></div>
                  <span>90-95%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-green-500/20 border border-green-500/30"></div>
                  <span>95-98%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-primary/90 text-primary-foreground"></div>
                  <span>&gt;98%</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] overflow-hidden">
              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-xs font-medium">
                <div>Sunday</div>
                <div>Monday</div>
                <div>Tuesday</div>
                <div>Wednesday</div>
                <div>Thursday</div>
                <div>Friday</div>
                <div>Saturday</div>
              </div>
              <div className="grid grid-cols-7 grid-rows-5 gap-1 h-[calc(100%-20px)]">
                {[ // Calendar Heatmap Data
                  { date: "2024-04-01", successRate: 97.2, volume: 482, processingTime: 2.8 },
                  { date: "2024-04-02", successRate: 98.5, volume: 523, processingTime: 2.6 },
                  { date: "2024-04-03", successRate: 99.1, volume: 491, processingTime: 2.5 },
                  { date: "2024-04-04", successRate: 98.7, volume: 507, processingTime: 2.7 },
                  { date: "2024-04-05", successRate: 96.8, volume: 615, processingTime: 3.1 },
                  { date: "2024-04-06", successRate: 95.3, volume: 423, processingTime: 3.4 },
                  { date: "2024-04-07", successRate: 94.8, volume: 385, processingTime: 3.5 },
                  { date: "2024-04-08", successRate: 97.5, volume: 528, processingTime: 2.8 },
                  { date: "2024-04-09", successRate: 98.9, volume: 492, processingTime: 2.6 },
                  { date: "2024-04-10", successRate: 99.2, volume: 475, processingTime: 2.5 },
                  { date: "2024-04-11", successRate: 98.4, volume: 513, processingTime: 2.7 },
                  { date: "2024-04-12", successRate: 96.5, volume: 632, processingTime: 3.2 },
                  { date: "2024-04-13", successRate: 94.9, volume: 445, processingTime: 3.6 },
                  { date: "2024-04-14", successRate: 93.7, volume: 398, processingTime: 3.8 },
                  { date: "2024-04-15", successRate: 96.9, volume: 536, processingTime: 2.9 },
                  { date: "2024-04-16", successRate: 98.2, volume: 511, processingTime: 2.7 },
                  { date: "2024-04-17", successRate: 99.0, volume: 487, processingTime: 2.6 },
                  { date: "2024-04-18", successRate: 98.3, volume: 518, processingTime: 2.8 },
                  { date: "2024-04-19", successRate: 97.1, volume: 598, processingTime: 3.0 },
                  { date: "2024-04-20", successRate: 95.6, volume: 428, processingTime: 3.3 },
                  { date: "2024-04-21", successRate: 94.2, volume: 389, processingTime: 3.7 },
                  { date: "2024-04-22", successRate: 97.7, volume: 524, processingTime: 2.8 },
                  { date: "2024-04-23", successRate: 98.8, volume: 505, processingTime: 2.6 },
                  { date: "2024-04-24", successRate: 98.7, volume: 493, processingTime: 2.6 },
                  { date: "2024-04-25", successRate: 97.9, volume: 521, processingTime: 2.7 },
                  { date: "2024-04-26", successRate: 96.3, volume: 607, processingTime: 3.1 },
                  { date: "2024-04-27", successRate: 95.1, volume: 437, processingTime: 3.4 },
                  { date: "2024-04-28", successRate: 93.9, volume: 394, processingTime: 3.6 },
                  { date: "2024-04-29", successRate: 89.6, volume: 568, processingTime: 4.2 },
                  { date: "2024-04-30", successRate: 91.2, volume: 532, processingTime: 3.9 },
                  null,
                  null,
                  null,
                  null
                ].map((day, index) => (
                  <div
                    key={index}
                    className={`p-1 rounded-md flex flex-col justify-between ${
                      !day
                        ? 'opacity-0'
                        : day.successRate > 98
                          ? 'bg-primary/90 text-primary-foreground'
                          : day.successRate > 95
                            ? 'bg-green-500/20 border border-green-500/30 text-foreground'
                            : day.successRate > 90
                              ? 'bg-amber-500/20 border border-amber-500/30 text-foreground'
                              : 'bg-destructive/20 border border-destructive/30 text-foreground'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="text-xs font-medium">
                          {new Date(day.date).getDate()}
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] opacity-80">{day.volume} orders</span>
                          <span className={`text-xs font-bold ${
                            day.successRate > 98
                              ? ''
                              : day.successRate > 95
                                ? 'text-green-500'
                                : day.successRate > 90
                                  ? 'text-amber-500'
                                  : 'text-destructive'
                          }`}>{day.successRate}%</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-md p-2">
                <div className="text-xs text-muted-foreground mb-1">Monthly Summary</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Success Rate</span>
                  <span className="text-sm font-bold">96.8%</span>
                </div>
              </div>
              <div className="bg-muted/30 rounded-md p-2">
                <div className="text-xs text-muted-foreground mb-1">Issue Detected</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">End of Month Drop</span>
                  <span className="text-sm font-medium text-destructive">-7.4%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Flow Sankey */}
        <Card>
          <div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Order Process Flow Analysis</CardTitle>
              <CardDescription>Order status flow and completion metrics</CardDescription>
            </CardHeader>
          </div>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  layout="vertical"
                  data={[
                    { stage: 'Order Received', completed: 100, dropoff: 0, time: 0.2, bottleneck: false, description: 'Initial order creation' },
                    { stage: 'Validation', completed: 97, dropoff: 3, time: 0.4, bottleneck: false, description: 'Order data verification' },
                    { stage: 'Payment', completed: 92, dropoff: 5, time: 0.5, bottleneck: false, description: 'Payment processing' },
                    { stage: 'Inventory', completed: 89, dropoff: 3, time: 0.7, bottleneck: false, description: 'Stock availability check' },
                    { stage: 'Processing', completed: 88, dropoff: 1, time: 1.8, bottleneck: true, description: 'Order fulfillment' },
                    { stage: 'Shipping', completed: 86, dropoff: 2, time: 4.5, bottleneck: false, description: 'Logistics preparation' },
                    { stage: 'Delivery', completed: 85, dropoff: 1, time: 72, bottleneck: false, description: 'Last-mile delivery' },
                  ]} // Process Flow Data
                  margin={{ top: 20, right: 30, left: 130, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} label={{ value: 'Flow (%), Time (h)', position: 'insideBottom', offset: -15 }} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    width={130}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === 'completed') return [`${value}%`, 'Completion Rate'];
                      if (name === 'dropoff') return [`${value}%`, 'Drop-off Rate'];
                      if (name === 'time') {
                        const timeValue = Number(value);
                        return [
                          `${timeValue < 1 ? `${(timeValue * 60).toFixed(0)} min` : timeValue > 24 ? `${(timeValue / 24).toFixed(1)} days` : `${timeValue} h`}`,
                          'Avg Time'
                        ];
                      }
                      return [value, name];
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md border text-xs">
                            <div className="font-medium mb-1">{data.stage}</div>
                            <div className="text-muted-foreground mb-1">{data.description}</div>
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <span>Completion:</span>
                              <span className="font-medium">{data.completed}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <span>Drop-off:</span>
                              <span className={`font-medium ${data.dropoff > 3 ? 'text-destructive' : data.dropoff > 1 ? 'text-amber-500' : 'text-green-500'}`}>
                                {data.dropoff}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span>Proc. Time:</span>
                              <span className="font-medium">
                                {data.time < 1
                                  ? `${(data.time * 60).toFixed(0)} min`
                                  : data.time > 24
                                    ? `${(data.time / 24).toFixed(1)} days`
                                    : `${data.time} h`}
                              </span>
                            </div>
                            {data.bottleneck && (
                              <div className="mt-1 pt-1 border-t border-border flex items-center text-amber-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                <span>Bottleneck Identified</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    name="Completion Rate"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.8}
                    barSize={20}
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="dropoff"
                    name="Drop-off"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.8}
                    barSize={20}
                    radius={[0, 4, 4, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="time"
                    name="Avg Time"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={payload.bottleneck ? 7 : 5}
                          fill={payload.bottleneck ? "hsl(var(--amber-500))" : "hsl(var(--chart-3))"}
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        />
                      );
                    }}
                  />
                  <ReferenceLine x={95} stroke="hsl(var(--green-600))" strokeDasharray="3 3" label={{ value: 'Target', position: 'top', fill: 'hsl(var(--green-600))' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-md p-2">
                <div className="text-xs text-muted-foreground mb-1">Processing Efficiency</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Overall Completion</span>
                  <span className="text-sm font-bold">85%</span>
                </div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-2">
                <div className="text-xs text-muted-foreground mb-1">Bottleneck Identified</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Processing Stage</span>
                  <span className="text-sm font-medium text-amber-500">1.8h avg. time</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency and Performance Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        {/* Efficiency Gauge */}
        <Card className="md:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance by Order Type</CardTitle>
            <CardDescription>Metrics breakdown by order category</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  outerRadius={90}
                  data={[
                    { metric: 'Success Rate', standard: 92, express: 98, bulk: 85, custom: 89 },
                    { metric: 'Process Time', standard: 85, express: 95, bulk: 75, custom: 70 },
                    { metric: 'Cost Efficiency', standard: 90, express: 75, bulk: 95, custom: 72 },
                    { metric: 'Accuracy', standard: 94, express: 97, bulk: 88, custom: 86 },
                    { metric: 'Customer Sat.', standard: 88, express: 96, bulk: 82, custom: 90 },
                  ]} // Performance by Order Type Data
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={36} domain={[0, 100]} />
                  <Radar
                    name="Standard Orders"
                    dataKey="standard"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Express Orders"
                    dataKey="express"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Bulk Orders"
                    dataKey="bulk"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Custom Orders"
                    dataKey="custom"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                  />
                  <Legend />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="md:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance Distribution</CardTitle>
            <CardDescription>Order processing efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      range: '0-1h',
                      count: 320,
                      successRate: 99.7,
                      costEfficiency: 98.2,
                      category: 'optimal'
                    },
                    {
                      range: '1-2h',
                      count: 480,
                      successRate: 99.2,
                      costEfficiency: 96.8,
                      category: 'optimal'
                    },
                    {
                      range: '2-4h',
                      count: 620,
                      successRate: 97.5,
                      costEfficiency: 93.4,
                      category: 'good'
                    },
                    {
                      range: '4-8h',
                      count: 340,
                      successRate: 95.2,
                      costEfficiency: 89.7,
                      category: 'good'
                    },
                    {
                      range: '8-12h',
                      count: 260,
                      successRate: 92.8,
                      costEfficiency: 82.3,
                      category: 'warning'
                    },
                    {
                      range: '12-24h',
                      count: 180,
                      successRate: 90.5,
                      costEfficiency: 74.6,
                      category: 'warning'
                    },
                    {
                      range: '>24h',
                      count: 120,
                      successRate: 85.2,
                      costEfficiency: 68.2,
                      category: 'critical'
                    },
                  ]} // Performance Distribution Data
                  margin={{ top: 20, right: 30, left: 20, bottom: 15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="range" label={{ value: 'Processing Time', position: 'insideBottom', offset: -10 }} />
                  <YAxis yAxisId="left" label={{ value: 'Order Count', angle: -90, position: 'insideLeft', offset: -5 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[60, 100]} label={{ value: 'Rate (%)', angle: 90, position: 'insideRight', offset: -5 }} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'count') return [value, 'Orders'];
                      if (name === 'successRate') return [`${value}%`, 'Success Rate'];
                      if (name === 'costEfficiency') return [`${value}%`, 'Cost Efficiency'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    name="Order Count"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  >
                    {[ // Cell Fill Data
                      { range: '0-1h', count: 320, category: 'optimal' },
                      { range: '1-2h', count: 480, category: 'optimal' },
                      { range: '2-4h', count: 620, category: 'good' },
                      { range: '4-8h', count: 340, category: 'good' },
                      { range: '8-12h', count: 260, category: 'warning' },
                      { range: '12-24h', count: 180, category: 'warning' },
                      { range: '>24h', count: 120, category: 'critical' },
                    ].map((entry) => (
                      <Cell
                        key={`cell-${entry.range}`}
                        fill={
                          entry.category === 'optimal' ? '#10b981' :
                          entry.category === 'good' ? '#3b82f6' :
                          entry.category === 'warning' ? '#f59e0b' :
                          '#ef4444'
                        }
                      />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="successRate"
                    name="Success Rate"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="costEfficiency"
                    name="Cost Efficiency"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <ReferenceLine yAxisId="right" y={90} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Target Success', position: 'right', fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues and Alert Summary */}
      <Card className="mb-6">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Order Performance Issues
            </CardTitle>
            <CardDescription>Top areas requiring attention</CardDescription>
          </div>
          <Badge className="bg-amber-500">{12} Total Issues</Badge>
        </CardHeader>
        <CardContent className="px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-amber-500/10 border border-amber-200">
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm mb-1 text-amber-600">International Shipping Delays</h4>
                  <Badge variant="outline" className="text-amber-500 border-amber-200">Medium</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Average delay increased to 1.5 days for international shipments</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">82 orders affected</div>
                  <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">-12% efficiency</div>
                </div>
              </div>
              <div className="p-3 rounded-md bg-red-500/10 border border-red-200">
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm mb-1 text-red-600">Custom Order Processing</h4>
                  <Badge variant="outline" className="text-red-500 border-red-200">High</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Custom orders taking 28% longer to process than target</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">45 orders affected</div>
                  <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">-18% CSAT</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-amber-500/10 border border-amber-200">
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm mb-1 text-amber-600">Bulk Order Accuracy</h4>
                  <Badge variant="outline" className="text-amber-500 border-amber-200">Medium</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Item accuracy in bulk orders below threshold (88% vs 92% target)</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">64 orders affected</div>
                  <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">+8% returns</div>
                </div>
              </div>
              <div className="p-3 rounded-md bg-red-500/10 border border-red-200">
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm mb-1 text-red-600">Overnight Delivery Failures</h4>
                  <Badge variant="outline" className="text-red-500 border-red-200">High</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Express overnight delivery success rate dropped to 92.4%</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">37 orders affected</div>
                  <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">$12.4k refunds</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPerformanceOverview; 