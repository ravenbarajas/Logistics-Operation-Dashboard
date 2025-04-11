import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  RefreshCw,
  AlertTriangle,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

// Interface for performance log entries
export interface PerformanceLogEntry {
  id: string;
  timestamp: string;
  component: string;
  metric: string;
  value: string;
  status: 'normal' | 'warning' | 'critical';
}

// Sample data for technical performance logs
export const performanceLogData: PerformanceLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2024-04-22 10:42:18',
    component: 'Order Processor',
    metric: 'Request Latency',
    value: '132ms',
    status: 'normal'
  },
  {
    id: 'log-002',
    timestamp: '2024-04-22 10:40:55',
    component: 'Database',
    metric: 'Query Time',
    value: '215ms',
    status: 'warning'
  },
  {
    id: 'log-003',
    timestamp: '2024-04-22 10:39:12',
    component: 'Payment Gateway',
    metric: 'Response Time',
    value: '1.2s',
    status: 'critical'
  },
  {
    id: 'log-004',
    timestamp: '2024-04-22 10:38:45',
    component: 'Inventory API',
    metric: 'Availability Check',
    value: '87ms',
    status: 'normal'
  },
  {
    id: 'log-005',
    timestamp: '2024-04-22 10:37:22',
    component: 'Shipping Calculator',
    metric: 'Computation Time',
    value: '342ms',
    status: 'warning'
  },
  {
    id: 'log-006',
    timestamp: '2024-04-22 10:36:14',
    component: 'User Authentication',
    metric: 'Login Time',
    value: '122ms',
    status: 'normal'
  },
  {
    id: 'log-007',
    timestamp: '2024-04-22 10:34:55',
    component: 'Cache Service',
    metric: 'Hit Ratio',
    value: '76.4%',
    status: 'normal'
  },
  {
    id: 'log-008',
    timestamp: '2024-04-22 10:33:28',
    component: 'API Gateway',
    metric: 'Throughput',
    value: '2,457 req/min',
    status: 'warning'
  },
  {
    id: 'log-009',
    timestamp: '2024-04-22 10:31:17',
    component: 'File Storage',
    metric: 'Write Latency',
    value: '452ms',
    status: 'warning'
  },
  {
    id: 'log-010',
    timestamp: '2024-04-22 10:29:05',
    component: 'Email Service',
    metric: 'Delivery Time',
    value: '1.8s',
    status: 'critical'
  }
];

// Technical Performance Metrics component
export function TechnicalMetrics() {
  return (
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
  );
}

// Technical Performance Logs table component
export function TechnicalPerformanceLogs() {
  // State for performance logs
  const [logs, setLogs] = useState<PerformanceLogEntry[]>(performanceLogData);
  const [filteredLogs, setFilteredLogs] = useState<PerformanceLogEntry[]>(performanceLogData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [componentFilter, setComponentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState<keyof PerformanceLogEntry>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [updateFrequency, setUpdateFrequency] = useState<string>("realtime");
  
  // Filter logs based on search term, status and component
  useEffect(() => {
    const filtered = logs.filter(log => {
      // Apply search filter
      const matchesSearch = searchTerm === "" || 
        log.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.metric.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.value.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const matchesStatus = statusFilter === "all" || log.status === statusFilter;
      
      // Apply component filter
      const matchesComponent = componentFilter === "all" || 
        log.component.toLowerCase().includes(componentFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesComponent;
    });
    
    // Apply sorting
    const sortedData = [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortField === "timestamp") {
        // Custom sorting for timestamps (newest first)
        return sortDirection === 'asc' 
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      
      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setFilteredLogs(sortedData);
  }, [logs, searchTerm, statusFilter, componentFilter, sortField, sortDirection]);

  // Function to refresh logs
  const refreshLogs = () => {
    // In a real app, this would fetch fresh data
    // For now, we'll just reset to the original data
    setLogs([...performanceLogData]);
    setSearchTerm("");
    setStatusFilter("all");
    setComponentFilter("all");
  };
  
  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  
  // Handle sorting
  const handleSort = (field: keyof PerformanceLogEntry) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new sort field
    }
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  // Helper function to get status text with correct capitalization
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Calculate pagination values
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize, 
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  
  // Count logs by status
  const criticalCount = filteredLogs.filter(log => log.status === 'critical').length;
  const warningCount = filteredLogs.filter(log => log.status === 'warning').length;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Technical Performance Logs</CardTitle>
            <CardDescription>Recent system events and performance metrics</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select 
              value={updateFrequency} 
              onValueChange={setUpdateFrequency}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Update frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="1min">1 minute</SelectItem>
                <SelectItem value="5min">5 minutes</SelectItem>
                <SelectItem value="15min">15 minutes</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9" 
              onClick={refreshLogs}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <div className="relative w-full md:w-auto flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search logs..."
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
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={componentFilter} onValueChange={setComponentFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Filter by component" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Components</SelectItem>
              <SelectItem value="Order">Order Processor</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
              <SelectItem value="Payment">Payment Gateway</SelectItem>
              <SelectItem value="Inventory">Inventory API</SelectItem>
              <SelectItem value="Shipping">Shipping Calculator</SelectItem>
              <SelectItem value="API">API Gateway</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2 ml-auto">
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
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-6">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">No logs found</h3>
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
                      onClick={() => handleSort('timestamp')}
                    >
                      <div className="flex items-center">
                        Timestamp
                        {sortField === 'timestamp' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer"
                      onClick={() => handleSort('component')}
                    >
                      <div className="flex items-center">
                        Component
                        {sortField === 'component' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer"
                      onClick={() => handleSort('metric')}
                    >
                      <div className="flex items-center">
                        Metric
                        {sortField === 'metric' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer"
                      onClick={() => handleSort('value')}
                    >
                      <div className="flex items-center">
                        Value
                        {sortField === 'value' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left font-medium cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {log.component}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {log.metric}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {log.value}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge className={getStatusColor(log.status)}>
                          {getStatusText(log.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t">
                <div className="flex items-center justify-between py-4 px-6">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * pageSize + 1, filteredLogs.length)} to {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} logs
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

// System Performance Charts component
export function SystemPerformanceCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div className="space-y-4 p-2">
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
      
      <div className="space-y-4 p-2">
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
  );
}

// Main component that combines all technical performance sections
export function TechnicalPerformance() {
  return (
    <>
      {/*<TechnicalMetrics />*/}
      {/*<SystemPerformanceCharts />*/}
      <TechnicalPerformanceLogs />
    </>
  );
}

export default TechnicalPerformance; 