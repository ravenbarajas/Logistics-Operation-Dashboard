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
import { 
  ShoppingCart, 
  Search, 
  MoreHorizontal, 
  TrendingUp, 
  Truck, 
  Clock, 
  Package,
  DollarSign,
  Calendar as CalendarIcon,
  Plus,
  RefreshCw,
  AlertTriangle,
  Clipboard,
  Filter,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Pencil,
  Trash2,
  FileEdit,
  BarChartBig,
  SendHorizonal,
  ArrowDown,
  ArrowUp,
  ArrowBigRight,
  CalendarDays,
  CircleCheck,
  Globe,
  PieChart,
  Activity
} from "lucide-react";
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Scatter,
  ScatterChart,
  ZAxis,
  ComposedChart
} from 'recharts';
import {
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart as RechartsBarChart
} from "recharts";
import { OrderPerformanceMonitor } from "@/components/orders/OrderPerformanceMonitor";

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

// Order data - expanded with more details
const orders: Order[] = [
  {
    id: "ORD-8761",
    customer: "Acme Inc.",
    customerEmail: "orders@acmeinc.com",
    items: 12,
    total: "$4,320.00",
    date: "Aug 18, 2023",
    status: "processing",
    payment: "completed",
    shipping: "fedex",
    trackingNumber: "FDX7891237894",
    expectedDelivery: "Aug 24, 2023",
    products: ["Heavy Duty Shelving", "Packing Materials", "Shipping Containers"],
    address: "123 Industrial Blvd, Chicago, IL 60007",
    notes: "Deliver to loading dock B"
  },
  {
    id: "ORD-8760",
    customer: "TechCorp",
    customerEmail: "supply@techcorp.com",
    items: 8,
    total: "$2,748.50",
    date: "Aug 17, 2023",
    status: "shipped",
    payment: "completed",
    shipping: "ups",
    trackingNumber: "UPS1Z12345678901234567",
    expectedDelivery: "Aug 20, 2023",
    products: ["Server Racks", "Network Cables", "Power Supplies"],
    address: "456 Tech Way, San Jose, CA 95123",
    notes: "Call before delivery"
  },
  {
    id: "ORD-8759",
    customer: "GlobalTrade",
    customerEmail: "purchasing@globaltrade.net",
    items: 15,
    total: "$5,125.75",
    date: "Aug 17, 2023",
    status: "processing",
    payment: "pending",
    shipping: "dhl",
    expectedDelivery: "Aug 25, 2023",
    products: ["Shipping Pallets", "Industrial Containers", "Packaging Systems"],
    address: "789 Global Ave, Miami, FL 33101",
    notes: ""
  },
  {
    id: "ORD-8758",
    customer: "Metro Supplies",
    customerEmail: "orders@metrosupplies.co",
    items: 6,
    total: "$1,845.20",
    date: "Aug 16, 2023",
    status: "delivered",
    payment: "completed",
    shipping: "fedex",
    trackingNumber: "FDX9876543210",
    expectedDelivery: "Aug 19, 2023",
    products: ["Office Furniture", "Filing Cabinets", "Desk Organizers"],
    address: "101 Main St, Boston, MA 02108",
    notes: "Delivered to reception"
  },
  {
    id: "ORD-8757",
    customer: "East Coast Distribution",
    customerEmail: "supply@eastcoastdist.com",
    items: 9,
    total: "$3,214.80",
    date: "Aug 15, 2023",
    status: "delivered",
    payment: "completed",
    shipping: "ups",
    trackingNumber: "UPS1Z98765432109876543",
    expectedDelivery: "Aug 18, 2023",
    products: ["Warehouse Shelving", "Pallet Jacks", "Packaging Materials"],
    address: "202 Dock St, Newark, NJ 07102",
    notes: ""
  },
  {
    id: "ORD-8756",
    customer: "Western Logistics",
    customerEmail: "orders@westernlog.com",
    items: 18,
    total: "$6,480.60",
    date: "Aug 15, 2023",
    status: "processing",
    payment: "completed",
    shipping: "usps",
    expectedDelivery: "Aug 22, 2023",
    products: ["Shipping Labels", "Packaging Supplies", "Mailing Envelopes"],
    address: "303 Shipping Lane, Seattle, WA 98101",
    notes: "Business hours delivery only"
  },
  {
    id: "ORD-8755",
    customer: "NorthStar Freight",
    customerEmail: "shipping@northstar.org",
    items: 22,
    total: "$7,150.25",
    date: "Aug 14, 2023",
    status: "shipped",
    payment: "completed",
    shipping: "dhl",
    trackingNumber: "DHL5432167890",
    expectedDelivery: "Aug 21, 2023",
    products: ["Heavy Machinery Parts", "Industrial Supplies", "Safety Equipment"],
    address: "404 Industrial Park, Minneapolis, MN 55401",
    notes: "Requires forklift for unloading"
  },
  {
    id: "ORD-8754",
    customer: "Southern Distributors",
    customerEmail: "purchase@southerndist.com",
    items: 14,
    total: "$4,890.75",
    date: "Aug 13, 2023",
    status: "delivered",
    payment: "completed",
    shipping: "fedex",
    trackingNumber: "FDX1122334455",
    expectedDelivery: "Aug 17, 2023",
    products: ["Industrial Fasteners", "Construction Supplies", "Tool Sets"],
    address: "505 Commerce St, Atlanta, GA 30303",
    notes: ""
  },
  {
    id: "ORD-8753",
    customer: "Central Manufacturing",
    customerEmail: "orders@centralmfg.com",
    items: 10,
    total: "$3,450.00",
    date: "Aug 12, 2023",
    status: "cancelled",
    payment: "failed",
    shipping: "ups",
    products: ["Metal Components", "Assembly Parts", "Industrial Adhesives"],
    address: "606 Factory Rd, Detroit, MI 48202",
    notes: "Payment issue - order cancelled"
  },
  {
    id: "ORD-8752",
    customer: "Pacific Supply Chain",
    customerEmail: "logistics@pacificsupply.net",
    items: 20,
    total: "$8,215.40",
    date: "Aug 11, 2023",
    status: "delivered",
    payment: "completed",
    shipping: "dhl",
    trackingNumber: "DHL9988776655",
    expectedDelivery: "Aug 16, 2023",
    products: ["Container Systems", "Packaging Equipment", "Shipping Supplies"],
    address: "707 Ocean Dr, San Diego, CA 92101",
    notes: "Deliver to warehouse entrance"
  },
  {
    id: "ORD-8751",
    customer: "Mountain Traders",
    customerEmail: "purchase@mountaintraders.com",
    items: 7,
    total: "$2,180.50",
    date: "Aug 10, 2023",
    status: "cancelled",
    payment: "pending",
    shipping: "fedex",
    products: ["Outdoor Equipment", "Storage Solutions", "Safety Gear"],
    address: "808 Highland Ave, Denver, CO 80202",
    notes: "Customer requested cancellation"
  },
  {
    id: "ORD-8750",
    customer: "City Supplies Co.",
    customerEmail: "orders@citysupplies.biz",
    items: 16,
    total: "$5,750.25",
    date: "Aug 10, 2023",
    status: "shipped",
    payment: "completed",
    shipping: "usps",
    trackingNumber: "USPS9205500000000000000000",
    expectedDelivery: "Aug 18, 2023",
    products: ["Office Equipment", "Business Supplies", "Shipping Materials"],
    address: "909 Municipal Way, Philadelphia, PA 19103",
    notes: ""
  },
  {
    id: "ORD-8749",
    customer: "Lakeside Logistics",
    customerEmail: "purchases@lakesidelog.com",
    items: 11,
    total: "$3,870.00",
    date: "Aug 09, 2023",
    status: "processing",
    payment: "completed",
    shipping: "ups",
    expectedDelivery: "Aug 21, 2023",
    products: ["Storage Containers", "Transport Equipment", "Packing Supplies"],
    address: "101 Harbor Blvd, Cleveland, OH 44113",
    notes: "Requires delivery appointment"
  },
  {
    id: "ORD-8748",
    customer: "Desert Distribution",
    customerEmail: "sales@desertdist.com",
    items: 9,
    total: "$3,240.75",
    date: "Aug 08, 2023",
    status: "shipped",
    payment: "completed",
    shipping: "fedex",
    trackingNumber: "FDX2233445566",
    expectedDelivery: "Aug 15, 2023",
    products: ["Climate Control Units", "Insulation Materials", "Protective Packaging"],
    address: "202 Desert Way, Phoenix, AZ 85001",
    notes: ""
  }
];
// Order status data for pie chart
const orderStatusData = [
  { name: 'Processing', value: 35 },
  { name: 'Shipped', value: 28 },
  { name: 'Delivered', value: 32 },
  { name: 'Cancelled', value: 5 },
];

// Daily order volume
const orderVolumeData = [
  { date: 'Aug 12', orders: 32, revenue: 9800 },
  { date: 'Aug 13', orders: 28, revenue: 8600 },
  { date: 'Aug 14', orders: 35, revenue: 11200 },
  { date: 'Aug 15', orders: 42, revenue: 13500 },
  { date: 'Aug 16', orders: 38, revenue: 12100 },
  { date: 'Aug 17', orders: 45, revenue: 14800 },
  { date: 'Aug 18', orders: 40, revenue: 13200 },
];

// Shipping methods breakdown
const shippingMethodsData = [
  { name: 'FedEx', value: 38 },
  { name: 'UPS', value: 32 },
  { name: 'DHL', value: 18 },
  { name: 'USPS', value: 12 },
];

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

export default function OrderManagement() {
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
  const [timelineData, setTimelineData] = useState([
    {
      stage: 'Order Verification',
      hours: 1.2,
      minHours: 0.9,
      maxHours: 1.8,
      target: 1.0,
      status: 'warning' as 'optimal' | 'warning' | 'critical',
      processRate: 92,
      nodeType: 'start' as 'start' | 'process' | 'bottleneck' | 'external',
      dependencies: [] as string[],
      sla: 1.0,
      description: 'Validation of order details and fraud check'
    },
    {
      stage: 'Payment Processing',
      hours: 0.4,
      minHours: 0.3,
      maxHours: 0.7,
      target: 0.5,
      status: 'optimal' as 'optimal' | 'warning' | 'critical',
      processRate: 98,
      nodeType: 'process' as 'start' | 'process' | 'bottleneck' | 'external',
      dependencies: ['Order Verification'],
      sla: 0.5,
      description: 'Payment gateway processing and verification'
    },
    {
      stage: 'Inventory Allocation',
      hours: 0.8,
      minHours: 0.5,
      maxHours: 1.3,
      target: 1.0,
      status: 'optimal' as 'optimal' | 'warning' | 'critical',
      processRate: 95,
      nodeType: 'process' as 'start' | 'process' | 'bottleneck' | 'external',
      dependencies: ['Payment Processing'],
      sla: 1.0,
      description: 'Reserved inventory assignment from available stock'
    },
    {
      stage: 'Picking & Packing',
      hours: 1.5,
      minHours: 0.8,
      maxHours: 2.4,
      target: 1.0,
      status: 'critical' as 'optimal' | 'warning' | 'critical',
      processRate: 75,
      nodeType: 'bottleneck' as 'start' | 'process' | 'bottleneck' | 'external',
      dependencies: ['Inventory Allocation'],
      sla: 1.0,
      description: 'Physical collection and packaging of items'
    },
    {
      stage: 'Shipping Preparation',
      hours: 0.6,
      minHours: 0.4,
      maxHours: 1.0,
      target: 0.5,
      status: 'warning' as 'optimal' | 'warning' | 'critical',
      processRate: 88,
      nodeType: 'process' as 'start' | 'process' | 'bottleneck' | 'external',
      dependencies: ['Picking & Packing'],
      sla: 0.5,
      description: 'Label generation and carrier assignment'
    },
    {
      stage: 'Carrier Pickup',
      hours: 5.5,
      minHours: 3.5,
      maxHours: 8.2,
      target: 4.0,
      status: 'critical' as 'optimal' | 'warning' | 'critical',
      processRate: 65,
      nodeType: 'external' as 'start' | 'process' | 'bottleneck' | 'external',
      dependencies: ['Shipping Preparation'],
      sla: 4.0,
      description: 'Awaiting carrier collection from facility'
    },
    {
      stage: 'In Transit',
      hours: 58.2,
      minHours: 48.5,
      maxHours: 72.0,
      target: 60.0,
      status: 'optimal' as 'optimal' | 'warning' | 'critical',
      processRate: 97,
      nodeType: 'external' as 'start' | 'process' | 'bottleneck' | 'external',
      dependencies: ['Carrier Pickup'],
      sla: 72.0,
      description: 'Package en route to delivery destination'
    }
  ]);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
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
                      <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
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
                                title="Edit Order"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                title="Cancel Order"
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
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
      
      {/* Order Summary Cards */}
      {summary && (
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
      {/* Enhanced Order Table */}
      {renderEnhancedOrderTable()}
      
      <NewOrderModal 
        isOpen={isNewOrderModalOpen} 
        onClose={() => setIsNewOrderModalOpen(false)}
        onSuccess={handleAddOrder}
      />

      <div className="mb-6"></div>

      {/* Order Analytics Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Order Analytics Dashboard</CardTitle>
              <CardDescription>Key metrics and performance indicators for orders</CardDescription>
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
          <Tabs defaultValue="volume" className="w-full p-4">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="volume" className="text-xs">
                <BarChartBig className="h-3.5 w-3.5 mr-1" />
                Volume & Revenue
              </TabsTrigger>
              <TabsTrigger value="status" className="text-xs">
                <PieChart className="h-3.5 w-3.5 mr-1" />
                Order Status
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Processing Timeline
              </TabsTrigger>
              <TabsTrigger value="value" className="text-xs">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                Average Order Value
              </TabsTrigger>
            </TabsList>
            
            {/* Volume & Revenue Tab */}
            <TabsContent value="volume" className="p-0 pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={[
                      { date: 'Aug 12', orders: 32, revenue: 9800, target: 30, forecast: 32, anomaly: false },
                      { date: 'Aug 13', orders: 28, revenue: 8600, target: 30, forecast: 31, anomaly: false },
                      { date: 'Aug 14', orders: 35, revenue: 11200, target: 30, forecast: 33, anomaly: false },
                      { date: 'Aug 15', orders: 42, revenue: 13500, target: 32, forecast: 35, anomaly: true },
                      { date: 'Aug 16', orders: 38, revenue: 12100, target: 32, forecast: 34, anomaly: false },
                      { date: 'Aug 17', orders: 45, revenue: 14800, target: 32, forecast: 36, anomaly: true },
                      { date: 'Aug 18', orders: 40, revenue: 13200, target: 34, forecast: 38, anomaly: false },
                    ]}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs" 
                      tick={{fill: 'hsl(var(--foreground))'}}
                    />
                    <YAxis 
                      yAxisId="left"
                      className="text-xs" 
                      tick={{fill: 'hsl(var(--foreground))'}}
                      label={{ value: 'Orders', angle: -90, position: 'insideLeft', offset: -5 }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      className="text-xs" 
                      tick={{fill: 'hsl(var(--foreground))'}}
                      label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight', offset: -5 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value, name) => {
                        if (name === 'revenue') return [`$${value}`, 'Revenue'];
                        if (name === 'target') return [value, 'Target Orders'];
                        if (name === 'forecast') return [value, 'Forecasted Orders'];
                        return [value, typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name];
                      }}
                    />
                    <Legend />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Bar 
                      yAxisId="left"
                      dataKey="orders" 
                      name="Orders" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="target" 
                      name="Target" 
                      stroke="#ff7300" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="forecast" 
                      name="Forecast" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                    <Scatter
                      yAxisId="left"
                      dataKey="orders"
                      fill="#ff0000"
                      name="Anomaly"
                      shape="circle"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Weekly Order Trends</CardTitle>
                    <CardDescription>4-week comparison with year-over-year growth</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { week: 'Week 1', thisYear: 245, lastYear: 210, growth: 16.7 },
                            { week: 'Week 2', thisYear: 285, lastYear: 232, growth: 22.8 },
                            { week: 'Week 3', thisYear: 255, lastYear: 258, growth: -1.2 },
                            { week: 'Week 4', thisYear: 290, lastYear: 240, growth: 20.8 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="week" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <YAxis 
                            yAxisId="left"
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            domain={[-20, 40]}
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                            label={{ value: 'Growth %', angle: 90, position: 'insideRight' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value, name) => {
                              if (name === 'growth') return [`${value}%`, 'YoY Growth'];
                              return [value, name === 'thisYear' ? 'This Year' : 'Last Year'];
                            }}
                          />
                          <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                            dataKey="thisYear" 
                            name="This Year" 
                            stroke="hsl(var(--primary))" 
                            activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                            dataKey="lastYear" 
                            name="Last Year" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                            strokeDasharray="3 3"
                          />
                          <Bar
                            yAxisId="right"
                            dataKey="growth"
                            name="Growth"
                            fill="#8884d8"
                            radius={[4, 4, 0, 0]}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Order-to-Delivery Performance</CardTitle>
                    <CardDescription>Time from order placement to delivery completion</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { month: 'Jan', time: 3.2, target: 3.0 },
                            { month: 'Feb', time: 3.3, target: 3.0 },
                            { month: 'Mar', time: 3.0, target: 3.0 },
                            { month: 'Apr', time: 2.8, target: 2.8 },
                            { month: 'May', time: 2.7, target: 2.8 },
                            { month: 'Jun', time: 2.5, target: 2.8 },
                            { month: 'Jul', time: 2.4, target: 2.5 },
                            { month: 'Aug', time: 2.5, target: 2.5 },
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <YAxis 
                            className="text-xs" 
                            label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value, name) => {
                              return [`${value} days`, name === 'time' ? 'Actual Time' : 'Target Time'];
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="time" 
                            name="Delivery Time" 
                      stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorTime)" 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="target" 
                            name="Target Time" 
                            stroke="#ff7300" 
                      strokeWidth={2}
                            strokeDasharray="3 3"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Total Orders</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">{totalOrders}</div>
                    <div className="text-xs text-muted-foreground">+8% from last period</div>
          </CardContent>
        </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Avg Order Value</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">$348.50</div>
                    <div className="text-xs text-muted-foreground">+4.2% from last period</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Fulfillment Rate</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">96.8%</div>
                    <div className="text-xs text-muted-foreground">+1.2% from target</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Return Rate</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">3.2%</div>
                    <div className="text-xs text-muted-foreground">-0.5% from last period</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Order Status Tab */}
            <TabsContent value="status" className="p-0 pt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Order Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <div className="flex items-center p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="relative w-16 h-16 mr-3">
                            <svg className="w-16 h-16" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeDasharray={`${(orderCounts.processing / totalOrders) * 100}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                              <div className="text-xs font-semibold">{Math.round((orderCounts.processing / totalOrders) * 100)}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></div>
                              <div className="text-sm font-medium">Processing</div>
                            </div>
                            <div className="text-2xl font-bold">{orderCounts.processing}</div>
                            <div className="text-xs text-muted-foreground">Total orders in processing</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="relative w-16 h-16 mr-3">
                            <svg className="w-16 h-16" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeDasharray={`${(orderCounts.shipped / totalOrders) * 100}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                              <div className="text-xs font-semibold">{Math.round((orderCounts.shipped / totalOrders) * 100)}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></div>
                              <div className="text-sm font-medium">Shipped</div>
                            </div>
                            <div className="text-2xl font-bold">{orderCounts.shipped}</div>
                            <div className="text-xs text-muted-foreground">Total orders in transit</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="relative w-16 h-16 mr-3">
                            <svg className="w-16 h-16" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="3"
                                strokeDasharray={`${(orderCounts.delivered / totalOrders) * 100}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                              <div className="text-xs font-semibold">{Math.round((orderCounts.delivered / totalOrders) * 100)}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></div>
                              <div className="text-sm font-medium">Delivered</div>
                            </div>
                            <div className="text-2xl font-bold">{orderCounts.delivered}</div>
                            <div className="text-xs text-muted-foreground">Total orders delivered</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="relative w-16 h-16 mr-3">
                            <svg className="w-16 h-16" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#ec4899"
                                strokeWidth="3"
                                strokeDasharray={`${(orderCounts.cancelled / totalOrders) * 100}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                              <div className="text-xs font-semibold">{Math.round((orderCounts.cancelled / totalOrders) * 100)}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-[#ec4899] mr-2"></div>
                              <div className="text-sm font-medium">Cancelled</div>
                            </div>
                            <div className="text-2xl font-bold">{orderCounts.cancelled}</div>
                            <div className="text-xs text-muted-foreground">Total orders cancelled</div>
                          </div>
                        </div>
                        
                        <div className="col-span-2 mt-5 border-t pt-4 border-border">
                          <div className="text-sm font-medium mb-1">Order Status Progression</div>
                          <div className="flex items-center space-x-1">
                            <div className="h-2 bg-[#3b82f6] rounded-l-full" style={{ width: `${Math.round((orderCounts.processing / totalOrders) * 100)}%` }}></div>
                            <div className="h-2 bg-[#10b981]" style={{ width: `${Math.round((orderCounts.shipped / totalOrders) * 100)}%` }}></div>
                            <div className="h-2 bg-[#f59e0b]" style={{ width: `${Math.round((orderCounts.delivered / totalOrders) * 100)}%` }}></div>
                            <div className="h-2 bg-[#ec4899] rounded-r-full" style={{ width: `${Math.round((orderCounts.cancelled / totalOrders) * 100)}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6] mr-1"></span> Processing
                            </div>
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-[#10b981] mr-1"></span> Shipped
                            </div>
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-[#f59e0b] mr-1"></span> Delivered
                            </div>
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full bg-[#ec4899] mr-1"></span> Cancelled
                            </div>
                          </div>
                          <div className="flex justify-between mt-3">
                            <div className="text-xs">
                              <div className="font-medium">Total Active Orders</div>
                              <div className="text-2xl font-bold">{totalOrders - orderCounts.cancelled}</div>
                            </div>
                            <div className="text-xs text-right">
                              <div className="font-medium">Completion Rate</div>
                              <div className="text-2xl font-bold">{Math.round((orderCounts.delivered / (totalOrders - orderCounts.cancelled)) * 100)}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Order Fulfillment Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center space-x-4 border-l-4 border-[#3b82f6] pl-4 py-2 bg-muted/10 rounded-r-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#3b82f6]/10">
                              <Clock className="h-5 w-5 text-[#3b82f6]" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-semibold">Order to Processing</div>
                            <div className="text-2xl font-bold">2.4 <span className="text-sm text-muted-foreground font-normal">hrs</span></div>
                            <div className="text-xs text-muted-foreground">Average time to start processing</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 border-l-4 border-[#10b981] pl-4 py-2 bg-muted/10 rounded-r-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#10b981]/10">
                              <Package className="h-5 w-5 text-[#10b981]" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-semibold">Processing to Shipped</div>
                            <div className="text-2xl font-bold">18.2 <span className="text-sm text-muted-foreground font-normal">hrs</span></div>
                            <div className="text-xs text-muted-foreground">Average packaging and handoff time</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 border-l-4 border-[#f59e0b] pl-4 py-2 bg-muted/10 rounded-r-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f59e0b]/10">
                              <Truck className="h-5 w-5 text-[#f59e0b]" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm font-semibold">Shipped to Delivered</div>
                            <div className="text-2xl font-bold">42.6 <span className="text-sm text-muted-foreground font-normal">hrs</span></div>
                            <div className="text-xs text-muted-foreground">Average transit time to customer</div>
                          </div>
                        </div>
                        
                        <div className="mt-2 px-2">
                          <div className="text-sm font-medium mb-1">Total Fulfillment Time</div>
                          <div className="flex items-center space-x-1">
                            <div className="h-1.5 bg-[#3b82f6] rounded-l-full w-1/6"></div>
                            <div className="h-1.5 bg-[#10b981] w-1/3"></div>
                            <div className="h-1.5 bg-[#f59e0b] rounded-r-full w-1/2"></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <div>Order Placed</div>
                            <div>63.2 hrs (2.6 days) Average</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Completion Rate</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">{Math.round((orderCounts.delivered / totalOrders) * 100)}%</div>
                      <div className="text-xs text-muted-foreground">
                        {orderCounts.delivered} of {totalOrders} orders completed
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Cancellation Rate</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">{Math.round((orderCounts.cancelled / totalOrders) * 100)}%</div>
                      <div className="text-xs text-muted-foreground">
                        {orderCounts.cancelled} of {totalOrders} orders cancelled
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">On-Time Delivery</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">94%</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(orderCounts.delivered * 0.94)} orders delivered on time
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Return Rate</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">2.3%</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(orderCounts.delivered * 0.023)} orders returned
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Processing Timeline Tab */}
            <TabsContent value="timeline" className="p-0 pt-0">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          Order Processing Timeline
                        </CardTitle>
                        <CardDescription>Process efficiency analysis & optimization</CardDescription>
                      </div>
                      <Select 
                        defaultValue="avg" 
                        onValueChange={(value) => setTimelineView(value as 'avg' | 'max' | 'min')}
                      >
                        <SelectTrigger className="h-8 text-xs w-[120px]">
                          <SelectValue placeholder="View Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="avg">Average Time</SelectItem>
                          <SelectItem value="max">Peak Times</SelectItem>
                          <SelectItem value="min">Optimal Times</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center mb-2 text-xs gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span>Optimal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span>Warning</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>Critical</span>
                      </div>
                      <div className="ml-auto flex items-center">
                        <span className="font-medium text-xs">
                          Total: {getTimelineTotalHours(timelineData, timelineView)}h
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {timelineData
                        .filter(item => timelineView === 'avg' || (
                          timelineView === 'min' ? item.minHours !== undefined : item.maxHours !== undefined
                        ))
                        .map((item, index) => {
                        // Calculate various metrics for visualization
                        const statusColors: Record<'optimal' | 'warning' | 'critical', string> = {
                          optimal: 'bg-emerald-500',
                          warning: 'bg-amber-500',
                          critical: 'bg-red-500'
                        };
                        
                        const nodeIcons: Record<'start' | 'process' | 'bottleneck' | 'external', React.ReactNode> = {
                          start: <CircleCheck className="h-3.5 w-3.5 text-blue-500" />,
                          process: <ArrowBigRight className="h-3.5 w-3.5 text-indigo-500" />,
                          bottleneck: <AlertTriangle className="h-3.5 w-3.5 text-red-500" />,
                          external: <Globe className="h-3.5 w-3.5 text-purple-500" />
                        };
                        
                        // Get the correct hours based on selected view
                        const displayHours = timelineView === 'avg' ? item.hours :
                                            timelineView === 'min' ? (item.minHours || item.hours) :
                                            (item.maxHours || item.hours);
                                            
                        // Get the status based on the current view
                        const displayStatus = timelineView === 'avg' 
                          ? item.status 
                          : timelineView === 'min' 
                            ? 'optimal'
                            : (displayHours > item.target * 1.2 ? 'critical' : 'warning');
                        
                        // Calculate width for Gantt-style bar
                        const maxInternalHours = timelineView === 'max' ? 15 : 10;
                        const maxWidth = item.stage === 'In Transit' || item.stage === 'Carrier Pickup'
                          ? `${Math.min(98, (displayHours / 60) * 100)}%`
                          : `${Math.min(98, (displayHours / maxInternalHours) * 100)}%`;
                        
                        // Calculate efficiency color
                        const efficiency = (item.target / displayHours) * 100;
                        const efficiencyColor = 
                          efficiency >= 95 ? 'text-emerald-500' :
                          efficiency >= 80 ? 'text-amber-500' : 'text-red-500';

                        // Calculate appropriate process rate based on view
                        const displayRate = timelineView === 'avg' ? item.processRate :
                                           timelineView === 'min' ? Math.min(100, item.processRate + 10) :
                                           Math.max(50, item.processRate - 15);
                          
                        return (
                          <div key={item.stage} className="relative group">
                            <div className="flex items-center h-10 rounded-md bg-card/60 hover:bg-card/80 transition-colors px-2">
                              {/* Process node indicator */}
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${item.nodeType === 'bottleneck' ? 'bg-red-100/50' : 'bg-blue-100/50'}`}>
                                {nodeIcons[item.nodeType]}
                              </div>
                              
                              {/* Stage name */}
                              <div className="ml-2 w-40 overflow-hidden">
                                <div className="text-xs font-medium truncate">{item.stage}</div>
                                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                              </div>
                              
                              {/* Timeline bar visualization */}
                              <div className="flex-1 mx-2">
                                <div className="h-2.5 w-full bg-muted/30 rounded-sm overflow-hidden flex relative">
                                  {/* Actual time */}
                                  <div 
                                    className={`h-full ${statusColors[displayStatus]} flex items-center rounded-sm`} 
                                    style={{ width: maxWidth }}
                                  ></div>
                                  
                                  {/* Target marker */}
                                  <div 
                                    className="absolute h-full w-0.5 bg-white z-10" 
                                    style={{ 
                                      left: `${Math.min(98, (item.target / (item.stage === 'In Transit' || item.stage === 'Carrier Pickup' ? 60 : maxInternalHours)) * 100)}%`,
                                      boxShadow: '0 0 3px rgba(255,255,255,0.8)'
                                    }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Metrics */}
                              <div className="flex items-center gap-2 text-xs w-24 justify-end">
                                <div className="flex flex-col items-end">
                                  <div className="font-medium">{displayHours}h</div>
                                  <div className="text-xs text-muted-foreground">
                                    SLA: {item.sla}h
                                  </div>
                                </div>
                                <div 
                                  className={`w-8 h-5 rounded-sm flex items-center justify-center text-white text-xs font-medium ${statusColors[displayStatus]}`}
                                >
                                  {displayRate}%
                                </div>
                              </div>
                            </div>
                            
                            {/* Connector line */}
                            {index < timelineData.length - 1 && (
                              <div className="absolute left-3 top-10 w-0.5 h-2 bg-muted-foreground/30"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 py-2 border-t border-border/30 mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Last updated: Today, 14:32</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => setTimelineView('avg')}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Recalculate
                    </Button>
                  </CardFooter>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div>
                        <CardTitle className="text-base">Processing Stage Analysis</CardTitle>
                        <CardDescription>Bottleneck identification and optimization</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="overflow-auto max-h-[calc(100%-3rem)]">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium mb-1 flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                            Bottleneck Identification
                          </div>
                          <div className="bg-muted/20 rounded-md p-3 text-xs">
                            <p className="mb-2">The <span className="font-medium text-amber-500">Picking & Packing</span> stage has been identified as the primary bottleneck in the order processing pipeline.</p>
                            <div className="flex items-center mt-2">
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: '67%' }}></div>
                              </div>
                              <span className="ml-2 text-xs font-medium">67%</span>
                            </div>
                            <p className="mt-2 text-muted-foreground">Contributes to 67% of internal processing delays</p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1 flex items-center">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            Optimization Recommendations
                          </div>
                          <div className="bg-muted/20 rounded-md p-3 space-y-3">
                            <div className="flex items-start text-xs">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                                <span className="font-bold text-blue-500">1</span>
                              </div>
                              <div>
                                <p className="font-medium">Parallel Processing for Picking & Packing</p>
                                <p className="text-muted-foreground">Implement zone-based picking with multiple packers working simultaneously. Expected time reduction: 40%.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start text-xs">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                                <span className="font-bold text-green-500">2</span>
                              </div>
                              <div>
                                <p className="font-medium">Optimize Carrier Pickup Window</p>
                                <p className="text-muted-foreground">Reduce window by 2.5 hours by scheduling fixed pickup times. Coordination required with shipping partners.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start text-xs">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                                <span className="font-bold text-amber-500">3</span>
                              </div>
                              <div>
                                <p className="font-medium">Automate Inventory Allocation</p>
                                <p className="text-muted-foreground">Implement predictive modeling to pre-allocate inventory based on order patterns. Reduces manual intervention by 85%.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start text-xs">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-0.5">
                                <span className="font-bold text-purple-500">4</span>
                              </div>
                              <div>
                                <p className="font-medium">Streamline Order Verification</p>
                                <p className="text-muted-foreground">Replace manual verification with digital signature and automated fraud detection. Potential savings: 0.8 hours per order.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div>
                        <CardTitle className="text-base">Process Efficiency Metrics</CardTitle>
                        <CardDescription className="text-sm">Current performance against SLA targets</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-medium">Overall Process Efficiency</div>
                            <div className="text-sm font-semibold">68%</div>
                          </div>
                          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>0%</span>
                            <span>Target: 85%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm font-medium mb-2">Internal Processing</div>
                            <div className="flex justify-between items-center text-base">
                              <span className="text-sm">Actual</span>
                              <span className="font-medium">4.5 hours</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                              <span>Target</span>
                              <span>4.0 hours</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium mb-2">External Processing</div>
                            <div className="flex justify-between items-center text-base">
                              <span className="text-sm">Actual</span>
                              <span className="font-medium">63.7 hours</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                              <span>Target</span>
                              <span>64.0 hours</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-3">Stage Efficiency Breakdown</div>
                          <div className="space-y-2.5">
                            {[
                              { stage: 'Order Verification', efficiency: 83 },
                              { stage: 'Payment Processing', efficiency: 125 },
                              { stage: 'Inventory Allocation', efficiency: 125 },
                              { stage: 'Picking & Packing', efficiency: 67 },
                              { stage: 'Shipping Preparation', efficiency: 83 },
                            ].map(item => (
                              <div key={item.stage} className="flex items-center">
                                <div className="w-40 text-sm truncate">{item.stage}</div>
                                <div className="flex-1 mx-3">
                                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        item.efficiency >= 100 ? 'bg-emerald-500' : 
                                        item.efficiency >= 80 ? 'bg-amber-500' : 'bg-red-500'
                                      }`} 
                                      style={{ width: `${Math.min(100, item.efficiency)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="text-sm w-10 text-right font-medium">
                                  {item.efficiency}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Total Processing Time</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">8.5 <span className="text-sm font-normal">hours</span></div>
                      <div className="text-xs text-muted-foreground">Average from order to shipping</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Bottleneck Stage</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">Picking & Packing</div>
                      <div className="text-xs text-muted-foreground">1.5 hours (18% of total time)</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Optimization Potential</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">32%</div>
                      <div className="text-xs text-muted-foreground">Est. time savings with optimizations</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Process Efficiency</span>
                      </div>
                      <div className="mt-1 text-xl font-bold">68%</div>
                      <div className="text-xs text-muted-foreground">Based on industry benchmarks</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Average Order Value Tab */}
            <TabsContent value="value" className="p-0 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">AOV Trend Analysis</CardTitle>
                    <CardDescription>Monthly trends with moving average and forecasting</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={[
                            { month: 'Jan', value: 320, ma3: null, ma6: null, forecast: null, benchmark: 310 },
                            { month: 'Feb', value: 332, ma3: null, ma6: null, forecast: null, benchmark: 310 },
                            { month: 'Mar', value: 301, ma3: 317.7, ma6: null, forecast: null, benchmark: 310 },
                            { month: 'Apr', value: 334, ma3: 322.3, ma6: null, forecast: null, benchmark: 325 },
                            { month: 'May', value: 390, ma3: 341.7, ma6: null, forecast: null, benchmark: 325 },
                            { month: 'Jun', value: 330, ma3: 351.3, ma6: 334.5, forecast: null, benchmark: 325 },
                            { month: 'Jul', value: 350, ma3: 356.7, ma6: 339.5, forecast: null, benchmark: 340 },
                            { month: 'Aug', value: 368, ma3: 349.3, ma6: 345.5, forecast: null, benchmark: 340 },
                            { month: 'Sep', value: 352, ma3: 356.7, ma6: 349.1, forecast: null, benchmark: 340 },
                            { month: 'Oct', value: null, ma3: null, ma6: null, forecast: 358, benchmark: 350 },
                            { month: 'Nov', value: null, ma3: null, ma6: null, forecast: 362, benchmark: 350 },
                            { month: 'Dec', value: null, ma3: null, ma6: null, forecast: 370, benchmark: 350 },
                          ]}
                          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}} 
                          />
                          <YAxis 
                            domain={[290, 400]}
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                            label={{ value: 'Order Value ($)', angle: -90, position: 'insideLeft', offset: -5 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value) => value ? [`$${value}`, ''] : ['-', '']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Legend />
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <Bar 
                            dataKey="value" 
                            name="Actual AOV" 
                            fill="url(#colorValue)"
                            radius={[4, 4, 0, 0]} 
                            barSize={20}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ma3" 
                            name="3-Month MA" 
                            stroke="#ff7300" 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ma6" 
                            name="6-Month MA" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="forecast" 
                            name="Forecast" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="benchmark" 
                            name="Benchmark" 
                            stroke="#d1495b" 
                            strokeWidth={1}
                            strokeDasharray="3 3"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">AOV Distribution Analysis</CardTitle>
                    <CardDescription>Order value segmentation and statistical analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { range: '<$100', count: 42, percentage: 8 },
                              { range: '$100-$200', count: 86, percentage: 17 },
                              { range: '$200-$300', count: 118, percentage: 24 },
                              { range: '$300-$400', count: 135, percentage: 27 },
                              { range: '$400-$500', count: 78, percentage: 16 },
                              { range: '>$500', count: 41, percentage: 8 },
                            ]}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="range" className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                            <YAxis className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                              formatter={(value, name) => [name === 'count' ? value : `${value}%`, name === 'count' ? 'Orders' : 'Percentage']}
                            />
                            <Bar dataKey="count" name="Orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="percentage" name="Percentage" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        <div className="border rounded-md p-3">
                          <div className="text-xs font-medium text-muted-foreground">Median</div>
                          <div className="text-lg font-bold">$342.50</div>
                          <div className="text-xs flex items-center">
                            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                            <span>+$18.30 YoY</span>
                          </div>
                        </div>
                        <div className="border rounded-md p-3">
                          <div className="text-xs font-medium text-muted-foreground">Std Deviation</div>
                          <div className="text-lg font-bold">$115.72</div>
                          <div className="text-xs flex items-center">
                            <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                            <span>-12.8% YoY</span>
                          </div>
                        </div>
                        <div className="border rounded-md p-3">
                          <div className="text-xs font-medium text-muted-foreground">MAD</div>
                          <div className="text-lg font-bold">$84.21</div>
                          <div className="text-xs flex items-center">
                            <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                            <span>-8.2% YoY</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-medium">Segmented AOV Analysis</CardTitle>
                        <CardDescription>Order value breakdown by category, customer segment, and region</CardDescription>
                      </div>
                      <Select defaultValue="category">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Select dimension" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category">Product Category</SelectItem>
                          <SelectItem value="segment">Customer Segment</SelectItem>
                          <SelectItem value="region">Region</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            type="number" 
                            dataKey="orderCount" 
                            name="Order Count" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}} 
                            label={{ value: 'Order Volume', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="aov" 
                            name="AOV" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}} 
                            label={{ value: 'Average Order Value ($)', angle: -90, position: 'insideLeft', offset: -5 }}
                            domain={[200, 500]}
                          />
                          <ZAxis 
                            type="number" 
                            dataKey="revenue" 
                            range={[60, 400]} 
                            name="Revenue" 
                          />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value, name) => {
                              if (name === 'AOV') return [`$${value}`, name];
                              if (name === 'Order Count') return [value, name];
                              if (name === 'Revenue') return [`$${(Number(value)/1000).toFixed(1)}k`, name];
                              return [value, name];
                            }}
                            labelFormatter={(label) => `${label}`}
                          />
                          <Legend />
                          <Scatter 
                            name="Product Categories" 
                            data={[
                              { name: 'Shipping Supplies', orderCount: 145, aov: 248, revenue: 35960 },
                              { name: 'Warehouse Equipment', orderCount: 78, aov: 478, revenue: 37284 },
                              { name: 'Safety Products', orderCount: 112, aov: 362, revenue: 40544 },
                              { name: 'Packaging Materials', orderCount: 189, aov: 295, revenue: 55755 },
                              { name: 'Transport Equipment', orderCount: 67, aov: 412, revenue: 27604 },
                              { name: 'Office Supplies', orderCount: 203, aov: 218, revenue: 44254 },
                            ]}
                            fill="#8884d8" 
                            shape="circle"
                            label={{ dataKey: 'name', position: 'top', fill: 'hsl(var(--foreground))', fontSize: 10 }}
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Monthly Growth</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">+4.2%</div>
                    <div className="text-xs text-muted-foreground">Compared to previous month</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <BarChartBig className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Highest Month</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">May ($390)</div>
                    <div className="text-xs text-muted-foreground">21.8% above average</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">YTD Average</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">$336.71</div>
                    <div className="text-xs text-muted-foreground">8.2% above forecast</div>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">AOV Elasticity</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">0.83</div>
                    <div className="text-xs text-muted-foreground">Expected growth with 5% price increase</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Advanced Analytics Section */}
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
          <Tabs defaultValue="overview" className="w-full p-4">
            <TabsList className="w-full grid grid-cols-6 mb-4">
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">API Request Volume</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">247,482</div>
                    <div className="text-xs text-muted-foreground">+12% from previous period</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Avg Response Time</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">178ms</div>
                    <div className="text-xs text-muted-foreground">-23ms from previous period</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Error Rate</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">0.12%</div>
                    <div className="text-xs text-muted-foreground">Within acceptable threshold</div>
                  </CardContent>
                </Card>
                
                {/* Additional cards */}
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Fulfillment Rate</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">96.8%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span>+1.2% from target</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background shadow-none">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Top Region</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">Northeast</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <BarChart className="h-3 w-3 mr-1 text-purple-500" />
                      <span>42% of volume</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Performance Summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Delivery Efficiency</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Technical Uptime</span>
                        <span className="font-medium">99.7%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '99.7%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Order Processing</span>
                        <span className="font-medium">88%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Regional Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Regional Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Northeast</span>
                        <span className="text-xs font-medium">42%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Southeast</span>
                        <span className="text-xs font-medium">18%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Midwest</span>
                        <span className="text-xs font-medium">22%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '22%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">West</span>
                        <span className="text-xs font-medium">18%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Alerts Section */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="space-y-3">
                    <div className="p-3 rounded-md bg-amber-500/10 border border-amber-200">
                      <h4 className="font-medium text-sm mb-1 text-amber-600">Payment Gateway Latency</h4>
                      <p className="text-xs text-muted-foreground">Response time exceeding threshold (1.2s)</p>
                    </div>
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-200">
                      <h4 className="font-medium text-sm mb-1 text-red-600">Order Processing Queue</h4>
                      <p className="text-xs text-muted-foreground">Queue growing abnormally (24 pending)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Data refreshed automatically every 5 minutes. Last update: 10:42 AM
                </div>
              </div>
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
                </CardHeader>
                <CardContent className="px-0">
                  <div className="border-b">
                    <div className="flex">
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Shipping Method</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Priority</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Target Time</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Actual Time</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Variance</div>
                      <div className="py-2 px-4 font-medium text-xs w-1/6">Compliance</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6">Express Air</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">High</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">24 hours</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">22.5 hours</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-green-500">-1.5 hours</div>
                      <div className="py-2 px-4 text-xs w-1/6 text-green-500">100%</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6">Ground Premium</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">Medium</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">48 hours</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">45.2 hours</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-green-500">-2.8 hours</div>
                      <div className="py-2 px-4 text-xs w-1/6 text-green-500">97.5%</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6">Standard Ground</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">Regular</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">5 days</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">5.4 days</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-amber-500">+0.4 days</div>
                      <div className="py-2 px-4 text-xs w-1/6 text-amber-500">91.8%</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6">Economy</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">Low</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">7 days</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">8.2 days</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-red-500">+1.2 days</div>
                      <div className="py-2 px-4 text-xs w-1/6 text-red-500">85.3%</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6">International</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">Medium</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">10 days</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">11.5 days</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-amber-500">+1.5 days</div>
                      <div className="py-2 px-4 text-xs w-1/6 text-amber-500">88.9%</div>
                    </div>
                  </div>
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                              { name: 'Northeast', value: 42 },
                              { name: 'Southeast', value: 18 },
                              { name: 'Midwest', value: 15 },
                              { name: 'Southwest', value: 12 },
                              { name: 'West', value: 13 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                            {[
                              { name: 'Northeast', value: 42 },
                              { name: 'Southeast', value: 18 },
                              { name: 'Midwest', value: 15 },
                              { name: 'Southwest', value: 12 },
                              { name: 'West', value: 13 },
                            ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                            formatter={(value) => [`${value}%`, 'Order Volume']}
                    contentStyle={{
                              background: 'hsl(var(--card))', 
                              borderColor: 'hsl(var(--border))' 
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
                </CardHeader>
                <CardContent className="px-0">
                  <div className="border-b">
                    <div className="flex">
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Region</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Order Volume</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Avg Order Value</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Fulfillment Rate</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Delivery Time</div>
                      <div className="py-2 px-4 font-medium text-xs w-1/6">Return Rate</div>
                </div>
                  </div>
                  <div className="divide-y">
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">Northeast</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">4,521</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">$218</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-green-500">98.4%</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">2.8 days</div>
                      <div className="py-2 px-4 text-xs w-1/6">3.2%</div>
                </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">Southeast</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">1,932</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">$185</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-amber-500">92.1%</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">3.5 days</div>
                      <div className="py-2 px-4 text-xs w-1/6">4.1%</div>
              </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">Midwest</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">1,614</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">$205</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-green-500">97.8%</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">3.2 days</div>
                      <div className="py-2 px-4 text-xs w-1/6">2.8%</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">Southwest</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">1,291</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">$230</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-green-500">95.6%</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">3.0 days</div>
                      <div className="py-2 px-4 text-xs w-1/6">3.5%</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">West</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">1,398</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">$245</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6 text-green-500">96.3%</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">2.9 days</div>
                      <div className="py-2 px-4 text-xs w-1/6">2.9%</div>
                    </div>
                    </div>
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
                    <CardDescription>Types of anomalies detected in the system</CardDescription>
            </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Processing Delays', value: 35 },
                              { name: 'Payment Failures', value: 25 },
                              { name: 'Inventory Mismatches', value: 18 },
                              { name: 'Shipping Exceptions', value: 15 },
                              { name: 'API Errors', value: 7 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Processing Delays', value: 35 },
                              { name: 'Payment Failures', value: 25 },
                              { name: 'Inventory Mismatches', value: 18 },
                              { name: 'Shipping Exceptions', value: 15 },
                              { name: 'API Errors', value: 7 },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Occurrence']}
                            contentStyle={{ 
                              background: 'hsl(var(--card))', 
                              borderColor: 'hsl(var(--border))' 
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
        
          <Card>
                <CardHeader>
                  <CardTitle>Active Anomalies</CardTitle>
                  <CardDescription>Current anomalies requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="border-b">
                    <div className="flex">
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">ID</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/4">Description</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Type</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Detected</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/6">Severity</div>
                      <div className="py-2 px-4 font-medium text-xs w-1/12">Status</div>
                </div>
              </div>
                  <div className="divide-y">
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">ANM-1082</div>
                      <div className="py-2 px-4 border-r text-xs w-1/4">Payment gateway response time exceeding threshold</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">Payment Failure</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">2h ago</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">
                        <Badge className="bg-red-500">High</Badge>
                      </div>
                      <div className="py-2 px-4 text-xs w-1/12">Active</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">ANM-1081</div>
                      <div className="py-2 px-4 border-r text-xs w-1/4">Order processing queue growing abnormally</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">Processing Delay</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">4h ago</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">
                        <Badge className="bg-red-500">High</Badge>
                      </div>
                      <div className="py-2 px-4 text-xs w-1/12">Active</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">ANM-1080</div>
                      <div className="py-2 px-4 border-r text-xs w-1/4">Inventory synchronization failures detected</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">Inventory Mismatch</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">5h ago</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">
                        <Badge className="bg-red-500">High</Badge>
                      </div>
                      <div className="py-2 px-4 text-xs w-1/12">Active</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">ANM-1079</div>
                      <div className="py-2 px-4 border-r text-xs w-1/4">Shipping label generation intermittent failures</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">Shipping Exception</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">6h ago</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">
                        <Badge className="bg-amber-500">Medium</Badge>
                      </div>
                      <div className="py-2 px-4 text-xs w-1/12">Active</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/6 font-medium">ANM-1078</div>
                      <div className="py-2 px-4 border-r text-xs w-1/4">Unusual spike in order cancellations</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">Processing Delay</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">8h ago</div>
                      <div className="py-2 px-4 border-r text-xs w-1/6">
                        <Badge className="bg-amber-500">Medium</Badge>
                      </div>
                      <div className="py-2 px-4 text-xs w-1/12">Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Error Count</span>
                    </div>
                    <div className="mt-1 text-xl font-bold">17</div>
                    <div className="text-xs text-muted-foreground">Last 24 hours</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* System Performance Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Order API Response Time</div>
                      <div className="text-sm text-green-500 font-medium">178ms</div>
                </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '23%' }}></div>
              </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Target: &lt;250ms</div>
                      <div>P95: 212ms</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Database Query Time</div>
                      <div className="text-sm text-amber-500 font-medium">356ms</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Target: &lt;300ms</div>
                      <div>P95: 423ms</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Payment Gateway Latency</div>
                      <div className="text-sm text-green-500 font-medium">422ms</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Target: &lt;500ms</div>
                      <div>P95: 486ms</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Cache Hit Ratio</div>
                      <div className="text-sm text-green-500 font-medium">94.8%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '94.8%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Target: &gt;90%</div>
                      <div>Min: 88.2%</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Order Processing Queue</div>
                      <div className="text-sm text-blue-500 font-medium">24 orders</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '24%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Capacity: 100</div>
                      <div>Avg: 18</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">Webhook Delivery Rate</div>
                      <div className="text-sm text-green-500 font-medium">99.7%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '99.7%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Target: &gt;99.5%</div>
                      <div>Failures: 7</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-md p-3">
                  <div className="text-sm font-medium mb-2">System Status</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Order API</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Operational</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Payment Processor</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Operational</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-sm">Inventory System</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Degraded</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Shipping API</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Operational</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Notification Service</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Operational</span>
                    </div>
                    
                    <div className="pt-2 text-xs text-blue-500 flex items-center cursor-pointer">
                      <span>View detailed status board</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">System Resource Utilization</CardTitle>
                    <CardDescription>CPU, Memory and Network metrics over time</CardDescription>
            </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { time: '00:00', cpu: 42, memory: 35, network: 15 },
                            { time: '04:00', cpu: 28, memory: 32, network: 13 },
                            { time: '08:00', cpu: 55, memory: 40, network: 25 },
                            { time: '12:00', cpu: 78, memory: 52, network: 38 },
                            { time: '16:00', cpu: 82, memory: 58, network: 42 },
                            { time: '20:00', cpu: 65, memory: 45, network: 32 },
                            { time: '24:00', cpu: 45, memory: 38, network: 20 },
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="time" className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                          <YAxis className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                          <Tooltip contentStyle={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                          <Legend />
                          <Line type="monotone" dataKey="cpu" name="CPU %" stroke="#3b82f6" strokeWidth={2} />
                          <Line type="monotone" dataKey="memory" name="Memory %" stroke="#10b981" strokeWidth={2} />
                          <Line type="monotone" dataKey="network" name="Network Mb/s" stroke="#f59e0b" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
            </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">API Request Distribution</CardTitle>
                    <CardDescription>Endpoint performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { endpoint: '/orders/create', requests: 1250, latency: 145 },
                            { endpoint: '/orders/update', requests: 830, latency: 132 },
                            { endpoint: '/orders/status', requests: 2380, latency: 87 },
                            { endpoint: '/orders/search', requests: 1890, latency: 220 },
                            { endpoint: '/orders/metrics', requests: 560, latency: 175 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="endpoint" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                            angle={-45}
                            textAnchor="end"
                          />
                          <YAxis yAxisId="left" orientation="left" className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                          <YAxis yAxisId="right" orientation="right" className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                          <Tooltip contentStyle={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                          <Legend />
                          <Bar yAxisId="left" dataKey="requests" name="Request Count" fill="hsl(var(--primary))" />
                          <Line yAxisId="right" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#ef4444" strokeWidth={2} />
                        </BarChart>
                      </ResponsiveContainer>
              </div>
                  </CardContent>
          </Card>
              </div>
        
              {/* System Logs Table */}
          <Card>
            <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                <div>
                      <CardTitle className="text-base">Technical Performance Logs</CardTitle>
                      <CardDescription>Recent system events and performance metrics</CardDescription>
                </div>
                    <Select defaultValue="realtime">
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Update frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="1min">1 minute</SelectItem>
                        <SelectItem value="5min">5 minutes</SelectItem>
                        <SelectItem value="15min">15 minutes</SelectItem>
                      </SelectContent>
                    </Select>
              </div>
            </CardHeader>
                <CardContent className="px-0">
                  <div className="border-b">
                    <div className="flex">
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/5">Timestamp</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/5">Component</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/5">Metric</div>
                      <div className="py-2 px-4 border-r font-medium text-xs w-1/5">Value</div>
                      <div className="py-2 px-4 font-medium text-xs w-1/5">Status</div>
              </div>
                  </div>
                  <div className="divide-y">
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/5">2024-04-22 10:42:18</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Order Processor</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Request Latency</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">132ms</div>
                      <div className="py-2 px-4 text-xs w-1/5 text-green-500">Normal</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/5">2024-04-22 10:40:55</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Database</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Query Time</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">215ms</div>
                      <div className="py-2 px-4 text-xs w-1/5 text-amber-500">Warning</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/5">2024-04-22 10:39:12</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Payment Gateway</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Response Time</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">1.2s</div>
                      <div className="py-2 px-4 text-xs w-1/5 text-red-500">Critical</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/5">2024-04-22 10:38:45</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Inventory API</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Availability Check</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">87ms</div>
                      <div className="py-2 px-4 text-xs w-1/5 text-green-500">Normal</div>
                    </div>
                    <div className="flex">
                      <div className="py-2 px-4 border-r text-xs w-1/5">2024-04-22 10:37:22</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Shipping Calculator</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">Computation Time</div>
                      <div className="py-2 px-4 border-r text-xs w-1/5">342ms</div>
                      <div className="py-2 px-4 text-xs w-1/5 text-amber-500">Warning</div>
                    </div>
                  </div>
                </CardContent>
          </Card>
        </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Issues and Alerts */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
              <CardTitle>Order Risk Management</CardTitle>
              <CardDescription>Monitor and address potential order issues</CardDescription>
                </div>
            <Button variant="outline" size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              View All Alerts
            </Button>
              </div>
            </CardHeader>
            <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert Type</TableHead>
                <TableHead>Orders Affected</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>First Detected</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Delayed Shipping</div>
                  <div className="text-xs text-muted-foreground">Carrier delays in Midwest region</div>
                </TableCell>
                <TableCell>24 orders</TableCell>
                <TableCell>
                  <Badge variant="warning">Medium</Badge>
                </TableCell>
                <TableCell>1-2 day delay</TableCell>
                <TableCell>8 hours ago</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Resolve</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Inventory Shortage</div>
                  <div className="text-xs text-muted-foreground">SKU-78901 unavailable</div>
                </TableCell>
                <TableCell>7 orders</TableCell>
                <TableCell>
                  <Badge variant="destructive">High</Badge>
                </TableCell>
                <TableCell>Order fulfillment blocked</TableCell>
                <TableCell>3 hours ago</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Resolve</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Payment Processing</div>
                  <div className="text-xs text-muted-foreground">Gateway timeout errors</div>
                </TableCell>
                <TableCell>12 orders</TableCell>
                <TableCell>
                  <Badge variant="destructive">High</Badge>
                </TableCell>
                <TableCell>Order processing delayed</TableCell>
                <TableCell>5 hours ago</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Resolve</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Address Validation</div>
                  <div className="text-xs text-muted-foreground">Incomplete shipping information</div>
                </TableCell>
                <TableCell>3 orders</TableCell>
                <TableCell>
                  <Badge variant="secondary">Low</Badge>
                </TableCell>
                <TableCell>Manual verification needed</TableCell>
                <TableCell>1 day ago</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Resolve</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
            </CardContent>
          </Card>
    </div>
  );
}