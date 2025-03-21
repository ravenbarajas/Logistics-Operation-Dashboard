import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, Calendar, Clock, RefreshCw } from "lucide-react";
import { activeShipments, orders } from "@/data/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Shipments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter shipments based on search query and status filter
  const filteredShipments = activeShipments.filter(shipment => {
    const matchesSearch = 
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "in-transit": return "secondary";
      case "delivered": return "success";
      case "pending": return "default";
      case "delayed": return "destructive";
      default: return "outline";
    }
  };
  
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipment Management</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">18</div>
            <p className="text-xs text-muted-foreground">86% on-time rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">3</div>
            <p className="text-xs text-muted-foreground">-2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">2</div>
            <p className="text-xs text-muted-foreground">1.8% return rate</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="history">Shipment History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>Manage your current shipments in progress</CardDescription>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by shipment ID, origin or destination..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm mr-2">Status:</span>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Assigned Vehicle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell>{shipment.origin}</TableCell>
                      <TableCell>{shipment.destination}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(shipment.status)}>
                          {shipment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {shipment.eta}
                      </TableCell>
                      <TableCell>{shipment.vehicle}</TableCell>
                    </TableRow>
                  ))}
                  {filteredShipments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No shipments found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Delivery Timeline</CardTitle>
              <CardDescription>Upcoming deliveries for the next 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeShipments.slice(0, 5).map((shipment, index) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                        {index + 1}
                      </div>
                      {index < 4 && (
                        <div className="w-0.5 h-14 bg-muted-foreground/20 mt-1" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Card>
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{shipment.destination}</p>
                              <p className="text-sm text-muted-foreground">
                                Order #{shipment.id} • {shipment.items} items
                              </p>
                            </div>
                            <Badge variant={getStatusBadge(shipment.status)}>
                              {shipment.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              ETA: {shipment.eta}
                            </div>
                            <Button variant="outline" size="sm">Details</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Shipment History</CardTitle>
              <CardDescription>View completed shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Date Completed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">SHP-2023-0842</TableCell>
                    <TableCell>San Francisco → Los Angeles</TableCell>
                    <TableCell>Mar 15, 2023</TableCell>
                    <TableCell><Badge variant="success">Delivered</Badge></TableCell>
                    <TableCell>8h 45m</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHP-2023-0841</TableCell>
                    <TableCell>Oakland → Portland</TableCell>
                    <TableCell>Mar 14, 2023</TableCell>
                    <TableCell><Badge variant="success">Delivered</Badge></TableCell>
                    <TableCell>12h 20m</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHP-2023-0840</TableCell>
                    <TableCell>Seattle → San Francisco</TableCell>
                    <TableCell>Mar 12, 2023</TableCell>
                    <TableCell><Badge variant="warning">Delayed</Badge></TableCell>
                    <TableCell>16h 10m</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Shipments</CardTitle>
              <CardDescription>Future shipments that are planned</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">SHP-2023-0850</TableCell>
                    <TableCell>Oakland → Seattle</TableCell>
                    <TableCell>Mar 25, 2023</TableCell>
                    <TableCell><Badge variant="default">Scheduled</Badge></TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHP-2023-0851</TableCell>
                    <TableCell>San Diego → Las Vegas</TableCell>
                    <TableCell>Mar 28, 2023</TableCell>
                    <TableCell><Badge variant="default">Scheduled</Badge></TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}