import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RouteTable } from "@/components/routes/RouteTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { RouteData, MergedRouteData } from "@/components/routes/types";

interface RouteManagementPanelProps {
  routes: {
    active: MergedRouteData[];
    scheduled: MergedRouteData[];
    completed: MergedRouteData[];
    templates: MergedRouteData[];
  };
  onViewDetails: (route: RouteData) => void;
  onStartRoute: (route: RouteData) => void;
  onCompleteRoute: (route: RouteData) => void;
  onDuplicateRoute: (route: RouteData) => void;
  onDeleteRoute: (route: RouteData) => void;
  onAddRoute: () => void;
}

export function RouteManagementPanel({
  routes,
  onViewDetails,
  onStartRoute,
  onCompleteRoute,
  onDuplicateRoute,
  onDeleteRoute,
  onAddRoute
}: RouteManagementPanelProps) {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [routeType, setRouteType] = useState("all");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when tab, search query, or route type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, routeType]);

  // Filter routes based on search query
  const filterRoutes = (routeList: RouteData[]) => {
    // First filter by search query
    let filteredList = routeList;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredList = filteredList.filter(route => 
        route.id.toLowerCase().includes(query) ||
        route.name.toLowerCase().includes(query) ||
        route.driver.toLowerCase().includes(query) ||
        route.vehicle.toLowerCase().includes(query)
      );
    }
    
    // Then filter by route type
    if (routeType !== 'all') {
      filteredList = filteredList.filter(route => route.routeType === routeType);
    }
    
    return filteredList;
  };

  // Get the appropriate filtered routes based on current tab
  const getFilteredRoutes = () => {
    switch (activeTab) {
      case "active": return filterRoutes(routes.active as RouteData[]);
      case "scheduled": return filterRoutes(routes.scheduled as RouteData[]);
      case "completed": return filterRoutes(routes.completed as RouteData[]);
      case "templates": return filterRoutes(routes.templates as RouteData[]);
      default: return [];
    }
  };

  const filteredRoutes = getFilteredRoutes();
  const totalPages = Math.max(1, Math.ceil(filteredRoutes.length / pageSize));
  const currentRoutes = filteredRoutes.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalRoutes = activeTab === "active" ? routes.active.length : 
                       activeTab === "scheduled" ? routes.scheduled.length :
                       activeTab === "completed" ? routes.completed.length :
                       routes.templates.length;

  return (
    <Card className="mb-6 p-0">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>
              Route Management
            </CardTitle>
            <CardDescription>Oversee and control all delivery routes</CardDescription>
          </div>
          <Button variant="outline" onClick={onAddRoute} className="border-black dark:border-white hover:bg-black/10 dark:hover:bg-white/10">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Route
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <div className="p-4 pt-6 bg-white dark:bg-[rgb(9,9,11)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                        Active Routes
                        <Badge variant="outline" className="ml-2 bg-background">
                          {routes.active.length}
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="scheduled">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-gray-400" />
                        Scheduled Routes
                        <Badge variant="outline" className="ml-2 bg-background">
                          {routes.scheduled.length}
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-gray-500" />
                        Completed Routes
                        <Badge variant="outline" className="ml-2 bg-background">
                          {routes.completed.length}
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="templates">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-gray-600" />
                        Route Templates
                        <Badge variant="outline" className="ml-2 bg-background">
                          {routes.templates.length}
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={routeType} onValueChange={setRouteType}>
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Route Types</SelectItem>
                    <SelectItem value="delivery">Delivery Routes</SelectItem>
                    <SelectItem value="pickup">Pickup Routes</SelectItem>
                    <SelectItem value="transfer">Transfer Routes</SelectItem>
                    <SelectItem value="return">Return Routes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative w-[240px]">
                  <Input 
                    placeholder="Search routes..." 
                    className="pl-8 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => setPageSize(parseInt(value))}
                  >
                    <SelectTrigger className="h-9 w-[70px]">
                      <SelectValue placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="icon" className="bg-background hover:bg-black/10 dark:hover:bg-white/10">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Route Table */}
          <div className="bg-white dark:bg-[rgb(9,9,11)] transition-colors">
            {activeTab === "active" && (
              <>
                <div className="max-h-[calc(100vh-32rem)] overflow-y-auto">
                  <RouteTable 
                    routes={currentRoutes}
                    status="active"
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    onViewDetails={onViewDetails}
                    onComplete={onCompleteRoute}
                    onDuplicate={onDuplicateRoute}
                    onDelete={onDeleteRoute}
                  />
                </div>
                <RouteTablePagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  filteredRoutes={filteredRoutes}
                  pageSize={pageSize}
                  searchQuery={searchQuery}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
            
            {activeTab === "scheduled" && (
              <>
                <div className="max-h-[calc(100vh-32rem)] overflow-y-auto">
                  <RouteTable 
                    routes={currentRoutes}
                    status="scheduled"
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    onViewDetails={onViewDetails}
                    onStart={onStartRoute}
                    onEdit={() => {}}
                    onOptimize={() => {}}
                    onDuplicate={onDuplicateRoute}
                    onDelete={onDeleteRoute}
                  />
                </div>
                <RouteTablePagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  filteredRoutes={filteredRoutes}
                  pageSize={pageSize}
                  searchQuery={searchQuery}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
            
            {activeTab === "completed" && (
              <>
                <div className="max-h-[calc(100vh-32rem)] overflow-y-auto">
                  <RouteTable 
                    routes={currentRoutes}
                    status="completed"
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    onViewDetails={onViewDetails}
                    onDuplicate={onDuplicateRoute}
                    onDelete={onDeleteRoute}
                  />
                </div>
                <RouteTablePagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  filteredRoutes={filteredRoutes}
                  pageSize={pageSize}
                  searchQuery={searchQuery}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
            
            {activeTab === "templates" && (
              <>
                <div className="max-h-[calc(100vh-32rem)] overflow-y-auto">
                  <RouteTable 
                    routes={currentRoutes}
                    status="template"
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    onViewDetails={onViewDetails}
                    onEdit={() => {}}
                    onOptimize={() => {}}
                    onDuplicate={onDuplicateRoute}
                    onDelete={onDeleteRoute}
                  />
                </div>
                <RouteTablePagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  filteredRoutes={filteredRoutes}
                  pageSize={pageSize}
                  searchQuery={searchQuery}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Pagination Component
interface RouteTablePaginationProps {
  currentPage: number;
  totalPages: number;
  filteredRoutes: RouteData[];
  pageSize: number;
  searchQuery: string;
  onPageChange: (page: number) => void;
}

function RouteTablePagination({
  currentPage,
  totalPages,
  filteredRoutes,
  pageSize,
  searchQuery,
  onPageChange
}: RouteTablePaginationProps) {
  return (
    <div className="pt-2 pb-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {filteredRoutes.length === 0 ? (
            <span>No routes found</span>
          ) : (
            <>
              Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, filteredRoutes.length)}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, filteredRoutes.length)}</span> of <span className="font-medium">{filteredRoutes.length}</span> {filteredRoutes.length === 1 ? 'route' : 'routes'}
              {searchQuery && <span> for "<span className="font-medium">{searchQuery}</span>"</span>}
            </>
          )}
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {totalPages <= 5 ? (
              // Show all pages if 5 or fewer
              [...Array(totalPages)].map((_, i) => (
                <Button
                  key={`page-${i+1}`}
                  variant={currentPage === i+1 ? "default" : "outline"}
                  size="icon"
                  onClick={() => onPageChange(i+1)}
                  className="h-8 w-8"
                  aria-label={`Page ${i+1}`}
                  aria-current={currentPage === i+1 ? "page" : undefined}
                >
                  {i+1}
                </Button>
              ))
            ) : (
              // Show limited pages with ellipsis
              <>
                <Button
                  variant={currentPage === 1 ? "default" : "outline"}
                  size="icon"
                  onClick={() => onPageChange(1)}
                  className="h-8 w-8"
                  aria-label="Page 1"
                >
                  1
                </Button>
                
                {currentPage > 3 && <span className="mx-1">...</span>}
                
                {currentPage > 2 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    className="h-8 w-8"
                    aria-label={`Page ${currentPage - 1}`}
                  >
                    {currentPage - 1}
                  </Button>
                )}
                
                {currentPage !== 1 && currentPage !== totalPages && (
                  <Button
                    variant="default"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Page ${currentPage}`}
                    aria-current="page"
                  >
                    {currentPage}
                  </Button>
                )}
                
                {currentPage < totalPages - 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    className="h-8 w-8"
                    aria-label={`Page ${currentPage + 1}`}
                  >
                    {currentPage + 1}
                  </Button>
                )}
                
                {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                
                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="icon"
                  onClick={() => onPageChange(totalPages)}
                  className="h-8 w-8"
                  aria-label={`Page ${totalPages}`}
                >
                  {totalPages}
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex justify-end"></div>
      </div>
    </div>
  );
} 