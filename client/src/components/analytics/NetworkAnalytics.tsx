import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  BarChart, 
  AreaChart, 
  LineChart,
  DonutChart,
  Legend,
  type ValueFormatter
} from "@tremor/react";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  TrendingUp,
  Network,
  Layers,
  Globe,
  Timer,
  AlertTriangle,
  BarChart4,
  MapPin,
  Truck
} from "lucide-react";

interface NetworkMetric {
  name: string;
  value: string;
  change: number;
  status: string;
}

interface HubData {
  hub: string;
  throughput: number;
  utilization: number;
  deliveryTime: number;
  delayRate: number;
}

interface RouteData {
  route: string;
  volume: number;
  time: number;
  distance: number;
  cost: number;
  congestion: number;
}

interface NetworkAnalyticsProps {
  networkMetrics: NetworkMetric[];
  hubPerformance: HubData[];
  routePerformance: RouteData[];
  networkVolume: { date: string; volume: number | null; forecast: number | null }[];
  bottlenecks: { location: string; severity: number; impactedShipments: number; avgDelay: number }[];
  connectionMatrix: { from: string; to: string; strength: number; volume: number }[];
}

const NetworkAnalytics: React.FC<NetworkAnalyticsProps> = ({
  networkMetrics,
  hubPerformance,
  routePerformance,
  networkVolume,
  bottlenecks,
  connectionMatrix
}) => {
  // Prepare data for visualizations
  const hubThroughputData = hubPerformance.map(hub => ({
    hub: hub.hub,
    throughput: hub.throughput
  }));

  const hubUtilizationData = hubPerformance.map(hub => ({
    hub: hub.hub,
    utilization: hub.utilization
  }));

  const bottleneckData = bottlenecks.map(b => ({
    location: b.location,
    severity: b.severity,
    impactedShipments: b.impactedShipments
  }));

  const routeCongestionData = routePerformance.map(route => ({
    route: route.route,
    congestion: route.congestion,
    volume: route.volume
  }));

  const routeEfficiencyData = routePerformance.map(route => ({
    route: route.route,
    cost: route.cost,
    time: route.time,
    distance: route.distance
  }));

  return (
    <div className="space-y-6">
      {/* Network KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {networkMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center ${
                  metric.status === 'positive' ? 'text-green-500' : 
                  metric.status === 'negative' ? 'text-red-500' : 
                  'text-gray-500'
                }`}>
                  {metric.status === 'positive' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : metric.status === 'negative' ? (
                    <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                  ) : (
                    <Activity className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm">{Math.abs(metric.change)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Volume Trends */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            Network Volume Analysis
          </CardTitle>
          <CardDescription>
            Historical and forecasted network volume over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChart
            className="h-72"
            data={networkVolume}
            index="date"
            categories={["volume", "forecast"]}
            colors={["indigo", "cyan"]}
            valueFormatter={(value: number) => `${value?.toLocaleString() || 0} shipments`}
          />
        </CardContent>
      </Card>

      {/* Main Network Analytics Tabs */}
      <Tabs defaultValue="hubs">
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="hubs">
            <Globe className="h-4 w-4 mr-2" />
            Hub Performance
          </TabsTrigger>
          <TabsTrigger value="bottlenecks">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Network Bottlenecks
          </TabsTrigger>
          <TabsTrigger value="routes">
            <Truck className="h-4 w-4 mr-2" />
            Route Performance
          </TabsTrigger>
        </TabsList>
        
        {/* Hub Analytics Tab */}
        <TabsContent value="hubs">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                Hub Performance Analytics
              </CardTitle>
              <CardDescription>
                Performance metrics across distribution hubs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="throughput" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="throughput">Throughput</TabsTrigger>
                  <TabsTrigger value="utilization">Utilization</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery Time</TabsTrigger>
                  <TabsTrigger value="delays">Delay Rate</TabsTrigger>
                </TabsList>
                
                <TabsContent value="throughput">
                  <div className="h-60">
                    <BarChart
                      className="h-52"
                      data={hubThroughputData}
                      index="hub"
                      categories={["throughput"]}
                      colors={["blue"]}
                      valueFormatter={(value: number) => `${value.toLocaleString()} units`}
                      layout="vertical"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="utilization">
                  <div className="h-60">
                    <BarChart
                      className="h-52"
                      data={hubUtilizationData}
                      index="hub"
                      categories={["utilization"]}
                      colors={["emerald"]}
                      valueFormatter={(value: number) => `${value}%`}
                      layout="vertical"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="delivery">
                  <div className="h-60">
                    <BarChart
                      className="h-52"
                      data={hubPerformance}
                      index="hub"
                      categories={["deliveryTime"]}
                      colors={["amber"]}
                      valueFormatter={(value: number) => `${value.toFixed(1)} hrs`}
                      layout="vertical"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="delays">
                  <div className="h-60">
                    <BarChart
                      className="h-52"
                      data={hubPerformance}
                      index="hub"
                      categories={["delayRate"]}
                      colors={["rose"]}
                      valueFormatter={(value: number) => `${value.toFixed(1)}%`}
                      layout="vertical"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Bottleneck Analysis Tab */}
        <TabsContent value="bottlenecks">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                Network Bottleneck Analysis
              </CardTitle>
              <CardDescription>
                Critical congestion points impacting logistics flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Bottleneck Severity (1-10)</h3>
                  <BarChart
                    className="h-60"
                    data={bottleneckData}
                    index="location"
                    categories={["severity"]}
                    colors={["rose"]}
                    valueFormatter={(value: number) => `${value.toFixed(1)}/10`}
                    layout="vertical"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Impacted Shipments</h3>
                  <BarChart
                    className="h-60"
                    data={bottleneckData}
                    index="location"
                    categories={["impactedShipments"]}
                    colors={["amber"]}
                    valueFormatter={(value: number) => `${value.toLocaleString()}`}
                    layout="vertical"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Route Analytics Tab */}
        <TabsContent value="routes">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                Route Performance Analysis
              </CardTitle>
              <CardDescription>
                Performance metrics across key logistics routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="congestion" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="congestion">Congestion</TabsTrigger>
                  <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                </TabsList>
                
                <TabsContent value="congestion">
                  <div className="h-60">
                    <BarChart
                      className="h-52"
                      data={routeCongestionData}
                      index="route"
                      categories={["congestion"]}
                      colors={["rose"]}
                      valueFormatter={(value: number) => `${value.toFixed(1)}%`}
                      layout="vertical"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="efficiency">
                  <div className="h-60">
                    <BarChart
                      className="h-52"
                      data={routeEfficiencyData}
                      index="route"
                      categories={["cost", "time"]}
                      colors={["indigo", "amber"]}
                      valueFormatter={(value: number, category?: string) => 
                        category === "cost" 
                          ? `$${value.toFixed(2)}/mile` 
                          : `${value.toFixed(1)} hrs`
                      }
                      layout="vertical"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkAnalytics; 