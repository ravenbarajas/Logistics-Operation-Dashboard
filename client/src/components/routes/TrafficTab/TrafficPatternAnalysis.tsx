import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart } from "@/components/ui/line-chart";
import { TrafficRoad } from "@/components/routes/types";
import { Info } from "lucide-react";

const trafficPatternData = [
  { time: "6 AM", speed: 22, volume: 18, delay: 13 },
  { time: "9 AM", speed: 36, volume: 24, delay: 15 },
  { time: "12 PM", speed: 30, volume: 22, delay: 14 },
  { time: "3 PM", speed: 32, volume: 23, delay: 14 },
  { time: "6 PM", speed: 37, volume: 26, delay: 15 },
  { time: "9 PM", speed: 24, volume: 19, delay: 13 }
];

export function TrafficPatternAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Traffic Pattern Analysis
        </CardTitle>
        <CardDescription>Average travel times across time periods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <LineChart
            data={trafficPatternData}
            index="time"
            categories={["speed", "volume", "delay"]}
            colors={["#3b82f6", "#f59e0b", "#ef4444"]}
            valueFormatter={(value: number) => value.toFixed(1)}
            yAxisWidth={48}
          />
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Urban Routes</div>
              <div className="text-2xl font-bold">32 min</div>
              <div className="text-xs text-muted-foreground">Peak: 37 min</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Suburban Routes</div>
              <div className="text-2xl font-bold">22 min</div>
              <div className="text-xs text-muted-foreground">Peak: 26 min</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Highway Routes</div>
              <div className="text-2xl font-bold">14 min</div>
              <div className="text-xs text-muted-foreground">Peak: 15 min</div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Traffic Insights</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="w-2 h-2 rounded-full bg-red-500 p-0" />
                <span className="text-sm">Urban routes show highest variability</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="w-2 h-2 rounded-full bg-orange-500 p-0" />
                <span className="text-sm">Suburban routes peak during rush hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="w-2 h-2 rounded-full bg-blue-500 p-0" />
                <span className="text-sm">Highway routes remain most consistent</span>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="text-sm font-medium mb-1">Recommendations</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Schedule urban deliveries outside peak hours (10 AM - 3 PM)</li>
              <li>• Optimize suburban routes for morning/evening commutes</li>
              <li>• Prioritize highway routes during rush hours</li>
            </ul>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Traffic Congestion Index</div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Morning Rush (7-9 AM)</span>
                  <span className="text-sm font-medium text-red-500">High</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: "85%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>85% Congestion</span>
                  <span>+12% from baseline</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Midday (11 AM - 3 PM)</span>
                  <span className="text-sm font-medium text-amber-500">Medium</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: "65%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>65% Congestion</span>
                  <span>-5% from baseline</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Evening Rush (4-7 PM)</span>
                  <span className="text-sm font-medium text-red-500">High</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: "90%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>90% Congestion</span>
                  <span>+18% from baseline</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Weather Impact</div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">Rainy Conditions</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: "75%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>+25% delay</span>
                    <span>Affects 15% of routes</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">Clear Conditions</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "95%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>+5% delay</span>
                    <span>Affects 85% of routes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Traffic Prediction</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Short-term (24h)</span>
                <span className="text-sm font-medium text-green-500">92% accuracy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Medium-term (7d)</span>
                <span className="text-sm font-medium text-amber-500">78% accuracy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Long-term (30d)</span>
                <span className="text-sm font-medium text-red-500">65% accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 