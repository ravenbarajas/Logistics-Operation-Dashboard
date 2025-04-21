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
import { MoreHorizontal, Search, UserRound, Building2, MapPin, Activity, Clock, Ship, Phone, Mail, UserPlus, Filter, Download, CalendarIcon, User, UserCheck, DollarSign, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { LineChart } from '@/components/ui/line-chart';
import { CustomerModal } from "@/components/customers/CustomerModal";
import { Customer } from "@/services/customerService";
import { customerService } from "@/services/customerService";
import { CustomerSummary } from "@/services/customerService";
import { Plus, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

// Define a UI-specific customer interface that matches the component's needs
interface UICustomer {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  orders: number;
  lastOrder: string;
  totalSpent: string;
}

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
  const [customers, setCustomers] = useState<UICustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<CustomerSummary | null>(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  
  // Get current location from wouter
  const [location, setLocation] = useLocation();
  
  // Determine which section to show based on the route
  const [activeSection, setActiveSection] = useState("summary");
  
  useEffect(() => {
    // Extract section from URL path
    if (location.includes('/customers/directory')) {
      setActiveSection('directory');
    } else if (location.includes('/customers/segmentation')) {
      setActiveSection('segmentation');
    } else if (location.includes('/customers/satisfaction')) {
      setActiveSection('satisfaction');
    } else {
      setActiveSection('summary');
    }
  }, [location]);
  
  // Get current page name for display
  const getCurrentPageName = () => {
    switch (activeSection) {
      case 'directory':
        return 'Customer Directory';
      case 'segmentation':
        return 'Customer Segmentation';
      case 'satisfaction':
        return 'Customer Satisfaction';
      default:
        return 'Customer Summary';
    }
  };
  
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
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Filter customers based on search term, status, and additional filters
  const getFilteredCustomers = (status?: string) => {
    let filtered = customers;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchQuery.toLowerCase())
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [customersData, summaryData] = await Promise.all([
        customerService.getCustomers(),
        customerService.getCustomerSummary()
      ]);
      
      // Map the API customer data to the UI customer format
      const uiCustomers: UICustomer[] = customersData.map(customer => ({
        id: customer.id,
        name: customer.name,
        contactPerson: customer.company || '',
        email: customer.email,
        phone: customer.phone,
        location: `${customer.address.city}, ${customer.address.state}`,
        status: customer.status,
        orders: customer.totalOrders,
        lastOrder: customer.lastOrderDate ? customer.lastOrderDate.toLocaleDateString() : 'N/A',
        totalSpent: `$${customer.totalSpent.toFixed(2)}`
      }));
      
      setCustomers(uiCustomers);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <span>Current section: </span>
            <Badge className="ml-2">{getCurrentPageName()}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Summary Cards - Always visible on all sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {activeSection === "summary" ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Total Customers</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+{Math.round(totalCustomers * 0.05)} since last month</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Active Customers</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{activeCustomers}</div>
                <div className="flex items-center">
                  <p className="text-xs text-muted-foreground">{activeCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}% of total</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">${totalOrders > 0 ? Math.round(totalCustomers * 120).toLocaleString() : 0}</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+3.2% from last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">94.3%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+1.5% year over year</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : activeSection === "directory" ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Total Entries</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{getFilteredCustomers().length}</div>
                <div className="flex items-center">
                  <p className="text-xs text-muted-foreground">Showing {getFilteredCustomers().length} of {totalCustomers}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Last Updated</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Response Time</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">2.4s</div>
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">-0.3s from last week</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Filter Status</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">
                  {searchQuery || dateFilter !== "all" || activityFilter !== "all" ? "Active" : "None"}
                </div>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {searchQuery ? "Search" : ""}{searchQuery && (dateFilter !== "all" || activityFilter !== "all") ? " + " : ""}
                    {dateFilter !== "all" ? "Date" : ""}{dateFilter !== "all" && activityFilter !== "all" ? " + " : ""}
                    {activityFilter !== "all" ? "Activity" : ""}
                    {!searchQuery && dateFilter === "all" && activityFilter === "all" ? "No filters applied" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : activeSection === "segmentation" ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Business Customers</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{summary?.businessCustomers || 0}</div>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {summary ? Math.round((summary.businessCustomers / summary.totalCustomers) * 100) : 0}% of total
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Individual Customers</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{summary?.individualCustomers || 0}</div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {summary ? Math.round((summary.individualCustomers / summary.totalCustomers) * 100) : 0}% of total
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Avg. Business Value</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">
                  ${summary?.businessCustomers ? Math.round((summary.totalRevenue * 0.7) / summary.businessCustomers).toLocaleString() : 0}
                </div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+5.7% from last year</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Avg. Individual Value</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">
                  ${summary?.individualCustomers ? Math.round((summary.totalRevenue * 0.3) / summary.individualCustomers).toLocaleString() : 0}
                </div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+2.3% from last year</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Average Rating</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">4.7/5.0</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+0.2 from last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Response Rate</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">68%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+5% from last survey</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">NPS Score</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">62</div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">Industry avg: 45</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">Survey Completion</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">91.4%</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+3.2% higher than industry</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Section Navigation Tabs */}
      <Tabs value={activeSection} onValueChange={(value) => {
        setLocation(`/customers/${value}`);
      }} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="summary">Customer Summary</TabsTrigger>
          <TabsTrigger value="directory">Customer Directory</TabsTrigger>
          <TabsTrigger value="segmentation">Customer Segmentation</TabsTrigger>
          <TabsTrigger value="satisfaction">Customer Satisfaction</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Customer Summary Section */}
      {activeSection === "summary" && summary && (
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full">
            <Card>
              <CardHeader className="text-center">
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
              <CardHeader className="text-center">
                <CardTitle>Order Volume Trend</CardTitle>
                <CardDescription>Monthly order volume history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={orderTrend}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#2563eb" activeDot={{ r: 8 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Customer Type Distribution</CardTitle>
                <CardDescription>Business vs Individual customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Business', value: summary?.businessCustomers || 0 },
                          { name: 'Individual', value: summary?.individualCustomers || 0 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle>Customer Revenue Trend</CardTitle>
                <CardDescription>Average revenue per customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={[
                        { month: 'Jan', value: 980 },
                        { month: 'Feb', value: 1020 },
                        { month: 'Mar', value: 1110 },
                        { month: 'Apr', value: 1050 },
                        { month: 'May', value: 1180 },
                        { month: 'Jun', value: 1250 },
                        { month: 'Jul', value: 1310 },
                        { month: 'Aug', value: 1420 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Line type="monotone" dataKey="value" stroke="#10b981" activeDot={{ r: 8 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Customer Directory Section */}
      {activeSection === "directory" && (
        <div className="flex flex-col items-center w-full">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <CardTitle>Customer Directory</CardTitle>
                  <CardDescription>Searchable table of all customer accounts</CardDescription>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search customers..."
                      className="pl-8 w-[200px] md:w-[260px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <RenderFilters />
                </div>
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
                        <Button variant="ghost" size="sm" onClick={() => handleEditCustomer(customer)}>
                          View
                        </Button>
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
            <CardFooter className="border-t py-4 px-6 flex justify-center">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredCustomers().length} of {totalCustomers} customers
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Customer Segmentation Section */}
      {activeSection === "segmentation" && (
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 w-full">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Distribution by Type</CardTitle>
                <CardDescription>Business vs Individual customers</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Business', value: summary?.businessCustomers || 0 },
                        { name: 'Individual', value: summary?.individualCustomers || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle>Distribution by Region</CardTitle>
                <CardDescription>Geographical distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={customersByRegion}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle>Distribution by Value</CardTitle>
                <CardDescription>Customer spending categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'High Value', value: 22 },
                      { name: 'Medium Value', value: 45 },
                      { name: 'Low Value', value: 33 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Customer Satisfaction Section */}
      {activeSection === "satisfaction" && (
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-1 mb-6 w-full">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Satisfaction Score Trends</CardTitle>
                <CardDescription>Monthly customer feedback scores</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={[
                      { month: 'Jan', score: 4.2 },
                      { month: 'Feb', score: 4.3 },
                      { month: 'Mar', score: 4.1 },
                      { month: 'Apr', score: 4.4 },
                      { month: 'May', score: 4.5 },
                      { month: 'Jun', score: 4.6 },
                      { month: 'Jul', score: 4.6 },
                      { month: 'Aug', score: 4.7 }
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3.5, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <Card>
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-2xl font-bold">4.7/5.0</div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+0.2 from last quarter</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-2xl font-bold">68%</div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">+5% from last survey</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-2xl font-bold">62</div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-xs text-green-500">Industry avg: 45</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* CustomerModal component */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={editingCustomer}
        onSave={handleCustomerSuccess}
      />
    </div>
  );
}