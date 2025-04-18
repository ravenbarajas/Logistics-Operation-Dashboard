import React, { useState, useEffect, useRef } from "react";
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
  Activity,
  ArrowUpDown,
  MapPin
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
  ComposedChart,
  ReferenceLine
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

// Sample data for Fulfillment Service Level Compliance table
const fulfillmentComplianceData: FulfillmentCompliance[] = [
  {
    id: 'FSL-001',
    shippingMethod: 'Express Air',
    priority: 'High',
    targetTime: '24 hours',
    actualTime: '22.5 hours',
    variance: '-1.5 hours',
    varianceValue: -1.5,
    compliance: 100,
    status: 'optimal'
  },
  {
    id: 'FSL-002',
    shippingMethod: 'Ground Premium',
    priority: 'Medium',
    targetTime: '48 hours',
    actualTime: '45.2 hours',
    variance: '-2.8 hours',
    varianceValue: -2.8,
    compliance: 97.5,
    status: 'optimal'
  },
  {
    id: 'FSL-003',
    shippingMethod: 'Standard Ground',
    priority: 'Regular',
    targetTime: '5 days',
    actualTime: '5.4 days',
    variance: '+0.4 days',
    varianceValue: 0.4,
    compliance: 91.8,
    status: 'warning'
  },
  {
    id: 'FSL-004',
    shippingMethod: 'Economy',
    priority: 'Low',
    targetTime: '7 days',
    actualTime: '8.2 days',
    variance: '+1.2 days',
    varianceValue: 1.2,
    compliance: 85.3,
    status: 'critical'
  },
  {
    id: 'FSL-005',
    shippingMethod: 'International',
    priority: 'Medium',
    targetTime: '10 days',
    actualTime: '11.5 days',
    variance: '+1.5 days',
    varianceValue: 1.5,
    compliance: 88.9,
    status: 'warning'
  },
  {
    id: 'FSL-006',
    shippingMethod: 'Express Local',
    priority: 'High',
    targetTime: '12 hours',
    actualTime: '11.8 hours',
    variance: '-0.2 hours',
    varianceValue: -0.2,
    compliance: 99.5,
    status: 'optimal'
  },
  {
    id: 'FSL-007',
    shippingMethod: 'Same Day Delivery',
    priority: 'High',
    targetTime: '6 hours',
    actualTime: '5.8 hours',
    variance: '-0.2 hours',
    varianceValue: -0.2,
    compliance: 99.8,
    status: 'optimal'
  },
  {
    id: 'FSL-008',
    shippingMethod: 'Rail Freight',
    priority: 'Medium',
    targetTime: '72 hours',
    actualTime: '74.5 hours',
    variance: '+2.5 hours',
    varianceValue: 2.5,
    compliance: 93.2,
    status: 'warning'
  },
  {
    id: 'FSL-009',
    shippingMethod: 'Ocean Standard',
    priority: 'Low',
    targetTime: '14 days',
    actualTime: '15.3 days',
    variance: '+1.3 days',
    varianceValue: 1.3,
    compliance: 86.5,
    status: 'warning'
  },
  {
    id: 'FSL-010',
    shippingMethod: 'Priority Mail',
    priority: 'Medium',
    targetTime: '3 days',
    actualTime: '3.1 days',
    variance: '+0.1 days',
    varianceValue: 0.1,
    compliance: 96.7,
    status: 'good'
  }
];

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

// Sample data for Regional Performance Metrics
const regionalPerformanceData: RegionalPerformanceMetrics[] = [
  {
    id: 'NE-001',
    region: 'Northeast',
    orderVolume: 4521,
    avgOrderValue: 218.45,
    fulfillmentRate: 98.4,
    deliveryTime: 2.8,
    returnRate: 3.2,
    yoyGrowth: 8.5,
    customerSatisfaction: 92,
    status: 'optimal'
  },
  {
    id: 'SE-001',
    region: 'Southeast',
    orderVolume: 1932,
    avgOrderValue: 185.20,
    fulfillmentRate: 92.1,
    deliveryTime: 3.5,
    returnRate: 4.1,
    yoyGrowth: 12.3,
    customerSatisfaction: 88,
    status: 'warning'
  },
  {
    id: 'MW-001',
    region: 'Midwest',
    orderVolume: 1614,
    avgOrderValue: 205.30,
    fulfillmentRate: 97.8,
    deliveryTime: 3.2,
    returnRate: 2.8,
    yoyGrowth: 5.2,
    customerSatisfaction: 91,
    status: 'good'
  },
  {
    id: 'SW-001',
    region: 'Southwest',
    orderVolume: 1291,
    avgOrderValue: 230.15,
    fulfillmentRate: 95.6,
    deliveryTime: 3.0,
    returnRate: 3.5,
    yoyGrowth: 23.4,
    customerSatisfaction: 89,
    status: 'good'
  },
  {
    id: 'W-001',
    region: 'West',
    orderVolume: 1398,
    avgOrderValue: 245.80,
    fulfillmentRate: 96.3,
    deliveryTime: 2.9,
    returnRate: 2.9,
    yoyGrowth: 15.7,
    customerSatisfaction: 93,
    status: 'optimal'
  },
  {
    id: 'NE-002',
    region: 'Northeast-Metro',
    orderVolume: 2845,
    avgOrderValue: 232.60,
    fulfillmentRate: 97.8,
    deliveryTime: 2.5,
    returnRate: 3.0,
    yoyGrowth: 9.2,
    customerSatisfaction: 94,
    status: 'optimal'
  },
  {
    id: 'SE-002',
    region: 'Southeast-Coastal',
    orderVolume: 1245,
    avgOrderValue: 192.40,
    fulfillmentRate: 91.5,
    deliveryTime: 3.8,
    returnRate: 4.5,
    yoyGrowth: 10.8,
    customerSatisfaction: 86,
    status: 'warning'
  },
  {
    id: 'MW-002',
    region: 'Midwest-Central',
    orderVolume: 982,
    avgOrderValue: 198.75,
    fulfillmentRate: 96.9,
    deliveryTime: 3.4,
    returnRate: 3.1,
    yoyGrowth: 4.8,
    customerSatisfaction: 90,
    status: 'good'
  },
  {
    id: 'SW-002',
    region: 'Southwest-Desert',
    orderVolume: 865,
    avgOrderValue: 225.90,
    fulfillmentRate: 94.8,
    deliveryTime: 3.2,
    returnRate: 3.8,
    yoyGrowth: 21.5,
    customerSatisfaction: 88,
    status: 'warning'
  },
  {
    id: 'W-002',
    region: 'West-Coast',
    orderVolume: 1125,
    avgOrderValue: 258.35,
    fulfillmentRate: 95.9,
    deliveryTime: 3.0,
    returnRate: 3.2,
    yoyGrowth: 14.2,
    customerSatisfaction: 91,
    status: 'good'
  }
];

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

  // Add state for the order details modal
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
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

  // Sample data for Returns and Refunds
  const returnsRefundsData = [
    { month: 'Jan', returns: 42, refunds: 38, returnRate: 3.2, refundAmount: 4250 },
    { month: 'Feb', returns: 38, refunds: 34, returnRate: 2.9, refundAmount: 3980 },
    { month: 'Mar', returns: 45, refunds: 40, returnRate: 3.4, refundAmount: 4760 },
    { month: 'Apr', returns: 37, refunds: 35, returnRate: 2.8, refundAmount: 4120 },
    { month: 'May', returns: 41, refunds: 39, returnRate: 3.1, refundAmount: 4350 },
    { month: 'Jun', returns: 49, refunds: 45, returnRate: 3.7, refundAmount: 5240 },
    { month: 'Jul', returns: 44, refunds: 41, returnRate: 3.3, refundAmount: 4780 },
    { month: 'Aug', returns: 35, refunds: 32, returnRate: 2.6, refundAmount: 3850 },
  ];
  
  // Sample data for Profitability Analysis
  const profitabilityData = [
    { month: 'Jan', revenue: 128500, costs: 96375, profit: 32125, margin: 25.0 },
    { month: 'Feb', revenue: 135200, costs: 99048, profit: 36152, margin: 26.7 },
    { month: 'Mar', revenue: 142800, costs: 107100, profit: 35700, margin: 25.0 },
    { month: 'Apr', revenue: 138600, costs: 101178, profit: 37422, margin: 27.0 },
    { month: 'May', revenue: 152400, costs: 114300, profit: 38100, margin: 25.0 },
    { month: 'Jun', revenue: 165800, costs: 121082, profit: 44718, margin: 27.0 },
    { month: 'Jul', revenue: 172500, costs: 127650, profit: 44850, margin: 26.0 },
    { month: 'Aug', revenue: 168900, costs: 123297, profit: 45603, margin: 27.0 },
  ];
  
  // Sample data for Profit Trends
  const profitTrendsData = [
    { category: 'Electronics', sales: 42500, costs: 31875, profit: 10625, margin: 25.0 },
    { category: 'Clothing', sales: 36800, costs: 25760, profit: 11040, margin: 30.0 },
    { category: 'Home Goods', sales: 29500, costs: 21535, profit: 7965, margin: 27.0 },
    { category: 'Sports Equip', sales: 18700, costs: 14586, profit: 4114, margin: 22.0 },
    { category: 'Beauty', sales: 22400, costs: 15680, profit: 6720, margin: 30.0 },
    { category: 'Books', sales: 15300, costs: 9945, profit: 5355, margin: 35.0 },
    { category: 'Toys', sales: 19800, costs: 14850, profit: 4950, margin: 25.0 },
    { category: 'Grocery', sales: 31200, costs: 26520, profit: 4680, margin: 15.0 },
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
  
  const [selectedTimeInterval, setSelectedTimeInterval] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

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

      {/* Order Status Analytics Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Order Status Analytics</CardTitle>
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

      {/* Order Performance Analytics Section */}
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

      {/* Order Financial Analytics Section */}
      <Card>
        <CardContent className="p-0">
          <OrderFinancialAnalytics />
        </CardContent>
      </Card>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isOrderDetailsModalOpen}
          onClose={() => {
            setIsOrderDetailsModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
      
      {/* Add OrderDetailsWrapper just before the closing div */}
      <OrderDetailsWrapper
        isOpen={isOrderDetailsModalOpen}
        onClose={() => {
          setIsOrderDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
}

// Regional distribution data for the map
const regionalOrderData = [
  { region: "Northeast", orders: 4521, revenue: 985578, aov: 218, lat: 42.5, lng: -72, percentage: 42.1 },
  { region: "Southeast", orders: 1932, revenue: 357420, aov: 185, lat: 33, lng: -84, percentage: 18.0 },
  { region: "Midwest", orders: 1614, revenue: 330870, aov: 205, lat: 41.5, lng: -93, percentage: 15.0 },
  { region: "Southwest", orders: 1291, revenue: 296930, aov: 230, lat: 32, lng: -106, percentage: 12.0 },
  { region: "West", orders: 1398, revenue: 342510, aov: 245, lat: 37, lng: -122, percentage: 13.0 }
];

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
