import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowUpDown,
  AlertTriangle,
  Search,
  RefreshCw,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  CreditCard,
  Package,
  User,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

// Define AnomalyData interface
export interface AnomalyData {
  id: string;
  description: string;
  type: 'order' | 'inventory' | 'shipping' | 'payment' | 'customer';
  detectedAt: string;
  severity: number;
  impact: number;
  affectedOrders: number;
  status: 'new' | 'investigating' | 'mitigating' | 'resolved';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

// Sample data for Active Anomalies
export const anomalyData: AnomalyData[] = [
  {
    id: 'ANM-001',
    description: 'Unusual spike in order cancellations',
    type: 'order',
    detectedAt: '2023-08-15 09:32 AM',
    severity: 8.5,
    impact: 7.9,
    affectedOrders: 125,
    status: 'investigating',
    priority: 'high'
  },
  {
    id: 'ANM-002',
    description: 'Payment processing delay with gateway',
    type: 'payment',
    detectedAt: '2023-08-15 10:45 AM',
    severity: 9.2,
    impact: 8.7,
    affectedOrders: 312,
    status: 'mitigating',
    priority: 'critical'
  },
  {
    id: 'ANM-003',
    description: 'Inventory sync discrepancy in Midwest warehouse',
    type: 'inventory',
    detectedAt: '2023-08-14 03:15 PM',
    severity: 7.3,
    impact: 5.8,
    affectedOrders: 84,
    status: 'investigating',
    priority: 'medium'
  },
  {
    id: 'ANM-004',
    description: 'Carrier API connection timeout',
    type: 'shipping',
    detectedAt: '2023-08-15 08:05 AM',
    severity: 9.5,
    impact: 8.9,
    affectedOrders: 247,
    status: 'mitigating',
    priority: 'critical'
  },
  {
    id: 'ANM-005',
    description: 'Customer login failure rate increase',
    type: 'customer',
    detectedAt: '2023-08-14 11:22 AM',
    severity: 6.8,
    impact: 4.2,
    affectedOrders: 163,
    status: 'resolved',
    priority: 'medium'
  },
  {
    id: 'ANM-006',
    description: 'Shipping label generation errors',
    type: 'shipping',
    detectedAt: '2023-08-15 01:37 PM',
    severity: 7.9,
    impact: 6.5,
    affectedOrders: 78,
    status: 'new',
    priority: 'high'
  },
  {
    id: 'ANM-007',
    description: 'Unusual patterns in order values',
    type: 'order',
    detectedAt: '2023-08-14 04:50 PM',
    severity: 5.4,
    impact: 3.7,
    affectedOrders: 52,
    status: 'investigating',
    priority: 'low'
  }
];

// Get type icon based on anomaly type
const getTypeIcon = (type: AnomalyData['type']) => {
  switch (type) {
    case 'order':
      return <Package className="h-4 w-4 mr-1" />;
    case 'inventory':
      return <Package className="h-4 w-4 mr-1" />;
    case 'shipping':
      return <Truck className="h-4 w-4 mr-1" />;
    case 'payment':
      return <CreditCard className="h-4 w-4 mr-1" />;
    case 'customer':
      return <User className="h-4 w-4 mr-1" />;
    default:
      return <AlertCircle className="h-4 w-4 mr-1" />;
  }
};

// Get status icon based on anomaly status
const getStatusIcon = (status: AnomalyData['status']) => {
  switch (status) {
    case 'new':
      return <AlertCircle className="h-4 w-4 mr-1" />;
    case 'investigating':
      return <Search className="h-4 w-4 mr-1" />;
    case 'mitigating':
      return <AlertTriangle className="h-4 w-4 mr-1" />;
    case 'resolved':
      return <CheckCircle className="h-4 w-4 mr-1" />;
    default:
      return <AlertCircle className="h-4 w-4 mr-1" />;
  }
};

// AnomalyMetrics component for showing summary metrics at the top
export function AnomalyMetrics() {
  const totalAnomalies = anomalyData.length;
  const criticalCount = anomalyData.filter(a => a.priority === 'critical').length;
  const newAnomalies = anomalyData.filter(a => a.status === 'new').length;
  const investigating = anomalyData.filter(a => a.status === 'investigating').length;
  const mitigating = anomalyData.filter(a => a.status === 'mitigating').length;
  const resolved = anomalyData.filter(a => a.status === 'resolved').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-background shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Active Anomalies</span>
          </div>
          <div className="mt-1 text-xl font-bold">{totalAnomalies}</div>
          <div className="text-xs text-muted-foreground">{criticalCount} critical severity</div>
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
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Resolution Rate</span>
          </div>
          <div className="mt-1 text-xl font-bold">{Math.round((resolved / totalAnomalies) * 100)}%</div>
          <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
              New: {newAnomalies}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
              Investigating: {investigating}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
              Mitigating: {mitigating}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              Resolved: {resolved}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Active Anomalies Table component
export function ActiveAnomaliesTable() {
  // State management for anomalies
  const [anomalyItems, setAnomalyItems] = useState<AnomalyData[]>(anomalyData);
  const [filteredAnomalies, setFilteredAnomalies] = useState<AnomalyData[]>(anomalyData);
  const [anomalySearchTerm, setAnomalySearchTerm] = useState("");
  const [anomalyStatusFilter, setAnomalyStatusFilter] = useState("all");
  const [anomalyTypeFilter, setAnomalyTypeFilter] = useState("all");
  const [anomalyCurrentPage, setAnomalyCurrentPage] = useState(1);
  const [anomalyPageSize, setAnomalyPageSize] = useState(5);
  const [anomalySortField, setAnomalySortField] = useState<keyof AnomalyData>("severity");
  const [anomalySortDirection, setAnomalySortDirection] = useState<"asc" | "desc">("desc");

  // Filter anomalies based on search term, status, and type
  useEffect(() => {
    const filtered = anomalyItems.filter(item => {
      // Apply search filter
      const matchesSearch = anomalySearchTerm === "" || 
        item.description.toLowerCase().includes(anomalySearchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(anomalySearchTerm.toLowerCase());
      
      // Apply status filter
      const matchesStatus = anomalyStatusFilter === "all" || item.status === anomalyStatusFilter;
      
      // Apply type filter
      const matchesType = anomalyTypeFilter === "all" || item.type === anomalyTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    // Apply sorting
    const sortedData = [...filtered].sort((a, b) => {
      const aValue = a[anomalySortField];
      const bValue = b[anomalySortField];
      
      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return anomalySortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return anomalySortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setFilteredAnomalies(sortedData);
  }, [anomalyItems, anomalySearchTerm, anomalyStatusFilter, anomalyTypeFilter, anomalySortField, anomalySortDirection]);

  // Handle anomaly page change for pagination
  const handleAnomalyPageChange = (page: number) => {
    setAnomalyCurrentPage(page);
  };
  
  // Handle anomaly page size change
  const handleAnomalyPageSizeChange = (size: number) => {
    setAnomalyPageSize(size);
    setAnomalyCurrentPage(1);
  };
  
  // Handle anomaly sort
  const handleAnomalySort = (field: keyof AnomalyData) => {
    if (anomalySortField === field) {
      setAnomalySortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setAnomalySortField(field);
      setAnomalySortDirection(field === 'severity' || field === 'impact' ? 'desc' : 'asc');
    }
  };
  
  // Calculate pagination values
  const paginatedAnomalyData = filteredAnomalies.slice(
    (anomalyCurrentPage - 1) * anomalyPageSize, 
    anomalyCurrentPage * anomalyPageSize
  );
  const totalAnomalyPages = Math.ceil(filteredAnomalies.length / anomalyPageSize);

  // Count anomalies by priority
  const criticalCount = filteredAnomalies.filter(a => a.priority === 'critical').length;
  const highCount = filteredAnomalies.filter(a => a.priority === 'high').length;
  
  // Define a CSS class for table cells to ensure consistent height
  const tableCellClass = "py-3 px-4 text-sm leading-tight";

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Active Anomalies</CardTitle>
        <CardDescription>Current anomalies requiring attention</CardDescription>
      
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <div className="relative w-full md:w-auto flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search anomalies..."
              value={anomalySearchTerm}
              onChange={(e) => setAnomalySearchTerm(e.target.value)}
              className="pl-8 w-full h-9"
            />
          </div>
          
          <Select defaultValue={anomalyStatusFilter} onValueChange={setAnomalyStatusFilter}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="mitigating">Mitigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={anomalyTypeFilter} onValueChange={setAnomalyTypeFilter}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
            <Select
              value={anomalyPageSize.toString()}
              onValueChange={(size) => handleAnomalyPageSizeChange(Number(size))}
            >
              <SelectTrigger className="h-9 w-[70px]">
                <SelectValue placeholder={anomalyPageSize.toString()} />
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
          
          <Button variant="outline" className="h-9 ml-auto" onClick={() => setAnomalyItems(anomalyData)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredAnomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-6">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">No anomalies found</h3>
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
                      className={tableCellClass + " font-medium cursor-pointer"}
                      onClick={() => handleAnomalySort('id')}
                    >
                      <div className="inline-flex items-center">
                        ID
                        {anomalySortField === 'id' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className={tableCellClass + " font-medium cursor-pointer"}
                      onClick={() => handleAnomalySort('description')}
                    >
                      <div className="inline-flex items-center">
                        Description
                        {anomalySortField === 'description' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className={tableCellClass + " font-medium cursor-pointer"}
                      onClick={() => handleAnomalySort('type')}
                    >
                      <div className="inline-flex items-center">
                        Type
                        {anomalySortField === 'type' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className={tableCellClass + " font-medium cursor-pointer"}
                      onClick={() => handleAnomalySort('detectedAt')}
                    >
                      <div className="inline-flex items-center">
                        Detected
                        {anomalySortField === 'detectedAt' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className={tableCellClass + " font-medium cursor-pointer"}
                      onClick={() => handleAnomalySort('severity')}
                    >
                      <div className="inline-flex items-center">
                        Severity
                        {anomalySortField === 'severity' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className={tableCellClass + " font-medium cursor-pointer"}
                      onClick={() => handleAnomalySort('impact')}
                    >
                      <div className="inline-flex items-center">
                        Impact
                        {anomalySortField === 'impact' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className={tableCellClass + " font-medium cursor-pointer"}
                      onClick={() => handleAnomalySort('affectedOrders')}
                    >
                      <div className="inline-flex items-center">
                        Affected Orders
                        {anomalySortField === 'affectedOrders' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className={tableCellClass + " font-medium cursor-pointer"}
                      onClick={() => handleAnomalySort('priority')}
                    >
                      <div className="inline-flex items-center">
                        Priority
                        {anomalySortField === 'priority' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className={tableCellClass + " font-medium cursor-pointer"}
                      onClick={() => handleAnomalySort('status')}
                    >
                      <div className="inline-flex items-center">
                        Status
                        {anomalySortField === 'status' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className={tableCellClass + " text-right font-medium"}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedAnomalyData.map((item) => {
                    const priorityBadgeColor = 
                      item.priority === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      item.priority === 'high' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      item.priority === 'medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-green-500/10 text-green-500 border-green-500/20';
                    
                    const statusBadgeColor = 
                      item.status === 'new' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      item.status === 'investigating' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      item.status === 'mitigating' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-green-500/10 text-green-500 border-green-500/20';
                    
                    return (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className={tableCellClass + " font-medium"}>
                          {item.id}
                        </td>
                        <td className={tableCellClass}>
                          {item.description}
                        </td>
                        <td className={tableCellClass}>
                          <span className="inline-flex items-center">
                            {getTypeIcon(item.type)}
                            <span className="capitalize">{item.type}</span>
                          </span>
                        </td>
                        <td className={tableCellClass}>
                          <span className="inline-flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            {item.detectedAt}
                          </span>
                        </td>
                        <td className={tableCellClass}>
                          <span className="inline-flex items-center">
                            <span className={
                              item.severity > 8.5 ? 'text-red-500' : 
                              item.severity > 7 ? 'text-amber-500' : 'text-blue-500'
                            }>
                              {item.severity.toFixed(1)}
                            </span>
                            <span className="ml-2 inline-block w-16 h-1 align-middle bg-muted rounded-full overflow-hidden">
                              <span 
                                className={`block h-full ${
                                  item.severity > 8.5 ? 'bg-red-500' : 
                                  item.severity > 7 ? 'bg-amber-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${(item.severity / 10) * 100}%` }}
                              ></span>
                            </span>
                          </span>
                        </td>
                        <td className={tableCellClass}>
                          <span className="inline-flex items-center">
                            <span className={
                              item.impact > 8.5 ? 'text-red-500' : 
                              item.impact > 7 ? 'text-amber-500' : 'text-blue-500'
                            }>
                              {item.impact.toFixed(1)}
                            </span>
                            <span className="ml-2 inline-block w-16 h-1 align-middle bg-muted rounded-full overflow-hidden">
                              <span 
                                className={`block h-full ${
                                  item.impact > 8.5 ? 'bg-red-500' : 
                                  item.impact > 7 ? 'bg-amber-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${(item.impact / 10) * 100}%` }}
                              ></span>
                            </span>
                          </span>
                        </td>
                        <td className={tableCellClass}>
                          {item.affectedOrders}
                        </td>
                        <td className={tableCellClass}>
                          <Badge className={`inline-flex h-4 py-0 text-xs ${priorityBadgeColor}`}>
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </Badge>
                        </td>
                        <td className={tableCellClass}>
                          <span className="inline-flex items-center">
                            {getStatusIcon(item.status)}
                            <Badge className={`inline-flex h-4 py-0 text-xs ml-1 ${statusBadgeColor}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </span>
                        </td>
                        <td className={tableCellClass + " text-right"}>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination with custom styling matching OrderManagement.tsx */}
            {totalAnomalyPages > 1 && (
              <div className="border-t">
                <div className="flex items-center justify-between py-4 px-6">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Showing {Math.min((anomalyCurrentPage - 1) * anomalyPageSize + 1, filteredAnomalies.length)} to {Math.min(anomalyCurrentPage * anomalyPageSize, filteredAnomalies.length)} of {filteredAnomalies.length} anomalies
                  </div>
                
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAnomalyPageChange(1)}
                        disabled={anomalyCurrentPage === 1}
                        className="h-8 w-8"
                        aria-label="First page"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAnomalyPageChange(anomalyCurrentPage - 1)}
                        disabled={anomalyCurrentPage === 1}
                        className="h-8 w-8"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {totalAnomalyPages <= 5 ? (
                        // Show all pages if 5 or fewer
                        [...Array(totalAnomalyPages)].map((_, i) => (
                          <Button
                            key={`anomaly-page-${i+1}`}
                            variant={anomalyCurrentPage === i+1 ? "default" : "outline"}
                            size="icon"
                            onClick={() => handleAnomalyPageChange(i+1)}
                            className="h-8 w-8"
                            aria-label={`Page ${i+1}`}
                            aria-current={anomalyCurrentPage === i+1 ? "page" : undefined}
                          >
                            {i+1}
                          </Button>
                        ))
                      ) : (
                        // Show limited pages with ellipsis for better navigation
                        <>
                          <Button
                            variant={anomalyCurrentPage === 1 ? "default" : "outline"}
                            size="icon"
                            onClick={() => handleAnomalyPageChange(1)}
                            className="h-8 w-8"
                            aria-label="Page 1"
                          >
                            1
                          </Button>
                          
                          {anomalyCurrentPage > 3 && <span className="mx-1">...</span>}
                          
                          {anomalyCurrentPage > 2 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleAnomalyPageChange(anomalyCurrentPage - 1)}
                              className="h-8 w-8"
                              aria-label={`Page ${anomalyCurrentPage - 1}`}
                            >
                              {anomalyCurrentPage - 1}
                            </Button>
                          )}
                          
                          {anomalyCurrentPage !== 1 && anomalyCurrentPage !== totalAnomalyPages && (
                            <Button
                              variant="default"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Page ${anomalyCurrentPage}`}
                              aria-current="page"
                            >
                              {anomalyCurrentPage}
                            </Button>
                          )}
                          
                          {anomalyCurrentPage < totalAnomalyPages - 1 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleAnomalyPageChange(anomalyCurrentPage + 1)}
                              className="h-8 w-8"
                              aria-label={`Page ${anomalyCurrentPage + 1}`}
                            >
                              {anomalyCurrentPage + 1}
                            </Button>
                          )}
                          
                          {anomalyCurrentPage < totalAnomalyPages - 2 && <span className="mx-1">...</span>}
                          
                          <Button
                            variant={anomalyCurrentPage === totalAnomalyPages ? "default" : "outline"}
                            size="icon"
                            onClick={() => handleAnomalyPageChange(totalAnomalyPages)}
                            className="h-8 w-8"
                            aria-label={`Page ${totalAnomalyPages}`}
                          >
                            {totalAnomalyPages}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAnomalyPageChange(anomalyCurrentPage + 1)}
                        disabled={anomalyCurrentPage === totalAnomalyPages}
                        className="h-8 w-8"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAnomalyPageChange(totalAnomalyPages)}
                        disabled={anomalyCurrentPage === totalAnomalyPages}
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
  );
}

// Main component that combines the metrics and table
export function AnomalyDetection() {
  return (
    <>
      <ActiveAnomaliesTable />
    </>
  );
}

export default AnomalyDetection; 