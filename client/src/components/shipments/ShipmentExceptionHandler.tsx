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
    generateExceptions();
  }, [shipments]);
  
  useEffect(() => {
    applyFilters();
  }, [exceptions, activeTab, searchQuery, typeFilter, severityFilter]);
  
  const generateExceptions = () => {
    // Create mock exceptions based on shipments
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
          
          const description = generateExceptionDescription(type, severity);
          
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
            assignedTo: getRandomAgent(),
            impact: generateImpactDescription(severity as 'low' | 'medium' | 'high' | 'critical'),
            correctionAction: generateCorrectionAction(type)
          });
        }
      }
    });
    
    setExceptions(generatedExceptions);
    
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
  
  // Helper functions to generate realistic data
  const generateExceptionDescription = (type: ExceptionType, severity: string): string => {
    const descriptions = {
      'delay': [
        'Shipment delayed due to heavy traffic',
        'Loading process taking longer than expected',
        'Carrier experiencing schedule delays',
        'Customs clearance delay'
      ],
      'damage': [
        'Package shows signs of external damage',
        'Water damage detected on packaging',
        'Product damaged during handling',
        'Packaging integrity compromised'
      ],
      'route-deviation': [
        'Vehicle detected on unplanned route',
        'Significant deviation from planned route',
        'Route changed due to road closure',
        'Detour required due to construction'
      ],
      'weather': [
        'Severe weather conditions affecting delivery',
        'Snowstorm delaying transportation',
        'Flooding on primary delivery route',
        'Hurricane warning issued for destination area'
      ],
      'mechanical': [
        'Vehicle breakdown reported',
        'Engine malfunction in delivery truck',
        'Refrigeration system failure',
        'Tire replacement required'
      ],
      'administrative': [
        'Missing documentation for customs',
        'Address verification required',
        'Payment issue detected',
        'Regulatory compliance check pending'
      ]
    };
    
    const options = descriptions[type];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const generateImpactDescription = (severity: 'low' | 'medium' | 'high' | 'critical'): string => {
    const impacts = {
      'low': [
        'Minor delay expected',
        'No significant impact on delivery time',
        'Minimal financial impact'
      ],
      'medium': [
        'Expected delay of 1-2 days',
        'Moderate increased operational costs',
        'May require partial rerouting'
      ],
      'high': [
        'Significant delay of 3+ days expected',
        'Substantial financial impact',
        'Customer satisfaction likely affected'
      ],
      'critical': [
        'Delivery at serious risk',
        'Major financial and operational impact',
        'Urgent intervention required to salvage delivery'
      ]
    };
    
    const options = impacts[severity];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const generateCorrectionAction = (type: ExceptionType): string => {
    const actions = {
      'delay': [
        'Expedite shipping for remaining journey',
        'Notify customer of updated ETA',
        'Assign priority status for processing'
      ],
      'damage': [
        'Inspect cargo at next checkpoint',
        'Arrange for replacement shipment',
        'Document damage for insurance claim'
      ],
      'route-deviation': [
        'Contact driver to confirm current route',
        'Recalculate optimal path to destination',
        'Update geofence parameters'
      ],
      'weather': [
        'Identify alternative routes avoiding weather system',
        'Hold shipment until weather clears',
        'Switch to alternative transportation mode'
      ],
      'mechanical': [
        'Dispatch maintenance team',
        'Transfer cargo to replacement vehicle',
        'Schedule repair at nearest service center'
      ],
      'administrative': [
        'Contact customer for additional documentation',
        'Expedite paperwork processing',
        'Assign admin team for resolution'
      ]
    };
    
    const options = actions[type];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getRandomAgent = (): string => {
    const agents = [
      'Sara Johnson',
      'Michael Chen',
      'Robert Garcia',
      'Lisa Wong',
      'David Smith',
      'Maria Rodriguez'
    ];
    
    return agents[Math.floor(Math.random() * agents.length)];
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };
  
  // Get icon for exception type
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
        return <TruckIcon className="h-4 w-4 text-slate-500" />;
      case 'administrative':
        return <ClipboardIcon className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Generate data for charts
  const getExceptionTypeData = () => {
    const typeCounts: { [key: string]: number } = {};
    
    exceptions.forEach(ex => {
      typeCounts[ex.type] = (typeCounts[ex.type] || 0) + 1;
    });
    
    return Object.keys(typeCounts).map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
      value: typeCounts[type]
    }));
  };
  
  const getExceptionSeverityData = () => {
    return [
      { 
        name: 'Critical', 
        count: exceptions.filter(ex => ex.severity === 'critical').length 
      },
      { 
        name: 'High', 
        count: exceptions.filter(ex => ex.severity === 'high').length 
      },
      { 
        name: 'Medium', 
        count: exceptions.filter(ex => ex.severity === 'medium').length 
      },
      { 
        name: 'Low', 
        count: exceptions.filter(ex => ex.severity === 'low').length 
      }
    ];
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              <div className="flex items-center">
                <AlertTriangleIcon className="h-5 w-5 mr-2 text-amber-500" />
                Shipment Exception Management
              </div>
            </CardTitle>
            <CardDescription>
              Monitor and resolve shipment issues and exceptions
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCwIcon className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCwIcon className="h-4 w-4 mr-1" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border">
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                <AlertCircleIcon className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="text-xl font-bold">{exceptionMetrics.active}</div>
                <div className="text-sm text-muted-foreground">Active Exceptions</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
                <AlertTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="text-xl font-bold">{exceptionMetrics.critical}</div>
                <div className="text-sm text-muted-foreground">Critical Issues</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-xl font-bold">{exceptionMetrics.resolved}</div>
                <div className="text-sm text-muted-foreground">Resolved Issues</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <ClockIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-xl font-bold">{exceptionMetrics.avgResolutionTime}h</div>
                <div className="text-sm text-muted-foreground">Avg Resolution Time</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrendingUpIcon className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium">Exception Analytics</span>
              </div>
            </div>
            <div className="h-64 border rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getExceptionSeverityData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs" 
                    tick={{fill: 'hsl(var(--foreground))'}}
                  />
                  <YAxis 
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
                  <Bar dataKey="count" name="Number of Exceptions" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-purple-500" />
                <span className="font-medium">Exception Types</span>
              </div>
            </div>
            <div className="h-64 border rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getExceptionTypeData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getExceptionTypeData().map((entry, index) => (
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
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <TabsList className="mb-0">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exceptions..."
                  className="pl-8 h-9 md:w-[200px] lg:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <div className="flex items-center">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="delay">Delay</SelectItem>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="route-deviation">Route Deviation</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <div className="flex items-center">
                      <AlertCircleIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Severity" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[140px]">Tracking #</TableHead>
                  <TableHead className="w-[140px]">Type</TableHead>
                  <TableHead className="w-[100px]">Severity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[180px]">Created</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExceptions.length > 0 ? (
                  filteredExceptions.map((exception) => (
                    <TableRow key={exception.id}>
                      <TableCell className="font-medium">{exception.id}</TableCell>
                      <TableCell>{exception.trackingNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getExceptionIcon(exception.type)}
                          <span className="ml-2 capitalize">{exception.type.replace('-', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={severityColors[exception.severity]}>
                          {exception.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{exception.description}</TableCell>
                      <TableCell>{formatDate(exception.created)}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            exception.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            exception.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            exception.status === 'monitoring' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                          }
                        >
                          {exception.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {exception.status !== 'resolved' ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8"
                            onClick={() => handleResolveException(exception.id)}
                          >
                            <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                            Resolve
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <XCircleIcon className="h-8 w-8 mb-2" />
                        <p>No exceptions found</p>
                        <p className="text-sm">Try adjusting your filters or search query</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
} 