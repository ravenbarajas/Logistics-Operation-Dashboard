import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, UserRound, Building2, MapPin, Activity, Clock, Ship } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Dummy customer data
const customers = [
  { 
    id: 1, 
    name: "Acme Inc.", 
    contactPerson: "John Smith",
    email: "john@acmeinc.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    status: "active",
    orders: 42,
    lastOrder: "Aug 10, 2023",
    totalSpent: "$34,250"
  },
  { 
    id: 2, 
    name: "TechCorp", 
    contactPerson: "Sarah Jones",
    email: "sarah@techcorp.com",
    phone: "(555) 987-6543",
    location: "Seattle, WA",
    status: "active",
    orders: 37,
    lastOrder: "Aug 8, 2023",
    totalSpent: "$28,750"
  },
  { 
    id: 3, 
    name: "GlobalTrade", 
    contactPerson: "Michael Brown",
    email: "michael@globaltrade.com",
    phone: "(555) 456-7890",
    location: "Denver, CO",
    status: "active",
    orders: 29,
    lastOrder: "Aug 9, 2023",
    totalSpent: "$22,450"
  },
  { 
    id: 4, 
    name: "Metro Supplies", 
    contactPerson: "Lisa Chen",
    email: "lisa@metrosupplies.com",
    phone: "(555) 234-5678",
    location: "Chicago, IL",
    status: "inactive",
    orders: 24,
    lastOrder: "Jul 22, 2023",
    totalSpent: "$18,320"
  },
  { 
    id: 5, 
    name: "East Coast Distribution", 
    contactPerson: "David Wilson",
    email: "david@eastcoastdist.com",
    phone: "(555) 345-6789",
    location: "New York, NY",
    status: "active",
    orders: 31,
    lastOrder: "Aug 7, 2023",
    totalSpent: "$24,680"
  },
  { 
    id: 6, 
    name: "Western Logistics", 
    contactPerson: "Emma Rodriguez",
    email: "emma@westernlogistics.com",
    phone: "(555) 567-8901",
    location: "Los Angeles, CA",
    status: "on-hold",
    orders: 18,
    lastOrder: "Jul 28, 2023",
    totalSpent: "$15,240"
  },
  { 
    id: 7, 
    name: "NorthStar Freight", 
    contactPerson: "James Thompson",
    email: "james@northstarfreight.com",
    phone: "(555) 678-9012",
    location: "Minneapolis, MN",
    status: "active",
    orders: 22,
    lastOrder: "Aug 5, 2023",
    totalSpent: "$19,850"
  },
];

// Customer distribution by region data
const customersByRegion = [
  { name: 'West Coast', value: 35 },
  { name: 'East Coast', value: 30 },
  { name: 'Midwest', value: 20 },
  { name: 'South', value: 15 },
];

// Order volume history
const orderVolumeData = [
  { month: 'Jan', volume: 420 },
  { month: 'Feb', volume: 380 },
  { month: 'Mar', volume: 450 },
  { month: 'Apr', volume: 520 },
  { month: 'May', volume: 550 },
  { month: 'Jun', volume: 620 },
  { month: 'Jul', volume: 680 },
  { month: 'Aug', volume: 720 },
];

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Customers() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage customer relationships and monitor order activities</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8 w-[200px] md:w-[260px]"
            />
          </div>
          <Button>Add Customer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <UserRound className="h-6 w-6 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Total</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">163</h3>
              <p className="text-muted-foreground text-sm">Active Customers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-muted-foreground text-sm">All-time</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">8,427</h3>
              <p className="text-muted-foreground text-sm">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                <Ship className="h-6 w-6 text-amber-500" />
              </div>
              <span className="text-muted-foreground text-sm">Month</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">720</h3>
              <p className="text-muted-foreground text-sm">New Orders</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-muted-foreground text-sm">Average</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">$4,285</h3>
              <p className="text-muted-foreground text-sm">Order Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="onhold">On Hold</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Customer List</CardTitle>
              <CardDescription>Manage and track all customer information</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.contactPerson}</div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.location}</TableCell>
                      <TableCell>
                        <Badge variant={
                          customer.status === 'active' ? 'success' : 
                          customer.status === 'inactive' ? 'secondary' : 
                          'warning'
                        }>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell>{customer.totalSpent}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View profile</DropdownMenuItem>
                            <DropdownMenuItem>View orders</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit customer</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution</CardTitle>
                <CardDescription>Regional distribution of customer base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customersByRegion}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {customersByRegion.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Volume Trend</CardTitle>
                <CardDescription>Monthly order volume history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={orderVolumeData}
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
                      <Bar dataKey="volume" name="Order Volume" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Filter is applied for active customers. The data would be filtered here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inactive">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Filter is applied for inactive customers. The data would be filtered here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="onhold">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Filter is applied for on-hold customers. The data would be filtered here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}