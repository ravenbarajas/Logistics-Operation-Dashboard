import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Activity,
  BarChartBig,
  Truck,
  Gauge,
  Clock,
  ShoppingBag,
  TrendingUp,
  Package,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Scale,
  Filter,
  ChevronDown,
  MapPin,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell } from "recharts";

interface PerformanceMetric {
  name: string;
  score: number;
  status: 'good' | 'warning' | 'critical';
  lastChecked: Date;
  nextCheck?: Date;
}

interface OrderIssue {
  orderId: string;
  orderName: string;
  issue: string;
  detectedDate: Date;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  estimatedImpact: number;
  description: string;
}

interface OrderAlert {
  code: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

interface OrderPerformanceMonitorProps {
  orders: {
    id: string;
    name: string;
    type: string;
    status: string;
    performanceScore: number;
  }[];
  selectedOrderId?: string;
  onSelectOrder?: (orderId: string) => void;
}

const COLORS = ['#16a34a', '#eab308', '#dc2626', '#3b82f6', '#8b5cf6'];
const PERFORMANCE_SCORE_COLORS = {
  good: 'text-green-500',
  warning: 'text-amber-500',
  critical: 'text-red-500'
};

export function OrderPerformanceMonitor({ 
  orders, 
  selectedOrderId, 
  onSelectOrder 
}: OrderPerformanceMonitorProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(selectedOrderId || (orders.length > 0 ? orders[0].id : ''));
  const [metricFilter, setMetricFilter] = useState<string>("all");

  // Get the selected order object
  const selectedOrderObj = orders.find(order => order.id === selectedOrder) || orders[0];

  // Generate order-specific performance metrics
  const getOrderMetrics = (orderId: string): PerformanceMetric[] => {
    // Base metrics with standard patterns
    const baseMetrics: PerformanceMetric[] = [
      { name: 'Processing Time', score: 92, status: 'good', lastChecked: new Date('2024-03-15') },
      { name: 'Payment Efficiency', score: 88, status: 'good', lastChecked: new Date('2024-03-10') },
      { name: 'Shipping Speed', score: 75, status: 'warning', lastChecked: new Date('2024-03-12'), nextCheck: new Date('2024-04-12') },
      { name: 'Order Accuracy', score: 95, status: 'good', lastChecked: new Date('2024-03-05') },
      { name: 'Customer Satisfaction', score: 82, status: 'good', lastChecked: new Date('2024-03-08') },
      { name: 'Return Rate', score: 90, status: 'good', lastChecked: new Date('2024-03-20') },
      { name: 'Delivery Success', score: 62, status: 'warning', lastChecked: new Date('2024-03-18'), nextCheck: new Date('2024-04-18') },
      { name: 'Error Rate', score: 45, status: 'critical', lastChecked: new Date('2024-03-01'), nextCheck: new Date('2024-04-01') }
    ];

    // Find the order to get its performance score
    const order = orders.find(o => o.id === orderId);
    if (!order) return baseMetrics;

    // Adjust metrics based on order performance score and status
    const adjustedMetrics = baseMetrics.map(metric => {
      let adjustedScore = metric.score;
      let adjustedStatus = metric.status;
      
      // Adjust based on order performance score
      if (order.performanceScore > 90) {
        // High performing orders have better metrics
        adjustedScore = Math.min(100, metric.score + 5);
      } else if (order.performanceScore < 80) {
        // Lower performing orders have worse metrics
        adjustedScore = Math.max(20, metric.score - 15);
      }
      
      // Update status based on new score
      if (adjustedScore >= 80) adjustedStatus = 'good';
      else if (adjustedScore >= 60) adjustedStatus = 'warning';
      else adjustedStatus = 'critical';
      
      // Orders that are still processing typically have issues with delivery
      if (order.status === 'processing' && 
          (metric.name === 'Delivery Success' || metric.name === 'Shipping Speed')) {
        adjustedScore = Math.max(20, adjustedScore - 25);
        adjustedStatus = 'critical';
      }
      
      // Delivered orders have better delivery scores
      if (order.status === 'delivered' && 
          (metric.name === 'Delivery Success' || metric.name === 'Shipping Speed')) {
        adjustedScore = Math.min(100, adjustedScore + 20);
        adjustedStatus = 'good';
      }
      
      return {
        ...metric,
        score: adjustedScore,
        status: adjustedStatus
      };
    });

    return adjustedMetrics;
  };

  // Get performanceMetrics based on selected order
  const performanceMetrics = getOrderMetrics(selectedOrder);

  // Generate order-specific issues
  const getOrderIssues = (orderId: string): OrderIssue[] => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return [];

    // Base issues that apply to this order
    const orderIssues: OrderIssue[] = [];
    
    // Add issues based on order status and performance
    if (order.status === 'processing') {
      orderIssues.push({
        orderId: order.id,
        orderName: order.name,
        issue: 'Processing Delay',
        detectedDate: new Date('2024-04-15'),
        confidence: 92,
        severity: 'high',
        estimatedImpact: 350,
        description: 'Order processing time exceeding SLA by 48 hours. Immediate attention required.'
      });
    }
    
    if (order.performanceScore < 80) {
      orderIssues.push({
        orderId: order.id,
        orderName: order.name,
        issue: 'Payment Verification',
        detectedDate: new Date('2024-05-05'),
        confidence: 85,
        severity: 'medium',
        estimatedImpact: 120,
        description: 'Payment verification taking longer than usual. Consider manual review to expedite.'
      });
    }
    
    if (order.status === 'shipped' && order.performanceScore < 95) {
      orderIssues.push({
        orderId: order.id,
        orderName: order.name,
        issue: 'Tracking Information Delay',
        detectedDate: new Date('2024-04-22'),
        confidence: 88,
        severity: 'medium',
        estimatedImpact: 250,
        description: 'Tracking information not updating as expected. May require carrier follow-up.'
      });
    }

    return orderIssues;
  };

  // Get order issues based on selected order
  const orderIssues = getOrderIssues(selectedOrder);

  // System-wide alerts (not specific to an order)
  const getOrderAlerts = (orderId: string): OrderAlert[] => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return [];

    // Base alerts that apply to the system
    const baseAlerts: OrderAlert[] = [
      {
        code: 'OE-420',
        description: 'Order Processing Delay Detected',
        severity: 'warning',
        timestamp: new Date('2024-03-18'),
        resolved: false
      },
      {
        code: 'OP-300',
        description: 'Multiple Payment Verification Failures',
        severity: 'critical',
        timestamp: new Date('2024-03-19'),
        resolved: false
      },
      {
        code: 'OS-171',
        description: 'Shipping Partner API Latency',
        severity: 'warning',
        timestamp: new Date('2024-03-15'),
        resolved: true
      },
      {
        code: 'OC-100',
        description: 'Customer Notification Sent',
        severity: 'info',
        timestamp: new Date('2024-03-10'),
        resolved: true
      }
    ];
    
    // Filter and customize alerts based on order
    let filteredAlerts = [...baseAlerts];
    
    // For orders with high performance score, show fewer critical alerts
    if (order.performanceScore >= 90) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.severity !== 'critical' || alert.resolved === true
      );
    }
    
    // For orders with low performance score, add more alerts
    if (order.performanceScore < 80) {
      filteredAlerts.push({
        code: 'OA-215',
        description: `Performance Issues with ${order.name}`,
        severity: 'warning',
        timestamp: new Date('2024-03-20'),
        resolved: false
      });
    }
    
    // Add specific alerts based on order status
    if (order.status === 'processing') {
      filteredAlerts.push({
        code: 'OW-112',
        description: `Workflow delay for ${order.name}`,
        severity: 'warning',
        timestamp: new Date('2024-03-22'),
        resolved: false
      });
    }
    
    if (order.status === 'shipped') {
      filteredAlerts.push({
        code: 'OD-355',
        description: `Delivery monitoring active for ${order.name}`,
        severity: 'info',
        timestamp: new Date('2024-03-21'),
        resolved: false
      });
    }
    
    return filteredAlerts;
  };

  // Get order alerts based on selected order
  const orderAlerts = getOrderAlerts(selectedOrder);

  // Generate radar chart data based on selected order's metrics
  const getPerformanceComponentData = (metrics: PerformanceMetric[], orderPerformanceScore: number) => {
    // Get base values from metrics
    const baseValues = [
      { subject: 'Processing', A: metrics.find(m => m.name === 'Processing Time')?.score || 0, fullMark: 100 },
      { subject: 'Payment', A: metrics.find(m => m.name === 'Payment Efficiency')?.score || 0, fullMark: 100 },
      { subject: 'Shipping', A: metrics.find(m => m.name === 'Shipping Speed')?.score || 0, fullMark: 100 },
      { subject: 'Accuracy', A: metrics.find(m => m.name === 'Order Accuracy')?.score || 0, fullMark: 100 },
      { subject: 'Satisfaction', A: metrics.find(m => m.name === 'Customer Satisfaction')?.score || 0, fullMark: 100 },
      { subject: 'Returns', A: metrics.find(m => m.name === 'Return Rate')?.score || 0, fullMark: 100 },
    ];

    // Calculate the average of the metrics
    const metricAverage = baseValues.reduce((sum, item) => sum + item.A, 0) / baseValues.length;
    
    // If there's a significant difference between the metric average and the overall score,
    // adjust the radar values to better align with the overall performance score
    if (Math.abs(metricAverage - orderPerformanceScore) > 5) {
      const adjustmentFactor = orderPerformanceScore / metricAverage;
      
      return baseValues.map(item => ({
        ...item,
        // Adjust each value, but keep it within reasonable bounds
        A: Math.min(100, Math.max(20, Math.round(item.A * adjustmentFactor)))
      }));
    }
    
    return baseValues;
  };

  // Get the selected order's performance score
  const selectedOrderPerformanceScore = selectedOrderObj ? selectedOrderObj.performanceScore : 0;
  
  // Get radar chart data based on selected order
  const performanceComponentData = getPerformanceComponentData(performanceMetrics, selectedOrderPerformanceScore);

  // Generate trend data that varies based on order
  const getPerformanceTrendData = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    
    // Base trend showing general decline/improvement
    const baseTrend = [
      { month: 'Oct', score: 98 },
      { month: 'Nov', score: 96 },
      { month: 'Dec', score: 94 },
      { month: 'Jan', score: 90 },
      { month: 'Feb', score: 85 },
      { month: 'Mar', score: 78 },
    ];
    
    if (!order) return baseTrend;
    
    // Adjust trend based on order performance score
    const trendDirection = order.performanceScore >= 85 ? 'improving' : 'declining';
    
    return baseTrend.map((point, index) => {
      if (trendDirection === 'improving') {
        // Trend improves over time
        return { 
          month: point.month, 
          score: Math.min(98, 70 + (index * 5)) 
        };
      } else {
        // Trend declines over time
        return { 
          month: point.month, 
          score: Math.max(65, 98 - (index * 5)) 
        };
      }
    });
  };

  // Get trend data based on selected order
  const performanceTrendData = getPerformanceTrendData(selectedOrder);

  const handleOrderChange = (orderId: string) => {
    setSelectedOrder(orderId);
    if (onSelectOrder) {
      onSelectOrder(orderId);
    }
  };

  // Get overall performance score
  const getOverallPerformanceScore = () => {
    // Instead of calculating from metrics, use the selectedOrder's performanceScore directly
    const selectedOrderData = orders.find(order => order.id === selectedOrder);
    return selectedOrderData ? selectedOrderData.performanceScore : 0;
  };

  const getPerformanceStatus = (score: number) => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'warning';
    return 'critical';
  };

  // Get filtered metrics based on the selected filter
  const getFilteredMetrics = () => {
    if (metricFilter === "all") {
      return performanceMetrics;
    } else if (metricFilter === "critical") {
      return performanceMetrics.filter(metric => metric.status === 'critical');
    } else if (metricFilter === "warning") {
      return performanceMetrics.filter(metric => metric.status === 'warning');
    } else if (metricFilter === "good") {
      return performanceMetrics.filter(metric => metric.status === 'good');
    } else if (metricFilter === "processing") {
      return performanceMetrics.filter(metric => metric.name.toLowerCase().includes('processing'));
    } else if (metricFilter === "shipping") {
      return performanceMetrics.filter(metric => metric.name.toLowerCase().includes('shipping') || metric.name.toLowerCase().includes('delivery'));
    } else {
      return performanceMetrics;
    }
  };

  const filteredMetrics = getFilteredMetrics();

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
        <div>
          <div className="flex items-center text-xl font-semibold">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Order Performance Dashboard
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedOrderObj ? `Viewing performance for ${selectedOrderObj.name}` : 'Real-time performance metrics for your orders'}
          </p>
        </div>
        
        <div className="mt-2 md:mt-0">
          <select 
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={selectedOrder}
            onChange={(e) => handleOrderChange(e.target.value)}
          >
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.name} - Performance: {order.performanceScore}%
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full p-4">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview" className="text-xs">
            Performance Overview
          </TabsTrigger>
          <TabsTrigger value="issues" className="text-xs">
            Order Issues
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs">
            System Alerts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4 space-y-4">
          {/* Performance Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-primary" />
                  Overall Performance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-full py-6">
                  <div className={`text-6xl font-bold mb-2 ${PERFORMANCE_SCORE_COLORS[getPerformanceStatus(getOverallPerformanceScore())]}`}>
                    {Math.round(getOverallPerformanceScore())}%
                  </div>
                  <Badge className={
                    getPerformanceStatus(getOverallPerformanceScore()) === 'good' ? 'bg-green-500' :
                    getPerformanceStatus(getOverallPerformanceScore()) === 'warning' ? 'bg-amber-500' :
                    'bg-red-500'
                  }>
                    {getPerformanceStatus(getOverallPerformanceScore()) === 'good' ? 'Optimal Performance' :
                     getPerformanceStatus(getOverallPerformanceScore()) === 'warning' ? 'Needs Improvement' :
                     'Critical Issues'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    Performance Trend
                  </CardTitle>
                  <CardDescription>
                    Historical performance over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={performanceTrendData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          name="Performance Score"
                          stroke="hsl(var(--primary))"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BarChartBig className="h-5 w-5 mr-2 text-primary" />
                  Performance Analysis
                </CardTitle>
                <CardDescription>
                  Performance status breakdown by order metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={performanceComponentData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name="Performance Score" 
                        dataKey="A" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Performance Score']}
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center">
                    <Scale className="h-5 w-5 mr-2 text-primary" />
                    Performance Metrics Details
                  </CardTitle>
                  <div className="flex gap-2 items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => {
                        const metricsDiv = document.querySelector('.metrics-scroll-container');
                        if (metricsDiv) {
                          console.log('Scrolling up', metricsDiv);
                          metricsDiv.scrollBy({ top: -200, behavior: 'smooth' });
                        } else {
                          console.log('Scroll container not found');
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
                        const metricsDiv = document.querySelector('.metrics-scroll-container');
                        if (metricsDiv) {
                          console.log('Scrolling down', metricsDiv);
                          metricsDiv.scrollBy({ top: 200, behavior: 'smooth' });
                        } else {
                          console.log('Scroll container not found');
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Filter className="h-4 w-4" />
                          Filter
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setMetricFilter("all")}>
                          All Metrics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMetricFilter("good")}>
                          Good Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMetricFilter("warning")}>
                          Warning Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMetricFilter("critical")}>
                          Critical Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMetricFilter("processing")}>
                          Processing Metrics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMetricFilter("shipping")}>
                          Shipping Metrics
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription>
                  {metricFilter === "all" 
                    ? "Detailed performance metrics by component" 
                    : `Filtered by: ${metricFilter.charAt(0).toUpperCase() + metricFilter.slice(1)}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div id="metrics-container" className="space-y-4 relative">
                  {filteredMetrics.length > 0 ? (
                    <div className="max-h-64 overflow-hidden pr-2 metrics-scroll-container">
                      {filteredMetrics.map((metric, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col space-y-2 pb-3 border-b border-border last:border-0 last:pb-0"
                        >
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{metric.name}</div>
                            <Badge className={
                              metric.status === 'good' ? 'bg-green-500' :
                              metric.status === 'warning' ? 'bg-amber-500' :
                              'bg-red-500'
                            }>
                              {metric.score}%
                            </Badge>
                          </div>
                          <Progress value={metric.score} className="h-2" />
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Last checked: {metric.lastChecked.toLocaleDateString()}</span>
                            {metric.nextCheck && (
                              <span>Next check: {metric.nextCheck.toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No metrics match the selected filter.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="issues" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Order Issues
                </CardTitle>
                <CardDescription>
                  Detected issues that may need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderIssues.length > 0 ? (
                    orderIssues.map((issue, index) => (
                      <Card key={index} className="border border-muted">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{issue.issue}</CardTitle>
                              <CardDescription>{issue.orderName}</CardDescription>
                            </div>
                            <Badge className={
                              issue.severity === 'low' ? 'bg-blue-500' :
                              issue.severity === 'medium' ? 'bg-amber-500' :
                              'bg-red-500'
                            }>
                              {issue.severity}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm">
                            <p className="mb-2">{issue.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Detected: {issue.detectedDate.toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Gauge className="h-3 w-3 mr-1" />
                                Confidence: {issue.confidence}%
                              </div>
                              <div className="flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Est. Impact: ${issue.estimatedImpact}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                      <CheckCircle className="h-10 w-10 mb-2" />
                      <p>No issues detected for this order</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  System Alerts
                </CardTitle>
                <CardDescription>
                  Active alerts from the order processing system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderAlerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center p-3 rounded-md ${
                        alert.resolved ? 'bg-muted/50' : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center">
                        {alert.severity === 'critical' ? (
                          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                        ) : alert.severity === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                        ) : (
                          <RefreshCw className="h-5 w-5 mr-2 text-blue-500" />
                        )}
                        <div>
                          <div className="font-medium text-sm flex items-center">
                            {alert.code}
                            {alert.resolved && (
                              <Badge variant="outline" className="ml-2 text-xs py-0 h-5">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm">{alert.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleDateString()} {alert.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'warning' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                  Order Processing Tests
                </CardTitle>
                <CardDescription>
                  Results from automated order processing tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Payment Processing</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                      Pass
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Inventory Allocation</span>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-200">
                      Warning
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Shipping Integration</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                      Pass
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Order Completion</span>
                    </div>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-200">
                      Fail
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 