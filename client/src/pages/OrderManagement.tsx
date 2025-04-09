import React, { useState } from "react";
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
  Clipboard
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

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
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  
  // Calculate order statistics 
  const totalOrders = orderList.length;
  const processingOrders = orderList.filter(order => order.status === "processing").length;
  const shippedOrders = orderList.filter(order => order.status === "shipped").length;
  const deliveredOrders = orderList.filter(order => order.status === "delivered").length;
  const cancelledOrders = orderList.filter(order => order.status === "cancelled").length;
  const pendingPayment = orderList.filter(order => order.payment === "pending").length;
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Add a new order
  const handleAddOrder = (newOrder: Order) => {
    setOrderList([newOrder, ...orderList]);
  };
  
  // Filter orders for display
  const getFilteredOrders = (status?: Order['status']) => {
    let filtered = orderList;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        
        if (dateFilter === 'today') {
          return orderDate.toDateString() === today.toDateString();
        }
        
        if (dateFilter === 'yesterday') {
          return orderDate.toDateString() === yesterday.toDateString();
        }
        
        if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return orderDate >= weekAgo;
        }
        
        return true;
      });
    }
    
    // Apply payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment === paymentFilter);
    }
    
    // Apply status filter if provided
    if (status) {
      filtered = filtered.filter(order => order.status === status);
    }
    
    return filtered;
  };
  
  // Count orders by status
  const orderCounts = {
    processing: orderList.filter(order => order.status === 'processing').length,
    shipped: orderList.filter(order => order.status === 'shipped').length,
    delivered: orderList.filter(order => order.status === 'delivered').length,
    cancelled: orderList.filter(order => order.status === 'cancelled').length,
  };
  
  // Render order table
  const renderOrderTable = (orders: Order[]) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Shipping</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Badge variant={
                    order.status === 'processing' ? 'warning' : 
                    order.status === 'shipped' ? 'secondary' : 
                    order.status === 'delivered' ? 'success' : 
                    'destructive'
                  }>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    order.payment === 'completed' ? 'success' : 
                    order.payment === 'pending' ? 'warning' : 
                    'destructive'
                  }>
                    {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {order.shipping.toUpperCase()}
                  </Badge>
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
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit order</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Update status</DropdownMenuItem>
                      <DropdownMenuItem>Generate invoice</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Cancel order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10">
                No orders found matching the criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex items-center mt-1">
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
            <div className="text-2xl font-bold text-blue-500">{processingOrders}</div>
            <div className="flex items-center mt-1">
              <Package className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{Math.round((processingOrders / totalOrders) * 100)}% of total orders</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-green-500">{deliveredOrders}</div>
            <div className="flex items-center mt-1">
              <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{Math.round((deliveredOrders / totalOrders) * 100)}% delivery rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-amber-500">{pendingPayment}</div>
            <div className="flex items-center mt-1">
              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{Math.round((pendingPayment / totalOrders) * 100)}% of total orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Volume & Revenue</CardTitle>
            <CardDescription>Daily order volume and revenue trends</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={orderVolumeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`$${value}`, 'Revenue'];
                      return [value, 'Orders'];
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="orders" 
                    name="Orders" 
                    stroke="hsl(var(--primary))" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of orders by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Processing', value: orderCounts.processing },
                      { name: 'Shipped', value: orderCounts.shipped },
                      { name: 'Delivered', value: orderCounts.delivered },
                      { name: 'Cancelled', value: orderCounts.cancelled },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData.map((entry, index) => (
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
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Shipping Methods</CardTitle>
              <CardDescription>Distribution of orders by shipping carrier</CardDescription>
            </div>
            <Select defaultValue="week">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shippingMethodsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number" 
                  className="text-xs" 
                  tick={{fill: 'hsl(var(--foreground))'}}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  className="text-xs" 
                  tick={{fill: 'hsl(var(--foreground))'}}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
                <Bar dataKey="value" name="Orders" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing ({orderCounts.processing})</TabsTrigger>
          <TabsTrigger value="shipped">Shipped ({orderCounts.shipped})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({orderCounts.delivered})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({orderCounts.cancelled})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Order List</CardTitle>
                  <CardDescription>Manage and process customer orders</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {renderOrderTable(getFilteredOrders())}
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredOrders().length} of {orderList.length} orders
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Processing Orders</CardTitle>
                  <CardDescription>Orders currently being prepared for shipping</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {renderOrderTable(getFilteredOrders("processing"))}
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredOrders("processing").length} of {orderCounts.processing} processing orders
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipped">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Shipped Orders</CardTitle>
                  <CardDescription>Orders in transit to customers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {renderOrderTable(getFilteredOrders("shipped"))}
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredOrders("shipped").length} of {orderCounts.shipped} shipped orders
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivered">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Delivered Orders</CardTitle>
                  <CardDescription>Successfully completed orders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {renderOrderTable(getFilteredOrders("delivered"))}
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredOrders("delivered").length} of {orderCounts.delivered} delivered orders
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Cancelled Orders</CardTitle>
                  <CardDescription>Orders that have been cancelled</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {renderOrderTable(getFilteredOrders("cancelled"))}
            </CardContent>
            <CardFooter className="border-t py-4 px-6">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredOrders("cancelled").length} of {orderCounts.cancelled} cancelled orders
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <NewOrderModal 
        isOpen={isNewOrderModalOpen} 
        onClose={() => setIsNewOrderModalOpen(false)}
        onSuccess={handleAddOrder}
      />

      {/* Advanced Analytics Section */}
      <div className="mt-10 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">Order Performance Analytics</h2>
          
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

        <div className="border rounded-lg mb-6 overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b bg-muted/40">
              <div className="flex overflow-x-auto">
                <TabsList className="bg-transparent h-10 p-0">
                  <TabsTrigger value="overview" className="rounded-none h-10 px-4 data-[state=active]:bg-background">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="fulfillment" className="rounded-none h-10 px-4 data-[state=active]:bg-background">
                    Fulfillment Metrics
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="rounded-none h-10 px-4 data-[state=active]:bg-background">
                    Performance Analysis
                  </TabsTrigger>
                  <TabsTrigger value="regional" className="rounded-none h-10 px-4 data-[state=active]:bg-background">
                    Regional Distribution
                  </TabsTrigger>
                  <TabsTrigger value="anomalies" className="rounded-none h-10 px-4 data-[state=active]:bg-background">
                    Anomaly Detection
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="rounded-none h-10 px-4 data-[state=active]:bg-background">
                    Technical Performance
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <TabsContent value="overview" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Data refreshed automatically every 5 minutes. Last update: 10:42 AM
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="fulfillment" className="p-0">
              {/* Fulfillment metrics content will be shown when this tab is active */}
            </TabsContent>
            
            <TabsContent value="performance" className="p-0">
              {/* Performance analysis content will be shown when this tab is active */}
            </TabsContent>
            
            <TabsContent value="regional" className="p-0">
              {/* Regional distribution content will be shown when this tab is active */}
            </TabsContent>
            
            <TabsContent value="anomalies" className="p-0">
              {/* Anomaly detection content will be shown when this tab is active */}
            </TabsContent>
            
            <TabsContent value="technical" className="p-0">
              {/* Technical performance content will be shown when this tab is active */}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Order Fulfillment KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Order Fulfillment Rate</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-primary">96.4%</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <p className="text-xs text-muted-foreground">2.1% above target</p>
            </div>
            <div className="h-1 w-full bg-muted mt-3">
              <div className="h-1 bg-primary" style={{ width: '96.4%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-amber-500">1.8 days</div>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">0.2 days below target</p>
            </div>
            <div className="h-1 w-full bg-muted mt-3">
              <div className="h-1 bg-amber-500" style={{ width: '75%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-green-500">94.2%</div>
            <div className="flex items-center mt-1">
              <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">1.7% improvement from last month</p>
            </div>
            <div className="h-1 w-full bg-muted mt-3">
              <div className="h-1 bg-green-500" style={{ width: '94.2%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-blue-500">3.2%</div>
            <div className="flex items-center mt-1">
              <RefreshCw className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">0.5% decrease from last quarter</p>
            </div>
            <div className="h-1 w-full bg-muted mt-3">
              <div className="h-1 bg-blue-500" style={{ width: '32%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Timeline and Order Value Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Processing Timeline</CardTitle>
            <CardDescription>Average time spent in each phase of order processing</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { stage: 'Order Received', hours: 2.4 },
                    { stage: 'Payment Processing', hours: 4.1 },
                    { stage: 'Inventory Allocation', hours: 5.8 },
                    { stage: 'Packaging', hours: 7.2 },
                    { stage: 'Shipping', hours: 24.6 },
                    { stage: 'In Transit', hours: 38.5 },
                  ]}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number" 
                    className="text-xs" 
                    label={{ value: 'Hours', position: 'insideBottom', offset: -5 }}
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    type="category"
                    dataKey="stage" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value) => [`${value} hours`, 'Duration']}
                  />
                  <Bar dataKey="hours" name="Hours" fill="hsl(var(--primary))" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
            <CardDescription>By customer segment</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Enterprise', value: 4200 },
                      { name: 'Mid-Market', value: 2850 },
                      { name: 'Small Business', value: 1350 },
                      { name: 'Retail', value: 580 },
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
                      { name: 'Enterprise', value: 4200 },
                      { name: 'Mid-Market', value: 2850 },
                      { name: 'Small Business', value: 1350 },
                      { name: 'Retail', value: 580 },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value) => [`$${value}`, 'Avg. Order Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical System Performance Metrics */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>System Performance Metrics</CardTitle>
              <CardDescription>Technical indicators for the order processing pipeline</CardDescription>
            </div>
            <Select defaultValue="realtime">
              <SelectTrigger className="w-[180px]">
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
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Order Volume Heatmap */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Order Volume Heatmap</CardTitle>
              <CardDescription>Distribution of orders by day and hour (UTC)</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Week
              </Button>
              <Button variant="outline" size="sm">
                Month
              </Button>
              <Button variant="outline" size="sm">
                Quarter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-64">
            {/* This would be a heatmap visualization in a real implementation */}
            <div className="border rounded overflow-hidden">
              <div className="grid grid-cols-7 grid-rows-24 h-full">
                {/* Days of week */}
                <div className="bg-muted/30 flex items-center justify-center text-xs font-medium">Hour</div>
                <div className="bg-muted/30 flex items-center justify-center text-xs font-medium">Mon</div>
                <div className="bg-muted/30 flex items-center justify-center text-xs font-medium">Tue</div>
                <div className="bg-muted/30 flex items-center justify-center text-xs font-medium">Wed</div>
                <div className="bg-muted/30 flex items-center justify-center text-xs font-medium">Thu</div>
                <div className="bg-muted/30 flex items-center justify-center text-xs font-medium">Fri</div>
                <div className="bg-muted/30 flex items-center justify-center text-xs font-medium">Sat</div>
                <div className="bg-muted/30 flex items-center justify-center text-xs font-medium">Sun</div>
                
                {/* Hours - would dynamically generate in a real implementation */}
                <div className="bg-muted/30 flex items-center justify-center text-xs">00:00</div>
                <div className="bg-[#f3faff] flex items-center justify-center text-xs">12</div>
                <div className="bg-[#d6edff] flex items-center justify-center text-xs">18</div>
                <div className="bg-[#c1e3ff] flex items-center justify-center text-xs">22</div>
                <div className="bg-[#a7d8ff] flex items-center justify-center text-xs">28</div>
                <div className="bg-[#8dceff] flex items-center justify-center text-xs">32</div>
                <div className="bg-[#6ebdff] flex items-center justify-center text-xs">10</div>
                
                <div className="bg-muted/30 flex items-center justify-center text-xs">06:00</div>
                <div className="bg-[#a7d8ff] flex items-center justify-center text-xs">27</div>
                <div className="bg-[#6ebdff] flex items-center justify-center text-xs">38</div>
                <div className="bg-[#54b4ff] flex items-center justify-center text-xs">42</div>
                <div className="bg-[#3ba2fb] flex items-center justify-center text-xs">48</div>
                <div className="bg-[#2b94f2] flex items-center justify-center text-xs">45</div>
                <div className="bg-[#54b4ff] flex items-center justify-center text-xs">28</div>
                
                <div className="bg-muted/30 flex items-center justify-center text-xs">12:00</div>
                <div className="bg-[#54b4ff] flex items-center justify-center text-xs">42</div>
                <div className="bg-[#1f85e2] flex items-center justify-center text-xs">58</div>
                <div className="bg-[#0e67c4] flex items-center justify-center text-xs">72</div>
                <div className="bg-[#0a56ab] flex items-center justify-center text-xs">85</div>
                <div className="bg-[#074487] flex items-center justify-center text-xs">76</div>
                <div className="bg-[#0e67c4] flex items-center justify-center text-xs">32</div>
                
                <div className="bg-muted/30 flex items-center justify-center text-xs">18:00</div>
                <div className="bg-[#2b94f2] flex items-center justify-center text-xs">47</div>
                <div className="bg-[#0e67c4] flex items-center justify-center text-xs">62</div>
                <div className="bg-[#074487] flex items-center justify-center text-xs">68</div>
                <div className="bg-[#053772] flex items-center justify-center text-xs">79</div>
                <div className="bg-[#0a56ab] flex items-center justify-center text-xs">67</div>
                <div className="bg-[#1f85e2] flex items-center justify-center text-xs">25</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <div className="w-4 h-4 bg-[#f3faff]"></div>
                  <div className="w-4 h-4 bg-[#d6edff]"></div>
                  <div className="w-4 h-4 bg-[#a7d8ff]"></div>
                  <div className="w-4 h-4 bg-[#6ebdff]"></div>
                  <div className="w-4 h-4 bg-[#3ba2fb]"></div>
                  <div className="w-4 h-4 bg-[#1f85e2]"></div>
                  <div className="w-4 h-4 bg-[#0e67c4]"></div>
                  <div className="w-4 h-4 bg-[#0a56ab]"></div>
                  <div className="w-4 h-4 bg-[#074487]"></div>
                  <div className="w-4 h-4 bg-[#053772]"></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground ml-2 w-32">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance Analysis */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Regional Order Performance</CardTitle>
              <CardDescription>Delivery times and order volume by region</CardDescription>
            </div>
            <Select defaultValue="month">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { region: 'Northeast', orderVolume: 450, deliveryTime: 2.1, target: 2.0 },
                  { region: 'Southeast', orderVolume: 380, deliveryTime: 2.3, target: 2.0 },
                  { region: 'Midwest', orderVolume: 410, deliveryTime: 2.6, target: 2.5 },
                  { region: 'Southwest', orderVolume: 320, deliveryTime: 2.8, target: 2.5 },
                  { region: 'West Coast', orderVolume: 520, deliveryTime: 1.9, target: 2.0 },
                  { region: 'Northwest', orderVolume: 290, deliveryTime: 2.5, target: 2.5 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="region" 
                  className="text-xs" 
                  tick={{fill: 'hsl(var(--foreground))'}}
                />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'Order Volume', angle: -90, position: 'insideLeft' }}
                  className="text-xs" 
                  tick={{fill: 'hsl(var(--foreground))'}}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Delivery Time (Days)', angle: 90, position: 'insideRight' }}
                  domain={[0, 5]}
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
                <Bar yAxisId="left" dataKey="orderVolume" name="Order Volume" fill="hsl(var(--primary))" barSize={30} />
                <Line yAxisId="right" type="monotone" dataKey="deliveryTime" name="Delivery Time" stroke="#ff7300" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="target" name="Target Time" stroke="#82ca9d" strokeDasharray="5 5" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Order Trends and Forecasting */}
      <div className="mt-10 mb-6">
        <h2 className="text-2xl font-bold mb-4">Order Trends & Forecasting</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Order Trends</CardTitle>
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
                  <Line yAxisId="left" type="monotone" dataKey="thisYear" name="This Year" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="lastYear" name="Last Year" stroke="#8884d8" strokeDasharray="5 5" strokeWidth={2} />
                  <Bar yAxisId="right" dataKey="growth" name="YoY Growth" fill="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order-to-Delivery Performance</CardTitle>
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
                    formatter={(value) => [`${value} days`, 'Avg. Time']}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="time" name="Actual Time" stroke="#8884d8" fillOpacity={1} fill="url(#colorTime)" />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#ff7300" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Order Processing Flow Diagram */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Order Processing Pipeline</CardTitle>
              <CardDescription>Technical flow of orders through system components</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View Service Topology
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] py-4">
              {/* Flow Diagram - This would use a proper flow diagram library in a real implementation */}
              <div className="flex justify-between items-center">
                {/* Web/Mobile Clients */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-20 border rounded bg-blue-50 flex flex-col items-center justify-center">
                    <div className="text-xs font-medium text-center">Web / Mobile Clients</div>
                    <div className="text-[10px] text-muted-foreground mt-1">42 req/sec</div>
                  </div>
                  <div className="text-[10px] text-green-500 mt-1">98.7% uptime</div>
                </div>
                
                {/* API Gateway */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-20 border rounded bg-purple-50 flex flex-col items-center justify-center">
                    <div className="text-xs font-medium text-center">API Gateway</div>
                    <div className="text-[10px] text-muted-foreground mt-1">178ms avg</div>
                  </div>
                  <div className="text-[10px] text-green-500 mt-1">99.9% uptime</div>
                </div>
                
                {/* Order Service */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-20 border rounded bg-orange-50 flex flex-col items-center justify-center">
                    <div className="text-xs font-medium text-center">Order Service</div>
                    <div className="text-[10px] text-muted-foreground mt-1">356ms avg</div>
                  </div>
                  <div className="text-[10px] text-amber-500 mt-1">97.8% uptime</div>
                </div>
                
                {/* Payment Service */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-20 border rounded bg-green-50 flex flex-col items-center justify-center">
                    <div className="text-xs font-medium text-center">Payment Service</div>
                    <div className="text-[10px] text-muted-foreground mt-1">422ms avg</div>
                  </div>
                  <div className="text-[10px] text-green-500 mt-1">99.2% uptime</div>
                </div>
                
                {/* Inventory Service */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-20 border rounded bg-amber-50 flex flex-col items-center justify-center">
                    <div className="text-xs font-medium text-center">Inventory Service</div>
                    <div className="text-[10px] text-muted-foreground mt-1">245ms avg</div>
                  </div>
                  <div className="text-[10px] text-amber-500 mt-1">96.4% uptime</div>
                </div>
                
                {/* Fulfillment Service */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-20 border rounded bg-blue-50 flex flex-col items-center justify-center">
                    <div className="text-xs font-medium text-center">Fulfillment Service</div>
                    <div className="text-[10px] text-muted-foreground mt-1">187ms avg</div>
                  </div>
                  <div className="text-[10px] text-green-500 mt-1">99.5% uptime</div>
                </div>
              </div>
              
              {/* Connector lines would be SVG paths in a real implementation */}
              <div className="flex justify-between px-12 mt-6">
                <div className="text-xs font-medium">Queue depths:</div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">Healthy (&lt;30)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs">Warning (30-100)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs">Critical (&gt;100)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted/30 rounded-md text-sm">
            <div className="flex items-center text-amber-600 mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="font-medium">System Notifications</span>
            </div>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">⚠</span>
                <span>Inventory Service experiencing higher than normal response times (245ms vs 180ms baseline)</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">⚠</span>
                <span>Payment processing queue depth currently at 42 messages (threshold: 30)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">ℹ</span>
                <span>Scheduled maintenance for Order Service on 06/15 at 02:00 UTC (expected downtime: 15min)</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Technical Data Drill-Down */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Processing Metrics</CardTitle>
            <CardDescription>Detailed technical performance analysis</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="border-b">
              <div className="flex">
                <div className="py-2 px-4 border-r font-medium text-xs w-1/3">Metric</div>
                <div className="py-2 px-4 border-r font-medium text-xs w-1/3">Current</div>
                <div className="py-2 px-4 font-medium text-xs w-1/3">Threshold</div>
              </div>
            </div>
            <div className="divide-y">
              <div className="flex">
                <div className="py-2 px-4 border-r text-xs w-1/3">API requests/sec</div>
                <div className="py-2 px-4 border-r text-xs w-1/3 text-green-500">42.8</div>
                <div className="py-2 px-4 text-xs w-1/3 text-muted-foreground">&lt;100</div>
              </div>
              <div className="flex">
                <div className="py-2 px-4 border-r text-xs w-1/3">DB transactions/sec</div>
                <div className="py-2 px-4 border-r text-xs w-1/3 text-green-500">186.2</div>
                <div className="py-2 px-4 text-xs w-1/3 text-muted-foreground">&lt;250</div>
              </div>
              <div className="flex">
                <div className="py-2 px-4 border-r text-xs w-1/3">Order creation latency</div>
                <div className="py-2 px-4 border-r text-xs w-1/3 text-green-500">287ms</div>
                <div className="py-2 px-4 text-xs w-1/3 text-muted-foreground">&lt;500ms</div>
              </div>
              <div className="flex">
                <div className="py-2 px-4 border-r text-xs w-1/3">Payment processing time</div>
                <div className="py-2 px-4 border-r text-xs w-1/3 text-amber-500">1.24s</div>
                <div className="py-2 px-4 text-xs w-1/3 text-muted-foreground">&lt;1s</div>
              </div>
              <div className="flex">
                <div className="py-2 px-4 border-r text-xs w-1/3">Order validation errors</div>
                <div className="py-2 px-4 border-r text-xs w-1/3 text-green-500">0.8%</div>
                <div className="py-2 px-4 text-xs w-1/3 text-muted-foreground">&lt;2%</div>
              </div>
              <div className="flex">
                <div className="py-2 px-4 border-r text-xs w-1/3">Cache miss rate</div>
                <div className="py-2 px-4 border-r text-xs w-1/3 text-green-500">5.2%</div>
                <div className="py-2 px-4 text-xs w-1/3 text-muted-foreground">&lt;10%</div>
              </div>
              <div className="flex">
                <div className="py-2 px-4 border-r text-xs w-1/3">Avg queue wait time</div>
                <div className="py-2 px-4 border-r text-xs w-1/3 text-green-500">78ms</div>
                <div className="py-2 px-4 text-xs w-1/3 text-muted-foreground">&lt;200ms</div>
              </div>
              <div className="flex">
                <div className="py-2 px-4 border-r text-xs w-1/3">System CPU utilization</div>
                <div className="py-2 px-4 border-r text-xs w-1/3 text-amber-500">72%</div>
                <div className="py-2 px-4 text-xs w-1/3 text-muted-foreground">&lt;70%</div>
              </div>
            </div>
            <div className="p-3 flex justify-center">
              <Button variant="ghost" size="sm" className="text-xs">
                View all metrics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Error Analysis</CardTitle>
            <CardDescription>Distribution of error types across services</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { service: 'Order API', '4xx': 42, '5xx': 7 },
                    { service: 'Payment API', '4xx': 28, '5xx': 5 },
                    { service: 'Inventory API', '4xx': 18, '5xx': 12 },
                    { service: 'Shipping API', '4xx': 15, '5xx': 3 },
                    { service: 'Customer API', '4xx': 10, '5xx': 1 },
                  ]}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
                    type="category"
                    dataKey="service" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="4xx" name="Client Errors" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="5xx" name="Server Errors" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="border rounded-md mt-4">
              <div className="flex items-center p-2 border-b bg-muted/20">
                <div className="font-medium text-xs">Top Error Types (Last 24 hours)</div>
              </div>
              <div className="p-2 space-y-2">
                <div className="flex justify-between">
                  <div className="text-xs flex items-center">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Payment Validation Failure
                  </div>
                  <div className="text-xs font-medium">38%</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xs flex items-center">
                    <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
                    Inventory Not Available
                  </div>
                  <div className="text-xs font-medium">24%</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xs flex items-center">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Shipping Address Invalid
                  </div>
                  <div className="text-xs font-medium">18%</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xs flex items-center">
                    <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    API Timeout
                  </div>
                  <div className="text-xs font-medium">12%</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xs flex items-center">
                    <span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                    Other
                  </div>
                  <div className="text-xs font-medium">8%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}