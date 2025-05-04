import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "../../ui/card";
import { Progress } from "../../ui/progress";
import {
  Gauge,
  Battery,
  Route,
  TrendingUp,
  TrendingDown,
  Truck,
  Car
} from "lucide-react";

export function EfficiencyTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Gauge className="h-4 w-4 mr-2 text-primary" />
            Fleet Efficiency Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Heavy Trucks - MPG</span>
                <span className="text-sm font-medium">12.5 MPG</span>
              </div>
              <Progress value={42} className="h-1.5" />
              <div className="flex items-center justify-end mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+0.8 MPG from last quarter</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Medium Trucks - MPG</span>
                <span className="text-sm font-medium">16.8 MPG</span>
              </div>
              <Progress value={56} className="h-1.5" />
              <div className="flex items-center justify-end mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+1.2 MPG from last quarter</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Light Vans - MPG</span>
                <span className="text-sm font-medium">23.5 MPG</span>
              </div>
              <Progress value={78} className="h-1.5" />
              <div className="flex items-center justify-end mt-1">
                <TrendingDown className="h-3 w-3 text-amber-500 mr-1" />
                <span className="text-xs text-amber-600">-0.5 MPG from last quarter</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            Efficiency Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <div className="flex items-center">
                <Battery className="h-4 w-4 text-blue-600 dark:text-blue-500 mr-2" />
                <div className="text-sm font-medium text-blue-800 dark:text-blue-400">Idle Time Reduction</div>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-400 mt-1">
                Reducing engine idle time by 10% could save approximately 120 gallons of fuel per month across the fleet.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3">
              <div className="flex items-center">
                <Route className="h-4 w-4 text-green-600 dark:text-green-500 mr-2" />
                <div className="text-sm font-medium text-green-800 dark:text-green-400">Route Optimization</div>
              </div>
              <p className="text-xs text-green-800 dark:text-green-400 mt-1">
                Optimizing delivery routes could improve fuel efficiency by up to 15% for the distribution department.
              </p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
              <div className="flex items-center">
                <Gauge className="h-4 w-4 text-amber-600 dark:text-amber-500 mr-2" />
                <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Tire Pressure Monitoring</div>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
                Regular tire pressure checks could improve MPG by 3.3% across the fleet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 