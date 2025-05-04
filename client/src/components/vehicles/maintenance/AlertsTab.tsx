import {
  AlertTriangle, Bell, CheckSquare, InfoIcon, Check, Calendar, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AlertsTab() {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-primary" />
          Maintenance Alerts & Notifications
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => alert("Notification settings opened")}
        >
          <Bell className="h-3.5 w-3.5 mr-1" />
          Configure
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="all" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="critical" className="text-xs">Critical</TabsTrigger>
              <TabsTrigger value="warning" className="text-xs">Warning</TabsTrigger>
              <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => alert("All alerts resolved")}
          >
            <CheckSquare className="h-3.5 w-3.5 mr-1" />
            Resolve All
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-red-800 dark:text-red-400">Critical: Battery Replacement Required</div>
                  <Badge variant="outline" className="text-xs bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400">
                    Critical
                  </Badge>
                </div>
                <div className="text-xs text-red-800 dark:text-red-400 mt-1">Truck #103 - Battery voltage dropping below acceptable levels. Replacement recommended immediately.</div>
                <div className="flex items-center mt-2 gap-2">
                  <span className="text-xs text-red-600 dark:text-red-500">92% Confidence</span>
                  <span className="text-xs text-red-600 dark:text-red-500">Detected: 2 days ago</span>
                  <div className="flex items-center ml-auto gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => alert("Scheduled for maintenance")}
                    >
                      Schedule
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => alert("Alert resolved")}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Warning: Tire Wear Detection</div>
                  <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">
                    Warning
                  </Badge>
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Van #205 - Front tires showing uneven wear pattern. Rotation recommended during next service.</div>
                <div className="flex items-center mt-2 gap-2">
                  <span className="text-xs text-amber-600 dark:text-amber-500">85% Confidence</span>
                  <span className="text-xs text-amber-600 dark:text-amber-500">Detected: 5 days ago</span>
                  <div className="flex items-center ml-auto gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => alert("Scheduled for maintenance")}
                    >
                      Schedule
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => alert("Alert resolved")}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Warning: Oil Change Due</div>
                  <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">
                    Warning
                  </Badge>
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Truck #101 - Oil change due in 3 days. Current mileage: 32,450 miles.</div>
                <div className="flex items-center mt-2 gap-2">
                  <span className="text-xs text-amber-600 dark:text-amber-500">Maintenance Interval</span>
                  <span className="text-xs text-amber-600 dark:text-amber-500">Due: June 29, 2023</span>
                  <div className="flex items-center ml-auto gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => alert("Scheduled for maintenance")}
                    >
                      Schedule
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => alert("Alert resolved")}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
            <div className="flex items-start">
              <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-400">Info: Maintenance Completed</div>
                  <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400">
                    Info
                  </Badge>
                </div>
                <div className="text-xs text-blue-800 dark:text-blue-400 mt-1">Truck #102 - Regular maintenance completed. Next service due in 5,000 miles.</div>
                <div className="flex items-center mt-2 gap-2">
                  <span className="text-xs text-blue-600 dark:text-blue-500">Completed: Today</span>
                  <div className="flex items-center ml-auto gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => alert("Alert dismissed")}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 