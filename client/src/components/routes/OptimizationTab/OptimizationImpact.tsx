import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TrendingDown, DollarSign } from "lucide-react";

export function OptimizationImpact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-green-500" />
          Optimization Impact
        </CardTitle>
        <CardDescription>Real-time optimization metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total Routes</div>
            <div className="text-2xl font-bold">186</div>
            <div className="text-xs text-green-500">+12% from last week</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Active Vehicles</div>
            <div className="text-2xl font-bold">42</div>
            <div className="text-xs text-green-500">92% utilization</div>
          </div>
        </div>
        
        {/* Optimization Metrics */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Distance Reduction</span>
              <span className="text-sm text-green-500 font-medium">12%</span>
            </div>
            <Progress value={12} className="h-2 [&>div]:bg-green-500" />
            <div className="text-xs text-muted-foreground mt-1">Saved 1,245 miles this week</div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Fuel Savings</span>
              <span className="text-sm text-green-500 font-medium">19.2%</span>
            </div>
            <Progress value={19.2} className="h-2 [&>div]:bg-green-500" />
            <div className="text-xs text-muted-foreground mt-1">Saved 342 gallons this week</div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Time Efficiency</span>
              <span className="text-sm text-green-500 font-medium">16.4%</span>
            </div>
            <Progress value={16.4} className="h-2 [&>div]:bg-green-500" />
            <div className="text-xs text-muted-foreground mt-1">Saved 124 hours this week</div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">CO₂ Emissions</span>
              <span className="text-sm text-green-500 font-medium">19.3%</span>
            </div>
            <Progress value={19.3} className="h-2 [&>div]:bg-green-500" />
            <div className="text-xs text-muted-foreground mt-1">Reduced by 3.2 tons this week</div>
          </div>
        </div>
        
        {/* Cost Analysis */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Cost Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Fuel Cost</div>
              <div className="text-2xl font-bold">$8,245</div>
              <div className="text-xs text-green-500">Saved $1,945</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Labor Cost</div>
              <div className="text-2xl font-bold">$12,480</div>
              <div className="text-xs text-green-500">Saved $2,080</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Maintenance</div>
              <div className="text-2xl font-bold">$3,560</div>
              <div className="text-xs text-green-500">Saved $720</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Tolls & Fees</div>
              <div className="text-2xl font-bold">$1,850</div>
              <div className="text-xs text-green-500">Saved $580</div>
            </div>
          </div>
          
          <div className="mt-4 py-3 px-4 bg-muted rounded-md">
            <div className="text-sm font-medium mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-green-500" />
              Total Monthly Savings
            </div>
            <div className="text-2xl font-bold">$14,325</div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on 186 optimized routes
            </div>
          </div>
        </div>
        
        {/* Savings Forecast */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Savings Forecast</h4>
          <div className="grid grid-cols-3 gap-2 text-center mb-2">
            <div className="text-xs text-muted-foreground">Monthly</div>
            <div className="text-xs text-muted-foreground">Quarterly</div>
            <div className="text-xs text-muted-foreground">Yearly</div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="text-lg font-bold">$14,325</div>
            <div className="text-lg font-bold">$42,975</div>
            <div className="text-lg font-bold">$171,900</div>
          </div>
          <Separator className="my-3" />
          <div className="text-xs text-center text-muted-foreground pt-1">
            Projections based on current optimization patterns and route volume
          </div>
        </div>
        
        {/* Environmental Impact */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Environmental Impact</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">CO₂ Reduction</div>
              <div className="text-2xl font-bold">3.2 tons</div>
              <div className="text-xs text-green-500">19.3% reduction</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Fuel Efficiency</div>
              <div className="text-2xl font-bold">18.4 mpg</div>
              <div className="text-xs text-green-500">+2.1 mpg improvement</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Equivalent to planting 42 trees or removing 1.2 cars from the road annually
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 