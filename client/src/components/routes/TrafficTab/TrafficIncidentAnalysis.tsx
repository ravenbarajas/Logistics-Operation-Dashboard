import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrafficLiveMap } from "@/components/maps/TrafficLiveMap";
import { RefreshCw, MapPin, TrafficCone, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { TrafficIncident, TrafficRoad, IncidentSeverity, AutomatedAction } from "@/components/routes/types";

interface TrafficIncidentAnalysisProps {
  trafficIncidents: TrafficIncident[];
  trafficRoads: TrafficRoad[];
  trafficAutomatedActions: AutomatedAction[];
  refreshTrafficData: () => void;
  generateCoordinatesFromPath: (path: string, id: string) => Array<{lat: number, lng: number}>;
}

export function TrafficIncidentAnalysis({
  trafficIncidents,
  trafficRoads,
  trafficAutomatedActions,
  refreshTrafficData,
  generateCoordinatesFromPath
}: TrafficIncidentAnalysisProps) {
  const [filteredIncidents, setFilteredIncidents] = useState<TrafficIncident[]>(trafficIncidents);
  const [currentIncidentPage, setCurrentIncidentPage] = useState(1);
  const incidentsPerPage = 3;

  // Filter incidents function
  const filterIncidentsBySeverity = (severity: IncidentSeverity | 'all') => {
    if (severity === 'all') {
      setFilteredIncidents(trafficIncidents);
    } else {
      setFilteredIncidents(trafficIncidents.filter(incident => incident.severity === severity));
    }
    setCurrentIncidentPage(1);
  };
  
  // Calculate current incidents to display
  const indexOfLastIncident = currentIncidentPage * incidentsPerPage;
  const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
  const currentIncidents = filteredIncidents.slice(indexOfFirstIncident, indexOfLastIncident);

  return (
    <Card className="p-0">
      <CardHeader>
        <CardTitle>
          Traffic Incident Analysis
        </CardTitle>
        <CardDescription>Active incidents affecting current routes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Incident Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-3 rounded-md flex flex-col">
              <span className="text-xs text-muted-foreground">Total Incidents</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold">{trafficIncidents.length}</span>
                <span className="text-xs text-red-500">+3 from yesterday</span>
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded-md flex flex-col">
              <span className="text-xs text-muted-foreground">Routes Affected</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold">7</span>
                <span className="text-xs text-amber-500">16% of active routes</span>
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded-md flex flex-col">
              <span className="text-xs text-muted-foreground">Avg. Delay</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold">18 min</span>
                <span className="text-xs text-green-500">-4 min from average</span>
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded-md flex flex-col">
              <span className="text-xs text-muted-foreground">Rerouting</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold">5</span>
                <span className="text-xs text-blue-500">routes currently</span>
              </div>
            </div>
          </div>
          
          {/* Incident Map */}
          <div className="relative h-64 md:h-80 bg-muted rounded-md overflow-hidden">
            <TrafficLiveMap 
              height="100%" 
              incidents={trafficIncidents}
              roads={trafficRoads.map(road => {
                // Generate map coordinates from SVG path
                const coords = generateCoordinatesFromPath(road.path, road.id);
                
                return {
                  ...road,
                  name: road.id.startsWith('h') ? `Horizontal Road ${road.id.slice(1)}` :
                        road.id.startsWith('v') ? `Vertical Road ${road.id.slice(1)}` :
                        road.id.startsWith('sh') ? `Secondary Horizontal ${road.id.slice(2)}` :
                        `Secondary Vertical ${road.id.slice(2)}`,
                  coordinates: coords
                };
              })}
            />
            
            <div className="absolute top-2 left-2 z-[500] bg-background/80 text-xs p-1 rounded">
              Live Traffic Monitoring
            </div>
            
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 text-xs bg-white dark:bg-black"
                onClick={refreshTrafficData}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
              <Button variant="secondary" size="sm" className="h-8 text-xs bg-white dark:bg-black">
                <MapPin className="h-3 w-3 mr-1" />
                Filter
              </Button>
            </div>
          </div>
          
          {/* Active Incidents Table */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted/30 px-4 py-2 text-sm font-medium">Active Incidents</div>
            <div className="divide-y">
              {currentIncidents.map(incident => (
                <div key={incident.id} className="grid grid-cols-12 px-4 py-3 items-center">
                  <div className="col-span-1">
                    <Badge className={incident.severity === 'high' 
                      ? "bg-red-500 h-6 w-6 p-1 flex items-center justify-center rounded-full"
                      : incident.severity === 'medium' 
                        ? "bg-amber-500 h-6 w-6 p-1 flex items-center justify-center rounded-full"
                        : "bg-blue-500 h-6 w-6 p-1 flex items-center justify-center rounded-full"
                    }>
                      <TrafficCone className="h-4 w-4 text-white" />
                    </Badge>
                  </div>
                  <div className="col-span-4">
                    <div className="font-medium text-sm">{incident.type}</div>
                    <div className="text-xs text-muted-foreground">{incident.location}</div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="text-xs text-muted-foreground">Severity</div>
                    <div className={incident.severity === 'high' 
                      ? "text-sm font-medium text-red-500"
                      : incident.severity === 'medium' 
                        ? "text-sm font-medium text-amber-500"
                        : "text-sm font-medium text-blue-500"
                    }>
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="text-xs text-muted-foreground">Est. Duration</div>
                    <div className="text-sm font-medium">{incident.duration}</div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="text-xs text-muted-foreground">Routes Affected</div>
                    <div className="text-sm font-medium">{incident.affectedRoutes?.join(", ")}</div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/10 px-4 py-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Showing {indexOfFirstIncident + 1} to {Math.min(indexOfLastIncident, filteredIncidents.length)} of {filteredIncidents.length} incidents
              </span>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => setCurrentIncidentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentIncidentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => setCurrentIncidentPage(prev => 
                    Math.min(prev + 1, Math.ceil(filteredIncidents.length / incidentsPerPage))
                  )}
                  disabled={currentIncidentPage >= Math.ceil(filteredIncidents.length / incidentsPerPage)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Automated Actions */}
          <div className="border rounded-md p-4">
            <h4 className="text-sm font-medium mb-3">Automated Actions</h4>
            <div className="space-y-2">
              {trafficAutomatedActions.map((action, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {action.icon === 'refresh' && <RefreshCw className={action.color === 'blue' ? "h-4 w-4 text-blue-500" : action.color === 'amber' ? "h-4 w-4 text-amber-500" : "h-4 w-4 text-green-500"} />}
                    {action.icon === 'clock' && <Clock className={action.color === 'blue' ? "h-4 w-4 text-blue-500" : action.color === 'amber' ? "h-4 w-4 text-amber-500" : "h-4 w-4 text-green-500"} />}
                    {action.icon === 'user' && <User className={action.color === 'blue' ? "h-4 w-4 text-blue-500" : action.color === 'amber' ? "h-4 w-4 text-amber-500" : "h-4 w-4 text-green-500"} />}
                    <span>{action.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{action.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 