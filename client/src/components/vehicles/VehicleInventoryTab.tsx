import { useState } from "react";
import { 
  Plus, RefreshCw, Search, Filter, Pencil, Trash2, FileText, Truck, 
  CalendarClock, Fuel, Settings, AlertCircle, Map, TrendingUp, Gauge, 
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FleetMap } from "@/components/fleet/FleetMap";
import { ExtendedVehicle } from "@/types/vehicle";
import { FleetSummary } from "@/services/fleetService";

interface VehicleInventoryTabProps {
  vehicles: ExtendedVehicle[];
  filteredVehicles: ExtendedVehicle[];
  selectedVehicles: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleToggleVehicleSelection: (vehicleId: string) => void;
  handleEditVehicle: (vehicle: ExtendedVehicle) => void;
  handleDeleteVehicle: (vehicle: ExtendedVehicle) => void;
  handleViewDetails: (vehicle: ExtendedVehicle) => void;
  handleAddVehicle: () => void;
  handleBatchStatusChange: (status: string) => void;
  refreshData: () => void;
  fleetSummary: FleetSummary | null;
  isLoading: boolean;
}

export function VehicleInventoryTab({
  vehicles,
  filteredVehicles,
  selectedVehicles,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  handleToggleVehicleSelection,
  handleEditVehicle,
  handleDeleteVehicle,
  handleViewDetails,
  handleAddVehicle,
  handleBatchStatusChange,
  refreshData,
  fleetSummary,
  isLoading
}: VehicleInventoryTabProps) {
  const totalPages = Math.ceil(filteredVehicles.length / pageSize);
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Vehicle Inventory Section */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
          <div>
            <CardTitle>Vehicle Inventory</CardTitle>
            <CardDescription>Manage your fleet vehicles and their details</CardDescription>
          </div>
          <Button onClick={handleAddVehicle}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </CardHeader>
        
        <div className="p-6 bg-background py-0 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-auto flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full h-9"
              />
            </div>
            
            <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">In Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
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
        
            <Button variant="outline" className="h-9 ml-auto" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Fleet Map Section */}
        <div className="p-6 pt-0">
          <div className="mb-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-background border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-xl">
                      <Map className="h-5 w-5 mr-2 text-primary" />
                      Fleet Location Overview
                    </CardTitle>
                    <CardDescription>Real-time locations and status of all fleet vehicles</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter Map
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex justify-center">
                <div className="w-full">
                  <FleetMap 
                    vehicles={filteredVehicles as ExtendedVehicle[]} 
                    height="400px"
                    onVehicleSelect={handleViewDetails}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Batch Operations */}
        {selectedVehicles.length > 0 && (
          <div className="p-3 bg-muted/30 border-t">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center">
                <Badge variant="secondary" className="mr-2">{selectedVehicles.length}</Badge>
                <span className="text-sm font-medium">vehicles selected</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="" onValueChange={(value) => value && handleBatchStatusChange(value)}>
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Set Active</SelectItem>
                    <SelectItem value="maintenance">Set Maintenance</SelectItem>
                    <SelectItem value="inactive">Set Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8" onClick={() => {}}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <CardContent className="p-0">
          {filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <Truck className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-center mb-2">No vehicles found</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search filters to find what you're looking for." 
                  : "Get started by adding your first vehicle to the fleet."}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={handleAddVehicle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              )}
            </div>
          ) : (
            <div>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 text-sm">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium w-[40px]">
                        <input
                          type="checkbox"
                          checked={selectedVehicles.length === paginatedVehicles.length && paginatedVehicles.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // This is a stub - should be handled in parent
                              // setSelectedVehicles(paginatedVehicles.map(v => v.id.toString()));
                            } else {
                              // setSelectedVehicles([]);
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="py-3 px-4 text-left font-medium w-[60px]">ID</th>
                      <th className="py-3 px-4 text-left font-medium">Vehicle</th>
                      <th className="py-3 px-4 text-left font-medium">Type</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-left font-medium">Last Maintenance</th>
                      <th className="py-3 px-4 text-center font-medium">Fuel</th>
                      <th className="py-3 px-4 text-right font-medium">Mileage</th>
                      <th className="py-3 px-4 text-left font-medium">Driver</th>
                      <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paginatedVehicles.map((vehicle) => {
                      const statusColor = vehicle.status === 'active' ? 'green' : 
                        vehicle.status === 'maintenance' ? 'amber' : 'red';
                      const statusLabel = vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1);
                      
                      return (
                        <tr 
                          key={vehicle.id} 
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedVehicles.includes(vehicle.id.toString())}
                              onChange={() => handleToggleVehicleSelection(vehicle.id.toString())}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="py-3 px-4 text-sm">{vehicle.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium flex items-center">
                              <Truck className="h-4 w-4 mr-2 text-primary" />
                              {vehicle.name}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {vehicle.make || 'N/A'} {vehicle.model || ''} 
                              {vehicle.year ? ` (${vehicle.year})` : ''}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{vehicle.type}</td>
                          <td className="py-3 px-4">
                            <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
                              {statusLabel}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center">
                              <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {(() => {
                                  const lastMaintenance = vehicle.lastMaintenance;
                                  if (!lastMaintenance) return "N/A";
                                  if (typeof lastMaintenance === 'string') return lastMaintenance;
                                  if (lastMaintenance instanceof Date) return String(lastMaintenance.toLocaleDateString());
                                  return String(lastMaintenance);
                                })()}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[80px]">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${vehicle.fuelLevel ?? 0}%` }}
                                />
                              </div>
                              <div className="text-xs mt-1 text-muted-foreground">
                                {vehicle.fuelLevel ?? 0}%
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            {(() => {
                              const mileage = vehicle.mileage;
                              return (mileage != null) 
                                ? String(mileage.toLocaleString()) 
                                : '0';
                            })()} mi
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {vehicle.assignedDriver || "Unassigned"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleViewDetails(vehicle)} 
                                className="h-8 w-8"
                                title="View Details"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditVehicle(vehicle)} 
                                className="h-8 w-8"
                                title="Edit Vehicle"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteVehicle(vehicle)} 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                title="Delete Vehicle"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="border-t">
                <div className="flex items-center justify-between py-4 px-6">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * pageSize + 1, filteredVehicles.length)} to {Math.min(currentPage * pageSize, filteredVehicles.length)} of {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
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
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={i}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(pageNum)}
                            className="h-8 w-8"
                            aria-label={`Page ${pageNum}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
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
                  
                  <div className="flex-1 flex justify-end">
                    
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
} 