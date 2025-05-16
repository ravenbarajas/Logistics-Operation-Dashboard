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

// Add the import for the new AnomalyDetection component
import AnomalyDetection from '@/components/orders/AnomalyDetection';

// Import the TechnicalPerformance component
import TechnicalPerformance from '@/components/orders/TechnicalPerformanceLogs';

// Add import for OrderDetailsModal component
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";

// Add import for OrderDetailsWrapper component
import { OrderDetailsWrapper } from "@/components/orders/OrderDetailsWrapper";

// Import the OrderFinancialAnalytics component
import { OrderFinancialAnalytics } from "@/components/orders/OrderFinancialAnalytics";

// Import the OrderAnalytics component
import { OrderAnalytics } from "@/components/orders/OrderAnalytics";

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
    return (
      <OrderAnalytics 
        totalOrders={totalOrders} 
        orderCounts={orderCounts}
        timelineData={timelineData}
        timelineView={timelineView}
        setTimelineView={setTimelineView}
      />
    );
  };
  
  // Render Order Performance tab
  const renderOrderPerformanceTab = () => {
    return (
      <Card className="mb-6">
          <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Order Performance Analytics</CardTitle>
              <CardDescription>Advanced metrics and insights for order processing and fulfillment</CardDescription>
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
          <Tabs defaultValue="overview" className="w-full p-6 pt-0">
            <TabsList className="w-full grid grid-cols-6 mb-6">
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="fulfillment" className="text-xs">
                Fulfillment Metrics
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs">
                Performance Analysis
              </TabsTrigger>
              <TabsTrigger value="regional" className="text-xs">
                Regional Distribution
              </TabsTrigger>
              <TabsTrigger value="anomalies" className="text-xs">
                Anomaly Detection
              </TabsTrigger>
              <TabsTrigger value="technical" className="text-xs">
                Technical Performance
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-0">
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
                        {[
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
                          ]}
                          margin={{ top: 20, right: 30, left: 130, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" domain={[0, 100]} label={{ value: 'Flow (%)', position: 'insideBottom', offset: -15 }} />
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
                          ]}
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
                          ]}
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
                            {[
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
            </TabsContent>
            
            {/* Fulfillment Metrics Tab */}  
            <TabsContent value="fulfillment" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Avg Delivery Time</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">3.2 days</div>
                    <div className="text-xs text-muted-foreground">-0.4 days from last month</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Order Fill Rate</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">96.8%</div>
                    <div className="text-xs text-muted-foreground">+1.2% from target</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Processing Cycle</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">4.5 hrs</div>
                    <div className="text-xs text-muted-foreground">Within SLA target</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Fulfillment Timeline</CardTitle>
                    <CardDescription>Average time spent in each phase of order processing</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { stage: 'Order Verification', hours: 1.2 },
                            { stage: 'Payment Processing', hours: 0.4 },
                            { stage: 'Inventory Allocation', hours: 0.8 },
                            { stage: 'Picking & Packing', hours: 1.5 },
                            { stage: 'Shipping Preparation', hours: 0.6 },
                            { stage: 'Carrier Pickup', hours: 5.5 },
                            { stage: 'In Transit', hours: 58.2 },
                            { stage: 'Delivery', hours: 8.8 },
                          ]}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" className="text-xs" />
                          <YAxis dataKey="stage" type="category" className="text-xs" width={120} />
                          <Tooltip contentStyle={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                          <Legend />
                          <Bar dataKey="hours" name="Hours" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Fulfillment Success Rate</CardTitle>
                    <CardDescription>Order completion success by carrier and region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>FedEx</span>
                          <span className="font-medium">98.2%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '98.2%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>UPS</span>
                          <span className="font-medium">97.5%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '97.5%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>DHL</span>
                          <span className="font-medium">94.7%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '94.7%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>USPS</span>
                          <span className="font-medium">92.3%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '92.3%' }}></div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t mt-4">
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Domestic</span>
                          <span className="font-medium">98.1%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '98.1%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>International</span>
                          <span className="font-medium">91.4%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '91.4%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fulfillment Service Level Compliance</CardTitle>
                  <CardDescription>Performance against SLA targets by shipping method and order priority</CardDescription>
                
                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <div className="relative w-full md:w-auto flex-1 max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search shipping methods..."
                        value={complianceSearchTerm}
                        onChange={(e) => setComplianceSearchTerm(e.target.value)}
                        className="pl-8 w-full h-9"
                      />
                    </div>
                    
                    <Select defaultValue={compliancePriorityFilter} onValueChange={setCompliancePriorityFilter}>
                      <SelectTrigger className="w-[150px] h-9">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue={complianceStatusFilter} onValueChange={setComplianceStatusFilter}>
                      <SelectTrigger className="w-[150px] h-9">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="optimal">Optimal</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                      <Select
                        value={compliancePageSize.toString()}
                        onValueChange={(size) => handleCompliancePageSizeChange(Number(size))}
                      >
                        <SelectTrigger className="h-9 w-[70px]">
                          <SelectValue placeholder={compliancePageSize.toString()} />
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
                    
                    <Button variant="outline" className="h-9 ml-auto" onClick={() => setComplianceData(fulfillmentComplianceData)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredComplianceData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 p-6">
                      <Truck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium text-center mb-2">No compliance data found</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Try adjusting your search filters to find what you're looking for.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="overflow-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50 text-sm">
                            <tr>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleComplianceSort('id')}
                              >
                                <div className="flex items-center">
                                  ID
                                  {complianceSortField === 'id' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                  </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleComplianceSort('shippingMethod')}
                              >
                                <div className="flex items-center">
                                  Shipping Method
                                  {complianceSortField === 'shippingMethod' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                    </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleComplianceSort('priority')}
                              >
                                <div className="flex items-center">
                                  Priority
                                  {complianceSortField === 'priority' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                    </div>
                              </th>
                              <th className="py-3 px-4 text-left font-medium">Target Time</th>
                              <th className="py-3 px-4 text-left font-medium">Actual Time</th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleComplianceSort('varianceValue')}
                              >
                                <div className="flex items-center">
                                  Variance
                                  {complianceSortField === 'varianceValue' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                    </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleComplianceSort('compliance')}
                              >
                                <div className="flex items-center">
                                  Compliance
                                  {complianceSortField === 'compliance' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                    </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {paginatedComplianceData.map((item) => {
                              // Determine status color based on compliance levels
                              let varianceColor = '';
                              if (item.varianceValue < 0) {
                                varianceColor = 'text-green-500';
                              } else if (item.varianceValue > 0 && item.varianceValue < 0.5) {
                                varianceColor = 'text-blue-500';
                              } else if (item.varianceValue >= 0.5 && item.varianceValue < 1) {
                                varianceColor = 'text-amber-500';
                              } else {
                                varianceColor = 'text-red-500';
                              }
                              
                              let complianceColor = '';
                              if (item.compliance >= 95) {
                                complianceColor = 'text-green-500';
                              } else if (item.compliance >= 90) {
                                complianceColor = 'text-blue-500';
                              } else if (item.compliance >= 85) {
                                complianceColor = 'text-amber-500';
                              } else {
                                complianceColor = 'text-red-500';
                              }
                              
                              return (
                                <tr key={item.id} className="hover:bg-muted/50">
                                  <td className="py-3 px-4 text-sm">
                                    {item.id}
                                  </td>
                                  <td className="py-3 px-4 text-sm font-medium">
                                    {item.shippingMethod}
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <Badge 
                                      variant="outline" 
                                      className={
                                        item.priority === 'High' 
                                          ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30' 
                                          : item.priority === 'Medium'
                                            ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30'
                                            : item.priority === 'Regular'
                                              ? 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30'
                                              : 'border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-800/50'
                                      }
                                    >
                                      {item.priority}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-sm">{item.targetTime}</td>
                                  <td className="py-3 px-4 text-sm">{item.actualTime}</td>
                                  <td className={`py-3 px-4 text-sm font-medium ${varianceColor}`}>
                                    {item.variance}
                                  </td>
                                  <td className={`py-3 px-4 text-sm font-medium ${complianceColor}`}>
                                    {item.compliance}%
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                    </div>
                      
                      {/* Pagination */}
                      {totalCompliancePages > 1 && (
                        <div className="border-t">
                          <div className="flex items-center justify-between py-4 px-6">
                            <div className="flex-1 text-sm text-muted-foreground">
                              Showing {Math.min((complianceCurrentPage - 1) * compliancePageSize + 1, filteredComplianceData.length)} to {Math.min(complianceCurrentPage * compliancePageSize, filteredComplianceData.length)} of {filteredComplianceData.length} items
                  </div>
                            
                            <div className="flex-1 flex justify-center">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCompliancePageChange(1)}
                                  disabled={complianceCurrentPage === 1}
                                  className="h-8 w-8"
                                  aria-label="First page"
                                >
                                  <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCompliancePageChange(complianceCurrentPage - 1)}
                                  disabled={complianceCurrentPage === 1}
                                  className="h-8 w-8"
                                  aria-label="Previous page"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                
                                {totalCompliancePages <= 5 ? (
                                  // Show all pages if 5 or fewer
                                  [...Array(totalCompliancePages)].map((_, i) => (
                                    <Button
                                      key={`compliance-page-${i+1}`}
                                      variant={complianceCurrentPage === i+1 ? "default" : "outline"}
                                      size="icon"
                                      onClick={() => handleCompliancePageChange(i+1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${i+1}`}
                                      aria-current={complianceCurrentPage === i+1 ? "page" : undefined}
                                    >
                                      {i+1}
                                    </Button>
                                  ))
                                ) : (
                                  // Show limited pages with ellipsis for better navigation
                                  <>
                                    <Button
                                      variant={complianceCurrentPage === 1 ? "default" : "outline"}
                                      size="icon"
                                      onClick={() => handleCompliancePageChange(1)}
                                      className="h-8 w-8"
                                      aria-label="Page 1"
                                    >
                                      1
                                    </Button>
                                    
                                    {complianceCurrentPage > 3 && <span className="mx-1">...</span>}
                                    
                                    {complianceCurrentPage > 2 && (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleCompliancePageChange(complianceCurrentPage - 1)}
                                        className="h-8 w-8"
                                        aria-label={`Page ${complianceCurrentPage - 1}`}
                                      >
                                        {complianceCurrentPage - 1}
                                      </Button>
                                    )}
                                    
                                    {complianceCurrentPage !== 1 && complianceCurrentPage !== totalCompliancePages && (
                                      <Button
                                        variant="default"
                                        size="icon"
                                        className="h-8 w-8"
                                        aria-label={`Page ${complianceCurrentPage}`}
                                        aria-current="page"
                                      >
                                        {complianceCurrentPage}
                                      </Button>
                                    )}
                                    
                                    {complianceCurrentPage < totalCompliancePages - 1 && (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleCompliancePageChange(complianceCurrentPage + 1)}
                                        className="h-8 w-8"
                                        aria-label={`Page ${complianceCurrentPage + 1}`}
                                      >
                                        {complianceCurrentPage + 1}
                                      </Button>
                                    )}
                                    
                                    {complianceCurrentPage < totalCompliancePages - 2 && <span className="mx-1">...</span>}
                                    
                                    <Button
                                      variant={complianceCurrentPage === totalCompliancePages ? "default" : "outline"}
                                      size="icon"
                                      onClick={() => handleCompliancePageChange(totalCompliancePages)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${totalCompliancePages}`}
                                    >
                                      {totalCompliancePages}
                                    </Button>
                                  </>
                                )}
                                
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCompliancePageChange(complianceCurrentPage + 1)}
                                  disabled={complianceCurrentPage === totalCompliancePages}
                                  className="h-8 w-8"
                                  aria-label="Next page"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCompliancePageChange(totalCompliancePages)}
                                  disabled={complianceCurrentPage === totalCompliancePages}
                                  className="h-8 w-8"
                                  aria-label="Last page"
                                >
                                  <ChevronsRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex-1"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                </Card>
            </TabsContent>
            
            {/* Performance Analysis Tab */}
            <TabsContent value="performance" className="p-0">
              <Card>
                <CardContent className="p-0">
                  <OrderPerformanceMonitor 
                    orders={[
                      { id: "ORD-8761", name: "Acme Inc. Order", type: "Business", status: "processing", performanceScore: 86 },
                      { id: "ORD-8760", name: "TechCorp Order", type: "Business", status: "shipped", performanceScore: 92 },
                      { id: "ORD-8759", name: "GlobalTrade Order", type: "Business", status: "processing", performanceScore: 78 },
                      { id: "ORD-8758", name: "Metro Supplies Order", type: "Business", status: "delivered", performanceScore: 95 }
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Regional Distribution Tab */}
            <TabsContent value="regional" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Top Region</span>
              </div>
                    <div className="mt-1 text-xl font-bold">Northeast</div>
                    <div className="text-xs text-muted-foreground">42% of total volume</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Fastest Growth</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">Southwest</div>
                    <div className="text-xs text-muted-foreground">+23% year-over-year</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Highest AOV</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">West</div>
                    <div className="text-xs text-muted-foreground">$245 average order</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Distribution by Region</CardTitle>
                    <CardDescription>Geographic breakdown of order volume</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <OrderRegionalMap />
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {regionalOrderData.map((region) => (
                        <div key={region.region} className="text-center">
                          <div className="text-xs font-medium">{region.region}</div>
                          <div className="text-sm font-bold">{region.orders.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{region.percentage.toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
        <CardHeader>
                    <CardTitle>Regional Growth Trends</CardTitle>
                    <CardDescription>YoY growth by geographical area</CardDescription>
        </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                          data={[
                            { region: 'Northeast', growth: 8 },
                            { region: 'Southeast', growth: 12 },
                            { region: 'Midwest', growth: 5 },
                            { region: 'Southwest', growth: 23 },
                            { region: 'West', growth: 15 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="region" className="text-xs" />
                <YAxis 
                  className="text-xs" 
                            tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                            formatter={(value) => [`${value}%`, 'Growth Rate']}
                  contentStyle={{
                              background: 'hsl(var(--card))', 
                              borderColor: 'hsl(var(--border))' 
                  }}
                />
                <Legend />
                          <Bar dataKey="growth" name="YoY Growth" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
                          </div>
              
          <Card>
                <CardHeader>
                  <CardTitle>Regional Performance Metrics</CardTitle>
                  <CardDescription>Detailed order and fulfillment statistics by region</CardDescription>
                
                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <div className="relative w-full md:w-auto flex-1 max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search regions..."
                        value={regionalSearchTerm}
                        onChange={(e) => setRegionalSearchTerm(e.target.value)}
                        className="pl-8 w-full h-9"
                      />
                    </div>
                    
                    <Select defaultValue={regionalStatusFilter} onValueChange={setRegionalStatusFilter}>
                      <SelectTrigger className="w-[150px] h-9">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="optimal">Optimal</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                      <Select
                        value={regionalPageSize.toString()}
                        onValueChange={(size) => handleRegionalPageSizeChange(Number(size))}
                      >
                        <SelectTrigger className="h-9 w-[70px]">
                          <SelectValue placeholder={regionalPageSize.toString()} />
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
                    
                    <Button variant="outline" className="h-9 ml-auto" onClick={() => setRegionalData(regionalPerformanceData)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredRegionalData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 p-6">
                      <Globe className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium text-center mb-2">No regions found</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Try adjusting your search filters to find what you're looking for.
                      </p>
                </div>
                  ) : (
                    <div>
                      <div className="overflow-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50 text-sm">
                            <tr>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleRegionalSort('region')}
                              >
                                <div className="flex items-center">
                                  Region
                                  {regionalSortField === 'region' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                  </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleRegionalSort('orderVolume')}
                              >
                                <div className="flex items-center">
                                  Order Volume
                                  {regionalSortField === 'orderVolume' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleRegionalSort('avgOrderValue')}
                              >
                                <div className="flex items-center">
                                  Avg Order Value
                                  {regionalSortField === 'avgOrderValue' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
              </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleRegionalSort('fulfillmentRate')}
                              >
                                <div className="flex items-center">
                                  Fulfillment Rate
                                  {regionalSortField === 'fulfillmentRate' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                    </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleRegionalSort('deliveryTime')}
                              >
                                <div className="flex items-center">
                                  Delivery Time
                                  {regionalSortField === 'deliveryTime' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                    </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleRegionalSort('returnRate')}
                              >
                                <div className="flex items-center">
                                  Return Rate
                                  {regionalSortField === 'returnRate' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                    </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleRegionalSort('yoyGrowth')}
                              >
                                <div className="flex items-center">
                                  YoY Growth
                                  {regionalSortField === 'yoyGrowth' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                    </div>
                              </th>
                              <th 
                                className="py-3 px-4 text-left font-medium cursor-pointer"
                                onClick={() => handleRegionalSort('customerSatisfaction')}
                              >
                                <div className="flex items-center">
                                  CSAT
                                  {regionalSortField === 'customerSatisfaction' && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </th>
                              <th className="py-3 px-4 text-left font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {paginatedRegionalData.map((item) => {
                              const statusColor = 
                                item.status === 'optimal' ? 'text-green-500' :
                                item.status === 'good' ? 'text-blue-500' :
                                item.status === 'warning' ? 'text-amber-500' :
                                'text-red-500';
                              
                              const statusBadgeColor = 
                                item.status === 'optimal' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                item.status === 'good' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                item.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                'bg-red-500/10 text-red-500 border-red-500/20';
                              
                              return (
                                <tr key={item.id} className="hover:bg-muted/50">
                                  <td className="py-3 px-4 text-sm font-medium">
                                    {item.region}
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    {item.orderVolume.toLocaleString()}
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    ${item.avgOrderValue.toFixed(2)}
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <span className={item.fulfillmentRate >= 95 ? 'text-green-500' : 
                                      item.fulfillmentRate >= 90 ? 'text-blue-500' : 'text-amber-500'}>
                                      {item.fulfillmentRate}%
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    {item.deliveryTime} days
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <span className={item.returnRate <= 3 ? 'text-green-500' : 
                                      item.returnRate <= 4 ? 'text-blue-500' : 'text-amber-500'}>
                                      {item.returnRate}%
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <span className={item.yoyGrowth >= 15 ? 'text-green-500' : 
                                      item.yoyGrowth >= 10 ? 'text-blue-500' : 
                                      item.yoyGrowth >= 5 ? 'text-amber-500' : 'text-red-500'}>
                                      {item.yoyGrowth}%
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <span className={item.customerSatisfaction >= 90 ? 'text-green-500' : 
                                      item.customerSatisfaction >= 85 ? 'text-blue-500' : 'text-amber-500'}>
                                      {item.customerSatisfaction}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-sm">
                                    <Badge className={statusBadgeColor}>
                                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Pagination */}
                      {totalRegionalPages > 1 && (
                        <div className="border-t">
                          <div className="flex items-center justify-between py-4 px-6">
                            <div className="flex-1 text-sm text-muted-foreground">
                              Showing {Math.min((regionalCurrentPage - 1) * regionalPageSize + 1, filteredRegionalData.length)} to {Math.min(regionalCurrentPage * regionalPageSize, filteredRegionalData.length)} of {filteredRegionalData.length} regions
                            </div>
                            
                            <div className="flex-1 flex justify-center">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRegionalPageChange(1)}
                                  disabled={regionalCurrentPage === 1}
                                  className="h-8 w-8"
                                  aria-label="First page"
                                >
                                  <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRegionalPageChange(regionalCurrentPage - 1)}
                                  disabled={regionalCurrentPage === 1}
                                  className="h-8 w-8"
                                  aria-label="Previous page"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                
                                {totalRegionalPages <= 5 ? (
                                  // Show all pages if 5 or fewer
                                  [...Array(totalRegionalPages)].map((_, i) => (
                                    <Button
                                      key={`regional-page-${i+1}`}
                                      variant={regionalCurrentPage === i+1 ? "default" : "outline"}
                                      size="icon"
                                      onClick={() => handleRegionalPageChange(i+1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${i+1}`}
                                      aria-current={regionalCurrentPage === i+1 ? "page" : undefined}
                                    >
                                      {i+1}
                                    </Button>
                                  ))
                                ) : (
                                  // Show limited pages with ellipsis for better navigation
                                  <>
                                    <Button
                                      variant={regionalCurrentPage === 1 ? "default" : "outline"}
                                      size="icon"
                                      onClick={() => handleRegionalPageChange(1)}
                                      className="h-8 w-8"
                                      aria-label="Page 1"
                                    >
                                      1
                                    </Button>
                                    
                                    {regionalCurrentPage > 3 && <span className="mx-1">...</span>}
                                    
                                    {regionalCurrentPage > 2 && (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleRegionalPageChange(regionalCurrentPage - 1)}
                                        className="h-8 w-8"
                                        aria-label={`Page ${regionalCurrentPage - 1}`}
                                      >
                                        {regionalCurrentPage - 1}
                                      </Button>
                                    )}
                                    
                                    {regionalCurrentPage !== 1 && regionalCurrentPage !== totalRegionalPages && (
                                      <Button
                                        variant="default"
                                        size="icon"
                                        className="h-8 w-8"
                                        aria-label={`Page ${regionalCurrentPage}`}
                                        aria-current="page"
                                      >
                                        {regionalCurrentPage}
                                      </Button>
                                    )}
                                    
                                    {regionalCurrentPage < totalRegionalPages - 1 && (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleRegionalPageChange(regionalCurrentPage + 1)}
                                        className="h-8 w-8"
                                        aria-label={`Page ${regionalCurrentPage + 1}`}
                                      >
                                        {regionalCurrentPage + 1}
                                      </Button>
                                    )}
                                    
                                    {regionalCurrentPage < totalRegionalPages - 2 && <span className="mx-1">...</span>}
                                    
                                    <Button
                                      variant={regionalCurrentPage === totalRegionalPages ? "default" : "outline"}
                                      size="icon"
                                      onClick={() => handleRegionalPageChange(totalRegionalPages)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${totalRegionalPages}`}
                                    >
                                      {totalRegionalPages}
                                    </Button>
                                  </>
                                )}
                                
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRegionalPageChange(regionalCurrentPage + 1)}
                                  disabled={regionalCurrentPage === totalRegionalPages}
                                  className="h-8 w-8"
                                  aria-label="Next page"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRegionalPageChange(totalRegionalPages)}
                                  disabled={regionalCurrentPage === totalRegionalPages}
                                  className="h-8 w-8"
                                  aria-label="Last page"
                                >
                                  <ChevronsRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex-1"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  </CardContent>
                </Card>
            </TabsContent>

            {/* Anomalies Detection Tab */}
            <TabsContent value="anomalies" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Active Anomalies</span>
                      </div>
                    <div className="mt-1 text-xl font-bold">7</div>
                    <div className="text-xs text-muted-foreground">3 high severity</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Detection Latency</span>
                      </div>
                    <div className="mt-1 text-xl font-bold">4.2m</div>
                    <div className="text-xs text-muted-foreground">-25% from baseline</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Resolution Rate</span>
                      </div>
                    <div className="mt-1 text-xl font-bold">94.8%</div>
                    <div className="text-xs text-muted-foreground">Within 24 hours</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Anomaly Distribution</CardTitle>
                    <CardDescription>Types and severity of detected anomalies with resolution metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          layout="vertical"
                          data={[
                            { type: 'Processing Delays', count: 35, severity: 7.5, resolution: 4.2, impact: 68 },
                            { type: 'Payment Failures', count: 25, severity: 9.2, resolution: 8.5, impact: 92 },
                            { type: 'Inventory Mismatches', count: 18, severity: 6.8, resolution: 3.8, impact: 75 },
                            { type: 'Shipping Exceptions', count: 15, severity: 5.5, resolution: 5.2, impact: 58 },
                            { type: 'API Errors', count: 7, severity: 8.7, resolution: 2.4, impact: 84 },
                            { type: 'Database Timeouts', count: 4, severity: 9.0, resolution: 1.6, impact: 88 },
                            { type: 'Security Alerts', count: 2, severity: 9.5, resolution: 0.8, impact: 95 },
                          ]}
                          margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                          <YAxis 
                            dataKey="type" 
                            type="category" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}} 
                            width={120}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value, name) => {
                              if (name === 'Severity') return [`${value}/10`, name];
                              if (name === 'Count') return [value, 'Occurrences'];
                              if (name === 'Resolution') return [`${value}h`, 'Avg. Resolution Time'];
                              if (name === 'Impact') return [`${value}%`, 'Business Impact'];
                              return [value, name];
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="count" 
                            name="Count" 
                            fill="#3b82f6" 
                            barSize={24}
                            radius={[0, 4, 4, 0]}
                          >
                            {[
                              { type: 'Processing Delays', count: 35, severity: 7.5, resolution: 4.2 },
                              { type: 'Payment Failures', count: 25, severity: 9.2, resolution: 8.5 },
                              { type: 'Inventory Mismatches', count: 18, severity: 6.8, resolution: 3.8 },
                              { type: 'Shipping Exceptions', count: 15, severity: 5.5, resolution: 5.2 },
                              { type: 'API Errors', count: 7, severity: 8.7, resolution: 2.4 },
                              { type: 'Database Timeouts', count: 4, severity: 9.0, resolution: 1.6 },
                              { type: 'Security Alerts', count: 2, severity: 9.5, resolution: 0.8 },
                            ].map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.severity > 8.5 ? '#ef4444' : entry.severity > 7 ? '#f97316' : '#3b82f6'} 
                              />
                            ))}
                          </Bar>
                          <Bar 
                            dataKey="resolution" 
                            name="Resolution Time (hours)" 
                            fill="#8b5cf6" 
                            barSize={12}
                            radius={[0, 4, 4, 0]}
                          />
                          <Line
                            type="monotone"
                            dataKey="severity"
                            name="Severity"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 1 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="impact"
                            name="Business Impact %"
                            stroke="#ef4444"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                          />
                          <ReferenceLine 
                            x={20} 
                            stroke="#10b981" 
                            strokeDasharray="3 3" 
                            label={{ 
                              value: "Attention Threshold", 
                              position: "top", 
                              fill: "#10b981", 
                              fontSize: 11 
                            }} 
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-between mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span>Critical (&gt;8.5)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                        <span>High (7-8.5)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        <span>Medium (&lt;7)</span>
                      </div>
                      <div className="flex items-center ml-2">
                        <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                        <span>3 Critical Severity Anomalies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Anomaly Detection Trend</CardTitle>
                    <CardDescription>Number of anomalies detected over time</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { date: 'Apr 15', count: 12, resolved: 10 },
                            { date: 'Apr 16', count: 15, resolved: 14 },
                            { date: 'Apr 17', count: 8, resolved: 8 },
                            { date: 'Apr 18', count: 10, resolved: 9 },
                            { date: 'Apr 19', count: 14, resolved: 12 },
                            { date: 'Apr 20', count: 9, resolved: 9 },
                            { date: 'Apr 21', count: 7, resolved: 5 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="date" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{ 
                              background: 'hsl(var(--card))', 
                              borderColor: 'hsl(var(--border))' 
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="count" name="Detected" stroke="#ef4444" strokeWidth={2} />
                          <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
              </div>
                  </CardContent>
                </Card>
              </div>
              <AnomalyDetection />
            </TabsContent>

            {/* Technical Performance Tab */}
            <TabsContent value="technical" className="p-0">
               {/* Technical Metrics Summary */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">API Response Time</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">178ms</div>
                    <div className="text-xs text-muted-foreground">-23ms from previous period</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">System Load</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">68%</div>
                    <div className="text-xs text-muted-foreground">Within optimal range</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Error Rate</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">0.03%</div>
                    <div className="text-xs text-muted-foreground">-0.01% from previous period</div>
                  </CardContent>
                </Card>
               </div>
               
               {/* Technical Performance Charts */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <Card className="bg-background shadow-none">
                   <CardHeader className="pb-2">
                     <CardTitle className="text-base flex items-center">
                       <Activity className="h-5 w-5 mr-2 text-primary" />
                       Server Response Time
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="h-60">
                       <ResponsiveContainer width="100%" height="100%">
                         <LineChart
                           data={[
                             { time: '8AM', response: 120 },
                             { time: '10AM', response: 132 },
                             { time: '12PM', response: 156 },
                             { time: '2PM', response: 180 },
                             { time: '4PM', response: 220 },
                             { time: '6PM', response: 190 },
                             { time: '8PM', response: 160 },
                           ]}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                         >
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis dataKey="time" />
                           <YAxis />
                           <Tooltip />
                           <Line type="monotone" dataKey="response" stroke="#3b82f6" activeDot={{ r: 8 }} />
                         </LineChart>
                       </ResponsiveContainer>
                     </div>
                   </CardContent>
                 </Card>
                 
                 <Card className="bg-background shadow-none">
                   <CardHeader className="pb-2">
                     <CardTitle className="text-base flex items-center">
                       <RefreshCw className="h-5 w-5 mr-2 text-primary" />
                       System Performance
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="h-60">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart
                           data={[
                             { name: 'Database', value: 85 },
                             { name: 'API', value: 92 },
                             { name: 'Frontend', value: 96 },
                             { name: 'Auth', value: 99 },
                             { name: 'Payments', value: 94 },
                           ]}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                         >
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis dataKey="name" />
                           <YAxis />
                           <Tooltip />
                           <Bar dataKey="value" fill="#3b82f6" />
                         </BarChart>
                       </ResponsiveContainer>
                     </div>
                   </CardContent>
                 </Card>
               </div>
               
               {/* Technical Performance Metrics */}
               <Card className="mb-4">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-base flex items-center">
                     <Activity className="h-5 w-5 mr-2 text-primary" />
                     System Metrics
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     <div className="grid grid-cols-3 gap-4">
                       <div>
                         <div className="text-sm font-medium mb-1">CPU Usage</div>
                         <Progress value={42} className="h-2" />
                         <div className="flex justify-between items-center mt-1">
                           <span className="text-xs text-muted-foreground">42%</span>
                           <span className="text-xs font-medium text-green-500">Normal</span>
                         </div>
                       </div>
                       
                       <div>
                         <div className="text-sm font-medium mb-1">Memory Usage</div>
                         <Progress value={68} className="h-2" />
                         <div className="flex justify-between items-center mt-1">
                           <span className="text-xs text-muted-foreground">68%</span>
                           <span className="text-xs font-medium text-amber-500">Moderate</span>
                         </div>
                       </div>
                       
                       <div>
                         <div className="text-sm font-medium mb-1">Disk I/O</div>
                         <Progress value={23} className="h-2" />
                         <div className="flex justify-between items-center mt-1">
                           <span className="text-xs text-muted-foreground">23%</span>
                           <span className="text-xs font-medium text-green-500">Low</span>
                         </div>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-3 gap-4">
                       <div>
                         <div className="text-sm font-medium mb-1">Network Bandwidth</div>
                         <Progress value={56} className="h-2" />
                         <div className="flex justify-between items-center mt-1">
                           <span className="text-xs text-muted-foreground">56%</span>
                           <span className="text-xs font-medium text-green-500">Normal</span>
                         </div>
                       </div>
                       
                       <div>
                         <div className="text-sm font-medium mb-1">Database Connections</div>
                         <Progress value={75} className="h-2" />
                         <div className="flex justify-between items-center mt-1">
                           <span className="text-xs text-muted-foreground">75%</span>
                           <span className="text-xs font-medium text-amber-500">High</span>
                         </div>
                       </div>
                       
                       <div>
                         <div className="text-sm font-medium mb-1">Cache Hit Rate</div>
                         <Progress value={88} className="h-2" />
                         <div className="flex justify-between items-center mt-1">
                           <span className="text-xs text-muted-foreground">88%</span>
                           <span className="text-xs font-medium text-green-500">Excellent</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
               
               <TechnicalPerformance />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
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