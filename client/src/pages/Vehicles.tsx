import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, RefreshCw } from "lucide-react";
import { fleetData } from "@/data/mock-data";
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

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter vehicles based on search query and status filter
  const filteredVehicles = fleetData.vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active": return "secondary";
      case "idle": return "default";
      case "maintenance": return "warning";
      case "out-of-service": return "destructive";
      default: return "outline";
    }
  };
  
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fleet Management</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
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
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetData.summary.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">+{fleetData.summary.newVehicles} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{fleetData.summary.activeVehicles}</div>
            <p className="text-xs text-muted-foreground">{fleetData.summary.activePercentage}% of fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{fleetData.summary.inMaintenance}</div>
            <p className="text-xs text-muted-foreground">{fleetData.summary.maintenancePercentage}% of fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{fleetData.summary.outOfService}</div>
            <p className="text-xs text-muted-foreground">{fleetData.summary.outOfServicePercentage}% of fleet</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vehicle Inventory</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle ID or name..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out-of-service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Vehicle Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Location</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                  <TableCell>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vehicle.lastLocation}</TableCell>
                  <TableCell>{vehicle.lastUpdated}</TableCell>
                </TableRow>
              ))}
              {filteredVehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No vehicles found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fleetData.maintenanceSchedule.map((schedule, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{schedule.vehicleId}</TableCell>
                  <TableCell>{schedule.serviceType}</TableCell>
                  <TableCell>{schedule.scheduledDate}</TableCell>
                  <TableCell>
                    <Badge variant={schedule.status === "completed" ? "success" : 
                                     schedule.status === "scheduled" ? "secondary" : 
                                     "warning"}>
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={schedule.priority === "high" ? "destructive" : 
                                     schedule.priority === "medium" ? "warning" : 
                                     "outline"}>
                      {schedule.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}