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
} from "lucide-react";

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

  // Mock data - would come from API in a real app
  const performanceMetrics: PerformanceMetric[] = [
    { name: 'Processing Time', score: 92, status: 'good', lastChecked: new Date('2024-03-15') },
    { name: 'Payment Efficiency', score: 88, status: 'good', lastChecked: new Date('2024-03-10') },
    { name: 'Shipping Speed', score: 75, status: 'warning', lastChecked: new Date('2024-03-12'), nextCheck: new Date('2024-04-12') },
    { name: 'Order Accuracy', score: 95, status: 'good', lastChecked: new Date('2024-03-05') },
    { name: 'Customer Satisfaction', score: 82, status: 'good', lastChecked: new Date('2024-03-08') },
    { name: 'Return Rate', score: 90, status: 'good', lastChecked: new Date('2024-03-20') },
    { name: 'Delivery Success', score: 62, status: 'warning', lastChecked: new Date('2024-03-18'), nextCheck: new Date('2024-04-18') },
    { name: 'Error Rate', score: 45, status: 'critical', lastChecked: new Date('2024-03-01'), nextCheck: new Date('2024-04-01') }
  ];

  const orderIssues: OrderIssue[] = [
    {
      orderId: orders[0]?.id || '1',
      orderName: orders[0]?.name || 'ORD-8761',
      issue: 'Delayed Processing',
      detectedDate: new Date('2024-04-15'),
      confidence: 92,
      severity: 'high',
      estimatedImpact: 350,
      description: 'Order processing time exceeding SLA by 48 hours. Immediate attention required.'
    },
    {
      orderId: orders[0]?.id || '1',
      orderName: orders[0]?.name || 'ORD-8761',
      issue: 'Payment Verification',
      detectedDate: new Date('2024-05-05'),
      confidence: 85,
      severity: 'medium',
      estimatedImpact: 120,
      description: 'Payment verification taking longer than usual. Consider manual review to expedite.'
    },
    {
      orderId: orders[1]?.id || '2',
      orderName: orders[1]?.name || 'ORD-8760',
      issue: 'Inventory Availability',
      detectedDate: new Date('2024-04-22'),
      confidence: 88,
      severity: 'medium',
      estimatedImpact: 250,
      description: 'Inventory not allocated in expected timeframe. Check for stock issues.'
    }
  ];

  const orderAlerts: OrderAlert[] = [
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

  const performanceComponentData = [
    { subject: 'Processing', A: 92, fullMark: 100 },
    { subject: 'Payment', A: 88, fullMark: 100 },
    { subject: 'Shipping', A: 75, fullMark: 100 },
    { subject: 'Accuracy', A: 95, fullMark: 100 },
    { subject: 'Satisfaction', A: 82, fullMark: 100 },
    { subject: 'Returns', A: 62, fullMark: 100 },
  ];

  // Historical performance metrics
  const performanceTrendData = [
    { month: 'Oct', score: 98 },
    { month: 'Nov', score: 96 },
    { month: 'Dec', score: 94 },
    { month: 'Jan', score: 90 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 78 },
  ];

  const handleOrderChange = (orderId: string) => {
    setSelectedOrder(orderId);
    if (onSelectOrder) {
      onSelectOrder(orderId);
    }
  };

  // Get overall performance score
  const getOverallPerformanceScore = () => {
    return performanceMetrics.reduce((sum, metric) => sum + metric.score, 0) / performanceMetrics.length;
  };

  const getPerformanceStatus = (score: number) => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'warning';
    return 'critical';
  };

  const filteredIssues = orderIssues.filter(
    issue => issue.orderId === selectedOrder
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <CardTitle className="flex items-center text-xl">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Order Performance Dashboard
          </CardTitle>
          <CardDescription>Real-time performance metrics for your orders</CardDescription>
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="issues">Order Issues</TabsTrigger>
          <TabsTrigger value="alerts">Order Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
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
                <CardTitle className="text-base flex items-center">
                  <Scale className="h-5 w-5 mr-2 text-primary" />
                  Performance Metrics Details
                </CardTitle>
                <CardDescription>
                  Detailed performance metrics by component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-auto pr-2">
                  {performanceMetrics.map((metric, index) => (
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="issues" className="space-y-4">
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
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue, index) => (
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
        
        <TabsContent value="alerts" className="space-y-4">
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