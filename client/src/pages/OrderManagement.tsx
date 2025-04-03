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
  Calendar as CalendarIcon
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
  Cell
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
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8 w-[200px] md:w-[260px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button onClick={() => setIsNewOrderModalOpen(true)}>New Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm">Today</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{orderList.length}</h3>
              <p className="text-muted-foreground text-sm">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-muted-foreground text-sm">Total</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">$67,523.45</h3>
              <p className="text-muted-foreground text-sm">Revenue</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-amber-500" />
              </div>
              <span className="text-muted-foreground text-sm">Active</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{orderCounts.processing}</h3>
              <p className="text-muted-foreground text-sm">Processing Orders</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-muted-foreground text-sm">In Transit</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{orderCounts.shipped}</h3>
              <p className="text-muted-foreground text-sm">Shipped Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Volume & Revenue</CardTitle>
            <CardDescription>Daily order volume and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
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
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
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
        <CardContent>
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
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
                <div>
                  <CardTitle>Order List</CardTitle>
                  <CardDescription>Manage and process customer orders</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center space-x-2">
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
            <CardContent>
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
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Processing Orders</CardTitle>
                  <CardDescription>Orders currently being prepared for shipping</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Shipped Orders</CardTitle>
                  <CardDescription>Orders in transit to customers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Delivered Orders</CardTitle>
                  <CardDescription>Successfully completed orders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Cancelled Orders</CardTitle>
                  <CardDescription>Orders that have been cancelled</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
    </div>
  );
}