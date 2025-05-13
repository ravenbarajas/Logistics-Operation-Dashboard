import React, { useState, useEffect } from "react";
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
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShoppingCart, Search, Clock, Activity, RefreshCw, AlertTriangle, Clipboard, 
  Truck, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronsLeft,
  ChevronsRight, Calendar as CalendarIcon, TrendingUp, ArrowUpDown
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ComposedChart, ReferenceLine, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, ZAxis, Scatter, Cell
} from 'recharts';

import { OrderPerformanceMonitor } from "@/components/orders/OrderPerformanceMonitor";
import AnomalyDetection from '@/components/orders/AnomalyDetection';
import TechnicalPerformance from '@/components/orders/TechnicalPerformanceLogs';

// Interface definition for Fulfillment Service Level Compliance
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

// Interface definition for Regional Performance Metrics
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

// Import mock data - since we're modularizing, we'll assume these are available via imports
import {
  fulfillmentComplianceData,
  regionalPerformanceData
} from "@/mockData/orders";

const OrderPerformanceTab = () => {
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
  
  // Regional Performance Table state
  const [regionalData, setRegionalData] = useState<RegionalPerformanceMetrics[]>(regionalPerformanceData);
  const [filteredRegionalData, setFilteredRegionalData] = useState<RegionalPerformanceMetrics[]>(regionalPerformanceData);
  const [regionalSearchTerm, setRegionalSearchTerm] = useState("");
  const [regionalStatusFilter, setRegionalStatusFilter] = useState("all");
  const [regionalCurrentPage, setRegionalCurrentPage] = useState(1);
  const [regionalPageSize, setRegionalPageSize] = useState(5);
  const [regionalSortField, setRegionalSortField] = useState<keyof RegionalPerformanceMetrics>("id");
  const [regionalSortDirection, setRegionalSortDirection] = useState<"asc" | "desc">("asc");

  // Effect for filtering compliance data
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

  // Effect for filtering regional data
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

  // Handlers for regional table pagination
  const handleRegionalPageChange = (page: number) => {
    setRegionalCurrentPage(page);
  };
  
  const handleRegionalPageSizeChange = (size: number) => {
    setRegionalPageSize(size);
    setRegionalCurrentPage(1);
  };
  
  // Handler for regional table sorting
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
              
              {/* Other metric cards */}
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
              {/* Order Performance Calendar Heatmap card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Order Performance Calendar Heatmap</CardTitle>
                  <CardDescription>Daily success rates and processing volumes</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  {/* Calendar heatmap visualization would go here */}
                  <div className="text-center p-10">Calendar heatmap visualization placeholder</div>
                </CardContent>
              </Card>
              
              {/* Order Process Flow Analysis card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Order Process Flow Analysis</CardTitle>
                  <CardDescription>Order status flow and completion metrics</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  {/* Process flow visualization would go here */}
                  <div className="text-center p-10">Process flow visualization placeholder</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Performance by Order Type & Performance Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
              {/* Performance by Order Type radar chart */}
              <Card className="md:col-span-5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance by Order Type</CardTitle>
                  <CardDescription>Metrics breakdown by order category</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  {/* Radar chart visualization would go here */}
                  <div className="text-center p-10">Order type radar chart placeholder</div>
                </CardContent>
              </Card>
              
              {/* Performance Distribution chart */}
              <Card className="md:col-span-7">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance Distribution</CardTitle>
                  <CardDescription>Order processing efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  {/* Performance distribution visualization would go here */}
                  <div className="text-center p-10">Performance distribution chart placeholder</div>
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
                  {/* Issue cards would go here */}
                  <div className="text-center p-5">Performance issues summary placeholder</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Fulfillment Metrics Tab */}  
          <TabsContent value="fulfillment" className="p-0">
            {/* Fulfillment metrics content */}
            <div className="text-center p-5">Fulfillment metrics content placeholder</div>
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
            {/* Regional distribution content */}
            <div className="text-center p-5">Regional distribution content placeholder</div>
          </TabsContent>

          {/* Anomalies Detection Tab */}
          <TabsContent value="anomalies" className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Anomaly metrics would go here */}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Anomaly charts would go here */}
            </div>
            <AnomalyDetection />
          </TabsContent>

          {/* Technical Performance Tab */}
          <TabsContent value="technical" className="p-0">
             {/* Technical Metrics Summary */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Technical metrics would go here */}
             </div>
             
             {/* Technical Performance Charts */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               {/* Technical performance charts would go here */}
             </div>
             
             {/* Technical Performance Metrics */}
             <Card className="mb-4">
               {/* System metrics content would go here */}
             </Card>
             
             <TechnicalPerformance />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderPerformanceTab; 