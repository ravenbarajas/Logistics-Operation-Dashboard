import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import { BarChart } from "@/components/ui/bar-chart";

interface OptimizationComparisonProps {
  optimizationSummaryData: any; // Replace with your actual type
}

export function OptimizationComparison({ optimizationSummaryData }: OptimizationComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Optimization Comparison
        </CardTitle>
        <CardDescription>Before vs. After Optimization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <BarChart
            data={optimizationSummaryData} 
            index="name" 
            categories={["before", "after"]} 
            colors={["#94a3b8", "#3b82f6"]} 
            valueFormatter={(value: number) => `${value} hrs`}
            yAxisWidth={48}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Total Distance</div>
              <div className="text-2xl font-bold">1,100 km</div>
              <div className="text-xs text-green-500">-12% from baseline</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Total Time</div>
              <div className="text-2xl font-bold">18.8 hrs</div>
              <div className="text-xs text-green-500">-16.4% from baseline</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Fuel Usage</div>
              <div className="text-2xl font-bold">145 gal</div>
              <div className="text-xs text-green-500">-19.4% from baseline</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">CO₂ Emissions</div>
              <div className="text-2xl font-bold">1,485 kg</div>
              <div className="text-xs text-green-500">-19.3% from baseline</div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Efficiency Improvements</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Route Consolidation</span>
                <span className="text-sm font-medium text-green-500">+15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Load Balancing</span>
                <span className="text-sm font-medium text-green-500">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Traffic Avoidance</span>
                <span className="text-sm font-medium text-green-500">+8%</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Route Performance</div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Urban Routes</span>
                  <span className="text-sm font-medium text-amber-500">Medium</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: "65%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>65% Utilized</span>
                  <span>42 Deliveries</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Suburban Routes</span>
                  <span className="text-sm font-medium text-green-500">Optimal</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>85% Utilized</span>
                  <span>68 Deliveries</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Highway Routes</span>
                  <span className="text-sm font-medium text-red-500">Congested</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: "92%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>92% Utilized</span>
                  <span>74 Deliveries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 