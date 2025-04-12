import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
} from 'recharts';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Truck, 
  User, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  CreditCard,
  FileText,
  CheckCircle2, 
  AlertCircle,
  BarChartBig,
  CalendarDays,
  Activity,
  PieChart,
  Pencil,
  Trash2,
} from "lucide-react";

// Define order type if not imported
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

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order;
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onEditOrder?: (order: Order) => void;
}

// Mock timeline data for the order
const generateTimelineData = (orderStatus: string) => {
  const baseData = [
    { status: "Order Placed", completed: true, date: "3 days ago", duration: 0 },
    { status: "Payment Processed", completed: true, date: "3 days ago", duration: 1 },
    { status: "Processing", completed: orderStatus !== "processing", date: "2 days ago", duration: 8 },
    { status: "Shipped", completed: orderStatus === "shipped" || orderStatus === "delivered", date: "1 day ago", duration: 24 },
    { status: "Out for Delivery", completed: orderStatus === "delivered", date: "Today", duration: 4 },
    { status: "Delivered", completed: orderStatus === "delivered", date: "Today", duration: 0 },
  ];

  // If cancelled, add cancelled status
  if (orderStatus === "cancelled") {
    return [
      { status: "Order Placed", completed: true, date: "3 days ago", duration: 0 },
      { status: "Payment Processed", completed: true, date: "3 days ago", duration: 1 },
      { status: "Cancelled", completed: true, date: "2 days ago", duration: 0 },
    ];
  }

  return baseData;
};

// Generate mock delivery performance data
const generateDeliveryPerformanceData = () => [
  { name: 'Mon', expected: 24, actual: 26 },
  { name: 'Tue', expected: 24, actual: 23 },
  { name: 'Wed', expected: 24, actual: 25 },
  { name: 'Thu', expected: 24, actual: 24 },
  { name: 'Fri', expected: 24, actual: 22 },
  { name: 'Sat', expected: 48, actual: 54 },
  { name: 'Sun', expected: 72, actual: 68 },
];

// Generate mock order history data
const generateOrderHistoryData = () => [
  { month: 'Jan', orders: 4, value: 1200 },
  { month: 'Feb', orders: 3, value: 900 },
  { month: 'Mar', orders: 5, value: 1500 },
  { month: 'Apr', orders: 6, value: 1800 },
  { month: 'May', orders: 4, value: 1200 },
  { month: 'Jun', orders: 8, value: 2400 },
];

// Product distribution mock data
const generateProductDistributionData = (products: string[] = []) => {
  if (!products || products.length === 0) {
    return [
      { name: 'Product A', value: 40 },
      { name: 'Product B', value: 30 },
      { name: 'Product C', value: 20 },
      { name: 'Product D', value: 10 },
    ];
  }

  return products.map((product, index) => ({
    name: product,
    value: 100 / products.length * (index + 1) % 30 + 10
  }));
};

export function OrderDetailsModal({ 
  isOpen, 
  onClose, 
  order,
  onUpdateStatus,
  onDeleteOrder,
  onEditOrder
}: OrderDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // If no order is provided, return null
  if (!order) return null;
  
  // Format and calculate values
  const orderTotal = order.total.replace('$', '');
  const statusColor = 
    order.status === "processing" ? "blue" :
    order.status === "shipped" ? "yellow" :
    order.status === "delivered" ? "green" : "red";
  
  const statusLabel = 
    order.status === "processing" ? "Processing" :
    order.status === "shipped" ? "Shipped" :
    order.status === "delivered" ? "Delivered" : "Cancelled";
  
  const paymentColor = 
    order.payment === "completed" ? "green" :
    order.payment === "pending" ? "yellow" : "red";
  
  const paymentLabel = 
    order.payment === "completed" ? "Completed" :
    order.payment === "pending" ? "Pending" : "Failed";
  
  // Generate data for visualizations
  const timelineData = generateTimelineData(order.status);
  const deliveryPerformanceData = generateDeliveryPerformanceData();
  const orderHistoryData = generateOrderHistoryData();
  const productDistributionData = generateProductDistributionData(order.products);
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Calculate total time from order placed to expected delivery
  const calculateTotalTime = () => {
    if (!order.expectedDelivery) return "N/A";
    
    const orderDate = new Date(order.date);
    const deliveryDate = new Date(order.expectedDelivery);
    const diffTime = Math.abs(deliveryDate.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };
  
  // Add handlers for the actions
  const handleStatusUpdate = (newStatus: string) => {
    if (order && onUpdateStatus) {
      onUpdateStatus(order.id, newStatus);
      // Optionally close modal after update
      // onClose();
    }
  };
  
  const handleDelete = () => {
    if (order && onDeleteOrder) {
      if (window.confirm(`Are you sure you want to delete order ${order.id}?`)) {
        onDeleteOrder(order.id);
        onClose();
      }
    }
  };
  
  const handleEdit = () => {
    if (order && onEditOrder) {
      onEditOrder(order);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] min-w-[50vw] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
              Order Details {order.id}
            </DialogTitle>
            <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
              {statusLabel}
            </Badge>
          </div>
          <DialogDescription>
            Complete details and performance insights for this order
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Customer Information</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      <span>Customer</span>
                    </div>
                    <div className="font-medium">{order.customer}</div>
                  </div>
                  
                  {order.customerEmail && (
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <span className="ml-6">Email</span>
                      </div>
                      <div className="font-medium">{order.customerEmail}</div>
                    </div>
                  )}
                  
                  {order.address && (
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Address</span>
                      </div>
                      <div className="font-medium text-right">{order.address}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Order Summary</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Order Date</span>
                    </div>
                    <div className="font-medium">{order.date}</div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <Package className="h-4 w-4 mr-2" />
                      <span>Items</span>
                    </div>
                    <div className="font-medium">{order.items}</div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>Total</span>
                    </div>
                    <div className="font-medium">{order.total}</div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Payment</span>
                    </div>
                    <Badge className={`bg-${paymentColor}-500/10 text-${paymentColor}-500 border-${paymentColor}-500/20`}>
                      {paymentLabel}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tracking">Tracking & Shipping</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Order Timeline</h3>
                  
                  <div className="space-y-4">
                    {timelineData.map((item, index) => (
                      <div key={index} className="relative pb-8">
                        {index < timelineData.length - 1 && (
                          <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-muted"></div>
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-2 ring-white 
                              ${item.completed ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                              {item.completed ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <Clock className="h-5 w-5" />
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium">{item.status}</div>
                            <div className="text-xs text-muted-foreground">{item.date}</div>
                            {item.duration > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                ({item.duration} {item.duration === 1 ? 'hour' : 'hours'})
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Products</h3>
                  
                  {order.products && order.products.length > 0 ? (
                    <div className="space-y-2">
                      {order.products.map((product, index) => (
                        <div key={index} className="p-3 rounded-md border bg-card">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{product}</div>
                              <div className="text-xs text-muted-foreground">Qty: 1</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No product details available</div>
                  )}
                </CardContent>
              </Card>
              
              {order.notes && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Order Notes
                    </h3>
                    <div className="p-3 rounded-md border bg-muted/20">
                      {order.notes}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tracking" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <span>Shipping Method</span>
                      </div>
                      <div className="font-medium capitalize">{order.shipping}</div>
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="flex justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <span>Tracking Number</span>
                        </div>
                        <div className="font-medium">{order.trackingNumber}</div>
                      </div>
                    )}
                    
                    {order.expectedDelivery && (
                      <div className="flex justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <span>Expected Delivery</span>
                        </div>
                        <div className="font-medium">{order.expectedDelivery}</div>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <span>Estimated Time</span>
                      </div>
                      <div className="font-medium">{calculateTotalTime()}</div>
                    </div>
                  </div>
                  
                  {order.status !== "cancelled" && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Shipment Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {order.status === "processing" ? "25%" : 
                           order.status === "shipped" ? "75%" : 
                           order.status === "delivered" ? "100%" : "0%"}
                        </span>
                      </div>
                      <Progress 
                        value={order.status === "processing" ? 25 : 
                               order.status === "shipped" ? 75 : 
                               order.status === "delivered" ? 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Delivery Time Performance Chart */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Delivery Performance
                  </h3>
                  
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deliveryPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar name="Expected Delivery Time (Hours)" dataKey="expected" fill="#8884d8" />
                        <Bar name="Actual Delivery Time (Hours)" dataKey="actual" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Historical Order Data */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <BarChartBig className="h-5 w-5 mr-2" />
                    Customer Order History
                  </h3>
                  
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={orderHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Area type="monotone" name="Order Value ($)" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Product Distribution */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Product Distribution
                  </h3>
                  
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={productDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {productDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* KPI Indicators */}
              <Card className="md:col-span-2">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Order Performance Metrics
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Processing Time</span>
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">8h</div>
                      <div className="text-xs text-green-500 flex items-center mt-1">
                        <span>12% faster than average</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Order Value</span>
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">{orderTotal}</div>
                      <div className="text-xs text-green-500 flex items-center mt-1">
                        <span>18% above average</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Customer Lifetime</span>
                        <CalendarDays className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">6m</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <span>6 months active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6 space-x-2">
          {order.status === "processing" && onUpdateStatus && (
            <Button 
              variant="outline" 
              className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
              onClick={() => handleStatusUpdate("shipped")}
            >
              <Truck className="h-4 w-4 mr-2" />
              Mark as Shipped
            </Button>
          )}
          
          {(order.status === "shipped" || order.status === "processing") && onUpdateStatus && (
            <Button 
              variant="outline" 
              className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
              onClick={() => handleStatusUpdate("delivered")}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
          
          {order.status !== "cancelled" && onUpdateStatus && (
            <Button 
              variant="outline" 
              className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
              onClick={() => handleStatusUpdate("cancelled")}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          )}
          
          {onEditOrder && (
            <Button 
              variant="outline"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          
          {onDeleteOrder && (
            <Button 
              variant="outline"
              className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 