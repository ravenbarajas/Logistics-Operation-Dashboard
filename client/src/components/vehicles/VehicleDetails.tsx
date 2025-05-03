import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  Truck,
  Calendar,
  Fuel,
  Activity,
  MapPin,
  FileText,
  User,
  Route,
  Settings,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  BarChart3,
  CircleDashed
} from "lucide-react";
import { Vehicle } from "@shared/schema";
import { ExtendedVehicle } from "@/types/vehicle";
import { formatDate } from "@/components/VehicleDetailsHelper";

interface VehicleDetailsProps {
  vehicle: ExtendedVehicle;
  onClose: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

// Define the location type
interface Location {
  lat: number;
  lng: number;
}

// Extend the ExtendedVehicle type to include the additional fields
interface DetailedVehicle extends ExtendedVehicle {
  insuranceProvider?: string;
  insurancePolicy?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  routeAssignment?: string;
  dailyRate?: number;
  routingPreference?: string;
  utilizationTarget?: number;
  currentLocation: Location;
}

// Define the return type for maintenance status
interface MaintenanceStatusInfo {
  status: "overdue" | "soon" | "good";
  text: string;
  daysText: string;
}

export function VehicleDetails({ vehicle, onClose, onEdit, onDelete }: VehicleDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Cast the vehicle to our more detailed type
  const detailedVehicle = vehicle as DetailedVehicle;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "maintenance":
        return <Badge variant="secondary">In Maintenance</Badge>;
      case "inactive":
        return <Badge variant="destructive">Out of Service</Badge>;
      case "on_route":
        return <Badge className="bg-blue-500">On Route</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMaintenanceStatus = (lastMaintenance: Date | null, nextMaintenance: Date | null): MaintenanceStatusInfo | "Unknown" => {
    if (!lastMaintenance || !nextMaintenance) return "Unknown";
    
    const now = new Date();
    const daysUntil = Math.ceil((nextMaintenance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return { status: "overdue", text: "Overdue", daysText: `${Math.abs(daysUntil)} days overdue` };
    } else if (daysUntil <= 7) {
      return { status: "soon", text: "Soon", daysText: `${daysUntil} days remaining` };
    } else {
      return { status: "good", text: "Good", daysText: `${daysUntil} days remaining` };
    }
  };

  // Function to safely display location coordinates
  const formatLocation = (location: any): string => {
    if (!location) return 'Not available';
    if (typeof location !== 'object') return 'Not available';
    if (!('lat' in location) || !('lng' in location)) return 'Not available';
    if (typeof location.lat !== 'number' || typeof location.lng !== 'number') return 'Not available';
    
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">{vehicle.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {getStatusBadge(vehicle.status)}
            <span>{vehicle.make} {vehicle.model} {vehicle.year}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(vehicle)}>
            Delete
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Technical</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getStatusBadge(vehicle.status)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {formatDate(vehicle.updatedAt)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.nextMaintenance && (
                  <>
                    {(() => {
                      const maintenanceInfo = getMaintenanceStatus(vehicle.lastMaintenance, vehicle.nextMaintenance);
                      if (maintenanceInfo === "Unknown") {
                        return <div className="text-2xl font-bold">Unknown</div>;
                      }
                      
                      return (
                        <>
                          <div className="text-2xl font-bold">
                            {maintenanceInfo.status === "overdue" ? (
                              <span className="text-red-500">Overdue</span>
                            ) : maintenanceInfo.status === "soon" ? (
                              <span className="text-amber-500">Due Soon</span>
                            ) : (
                              <span className="text-green-500">Good</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {maintenanceInfo.daysText}
                          </p>
                        </>
                      );
                    })()}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Fuel className="h-4 w-4 mr-2" />
                  Fuel Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicle.fuelLevel || 0}%</div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${vehicle.fuelLevel || 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Current Coordinates:</span>
                  </div>
                  <p className="ml-6 text-sm">
                    {formatLocation(vehicle.currentLocation)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Mileage:</span>
                  </div>
                  <p className="ml-6 text-sm">
                    {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'Not available'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Make</TableCell>
                    <TableCell>{vehicle.make || 'N/A'}</TableCell>
                    <TableCell className="font-medium">Model</TableCell>
                    <TableCell>{vehicle.model || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Year</TableCell>
                    <TableCell>{vehicle.year || 'N/A'}</TableCell>
                    <TableCell className="font-medium">VIN</TableCell>
                    <TableCell>{vehicle.vinNumber || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">License Plate</TableCell>
                    <TableCell>{vehicle.licensePlate || 'N/A'}</TableCell>
                    <TableCell className="font-medium">Type</TableCell>
                    <TableCell>{vehicle.type || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mileage</TableCell>
                    <TableCell>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'N/A'}</TableCell>
                    <TableCell className="font-medium">Last Maintenance</TableCell>
                    <TableCell>{vehicle.lastMaintenance ? formatDate(vehicle.lastMaintenance) : 'N/A'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Documents & Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        Registration Expiry
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.registrationExpiry ? formatDate(vehicle.registrationExpiry) : 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        Insurance Expiry
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.insuranceExpiry ? formatDate(vehicle.insuranceExpiry) : 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        Insurance Provider
                      </div>
                    </TableCell>
                    <TableCell>{detailedVehicle.insuranceProvider || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        Insurance Policy
                      </div>
                    </TableCell>
                    <TableCell>{detailedVehicle.insurancePolicy || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        Purchase Date
                      </div>
                    </TableCell>
                    <TableCell>{detailedVehicle.purchaseDate ? formatDate(detailedVehicle.purchaseDate) : 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        Warranty Expiry
                      </div>
                    </TableCell>
                    <TableCell>{detailedVehicle.warrantyExpiry ? formatDate(detailedVehicle.warrantyExpiry) : 'N/A'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assignments & Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        Assigned Driver
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.assignedDriver || 'Unassigned'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Route className="h-4 w-4 mr-2 text-muted-foreground" />
                        Route Assignment
                      </div>
                    </TableCell>
                    <TableCell>{detailedVehicle.routeAssignment || 'Unassigned'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                        Routing Preference
                      </div>
                    </TableCell>
                    <TableCell>{detailedVehicle.routingPreference || 'Standard'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                        Utilization Target
                      </div>
                    </TableCell>
                    <TableCell>{detailedVehicle.utilizationTarget ? `${detailedVehicle.utilizationTarget}%` : 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        Daily Rate
                      </div>
                    </TableCell>
                    <TableCell>{detailedVehicle.dailyRate ? `$${detailedVehicle.dailyRate}` : 'N/A'}</TableCell>
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