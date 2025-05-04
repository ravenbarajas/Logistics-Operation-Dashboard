import {
  Cpu, CircleDot, Activity, TrendingDown, TrendingUp, Shield, 
  Download, DatabaseBackup, FileText, RefreshCw, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SystemsTabProps {
  systemDetailsVisible: boolean;
  setSystemDetailsVisible: (visible: boolean) => void;
  systemSecurityDetailsVisible: boolean;
  setSystemSecurityDetailsVisible: (visible: boolean) => void;
}

export function SystemsTab({
  systemDetailsVisible,
  setSystemDetailsVisible,
  systemSecurityDetailsVisible,
  setSystemSecurityDetailsVisible
}: SystemsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <Cpu className="h-4 w-4 mr-2 text-primary" />
            Diagnostic System Status
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => alert("System logs for the last 7 days displayed in a new window")}
          >
            <FileText className="h-3.5 w-3.5 mr-1" />
            Logs
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="flex justify-between items-center p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => alert("OBD Connection Service: 99.95% uptime, 24.3ms average response time, 1.2M requests/day")}
            >
              <div className="flex items-center">
                <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                <span className="text-sm font-medium">OBD Connection Service</span>
              </div>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                Online
              </Badge>
            </div>
            <div 
              className="flex justify-between items-center p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => alert("Fleet Tracking Service: 100% uptime, 18.7ms average response time, 5.6M location data points/day")}
            >
              <div className="flex items-center">
                <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                <span className="text-sm font-medium">Fleet Tracking Service</span>
              </div>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                Online
              </Badge>
            </div>
            <div 
              className="flex justify-between items-center p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => alert("Predictive Analytics API: 96.8% uptime, 220ms average response time, excessive load detected. Scaling up additional instances.")}
            >
              <div className="flex items-center">
                <CircleDot className="h-3 w-3 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Predictive Analytics API</span>
              </div>
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">
                Degraded
              </Badge>
            </div>
            <div 
              className="flex justify-between items-center p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => alert("Maintenance Database: 100% uptime, 32ms average query time, 180GB storage used (68%)")}
            >
              <div className="flex items-center">
                <CircleDot className="h-3 w-3 text-green-500 mr-2" />
                <span className="text-sm font-medium">Maintenance Database</span>
              </div>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                Online
              </Badge>
            </div>
            
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  alert("Comprehensive system diagnostic started. This will take approximately 2 minutes to complete. A notification will appear when finished.");
                  setTimeout(() => {
                    alert("System diagnostic completed. All services operational. Report available in System Health dashboard.");
                  }, 2000);
                }}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Run System Diagnostic
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Activity className="h-4 w-4 mr-2 text-primary" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm font-medium">124ms</span>
              </div>
              <Progress value={92} className="h-1.5" />
              <div className="flex items-center mt-1">
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">-12ms from last week</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Server Load</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <Progress value={42} className="h-1.5" />
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-amber-500 mr-1" />
                <span className="text-xs text-amber-600">+8% from last week</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Data Processing</span>
                <span className="text-sm font-medium">1.3 GB/hr</span>
              </div>
              <Progress value={65} className="h-1.5" />
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+0.2 GB from last week</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Cloud Storage</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <Progress value={68} className="h-1.5" />
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-amber-500 mr-1" />
                <span className="text-xs text-amber-600">+5% from last week</span>
              </div>
            </div>
            
            {/* System Details Section */}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={() => setSystemDetailsVisible(!systemDetailsVisible)}
              >
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                System Details
              </Button>
              
              {systemDetailsVisible && (
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Database Connections:</span>
                    <span>24/50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Hit Rate:</span>
                    <span>92.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Query Time:</span>
                    <span>42ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Rate Limit Used:</span>
                    <span>36%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              System Security & Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                <div className="flex items-start">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-green-800 dark:text-green-400">Security Status</div>
                    <div className="text-xs text-green-800 dark:text-green-400 mt-1">All systems secured. Last scan: 2 hours ago.</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 h-7 px-2 text-xs"
                      onClick={() => alert("Security scan initiated")}
                    >
                      Run Scan
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <div className="flex items-start">
                  <Download className="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-400">Software Updates</div>
                    <div className="text-xs text-blue-800 dark:text-blue-400 mt-1">System is up to date. Next check: 12 hours.</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 h-7 px-2 text-xs"
                      onClick={() => alert("Update check initiated")}
                    >
                      Check Now
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                <div className="flex items-start">
                  <DatabaseBackup className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Data Backup</div>
                    <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Last backup: 6 hours ago. Next backup: 18 hours.</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 h-7 px-2 text-xs"
                      onClick={() => alert("Manual backup initiated")}
                    >
                      Backup Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">System Event Log</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={() => alert("Full log opened")}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="border-b pb-2">
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-2 w-2 text-green-500" />
                    <span className="font-medium">System Startup</span>
                    <span className="text-xs text-muted-foreground ml-auto">Today, 08:00 AM</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">All services started successfully</div>
                </div>
                
                <div className="border-b pb-2">
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-2 w-2 text-blue-500" />
                    <span className="font-medium">Database Backup</span>
                    <span className="text-xs text-muted-foreground ml-auto">Today, 06:00 AM</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Automated backup completed successfully</div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-2 w-2 text-amber-500" />
                    <span className="font-medium">API Rate Limit Warning</span>
                    <span className="text-xs text-muted-foreground ml-auto">Yesterday, 04:32 PM</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Rate limit reached 80% threshold on /api/vehicles endpoint</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 