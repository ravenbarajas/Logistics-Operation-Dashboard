import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox"

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
import { MoreHorizontal, Search, UserRound, Building2, MapPin, Activity, Clock, Ship, Phone, Mail, UserPlus, Filter, Download, CalendarIcon, User, UserCheck, DollarSign, ArrowUp, ArrowDown, ChevronRight, ChevronsLeft, ChevronLeft, Plus, Trash2, Pencil, FileText, UserIcon, RefreshCw, ChevronsRight, AlertCircle, Users, CheckCircle, Bell, MessageSquare, CalendarRange, PlusCircle, TrendingDown, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis, Treemap } from 'recharts';
import 'chart.js/auto';
import { TrendingUp } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { LineChart } from '@/components/ui/line-chart';
import { CustomerModal } from "@/components/customers/CustomerModal";
import { Customer } from "@/services/customerService";
import { customerService } from "@/services/customerService";
import { CustomerSummary } from "@/services/customerService";
import { useLocation } from "wouter";
import { Chart, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';

// Register required Chart.js components
Chart.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, ChartLegend);

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

// Add more sophisticated data structures for the enhanced dashboard
const customerLifetimeValue = [
  { name: 'Q1 2023', value: 2450, previous: 2100, target: 2200 },
  { name: 'Q2 2023', value: 2800, previous: 2300, target: 2500 },
  { name: 'Q3 2023', value: 3100, previous: 2650, target: 2800 },
  { name: 'Q4 2023', value: 3450, previous: 2950, target: 3100 },
  { name: 'Q1 2024', value: 3720, previous: 3200, target: 3400 },
  { name: 'Q2 2024', value: 4050, previous: 3500, target: 3700 },
];

// Format for the LineChart UI component with more detailed data
const retentionRateData = [
  { month: 'Jan', retention: 93.2, industry: 89.5, target: 94.0, churn: 6.8 },
  { month: 'Feb', retention: 92.8, industry: 89.7, target: 94.0, churn: 7.2 },
  { month: 'Mar', retention: 94.1, industry: 90.0, target: 94.0, churn: 5.9 },
  { month: 'Apr', retention: 94.3, industry: 90.1, target: 94.5, churn: 5.7 },
  { month: 'May', retention: 94.5, industry: 90.3, target: 94.5, churn: 5.5 },
  { month: 'Jun', retention: 94.7, industry: 90.2, target: 94.5, churn: 5.3 },
  { month: 'Jul', retention: 95.1, industry: 90.4, target: 95.0, churn: 4.9 },
  { month: 'Aug', retention: 94.9, industry: 90.5, target: 95.0, churn: 5.1 },
];

const customerAcquisitionCost = [
  { name: 'Direct', cost: 280, customers: 450 },
  { name: 'Social', cost: 210, customers: 380 },
  { name: 'Email', cost: 160, customers: 320 },
  { name: 'Referral', cost: 120, customers: 290 },
  { name: 'Organic', cost: 90, customers: 220 },
];

// Enhanced segment performance data with additional metrics
const segmentPerformance = [
  { segment: 'Enterprise', satisfaction: 90, retention: 94, revenue: 65, growth: 18, upsell: 72 },
  { segment: 'Mid-Market', satisfaction: 85, retention: 87, revenue: 50, growth: 24, upsell: 58 },
  { segment: 'SMB', satisfaction: 82, retention: 78, revenue: 40, growth: 32, upsell: 45 },
  { segment: 'Startup', satisfaction: 88, retention: 75, revenue: 25, growth: 42, upsell: 38 },
];

const regionPerformance = {
  name: 'Revenue',
  children: [
    {
      name: 'North America',
      children: [
        { name: 'USA', size: 46 },
        { name: 'Canada', size: 12 },
      ],
    },
    {
      name: 'Europe',
      children: [
        { name: 'UK', size: 15 },
        { name: 'Germany', size: 8 },
        { name: 'France', size: 7 },
      ],
    },
    {
      name: 'Asia Pacific',
      children: [
        { name: 'Australia', size: 6 },
        { name: 'Japan', size: 5 },
        { name: 'Singapore', size: 3 },
      ],
    },
  ],
};

// Customer acquisition funnel data
const acquisitionFunnel = [
  { name: 'Website Visitors', value: 24580 },
  { name: 'Leads Generated', value: 3850 },
  { name: 'Qualified Leads', value: 1920 },
  { name: 'Product Demos', value: 850 },
  { name: 'Proposals Sent', value: 410 },
  { name: 'New Customers', value: 215 },
];

// Funnel conversion rates
const calculateConversion = (index: number) => {
  if (index === 0) return 100;
  const current = acquisitionFunnel[index].value;
  const previous = acquisitionFunnel[index - 1].value;
  return ((current / previous) * 100).toFixed(1);
};

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
  
  // Added new filter states
  const [dateFilter, setDateFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");

  // Metrics pagination and filtering states
  const [metricsFilter, setMetricsFilter] = useState("all");
  const [metricsStatusFilter, setMetricsStatusFilter] = useState("all");
  const [metricsSearchQuery, setMetricsSearchQuery] = useState("");
  const [metricsPage, setMetricsPage] = useState(1);
  const [metricsPageSize, setMetricsPageSize] = useState(5);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  
  // Customer Health Metrics data
  const healthMetrics = [
    { id: 1, name: "Net Promoter Score (NPS)", current: "62", previous: "58", change: "+4", benchmark: "45", status: "excellent" },
    { id: 2, name: "Customer Satisfaction (CSAT)", current: "4.7/5.0", previous: "4.5/5.0", change: "+0.2", benchmark: "4.2/5.0", status: "excellent" },
    { id: 3, name: "Customer Effort Score (CES)", current: "5.8/7.0", previous: "5.5/7.0", change: "+0.3", benchmark: "5.3/7.0", status: "good" },
    { id: 4, name: "Churn Rate", current: "5.1%", previous: "6.8%", change: "-1.7%", benchmark: "7.2%", status: "good" },
    { id: 5, name: "Average Response Time", current: "2.4h", previous: "3.1h", change: "-0.7h", benchmark: "4.0h", status: "excellent" },
    { id: 6, name: "Renewal Rate", current: "87.3%", previous: "85.1%", change: "+2.2%", benchmark: "82.0%", status: "good" },
    { id: 7, name: "First Contact Resolution", current: "78.4%", previous: "75.9%", change: "+2.5%", benchmark: "72.0%", status: "improving" },
    { id: 8, name: "Customer Acquisition Cost (CAC)", current: "$172", previous: "$195", change: "-$23", benchmark: "$210", status: "excellent" },
    { id: 9, name: "Average Revenue Per User (ARPU)", current: "$89/mo", previous: "$82/mo", change: "+$7", benchmark: "$75/mo", status: "good" },
    { id: 10, name: "Customer Lifetime (Months)", current: "42.3", previous: "38.9", change: "+3.4", benchmark: "36.5", status: "good" },
  ];

  // Filter health metrics based on search query and filters
  const getFilteredMetrics = () => {
    let filtered = [...healthMetrics];
    
    // Apply search filter
    if (metricsSearchQuery) {
      filtered = filtered.filter(metric => 
        metric.name.toLowerCase().includes(metricsSearchQuery.toLowerCase())
      );
    }
    
    // Apply metric type filter (simplified for this example)
    if (metricsFilter !== "all") {
      filtered = filtered.filter(metric => {
        if (metricsFilter === "satisfaction") {
          return metric.name.includes("Satisfaction") || metric.name.includes("NPS") || metric.name.includes("CSAT");
        } else if (metricsFilter === "retention") {
          return metric.name.includes("Churn") || metric.name.includes("Renewal") || metric.name.includes("Lifetime");
        } else if (metricsFilter === "response") {
          return metric.name.includes("Response") || metric.name.includes("Resolution");
        } else if (metricsFilter === "financial") {
          return metric.name.includes("Cost") || metric.name.includes("Revenue");
        }
        return true;
      });
    }
    
    // Apply status filter
    if (metricsStatusFilter !== "all") {
      filtered = filtered.filter(metric => metric.status === metricsStatusFilter.toLowerCase());
    }
    
    return filtered;
  };

  // Get paginated metrics
  const getPaginatedMetrics = () => {
    const filtered = getFilteredMetrics();
    const startIndex = (metricsPage - 1) * metricsPageSize;
    return filtered.slice(startIndex, startIndex + metricsPageSize);
  };

  // Calculate total pages for metrics
  const metricsTotalPages = Math.ceil(getFilteredMetrics().length / metricsPageSize);
  
  // Handle metrics page change
  const handleMetricsPageChange = (page: number) => {
    setMetricsPage(page);
  };
  
  // Handle metrics per page change
  const handleMetricsPerPageChange = (value: string) => {
    setMetricsPageSize(parseInt(value));
    setMetricsPage(1); // Reset to first page
  };
  
  // Handle toggle metric selection
  const handleToggleMetricSelection = (metricId: number) => {
    const id = metricId.toString();
    if (selectedMetrics.includes(id)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== id));
    } else {
      setSelectedMetrics([...selectedMetrics, id]);
    }
  };
  
  // Toggle all metrics selection
  const handleToggleAllMetrics = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedMetrics(getPaginatedMetrics().map(m => m.id.toString()));
    } else {
      setSelectedMetrics([]);
    }
  };
  
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

  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Add pagination functionality
  const totalPages = Math.ceil(getFilteredCustomers().length / pageSize);
  
  const paginatedCustomers = getFilteredCustomers().slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleToggleCustomerSelection = (customerId: string) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  const handleViewDetails = (customer: UICustomer) => {
    handleEditCustomer(customer);
  };

  const handleDeleteCustomer = (customer: UICustomer) => {
    // Implementation would go here
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      setCustomers(customers.filter(c => c.id !== customer.id));
      setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id.toString()));
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
            {/* Customer Lifetime Value (CLV) Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Customer Lifetime Value (CLV)</CardTitle>
                <CardDescription>Average revenue generated per customer over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={customerLifetimeValue}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'value') return [`$${value}`, 'Current CLV'];
                          if (name === 'previous') return [`$${value}`, 'Previous Year'];
                          if (name === 'target') return [`$${value}`, 'Target'];
                          return [value, name];
                        }}
                        labelFormatter={(label) => `Period: ${label}`}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="previous" 
                        name="Previous Year" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.1} 
                        strokeDasharray="5 5"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="target" 
                        name="Target" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        fillOpacity={0.1} 
                        strokeDasharray="3 3"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        name="Current CLV" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.3} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Current CLV</span>
                    <span className="text-xl font-bold">$4,050</span>
                    <span className="text-xs text-muted-foreground mt-1">Lifetime revenue per customer</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">YoY Growth</span>
                    <span className="text-xl font-bold text-green-600">+15.8%</span>
                    <span className="text-xs text-muted-foreground mt-1">From $3,500 last year</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Industry Benchmark</span>
                    <span className="text-xl font-bold">$3,700</span>
                    <span className="text-xs text-muted-foreground mt-1">9.5% above average</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Retention Rate Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Customer Retention Rate</CardTitle>
                <CardDescription>Percentage of customers retained over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart 
                    data={retentionRateData}
                    index="month"
                    categories={["retention", "industry", "target"]}
                    colors={["#10b981", "#94a3b8", "#f59e0b"]}
                    valueFormatter={(value) => `${value}%`}
                    yAxisWidth={45}
                  />
                </div>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Current Rate</span>
                    <span className="text-xl font-bold">94.9%</span>
                    <div className="flex items-center text-xs mt-1">
                      <span className="text-red-500 mr-1">5.1% churn</span>
                      <span className="text-muted-foreground">monthly</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">YoY Change</span>
                    <span className="text-xl font-bold text-green-600">+1.7%</span>
                    <div className="flex items-center text-xs mt-1">
                      <span className="text-green-500 mr-1">-2.4%</span>
                      <span className="text-muted-foreground">in customer churn</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Industry Average</span>
                    <span className="text-xl font-bold">90.5%</span>
                    <div className="flex items-center text-xs mt-1">
                      <span className="text-green-500 mr-1">+4.4%</span>
                      <span className="text-muted-foreground">above average</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full">
            {/* Customer Acquisition Funnel Section */}
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Customer Acquisition Funnel</CardTitle>
                <CardDescription>Conversion metrics across the sales pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={acquisitionFunnel}
                      layout="vertical"
                      margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip 
                        formatter={(value) => [`${value.toLocaleString()}`, 'Count']}
                        labelFormatter={(value) => `Stage: ${value}`}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#8884d8" 
                        label={{ 
                          position: 'right', 
                          formatter: (item: { value?: number }) => item && item.value ? `${item.value.toLocaleString()}` : '',
                          fill: 'hsl(var(--foreground))',
                          fontSize: 12
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="font-medium mb-1">Top Source</div>
                    <div>Organic Search (42%)</div>
                    <div className="text-xs text-muted-foreground mt-1">10,323 visitors</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="font-medium mb-1">Best Converting</div>
                    <div>Product Demos (48.2%)</div>
                    <div className="text-xs text-muted-foreground mt-1">850 → 410 proposals</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="font-medium mb-1">Bottleneck</div>
                    <div>Leads to Qualified (49.9%)</div>
                    <div className="text-xs text-muted-foreground mt-1">Opportunity to improve</div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="pb-4 pt-0">
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium text-foreground mb-1">Funnel Health:</div>
                  <p>Overall funnel efficiency is 15% above industry average with a 0.88% visitor-to-customer conversion rate.</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                      <div className="font-medium">Improvement Focus:</div>
                      <p className="mt-1">Reduce qualification time by implementing automated scoring system</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                      <div className="font-medium">Strength:</div>
                      <p className="mt-1">High-quality demos resulting in 48.2% conversion to proposals</p>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            {/* Funnel Conversion Rates Section */}
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Funnel Conversion Rates</CardTitle>
                <CardDescription>Stage-by-stage conversion performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {acquisitionFunnel.map((stage, index) => {
                      if (index === 0) return null;
                      
                      const conversionRate = calculateConversion(index);
                      const previousStage = acquisitionFunnel[index - 1].name;
                      const currentStage = stage.name;
                      
                      // Define status colors based on conversion rate
                      let statusColor = 'bg-amber-500';
                      let statusText = 'Average';
                      
                      const conversionValue = parseFloat(conversionRate as string);
                      if (conversionValue > 45) {
                        statusColor = 'bg-green-500';
                        statusText = 'Good';
                      } else if (conversionValue < 20) {
                        statusColor = 'bg-red-500';
                        statusText = 'Needs Improvement';
                      }
                      
                      return (
                        <div key={index} className="bg-muted/30 p-4 rounded-md">
                          <div className="text-sm font-medium mb-1 flex justify-between">
                            <span>{previousStage} → {currentStage}</span>
                            <span className={`text-xs ${statusColor.replace('bg-', 'text-')} px-2 py-0.5 rounded-full ${statusColor.replace('bg-', 'bg-')}/10`}>
                              {statusText}
                            </span>
                          </div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold">{conversionRate}%</div>
                            <div className="text-sm text-muted-foreground">
                              {stage.value.toLocaleString()} / {acquisitionFunnel[index - 1].value.toLocaleString()}
                            </div>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`${statusColor} h-2.5 rounded-full`}
                              style={{ width: `${conversionValue}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {index === 1 && "Industry avg: 15.7% • Target: 18%"}
                            {index === 2 && "Industry avg: 42.1% • Target: 55%"}
                            {index === 3 && "Industry avg: 38.8% • Target: 50%"}
                            {index === 4 && "Industry avg: 45.2% • Target: 52%"}
                            {index === 5 && "Industry avg: 48.4% • Target: 60%"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-4">
                    <div className="text-sm font-semibold mb-1 flex justify-between items-center">
                      <span>Overall Conversion</span>
                      <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                        {((acquisitionFunnel[acquisitionFunnel.length - 1].value / acquisitionFunnel[0].value) * 100) > 0.8 ? 'Outstanding' : 'Average'}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {((acquisitionFunnel[acquisitionFunnel.length - 1].value / acquisitionFunnel[0].value) * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {acquisitionFunnel[acquisitionFunnel.length - 1].value.toLocaleString()} / {acquisitionFunnel[0].value.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${((acquisitionFunnel[acquisitionFunnel.length - 1].value / acquisitionFunnel[0].value) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Industry average: 0.5-0.9%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Target: 1.0%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mt-1">
                          YoY Change: <span className="text-green-500">+0.12%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          CAC: <span className="text-green-500">-$23</span> vs previous quarter
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Customer Health Metrics Section */}
          <Card className="w-full mb-6">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
              <div>
                <CardTitle className="text-lg">Customer Health Metrics</CardTitle>
                <CardDescription>Comprehensive view of customer performance indicators</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search metrics..."
                      className="pl-8 w-[200px] md:w-[260px]"
                      value={metricsSearchQuery}
                      onChange={(e) => {
                        setMetricsSearchQuery(e.target.value);
                        setMetricsPage(1); // Reset to first page on search
                      }}
                    />      
                  </div>
                  <Select 
                    defaultValue={metricsPageSize.toString()}
                    onValueChange={handleMetricsPerPageChange}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder={`${metricsPageSize} per page`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="15">15 per page</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-2">
                <Select 
                  defaultValue="all"
                  onValueChange={(value) => {
                    setMetricsFilter(value);
                    setMetricsPage(1); // Reset to first page on filter change
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Metric type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Metrics</SelectItem>
                    <SelectItem value="satisfaction">Satisfaction</SelectItem>
                    <SelectItem value="retention">Retention</SelectItem>
                    <SelectItem value="response">Response Times</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  defaultValue="all"
                  onValueChange={(value) => {
                    setMetricsStatusFilter(value);
                    setMetricsPage(1); // Reset to first page on filter change
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="improving">Improving</SelectItem>
                    <SelectItem value="attention">Needs Attention</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {getFilteredMetrics().length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 p-6">
                  <Activity className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-center mb-2">No metrics found</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {metricsSearchQuery || metricsFilter !== "all" || metricsStatusFilter !== "all" 
                      ? "Try adjusting your search filters to find what you're looking for." 
                      : "No data available for the selected filters."}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 text-sm">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium w-[40px]">
                            <input
                              type="checkbox"
                              checked={selectedMetrics.length === getPaginatedMetrics().length && getPaginatedMetrics().length > 0}
                              onChange={handleToggleAllMetrics}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </th>
                          <th className="py-3 px-4 text-left font-medium">Metric</th>
                          <th className="py-3 px-4 text-left font-medium">Current</th>
                          <th className="py-3 px-4 text-left font-medium">Previous</th>
                          <th className="py-3 px-4 text-left font-medium">Change</th>
                          <th className="py-3 px-4 text-left font-medium">Industry Benchmark</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                          <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {getPaginatedMetrics().map((metric) => {
                          const statusColor = metric.status === 'excellent' ? 'green' : 
                            metric.status === 'good' ? 'green' : 
                            metric.status === 'improving' ? 'amber' : 'red';
                          const statusLabel = metric.status.charAt(0).toUpperCase() + metric.status.slice(1);
                          
                          return (
                            <tr key={metric.id} className="hover:bg-muted/50 transition-colors">
                              <td className="py-3 px-4">
                                <input
                                  type="checkbox"
                                  checked={selectedMetrics.includes(metric.id.toString())}
                                  onChange={() => handleToggleMetricSelection(metric.id)}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </td>
                              <td className="py-3 px-4 font-medium">{metric.name}</td>
                              <td className="py-3 px-4">{metric.current}</td>
                              <td className="py-3 px-4">{metric.previous}</td>
                              <td className="py-3 px-4 text-green-600">{metric.change}</td>
                              <td className="py-3 px-4">{metric.benchmark}</td>
                              <td className="py-3 px-4">
                                <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
                                  {statusLabel}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    title="View Details"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    title="Edit Metric"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    title="Delete Metric"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t">
                    <div className="flex items-center justify-between py-4 px-6">
                      <div className="flex-1 text-sm text-muted-foreground">
                        Showing {Math.min((metricsPage - 1) * metricsPageSize + 1, getFilteredMetrics().length)} to {Math.min(metricsPage * metricsPageSize, getFilteredMetrics().length)} of {getFilteredMetrics().length} metrics
                      </div>
                      
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleMetricsPageChange(1)}
                            disabled={metricsPage === 1}
                            className="h-8 w-8"
                            aria-label="First page"
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleMetricsPageChange(metricsPage - 1)}
                            disabled={metricsPage === 1}
                            className="h-8 w-8"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          {metricsTotalPages <= 5 ? (
                            // Show all pages if 5 or fewer
                            [...Array(metricsTotalPages)].map((_, i) => (
                              <Button
                                key={`page-${i+1}`}
                                variant={metricsPage === i+1 ? "default" : "outline"}
                                size="icon"
                                onClick={() => handleMetricsPageChange(i+1)}
                                className="h-8 w-8"
                                aria-label={`Page ${i+1}`}
                                aria-current={metricsPage === i+1 ? "page" : undefined}
                              >
                                {i+1}
                              </Button>
                            ))
                          ) : (
                            // Show limited pages with ellipsis
                            <>
                              <Button
                                variant={metricsPage === 1 ? "default" : "outline"}
                                size="icon"
                                onClick={() => handleMetricsPageChange(1)}
                                className="h-8 w-8"
                                aria-label="Page 1"
                              >
                                1
                              </Button>
                              
                              {metricsPage > 3 && <span className="mx-1">...</span>}
                              
                              {metricsPage > 2 && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleMetricsPageChange(metricsPage - 1)}
                                  className="h-8 w-8"
                                  aria-label={`Page ${metricsPage - 1}`}
                                >
                                  {metricsPage - 1}
                                </Button>
                              )}
                              
                              {metricsPage !== 1 && metricsPage !== metricsTotalPages && (
                                <Button
                                  variant="default"
                                  size="icon"
                                  onClick={() => handleMetricsPageChange(metricsPage)}
                                  className="h-8 w-8"
                                  aria-label={`Page ${metricsPage}`}
                                  aria-current="page"
                                >
                                  {metricsPage}
                                </Button>
                              )}
                              
                              {metricsPage < metricsTotalPages - 1 && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleMetricsPageChange(metricsPage + 1)}
                                  className="h-8 w-8"
                                  aria-label={`Page ${metricsPage + 1}`}
                                >
                                  {metricsPage + 1}
                                </Button>
                              )}
                              
                              {metricsPage < metricsTotalPages - 2 && <span className="mx-1">...</span>}
                              
                              <Button
                                variant={metricsPage === metricsTotalPages ? "default" : "outline"}
                                size="icon"
                                onClick={() => handleMetricsPageChange(metricsTotalPages)}
                                className="h-8 w-8"
                                aria-label={`Page ${metricsTotalPages}`}
                              >
                                {metricsTotalPages}
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleMetricsPageChange(metricsPage + 1)}
                            disabled={metricsPage === metricsTotalPages}
                            className="h-8 w-8"
                            aria-label="Next page"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleMetricsPageChange(metricsTotalPages)}
                            disabled={metricsPage === metricsTotalPages}
                            className="h-8 w-8"
                            aria-label="Last page"
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex justify-end">
                        
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full">
            {/* Segment Performance Analysis Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Segment Performance Analysis</CardTitle>
                <CardDescription>Key metrics across customer segments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={segmentPerformance}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="segment" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Satisfaction" dataKey="satisfaction" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Retention" dataKey="retention" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Radar name="Revenue" dataKey="revenue" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                      <Radar name="Growth" dataKey="growth" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
                      <Radar name="Upsell Rate" dataKey="upsell" stroke="#0088fe" fill="#0088fe" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-xs font-semibold mb-1">Best Performer</div>
                    <div className="text-base font-bold">Enterprise</div>
                    <div className="text-xs text-muted-foreground mt-1">94% retention rate</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-xs font-semibold mb-1">Highest Growth</div>
                    <div className="text-base font-bold">Startup</div>
                    <div className="text-xs text-muted-foreground mt-1">42% annual growth</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="text-xs font-semibold mb-1">Focus Area</div>
                    <div className="text-base font-bold">SMB Retention</div>
                    <div className="text-xs text-muted-foreground mt-1">78% vs 87% target</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Geography Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Revenue by Geography</CardTitle>
                <CardDescription>Regional distribution of customer revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={regionPerformance.children}
                      dataKey="size"
                      aspectRatio={4 / 3}
                      stroke="#fff"
                      fill="#8884d8"
                    >
                      <Tooltip formatter={(value) => [`${value}%`, 'Revenue Share']} />
                    </Treemap>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-between items-center mt-4 text-sm">
                  <div className="flex flex-col mt-2">
                    <span className="text-muted-foreground">Top Region</span>
                    <span className="text-lg font-bold">North America (58%)</span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="text-muted-foreground">Fastest Growing</span>
                    <span className="text-lg font-bold text-green-600">Asia Pacific (+23%)</span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="text-muted-foreground">Global Coverage</span>
                    <span className="text-lg font-bold">38 Countries</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 w-full">
            {/* Distribution by Status Section */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Distribution by Status</CardTitle>
                <CardDescription>Current customer status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
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

            {/* Customer Acquisition Cost (CAC) Section */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Customer Acquisition Cost (CAC)</CardTitle>
                <CardDescription>Cost efficiency by acquisition channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis type="number" dataKey="customers" name="Customers Acquired" unit="" />
                      <YAxis type="number" dataKey="cost" name="Cost per Customer" unit="$" />
                      <ZAxis type="number" range={[100, 500]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => [name === 'cost' ? `$${value}` : value, name === 'cost' ? 'Cost per Customer' : 'Customers Acquired']} />
                      <Legend />
                      <Scatter name="Acquisition Channel" data={customerAcquisitionCost} fill="#8884d8">
                        {customerAcquisitionCost.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Avg. CAC</span>
                    <span className="text-xl font-bold">$172</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Best Channel</span>
                    <span className="text-xl font-bold">Referral ($120)</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">CAC:CLV Ratio</span>
                    <span className="text-xl font-bold text-green-600">1:23.5</span>
                  </div>
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
            <CardHeader className="pb-6">
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
                <div className="flex items-center gap-2">
                  <RenderFilters />
                </div>
                <Button onClick={handleAddCustomer}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
              </div>
              </div>

            </CardHeader>
            <CardContent className="p-0">
              {getFilteredCustomers().length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 p-6">
                  <UserIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-center mb-2">No customers found</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {searchQuery || dateFilter !== "all" || activityFilter !== "all"
                      ? "Try adjusting your search filters to find what you're looking for."
                      : "Get started by adding your first customer."}
                  </p>
                  {!searchQuery && dateFilter === "all" && activityFilter === "all" && (
                    <Button onClick={handleAddCustomer}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Customer
                    </Button>
                  )}
                </div>
              ) : (
                        <div>
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 text-sm">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium w-[40px]">
                            <input
                              type="checkbox"
                              checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCustomers(paginatedCustomers.map(c => c.id.toString()));
                                } else {
                                  setSelectedCustomers([]);
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </th>
                          <th className="py-3 px-4 text-left font-medium w-[60px]">ID</th>
                          <th className="py-3 px-4 text-left font-medium">Customer</th>
                          <th className="py-3 px-4 text-left font-medium">Email</th>
                          <th className="py-3 px-4 text-left font-medium">Phone</th>
                          <th className="py-3 px-4 text-left font-medium">Location</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                          <th className="py-3 px-4 text-center font-medium">Orders</th>
                          <th className="py-3 px-4 text-center font-medium">Last Order</th>
                          <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {paginatedCustomers.map((customer) => {
                          const statusColor = customer.status === 'active' ? 'green' : 
                            customer.status === 'inactive' ? 'amber' : 'red';
                          const statusLabel = customer.status.charAt(0).toUpperCase() + customer.status.slice(1);
                          
                          return (
                            <tr 
                              key={customer.id} 
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <input
                                  type="checkbox"
                                  checked={selectedCustomers.includes(customer.id.toString())}
                                  onChange={() => handleToggleCustomerSelection(customer.id.toString())}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </td>
                              <td className="py-3 px-4 text-sm">{customer.id}</td>
                              <td className="py-3 px-4">
                                <div className="font-medium flex items-center">
                                  <UserIcon className="h-4 w-4 mr-2 text-primary" />
                                  {customer.name}
                                  <div className="text-sm text-muted-foreground ml-2">{customer.contactPerson}</div>
                        </div>
                              </td>
                              <td className="py-3 px-4 text-sm">
                          <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {customer.email}
                          </div>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {customer.phone}
                          </div>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {customer.location}
                        </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
                                  {statusLabel}
                        </Badge>
                              </td>
                              <td className="py-3 px-4 text-center">{customer.orders}</td>
                              <td className="py-3 px-4 text-center text-sm text-muted-foreground">{customer.lastOrder}</td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleViewDetails(customer)} 
                                    className="h-8 w-8"
                                    title="View Details"
                                  >
                                    <FileText className="h-4 w-4" />
                        </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleEditCustomer(customer)} 
                                    className="h-8 w-8"
                                    title="Edit Customer"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDeleteCustomer(customer)} 
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    title="Delete Customer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t">
                    <div className="flex items-center justify-between py-4 px-6">
                      <div className="flex-1 text-sm text-muted-foreground">
                        Showing {Math.min((currentPage - 1) * pageSize + 1, getFilteredCustomers().length)} to {Math.min(currentPage * pageSize, getFilteredCustomers().length)} of {getFilteredCustomers().length} {getFilteredCustomers().length === 1 ? 'customer' : 'customers'}
                      </div>
                      
                      <div className="flex-1 flex justify-center">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="h-8 w-8"
                            aria-label="First page"
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-8 w-8"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="default"
                            size="icon"
                            className="h-8 w-8"
                            aria-current="page"
                          >
                            1
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            2
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Next page"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Last page"
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex justify-end"></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Advanced Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Customer Engagement Metrics</CardTitle>
                <CardDescription>Interaction trends over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { date: '1', emails: 23, calls: 12, meetings: 5 },
                        { date: '5', emails: 25, calls: 10, meetings: 6 },
                        { date: '10', emails: 18, calls: 15, meetings: 3 },
                        { date: '15', emails: 30, calls: 8, meetings: 7 },
                        { date: '20', emails: 27, calls: 13, meetings: 4 },
                        { date: '25', emails: 32, calls: 11, meetings: 8 },
                        { date: '30', emails: 35, calls: 14, meetings: 9 }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="emails" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="calls" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="meetings" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="text-xs font-medium mb-1">Total Interactions</div>
                    <div className="text-xl font-bold">342</div>
                    <div className="text-xs text-green-500 mt-1">+12% from last month</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="text-xs font-medium mb-1">Response Rate</div>
                    <div className="text-xl font-bold">78%</div>
                    <div className="text-xs text-green-500 mt-1">+5% from last month</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="text-xs font-medium mb-1">Avg. Response Time</div>
                    <div className="text-xl font-bold">4.2h</div>
                    <div className="text-xs text-red-500 mt-1">+0.8h from last month</div>
                  </div>
                </div>
              </CardContent>
          </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Contact Activity Log</CardTitle>
                    <CardDescription>Recent customer interactions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => {
                        const container = document.getElementById('contact-log-container');
                        if (container) {
                          container.scrollBy({ top: -200, behavior: 'smooth' });
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => {
                        const container = document.getElementById('contact-log-container');
                        if (container) {
                          container.scrollBy({ top: 200, behavior: 'smooth' });
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea id="contact-log-container" className="max-h-[350px]">
                  <div className="divide-y">
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Email Received</div>
                            <div className="text-sm text-muted-foreground">Ocean Shipping Ltd - Inquiry about shipment #45692</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Today, 10:23 AM</div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/10 rounded-full p-2">
                            <Phone className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Call Completed</div>
                            <div className="text-sm text-muted-foreground">TechCorp - Technical support call (18 minutes)</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Yesterday, 3:45 PM</div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-500/10 rounded-full p-2">
                            <UserCheck className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium">Meeting Scheduled</div>
                            <div className="text-sm text-muted-foreground">Acme Inc. - Quarterly business review</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Aug 15, 11:00 AM</div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/10 rounded-full p-2">
                            <FileText className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <div className="font-medium">Proposal Sent</div>
                            <div className="text-sm text-muted-foreground">GlobalTrade - New logistics solution proposal</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Aug 14, 2:15 PM</div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Email Sent</div>
                            <div className="text-sm text-muted-foreground">Premier Logistics - Follow-up on last order</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Aug 12, 9:30 AM</div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-500/10 rounded-full p-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <div className="font-medium">Complaint Resolved</div>
                            <div className="text-sm text-muted-foreground">FastFreight Inc. - Delivery delay resolution</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Aug 11, 2:45 PM</div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/10 rounded-full p-2">
                            <Phone className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Call Completed</div>
                            <div className="text-sm text-muted-foreground">MegaShip - Contract renewal discussion (25 minutes)</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Aug 10, 11:20 AM</div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-500/10 rounded-full p-2">
                            <UserCheck className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium">Meeting Completed</div>
                            <div className="text-sm text-muted-foreground">LogiTech Solutions - Product demo (45 minutes)</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Aug 9, 2:00 PM</div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-500/10 rounded-full p-2">
                            <MessageSquare className="h-4 w-4 text-purple-500" />
                          </div>
                          <div>
                            <div className="font-medium">Chat Conversation</div>
                            <div className="text-sm text-muted-foreground">EastWest Logistics - Support chat (12 messages)</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Aug 8, 10:15 AM</div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/10 rounded-full p-2">
                            <FileText className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <div className="font-medium">Quote Sent</div>
                            <div className="text-sm text-muted-foreground">Harbor Freight - New equipment quote</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Aug 7, 4:30 PM</div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Technical Data Integration Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Customer Data Integration</CardTitle>
                    <CardDescription>API connection status and data sync metrics</CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => {
                          const container = document.getElementById('integration-table-container');
                          if (container) {
                            container.scrollBy({ top: -200, behavior: 'smooth' });
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => {
                          const container = document.getElementById('integration-table-container');
                          if (container) {
                            container.scrollBy({ top: 200, behavior: 'smooth' });
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">CRM Integration</div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">Connected</Badge>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-sm">
                        <span>Last sync: 35 min ago</span>
                        <span className="text-green-500">98.5% success</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '98.5%' }}></div>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">ERP System</div>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500">Partial</Badge>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-sm">
                        <span>Last sync: 2h ago</span>
                        <span className="text-amber-500">76.2% success</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '76.2%' }}></div>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Help Desk</div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">Connected</Badge>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-sm">
                        <span>Last sync: 20 min ago</span>
                        <span className="text-green-500">99.7% success</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '99.7%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Data Type</th>
                          <th className="px-4 py-3 text-left font-medium">Last Updated</th>
                          <th className="px-4 py-3 text-left font-medium">Records</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Source</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                    </table>
                    <ScrollArea id="integration-table-container" className="max-h-[300px]">
                      <table className="w-full text-sm">
                        <tbody className="divide-y">
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Contact Information</td>
                            <td className="px-4 py-3">Today, 10:15 AM</td>
                            <td className="px-4 py-3">152 records</td>
                            <td className="px-4 py-3"><Badge className="bg-green-500/10 text-green-500 border-green-500/20">Synced</Badge></td>
                            <td className="px-4 py-3">CRM</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Orders History</td>
                            <td className="px-4 py-3">Today, 9:45 AM</td>
                            <td className="px-4 py-3">1,248 records</td>
                            <td className="px-4 py-3"><Badge className="bg-green-500/10 text-green-500 border-green-500/20">Synced</Badge></td>
                            <td className="px-4 py-3">ERP</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Support Tickets</td>
                            <td className="px-4 py-3">Today, 10:05 AM</td>
                            <td className="px-4 py-3">89 records</td>
                            <td className="px-4 py-3"><Badge className="bg-green-500/10 text-green-500 border-green-500/20">Synced</Badge></td>
                            <td className="px-4 py-3">Help Desk</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Billing Data</td>
                            <td className="px-4 py-3">Yesterday, 6:30 PM</td>
                            <td className="px-4 py-3">452 records</td>
                            <td className="px-4 py-3"><Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge></td>
                            <td className="px-4 py-3">ERP</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Customer Preferences</td>
                            <td className="px-4 py-3">Today, 8:20 AM</td>
                            <td className="px-4 py-3">103 records</td>
                            <td className="px-4 py-3"><Badge className="bg-green-500/10 text-green-500 border-green-500/20">Synced</Badge></td>
                            <td className="px-4 py-3">CRM</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Shipping Information</td>
                            <td className="px-4 py-3">Today, 9:10 AM</td>
                            <td className="px-4 py-3">567 records</td>
                            <td className="px-4 py-3"><Badge className="bg-green-500/10 text-green-500 border-green-500/20">Synced</Badge></td>
                            <td className="px-4 py-3">Logistics</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Contract Documents</td>
                            <td className="px-4 py-3">Yesterday, 3:45 PM</td>
                            <td className="px-4 py-3">84 records</td>
                            <td className="px-4 py-3"><Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge></td>
                            <td className="px-4 py-3">Document System</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Marketing Preferences</td>
                            <td className="px-4 py-3">Yesterday, 5:12 PM</td>
                            <td className="px-4 py-3">215 records</td>
                            <td className="px-4 py-3"><Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge></td>
                            <td className="px-4 py-3">Marketing Platform</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Customer Feedback</td>
                            <td className="px-4 py-3">2 days ago</td>
                            <td className="px-4 py-3">76 records</td>
                            <td className="px-4 py-3"><Badge className="bg-green-500/10 text-green-500 border-green-500/20">Synced</Badge></td>
                            <td className="px-4 py-3">Survey System</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">Account Managers</td>
                            <td className="px-4 py-3">Today, 11:30 AM</td>
                            <td className="px-4 py-3">42 records</td>
                            <td className="px-4 py-3"><Badge className="bg-green-500/10 text-green-500 border-green-500/20">Synced</Badge></td>
                            <td className="px-4 py-3">CRM</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Data Quality Index</CardTitle>
                <CardDescription>Customer data completeness and accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Overall Score</div>
                    <div className="text-2xl font-bold text-right">86%</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <div>Contact Information</div>
                        <div>92%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <div>Company Details</div>
                        <div>88%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <div>Order History</div>
                        <div>95%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <div>Billing Information</div>
                        <div>78%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <div>Customer Preferences</div>
                        <div>72%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <div>Integration Fields</div>
                        <div>85%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md mt-2">
                    <div className="text-sm font-medium mb-1">Data Growth</div>
                    <div className="text-2xl font-bold">+12.4%</div>
                    <div className="text-xs text-muted-foreground mt-1">Customer records growth this quarter</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

          {/* Advanced Segmentation Analysis */}
          <div className="grid grid-cols-1 gap-6 mb-6 w-full">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Advanced Segmentation Analysis</CardTitle>
                    <CardDescription>Multi-dimensional customer segmentation model</CardDescription>
                  </div>
                  <Select defaultValue="purchase">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select dimension" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase Behavior</SelectItem>
                      <SelectItem value="engagement">Engagement Level</SelectItem>
                      <SelectItem value="channel">Channel Preference</SelectItem>
                      <SelectItem value="product">Product Affinity</SelectItem>
                      <SelectItem value="lifecycle">Lifecycle Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col items-center">
                    <div className="text-sm font-medium mb-2">High-Value Regulars</div>
                    <div className="text-3xl font-bold">24.8%</div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '24.8%' }}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Frequent buyers, high AOV</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col items-center">
                    <div className="text-sm font-medium mb-2">Occasional Buyers</div>
                    <div className="text-3xl font-bold">32.7%</div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '32.7%' }}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Infrequent, medium AOV</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col items-center">
                    <div className="text-sm font-medium mb-2">New Customers</div>
                    <div className="text-3xl font-bold">18.5%</div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '18.5%' }}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">First 90 days</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col items-center">
                    <div className="text-sm font-medium mb-2">At-Risk</div>
                    <div className="text-3xl font-bold">24.0%</div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '24.0%' }}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Declining activity</div>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <ScrollArea className="h-[300px]">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-3">Segment Characteristics</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            High-Value Regulars
                          </h4>
                          <div className="pl-5 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Average Order Value</div>
                              <div className="text-xs">$758.32</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Purchase Frequency</div>
                              <div className="text-xs">3.7 orders/month</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Customer Lifetime</div>
                              <div className="text-xs">4.2 years</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Preferred Channels</div>
                              <div className="text-xs">Direct, EDI</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Top Product Categories</div>
                              <div className="text-xs">Equipment, Premium Services</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            Occasional Buyers
                          </h4>
                          <div className="pl-5 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Average Order Value</div>
                              <div className="text-xs">$325.47</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Purchase Frequency</div>
                              <div className="text-xs">1.2 orders/month</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Customer Lifetime</div>
                              <div className="text-xs">2.8 years</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Preferred Channels</div>
                              <div className="text-xs">Web Portal, Phone</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Top Product Categories</div>
                              <div className="text-xs">Standard Services, Consumables</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                            New Customers
                          </h4>
                          <div className="pl-5 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Average Order Value</div>
                              <div className="text-xs">$284.15</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Purchase Frequency</div>
                              <div className="text-xs">0.8 orders/month</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Time Since First Order</div>
                              <div className="text-xs">47 days (avg)</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Preferred Channels</div>
                              <div className="text-xs">Web Portal, Email</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Top Product Categories</div>
                              <div className="text-xs">Starter Kits, Basic Services</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                            At-Risk
                          </h4>
                          <div className="pl-5 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Average Order Value</div>
                              <div className="text-xs">$412.68</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Purchase Frequency</div>
                              <div className="text-xs">0.4 orders/month</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Days Since Last Order</div>
                              <div className="text-xs">78 days (avg)</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Preferred Channels</div>
                              <div className="text-xs">Phone, Web Portal</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs font-medium">Top Product Categories</div>
                              <div className="text-xs">Maintenance, Replacement Parts</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* RFM Analysis & Predictive Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>RFM Analysis</CardTitle>
                    <CardDescription>Recency, Frequency, Monetary metrics</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" id="rfm-scroll-up">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" id="rfm-scroll-down">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea id="rfm-analysis-container" className="h-[350px]">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center p-3 bg-muted/30 rounded-md">
                        <div className="text-sm font-medium">Recency</div>
                        <div className="text-3xl font-bold mt-1">32</div>
                        <div className="text-xs text-muted-foreground mt-1">Days (avg)</div>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted/30 rounded-md">
                        <div className="text-sm font-medium">Frequency</div>
                        <div className="text-3xl font-bold mt-1">2.4</div>
                        <div className="text-xs text-muted-foreground mt-1">Orders/month</div>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted/30 rounded-md">
                        <div className="text-sm font-medium">Monetary</div>
                        <div className="text-3xl font-bold mt-1">$486</div>
                        <div className="text-xs text-muted-foreground mt-1">Avg order value</div>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-3">RFM Score Distribution</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Champions (4.5-5.0)</span>
                            <span>18%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '18%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Loyal Customers (3.5-4.4)</span>
                            <span>24%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Potential Loyalists (2.5-3.4)</span>
                            <span>32%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '32%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>At Risk (1.5-2.4)</span>
                            <span>16%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '16%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Needs Attention (0.5-1.4)</span>
                            <span>10%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-3">Top RFM Segments</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="text-xs font-medium">Champions</div>
                            <div className="text-xs text-muted-foreground">Recent, frequent, high-spend</div>
                          </div>
                          <div className="text-sm font-medium">148 customers</div>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="text-xs font-medium">Loyal Customers</div>
                            <div className="text-xs text-muted-foreground">Regular purchases, above-avg spend</div>
                          </div>
                          <div className="text-sm font-medium">203 customers</div>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="text-xs font-medium">Potential Loyalists</div>
                            <div className="text-xs text-muted-foreground">Recent, moderate frequency/spend</div>
                          </div>
                          <div className="text-sm font-medium">267 customers</div>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="text-xs font-medium">New Customers</div>
                            <div className="text-xs text-muted-foreground">Joined recently, few orders</div>
                          </div>
                          <div className="text-sm font-medium">134 customers</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-medium">At Risk</div>
                            <div className="text-xs text-muted-foreground">No recent purchases</div>
                          </div>
                          <div className="text-sm font-medium">89 customers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Predictive Analytics</CardTitle>
                    <CardDescription>Customer behavior forecasting</CardDescription>
                  </div>
                  <Select defaultValue="churn">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="churn">Churn Prediction</SelectItem>
                      <SelectItem value="clv">Lifetime Value</SelectItem>
                      <SelectItem value="next">Next Purchase</SelectItem>
                      <SelectItem value="upsell">Upsell Opportunities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px]">
                  <div className="space-y-4">
                    <div className="border p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-2">Churn Risk Prediction</h3>
                      <p className="text-xs text-muted-foreground mb-3">AI-driven prediction of customers likely to churn in the next 90 days</p>
                      
                      <div className="flex flex-col space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Overall Churn Risk</div>
                          <div className="text-sm font-bold">12.4%</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '12.4%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium">Risk Factors</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-muted/30 rounded-md p-2 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-amber-500" />
                            <div>
                              <div className="text-xs font-medium">Support Response Time</div>
                              <div className="text-xs text-muted-foreground">43% impact</div>
                            </div>
                          </div>
                          <div className="bg-muted/30 rounded-md p-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                            <div>
                              <div className="text-xs font-medium">Service Issues</div>
                              <div className="text-xs text-muted-foreground">28% impact</div>
                            </div>
                          </div>
                          <div className="bg-muted/30 rounded-md p-2 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            <div>
                              <div className="text-xs font-medium">Order Frequency</div>
                              <div className="text-xs text-muted-foreground">17% impact</div>
                            </div>
                          </div>
                          <div className="bg-muted/30 rounded-md p-2 flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                            <div>
                              <div className="text-xs font-medium">Price Sensitivity</div>
                              <div className="text-xs text-muted-foreground">12% impact</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-3">High Churn Risk Customers</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div className="flex items-center">
                            <Badge className="bg-red-500/10 text-red-500 mr-2">84%</Badge>
                            <div>
                              <div className="text-xs font-medium">TechCorp Industries</div>
                              <div className="text-xs text-muted-foreground">Last order: 46 days ago</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-7">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div className="flex items-center">
                            <Badge className="bg-red-500/10 text-red-500 mr-2">77%</Badge>
                            <div>
                              <div className="text-xs font-medium">Global Logistics Ltd</div>
                              <div className="text-xs text-muted-foreground">Last order: 52 days ago</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-7">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div className="flex items-center">
                            <Badge className="bg-amber-500/10 text-amber-500 mr-2">68%</Badge>
                            <div>
                              <div className="text-xs font-medium">EastWest Shipping</div>
                              <div className="text-xs text-muted-foreground">Last order: 38 days ago</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-7">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div className="flex items-center">
                            <Badge className="bg-amber-500/10 text-amber-500 mr-2">63%</Badge>
                            <div>
                              <div className="text-xs font-medium">Acme Freight Services</div>
                              <div className="text-xs text-muted-foreground">Last order: 41 days ago</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-7">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-amber-500/10 text-amber-500 mr-2">59%</Badge>
                            <div>
                              <div className="text-xs font-medium">Pacific Transport Co</div>
                              <div className="text-xs text-muted-foreground">Last order: 35 days ago</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-7">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">Recommended Actions</h3>
                      <div className="space-y-2">
                        <div className="p-2 bg-muted/30 rounded-md">
                          <div className="text-xs font-medium">Service Check-in</div>
                          <div className="text-xs text-muted-foreground">Contact high-risk customers to address service issues</div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded-md">
                          <div className="text-xs font-medium">Loyalty Program</div>
                          <div className="text-xs text-muted-foreground">Invite medium-risk customers to join premium tier</div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded-md">
                          <div className="text-xs font-medium">Targeted Promotions</div>
                          <div className="text-xs text-muted-foreground">Offer specific deals based on past purchase history</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Customer Lifetime Value Forecast */}
          <div className="grid grid-cols-1 gap-6 w-full">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Customer Lifetime Value Forecast</CardTitle>
                    <CardDescription>Projected revenue and retention analysis</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <CalendarRange className="h-4 w-4 mr-2" />
                      3 Year
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                    <div className="font-medium text-sm">Average CLV</div>
                    <div className="text-2xl font-bold mt-1">$12,847</div>
                    <div className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      8.2% from last year
                    </div>
                    <div className="mt-auto pt-3 text-xs text-muted-foreground">Projected over 3 years</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                    <div className="font-medium text-sm">Retention Rate</div>
                    <div className="text-2xl font-bold mt-1">78.4%</div>
                    <div className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      2.5% from last year
                    </div>
                    <div className="mt-auto pt-3 text-xs text-muted-foreground">Annual customer retention</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                    <div className="font-medium text-sm">Forecast Accuracy</div>
                    <div className="text-2xl font-bold mt-1">92.7%</div>
                    <div className="text-xs text-amber-500 flex items-center mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      1.3% from last model
                    </div>
                    <div className="mt-auto pt-3 text-xs text-muted-foreground">Based on historical data</div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">CLV Projection by Segment</h3>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px] h-8">
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Segments</SelectItem>
                        <SelectItem value="high">High Value</SelectItem>
                        <SelectItem value="medium">Medium Value</SelectItem>
                        <SelectItem value="low">Low Value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="h-50">
                    <ResponsiveContainer width="100%" height="80%">
                      <RechartsLineChart
                        data={[
                          { year: 'Year 1', high: 6240, medium: 3850, low: 1980, avg: 4023 },
                          { year: 'Year 2', high: 11680, medium: 6420, low: 2860, avg: 6987 },
                          { year: 'Year 3', high: 19850, medium: 8930, low: 3760, avg: 10847 },
                          { year: 'Year 4', high: 26740, medium: 10450, low: 4290, avg: 13827 },
                          { year: 'Year 5', high: 31280, medium: 11380, low: 4570, avg: 15743 }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Line type="monotone" dataKey="high" stroke="#22c55e" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="medium" stroke="#3b82f6" />
                        <Line type="monotone" dataKey="low" stroke="#a855f7" />
                        <Line type="monotone" dataKey="avg" stroke="#6b7280" strokeDasharray="5 5" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-4">CLV to CAC Ratio by Industry</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs font-medium">Manufacturing</div>
                          <div className="text-xs font-medium">5.8:1</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '83%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs font-medium">Retail</div>
                          <div className="text-xs font-medium">4.3:1</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '61%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs font-medium">Healthcare</div>
                          <div className="text-xs font-medium">7.2:1</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '103%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs font-medium">Technology</div>
                          <div className="text-xs font-medium">6.5:1</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '93%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs font-medium">Finance</div>
                          <div className="text-xs font-medium">5.1:1</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '73%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">Industry benchmark: 3:1 ratio</div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-4">Growth Opportunities</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                          <div className="text-xs font-medium">Cross-Sell Premium Services</div>
                        </div>
                        <div className="pl-6 mt-1">
                          <div className="text-xs text-muted-foreground">42 high-value customers identified</div>
                          <div className="text-xs font-medium mt-1">Potential CLV increase: +24%</div>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                          <div className="text-xs font-medium">Contract Renewals</div>
                        </div>
                        <div className="pl-6 mt-1">
                          <div className="text-xs text-muted-foreground">18 contracts expiring in 30 days</div>
                          <div className="text-xs font-medium mt-1">Potential CLV impact: +$192K</div>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                          <div className="text-xs font-medium">Service Upgrades</div>
                        </div>
                        <div className="pl-6 mt-1">
                          <div className="text-xs text-muted-foreground">67 customers on basic plans</div>
                          <div className="text-xs font-medium mt-1">Potential CLV increase: +18%</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <PlusCircle className="h-3.5 w-3.5 mr-1" />
                        Create Opportunity
                      </Button>
                    </div>
                  </div>
                </div>
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
              <CardContent className="h-70">
                <ResponsiveContainer width="100%" height="80%">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6">
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
          
          {/* Detailed Satisfaction Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>NPS Breakdown</CardTitle>
                    <CardDescription>Net Promoter Score by customer segment</CardDescription>
                  </div>
                  <Select defaultValue="overall">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overall">Overall</SelectItem>
                      <SelectItem value="segment">By Segment</SelectItem>
                      <SelectItem value="region">By Region</SelectItem>
                      <SelectItem value="industry">By Industry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">NPS Distribution</div>
                    <div className="text-xs text-muted-foreground">Scale: 0-100</div>
                  </div>
                  <div className="relative h-7 bg-muted/30 rounded-md overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-red-500/80" style={{ width: '12%' }}>
                      <div className="h-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">Detractors</span>
                      </div>
                    </div>
                    <div className="absolute top-0 left-[12%] h-full bg-amber-500/80" style={{ width: '14%' }}>
                      <div className="h-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">Passives</span>
                      </div>
                    </div>
                    <div className="absolute top-0 left-[26%] h-full bg-green-500/80" style={{ width: '74%' }}>
                      <div className="h-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">Promoters</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <div className="text-xs">12% Detractors</div>
                    <div className="text-xs">14% Passives</div>
                    <div className="text-xs">74% Promoters</div>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Score by Customer Segment</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs">High-Value Customers</div>
                          <div className="text-xs font-medium">78</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs">Occasional Buyers</div>
                          <div className="text-xs font-medium">64</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '64%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs">New Customers</div>
                          <div className="text-xs font-medium">58</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '58%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs">At-Risk Customers</div>
                          <div className="text-xs font-medium">42</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-3">Primary Factors</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-500/10 p-3 rounded-lg">
                        <div className="text-xs font-medium mb-1 text-green-600">Positive Drivers</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Service Quality</span>
                            <span>+24%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Response Time</span>
                            <span>+19%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Product Reliability</span>
                            <span>+16%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-red-500/10 p-3 rounded-lg">
                        <div className="text-xs font-medium mb-1 text-red-600">Improvement Areas</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Pricing Structure</span>
                            <span>-12%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Technical Support</span>
                            <span>-8%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Billing Clarity</span>
                            <span>-6%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Satisfaction by Channel</CardTitle>
                    <CardDescription>Ratings across service touchpoints</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { channel: 'Web Portal', rating: 4.8, responses: 427 },
                        { channel: 'Mobile App', rating: 4.6, responses: 318 },
                        { channel: 'Phone Support', rating: 4.2, responses: 245 },
                        { channel: 'Email', rating: 4.4, responses: 192 },
                        { channel: 'Chat', rating: 4.5, responses: 156 },
                        { channel: 'In-Person', rating: 4.9, responses: 83 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="channel" />
                      <YAxis yAxisId="left" orientation="left" domain={[3.5, 5]} />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="rating" fill="#8884d8" name="Satisfaction Rating" />
                      <Bar yAxisId="right" dataKey="responses" fill="#82ca9d" name="Response Volume" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3">Channel Performance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-md">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <div>
                          <div className="text-xs font-medium">Highest Performing</div>
                          <div className="text-xs text-muted-foreground">In-Person Support (4.9/5)</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700">+0.2 QoQ</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-amber-500/10 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                        <div>
                          <div className="text-xs font-medium">Needs Improvement</div>
                          <div className="text-xs text-muted-foreground">Phone Support (4.2/5)</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-700">-0.1 QoQ</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-md">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <div className="text-xs font-medium">Most Improved</div>
                          <div className="text-xs text-muted-foreground">Mobile App (4.6/5)</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-700">+0.4 QoQ</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Survey Analytics and Feedback Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Survey Response Analytics</CardTitle>
                      <CardDescription>Detailed satisfaction survey metrics</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="last30">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Time period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last30">Last 30 Days</SelectItem>
                          <SelectItem value="last90">Last 90 Days</SelectItem>
                          <SelectItem value="lastYear">Last Year</SelectItem>
                          <SelectItem value="allTime">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="border rounded-md p-3 flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">Surveys Sent</div>
                      <div className="text-lg font-bold mt-1">1,248</div>
                      <div className="text-xs text-blue-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        12.4%
                      </div>
                    </div>
                    <div className="border rounded-md p-3 flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">Completed</div>
                      <div className="text-lg font-bold mt-1">847</div>
                      <div className="text-xs text-blue-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        68%
                      </div>
                    </div>
                    <div className="border rounded-md p-3 flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">Avg. Completion Time</div>
                      <div className="text-lg font-bold mt-1">4:32</div>
                      <div className="text-xs text-green-500 flex items-center mt-1">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        -0:28
                      </div>
                    </div>
                    <div className="border rounded-md p-3 flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">Avg. Questions Answered</div>
                      <div className="text-lg font-bold mt-1">8.4/10</div>
                      <div className="text-xs text-blue-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        0.6
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted/30 px-4 py-3 border-b">
                      <h3 className="text-sm font-medium">Question Performance</h3>
                    </div>
                    <div className="max-h-[300px] overflow-auto">
                      <table className="w-full">
                        <thead className="bg-muted/20 sticky top-0">
                          <tr>
                            <th className="text-xs font-medium text-left p-3">Question</th>
                            <th className="text-xs font-medium text-center p-3">Score</th>
                            <th className="text-xs font-medium text-center p-3">Response Rate</th>
                            <th className="text-xs font-medium text-center p-3">Change</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr className="hover:bg-muted/10">
                            <td className="text-xs p-3">How would you rate your overall experience?</td>
                            <td className="text-xs text-center p-3">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">4.8</span>
                                <span className="text-xs text-muted-foreground ml-1">/5</span>
                              </div>
                            </td>
                            <td className="text-xs text-center p-3">96%</td>
                            <td className="text-xs text-center p-3">
                              <span className="text-green-500 flex items-center justify-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                0.2
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10">
                            <td className="text-xs p-3">How satisfied are you with our customer support?</td>
                            <td className="text-xs text-center p-3">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">4.5</span>
                                <span className="text-xs text-muted-foreground ml-1">/5</span>
                              </div>
                            </td>
                            <td className="text-xs text-center p-3">92%</td>
                            <td className="text-xs text-center p-3">
                              <span className="text-green-500 flex items-center justify-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                0.3
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10">
                            <td className="text-xs p-3">How likely are you to recommend our service?</td>
                            <td className="text-xs text-center p-3">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">4.7</span>
                                <span className="text-xs text-muted-foreground ml-1">/5</span>
                              </div>
                            </td>
                            <td className="text-xs text-center p-3">94%</td>
                            <td className="text-xs text-center p-3">
                              <span className="text-green-500 flex items-center justify-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                0.1
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10">
                            <td className="text-xs p-3">How easy was it to find what you were looking for?</td>
                            <td className="text-xs text-center p-3">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">4.2</span>
                                <span className="text-xs text-muted-foreground ml-1">/5</span>
                              </div>
                            </td>
                            <td className="text-xs text-center p-3">88%</td>
                            <td className="text-xs text-center p-3">
                              <span className="text-amber-500 flex items-center justify-center">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                0.1
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10">
                            <td className="text-xs p-3">How would you rate our product quality?</td>
                            <td className="text-xs text-center p-3">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">4.6</span>
                                <span className="text-xs text-muted-foreground ml-1">/5</span>
                              </div>
                            </td>
                            <td className="text-xs text-center p-3">90%</td>
                            <td className="text-xs text-center p-3">
                              <span className="text-green-500 flex items-center justify-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                0.2
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10">
                            <td className="text-xs p-3">How satisfied are you with our pricing?</td>
                            <td className="text-xs text-center p-3">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">3.9</span>
                                <span className="text-xs text-muted-foreground ml-1">/5</span>
                              </div>
                            </td>
                            <td className="text-xs text-center p-3">85%</td>
                            <td className="text-xs text-center p-3">
                              <span className="text-amber-500 flex items-center justify-center">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                0.2
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-muted/10">
                            <td className="text-xs p-3">How would you rate our delivery process?</td>
                            <td className="text-xs text-center p-3">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">4.4</span>
                                <span className="text-xs text-muted-foreground ml-1">/5</span>
                              </div>
                            </td>
                            <td className="text-xs text-center p-3">89%</td>
                            <td className="text-xs text-center p-3">
                              <span className="text-green-500 flex items-center justify-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                0.1
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Feedback Sentiment Analysis</CardTitle>
                  <CardDescription>AI-powered customer comment analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Overall Sentiment</h3>
                      <div className="flex items-center mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-green-500 h-2.5 rounded-l-full" style={{ width: '78%' }}></div>
                          <div className="bg-red-500 h-2.5 rounded-r-full" style={{ width: '22%', marginLeft: '78%', marginTop: '-10px' }}></div>
                        </div>
                        <span className="text-xs font-medium">78% Positive</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-3">Key Topics Mentioned</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge className="bg-green-500/20 text-green-700 mr-2">+</Badge>
                            <span className="text-xs">Customer Service</span>
                          </div>
                          <span className="text-xs font-medium">42%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge className="bg-green-500/20 text-green-700 mr-2">+</Badge>
                            <span className="text-xs">Product Quality</span>
                          </div>
                          <span className="text-xs font-medium">38%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge className="bg-green-500/20 text-green-700 mr-2">+</Badge>
                            <span className="text-xs">Order Process</span>
                          </div>
                          <span className="text-xs font-medium">27%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge className="bg-red-500/20 text-red-700 mr-2">-</Badge>
                            <span className="text-xs">Pricing</span>
                          </div>
                          <span className="text-xs font-medium">23%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge className="bg-red-500/20 text-red-700 mr-2">-</Badge>
                            <span className="text-xs">Wait Times</span>
                          </div>
                          <span className="text-xs font-medium">18%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-3">Recent Feedback Highlights</h3>
                      <div className="space-y-3">
                        <div className="bg-green-500/10 p-2 rounded-md">
                          <div className="text-xs italic">"The customer service team went above and beyond to resolve my issue. Very impressed!"</div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-xs text-muted-foreground">High-Value Customer</div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 text-xs">Positive</Badge>
                          </div>
                        </div>
                        <div className="bg-green-500/10 p-2 rounded-md">
                          <div className="text-xs italic">"Quality of products has significantly improved over the last year. Will continue ordering."</div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-xs text-muted-foreground">Regular Customer</div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 text-xs">Positive</Badge>
                          </div>
                        </div>
                        <div className="bg-red-500/10 p-2 rounded-md">
                          <div className="text-xs italic">"Pricing structure is confusing and higher than competitors for similar services."</div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-xs text-muted-foreground">New Customer</div>
                            <Badge variant="outline" className="bg-red-500/10 text-red-700 text-xs">Negative</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Response Metrics and Action Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Response Time Metrics</CardTitle>
                    <CardDescription>Customer service performance analysis</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={[
                        { week: 'Week 1', firstResponse: 4.2, resolution: 12.8 },
                        { week: 'Week 2', firstResponse: 3.8, resolution: 10.5 },
                        { week: 'Week 3', firstResponse: 3.2, resolution: 9.4 },
                        { week: 'Week 4', firstResponse: 3.5, resolution: 9.8 },
                        { week: 'Week 5', firstResponse: 3.7, resolution: 10.2 },
                        { week: 'Week 6', firstResponse: 3.0, resolution: 8.4 },
                        { week: 'Week 7', firstResponse: 2.8, resolution: 8.1 },
                        { week: 'Week 8', firstResponse: 2.5, resolution: 7.6 }
                      ]}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value} hours`} />
                      <Legend />
                      <Line type="monotone" dataKey="firstResponse" stroke="#3b82f6" name="First Response Time" />
                      <Line type="monotone" dataKey="resolution" stroke="#8884d8" name="Avg Resolution Time" strokeDasharray="3 3" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="border rounded-md p-3 flex flex-col items-center">
                    <div className="text-xs text-muted-foreground">First Response</div>
                    <div className="text-lg font-bold mt-1">2.5h</div>
                    <div className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      40.5%
                    </div>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center">
                    <div className="text-xs text-muted-foreground">Resolution Time</div>
                    <div className="text-lg font-bold mt-1">7.6h</div>
                    <div className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      40.6%
                    </div>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center">
                    <div className="text-xs text-muted-foreground">One-Touch Resolution</div>
                    <div className="text-lg font-bold mt-1">64%</div>
                    <div className="text-xs text-blue-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      8%
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3">Response Time by Issue Type</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs">Technical Issues</div>
                        <div className="text-xs font-medium">3.2h</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs">Billing Questions</div>
                        <div className="text-xs font-medium">2.1h</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs">Product Information</div>
                        <div className="text-xs font-medium">1.8h</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs">Shipping Inquiries</div>
                        <div className="text-xs font-medium">2.4h</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Satisfaction Improvement Plan</CardTitle>
                    <CardDescription>Strategic action items based on feedback</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[550px]">
                  <div className="space-y-4">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-blue-500/10 px-3 py-2 border-b">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-blue-700">Technical Support Improvements</h3>
                          <Badge variant="outline">High Priority</Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="item-1" />
                            </div>
                            <div>
                              <Label htmlFor="item-1" className="text-xs font-medium">Implement knowledge base expansion</Label>
                              <p className="text-xs text-muted-foreground">Increase self-service resolution rate by 20%</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="item-2" />
                            </div>
                            <div>
                              <Label htmlFor="item-2" className="text-xs font-medium">Reduce technical issue response time</Label>
                              <p className="text-xs text-muted-foreground">Target: 2.5 hours (currently 3.2 hours)</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="item-3" />
                            </div>
                            <div>
                              <Label htmlFor="item-3" className="text-xs font-medium">Technical support team training</Label>
                              <p className="text-xs text-muted-foreground">New product features and troubleshooting</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-amber-500/10 px-3 py-2 border-b">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-amber-700">Pricing Clarity Initiative</h3>
                          <Badge variant="outline">Medium Priority</Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="price-1" />
                            </div>
                            <div>
                              <Label htmlFor="price-1" className="text-xs font-medium">Pricing page redesign</Label>
                              <p className="text-xs text-muted-foreground">Simplify structure and add comparison tools</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="price-2" />
                            </div>
                            <div>
                              <Label htmlFor="price-2" className="text-xs font-medium">Create transparent billing FAQ</Label>
                              <p className="text-xs text-muted-foreground">Address top 10 pricing confusion points</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="price-3" />
                            </div>
                            <div>
                              <Label htmlFor="price-3" className="text-xs font-medium">Sales team training on pricing discussions</Label>
                              <p className="text-xs text-muted-foreground">Ensure consistent value communication</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-green-500/10 px-3 py-2 border-b">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-green-700">Customer Onboarding Enhancement</h3>
                          <Badge variant="outline">Medium Priority</Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="onboard-1" />
                            </div>
                            <div>
                              <Label htmlFor="onboard-1" className="text-xs font-medium">Develop interactive product tours</Label>
                              <p className="text-xs text-muted-foreground">Reduce initial support requests by 15%</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="onboard-2" />
                            </div>
                            <div>
                              <Label htmlFor="onboard-2" className="text-xs font-medium">Personalized onboarding checklists</Label>
                              <p className="text-xs text-muted-foreground">Based on customer segment and needs</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="onboard-3" checked={true} />
                            </div>
                            <div>
                              <Label htmlFor="onboard-3" className="text-xs font-medium line-through">Launch welcome email sequence</Label>
                              <p className="text-xs text-muted-foreground line-through">With key resources and getting started guide</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-purple-500/10 px-3 py-2 border-b">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-purple-700">Mobile Experience Optimization</h3>
                          <Badge variant="outline">Low Priority</Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="mobile-1" />
                            </div>
                            <div>
                              <Label htmlFor="mobile-1" className="text-xs font-medium">Mobile app performance improvements</Label>
                              <p className="text-xs text-muted-foreground">Target 20% faster load times</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-2">
                              <Checkbox id="mobile-2" />
                            </div>
                            <div>
                              <Label htmlFor="mobile-2" className="text-xs font-medium">Add offline capabilities</Label>
                              <p className="text-xs text-muted-foreground">For key app functions during outages</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
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