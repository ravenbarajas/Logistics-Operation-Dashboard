import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Truck, Clock, FuelIcon } from "lucide-react";

export function ResourceUtilization() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <VehicleUtilization />
      <TimeWindowAnalysis />
      <EnergyEmissions />
    </div>
  );
}

export function VehicleUtilization() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Vehicle Utilization
        </CardTitle>
        <CardDescription>Fleet allocation efficiency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">26ft Box Trucks</span>
              <span className="text-sm font-medium">78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Delivery Vans</span>
              <span className="text-sm font-medium">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">53ft Semi-Trucks</span>
              <span className="text-sm font-medium">65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Electric Vans</span>
              <span className="text-sm font-medium">84%</span>
            </div>
            <Progress value={84} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Refrigerated Trucks</span>
              <span className="text-sm font-medium">71%</span>
            </div>
            <Progress value={71} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TimeWindowAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Time Window Analysis
        </CardTitle>
        <CardDescription>Delivery time slot optimization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="pt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Morning (6AM-10AM)</span>
              <span className="text-sm font-medium text-amber-500">Medium</span>
            </div>
            <Progress value={65} className="h-2 bg-muted" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>65% Utilized</span>
              <span>42 Deliveries</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Midday (10AM-2PM)</span>
              <span className="text-sm font-medium text-green-500">Optimal</span>
            </div>
            <Progress value={85} className="h-2 bg-muted" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>85% Utilized</span>
              <span>68 Deliveries</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Afternoon (2PM-6PM)</span>
              <span className="text-sm font-medium text-red-500">Congested</span>
            </div>
            <Progress value={92} className="h-2 bg-muted" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>92% Utilized</span>
              <span>74 Deliveries</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Evening (6PM-10PM)</span>
              <span className="text-sm font-medium text-blue-500">Low Traffic</span>
            </div>
            <Progress value={55} className="h-2 bg-muted" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>55% Utilized</span>
              <span>38 Deliveries</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EnergyEmissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FuelIcon className="h-5 w-5 text-primary" />
          Energy & Emissions
        </CardTitle>
        <CardDescription>Environmental impact analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="pt-2 pb-6">
          <div className="rounded-full h-36 w-36 mx-auto relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="h-36 w-36" viewBox="0 0 100 100">
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
                  strokeDashoffset="70" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">-25%</div>
              <div className="text-xs text-muted-foreground mt-1">CO₂ REDUCTION</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <div className="text-lg font-bold">78%</div>
              <div className="text-xs text-muted-foreground">Route Efficiency</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <div className="text-lg font-bold">22%</div>
              <div className="text-xs text-muted-foreground">Electric Vehicles</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 