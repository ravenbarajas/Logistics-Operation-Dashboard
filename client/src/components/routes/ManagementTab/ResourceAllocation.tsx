import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ResourceAllocation() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Resource Allocation</CardTitle>
        <CardDescription>Driver and vehicle assignment status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Drivers Assigned</span>
            <span className="text-sm font-medium">26/32</span>
          </div>
          <Progress value={81} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>81% allocated</span>
            <span>6 available</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Vehicles Deployed</span>
            <span className="text-sm font-medium">42/48</span>
          </div>
          <Progress value={87.5} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>87.5% allocated</span>
            <span>6 available</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Load Capacity Utilized</span>
            <span className="text-sm font-medium">74%</span>
          </div>
          <Progress value={74} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Average across fleet</span>
            <span>26% remaining</span>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Driver Status</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Active: 26</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="text-sm">On Break: 3</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Available: 6</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-500"></div>
              <span className="text-sm">Off Duty: 2</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Vehicle Status</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">In Service: 42</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Available: 6</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Maintenance: 3</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-500"></div>
              <span className="text-sm">Inactive: 1</span>
            </div>
          </div>
        </div>

        {/* Vehicle Utilization Metrics */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Vehicle Utilization Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground">Average Fuel Efficiency</div>
              <div className="text-xl font-bold mt-1">15 MPG</div>
              <div className="text-xs text-muted-foreground mt-1">Across all vehicles</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground">Maintenance Frequency</div>
              <div className="text-xl font-bold mt-1">Every 5,000 miles</div>
              <div className="text-xs text-muted-foreground mt-1">Standard for fleet</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 