import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Search, UserRound, Building2, MapPin, Activity, Clock, Ship, Phone, Mail, UserPlus, Filter, Download, CalendarIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { LineChart } from '@/components/ui/line-chart';
import { CustomerModal } from "@/components/customers/CustomerModal";
import { Customer } from "@/services/customerService";

// Enhanced customer data with more statuses and variety
const customersData = [
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
  {
    id: 8,
    name: "Sunshine Retail",
    contactPerson: "Patricia Martinez",
    email: "patricia@sunshineretail.com",
    phone: "(555) 789-0123",
    location: "Miami, FL",
    status: "inactive",
    orders: 15,
    lastOrder: "Jul 15, 2023",
    totalSpent: "$12,430"
  },
  {
    id: 9,
    name: "Mountain Distributors",
    contactPerson: "Robert Garcia",
    email: "robert@mountaindist.com",
    phone: "(555) 890-1234",
    location: "Denver, CO",
    status: "on-hold",
    orders: 21,
    lastOrder: "Jul 30, 2023",
    totalSpent: "$17,890"
  },
  {
    id: 10,
    name: "Ocean Shipping Ltd",
    contactPerson: "Jennifer Kim",
    email: "jennifer@oceanshipping.com",
    phone: "(555) 901-2345",
    location: "San Diego, CA",
    status: "active",
    orders: 48,
    lastOrder: "Aug 12, 2023",
    totalSpent: "$41,250"
  },
  {
    id: 11,
    name: "Midwest Manufacturing",
    contactPerson: "Thomas Johnson",
    email: "thomas@midwestmanuf.com",
    phone: "(555) 012-3456",
    location: "Detroit, MI",
    status: "active",
    orders: 33,
    lastOrder: "Aug 11, 2023",
    totalSpent: "$27,850"
  },
  {
    id: 12,
    name: "Capital Goods Inc",
    contactPerson: "Jessica Williams",
    email: "jessica@capitalgoods.com",
    phone: "(555) 123-4567",
    location: "Washington, DC",
    status: "inactive",
    orders: 19,
    lastOrder: "Jul 9, 2023",
    totalSpent: "$15,420"
  },
  {
    id: 13,
    name: "Valley Fresh Produce",
    contactPerson: "Charles Miller",
    email: "charles@valleyfresh.com",
    phone: "(555) 234-5678",
    location: "Portland, OR",
    status: "on-hold",
    orders: 27,
    lastOrder: "Jul 25, 2023",
    totalSpent: "$21,340"
  },
  {
    id: 14,
    name: "Urban Delivery",
    contactPerson: "Anthony Davis",
    email: "anthony@urbandelivery.com",
    phone: "(555) 345-6789",
    location: "Chicago, IL",
    status: "active",
    orders: 35,
    lastOrder: "Aug 13, 2023",
    totalSpent: "$29,780"
  },
  {
    id: 15,
    name: "Premier Logistics",
    contactPerson: "Amanda White",
    email: "amanda@premierlogistics.com",
    phone: "(555) 456-7890",
    location: "Atlanta, GA",
    status: "active",
    orders: 52,
    lastOrder: "Aug 14, 2023",
    totalSpent: "$47,350"
  }
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
  const [customers, setCustomers] = useState(customersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  
  // Added new filter states
  const [dateFilter, setDateFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  
  // Calculate statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
  const onHoldCustomers = customers.filter(c => c.status === 'on-hold').length;
  const totalOrders = customers.reduce((sum, customer) => sum + customer.orders, 0);
  
  // Filter customers based on search term, status, and additional filters
  const getFilteredCustomers = (status?: string) => {
    let filtered = customers;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter if needed
    if (status && status !== 'all') {
      filtered = filtered.filter(customer => customer.status === status);
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      filtered = filtered.filter(customer => {
        const orderDate = new Date(customer.lastOrder);
        if (dateFilter === "today") {
          return orderDate.toDateString() === today.toDateString();
        } else if (dateFilter === "yesterday") {
          return orderDate.toDateString() === yesterday.toDateString();
        } else if (dateFilter === "week") {
          return orderDate >= lastWeek;
        }
        return true;
      });
    }
    
    // Apply activity filter
    if (activityFilter !== "all") {
      if (activityFilter === "high") {
        filtered = filtered.filter(customer => customer.orders > 30);
      } else if (activityFilter === "medium") {
        filtered = filtered.filter(customer => customer.orders >= 15 && customer.orders <= 30);
      } else if (activityFilter === "low") {
        filtered = filtered.filter(customer => customer.orders < 15);
      }
    }
    
    return filtered;
  };
  
  // Customer management functions
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };
  
  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };
  
  const handleCustomerSuccess = (customer: any) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(prevCustomers => 
        prevCustomers.map(c => c.id === customer.id ? customer : c)
      );
    } else {
      // Add new customer
      setCustomers(prevCustomers => [...prevCustomers, customer]);
    }
  };
  
  // Distribution data for pie chart
  const customerDistribution = [
    { name: 'Active', value: activeCustomers },
    { name: 'Inactive', value: inactiveCustomers },
    { name: 'On Hold', value: onHoldCustomers }
  ];
  
  // Order volume trend data
  const orderTrend = [
    { name: 'Jan', value: 42 },
    { name: 'Feb', value: 55 },
    { name: 'Mar', value: 46 },
    { name: 'Apr', value: 63 },
    { name: 'May', value: 58 },
    { name: 'Jun', value: 78 },
    { name: 'Jul', value: 82 },
    { name: 'Aug', value: 91 }
  ];

  // Customer category data for bar chart
  const categoryData = [
    { name: 'Retail', value: 35 },
    { name: 'Manufacturing', value: 25 },
    { name: 'Distribution', value: 22 },
    { name: 'Services', value: 18 }
  ];
  
  // Value formatter for charts
  const valueFormatter = (value: number) => `${value}`;

  // Inline CustomerModal component since the imported one seems to be missing
  const CustomerModal = ({ 
    isOpen, 
    onClose, 
    customer, 
    onSave 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    customer: any | null; 
    onSave: (customer: any) => void; 
  }) => {
    const [formData, setFormData] = useState(
      customer || {
        id: Math.floor(Math.random() * 1000),
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        location: "",
        status: "active",
        orders: 0,
        lastOrder: "N/A",
        totalSpent: "$0"
      }
    );

    useEffect(() => {
      if (customer) {
        setFormData(customer);
      } else {
        setFormData({
          id: Math.floor(Math.random() * 1000),
          name: "",
          contactPerson: "",
          email: "",
          phone: "",
          location: "",
          status: "active",
          orders: 0,
          lastOrder: "N/A",
          totalSpent: "$0"
        });
      }
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
            <DialogDescription>
              {customer ? "Update customer information" : "Enter customer details to add them to the system"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactPerson" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {customer ? "Save Changes" : "Add Customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Update the render filters component to be more compact
  const RenderFilters = () => (
    <div className="flex flex-row gap-2">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-4 w-4 opacity-50" />
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Last order date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Select value={activityFilter} onValueChange={setActivityFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Activity level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Activity</SelectItem>
          <SelectItem value="high">High (&gt;30 orders)</SelectItem>
          <SelectItem value="medium">Medium (15-30)</SelectItem>
          <SelectItem value="low">Low (&lt;15 orders)</SelectItem>
        </SelectContent>
      </Select>
      <Select value={industryFilter} onValueChange={setIndustryFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Industry" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Industries</SelectItem>
          <SelectItem value="retail">Retail</SelectItem>
          <SelectItem value="manufacturing">Manufacturing</SelectItem>
          <SelectItem value="distribution">Distribution</SelectItem>
          <SelectItem value="services">Services</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddCustomer}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
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
              <h3 className="text-2xl font-bold">{totalCustomers}</h3>
              <p className="text-muted-foreground text-sm">Total Customers</p>
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
              <h3 className="text-2xl font-bold">{totalOrders}</h3>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Distribution</CardTitle>
            <CardDescription>Breakdown of customer status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerDistribution.map((entry, index) => (
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
                <LineChart
                  data={orderTrend}
                  index="name"
                  categories={["value"]}
                  colors={["#2563eb"]}
                  valueFormatter={valueFormatter}
                />
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="on-hold">On Hold</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <CardTitle>Customer List</CardTitle>
                  <CardDescription>Manage and track all customer information</CardDescription>
                </div>
                <RenderFilters />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredCustomers().length > 0 ? (
                    getFilteredCustomers().map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.contactPerson}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {customer.email}
                            </div>
                            <div className="flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" /> {customer.phone}
                            </div>
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
                              <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                Edit customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>View orders</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        No customers found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredCustomers().length} of {totalCustomers} customers
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <CardTitle>Active Customers</CardTitle>
                  <CardDescription>Customers with active accounts and regular orders</CardDescription>
                </div>
                <RenderFilters />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredCustomers('active').length > 0 ? (
                    getFilteredCustomers('active').map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.contactPerson}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {customer.email}
                            </div>
                            <div className="flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" /> {customer.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.location}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                Edit customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>View orders</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No active customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredCustomers('active').length} of {activeCustomers} active customers
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="inactive">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <CardTitle>Inactive Customers</CardTitle>
                  <CardDescription>Customers with inactive accounts or no recent orders</CardDescription>
                </div>
                <RenderFilters />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredCustomers('inactive').length > 0 ? (
                    getFilteredCustomers('inactive').map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.contactPerson}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {customer.email}
                            </div>
                            <div className="flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" /> {customer.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.location}</TableCell>
                        <TableCell>{customer.lastOrder}</TableCell>
                        <TableCell>{customer.orders}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                Edit customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>View history</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-primary">
                                Reactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No inactive customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredCustomers('inactive').length} of {inactiveCustomers} inactive customers
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="on-hold">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <CardTitle>On Hold Customers</CardTitle>
                  <CardDescription>Customers with accounts temporarily on hold</CardDescription>
                </div>
                <RenderFilters />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>On Hold Since</TableHead>
                    <TableHead>Previous Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredCustomers('on-hold').length > 0 ? (
                    getFilteredCustomers('on-hold').map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.contactPerson}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {customer.email}
                            </div>
                            <div className="flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" /> {customer.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.location}</TableCell>
                        <TableCell>Payment verification</TableCell>
                        <TableCell>{customer.lastOrder}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                Edit customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-success">
                                Reactivate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No on-hold customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredCustomers('on-hold').length} of {onHoldCustomers} on-hold customers
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add CustomerModal at the end */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={editingCustomer}
        onSave={handleCustomerSuccess}
      />
    </div>
  );
}