import { useState } from "react";
import { 
  Activity, Cpu, CircleDot, Wrench,
  RefreshCw, Filter, Search, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DiagnosticTab } from "./maintenance/DiagnosticTab";
import { PredictiveTab } from "./maintenance/PredictiveTab";
import { AlertsTab } from "./maintenance/AlertsTab";
import { SystemsTab } from "./maintenance/SystemsTab";

interface MaintenanceTabProps {
  maintenanceRecords: any[];
  refreshData: () => void;
  openComponentDetailsDialog: () => void;
  openFailureDetailsDialog: () => void;
  setSystemDetailsVisible: (visible: boolean) => void;
  systemDetailsVisible: boolean;
  setSystemSecurityDetailsVisible: (visible: boolean) => void;
  systemSecurityDetailsVisible: boolean;
}

export function MaintenanceTab({
  maintenanceRecords,
  refreshData,
  openComponentDetailsDialog,
  openFailureDetailsDialog,
  setSystemDetailsVisible,
  systemDetailsVisible,
  setSystemSecurityDetailsVisible,
  systemSecurityDetailsVisible
}: MaintenanceTabProps) {
  // State for internal management
  const [diagnosticSearch, setDiagnosticSearch] = useState("");
  const [diagnosticVehicleFilter, setDiagnosticVehicleFilter] = useState("all");
  const [diagnosticSortBy, setDiagnosticSortBy] = useState("recent");
  
  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="bg-background">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Vehicle Health Monitoring System
            </CardTitle>
            <CardDescription>Real-time diagnostic metrics and predictive maintenance analysis</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Cpu className="h-4 w-4 mr-2" />
              Run Diagnostics
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Real-time Status Overview */}
        <div className="border rounded-md mb-4 bg-muted/10">
          <div className="p-2 flex items-center border-b bg-muted/20">
            <CircleDot className="h-3 w-3 text-green-500 mr-2" />
            <span className="text-sm font-medium">System Status: Operational</span>
            <span className="text-xs text-muted-foreground ml-auto">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="grid grid-cols-4 gap-4 p-4">
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">Diagnostic Systems</div>
              <div className="relative h-16 w-16">
                <CircleDot className="h-16 w-16 text-green-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">100%</span>
                </div>
              </div>
              <div className="text-xs font-medium mt-1">Online</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">Sensor Network</div>
              <div className="relative h-16 w-16">
                <CircleDot className="h-16 w-16 text-green-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">96%</span>
                </div>
              </div>
              <div className="text-xs font-medium mt-1">23/24 Online</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">Data Relays</div>
              <div className="relative h-16 w-16">
                <CircleDot className="h-16 w-16 text-amber-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-amber-600">83%</span>
                </div>
              </div>
              <div className="text-xs font-medium mt-1">5/6 Online</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">Cloud Sync</div>
              <div className="relative h-16 w-16">
                <CircleDot className="h-16 w-16 text-green-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">100%</span>
                </div>
              </div>
              <div className="text-xs font-medium mt-1">2m Ago</div>
            </div>
          </div>
        </div>
        
        {/* Technical Tabs for Different Views */}
        <Tabs defaultValue="diagnostic" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="diagnostic" className="text-xs">
              <Activity className="h-3.5 w-3.5 mr-1" />
              Diagnostic
            </TabsTrigger>
            <TabsTrigger value="predictive" className="text-xs">
              <Wrench className="h-3.5 w-3.5 mr-1" />
              Predictive
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="systems" className="text-xs">
              <Cpu className="h-3.5 w-3.5 mr-1" />
              Systems
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="diagnostic">
            <DiagnosticTab 
              search={diagnosticSearch} 
              setSearch={setDiagnosticSearch}
              vehicleFilter={diagnosticVehicleFilter}
              setVehicleFilter={setDiagnosticVehicleFilter}
              sortBy={diagnosticSortBy}
              setSortBy={setDiagnosticSortBy}
              openComponentDetailsDialog={openComponentDetailsDialog}
            />
          </TabsContent>
          
          <TabsContent value="predictive">
            <PredictiveTab 
              openFailureDetailsDialog={openFailureDetailsDialog}
            />
          </TabsContent>
          
          <TabsContent value="alerts">
            <AlertsTab />
          </TabsContent>
          
          <TabsContent value="systems">
            <SystemsTab
              systemDetailsVisible={systemDetailsVisible}
              setSystemDetailsVisible={setSystemDetailsVisible}
              systemSecurityDetailsVisible={systemSecurityDetailsVisible}
              setSystemSecurityDetailsVisible={setSystemSecurityDetailsVisible}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 