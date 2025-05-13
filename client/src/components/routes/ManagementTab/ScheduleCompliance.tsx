import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ScheduleCompliance() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Schedule Compliance</CardTitle>
        <CardDescription>Delivery performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="pt-2 pb-4">
            <div className="rounded-full h-32 w-32 mx-auto relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-32 w-32" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-muted stroke-1" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-green-500 stroke-2" 
                    strokeDasharray="283" 
                    strokeDashoffset="23" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">92%</div>
                <div className="text-xs text-muted-foreground mt-1">ON-TIME DELIVERY</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Delivery Status Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">On Time</span>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Delayed (&lt; 30min)</span>
                </div>
                <span className="text-sm font-medium">6%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Late (&gt; 30min)</span>
                </div>
                <span className="text-sm font-medium">2%</span>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-2" />
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Performance Trends</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Weekly Trend</span>
                <span className="text-sm text-green-500">+2.3%</span>
              </div>
              <div className="h-1 bg-muted rounded-full grid grid-cols-7 gap-1">
                <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
                <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
                <div className="bg-amber-500 rounded-full" style={{ height: "4px" }}></div>
                <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
                <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
                <div className="bg-amber-500 rounded-full" style={{ height: "4px" }}></div>
                <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Monthly Average</span>
                <span className="text-sm text-green-500">91.2%</span>
              </div>
              <Progress value={91.2} className="h-1" />
            </div>

            {/* Year-to-Date Performance */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Year-to-Date Performance</span>
                <span className="text-sm text-green-500">89.5%</span>
              </div>
              <Progress value={89.5} className="h-1" />
            </div>

          </div>
        </div>
        
        <div className="p-3 rounded-md bg-muted/30 mt-2">
          <h4 className="text-sm font-medium mb-2">Service Level Agreement</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Target SLA:</span>
              <span>95% on-time delivery</span>
            </div>
            <div className="flex justify-between">
              <span>Current Performance:</span>
              <span className="text-amber-500">92% (-3%)</span>
            </div>
            <div className="flex justify-between">
              <span>Action Required:</span>
              <span>Route optimization</span>
            </div>
          </div>
        </div>

        {/* Schedule Compliance Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Schedule Compliance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground">On-Time Schedule Adherence</div>
              <div className="text-xl font-bold mt-1">88%</div>
              <div className="text-xs text-muted-foreground mt-1">Based on last month</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground">Average Delay</div>
              <div className="text-xl font-bold mt-1">12 mins</div>
              <div className="text-xs text-muted-foreground mt-1">Across all routes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 