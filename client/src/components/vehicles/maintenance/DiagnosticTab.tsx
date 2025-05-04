import {
  Search, Filter, BarChart, Activity, CircleDot, Gauge, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DiagnosticTabProps {
  search: string;
  setSearch: (search: string) => void;
  vehicleFilter: string;
  setVehicleFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  openComponentDetailsDialog: () => void;
}

export function DiagnosticTab({
  search,
  setSearch,
  vehicleFilter,
  setVehicleFilter,
  sortBy,
  setSortBy,
  openComponentDetailsDialog
}: DiagnosticTabProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            className="pl-8 h-9 w-[250px]" 
            placeholder="Search diagnostics..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select 
            defaultValue={vehicleFilter}
            onValueChange={setVehicleFilter}
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Filter by vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="trucks">Trucks</SelectItem>
              <SelectItem value="vans">Vans</SelectItem>
              <SelectItem value="refrigerated">Refrigerated</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            defaultValue={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="critical">Critical First</SelectItem>
              <SelectItem value="vehicle">By Vehicle</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => alert("Filter applied!")}>
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => {
              const dialog = document.getElementById("run-diagnostic-dialog") as HTMLDialogElement;
              if (dialog) dialog.showModal();
            }}
          >
            Run New
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BarChart className="h-4 w-4 mr-2 text-primary" />
                  Component Health Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <div className="h-full flex flex-col justify-center">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Excellent (90-100%)</span>
                        </div>
                        <span className="font-medium">23 components</span>
                      </div>
                      <Progress value={46} className="h-2 bg-muted" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span>Good (75-89%)</span>
                        </div>
                        <span className="font-medium">18 components</span>
                      </div>
                      <Progress value={36} className="h-2 bg-muted" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                          <span>Fair (50-74%)</span>
                        </div>
                        <span className="font-medium">7 components</span>
                      </div>
                      <Progress value={14} className="h-2 bg-muted" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>Poor (0-49%)</span>
                        </div>
                        <span className="font-medium">2 components</span>
                      </div>
                      <Progress value={4} className="h-2 bg-muted" />
                    </div>
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-4">
                    Based on diagnostic data from 50 critical vehicle components
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-primary" />
                  Fleet Health Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <div className="h-full flex flex-col">
                  <div className="flex-1 grid grid-cols-6 grid-rows-3 gap-1 pb-4">
                    {Array.from({ length: 6 }).map((_, monthIdx) => (
                      <div key={`month-${monthIdx}`} className="flex flex-col">
                        {Array.from({ length: 3 }).map((_, metricIdx) => {
                          // Generate trend data with some randomness but overall upward trend
                          const baseHeight = 30 + metricIdx * 15 + monthIdx * 3;
                          const randomAdjustment = Math.sin(monthIdx) * 5;
                          const height = baseHeight + randomAdjustment;
                          
                          // Get color based on metric type
                          const colors = [
                            'bg-blue-500 dark:bg-blue-600', 
                            'bg-green-500 dark:bg-green-600', 
                            'bg-purple-500 dark:bg-purple-600'
                          ];
                          
                          return (
                            <div 
                              key={`metric-${metricIdx}-${monthIdx}`} 
                              className={`${colors[metricIdx]} rounded-sm mt-auto`}
                              style={{ height: `${height}%` }}
                            ></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-6 text-xs text-center text-muted-foreground">
                    <div>Jan</div>
                    <div>Feb</div>
                    <div>Mar</div>
                    <div>Apr</div>
                    <div>May</div>
                    <div>Jun</div>
                  </div>
                  <div className="mt-3 flex justify-center items-center gap-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                      <span>Engine</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span>Electrical</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                      <span>Drivetrain</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <CircleDot className="h-4 w-4 mr-2 text-primary" />
                Real-Time Diagnostic Data
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alert("Diagnostic logs exported to CSV")}
              >
                <FileText className="h-3.5 w-3.5 mr-1" />
                Export Logs
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                      <span className="text-sm">ECU Status</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                      Normal
                    </Badge>
                  </div>
                  <Progress value={98} className="h-1" />
                  <span className="text-xs text-muted-foreground">Response time: 124ms</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                      <span className="text-sm">Sensor Network</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                      Normal
                    </Badge>
                  </div>
                  <Progress value={96} className="h-1" />
                  <span className="text-xs text-muted-foreground">Data throughput: 1.3 MB/s</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CircleDot className="h-3 w-3 text-amber-500 mr-2" />
                      <span className="text-sm">OBD Interface</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">
                      Degraded
                    </Badge>
                  </div>
                  <Progress value={83} className="h-1" />
                  <span className="text-xs text-muted-foreground">2 failed connections in 24h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <CircleDot className="h-4 w-4 mr-2 text-primary" />
                Component Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Engine</span>
                    <span className="text-sm font-medium text-green-600">92%</span>
                  </div>
                  <Progress value={92} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Transmission</span>
                    <span className="text-sm font-medium text-green-600">88%</span>
                  </div>
                  <Progress value={88} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Brakes</span>
                    <span className="text-sm font-medium text-amber-600">75%</span>
                  </div>
                  <Progress value={75} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Suspension</span>
                    <span className="text-sm font-medium text-green-600">95%</span>
                  </div>
                  <Progress value={95} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Electrical</span>
                    <span className="text-sm font-medium text-green-600">82%</span>
                  </div>
                  <Progress value={82} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Fluid Levels</span>
                    <span className="text-sm font-medium text-green-600">90%</span>
                  </div>
                  <Progress value={90} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Tires</span>
                    <span className="text-sm font-medium text-amber-600">62%</span>
                  </div>
                  <Progress value={62} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Battery</span>
                    <span className="text-sm font-medium text-red-600">45%</span>
                  </div>
                  <Progress value={45} className="h-1.5" />
                </div>
                <Button 
                  className="w-full mt-2" 
                  variant="outline" 
                  size="sm"
                  onClick={openComponentDetailsDialog}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 