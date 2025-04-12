import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
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
  Cell,
  AreaChart,
  Area,
  Scatter,
  ScatterChart,
  ZAxis,
  ComposedChart,
} from 'recharts';
import { 
  ArrowDown, 
  ArrowUp, 
  BarChart2, 
  DollarSign, 
  RefreshCcw, 
  ShoppingCart, 
  TrendingDown, 
  TrendingUp 
} from "lucide-react";

// Define the component props
interface OrderFinancialAnalyticsProps {
  // Add any props here if needed
}

export function OrderFinancialAnalytics({}: OrderFinancialAnalyticsProps) {
  const [selectedTimeInterval, setSelectedTimeInterval] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Sample data for Returns and Refunds
  const returnsAndRefundsData = [
    { month: 'Jan', returns: 28, refunds: 22, returnRate: 3.2, refundAmount: 4320 },
    { month: 'Feb', returns: 24, refunds: 20, returnRate: 2.8, refundAmount: 3840 },
    { month: 'Mar', returns: 32, refunds: 25, returnRate: 3.5, refundAmount: 5100 },
    { month: 'Apr', returns: 36, refunds: 30, returnRate: 3.9, refundAmount: 6230 },
    { month: 'May', returns: 30, refunds: 24, returnRate: 3.3, refundAmount: 5280 },
    { month: 'Jun', returns: 26, refunds: 22, returnRate: 2.9, refundAmount: 4750 },
    { month: 'Jul', returns: 28, refunds: 23, returnRate: 3.1, refundAmount: 4980 },
    { month: 'Aug', returns: 34, refunds: 28, returnRate: 3.7, refundAmount: 5850 },
  ];

  // Sample data for Profitability Analysis
  const profitabilityData = [
    { month: 'Jan', revenue: 142500, costs: 114000, profit: 28500, margin: 20.0 },
    { month: 'Feb', revenue: 138200, costs: 112000, profit: 26200, margin: 19.0 },
    { month: 'Mar', revenue: 156800, costs: 125400, profit: 31400, margin: 20.0 },
    { month: 'Apr', revenue: 168500, costs: 132100, profit: 36400, margin: 21.6 },
    { month: 'May', revenue: 172300, costs: 133900, profit: 38400, margin: 22.3 },
    { month: 'Jun', revenue: 183600, costs: 141300, profit: 42300, margin: 23.0 },
    { month: 'Jul', revenue: 189200, costs: 146800, profit: 42400, margin: 22.4 },
    { month: 'Aug', revenue: 182800, costs: 142500, profit: 40300, margin: 22.0 },
  ];

  // Sample data for Profit Trends
  const profitTrendsData = [
    { source: 'Direct Sales', value: 42, percentage: 42 },
    { source: 'Distributor', value: 28, percentage: 28 },
    { source: 'Ecommerce', value: 18, percentage: 18 },
    { source: 'Wholesale', value: 12, percentage: 12 },
  ];

  // Sample data for Discount Analysis
  const discountAnalysisData = [
    { discountLevel: 'None (0%)', orderCount: 345, avgOrderValue: 215, revenue: 74175, profitMargin: 29 },
    { discountLevel: 'Small (5-10%)', orderCount: 560, avgOrderValue: 185, revenue: 103600, profitMargin: 25 },
    { discountLevel: 'Medium (11-20%)', orderCount: 420, avgOrderValue: 155, revenue: 65100, profitMargin: 22 },
    { discountLevel: 'Large (21-30%)', orderCount: 280, avgOrderValue: 135, revenue: 37800, profitMargin: 18 },
    { discountLevel: 'Promo (31-50%)', orderCount: 195, avgOrderValue: 120, revenue: 23400, profitMargin: 14 },
  ];
  
  // Sample data for Fulfillment Costs
  const fulfillmentCostsData = [
    { month: 'Jan', picking: 12500, packaging: 8200, shipping: 18750, laborOther: 9800, total: 49250 },
    { month: 'Feb', picking: 13100, packaging: 8500, shipping: 19200, laborOther: 10100, total: 50900 },
    { month: 'Mar', picking: 13800, packaging: 9100, shipping: 20100, laborOther: 10500, total: 53500 },
    { month: 'Apr', picking: 13500, packaging: 8800, shipping: 19800, laborOther: 10300, total: 52400 },
    { month: 'May', picking: 14200, packaging: 9300, shipping: 21000, laborOther: 10900, total: 55400 },
    { month: 'Jun', picking: 15100, packaging: 9800, shipping: 22300, laborOther: 11500, total: 58700 },
    { month: 'Jul', picking: 15600, packaging: 10200, shipping: 23100, laborOther: 11800, total: 60700 },
    { month: 'Aug', picking: 15400, packaging: 10000, shipping: 22800, laborOther: 11700, total: 59900 },
  ];

  // Pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <CardTitle>Order Financial Analytics</CardTitle>
          <CardDescription>Financial metrics and performance indicators for orders</CardDescription>
        </div>
        <Select
          value={selectedTimeInterval}
          onValueChange={(value) => setSelectedTimeInterval(value as 'week' | 'month' | 'quarter' | 'year')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Time Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="returns">Returns & Refunds</TabsTrigger>
          <TabsTrigger value="profitability">Profitability Analysis</TabsTrigger>
          <TabsTrigger value="fulfillment">Fulfillment Costs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,334,100</div>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+12.5% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$285,900</div>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+14.2% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">21.4%</div>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+1.2% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.3%</div>
                <div className="flex items-center pt-1">
                  <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-0.4% from last period</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs. Profit</CardTitle>
                <CardDescription>Monthly comparison of revenue, costs, and profit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={profitabilityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#8884d8" />
                      <Bar yAxisId="left" dataKey="costs" name="Costs" fill="#ff8042" />
                      <Line yAxisId="right" type="monotone" dataKey="profit" name="Profit" stroke="#82ca9d" strokeWidth={3} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profit by Channel</CardTitle>
                <CardDescription>Distribution of profit across sales channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={profitTrendsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {profitTrendsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`$${(value as number * 1000).toLocaleString()}`, props.payload.source]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Profitability by Discount Level</CardTitle>
              <CardDescription>Analyzing the impact of discounts on order volume and profitability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={discountAnalysisData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="discountLevel" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orderCount" name="Order Count" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="avgOrderValue" name="Avg Order Value ($)" fill="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="profitMargin" name="Profit Margin (%)" stroke="#ff8042" strokeWidth={3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Returns & Refunds Tab */}
        <TabsContent value="returns">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">238</div>
                <div className="flex items-center pt-1">
                  <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-2.5% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">194</div>
                <div className="flex items-center pt-1">
                  <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-3.1% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Return Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.3%</div>
                <div className="flex items-center pt-1">
                  <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-0.4% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Refund Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$40,350</div>
                <div className="flex items-center pt-1">
                  <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-1.8% from last period</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Returns & Refunds Trend</CardTitle>
                <CardDescription>Monthly trend of returns and refunds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={returnsAndRefundsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="returns" name="Returns" strokeWidth={2} stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="refunds" name="Refunds" strokeWidth={2} stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Return Rate vs Refund Amount</CardTitle>
                <CardDescription>Relationship between return rates and refund amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        type="number" 
                        dataKey="returnRate" 
                        name="Return Rate" 
                        unit="%" 
                        domain={[2.5, 4.0]}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="refundAmount" 
                        name="Refund Amount" 
                        unit="$"
                      />
                      <ZAxis range={[60, 400]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter 
                        name="Returns vs Refunds" 
                        data={returnsAndRefundsData} 
                        fill="#8884d8"
                        shape="circle"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Return Reasons Analysis</CardTitle>
              <CardDescription>Distribution of return reasons and their financial impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { reason: 'Damaged in Transit', count: 76, cost: 15200, percentage: 32 },
                      { reason: 'Wrong Item', count: 52, cost: 10400, percentage: 22 },
                      { reason: 'Quality Issues', count: 45, cost: 9000, percentage: 19 },
                      { reason: 'Not as Described', count: 31, cost: 6200, percentage: 13 },
                      { reason: 'Late Delivery', count: 19, cost: 3800, percentage: 8 },
                      { reason: 'Other', count: 15, cost: 3000, percentage: 6 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="reason" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Number of Returns" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="cost" name="Financial Impact ($)" fill="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="percentage" name="% of Total Returns" stroke="#ff8042" strokeWidth={3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Profitability Analysis Tab */}
        <TabsContent value="profitability">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">21.4%</div>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+1.2% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Highest Margin Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34.5%</div>
                <div className="flex items-center pt-1">
                  <ShoppingCart className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Warehouse Equipment</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Profit Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8%</div>
                <div className="flex items-center pt-1">
                  <BarChart2 className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">Consistent growth trend</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.6%</div>
                <div className="flex items-center pt-1">
                  <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-2.3% in cost ratio</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Profit Trends</CardTitle>
                <CardDescription>Revenue, costs and profit margin over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={profitabilityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 30]} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#8884d8" stackId="a" />
                      <Bar yAxisId="left" dataKey="costs" name="Costs ($)" fill="#ff8042" stackId="a" />
                      <Line yAxisId="right" type="monotone" dataKey="margin" name="Profit Margin (%)" stroke="#82ca9d" strokeWidth={3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Product Category Profitability</CardTitle>
                <CardDescription>Profit margin by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { category: 'Shipping Supplies', revenue: 248500, cost: 181410, profit: 67090, margin: 27.0 },
                        { category: 'Warehouse Equipment', revenue: 354200, cost: 231990, profit: 122210, margin: 34.5 },
                        { category: 'Safety Products', revenue: 178300, cost: 124810, profit: 53490, margin: 30.0 },
                        { category: 'Packaging Materials', revenue: 295100, cost: 224680, profit: 70420, margin: 23.9 },
                        { category: 'Transport Equipment', revenue: 158000, cost: 113760, profit: 44240, margin: 28.0 },
                        { category: 'Office Supplies', revenue: 100000, cost: 82000, profit: 18000, margin: 18.0 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'Profit Margin') return [`${value}%`, name];
                          return [`$${Number(value).toLocaleString()}`, name];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#8884d8" stackId="a" />
                      <Bar dataKey="cost" name="Cost" fill="#ff8042" stackId="a" />
                      <Line dataKey="margin" name="Profit Margin" stroke="#82ca9d" strokeWidth={3} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Discount Impact Analysis</CardTitle>
              <CardDescription>How different discount levels affect profitability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={discountAnalysisData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="discountLevel" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 30]} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="avgOrderValue" name="Avg Order Value ($)" stroke="#8884d8" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="profitMargin" name="Profit Margin (%)" stroke="#82ca9d" strokeWidth={2} />
                    <Line yAxisId="left" type="monotone" dataKey="orderCount" name="Order Count" stroke="#ff8042" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Fulfillment Costs Tab */}
        <TabsContent value="fulfillment">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Fulfillment Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$440,750</div>
                <div className="flex items-center pt-1">
                  <ArrowUp className="h-4 w-4 mr-1 text-red-500" />
                  <p className="text-xs text-red-500">+5.8% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Per Order Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$22.45</div>
                <div className="flex items-center pt-1">
                  <ArrowUp className="h-4 w-4 mr-1 text-red-500" />
                  <p className="text-xs text-red-500">+1.2% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Shipping % of Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38.5%</div>
                <div className="flex items-center pt-1">
                  <ArrowUp className="h-4 w-4 mr-1 text-red-500" />
                  <p className="text-xs text-red-500">+0.8% from last period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Labor Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.6</div>
                <div className="flex items-center pt-1">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+2.3 orders/hour</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Fulfillment Cost Breakdown</CardTitle>
                <CardDescription>Cost distribution across fulfillment operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={fulfillmentCostsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      stackOffset="expand"
                      baseValue={0}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <Tooltip formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]} />
                      <Legend />
                      <Area type="monotone" dataKey="picking" name="Picking" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="packaging" name="Packaging" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="shipping" name="Shipping" stackId="1" stroke="#ffc658" fill="#ffc658" />
                      <Area type="monotone" dataKey="laborOther" name="Labor & Other" stackId="1" stroke="#ff8042" fill="#ff8042" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Cost Trend</CardTitle>
                <CardDescription>Fulfillment cost trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={fulfillmentCostsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="total" name="Total Fulfillment Cost" stroke="#8884d8" strokeWidth={3} />
                      <Line type="monotone" dataKey="picking" name="Picking" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="packaging" name="Packaging" stroke="#ffc658" />
                      <Line type="monotone" dataKey="shipping" name="Shipping" stroke="#ff8042" />
                      <Line type="monotone" dataKey="laborOther" name="Labor & Other" stroke="#ea5545" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Cost to Revenue Ratio</CardTitle>
              <CardDescription>Fulfillment costs as a percentage of revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { month: 'Jan', fulfillmentCost: 49250, revenue: 142500, ratio: 34.6 },
                      { month: 'Feb', fulfillmentCost: 50900, revenue: 138200, ratio: 36.8 },
                      { month: 'Mar', fulfillmentCost: 53500, revenue: 156800, ratio: 34.1 },
                      { month: 'Apr', fulfillmentCost: 52400, revenue: 168500, ratio: 31.1 },
                      { month: 'May', fulfillmentCost: 55400, revenue: 172300, ratio: 32.2 },
                      { month: 'Jun', fulfillmentCost: 58700, revenue: 183600, ratio: 32.0 },
                      { month: 'Jul', fulfillmentCost: 60700, revenue: 189200, ratio: 32.1 },
                      { month: 'Aug', fulfillmentCost: 59900, revenue: 182800, ratio: 32.8 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[25, 40]} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Fulfillment Cost') return [`$${Number(value).toLocaleString()}`, name];
                        if (name === 'Revenue') return [`$${Number(value).toLocaleString()}`, name];
                        if (name === 'Cost Ratio') return [`${value}%`, name];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="fulfillmentCost" name="Fulfillment Cost" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="ratio" name="Cost Ratio" stroke="#ff8042" strokeWidth={3} />
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