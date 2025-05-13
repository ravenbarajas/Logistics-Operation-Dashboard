import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { OrderPerformanceMonitor } from "@/components/orders/OrderPerformanceMonitor";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import components
import AnomalyDetection from '@/components/orders/AnomalyDetection';
import TechnicalPerformance from '@/components/orders/TechnicalPerformanceLogs';
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { OrderDetailsWrapper } from "@/components/orders/OrderDetailsWrapper";
import { OrderFinancialAnalytics } from "@/components/orders/OrderFinancialAnalytics";
import OrderAnalyticsTab from "@/components/orders/OrderAnalyticsTab";
import OrderPerformanceTab from "@/components/orders/OrderPerformanceTab";

// Import mock data from the new JSON files
import {
  orders,
  orderStatusData,
  orderVolumeData,
  shippingMethodsData,
  timelineData as timelineDataImport,
  fulfillmentComplianceData,
  regionalPerformanceData,
  returnsRefundsData,
  profitabilityData,
  profitTrendsData,
  discountAnalysisData,
  fulfillmentCostsData,
  weeklyOrderTrends,
  deliveryPerformance,
  volumeAndRevenue,
  COLORS
} from "@/mockData/orders";

// Define order type
interface Order {
  id: string;
  customer: string;
  customerEmail?: string;
  items: number;
  total: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  payment: "completed" | "pending" | "failed";
  shipping: string;
  trackingNumber?: string;
  expectedDelivery?: string;
  products?: string[];
  address?: string;
  notes?: string;
}

// Add a NewOrderModal component
function NewOrderModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: (order: Order) => void }) {
  const [formData, setFormData] = useState({
    customer: "",
    customerEmail: "",
    items: 1,
    total: "",
    products: "",
    shipping: "fedex",
    address: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a new order ID
    const newOrderId = `ORD-${8762 + Math.floor(Math.random() * 100)}`;
    
    // Current date for the order
    const today = new Date();
    const orderDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Calculate expected delivery (roughly a week later)
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 7);
    const expectedDelivery = deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Create new order
    const newOrder: Order = {
      id: newOrderId,
      customer: formData.customer,
      customerEmail: formData.customerEmail,
      items: parseInt(formData.items.toString()),
      total: formData.total.startsWith('$') ? formData.total : `$${formData.total}`,
      date: orderDate,
      status: "processing",
      payment: "pending",
      shipping: formData.shipping,
      expectedDelivery,
      products: formData.products.split(',').map(p => p.trim()),
      address: formData.address,
      notes: formData.notes
    };
    
    onSuccess(newOrder);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Create New Order</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="customer" className="text-sm font-medium">Customer Name</label>
                <Input
                  id="customer"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="customerEmail" className="text-sm font-medium">Customer Email</label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="items" className="text-sm font-medium">Number of Items</label>
                  <Input
                    id="items"
                    name="items"
                    type="number"
                    min="1"
                    value={formData.items}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="total" className="text-sm font-medium">Total Amount</label>
                  <Input
                    id="total"
                    name="total"
                    placeholder="$0.00"
                    value={formData.total}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="products" className="text-sm font-medium">Products (comma separated)</label>
                <Input
                  id="products"
                  name="products"
                  value={formData.products}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="shipping" className="text-sm font-medium">Shipping Method</label>
                <Select name="shipping" value={formData.shipping} onValueChange={(value) => setFormData(prev => ({ ...prev, shipping: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fedex">FedEx</SelectItem>
                    <SelectItem value="ups">UPS</SelectItem>
                    <SelectItem value="dhl">DHL</SelectItem>
                    <SelectItem value="usps">USPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="address" className="text-sm font-medium">Shipping Address</label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="notes" className="text-sm font-medium">Order Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="flex rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Order
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Interface for Fulfillment Service Level Compliance
interface FulfillmentCompliance {
  id: string;
  shippingMethod: string;
  priority: 'High' | 'Medium' | 'Regular' | 'Low';
  targetTime: string;
  actualTime: string;
  variance: string;
  varianceValue: number; // For sorting
  compliance: number;
  status: 'optimal' | 'good' | 'warning' | 'critical';
}

// Interface for Regional Performance Metrics
interface RegionalPerformanceMetrics {
  id: string;
  region: string;
  orderVolume: number;
  avgOrderValue: number;
  fulfillmentRate: number;
  deliveryTime: number;
  returnRate: number;
  yoyGrowth: number;
  customerSatisfaction: number;
  status: 'optimal' | 'good' | 'warning' | 'critical';
}

export default function OrderManagement() {
  const [location, setLocation] = useLocation();
  const [orderList, setOrderList] = useState<Order[]>(orders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [timelineView, setTimelineView] = useState<'avg' | 'max' | 'min'>('avg');
  
  // Define the timeline data type explicitly to fix type issues
  type TimelineItemType = {
    stage: string;
    hours: number;
    minHours: number;
    maxHours: number;
    target: number;
    status: 'optimal' | 'warning' | 'critical';
    processRate: number;
    nodeType: 'start' | 'process' | 'bottleneck' | 'external';
    dependencies: string[];
    sla: number;
    description: string;
  };
  
  const [timelineData, setTimelineData] = useState<TimelineItemType[]>(timelineDataImport as unknown as TimelineItemType[]);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Get tab from URL path
  const getTabFromUrl = () => {
    const path = location;
    if (path.includes("/orders/analytics")) {
      return "analytics";
    } else if (path.includes("/orders/performance")) {
      return "performance";
    } else if (path.includes("/orders/financials")) {
      return "financials";
    } else if (path === "/orders") {
      // Redirect base path to management
      setLocation("/orders/management");
      return "management";
    }
    return "management"; // Default to management tab
  };
  
  // Add state for active main tab with initial value from URL
  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Update tab value whenever location changes (handles sidebar navigation)
  useEffect(() => {
    const tab = getTabFromUrl();
    setActiveTab(tab);
  }, [location]);
  
  // Update URL when tab changes
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    
    // Update URL path for proper navigation and sidebar highlighting
    const path = `/orders/${tabValue}`;
    setLocation(path);
  };
  
  // Get the current page name for the heading
  const getCurrentPageName = () => {
    switch (activeTab) {
      case "management": return "Order Management";
      case "analytics": return "Order Analytics";
      case "performance": return "Order Performance";
      case "financials": return "Order Financials";
      default: return "Orders";
    }
  };
  
  // Function to calculate timeline total hours
  const getTimelineTotalHours = (data: typeof timelineData, view: 'avg' | 'max' | 'min'): string => {
    const total = data.reduce((sum, item) => {
      if (view === 'avg') {
        return sum + item.hours;
      } else if (view === 'min') {
        return sum + item.minHours;
    } else {
        return sum + item.maxHours;
      }
    }, 0);
    
    return total.toFixed(1);
  };
  
  // Calculate order metrics
  const totalOrders = filteredOrders.length;
  const processingOrders = filteredOrders.filter(order => order.status === "processing").length;
  const shippedOrders = filteredOrders.filter(order => order.status === "shipped").length;
  const deliveredOrders = filteredOrders.filter(order => order.status === "delivered").length;
  const cancelledOrders = filteredOrders.filter(order => order.status === "cancelled").length;
  const pendingPayment = filteredOrders.filter(order => order.payment === "pending").length;
  
  // Summary object for order metrics
  const summary = {
    totalOrders,
    processingOrders,
    deliveredOrders,
    pendingPayment,
    processingPercentage: Math.round((processingOrders / totalOrders) * 100),
    deliveredPercentage: Math.round((deliveredOrders / totalOrders) * 100),
    pendingPercentage: Math.round((pendingPayment / totalOrders) * 100)
  };

  // Order counts for the pie chart
  const orderCounts = {
    processing: processingOrders,
    shipped: shippedOrders,
    delivered: deliveredOrders,
    cancelled: cancelledOrders
  };

  // Update filtered orders whenever filters change
  useEffect(() => {
    const filtered = orderList.filter(order => {
    // Apply search filter
      const matchesSearch = searchTerm === "" || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply date filter
      let matchesDate = true;
    if (dateFilter !== 'all') {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
        const orderDate = new Date(order.date);
        
        if (dateFilter === 'today') {
          matchesDate = orderDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'yesterday') {
          matchesDate = orderDate.toDateString() === yesterday.toDateString();
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          matchesDate = orderDate >= weekAgo;
        }
    }
    
    // Apply payment filter
      const matchesPayment = paymentFilter === "all" || order.payment === paymentFilter;
      
      // Apply status filter
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      return matchesSearch && matchesDate && matchesPayment && matchesStatus;
    });
    
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orderList, searchTerm, dateFilter, paymentFilter, statusFilter]);
  
  // Handle adding a new order
  const handleAddOrder = (newOrder: Order) => {
    setOrderList([newOrder, ...orderList]);
  };
  
  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  
  // Calculate pagination values
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  
  // Selection handlers
  const handleToggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };
  
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedOrders(paginatedOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };
  
  // Batch operations handler
  const handleBatchStatusChange = (status: string) => {
    setOrderList(prev => 
      prev.map(order => 
        selectedOrders.includes(order.id) 
          ? { ...order, status: status as Order['status'] } 
          : order
      )
    );
    setSelectedOrders([]);
  };
  
  // Render enhanced order table
  const renderEnhancedOrderTable = () => {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-background border-b">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                  Order Management
                </CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </div>
              <Button onClick={() => setIsNewOrderModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="relative w-full md:w-auto flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full h-9"
                />
              </div>
              
              <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(size) => handlePageSizeChange(Number(size))}
                >
                  <SelectTrigger className="h-9 w-[70px]">
                    <SelectValue placeholder={pageSize.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25, 50].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="h-9 ml-auto" onClick={() => setOrderList(orders)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Batch Operations */}
        {selectedOrders.length > 0 && (
          <div className="p-3 bg-muted/30 border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center">
                <Badge variant="secondary" className="mr-2">{selectedOrders.length}</Badge>
                <span className="text-sm font-medium">orders selected</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="" onValueChange={(value) => value && handleBatchStatusChange(value)}>
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Set Processing</SelectItem>
                    <SelectItem value="shipped">Set Shipped</SelectItem>
                    <SelectItem value="delivered">Set Delivered</SelectItem>
                    <SelectItem value="cancelled">Set Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedOrders([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-center mb-2">No orders found</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== "all" || paymentFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your search filters to find what you're looking for." 
                  : "Get started by creating your first order."}
              </p>
              {!searchTerm && statusFilter === "all" && paymentFilter === "all" && dateFilter === "all" && (
                <Button onClick={() => setIsNewOrderModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
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
                          checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="py-3 px-4 text-left font-medium">Order ID</th>
                      <th className="py-3 px-4 text-left font-medium">Customer</th>
                      <th className="py-3 px-4 text-center font-medium">Items</th>
                      <th className="py-3 px-4 text-right font-medium">Total</th>
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-left font-medium">Payment</th>
                      <th className="py-3 px-4 text-left font-medium">Shipping</th>
                      <th className="py-3 px-4 text-center font-medium w-[140px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paginatedOrders.map((order) => {
                      const statusColor = 
                        order.status === 'processing' ? 'amber' : 
                        order.status === 'shipped' ? 'blue' : 
                        order.status === 'delivered' ? 'green' : 
                        'red';
                      
                      const paymentColor = 
                        order.payment === 'completed' ? 'green' : 
                        order.payment === 'pending' ? 'amber' : 
                        'red';
                      
                      const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                      const paymentLabel = order.payment.charAt(0).toUpperCase() + order.payment.slice(1);
                      
                      return (
                        <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => handleToggleOrderSelection(order.id)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="py-3 px-4 font-medium">{order.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{order.customer}</div>
                            {order.customerEmail && (
                              <div className="text-xs text-muted-foreground mt-1">{order.customerEmail}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">{order.items}</td>
                          <td className="py-3 px-4 text-right font-medium">{order.total}</td>
                          <td className="py-3 px-4">{order.date}</td>
                          <td className="py-3 px-4">
                            <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
                              {statusLabel}
                  </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`bg-${paymentColor}-500/10 text-${paymentColor}-500 border-${paymentColor}-500/20`}>
                              {paymentLabel}
                  </Badge>
                          </td>
                          <td className="py-3 px-4">
                  <Badge variant="outline">
                    {order.shipping.toUpperCase()}
                  </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewOrderDetails(order)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {/* placeholder */}}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit Order</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {order.status === "processing" && (
                                    <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "shipped")}>
                                      <Truck className="mr-2 h-4 w-4" />
                                      <span>Mark as Shipped</span>
                                    </DropdownMenuItem>
                                  )}
                                  {order.status !== "delivered" && order.status !== "cancelled" && (
                                    <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "delivered")}>
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      <span>Mark as Delivered</span>
                                    </DropdownMenuItem>
                                  )}
                                  {order.status !== "cancelled" && (
                                    <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      <span>Cancel Order</span>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOrder(order.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete Order</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="border-t">
                <div className="flex items-center justify-between py-4 px-6">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * pageSize + 1, filteredOrders.length)} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
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
                      
                      {totalPages <= 5 ? (
                        // Show all pages if 5 or fewer
                        [...Array(totalPages)].map((_, i) => (
                          <Button
                            key={`page-${i+1}`}
                            variant={currentPage === i+1 ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(i+1)}
                            className="h-8 w-8"
                            aria-label={`Page ${i+1}`}
                            aria-current={currentPage === i+1 ? "page" : undefined}
                          >
                            {i+1}
                          </Button>
            ))
          ) : (
                        // Show limited pages with ellipsis for better navigation
                        <>
                          <Button
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(1)}
                            className="h-8 w-8"
                            aria-label="Page 1"
                          >
                            1
                          </Button>
                          
                          {currentPage > 3 && <span className="mx-1">...</span>}
                          
                          {currentPage > 2 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePageChange(currentPage - 1)}
                              className="h-8 w-8"
                              aria-label={`Page ${currentPage - 1}`}
                            >
                              {currentPage - 1}
                            </Button>
                          )}
                          
                          {currentPage !== 1 && currentPage !== totalPages && (
                            <Button
                              variant="default"
                              size="icon"
                              onClick={() => handlePageChange(currentPage)}
                              className="h-8 w-8"
                              aria-label={`Page ${currentPage}`}
                              aria-current="page"
                            >
                              {currentPage}
                            </Button>
                          )}
                          
                          {currentPage < totalPages - 1 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePageChange(currentPage + 1)}
                              className="h-8 w-8"
                              aria-label={`Page ${currentPage + 1}`}
                            >
                              {currentPage + 1}
                            </Button>
                          )}
                          
                          {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                          
                          <Button
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(totalPages)}
                            className="h-8 w-8"
                            aria-label={`Page ${totalPages}`}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                        aria-label="Last page"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex justify-end">
                    {/* Space for potential additional controls */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Add useEffect to detect system theme
  useEffect(() => {
    // Check if the user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDarkMode ? 'dark' : 'light');
    
    // Listen for changes to color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Fulfillment Compliance table state
  const [complianceData, setComplianceData] = useState<FulfillmentCompliance[]>(fulfillmentComplianceData);
  const [filteredComplianceData, setFilteredComplianceData] = useState<FulfillmentCompliance[]>(fulfillmentComplianceData);
  const [complianceSearchTerm, setComplianceSearchTerm] = useState("");
  const [compliancePriorityFilter, setCompliancePriorityFilter] = useState("all");
  const [complianceStatusFilter, setComplianceStatusFilter] = useState("all");
  const [complianceCurrentPage, setComplianceCurrentPage] = useState(1);
  const [compliancePageSize, setCompliancePageSize] = useState(5);
  const [complianceSortField, setComplianceSortField] = useState<keyof FulfillmentCompliance>("id");
  const [complianceSortDirection, setComplianceSortDirection] = useState<"asc" | "desc">("asc");
  
  // Add useEffect for filtering compliance data
  useEffect(() => {
    const filtered = complianceData.filter(item => {
      // Apply search filter
      const matchesSearch = complianceSearchTerm === "" || 
        item.shippingMethod.toLowerCase().includes(complianceSearchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(complianceSearchTerm.toLowerCase());
      
      // Apply priority filter
      const matchesPriority = compliancePriorityFilter === "all" || item.priority === compliancePriorityFilter;
      
      // Apply status filter
      const matchesStatus = complianceStatusFilter === "all" || item.status === complianceStatusFilter;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
    
    // Apply sorting
    const sortedData = [...filtered].sort((a, b) => {
      let aValue = a[complianceSortField];
      let bValue = b[complianceSortField];
      
      // Special case for numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return complianceSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // String sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return complianceSortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setFilteredComplianceData(sortedData);
    setComplianceCurrentPage(1); // Reset to first page when filters change
  }, [complianceData, complianceSearchTerm, compliancePriorityFilter, complianceStatusFilter, complianceSortField, complianceSortDirection]);

  // Pagination handlers for compliance table
  const handleCompliancePageChange = (page: number) => {
    setComplianceCurrentPage(page);
  };
  
  const handleCompliancePageSizeChange = (size: number) => {
    setCompliancePageSize(size);
    setComplianceCurrentPage(1);
  };
  
  // Sort handler for compliance table
  const handleComplianceSort = (field: keyof FulfillmentCompliance) => {
    if (complianceSortField === field) {
      setComplianceSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setComplianceSortField(field);
      setComplianceSortDirection('asc');
    }
  };
  
  // Calculate pagination values for compliance table
  const paginatedComplianceData = filteredComplianceData.slice(
    (complianceCurrentPage - 1) * compliancePageSize, 
    complianceCurrentPage * compliancePageSize
  );
  const totalCompliancePages = Math.ceil(filteredComplianceData.length / compliancePageSize);

  // Regional Performance Table state
  const [regionalData, setRegionalData] = useState<RegionalPerformanceMetrics[]>(regionalPerformanceData);
  const [filteredRegionalData, setFilteredRegionalData] = useState<RegionalPerformanceMetrics[]>(regionalPerformanceData);
  const [regionalSearchTerm, setRegionalSearchTerm] = useState("");
  const [regionalStatusFilter, setRegionalStatusFilter] = useState("all");
  const [regionalCurrentPage, setRegionalCurrentPage] = useState(1);
  const [regionalPageSize, setRegionalPageSize] = useState(5);
  const [regionalSortField, setRegionalSortField] = useState<keyof RegionalPerformanceMetrics>("id");
  const [regionalSortDirection, setRegionalSortDirection] = useState<"asc" | "desc">("asc");

  // Add useEffect for filtering regional data
  useEffect(() => {
    const filtered = regionalData.filter(item => {
      // Apply search filter
      const matchesSearch = regionalSearchTerm === "" || 
        item.region.toLowerCase().includes(regionalSearchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(regionalSearchTerm.toLowerCase());
      
      // Apply status filter
      const matchesStatus = regionalStatusFilter === "all" || item.status === regionalStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    // Apply sorting
    const sortedData = [...filtered].sort((a, b) => {
      let aValue = a[regionalSortField];
      let bValue = b[regionalSortField];
      
      // Special case for numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return regionalSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // String sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return regionalSortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setFilteredRegionalData(sortedData);
    setRegionalCurrentPage(1); // Reset to first page when filters change
  }, [regionalData, regionalSearchTerm, regionalStatusFilter, regionalSortField, regionalSortDirection]);

  // Add handlers for regional table pagination
  const handleRegionalPageChange = (page: number) => {
    setRegionalCurrentPage(page);
  };
  
  const handleRegionalPageSizeChange = (size: number) => {
    setRegionalPageSize(size);
    setRegionalCurrentPage(1);
  };
  
  // Add handler for regional table sorting
  const handleRegionalSort = (field: keyof RegionalPerformanceMetrics) => {
    if (regionalSortField === field) {
      setRegionalSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setRegionalSortField(field);
      setRegionalSortDirection('asc');
    }
  };
  
  // Calculate pagination values for regional table
  const paginatedRegionalData = filteredRegionalData.slice(
    (regionalCurrentPage - 1) * regionalPageSize, 
    regionalCurrentPage * regionalPageSize
  );
  const totalRegionalPages = Math.ceil(filteredRegionalData.length / regionalPageSize);

  // Handle viewing order details
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };
  
  // Handle updating order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrderList(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any } 
          : order
      )
    );
  };
  
  // Handle deleting an order
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      setOrderList(prevOrders => prevOrders.filter(order => order.id !== orderId));
    }
  };
  
  const [selectedTimeInterval, setSelectedTimeInterval] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Render Main Order Management tab
  const renderOrderManagementTab = () => {
    return (
      <div className="space-y-6">
        {/* Enhanced Order Table */}
        {renderEnhancedOrderTable()}
      </div>
    );
  };
  
  // Render Order Analytics tab
  const renderOrderAnalyticsTab = () => {
    return <OrderAnalyticsTab />;
  };
  
  // Render Order Performance tab
  const renderOrderPerformanceTab = () => {
    return <OrderPerformanceTab />;
  };
  
  // Render Order Financials tab
  const renderOrderFinancialsTab = () => {
    return (
      <Card>
        <CardContent className="p-0">
          <OrderFinancialAnalytics />
        </CardContent>
      </Card>
    );
  };

  function OrderRegionalMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<L.Map | null>(null);
    const markersRef = useRef<{[key: string]: L.Marker}>({});
    const regionsRef = useRef<{[key: string]: L.Polygon}>({});
  
    // Define colors for the regions
    const regionColors = {
      "Northeast": "#1e40af", // blue-800
      "Southeast": "#3b82f6", // blue-500
      "Midwest": "#60a5fa",   // blue-400
      "Southwest": "#93c5fd", // blue-300
      "West": "#3b82f6"       // blue-500
    };
  
    useEffect(() => {
      // Initialize the map if it doesn't exist
      if (!leafletMap.current && mapRef.current) {
        // Create map centered on USA
        leafletMap.current = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
  
        // Add the tile layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(leafletMap.current);
  
        // Update z-index for Leaflet containers
        const leafletContainers = document.querySelectorAll('.leaflet-container');
        leafletContainers.forEach(container => {
          if (container instanceof HTMLElement) {
            container.style.zIndex = '10';
          }
        });
      }
  
      // Clean up on component unmount
      return () => {
        if (leafletMap.current) {
          leafletMap.current.remove();
          leafletMap.current = null;
        }
      };
    }, []);
  
    // Add markers and polygons
    useEffect(() => {
      if (!leafletMap.current) return;
      
      const map = leafletMap.current;
      
      // Add region polygons
      Object.entries(regionBoundaries).forEach(([region, coordinates]) => {
        if (regionsRef.current[region]) {
          map.removeLayer(regionsRef.current[region]);
        }
        
        const polygonColor = regionColors[region as keyof typeof regionColors] || "#3b82f6";
        
        const polygon = L.polygon(coordinates as L.LatLngExpression[], {
          color: polygonColor,
          fillColor: polygonColor,
          fillOpacity: 0.2,
          weight: 2
        }).addTo(map);
        
        regionsRef.current[region] = polygon;
      });
      
      // Add markers for each region
      regionalOrderData.forEach(regionData => {
        const { region, orders, revenue, aov, lat, lng, percentage } = regionData;
        
        // Calculate marker size based on order volume
        const markerSize = Math.max(30, Math.min(60, orders / 100));
        const markerColor = regionColors[region as keyof typeof regionColors] || "#3b82f6";
        
        const markerIcon = L.divIcon({
          className: 'custom-region-marker',
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: ${markerColor};
              color: white;
              width: ${markerSize}px;
              height: ${markerSize}px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
              font-weight: bold;
              font-size: ${markerSize / 3}px;
            ">${orders}</div>
          `,
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize/2, markerSize/2],
        });
        
        if (markersRef.current[region]) {
          map.removeLayer(markersRef.current[region]);
        }
        
        const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
        
        // Add popup with region info
        marker.bindPopup(`
          <div style="min-width: 150px;">
            <strong>${region}</strong>
            <div>Orders: ${orders.toLocaleString()}</div>
            <div>Revenue: $${(revenue/1000).toFixed(1)}k</div>
            <div>AOV: $${aov}</div>
            <div>Share: ${percentage.toFixed(1)}%</div>
          </div>
        `);
        
        markersRef.current[region] = marker;
      });
      
    }, []);
  
    return (
      <div ref={mapRef} style={{ height: "320px", width: "100%", zIndex: "10" }} className="rounded-md"></div>
    );
  }

  // The regional boundaries for overlay
  const regionBoundaries = {
    Northeast: [
      [47.4, -80.5],
      [47.4, -66.9],
      [37.2, -66.9],
      [37.2, -80.5],
    ],
    Southeast: [
      [37.2, -80.5],
      [37.2, -76.0],
      [24.5, -76.0],
      [24.5, -96.0],
      [30.5, -96.0],
      [30.5, -87.6],
      [35.0, -87.6],
      [35.0, -80.5],
    ],
    Midwest: [
      [49.4, -104.1],
      [49.4, -80.5],
      [37.2, -80.5],
      [35.0, -87.6],
      [35.0, -96.0],
      [43.5, -96.0],
      [43.5, -104.1],
    ],
    Southwest: [
      [37.0, -96.0],
      [30.5, -96.0],
      [24.5, -96.0],
      [24.5, -106.6],
      [31.3, -114.8],
      [37.0, -114.8],
    ],
    West: [
      [49.4, -124.8],
      [49.4, -104.1],
      [43.5, -104.1],
      [37.0, -114.8],
      [31.3, -114.8],
      [31.3, -124.8],
    ]
  };

  // Regional distribution data for the map
  const regionalOrderData = [
    { region: "Northeast", orders: 4521, revenue: 985578, aov: 218, lat: 42.5, lng: -72, percentage: 42.1 },
    { region: "Southeast", orders: 1932, revenue: 357420, aov: 185, lat: 33, lng: -84, percentage: 18.0 },
    { region: "Midwest", orders: 1614, revenue: 330870, aov: 205, lat: 41.5, lng: -93, percentage: 15.0 },
    { region: "Southwest", orders: 1291, revenue: 296930, aov: 230, lat: 32, lng: -106, percentage: 12.0 },
    { region: "West", orders: 1398, revenue: 342510, aov: 245, lat: 37, lng: -122, percentage: 13.0 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <span>Current section: </span>
            <Badge className="ml-2">
              {getCurrentPageName()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={() => setIsNewOrderModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
          <Button variant="outline" onClick={() => setOrderList(orders)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Conditional KPI Cards */}
      {summary && (
          <>
            {/* Management Tab KPIs */}
            {activeTab === "management" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">{summary.totalOrders}</div>
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">All orders</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Processing</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold text-blue-500">{summary.processingOrders}</div>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{summary.processingPercentage}% of total orders</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold text-green-500">{summary.deliveredOrders}</div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{summary.deliveredPercentage}% delivery rate</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold text-amber-500">{summary.pendingPayment}</div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{summary.pendingPercentage}% of total orders</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tab KPIs */}
            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">24.8%</div>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">+2.1% from last month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">$152.35</div>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">+$12.40 from last month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Cart Abandonment</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold text-amber-500">68.3%</div>
                    <div className="flex items-center">
                      <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">-3.2% from last month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Repeat Purchases</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">34.6%</div>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">+5.7% from last month</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Performance Tab KPIs */}
            {activeTab === "performance" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">94.2%</div>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">+1.5% from target</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">1.8 hours</div>
                    <div className="flex items-center">
                      <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">-0.3 hours from average</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pick Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">124 items/hr</div>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">+8 from last week</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">98.6%</div>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">+0.8% from last month</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Financials Tab KPIs */}
            {activeTab === "financials" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">$256,890</div>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">+12.3% from last month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fulfillment Cost</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">$54,620</div>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-amber-500" />
                      <p className="text-xs text-amber-500">+5.2% from last month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Return Cost</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">$8,342</div>
                    <div className="flex items-center">
                      <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">-2.4% from last month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="text-2xl font-bold">32.5%</div>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                      <p className="text-xs text-green-500">+1.8% from last month</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

      {/* Main tab navigation */}
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="mb-6"
      >
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TabsTrigger value="management" className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span>Order Management</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChartBig className="h-4 w-4 mr-2" />
            <span>Order Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            <span>Order Performance</span>
          </TabsTrigger>
          <TabsTrigger value="financials" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>Order Financials</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {activeTab === "management" && renderOrderManagementTab()}
          {activeTab === "analytics" && renderOrderAnalyticsTab()}
          {activeTab === "performance" && renderOrderPerformanceTab()}
          {activeTab === "financials" && renderOrderFinancialsTab()}
        </div>
      </Tabs>

      <NewOrderModal 
        isOpen={isNewOrderModalOpen} 
        onClose={() => setIsNewOrderModalOpen(false)}
        onSuccess={handleAddOrder}
      />
      
      {/* Keep OrderDetailsModal and other UI elements */}
      {isOrderDetailsModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isOrderDetailsModalOpen}
          onClose={() => setIsOrderDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}
