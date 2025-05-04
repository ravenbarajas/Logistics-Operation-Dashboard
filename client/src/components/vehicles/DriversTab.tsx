import { useState } from "react";
import { 
  Plus, RefreshCw, Search, User, Award, Activity, ChevronsLeft, 
  ChevronLeft, ChevronRight, ChevronsRight, FileText, Pencil, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DriversTabProps {
  driversData: any[];
  filteredDrivers: any[];
  driversSearch: string;
  setDriversSearch: (search: string) => void;
  driversPerformanceFilter: string;
  setDriversPerformanceFilter: (filter: string) => void;
  driversSortMetric: string;
  setDriversSortMetric: (metric: string) => void;
  driversPageSize: number;
  setDriversPageSize: (size: number) => void;
  driversCurrentPage: number;
  setDriversCurrentPage: (page: number) => void;
  selectedDrivers: string[];
  setSelectedDrivers: (drivers: string[]) => void;
  handleViewDriverDetails: (driver: any) => void;
  handleEditDriver: (driver: any) => void;
  handleDeleteDriver: (driver: any) => void;
  handleAddDriver: () => void;
  refreshData: () => void;
  getAvatarColor: (name: string) => string;
  getInitials: (name: string) => string;
}

export function DriversTab({
  driversData,
  filteredDrivers,
  driversSearch,
  setDriversSearch,
  driversPerformanceFilter,
  setDriversPerformanceFilter,
  driversSortMetric,
  setDriversSortMetric,
  driversPageSize,
  setDriversPageSize,
  driversCurrentPage,
  setDriversCurrentPage,
  selectedDrivers,
  setSelectedDrivers,
  handleViewDriverDetails,
  handleEditDriver,
  handleDeleteDriver,
  handleAddDriver,
  refreshData,
  getAvatarColor,
  getInitials
}: DriversTabProps) {
  // Compute derived state
  const driversTotalPages = Math.ceil(filteredDrivers.length / driversPageSize);
  
  // Sort drivers based on selected metric
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (driversSortMetric === "safety") {
      return b.safetyScore - a.safetyScore;
    } else if (driversSortMetric === "fuel") {
      return b.fuelEfficiency - a.fuelEfficiency;
    } else if (driversSortMetric === "time") {
      return b.timeManagement - a.timeManagement;
    } else if (driversSortMetric === "handling") {
      return b.vehicleHandling - a.vehicleHandling;
    } else if (driversSortMetric === "satisfaction") {
      return b.customerSatisfaction - a.customerSatisfaction;
    }
    return 0;
  });

  // Paginate drivers
  const paginatedDrivers = sortedDrivers.slice(
    (driversCurrentPage - 1) * driversPageSize, 
    driversCurrentPage * driversPageSize
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-background border-b">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <User className="h-5 w-5 mr-2 text-primary" />
                Driver Performance Analysis
              </CardTitle>
              <CardDescription>Comprehensive metrics and analytics for your fleet drivers</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddDriver}>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </div>
          
          {/* Move the tabs here, above the search/filter controls */}
          <Tabs defaultValue="drivers-table" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="drivers-table">
                <User className="h-4 w-4 mr-2" />
                Drivers Table
              </TabsTrigger>
              <TabsTrigger value="leaderboards">
                <Award className="h-4 w-4 mr-2" />
                Leaderboards
              </TabsTrigger>
              <TabsTrigger value="performance-kpis">
                <Activity className="h-4 w-4 mr-2" />
                Performance KPIs
              </TabsTrigger>
            </TabsList>
            
            {/* Move the search/filter controls inside the TabsContent for drivers-table */}
            <TabsContent value="drivers-table" className="mt-4 p-0">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search drivers..."
                    className="pl-8 w-full h-9"
                    value={driversSearch}
                    onChange={(e) => setDriversSearch(e.target.value)}
                  />
                </div>
                
                <Select 
                  defaultValue={driversPerformanceFilter}
                  onValueChange={setDriversPerformanceFilter}
                >
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Filter by performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drivers</SelectItem>
                    <SelectItem value="high">High Performers</SelectItem>
                    <SelectItem value="average">Average Performers</SelectItem>
                    <SelectItem value="low">Needs Improvement</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  defaultValue={driversSortMetric}
                  onValueChange={setDriversSortMetric}
                >
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Sort by metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety">Safety Score</SelectItem>
                    <SelectItem value="fuel">Fuel Efficiency</SelectItem>
                    <SelectItem value="time">Time Management</SelectItem>
                    <SelectItem value="handling">Vehicle Handling</SelectItem>
                    <SelectItem value="satisfaction">Customer Satisfaction</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                  <Select
                    value={driversPageSize.toString()}
                    onValueChange={(size) => {
                      setDriversPageSize(Number(size));
                      setDriversCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 w-[70px]">
                      <SelectValue placeholder={driversPageSize.toString()} />
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
              
              {/* Continue with the drivers table content */}
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 text-sm">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium w-[40px]">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selectedDrivers.length === paginatedDrivers.length && paginatedDrivers.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDrivers(paginatedDrivers.map(d => d.id));
                            } else {
                              setSelectedDrivers([]);
                            }
                          }}
                        />
                      </th>
                      <th className="py-3 px-4 text-left font-medium w-[240px]">Driver</th>
                      <th className="py-3 px-4 text-center font-medium">Safety Score</th>
                      <th className="py-3 px-4 text-center font-medium">Fuel Efficiency</th>
                      <th className="py-3 px-4 text-center font-medium">Time Management</th>
                      <th className="py-3 px-4 text-center font-medium">Vehicle Handling</th>
                      <th className="py-3 px-4 text-center font-medium">Customer Satisfaction</th>
                      <th className="py-3 px-4 text-center font-medium">Overall Rating</th>
                      <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paginatedDrivers.map(driver => {
                      const overallScore = Math.round(
                        (driver.safetyScore + 
                        driver.fuelEfficiency + 
                        driver.timeManagement + 
                        driver.vehicleHandling + 
                        driver.customerSatisfaction) / 5
                      );
                      
                      let performanceCategory = "average";
                      if (overallScore >= 90) performanceCategory = "high";
                      else if (overallScore < 85) performanceCategory = "low";
                      
                      const categoryColors = {
                        high: "green",
                        average: "blue",
                        low: "amber"
                      };
                      
                      const performanceColor = categoryColors[performanceCategory as keyof typeof categoryColors];
                      
                      return (
                        <tr key={driver.id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={selectedDrivers.includes(driver.id)}
                              onChange={() => {
                                if (selectedDrivers.includes(driver.id)) {
                                  setSelectedDrivers(selectedDrivers.filter(id => id !== driver.id));
                                } else {
                                  setSelectedDrivers([...selectedDrivers, driver.id]);
                                }
                              }}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white font-semibold`}>
                                  <User className="h-5 w-5" />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">{driver.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  ID: {driver.id} • {driver.trips} trips
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {driver.safetyScore}%
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {driver.fuelEfficiency}%
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {driver.timeManagement}%
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {driver.vehicleHandling}%
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {driver.customerSatisfaction}%
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${performanceColor}-100 text-${performanceColor}-800`}>
                              {overallScore}%
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleViewDriverDetails(driver)} 
                                className="h-8 w-8"
                                title="View Details"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditDriver(driver)} 
                                className="h-8 w-8"
                                title="Edit Driver"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteDriver(driver)} 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                title="Delete Driver"
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
            </TabsContent>
            
            {/* Leaderboards Tab */}
            <TabsContent value="leaderboards" className="mt-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Award className="h-5 w-5 mr-2 text-yellow-500" />
                      Top Performers Overall
                    </CardTitle>
                    <CardDescription>Drivers with the highest combined scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...driversData]
                        .sort((a, b) => {
                          const aScore = (a.safetyScore + a.fuelEfficiency + a.timeManagement + a.vehicleHandling + a.customerSatisfaction) / 5;
                          const bScore = (b.safetyScore + b.fuelEfficiency + b.timeManagement + b.vehicleHandling + b.customerSatisfaction) / 5;
                          return bScore - aScore;
                        })
                        .slice(0, 5)
                        .map((driver, index) => {
                          const overallScore = Math.round((driver.safetyScore + driver.fuelEfficiency + driver.timeManagement + driver.vehicleHandling + driver.customerSatisfaction) / 5);
                          return (
                            <div key={driver.id} className="flex items-center">
                              <div className="w-8 text-center font-bold">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                              </div>
                              <div className="flex items-center flex-1 ml-2">
                                <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                  <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                    <User className="h-4 w-4" />
                                  </div>
                                </div>
                                <div className="font-medium">{driver.name}</div>
                              </div>
                              <div className="flex justify-end mr-2">
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${overallScore >= 90 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {overallScore}%
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Safety Champions Card - Similar structure to the first card but for safety scores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Award className="h-5 w-5 mr-2 text-green-500" />
                      Safety Champions
                    </CardTitle>
                    <CardDescription>Drivers with the best safety records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...driversData]
                        .sort((a, b) => b.safetyScore - a.safetyScore)
                        .slice(0, 5)
                        .map((driver, index) => (
                          <div key={driver.id} className="flex items-center">
                            <div className="w-8 text-center font-bold">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </div>
                            <div className="flex items-center flex-1 ml-2">
                              <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                  <User className="h-4 w-4" />
                                </div>
                              </div>
                              <div className="font-medium">{driver.name}</div>
                            </div>
                            <div className="flex justify-end mr-2">
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {driver.safetyScore}%
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional leaderboard cards would go here */}
              {/* For brevity, only showing a subset of the UI */}
            </TabsContent>
            
            {/* Performance KPIs Tab */}
            <TabsContent value="performance-kpis" className="mt-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fleet Safety Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      {Math.round(driversData.reduce((acc, driver) => acc + driver.safetyScore, 0) / driversData.length)}%
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Average driver safety rating</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Additional KPI cards would go here */}
                {/* For brevity, only showing a subset of the UI */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Pagination for Drivers */}
        <div className="border-t">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {Math.min((driversCurrentPage - 1) * driversPageSize + 1, filteredDrivers.length)} to {Math.min(driversCurrentPage * driversPageSize, filteredDrivers.length)} of {filteredDrivers.length} {filteredDrivers.length === 1 ? 'driver' : 'drivers'}
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDriversCurrentPage(1)}
                  disabled={driversCurrentPage === 1}
                  className="h-8 w-8"
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDriversCurrentPage(driversCurrentPage - 1)}
                  disabled={driversCurrentPage === 1}
                  className="h-8 w-8"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {driversTotalPages <= 5 ? (
                  // Show all pages if 5 or fewer
                  [...Array(driversTotalPages)].map((_, i) => (
                    <Button
                      key={`page-${i+1}`}
                      variant={driversCurrentPage === i+1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => setDriversCurrentPage(i+1)}
                      className="h-8 w-8"
                      aria-label={`Page ${i+1}`}
                      aria-current={driversCurrentPage === i+1 ? "page" : undefined}
                    >
                      {i+1}
                    </Button>
                  ))
                ) : (
                  // Show limited pages with ellipsis
                  <>
                    <Button
                      variant={driversCurrentPage === 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => setDriversCurrentPage(1)}
                      className="h-8 w-8"
                      aria-label="Page 1"
                    >
                      1
                    </Button>
                    
                    {driversCurrentPage > 3 && <span className="mx-1">...</span>}
                    
                    {driversCurrentPage > 2 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDriversCurrentPage(driversCurrentPage - 1)}
                        className="h-8 w-8"
                        aria-label={`Page ${driversCurrentPage - 1}`}
                      >
                        {driversCurrentPage - 1}
                      </Button>
                    )}
                    
                    {driversCurrentPage !== 1 && driversCurrentPage !== driversTotalPages && (
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => setDriversCurrentPage(driversCurrentPage)}
                        className="h-8 w-8"
                        aria-label={`Page ${driversCurrentPage}`}
                        aria-current="page"
                      >
                        {driversCurrentPage}
                      </Button>
                    )}
                    
                    {driversCurrentPage < driversTotalPages - 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDriversCurrentPage(driversCurrentPage + 1)}
                        className="h-8 w-8"
                        aria-label={`Page ${driversCurrentPage + 1}`}
                      >
                        {driversCurrentPage + 1}
                      </Button>
                    )}
                    
                    {driversCurrentPage < driversTotalPages - 2 && <span className="mx-1">...</span>}
                    
                    <Button
                      variant={driversCurrentPage === driversTotalPages ? "default" : "outline"}
                      size="icon"
                      onClick={() => setDriversCurrentPage(driversTotalPages)}
                      className="h-8 w-8"
                      aria-label={`Page ${driversTotalPages}`}
                    >
                      {driversTotalPages}
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDriversCurrentPage(driversCurrentPage + 1)}
                  disabled={driversCurrentPage === driversTotalPages}
                  className="h-8 w-8"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDriversCurrentPage(driversTotalPages)}
                  disabled={driversCurrentPage === driversTotalPages}
                  className="h-8 w-8"
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Empty div to maintain balance in the layout */}
            <div className="flex-1"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 