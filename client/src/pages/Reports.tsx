import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon, 
  BarChart, 
  TrendingUp, 
  AlertTriangle,
  Truck,
  Users
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Dummy report data
const reports = [
  {
    id: "REP-2023-1201",
    name: "Monthly Operations Summary",
    category: "operations",
    date: "Aug 1, 2023",
    size: "1.2 MB"
  },
  {
    id: "REP-2023-1202",
    name: "Fleet Performance Analysis",
    category: "fleet",
    date: "Aug 5, 2023",
    size: "3.5 MB"
  },
  {
    id: "REP-2023-1203",
    name: "Delivery Time Optimization",
    category: "delivery",
    date: "Aug 8, 2023",
    size: "2.8 MB"
  },
  {
    id: "REP-2023-1204",
    name: "Customer Satisfaction Survey",
    category: "customer",
    date: "Aug 10, 2023",
    size: "4.1 MB"
  },
  {
    id: "REP-2023-1205",
    name: "Fuel Consumption Trends",
    category: "fleet",
    date: "Aug 12, 2023",
    size: "1.9 MB"
  },
  {
    id: "REP-2023-1206",
    name: "Maintenance Schedule Overview",
    category: "maintenance",
    date: "Aug 15, 2023",
    size: "2.3 MB"
  },
  {
    id: "REP-2023-1207",
    name: "Route Efficiency Analysis",
    category: "route",
    date: "Aug 18, 2023",
    size: "3.2 MB"
  }
];

// Performance metrics data
const performanceData = [
  { month: "Jan", deliverySpeed: 92, costEfficiency: 88, customerSatisfaction: 86 },
  { month: "Feb", deliverySpeed: 93, costEfficiency: 86, customerSatisfaction: 85 },
  { month: "Mar", deliverySpeed: 91, costEfficiency: 89, customerSatisfaction: 87 },
  { month: "Apr", deliverySpeed: 94, costEfficiency: 91, customerSatisfaction: 88 },
  { month: "May", deliverySpeed: 95, costEfficiency: 92, customerSatisfaction: 90 },
  { month: "Jun", deliverySpeed: 93, costEfficiency: 90, customerSatisfaction: 91 },
  { month: "Jul", deliverySpeed: 96, costEfficiency: 93, customerSatisfaction: 92 },
  { month: "Aug", deliverySpeed: 97, costEfficiency: 94, customerSatisfaction: 93 }
];

// Incident data
const incidentData = [
  { month: "Jan", incidents: 12 },
  { month: "Feb", incidents: 15 },
  { month: "Mar", incidents: 10 },
  { month: "Apr", incidents: 8 },
  { month: "May", incidents: 5 },
  { month: "Jun", incidents: 6 },
  { month: "Jul", incidents: 4 },
  { month: "Aug", incidents: 3 }
];

export default function Reports() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Access and generate detailed reports on all logistics operations</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Total</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">248</h3>
              <p className="text-muted-foreground text-sm">Generated Reports</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-muted-foreground text-sm">Average</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">93.4%</h3>
              <p className="text-muted-foreground text-sm">Performance Rating</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                <BarChart className="h-6 w-6 text-amber-500" />
              </div>
              <span className="text-muted-foreground text-sm">Month</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">32</h3>
              <p className="text-muted-foreground text-sm">Reports Generated</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <span className="text-muted-foreground text-sm">Last Month</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">3</h3>
              <p className="text-muted-foreground text-sm">Incidents Reported</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="deliverySpeed" 
                    name="Delivery Speed"
                    stroke="hsl(var(--primary))" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="costEfficiency" 
                    name="Cost Efficiency"
                    stroke="#82ca9d" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="customerSatisfaction" 
                    name="Customer Satisfaction"
                    stroke="#ffc658" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident Reports</CardTitle>
            <CardDescription>Monthly safety and incident tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={incidentData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive))" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
                <div>
                  <CardTitle>Report Library</CardTitle>
                  <CardDescription>Access and download previously generated reports</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                    <Select defaultValue="august">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="august">August 2023</SelectItem>
                        <SelectItem value="july">July 2023</SelectItem>
                        <SelectItem value="june">June 2023</SelectItem>
                        <SelectItem value="may">May 2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="fleet">Fleet</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>
                        <Badge variant={
                          report.category === 'operations' ? 'default' : 
                          report.category === 'fleet' ? 'secondary' : 
                          report.category === 'customer' ? 'success' : 
                          'warning'
                        }>
                          {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="operations">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Filter is applied for operations reports. The data would be filtered here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fleet">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Filter is applied for fleet reports. The data would be filtered here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customer">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Filter is applied for customer reports. The data would be filtered here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report Generator</CardTitle>
          <CardDescription>Create customized reports based on specific criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <Select defaultValue="performance">
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance Analysis</SelectItem>
                  <SelectItem value="fleet">Fleet Utilization</SelectItem>
                  <SelectItem value="delivery">Delivery Metrics</SelectItem>
                  <SelectItem value="cost">Cost Analysis</SelectItem>
                  <SelectItem value="customer">Customer Satisfaction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Input type="text" placeholder="From date" value="01/08/2023" readOnly />
                </div>
                <div className="relative">
                  <Input type="text" placeholder="To date" value="31/08/2023" readOnly />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-2">Data Sections</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="overview" 
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="overview" className="text-sm">Executive Overview</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="metrics" 
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="metrics" className="text-sm">Key Metrics</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="trends" 
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="trends" className="text-sm">Trend Analysis</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="recommendations" 
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="recommendations" className="text-sm">Recommendations</label>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3 flex justify-end mt-4">
              <Button className="w-full md:w-auto">
                <FileText className="mr-2 h-4 w-4" />
                Generate Custom Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}