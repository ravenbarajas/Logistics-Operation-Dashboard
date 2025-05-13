import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Settings, RefreshCw, Save, Play, Zap } from "lucide-react";

export function OptimizationEngine() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle>Route Optimization Engine</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            <Button size="sm" className="h-8">
              <Play className="h-4 w-4 mr-2" />
              Run Optimization
            </Button>
          </div>
        </div>
        <CardDescription>
          Advanced route optimization with machine learning algorithms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Optimization Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="optimization-strategy">Optimization Strategy</Label>
              <Select defaultValue="balanced">
                <SelectTrigger id="optimization-strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Minimize Distance (Dijkstra's Algorithm)</SelectItem>
                  <SelectItem value="time">Minimize Time (A* Search)</SelectItem>
                  <SelectItem value="fuel">Minimize Fuel (Genetic Algorithm)</SelectItem>
                  <SelectItem value="balanced">Balanced (Multi-Objective Optimization)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Vehicle Type</Label>
              <Select defaultValue="box-truck">
                <SelectTrigger id="vehicle-type">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery-van">Delivery Van (2.5T)</SelectItem>
                  <SelectItem value="box-truck">26ft Box Truck (12T)</SelectItem>
                  <SelectItem value="semi-truck">53ft Semi-Truck (40T)</SelectItem>
                  <SelectItem value="electric-van">Electric Delivery Van (3T)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Basic Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-stops">Maximum Stops</Label>
              <Input id="max-stops" type="number" defaultValue="10" min="1" max="50" />
              <p className="text-xs text-muted-foreground">Capacity: 50 stops per route</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-distance">Maximum Distance (mi)</Label>
              <Input id="max-distance" type="number" defaultValue="500" min="1" max="2000" />
              <p className="text-xs text-muted-foreground">Range: 1-2000 miles</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departure-time">Departure Time</Label>
              <Input id="departure-time" type="time" defaultValue="08:00" />
              <p className="text-xs text-muted-foreground">24-hour format</p>
            </div>
          </div>
          
          {/* Optimization Constraints */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Optimization Constraints</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time-window">Time Window (hrs)</Label>
                <Input id="time-window" type="number" defaultValue="8" min="1" max="24" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="load-capacity">Load Capacity (%)</Label>
                <Input id="load-capacity" type="number" defaultValue="85" min="0" max="100" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="avoid-tolls" />
                <label htmlFor="avoid-tolls" className="text-sm font-medium leading-none">
                  Avoid Tolls
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="avoid-highways" />
                <label htmlFor="avoid-highways" className="text-sm font-medium leading-none">
                  Avoid Highways
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="prioritize-deliveries" defaultChecked />
                <label htmlFor="prioritize-deliveries" className="text-sm font-medium leading-none">
                  Prioritize Time-Sensitive Deliveries
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="consider-traffic" defaultChecked />
                <label htmlFor="consider-traffic" className="text-sm font-medium leading-none">
                  Consider Real-time Traffic
                </label>
              </div>
            </div>
          </div>
          
          {/* Advanced Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Advanced Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="algorithm-complexity">Algorithm Complexity</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="algorithm-complexity">
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Faster, Less Optimal)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Slower, More Optimal)</SelectItem>
                    <SelectItem value="extreme">Extreme (Maximum Optimization)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="optimization-timeout">Optimization Timeout (s)</Label>
                <Input id="optimization-timeout" type="number" defaultValue="30" min="5" max="300" />
                <p className="text-xs text-muted-foreground">Maximum time to find solution</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="optimization-weights">Optimization Weights</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Distance</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <Progress value={40} className="h-2 [&>div]:bg-blue-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Time</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <Progress value={35} className="h-2 [&>div]:bg-green-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cost</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2 [&>div]:bg-amber-500" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Traffic Data Sources</Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="google-traffic" defaultChecked />
                  <label htmlFor="google-traffic" className="text-sm font-medium leading-none">
                    Google Maps
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="tomtom-traffic" defaultChecked />
                  <label htmlFor="tomtom-traffic" className="text-sm font-medium leading-none">
                    TomTom
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="here-traffic" />
                  <label htmlFor="here-traffic" className="text-sm font-medium leading-none">
                    HERE Maps
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="historical-traffic" defaultChecked />
                  <label htmlFor="historical-traffic" className="text-sm font-medium leading-none">
                    Historical Data
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Optimization Preview */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Optimization Preview</h4>
            <div className="border rounded-md p-4 bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2">Current Route</div>
                  <div className="h-24 bg-background rounded-md flex items-center justify-center border">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">12 stops</div>
                      <div className="text-sm text-muted-foreground">342 miles</div>
                      <div className="text-sm text-muted-foreground">6.2 hours</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Optimized Route</div>
                  <div className="h-24 bg-background rounded-md flex items-center justify-center border border-green-500/30">
                    <div className="text-center">
                      <div className="text-sm text-green-500">12 stops</div>
                      <div className="text-sm text-green-500">298 miles (-12.9%)</div>
                      <div className="text-sm text-green-500">5.1 hours (-17.7%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Algorithm Performance Metrics */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Algorithm Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Computation Time</div>
                <div className="text-2xl font-bold">1.2s</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Memory Usage</div>
                <div className="text-2xl font-bold">256MB</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Iterations</div>
                <div className="text-2xl font-bold">1,245</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Convergence</div>
                <div className="text-2xl font-bold">98.5%</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="flex items-center">
          <Zap className="mr-2 h-4 w-4" />
          Optimize Routes
        </Button>
      </CardFooter>
    </Card>
  );
} 