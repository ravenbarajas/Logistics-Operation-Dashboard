import { useState, useEffect } from "react";
import { Plus, Search, RefreshCw, MapPin, Clock, ArrowRight, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { RouteModal } from "@/components/routes/RouteModal";
import { routeService } from "@/services/routeService";
import { Route } from "@shared/schema";
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

// Type for location objects
interface Location {
  lat: number;
  lng: number;
}

export default function Routes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>();
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const routesData = await routeService.getRoutes();
      setRoutes(routesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter routes based on search query and status
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      route.id.toString().includes(searchQuery) ||
      (route.vehicleId?.toString() || '').includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || route.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddRoute = () => {
    setSelectedRoute(undefined);
    setModalOpen(true);
  };

  const handleEditRoute = (route: Route) => {
    setSelectedRoute(route);
    setModalOpen(true);
  };

  const handleDeleteRoute = (route: Route) => {
    setRouteToDelete(route);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!routeToDelete) return;
    
    try {
      await routeService.deleteRoute(routeToDelete.id);
      await fetchData();
      setDeleteDialogOpen(false);
      setRouteToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete route');
    }
  };

  // Calculate route statistics
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter(r => r.status === 'in-progress').length;
  const completedRoutes = routes.filter(r => r.status === 'completed').length;

  const formatDistance = (distance: string | number | null) => {
    if (distance === null) return 'N/A';
    const numDistance = typeof distance === 'string' ? parseFloat(distance) : distance;
    return `${numDistance.toFixed(1)} km`;
  };
  
  const formatDuration = (minutes: number | null) => {
    if (minutes === null) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    }
    
    return `${hours}h ${mins}m`;
  };

  // Helper function to safely display location coordinates
  const formatLocation = (location: any): string => {
    if (!location) return 'N/A';
    
    try {
      const lat = typeof location.lat === 'number' ? location.lat : parseFloat(location.lat);
      const lng = typeof location.lng === 'number' ? location.lng : parseFloat(location.lng);
      return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    } catch (e) {
      return 'Invalid location';
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Route Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddRoute}>
            <Plus className="h-4 w-4 mr-2" />
            Create Route
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoutes}</div>
            <p className="text-xs text-muted-foreground">
              All time routes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{activeRoutes}</div>
            <p className="text-xs text-muted-foreground">
              {activeRoutes > 0 
                ? `${Math.round((activeRoutes / totalRoutes) * 100)}% of total routes` 
                : 'No active routes'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{completedRoutes}</div>
            <p className="text-xs text-muted-foreground">
              {completedRoutes > 0 
                ? `${Math.round((completedRoutes / totalRoutes) * 100)}% completion rate` 
                : 'No completed routes'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Routes</CardTitle>
          <CardDescription>View and manage delivery routes</CardDescription>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Start Location</TableHead>
                <TableHead>End Location</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Est. Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">Loading routes...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-red-500">{error}</TableCell>
                </TableRow>
              ) : filteredRoutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    {searchQuery || statusFilter !== "all" 
                      ? "No routes found matching your filters" 
                      : "No routes found. Create a route to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.id}</TableCell>
                    <TableCell>
                      {route.vehicleId ? `Vehicle #${route.vehicleId}` : 'Not assigned'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        {formatLocation(route.startLocation)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        {formatLocation(route.endLocation)}
                      </div>
                    </TableCell>
                    <TableCell>{formatDistance(route.distance)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {formatDuration(route.estimatedDuration)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        route.status === "completed" ? "success" :
                        route.status === "in-progress" ? "default" :
                        route.status === "scheduled" ? "secondary" :
                        "destructive"
                      }>
                        {route.status === "in-progress" ? "In Progress" : 
                          (route.status ? route.status.charAt(0).toUpperCase() + route.status.slice(1) : 'Unknown')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRoute(route)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRoute(route)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal for creating/editing routes */}
      <RouteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        route={selectedRoute}
        onSuccess={fetchData}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the route
              {routeToDelete && ` #${routeToDelete.id}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 