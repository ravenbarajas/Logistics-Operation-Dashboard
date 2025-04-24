import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Leaf, 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  Truck,
  Trees,
  Factory,
  BarChart4, 
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw
} from "lucide-react";
import { sustainabilityData, carbonOffsetProjects, emissionsByVehicleData } from "@/data/mock-data";

interface SustainabilityMetricsProps {
  period: string;
  isDataLoaded: boolean;
}

export default function SustainabilityMetrics({ period, isDataLoaded }: SustainabilityMetricsProps) {
  const [activeTab, setActiveTab] = useState("emissions");
  const emissionsTrendChartRef = useRef<HTMLDivElement>(null);
  const emissionsByVehicleChartRef = useRef<HTMLDivElement>(null);
  const efficiencyTrendChartRef = useRef<HTMLDivElement>(null);
  
  // Current vs. previous period metrics
  const currentPeriod = sustainabilityData[sustainabilityData.length - 1];
  const previousPeriod = sustainabilityData[sustainabilityData.length - 2];
  
  // Calculate emission reduction
  const emissionChange = ((currentPeriod.carbonEmissions - previousPeriod.carbonEmissions) / previousPeriod.carbonEmissions) * 100;
  
  // Total carbon offsets
  const totalOffsets = carbonOffsetProjects.reduce((sum, project) => sum + project.offset, 0);
  const offsetPercentage = (totalOffsets / currentPeriod.carbonEmissions) * 100;
  
  // Calculate EV fleet percentage
  const evPercentage = currentPeriod.electricVehicles;
  const evChange = currentPeriod.electricVehicles - previousPeriod.electricVehicles;
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Helper functions for consistent styling
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "positive":
        return "text-emerald-500";
      case "neutral":
        return "text-blue-500";
      case "negative":
        return "text-amber-500";
      case "critical":
        return "text-rose-500";
      default:
        return "text-gray-500";
    }
  };
  
  const getStatusTextColor = (status: string): string => {
    switch (status) {
      case "positive":
        return "text-emerald-500";
      case "neutral":
        return "text-blue-500";
      case "negative":
        return "text-amber-500";
      case "critical":
        return "text-rose-500";
      default:
        return "text-muted-foreground";
    }
  };
  
  const getStatusBgClass = (status: string): string => {
    switch (status) {
      case "positive":
        return "bg-emerald-500/10";
      case "neutral":
        return "bg-blue-500/10";
      case "negative":
        return "bg-amber-500/10";
      case "critical":
        return "bg-rose-500/10";
      default:
        return "bg-gray-500/10";
    }
  };
  
  const renderTrendIndicator = (trend: string | number, isPositiveGood: boolean = true) => {
    const isPositive = typeof trend === 'string' 
      ? trend.startsWith("+") 
      : trend > 0;
    
    const isNeutral = typeof trend === 'string' 
      ? trend === "0%" || trend === "0" 
      : trend === 0;
    
    if (isNeutral) {
      return (
        <span className="text-muted-foreground text-xs font-medium">
          No change
        </span>
      );
    }
    
    const isGood = isPositiveGood ? isPositive : !isPositive;
    
    return (
      <span className={`text-xs font-medium inline-flex items-center ${isGood ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3 mr-0.5" />
        ) : (
          <ArrowDownRight className="h-3 w-3 mr-0.5" />
        )}
        {typeof trend === 'string' ? trend.replace("+", "") : `${Math.abs(trend)}%`}
      </span>
    );
  };
  
  // Initialize charts
  useEffect(() => {
    let emissionsTrendChart: any;
    let emissionsByVehicleChart: any;
    let efficiencyTrendChart: any;
    
    if (isDataLoaded && window.ApexCharts) {
      // Initialize all charts based on the active tab
      if (activeTab === "emissions" && emissionsTrendChartRef.current) {
        // Destroy any existing chart
        if (emissionsTrendChart) {
          emissionsTrendChart.destroy();
        }
        
        // Emissions trend chart
        emissionsTrendChart = new window.ApexCharts(emissionsTrendChartRef.current, {
          series: [{
            name: 'Carbon Emissions',
            data: sustainabilityData.map(d => d.carbonEmissions)
          }],
          chart: {
            height: 280,
            type: 'area',
            toolbar: {
              show: false
            },
            animations: {
              enabled: true,
              speed: 500
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 3
          },
          colors: ['#10b981'],
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.2,
              stops: [0, 90, 100]
            }
          },
          xaxis: {
            categories: sustainabilityData.map(d => d.quarter),
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          yaxis: {
            labels: {
              formatter: function(val: number) {
                return val.toFixed(0);
              },
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          tooltip: {
            theme: 'dark',
            shared: true,
            intersect: false,
            y: {
              formatter: function(val: number) {
                return val.toFixed(0) + ' tonnes';
              }
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12px',
            fontFamily: 'inherit'
          }
        });
        emissionsTrendChart.render();
      }
      
      // Emissions by vehicle type chart
      if (activeTab === "fleet" && emissionsByVehicleChartRef.current) {
        // Destroy any existing chart
        if (emissionsByVehicleChart) {
          emissionsByVehicleChart.destroy();
        }
        
        emissionsByVehicleChart = new window.ApexCharts(emissionsByVehicleChartRef.current, {
          series: [{
            name: 'Carbon Emissions',
            data: emissionsByVehicleData.map(d => d.emissions)
          }],
          chart: {
            type: 'bar',
            height: 280,
            toolbar: {
              show: false
            },
            animations: {
              speed: 500
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '60%',
              distributed: true,
              borderRadius: 4,
              dataLabels: {
                position: 'top'
              }
            }
          },
          colors: ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#10b981'],
          dataLabels: {
            enabled: true,
            formatter: function(val: number) {
              return val.toFixed(2) + ' kg/km';
            },
            offsetX: 20,
            style: {
              fontSize: '11px',
              fontFamily: 'inherit',
              fontWeight: 'normal',
              colors: ['#fff']
            }
          },
          legend: {
            show: false
          },
          xaxis: {
            categories: emissionsByVehicleData.map(d => d.type),
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
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
                return val.toFixed(2) + ' kg CO2/km';
              }
            },
            x: {
              show: true
            }
          }
        });
        emissionsByVehicleChart.render();
      }
      
      // Efficiency trend chart
      if (activeTab === "efficiency" && efficiencyTrendChartRef.current) {
        // Destroy any existing chart
        if (efficiencyTrendChart) {
          efficiencyTrendChart.destroy();
        }
        
        efficiencyTrendChart = new window.ApexCharts(efficiencyTrendChartRef.current, {
          series: [
            {
              name: 'Fuel Efficiency',
              type: 'line',
              data: sustainabilityData.map(d => d.fuelEfficiency)
            },
            {
              name: 'Electric Vehicles',
              type: 'column',
              data: sustainabilityData.map(d => d.electricVehicles)
            },
            {
              name: 'Renewable Energy',
              type: 'column',
              data: sustainabilityData.map(d => d.renewableEnergy)
            }
          ],
          chart: {
            height: 280,
            type: 'line',
            stacked: false,
            toolbar: {
              show: false
            },
            animations: {
              speed: 500
            }
          },
          plotOptions: {
            bar: {
              columnWidth: '50%',
              borderRadius: 4
            }
          },
          stroke: {
            width: [3, 0, 0]
          },
          colors: ['#10b981', '#3b82f6', '#f59e0b'],
          xaxis: {
            categories: sustainabilityData.map(d => d.quarter),
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          yaxis: [
            {
              title: {
                text: 'Fuel Efficiency (L/100km)',
              },
              seriesName: 'Fuel Efficiency',
              min: 7.5,
              max: 9,
              tickAmount: 4,
              decimalsInFloat: 1,
              labels: {
                style: {
                  fontSize: '12px',
                  fontFamily: 'inherit',
                }
              }
            },
            {
              seriesName: 'Electric Vehicles',
              show: false
            },
            {
              opposite: true,
              title: {
                text: 'Percentage (%)'
              },
              min: 0,
              max: 35,
              seriesName: 'Renewable Energy',
              labels: {
                style: {
                  fontSize: '12px',
                  fontFamily: 'inherit',
                }
              }
            }
          ],
          tooltip: {
            theme: 'dark',
            shared: true,
            intersect: false,
            fixed: {
              enabled: true,
              position: 'topLeft',
              offsetY: 30,
              offsetX: 60
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12px',
            fontFamily: 'inherit'
          }
        });
        efficiencyTrendChart.render();
      }
    }
    
    // Cleanup function
    return () => {
      if (emissionsTrendChart) {
        emissionsTrendChart.destroy();
      }
      if (emissionsByVehicleChart) {
        emissionsByVehicleChart.destroy();
      }
      if (efficiencyTrendChart) {
        efficiencyTrendChart.destroy();
      }
    };
  }, [isDataLoaded, period, activeTab]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Leaf className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">Sustainability Metrics</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground bg-muted/50 py-1 px-2 rounded-md flex items-center">
            <RefreshCcw className="h-3 w-3 mr-1" />
            <span>Period: {period}</span>
          </div>
        </div>
      </div>

      {/* Sustainability KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carbon Emissions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Emissions</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPeriod.carbonEmissions.toLocaleString()} tonnes</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {renderTrendIndicator(emissionChange, false)}
              <span className="ml-1">from previous quarter</span>
            </p>
            <div className="mt-3">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${Math.min(100, (currentPeriod.carbonEmissions * 0.85) / currentPeriod.carbonEmissions * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Target: {(currentPeriod.carbonEmissions * 0.85).toFixed(0)} tonnes</span>
                <span className="text-xs font-medium">
                  {Math.round((currentPeriod.carbonEmissions * 0.85) / currentPeriod.carbonEmissions * 100)}% of goal
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carbon Offset Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
            <Trees className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOffsets.toLocaleString()} tonnes</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-emerald-500 font-medium">{offsetPercentage.toFixed(1)}%</span>
              <span className="ml-1">of total emissions</span>
            </p>
            <div className="mt-3 space-y-3">
              {carbonOffsetProjects.slice(0, 2).map((project, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{project.project}</span>
                    <span className="font-medium">{project.offset} tonnes</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${project.status === "active" ? "bg-emerald-500" : "bg-amber-500"} rounded-full`} 
                      style={{ width: `${project.offset / totalOffsets * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Electric Fleet Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Electric Fleet</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evPercentage}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {renderTrendIndicator(evChange)}
              <span className="ml-1">from previous quarter</span>
            </p>
            <div className="mt-3">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.round(evPercentage / 40 * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">2025 Target: 40%</span>
                <span className="text-xs font-medium">{Math.round(evPercentage / 40 * 100)}% complete</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1 mt-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center px-1 py-0.5 bg-blue-500/10 rounded text-xs">
                  <div className="font-medium">Q{i+2}'23</div>
                  <div className="text-[10px] text-muted-foreground">{evPercentage + (i*3)}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Renewable Energy Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewable Energy</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPeriod.renewableEnergy}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {renderTrendIndicator(currentPeriod.renewableEnergy - previousPeriod.renewableEnergy)}
              <span className="ml-1">from previous quarter</span>
            </p>
            <div className="mt-3">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${Math.round(currentPeriod.renewableEnergy / 75 * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">2025 Target: 75%</span>
                <span className="text-xs font-medium">{Math.round(currentPeriod.renewableEnergy / 75 * 100)}% complete</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              Solar: {Math.round(currentPeriod.renewableEnergy * 0.6)}% | Wind: {Math.round(currentPeriod.renewableEnergy * 0.35)}% | Other: {Math.round(currentPeriod.renewableEnergy * 0.05)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for detailed metrics */}
      <Tabs defaultValue="emissions" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="emissions" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Emissions</span>
          </TabsTrigger>
          <TabsTrigger value="fleet" className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            <span>Fleet Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center gap-1">
            <BarChart4 className="h-4 w-4" />
            <span>Efficiency</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Emissions Tab */}
        <TabsContent value="emissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Emissions Trend</CardTitle>
              <CardDescription>Quarterly CO2 emissions with year-over-year comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={emissionsTrendChartRef} className="h-[280px]" />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Fleet Analysis Tab */}
        <TabsContent value="fleet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emissions by Vehicle Type</CardTitle>
              <CardDescription>Carbon intensity per kilometer by vehicle classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={emissionsByVehicleChartRef} className="h-[280px]" />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Efficiency Trends Tab */}
        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Initiatives</CardTitle>
              <CardDescription>Quarterly progress on key sustainability metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={efficiencyTrendChartRef} className="h-[280px]" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* ESG Impact & Reporting */}
      <Card>
        <CardHeader>
          <CardTitle>ESG Impact & Carbon Credits</CardTitle>
          <CardDescription>Financial and environmental sustainability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Carbon Credit Portfolio</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credits Purchased</span>
                    <span className="font-medium">1,240 tCO2e</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credits Utilized</span>
                    <span className="font-medium">830 tCO2e</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credits Available</span>
                    <span className="font-medium">410 tCO2e</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-muted-foreground">Average price:</span>
                <Badge variant="outline" className="font-mono">$24.50/tCO2e</Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">ESG Reporting Performance</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-xs text-muted-foreground">CDP Rating</div>
                  <div className="text-lg font-bold">B+</div>
                  <Badge variant="outline" className="text-[10px] mt-1 bg-blue-500/10 text-blue-500 border-0">+1 from 2022</Badge>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-xs text-muted-foreground">MSCI ESG</div>
                  <div className="text-lg font-bold">AA</div>
                  <Badge variant="outline" className="text-[10px] mt-1 bg-blue-500/10 text-blue-500 border-0">Stable</Badge>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-xs text-muted-foreground">GRI Compliance</div>
                  <div className="text-lg font-bold">92%</div>
                  <Badge variant="outline" className="text-[10px] mt-1 bg-emerald-500/10 text-emerald-500 border-0">+5%</Badge>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-xs text-muted-foreground">TCFD</div>
                  <div className="text-lg font-bold">Full</div>
                  <Badge variant="outline" className="text-[10px] mt-1 bg-emerald-500/10 text-emerald-500 border-0">Complete</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Sustainability ROI</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Cost Savings (Fuel)</span>
                    <span className="font-medium">{formatCurrency(142500)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Maintenance Savings (EV)</span>
                    <span className="font-medium">{formatCurrency(87200)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Tax Incentives</span>
                    <span className="font-medium">{formatCurrency(215000)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Brand Value Increase</span>
                    <span className="font-medium">+4.2%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 