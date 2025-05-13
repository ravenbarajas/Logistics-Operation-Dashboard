import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Compass } from "lucide-react";
import { BarChart } from "@/components/ui/bar-chart";
import { GeoDistribution } from "@/components/maps/GeoDistribution";

interface EfficiencyImprovementsProps {
  efficiencyImprovementData: any; // Replace with your actual type
}

export function EfficiencyImprovements({ efficiencyImprovementData }: EfficiencyImprovementsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Route Efficiency Improvements
          </CardTitle>
          <CardDescription>Savings per route after optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={efficiencyImprovementData}
            index="name"
            categories={["distance", "time", "fuel", "emissions"]}
            colors={["indigo", "rose", "amber", "emerald"]}
            valueFormatter={(value: number) => value.toLocaleString()}
            yAxisWidth={48}
          />
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center">
              <Badge className="w-2 h-2 rounded-full bg-blue-500 mr-1 p-0" />
              <span>Distance Saved</span>
            </div>
            <div className="flex items-center">
              <Badge className="w-2 h-2 rounded-full bg-orange-500 mr-1 p-0" />
              <span>Time Saved</span>
            </div>
            <div className="flex items-center">
              <Badge className="w-2 h-2 rounded-full bg-green-600 mr-1 p-0" />
              <span>Fuel Saved</span>
            </div>
            <div className="flex items-center">
              <Badge className="w-2 h-2 rounded-full bg-gray-500 mr-1 p-0" />
              <span>Emissions Reduced</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            Geo-Spatial Distribution
          </CardTitle>
          <CardDescription>Route density and geographic distribution</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <GeoDistribution height="370px" />
        </CardContent>
      </Card>
    </div>
  );
} 