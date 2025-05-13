import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, Calculator, MapPin } from "lucide-react";
import { RouteComparisonMap } from "@/components/maps/RouteComparisonMap";

interface OptimizationResultsProps {
  routeComparisonData: any; // Use your actual type here
}

export function OptimizationResults({ routeComparisonData }: OptimizationResultsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-7">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-500" />
              Optimization Results
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Live
            </Badge>
          </div>
          <CardDescription>Real-time savings and improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Distance Saved</div>
                <div className="text-2xl font-bold">152 mi</div>
                <div className="text-xs text-green-500">12.9% improvement</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Time Saved</div>
                <div className="text-2xl font-bold">18.2 hrs</div>
                <div className="text-xs text-green-500">17.7% improvement</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Fuel Saved</div>
                <div className="text-2xl font-bold">36.5 gal</div>
                <div className="text-xs text-green-500">19.4% improvement</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">CO₂ Reduced</div>
                <div className="text-2xl font-bold">356 kg</div>
                <div className="text-xs text-green-500">19.3% improvement</div>
              </div>
            </div>
          
            <div className="border-t pt-4">
              <div className="text-sm font-medium mb-2">Route Comparison</div>
              <div className="h-[180px] relative">
                <RouteComparisonMap height="160px" optimizationData={routeComparisonData} />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="text-sm font-medium mb-2">Routes Optimized</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 h-2 w-2 rounded-full p-0" />
                    <span className="text-sm">RT-1043: Downtown Circuit</span>
                  </div>
                  <span className="text-sm text-green-500">+24% efficiency</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 h-2 w-2 rounded-full p-0" />
                    <span className="text-sm">RT-3842: North District</span>
                  </div>
                  <span className="text-sm text-green-500">+19% efficiency</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 h-2 w-2 rounded-full p-0" />
                    <span className="text-sm">RT-5621: East Suburban</span>
                  </div>
                  <span className="text-sm text-green-500">+16% efficiency</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-500" />
            Cost Analysis
          </CardTitle>
          <CardDescription>Financial impact of optimizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-md bg-muted/30">
                <div className="text-xs text-muted-foreground">Monthly Savings</div>
                <div className="text-2xl font-bold">$14,325</div>
                <div className="text-xs text-green-500">+8.2% from last month</div>
              </div>
              <div className="p-3 rounded-md bg-muted/30">
                <div className="text-xs text-muted-foreground">Yearly Projection</div>
                <div className="text-2xl font-bold">$171,900</div>
                <div className="text-xs text-green-500">+12.4% YoY</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Fuel Cost Savings</span>
                  <span className="text-sm font-medium">$5,840</span>
                </div>
                <Progress value={42} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">42% of total savings</div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Labor Cost Savings</span>
                  <span className="text-sm font-medium">$6,325</span>
                </div>
                <Progress value={45} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">45% of total savings</div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Maintenance Savings</span>
                  <span className="text-sm font-medium">$1,830</span>
                </div>
                <Progress value={13} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">13% of total savings</div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="text-sm font-medium mb-2">ROI Analysis</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Implementation Cost</div>
                  <div className="text-xl font-medium">$42,500</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Break-even Point</div>
                  <div className="text-xl font-medium">3.2 months</div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="text-sm font-medium mb-2">Efficiency Metrics</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Cost per mile reduced by</span>
                </div>
                <span className="text-sm font-medium text-green-500">$0.18 (16.4%)</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Cost per delivery reduced by</span>
                </div>
                <span className="text-sm font-medium text-green-500">$1.24 (12.8%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing Progress component
function Progress({ value, className }: { value: number, className?: string }) {
  return (
    <div className={`h-2 w-full bg-muted rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-primary rounded-full" 
        style={{ width: `${value}%` }}
      />
    </div>
  );
} 