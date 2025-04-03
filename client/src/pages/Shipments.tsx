import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, Filter, Calendar, Clock, RefreshCw, MapPin, Edit, Trash, 
  ChevronDown, Package, Truck, User, FileText, ExternalLink, Clipboard, AlertCircle 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShipmentModal } from "@/components/shipments/ShipmentModal";
import { shipmentService } from "@/services/shipmentService";
import { Shipment } from "@shared/schema";
import { EnhancedTable } from "@/components/table/EnhancedTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Extended Shipment interface with additional properties that might be needed
interface ExtendedShipment extends Shipment {
  driver?: string;
  vehicle?: string;
  description?: string;
  origin?: string;
  destination?: string;
  estimatedArrival?: string;
  deliveryTime?: string;
  distance?: number;
  departureDate?: string;
}

export default function Shipments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | undefined>();
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const shipmentsData = await shipmentService.getShipments();
      setShipments(shipmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddShipment = () => {
    setSelectedShipment(undefined);
    setModalOpen(true);
  };

  const handleEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setModalOpen(true);
  };

  const handleDeleteShipment = (shipment: Shipment) => {
    setShipmentToDelete(shipment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!shipmentToDelete) return;
    
    try {
      await shipmentService.deleteShipment(shipmentToDelete.id);
      await fetchData();
      setDeleteDialogOpen(false);
      setShipmentToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete shipment');
    }
  };

  // Calculate summary data from shipments
  const totalShipments = shipments.length;
  const inTransit = shipments.filter(s => s.status === 'in-transit').length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;
  const pending = shipments.filter(s => s.status === 'pending').length;
  
  // Filter shipments based on status for different tabs
  const activeShipments = shipments.filter(s => 
    s.status === 'in-transit' || s.status === 'processing'
  );
  
  const completedShipments = shipments.filter(s => 
    s.status === 'delivered' || s.status === 'cancelled'
  );
  
  const scheduledShipments = shipments.filter(s => 
    s.status === 'pending' || s.status === 'scheduled'
  );

  // Define columns for active shipments
  const activeShipmentColumns = [
    {
      id: "trackingNumber",
      header: "Tracking #",
      accessorKey: "trackingNumber",
      enableSorting: true,
      meta: {
        className: "w-[120px]"
      }
    },
    {
      id: "shipmentInfo",
      header: "Shipment Info",
      accessorKey: "description",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div>
          <div className="font-medium flex items-center">
            <Package className="h-4 w-4 mr-2 text-primary" />
            {shipment.description || 'Shipment'}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {shipment.origin} → {shipment.destination}
          </div>
        </div>
      )
    },
    {
      id: "assignedTo",
      header: "Assigned To",
      accessorKey: "driver",
      cell: (shipment: ExtendedShipment) => (
        <div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span>{shipment.driver || 'Unassigned'}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Truck className="h-3 w-3 mr-1.5" />
            <span>{shipment.vehicle || 'No vehicle'}</span>
          </div>
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true
    },
    {
      id: "estimatedArrival",
      header: "ETA",
      accessorKey: "estimatedArrival",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{shipment.estimatedArrival || 'Unknown'}</span>
        </div>
      )
    },
    {
      id: "distance",
      header: "Distance",
      accessorKey: "distance",
      enableSorting: true,
      meta: {
        align: "center" as const
      },
      cell: (shipment: ExtendedShipment) => (
        <div className="text-center">
          {shipment.distance ? `${shipment.distance} mi` : 'N/A'}
        </div>
      )
    }
  ];

  // Define columns for completed shipments
  const completedShipmentColumns = [
    {
      id: "trackingNumber",
      header: "Tracking #",
      accessorKey: "trackingNumber",
      enableSorting: true,
      meta: {
        className: "w-[120px]"
      }
    },
    {
      id: "shipmentInfo",
      header: "Shipment Info",
      accessorKey: "description",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div>
          <div className="font-medium flex items-center">
            <Package className="h-4 w-4 mr-2 text-primary" />
            {shipment.description || 'Shipment'}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {shipment.origin} → {shipment.destination}
          </div>
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true
    },
    {
      id: "deliveryTime",
      header: "Delivery Time",
      accessorKey: "deliveryTime",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{shipment.deliveryTime || 'Unknown'}</span>
        </div>
      )
    },
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer",
      enableSorting: true
    }
  ];

  // Define columns for scheduled shipments
  const scheduledShipmentColumns = [
    {
      id: "trackingNumber",
      header: "Tracking #",
      accessorKey: "trackingNumber",
      enableSorting: true,
      meta: {
        className: "w-[120px]"
      }
    },
    {
      id: "shipmentInfo",
      header: "Shipment Info",
      accessorKey: "description",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div>
          <div className="font-medium flex items-center">
            <Package className="h-4 w-4 mr-2 text-primary" />
            {shipment.description || 'Shipment'}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {shipment.origin} → {shipment.destination}
          </div>
        </div>
      )
    },
    {
      id: "departure",
      header: "Scheduled Departure",
      accessorKey: "departureDate",
      enableSorting: true,
      cell: (shipment: ExtendedShipment) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{shipment.departureDate || 'Not scheduled'}</span>
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true
    },
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer",
      enableSorting: true
    }
  ];

  // Define actions for active shipments
  const activeShipmentActions = [
    {
      label: "View Details",
      icon: <FileText className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("View details", shipment.id)
    },
    {
      label: "Track Shipment",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("Track shipment", shipment.trackingNumber)
    },
    {
      label: "Edit Shipment",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEditShipment
    },
    {
      label: "Delete Shipment",
      icon: <Trash className="h-4 w-4" />,
      onClick: handleDeleteShipment,
      variant: "destructive" as const
    }
  ];

  // Define actions for completed shipments
  const completedShipmentActions = [
    {
      label: "View Details",
      icon: <FileText className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("View details", shipment.id)
    },
    {
      label: "Get Receipt",
      icon: <Clipboard className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("Get receipt", shipment.id)
    },
    {
      label: "Delete Record",
      icon: <Trash className="h-4 w-4" />,
      onClick: handleDeleteShipment,
      variant: "destructive" as const
    }
  ];

  // Define actions for scheduled shipments
  const scheduledShipmentActions = [
    {
      label: "View Details",
      icon: <FileText className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("View details", shipment.id)
    },
    {
      label: "Edit Shipment",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEditShipment
    },
    {
      label: "Start Shipment",
      icon: <AlertCircle className="h-4 w-4" />,
      onClick: (shipment: Shipment) => console.log("Start shipment", shipment.id)
    },
    {
      label: "Delete Shipment",
      icon: <Trash className="h-4 w-4" />,
      onClick: handleDeleteShipment,
      variant: "destructive" as const
    }
  ];

  // Status color map
  const statusColorMap = {
    "in-transit": { color: "green", label: "In Transit" },
    "processing": { color: "blue", label: "Processing" },
    "delivered": { color: "gray", label: "Delivered" },
    "cancelled": { color: "red", label: "Cancelled" },
    "pending": { color: "amber", label: "Pending" },
    "scheduled": { color: "purple", label: "Scheduled" }
  };
  
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipment Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddShipment}>
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Button>
          <Button variant="outline" onClick={fetchData}>
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
            <div className="text-2xl font-bold">{inTransit}</div>
            <p className="text-xs text-muted-foreground">
              {inTransit > 0 
                ? `${Math.round((inTransit / totalShipments) * 100)}% of total shipments` 
                : 'No active shipments'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{delivered}</div>
            <p className="text-xs text-muted-foreground">
              {delivered > 0 && 'Successfully delivered'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{pending}</div>
            <p className="text-xs text-muted-foreground">
              {pending > 0 
                ? `${Math.round((pending / totalShipments) * 100)}% of total shipments` 
                : 'No pending shipments'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShipments}</div>
            <p className="text-xs text-muted-foreground">All time</p>
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
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                Active Shipments
              </CardTitle>
              <CardDescription>Manage your current shipments in progress</CardDescription>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex gap-2 ml-auto">
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
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EnhancedTable
                data={activeShipments}
                columns={activeShipmentColumns}
                actions={activeShipmentActions}
                searchKey="trackingNumber"
                searchPlaceholder="Search by tracking number..."
                statusKey="status"
                statusMap={statusColorMap}
                emptyMessage="No active shipments found"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Shipment History
              </CardTitle>
              <CardDescription>View completed and cancelled shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedTable
                data={completedShipments}
                columns={completedShipmentColumns}
                actions={completedShipmentActions}
                searchKey="trackingNumber"
                searchPlaceholder="Search by tracking number..."
                statusKey="status"
                statusMap={statusColorMap}
                emptyMessage="No shipment history found"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Scheduled Shipments
              </CardTitle>
              <CardDescription>Upcoming shipments waiting to be processed</CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedTable
                data={scheduledShipments}
                columns={scheduledShipmentColumns}
                actions={scheduledShipmentActions}
                searchKey="trackingNumber"
                searchPlaceholder="Search by tracking number..."
                statusKey="status"
                statusMap={statusColorMap}
                emptyMessage="No scheduled shipments found"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <ShipmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        shipment={selectedShipment}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the shipment with tracking number 
              {shipmentToDelete && ` ${shipmentToDelete.trackingNumber}`}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}