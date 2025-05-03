import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangleIcon,
  AlertCircleIcon,
  ClockIcon,
  RouteIcon,
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  RefreshCwIcon,
  XCircleIcon,
  SearchIcon,
  FilterIcon,
  TrendingUpIcon,
  CloudIcon,
  ClipboardIcon,
  PieChartIcon
} from "lucide-react";
import { Shipment } from "@shared/schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { shipmentService } from "@/services/shipmentService";

interface ShipmentExceptionHandlerProps {
  shipments: Shipment[];
  onResolveException?: (shipmentId: number, resolution: string) => void;
  onRefresh?: () => void;
}

type ExceptionType = 'delay' | 'damage' | 'route-deviation' | 'weather' | 'mechanical' | 'administrative';

interface ShipmentException {
  id: number;
  shipmentId: number;
  trackingNumber: string;
  type: ExceptionType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in-progress' | 'resolved' | 'monitoring';
  description: string;
  created: Date;
  estimatedResolutionTime?: number; // in hours
  assignedTo?: string;
  impact?: string;
  correctionAction?: string;
}

export function ShipmentExceptionHandler({ shipments, onResolveException, onRefresh }: ShipmentExceptionHandlerProps) {
  const [exceptions, setExceptions] = useState<ShipmentException[]>([]);
  const [filteredExceptions, setFilteredExceptions] = useState<ShipmentException[]>([]);
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [exceptionMetrics, setExceptionMetrics] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    critical: 0,
    avgResolutionTime: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [exceptionsData, setExceptionsData] = useState<any>(null);
  
  // Colors for severity
  const severityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };
  
  // Colors for pie chart
  const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0', '#607D8B'];
  
  useEffect(() => {
    loadExceptionData();
  }, [shipments]);
  
  useEffect(() => {
    if (exceptionsData) {
      generateExceptions();
    }
  }, [exceptionsData, shipments]);
  
  useEffect(() => {
    applyFilters();
  }, [exceptions, activeTab, searchQuery, typeFilter, severityFilter]);
  
  const loadExceptionData = async () => {
    try {
      setIsLoading(true);
      const data = await shipmentService.getExceptionsData();
      setExceptionsData(data);
    } catch (error) {
      console.error('Error loading exception data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateExceptions = () => {
    if (!exceptionsData) return;
    
    // Create exceptions based on shipments data and exceptions reference data
    const exceptionTypes: ExceptionType[] = ['delay', 'damage', 'route-deviation', 'weather', 'mechanical', 'administrative'];
    const severityLevels = ['low', 'medium', 'high', 'critical'];
    const statuses = ['new', 'in-progress', 'resolved', 'monitoring'];
    
    // Generate 1-3 random exceptions for some shipments
    const generatedExceptions: ShipmentException[] = [];
    let exceptionId = 1;
    
    shipments.forEach(shipment => {
      // About 30% of shipments have exceptions
      const hasException = Math.random() < 0.3;
      
      if (hasException) {
        const numExceptions = Math.floor(Math.random() * 3) + 1; // 1-3 exceptions
        
        for (let i = 0; i < numExceptions; i++) {
          const type = exceptionTypes[Math.floor(Math.random() * exceptionTypes.length)];
          const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
          
          // Make status more likely to be 'resolved' for older shipments
          let status;
          if (shipment.status === 'delivered') {
            status = Math.random() < 0.8 ? 'resolved' : 'monitoring';
          } else {
            status = statuses[Math.floor(Math.random() * (statuses.length - 1))]; // Exclude resolved for active shipments more often
          }
          
          // Get description from exception data
          const descriptions = exceptionsData.exceptionTypes[type];
          const description = descriptions[Math.floor(Math.random() * descriptions.length)];
          
          // Get impact description based on severity
          const impacts = exceptionsData.impactDescriptions[severity as keyof typeof exceptionsData.impactDescriptions];
          const impact = impacts[Math.floor(Math.random() * impacts.length)];
          
          // Get correction action based on type
          const corrections = exceptionsData.correctionActions[type];
          const correctionAction = corrections[Math.floor(Math.random() * corrections.length)];
          
          // Get random agent
          const agents = exceptionsData.agents;
          const assignedTo = agents[Math.floor(Math.random() * agents.length)];
          
          generatedExceptions.push({
            id: exceptionId++,
            shipmentId: shipment.id,
            trackingNumber: shipment.trackingNumber,
            type,
            severity: severity as 'low' | 'medium' | 'high' | 'critical',
            status: status as 'new' | 'in-progress' | 'resolved' | 'monitoring',
            description,
            created: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000), // 0-10 days ago
            estimatedResolutionTime: Math.floor(Math.random() * 48) + 1, // 1-48 hours
            assignedTo,
            impact,
            correctionAction
          });
        }
      }
    });
    
    setExceptions(generatedExceptions);
    
    // Set metrics - either use metrics from data or calculate
    if (exceptionsData.metrics) {
      setExceptionMetrics(exceptionsData.metrics);
    } else {
      // Calculate metrics
      const resolved = generatedExceptions.filter(ex => ex.status === 'resolved').length;
      const active = generatedExceptions.length - resolved;
      const critical = generatedExceptions.filter(ex => ex.severity === 'critical').length;
      
      setExceptionMetrics({
        total: generatedExceptions.length,
        active,
        resolved,
        critical,
        avgResolutionTime: Math.round(generatedExceptions.reduce((sum, ex) => sum + (ex.estimatedResolutionTime || 0), 0) / generatedExceptions.length)
      });
    }
  };
  
  const applyFilters = () => {
    let filtered = [...exceptions];
    
    // Filter by tab (status)
    if (activeTab === "active") {
      filtered = filtered.filter(ex => ex.status !== 'resolved');
    } else if (activeTab === "resolved") {
      filtered = filtered.filter(ex => ex.status === 'resolved');
    } else if (activeTab === "critical") {
      filtered = filtered.filter(ex => ex.severity === 'critical');
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ex => 
        ex.trackingNumber.toLowerCase().includes(query) ||
        ex.description.toLowerCase().includes(query) ||
        ex.type.toLowerCase().includes(query)
      );
    }
    
    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(ex => ex.type === typeFilter);
    }
    
    // Filter by severity
    if (severityFilter !== "all") {
      filtered = filtered.filter(ex => ex.severity === severityFilter);
    }
    
    setFilteredExceptions(filtered);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      generateExceptions();
      setIsLoading(false);
      if (onRefresh) onRefresh();
    }, 1000);
  };
  
  const handleResolveException = (exceptionId: number) => {
    // Update local state
    const updatedExceptions = exceptions.map(ex => {
      if (ex.id === exceptionId) {
        return { ...ex, status: 'resolved' as const };
      }
      return ex;
    });
    
    setExceptions(updatedExceptions);
    
    // Call external handler if provided
    const exception = exceptions.find(ex => ex.id === exceptionId);
    if (exception && onResolveException) {
      onResolveException(exception.shipmentId, exception.correctionAction || "Issue resolved");
    }
  };
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };
  
  const getExceptionIcon = (type: ExceptionType) => {
    switch (type) {
      case 'delay':
        return <ClockIcon className="h-4 w-4 text-amber-500" />;
      case 'damage':
        return <PackageIcon className="h-4 w-4 text-red-500" />;
      case 'route-deviation':
        return <RouteIcon className="h-4 w-4 text-purple-500" />;
      case 'weather':
        return <CloudIcon className="h-4 w-4 text-blue-500" />;
      case 'mechanical':
        return <TruckIcon className="h-4 w-4 text-orange-500" />;
      case 'administrative':
        return <ClipboardIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangleIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getExceptionTypeData = () => {
    const typeCount: Record<string, number> = {};
    
    exceptions.forEach(exception => {
      typeCount[exception.type] = (typeCount[exception.type] || 0) + 1;
    });
    
    return Object.entries(typeCount).map(([type, count]) => ({
      name: type,
      value: count
    }));
  };
  
  const getExceptionSeverityData = () => {
    const severityCount: Record<string, number> = {};
    
    exceptions.forEach(exception => {
      severityCount[exception.severity] = (severityCount[exception.severity] || 0) + 1;
    });
    
    return Object.entries(severityCount).map(([severity, count]) => ({
      name: severity,
      value: count
    }));
  };
  
  return (
    <div className="overflow-hidden">
      <div className="p-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-md p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Total Exceptions</div>
            <div className="text-2xl font-bold">{exceptionMetrics.total}</div>
            <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
              <div className="h-full bg-blue-500" style={{ width: '100%' }} />
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Active Exceptions</div>
            <div className="text-2xl font-bold text-amber-500">{exceptionMetrics.active}</div>
            <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
              <div className="h-full bg-amber-500" style={{ width: `${(exceptionMetrics.active / exceptionMetrics.total) * 100}%` }} />
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Critical Issues</div>
            <div className="text-2xl font-bold text-red-500">{exceptionMetrics.critical}</div>
            <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
              <div className="h-full bg-red-500" style={{ width: `${(exceptionMetrics.critical / exceptionMetrics.total) * 100}%` }} />
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Resolution Time</div>
            <div className="text-2xl font-bold">{exceptionMetrics.avgResolutionTime} hrs</div>
            <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
              <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (exceptionMetrics.avgResolutionTime / 24) * 100)}%` }} />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search exceptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <span className="flex items-center">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      {typeFilter === 'all' ? 'All types' : typeFilter}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="delay">Delay</SelectItem>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="route-deviation">Route Deviation</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40">
                    <span className="flex items-center">
                      <AlertTriangleIcon className="h-4 w-4 mr-2" />
                      {severityFilter === 'all' ? 'All severity' : severityFilter}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severity</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active" className="flex items-center">
                  <AlertCircleIcon className="h-4 w-4 mr-2" />
                  Active
                </TabsTrigger>
                <TabsTrigger value="critical" className="flex items-center">
                  <AlertTriangleIcon className="h-4 w-4 mr-2" />
                  Critical
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Resolved
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="pt-4">
                {filteredExceptions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Severity</TableHead>
                          <TableHead className="w-32">Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Tracking #</TableHead>
                          <TableHead className="w-32">Created</TableHead>
                          <TableHead className="w-32">Status</TableHead>
                          <TableHead className="w-24 text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExceptions.map((exception) => (
                          <TableRow key={exception.id}>
                            <TableCell>
                              <Badge variant="outline" className={severityColors[exception.severity]}>
                                {exception.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getExceptionIcon(exception.type)}
                                <span className="ml-2 capitalize">{exception.type}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{exception.description}</TableCell>
                            <TableCell>{exception.trackingNumber}</TableCell>
                            <TableCell>{formatDate(exception.created)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={exception.status === 'new' ? 'default' : 
                                        exception.status === 'in-progress' ? 'secondary' : 
                                        exception.status === 'resolved' ? 'outline' : 'default'}
                                className={exception.status === 'resolved' ? 'bg-green-500' : ''}
                              >
                                {exception.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleResolveException(exception.id)}
                              >
                                <CheckCircleIcon className="h-4 w-4 mr-2" />
                                Resolve
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <AlertCircleIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No active exceptions found</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="critical" className="pt-4">
                {filteredExceptions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-32">Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Impact</TableHead>
                          <TableHead className="w-32">Status</TableHead>
                          <TableHead className="w-32">Assigned to</TableHead>
                          <TableHead className="w-24 text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExceptions.map((exception) => (
                          <TableRow key={exception.id}>
                            <TableCell>
                              <div className="flex items-center">
                                {getExceptionIcon(exception.type)}
                                <span className="ml-2 capitalize">{exception.type}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{exception.description}</TableCell>
                            <TableCell className="text-red-500">{exception.impact}</TableCell>
                            <TableCell>
                              <Badge variant="default">
                                {exception.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{exception.assignedTo}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleResolveException(exception.id)}
                              >
                                <CheckCircleIcon className="h-4 w-4 mr-2" />
                                Resolve
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <AlertTriangleIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No critical exceptions found</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="resolved" className="pt-4">
                {filteredExceptions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-32">Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Resolution</TableHead>
                          <TableHead className="w-32">Tracking #</TableHead>
                          <TableHead className="w-32">Resolved</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExceptions.map((exception) => (
                          <TableRow key={exception.id}>
                            <TableCell>
                              <div className="flex items-center">
                                {getExceptionIcon(exception.type)}
                                <span className="ml-2 capitalize">{exception.type}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{exception.description}</TableCell>
                            <TableCell className="text-green-500">{exception.correctionAction}</TableCell>
                            <TableCell>{exception.trackingNumber}</TableCell>
                            <TableCell>{formatDate(exception.created)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <CheckCircleIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No resolved exceptions found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-full md:w-1/3 space-y-4">
            <div className="border rounded-md p-4">
              <div className="text-sm font-medium mb-3">Exception Types</div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getExceptionTypeData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {getExceptionTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="text-sm font-medium mb-3">Severity Distribution</div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getExceptionSeverityData()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2196F3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="text-sm font-medium mb-3">Exception Handling Tips</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <AlertTriangleIcon className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                  <span>Critical issues require immediate attention and escalation</span>
                </li>
                <li className="flex items-start">
                  <ClockIcon className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                  <span>Resolve delay issues by providing customers with updated ETAs</span>
                </li>
                <li className="flex items-start">
                  <PackageIcon className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                  <span>Document all damage evidence before processing claims</span>
                </li>
                <li className="flex items-start">
                  <RouteIcon className="h-4 w-4 mr-2 text-purple-500 mt-0.5" />
                  <span>Route deviations may require updating associated shipments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 