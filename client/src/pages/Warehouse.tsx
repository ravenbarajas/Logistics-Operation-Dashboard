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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Progress 
} from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Warehouse as WarehouseIcon, 
  Search, 
  MoreHorizontal, 
  AlertTriangle, 
  Clock, 
  Boxes,
  ArrowRightLeft
} from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie
} from 'recharts';

// Dummy warehouse data
const warehouses = [
  {
    id: "WH001",
    name: "West Coast Distribution Center",
    location: "San Francisco, CA",
    capacity: 85,
    items: 432,
    status: "active"
  },
  {
    id: "WH002",
    name: "Midwest Logistics Hub",
    location: "Chicago, IL",
    capacity: 65,
    items: 287,
    status: "active"
  },
  {
    id: "WH003",
    name: "East Coast Fulfillment Center",
    location: "New York, NY",
    capacity: 92,
    items: 561,
    status: "active"
  },
  {
    id: "WH004",
    name: "Southern Distribution Facility",
    location: "Atlanta, GA",
    capacity: 78,
    items: 342,
    status: "active"
  },
  {
    id: "WH005",
    name: "Northwest Storage Center",
    location: "Seattle, WA",
    capacity: 45,
    items: 178,
    status: "maintenance"
  },
  {
    id: "WH006",
    name: "Southwest Regional Warehouse",
    location: "Phoenix, AZ",
    capacity: 73,
    items: 295,
    status: "active"
  }
];

// Inventory data
const inventory = [
  {
    id: "INV-3452",
    name: "Premium Laptop Stand",
    category: "Electronics",
    warehouse: "WH001",
    quantity: 124,
    status: "in-stock",
    lastUpdated: "Aug 18, 2023"
  },
  {
    id: "INV-3453",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    warehouse: "WH001",
    quantity: 32,
    status: "low-stock",
    lastUpdated: "Aug 15, 2023"
  },
  {
    id: "INV-3454",
    name: "Wireless Headphones",
    category: "Electronics",
    warehouse: "WH003",
    quantity: 78,
    status: "in-stock",
    lastUpdated: "Aug 17, 2023"
  },
  {
    id: "INV-3455",
    name: "Smart Home Hub",
    category: "Electronics",
    warehouse: "WH002",
    quantity: 15,
    status: "low-stock",
    lastUpdated: "Aug 14, 2023"
  },
  {
    id: "INV-3456",
    name: "Ultra HD Monitor",
    category: "Electronics",
    warehouse: "WH003",
    quantity: 42,
    status: "in-stock",
    lastUpdated: "Aug 16, 2023"
  },
  {
    id: "INV-3457",
    name: "Standing Desk",
    category: "Furniture",
    warehouse: "WH004",
    quantity: 8,
    status: "critical",
    lastUpdated: "Aug 12, 2023"
  },
  {
    id: "INV-3458",
    name: "Smartphone Charger",
    category: "Electronics",
    warehouse: "WH001",
    quantity: 156,
    status: "in-stock",
    lastUpdated: "Aug 18, 2023"
  },
  {
    id: "INV-3459",
    name: "Bluetooth Speaker",
    category: "Electronics",
    warehouse: "WH006",
    quantity: 64,
    status: "in-stock",
    lastUpdated: "Aug 13, 2023"
  }
];

// Inventory by category
const inventoryByCategory = [
  { name: 'Electronics', value: 65 },
  { name: 'Furniture', value: 15 },
  { name: 'Apparel', value: 10 },
  { name: 'Home Goods', value: 8 },
  { name: 'Other', value: 2 },
];

// Stock movement data
const stockMovement = [
  { month: 'Mar', inbound: 480, outbound: 420 },
  { month: 'Apr', inbound: 520, outbound: 450 },
  { month: 'May', inbound: 550, outbound: 500 },
  { month: 'Jun', inbound: 580, outbound: 520 },
  { month: 'Jul', inbound: 620, outbound: 580 },
  { month: 'Aug', inbound: 680, outbound: 620 },
];

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Warehouse() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Warehouse Management</h1>
          <p className="text-muted-foreground">Inventory tracking and warehouse operations</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="pl-8 w-[200px] md:w-[260px]"
            />
          </div>
          <Button>Add Item</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <WarehouseIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Total</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">6</h3>
              <p className="text-muted-foreground text-sm">Active Warehouses</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-muted-foreground text-sm">Total</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">2,095</h3>
              <p className="text-muted-foreground text-sm">Items in Stock</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <span className="text-muted-foreground text-sm">Alert</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">23</h3>
              <p className="text-muted-foreground text-sm">Low Stock Items</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <ArrowRightLeft className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-muted-foreground text-sm">Last 24h</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-muted-foreground text-sm">Items Moved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Warehouse Overview</CardTitle>
            <CardDescription>Status and capacity of all warehouses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {warehouses.map((warehouse) => (
                <div key={warehouse.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{warehouse.name}</div>
                      <div className="text-sm text-muted-foreground">{warehouse.location}</div>
                    </div>
                    <Badge variant={warehouse.status === 'active' ? 'success' : 'warning'}>
                      {warehouse.status === 'active' ? 'Active' : 'Maintenance'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Capacity: {warehouse.capacity}%</span>
                    <span>{warehouse.items} items</span>
                  </div>
                  <Progress 
                    value={warehouse.capacity} 
                    className={
                      warehouse.capacity > 90 ? "bg-red-200" : 
                      warehouse.capacity > 75 ? "bg-amber-200" : 
                      "bg-green-200"
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Distribution of items by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {inventoryByCategory.map((entry, index) => (
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
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Stock Movement</CardTitle>
          <CardDescription>Inbound and outbound item movement over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockMovement}
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
                <Bar dataKey="inbound" name="Inbound Items" fill="hsl(var(--primary))" />
                <Bar dataKey="outbound" name="Outbound Items" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="inventory" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="receiving">Receiving</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>Complete inventory across all warehouses</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="apparel">Apparel</SelectItem>
                      <SelectItem value="homegoods">Home Goods</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      {warehouses.map(warehouse => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{warehouses.find(w => w.id === item.warehouse)?.name || item.warehouse}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === 'in-stock' ? 'success' : 
                          item.status === 'low-stock' ? 'warning' : 
                          'destructive'
                        }>
                          {item.status === 'in-stock' ? 'In Stock' : 
                           item.status === 'low-stock' ? 'Low Stock' : 
                           'Critical'
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
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
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit inventory</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Transfer item</DropdownMenuItem>
                            <DropdownMenuItem>Create order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="low-stock">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Filter is applied for low-stock items. The data would be filtered here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transfers">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Warehouse transfers would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="receiving">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-12">
                Incoming shipments and receiving information would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}