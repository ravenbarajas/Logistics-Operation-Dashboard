import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Route, 
  Clock, 
  Truck, 
  User, 
  Calendar,
  MapPin,
  FileEdit,
  Copy, 
  BarChart4, 
  Trash2,
  Search
} from "lucide-react";

export interface RouteData {
  id: string;
  name: string;
  vehicle: string;
  driver: string;
  stops: number;
  distance: number;
  duration: number;
  startLocation: string;
  endLocation: string;
  departureTime?: string;
  departureDate?: string;
  status: string;
  fuelConsumption?: number;
  co2Emissions?: number;
  startTime?: string;
  endTime?: string;
  actualDuration?: number;
  completionRate?: number;
  createdAt?: string;
  lastUpdated?: string;
}

interface RouteTableProps {
  routes: RouteData[];
  status: "active" | "scheduled" | "completed" | "template";
  onViewDetails?: (route: RouteData) => void;
  onEdit?: (route: RouteData) => void;
  onDuplicate?: (route: RouteData) => void;
  onDelete?: (route: RouteData) => void;
  onOptimize?: (route: RouteData) => void;
  onStart?: (route: RouteData) => void;
  onComplete?: (route: RouteData) => void;
}

export function RouteTable({
  routes,
  status,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  onOptimize,
  onStart,
  onComplete
}: RouteTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  // Reset to page 1 when routes change
  useEffect(() => {
    setCurrentPage(1);
  }, [routes.length]);

  // Filter routes based on search term
  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoutes.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page changes
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format distance and duration
  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)} mi`;
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">In Progress</Badge>;
      case "delayed":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">Delayed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
      case "optimized":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Optimized</Badge>;
      case "planned":
        return <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">Planned</Badge>;
      case "template":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Template</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="relative max-w-sm">
          <Input
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRoutes.length)} of {filteredRoutes.length} routes
          </div>
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px] px-4 py-3">Route ID</TableHead>
              <TableHead className="px-4 py-3">Route Name</TableHead>
              <TableHead className="px-4 py-3">Vehicle/Driver</TableHead>
              <TableHead className="text-center px-4 py-3">Stops</TableHead>
              <TableHead className="text-center px-4 py-3">Distance</TableHead>
              <TableHead className="text-center px-4 py-3">Duration</TableHead>
              {status === "completed" && (
                <TableHead className="text-center px-4 py-3">Completion</TableHead>
              )}
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium px-4 py-3">{route.id}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="font-medium">{route.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center space-x-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {route.startLocation.split(" ")[0]} 
                        {route.endLocation && route.endLocation !== route.startLocation ? 
                          ` → ${route.endLocation.split(" ")[0]}` : 
                          " (Round Trip)"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1.5" />
                      <span>{route.vehicle}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs mt-1">
                      <User className="h-3 w-3 mr-1.5" />
                      <span>{route.driver}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-4 py-3">{route.stops}</TableCell>
                  <TableCell className="text-center px-4 py-3">{formatDistance(route.distance)}</TableCell>
                  <TableCell className="text-center px-4 py-3">
                    {status === "completed" && route.actualDuration ? (
                      <div>
                        {formatDuration(route.actualDuration)}
                        {route.actualDuration > route.duration && (
                          <div className="text-xs text-red-500">
                            +{formatDuration(route.actualDuration - route.duration)}
                          </div>
                        )}
                        {route.actualDuration < route.duration && (
                          <div className="text-xs text-green-500">
                            -{formatDuration(route.duration - route.actualDuration)}
                          </div>
                        )}
                      </div>
                    ) : (
                      formatDuration(route.duration)
                    )}
                  </TableCell>
                  {status === "completed" && (
                    <TableCell className="text-center px-4 py-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${route.completionRate || 100}%` }}
                        />
                      </div>
                      <div className="text-xs mt-1">{route.completionRate || 100}%</div>
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-3">
                    {getStatusBadge(route.status)}
                    {status === "active" && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {route.startTime ? `Started: ${route.startTime}` : 'Not started'}
                      </div>
                    )}
                    {status === "scheduled" && route.departureDate && (
                      <div className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {route.departureDate} {route.departureTime}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => onViewDetails && onViewDetails(route)}>
                          <Route className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        
                        {status === "scheduled" && onStart && (
                          <DropdownMenuItem onClick={() => onStart(route)}>
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Start Route</span>
                          </DropdownMenuItem>
                        )}
                        
                        {status === "active" && onComplete && (
                          <DropdownMenuItem onClick={() => onComplete(route)}>
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Complete</span>
                          </DropdownMenuItem>
                        )}
                        
                        {(status === "template" || status === "scheduled") && onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(route)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            <span>Edit Route</span>
                          </DropdownMenuItem>
                        )}
                        
                        {(status === "template" || status === "scheduled") && onOptimize && (
                          <DropdownMenuItem onClick={() => onOptimize(route)}>
                            <BarChart4 className="mr-2 h-4 w-4" />
                            <span>Optimize</span>
                          </DropdownMenuItem>
                        )}
                        
                        {onDuplicate && (
                          <DropdownMenuItem onClick={() => onDuplicate(route)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                        )}
                        
                        {onDelete && (
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600" 
                            onClick={() => onDelete(route)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={status === "completed" ? 9 : 8} className="h-24 text-center">
                  No routes found.
                </TableCell>
              </TableRow>
            )}
            {currentItems.length > 0 && currentItems.length < itemsPerPage && (
              Array.from({ length: itemsPerPage - currentItems.length }).map((_, index) => (
                <TableRow key={`empty-${index}`} className="h-[55px]">
                  <TableCell colSpan={status === "completed" ? 9 : 8}></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 