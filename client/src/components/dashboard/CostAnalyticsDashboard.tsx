import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { 
  CreditCard, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  BarChart4,
  LineChart,
  Truck,
  AlertCircle
} from "lucide-react";
import { costAnalysisData, maintenanceCostByVehicleType, costPerMileData, fleetData } from "@/data/mock-data";

interface CostAnalyticsDashboardProps {
  period: string;
  isDataLoaded: boolean;
}

export default function CostAnalyticsDashboard({ period, isDataLoaded }: CostAnalyticsDashboardProps) {
  const [currentView, setCurrentView] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState("total");
  const [costsLoaded, setCostsLoaded] = useState(false);
  
  const costBreakdownChartRef = useRef<HTMLDivElement>(null);
  const costTrendChartRef = useRef<HTMLDivElement>(null);
  const costPerMileChartRef = useRef<HTMLDivElement>(null);
  const maintenanceBreakdownRef = useRef<HTMLDivElement>(null);
  
  const currentPeriodData = costAnalysisData.slice(-1)[0];
  const previousPeriodData = costAnalysisData.slice(-2)[0];
  
  // Calculate totals and changes
  const totalCurrentCosts = currentPeriodData.fuel + currentPeriodData.maintenance + 
                          currentPeriodData.labor + currentPeriodData.insurance + 
                          currentPeriodData.other;
  const totalPreviousCosts = previousPeriodData.fuel + previousPeriodData.maintenance + 
                           previousPeriodData.labor + previousPeriodData.insurance + 
                           previousPeriodData.other;
  const totalChange = ((totalCurrentCosts - totalPreviousCosts) / totalPreviousCosts) * 100;
  
  // Calculate cost per delivery metrics
  const deliveriesThisMonth = 4250;
  const deliveriesLastMonth = 4120;
  const costPerDelivery = (totalCurrentCosts / deliveriesThisMonth).toFixed(2);
  const costPerDeliveryLastMonth = (totalPreviousCosts / deliveriesLastMonth).toFixed(2);
  const costPerDeliveryChange = ((parseFloat(costPerDelivery) - parseFloat(costPerDeliveryLastMonth)) / parseFloat(costPerDeliveryLastMonth)) * 100;
  
  // Calculate cost distributions
  const fuelPercentage = Math.round((currentPeriodData.fuel / totalCurrentCosts) * 100);
  const maintenancePercentage = Math.round((currentPeriodData.maintenance / totalCurrentCosts) * 100);
  const laborPercentage = Math.round((currentPeriodData.labor / totalCurrentCosts) * 100);
  const insurancePercentage = Math.round((currentPeriodData.insurance / totalCurrentCosts) * 100);
  const otherPercentage = Math.round((currentPeriodData.other / totalCurrentCosts) * 100);
  
  // Format currency function
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Initialize charts
  useEffect(() => {
    if (isDataLoaded && window.ApexCharts) {
      setCostsLoaded(true);
      
      // Cost breakdown chart
      if (costBreakdownChartRef.current) {
        const chart = new window.ApexCharts(costBreakdownChartRef.current, {
          series: [{
            name: 'Cost',
            data: [
              currentPeriodData.fuel,
              currentPeriodData.maintenance,
              currentPeriodData.labor,
              currentPeriodData.insurance,
              currentPeriodData.other
            ]
          }],
          chart: {
            type: 'bar',
            height: 230,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '60%',
              borderRadius: 4,
              distributed: true,
            }
          },
          colors: ['#0ea5e9', '#a855f7', '#10b981', '#f59e0b', '#6b7280'],
          dataLabels: {
            enabled: true,
            formatter: function(val: number) {
              return formatCurrency(val);
            },
            offsetX: 10,
            style: {
              fontSize: '11px',
              fontFamily: 'inherit',
              fontWeight: 'normal',
            }
          },
          xaxis: {
            categories: ['Fuel', 'Maintenance', 'Labor', 'Insurance', 'Other'],
            labels: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          legend: {
            show: false
          }
        });
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
      
      // Cost trend chart
      if (costTrendChartRef.current) {
        const chart = new window.ApexCharts(costTrendChartRef.current, {
          series: [
            {
              name: 'Fuel',
              data: costAnalysisData.map(d => d.fuel)
            },
            {
              name: 'Maintenance',
              data: costAnalysisData.map(d => d.maintenance)
            },
            {
              name: 'Labor',
              data: costAnalysisData.map(d => d.labor)
            },
            {
              name: 'Insurance',
              data: costAnalysisData.map(d => d.insurance)
            },
            {
              name: 'Other',
              data: costAnalysisData.map(d => d.other)
            }
          ],
          chart: {
            type: 'line',
            height: 240,
            toolbar: {
              show: false
            },
            animations: {
              enabled: true
            },
            stacked: false
          },
          stroke: {
            width: [3, 3, 3, 3, 3],
            curve: 'smooth'
          },
          colors: ['#0ea5e9', '#a855f7', '#10b981', '#f59e0b', '#6b7280'],
          xaxis: {
            categories: costAnalysisData.map(d => d.month)
          },
          yaxis: {
            labels: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return formatCurrency(val);
              }
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '13px',
            fontFamily: 'inherit',
            itemMargin: {
              horizontal: 10
            }
          }
        });
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
      
      // Cost per mile chart
      if (costPerMileChartRef.current) {
        const chart = new window.ApexCharts(costPerMileChartRef.current, {
          series: [
            {
              name: 'Heavy Truck',
              data: costPerMileData.map(d => d.heavyTruck)
            },
            {
              name: 'Medium Truck',
              data: costPerMileData.map(d => d.mediumTruck)
            },
            {
              name: 'Delivery Van',
              data: costPerMileData.map(d => d.deliveryVan)
            },
            {
              name: 'Electric',
              data: costPerMileData.map(d => d.electric)
            }
          ],
          chart: {
            type: 'area',
            height: 240,
            toolbar: {
              show: false
            },
            stacked: false
          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          fill: {
            type: 'gradient',
            gradient: {
              opacityFrom: 0.5,
              opacityTo: 0.2
            }
          },
          colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
          xaxis: {
            categories: costPerMileData.map(d => d.month)
          },
          yaxis: {
            labels: {
              formatter: function(val: number) {
                return '$' + val.toFixed(2);
              }
            },
            min: 0.5,
            max: 2.0,
            tickAmount: 5
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return '$' + val.toFixed(2) + ' per mile';
              }
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '13px',
            fontFamily: 'inherit'
          }
        });
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
      
      // Maintenance breakdown chart
      if (maintenanceBreakdownRef.current) {
        const chart = new window.ApexCharts(maintenanceBreakdownRef.current, {
          series: [
            {
              name: 'Preventive',
              data: maintenanceCostByVehicleType.map(d => d.preventive)
            },
            {
              name: 'Corrective',
              data: maintenanceCostByVehicleType.map(d => d.corrective)
            },
            {
              name: 'Emergency',
              data: maintenanceCostByVehicleType.map(d => d.emergency)
            }
          ],
          chart: {
            type: 'bar',
            height: 230,
            stacked: true,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '70%',
              borderRadius: 3
            }
          },
          colors: ['#10b981', '#f59e0b', '#ef4444'],
          xaxis: {
            categories: maintenanceCostByVehicleType.map(d => d.type)
          },
          yaxis: {
            title: {
              text: 'Percentage (%)'
            },
            max: 100
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return val + '%';
              }
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '13px',
            fontFamily: 'inherit'
          },
          dataLabels: {
            enabled: false
          }
        });
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
    }
  }, [isDataLoaded, costsLoaded, period, currentPeriodData]);
  
  return (
    <div className="space-y-4">
      {/* Cost Analytics KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cost Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalCurrentCosts)}</h3>
                <div className="flex items-center text-xs mt-1">
                  <Badge variant={totalChange < 0 ? "success" : "destructive"} className="font-mono ml-0">
                    {totalChange < 0 ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                    {Math.abs(totalChange).toFixed(1)}%
                  </Badge>
                  <span className="text-muted-foreground ml-2">vs. previous period</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-1 text-xs">
              <div className="flex flex-col items-center text-center">
                <div className="h-1.5 w-full rounded-sm bg-sky-500 mb-1"></div>
                <span className="text-[10px] text-muted-foreground">Fuel</span>
                <span className="font-medium">{fuelPercentage}%</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-1.5 w-full rounded-sm bg-purple-500 mb-1"></div>
                <span className="text-[10px] text-muted-foreground">Maint.</span>
                <span className="font-medium">{maintenancePercentage}%</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-1.5 w-full rounded-sm bg-emerald-500 mb-1"></div>
                <span className="text-[10px] text-muted-foreground">Labor</span>
                <span className="font-medium">{laborPercentage}%</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-1.5 w-full rounded-sm bg-amber-500 mb-1"></div>
                <span className="text-[10px] text-muted-foreground">Insur.</span>
                <span className="font-medium">{insurancePercentage}%</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-1.5 w-full rounded-sm bg-gray-500 mb-1"></div>
                <span className="text-[10px] text-muted-foreground">Other</span>
                <span className="font-medium">{otherPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Per Delivery Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Per Delivery</p>
                <h3 className="text-2xl font-bold mt-1">${costPerDelivery}</h3>
                <div className="flex items-center text-xs mt-1">
                  <Badge variant={costPerDeliveryChange < 0 ? "success" : "destructive"} className="font-mono ml-0">
                    {costPerDeliveryChange < 0 ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                    {Math.abs(costPerDeliveryChange).toFixed(1)}%
                  </Badge>
                  <span className="text-muted-foreground ml-2">vs. previous period</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Target: $28.75</span>
                <span className="font-medium">
                  {Math.round(28.75 / parseFloat(costPerDelivery) * 100)}% of target
                </span>
              </div>
              <Progress 
                value={Math.min(100, Math.round(28.75 / parseFloat(costPerDelivery) * 100))} 
                className="h-1" 
                indicatorColor={parseFloat(costPerDelivery) <= 28.75 ? "bg-emerald-500" : "bg-amber-500"}
              />
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>Total deliveries: {deliveriesThisMonth.toLocaleString()}</span>
                <span>+{(deliveriesThisMonth - deliveriesLastMonth).toLocaleString()} vs prev.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Efficiency Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance Efficiency</p>
                <h3 className="text-2xl font-bold mt-1">
                  {maintenanceCostByVehicleType.reduce((acc, curr) => acc + curr.preventive, 0) / maintenanceCostByVehicleType.length}%
                </h3>
                <div className="flex items-baseline text-xs mt-1">
                  <Badge variant="success" className="font-mono ml-0">
                    <TrendingUp className="mr-1 h-3 w-3" />2.5%
                  </Badge>
                  <span className="text-muted-foreground ml-2">preventive maintenance</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Scheduled maintenance</span>
                  <span className="font-medium">{fleetData.maintenanceSchedule.filter(m => m.status === "scheduled").length} vehicles</span>
                </div>
                <Progress value={fleetData.maintenanceSchedule.filter(m => m.status === "scheduled").length / fleetData.maintenanceSchedule.length * 100} className="h-1 bg-blue-100" indicatorColor="bg-blue-500" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Emergency repairs</span>
                  <span className="font-medium">{fleetData.maintenanceSchedule.filter(m => m.priority === "high" && m.status === "in-progress").length} vehicles</span>
                </div>
                <Progress value={fleetData.maintenanceSchedule.filter(m => m.priority === "high" && m.status === "in-progress").length / fleetData.maintenanceSchedule.length * 100} className="h-1 bg-red-100" indicatorColor="bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Alerts Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Alerts</p>
                <h3 className="text-2xl font-bold mt-1">3 issues</h3>
                <div className="flex items-baseline text-xs mt-1">
                  <Badge variant="warning" className="font-mono ml-0">
                    <AlertCircle className="mr-1 h-3 w-3" />1 critical
                  </Badge>
                  <span className="text-muted-foreground ml-2">needs attention</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded-sm">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-destructive">Fuel cost anomaly detected</p>
                  <p className="text-muted-foreground">12% increase in Route B32</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-500">Maintenance costs trending up</p>
                  <p className="text-muted-foreground">For vehicle class: Heavy Trucks</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-500">Labor cost variance</p>
                  <p className="text-muted-foreground">+8% in Chicago Hub</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for detailed analytics */}
      <Tabs defaultValue="cost-breakdown" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="cost-breakdown">Cost Breakdown</TabsTrigger>
            <TabsTrigger value="cost-trends">Trends</TabsTrigger>
            <TabsTrigger value="cost-per-mile">Cost Per Mile</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total Cost</SelectItem>
              <SelectItem value="per-unit">Per Unit</SelectItem>
              <SelectItem value="per-mile">Per Mile</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Cost Breakdown Tab */}
        <TabsContent value="cost-breakdown" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Cost Category Breakdown
              </CardTitle>
              <CardDescription>
                Monthly expense distribution by category ({currentPeriodData.month})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={costBreakdownChartRef} className="w-full h-[230px]" />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Cost Trends Tab */}
        <TabsContent value="cost-trends" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Cost Category Trends
              </CardTitle>
              <CardDescription>
                Monthly expense trends by category over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={costTrendChartRef} className="w-full h-[240px]" />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Cost Per Mile Tab */}
        <TabsContent value="cost-per-mile" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" />
                Cost Per Mile Analysis
              </CardTitle>
              <CardDescription>
                Cost efficiency across different vehicle types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={costPerMileChartRef} className="w-full h-[240px]" />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Maintenance Cost Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of maintenance costs by vehicle type and category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={maintenanceBreakdownRef} className="w-full h-[230px]" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 