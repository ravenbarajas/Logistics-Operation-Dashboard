import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  Legend,
} from "@tremor/react";
import {
  TruckIcon,
  PackageIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  UsersIcon,
  CircleDollarSignIcon,
  FuelIcon,
  AwardIcon,
  PieChartIcon,
} from "lucide-react";
import {
  ShipmentSummary,
  ShipmentPerformanceByMonth,
  ShipmentVolumeByRegion,
  TopCustomer,
  PerformanceMetrics,
  shipmentService,
} from "@/services/shipmentService";

export function ShipmentAnalytics() {
  const [summary, setSummary] = useState<ShipmentSummary | null>(null);
  const [performanceByMonth, setPerformanceByMonth] = useState<ShipmentPerformanceByMonth[]>([]);
  const [volumeByRegion, setVolumeByRegion] = useState<ShipmentVolumeByRegion[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          summaryData,
          performanceData,
          volumeData,
          customersData,
          metricsData
        ] = await Promise.all([
          shipmentService.getShipmentSummary(),
          shipmentService.getShipmentPerformanceByMonth(),
          shipmentService.getShipmentVolumeByRegion(),
          shipmentService.getTopCustomers(),
          shipmentService.getPerformanceMetrics()
        ]);

        setSummary(summaryData);
        setPerformanceByMonth(performanceData);
        setVolumeByRegion(volumeData);
        setTopCustomers(customersData);
        setPerformanceMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !summary) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format the delivery performance data for charts
  const deliveryPerformanceData = performanceByMonth.map(month => ({
    month: month.month,
    "On Time": month.onTimeDelivery,
    "Delayed": month.delayedDelivery,
    "Cancelled": month.cancelled,
    Total: month.totalShipments,
  }));

  // Format region data for charts
  const regionData = volumeByRegion.map(region => ({
    region: region.region,
    value: region.count,
    percentage: region.percentage,
  }));

  // Format top customers data for charts
  const customerData = topCustomers.map(customer => ({
    customer: customer.name,
    shipments: customer.shipments,
    distance: customer.totalDistance,
    deliveryTime: customer.averageDeliveryTime,
  }));

  return (
    <div className="space-y-6">
      {/* Shipment KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Shipments</p>
                <p className="text-3xl font-bold">{summary.totalShipments}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <PackageIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {summary.inTransit} In Transit
                </Badge>
                <Badge variant="outline">
                  {summary.pending} Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Time Rate</p>
                <p className="text-3xl font-bold">{summary.onTimeDeliveryRate}%</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                <AwardIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="destructive" className="mr-2">
                {summary.delayedShipments} Delayed
              </Badge>
              <Badge variant="default" className="bg-green-500">
                {summary.delivered} Delivered
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
                <p className="text-3xl font-bold">{summary.averageDeliveryTime} hrs</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                <ClockIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">
                Based on {summary.delivered} completed shipments
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Distance</p>
                <p className="text-3xl font-bold">{summary.totalDistance.toLocaleString()} mi</p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-full text-amber-500">
                <GlobeIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">
                Avg. {Math.round(summary.totalDistance / summary.totalShipments)} miles per shipment
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="performance">Delivery Performance</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
        </TabsList>

        {/* Performance Analysis Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                  Monthly Shipment Performance
                </CardTitle>
                <CardDescription>
                  Number of shipments by status over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  className="h-72"
                  data={deliveryPerformanceData}
                  index="month"
                  categories={["On Time", "Delayed", "Cancelled"]}
                  colors={["emerald", "amber", "rose"]}
                  valueFormatter={(value: number) => `${value} shipments`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <TruckIcon className="h-4 w-4 mr-2 text-primary" />
                  Delivery Performance Metrics
                </CardTitle>
                <CardDescription>
                  Key operational metrics for logistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Fuel Efficiency</p>
                    <div className="flex items-center">
                      <FuelIcon className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-2xl font-bold">{performanceMetrics?.fuelEfficiency}</span>
                      <span className="text-sm text-muted-foreground ml-1">mpg</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Load Utilization</p>
                    <div className="flex items-center">
                      <PieChartIcon className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-2xl font-bold">{performanceMetrics?.loadUtilization}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">CO2 Emissions</p>
                    <div className="flex items-center">
                      <GlobeIcon className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="text-2xl font-bold">{performanceMetrics?.co2Emissions}</span>
                      <span className="text-sm text-muted-foreground ml-1">tons</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Operational Costs</p>
                    <div className="flex items-center">
                      <CircleDollarSignIcon className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-2xl font-bold">${performanceMetrics?.operationalCosts.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">On-Time Delivery Rate Over Time</p>
                  <LineChart
                    className="h-40"
                    data={performanceByMonth}
                    index="month"
                    categories={["onTimeDelivery"]}
                    colors={["emerald"]}
                    valueFormatter={(value: number) => {
                      const febMonth = performanceByMonth.find(m => m.month === "Feb");
                      const totalShipments = febMonth?.totalShipments || 1;
                      return `${Math.round((value / totalShipments) * 100)}%`;
                    }}
                    showLegend={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Regional Analysis Tab */}
        <TabsContent value="regional" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <GlobeIcon className="h-4 w-4 mr-2 text-primary" />
                  Shipment Volume by Region
                </CardTitle>
                <CardDescription>
                  Distribution of shipments across geographic regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  className="h-80"
                  data={regionData}
                  category="value"
                  index="region"
                  colors={["indigo", "cyan", "amber", "emerald", "rose"]}
                  valueFormatter={(value: number) => `${value} shipments`}
                  label="Total Shipments"
                />
                <Legend
                  className="mt-4"
                  categories={regionData.map(r => r.region)}
                  colors={["indigo", "cyan", "amber", "emerald", "rose"]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <TruckIcon className="h-4 w-4 mr-2 text-primary" />
                  Regional Shipment Metrics
                </CardTitle>
                <CardDescription>
                  Performance metrics by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  className="h-80"
                  data={regionData}
                  index="region"
                  categories={["percentage"]}
                  colors={["blue"]}
                  valueFormatter={(value: number) => `${value}%`}
                  layout="vertical"
                  showLegend={false}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Insights Tab */}
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <UsersIcon className="h-4 w-4 mr-2 text-primary" />
                Top Customers by Shipment Volume
              </CardTitle>
              <CardDescription>
                Most active customers and their shipping metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-2 px-4 text-left font-medium">Customer</th>
                      <th className="py-2 px-4 text-left font-medium">Shipments</th>
                      <th className="py-2 px-4 text-left font-medium">Total Distance</th>
                      <th className="py-2 px-4 text-left font-medium">Avg. Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-2 px-4 font-medium">{customer.name}</td>
                        <td className="py-2 px-4">{customer.shipments}</td>
                        <td className="py-2 px-4">{customer.totalDistance.toLocaleString()} mi</td>
                        <td className="py-2 px-4">{customer.averageDeliveryTime} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Customer Shipment Comparison</p>
                <BarChart
                  className="h-60"
                  data={customerData}
                  index="customer"
                  categories={["shipments"]}
                  colors={["violet"]}
                  valueFormatter={(value: number) => `${value} shipments`}
                  showLegend={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 