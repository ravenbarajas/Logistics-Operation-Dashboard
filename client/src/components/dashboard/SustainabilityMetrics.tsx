import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Leaf, 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  Truck,
  Trees,
  Factory,
  BarChart4, 
  CircleDollarSign
} from "lucide-react";
import { sustainabilityData, carbonOffsetProjects, emissionsByVehicleData } from "@/data/mock-data";

interface SustainabilityMetricsProps {
  period: string;
  isDataLoaded: boolean;
}

export default function SustainabilityMetrics({ period, isDataLoaded }: SustainabilityMetricsProps) {
  const [metricsLoaded, setMetricsLoaded] = useState(false);
  
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
  
  // Initialize charts
  useEffect(() => {
    if (isDataLoaded && window.ApexCharts) {
      setMetricsLoaded(true);
      
      // Emissions trend chart
      if (emissionsTrendChartRef.current) {
        const chart = new window.ApexCharts(emissionsTrendChartRef.current, {
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
              enabled: true
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
            title: {
              text: 'Tonnes CO2'
            },
            labels: {
              formatter: function(val: number) {
                return val.toFixed(0);
              }
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return val.toFixed(0) + ' tonnes';
              }
            }
          },
          annotations: {
            points: [
              {
                x: sustainabilityData.length - 1,
                y: sustainabilityData[sustainabilityData.length - 1].carbonEmissions,
                marker: {
                  size: 6,
                  fillColor: '#fff',
                  strokeColor: '#10b981',
                  strokeWidth: 2,
                  radius: 2
                },
                label: {
                  text: 'Current',
                  borderColor: '#10b981',
                  offsetY: 0,
                  style: {
                    color: '#fff',
                    background: '#10b981'
                  }
                }
              }
            ]
          }
        });
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
      
      // Emissions by vehicle type chart
      if (emissionsByVehicleChartRef.current) {
        const chart = new window.ApexCharts(emissionsByVehicleChartRef.current, {
          series: [{
            name: 'Carbon Emissions',
            data: emissionsByVehicleData.map(d => d.emissions)
          }],
          chart: {
            type: 'bar',
            height: 280,
            toolbar: {
              show: false
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
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
      
      // Efficiency trend chart
      if (efficiencyTrendChartRef.current) {
        const chart = new window.ApexCharts(efficiencyTrendChartRef.current, {
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
            }
          },
          plotOptions: {
            bar: {
              columnWidth: '50%'
            }
          },
          stroke: {
            width: [3, 0, 0]
          },
          colors: ['#10b981', '#3b82f6', '#f59e0b'],
          xaxis: {
            categories: sustainabilityData.map(d => d.quarter)
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
              decimalsInFloat: 1
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
              seriesName: 'Renewable Energy'
            }
          ],
          tooltip: {
            theme: 'dark',
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
            fontSize: '13px',
            fontFamily: 'inherit'
          }
        });
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
    }
  }, [isDataLoaded, metricsLoaded]);
  
  return (
    <div className="space-y-4">
      {/* Sustainability KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carbon Emissions Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Carbon Emissions</p>
                <h3 className="text-2xl font-bold mt-1">{currentPeriod.carbonEmissions.toLocaleString()} tonnes</h3>
                <div className="flex items-center text-xs mt-1">
                  <Badge variant={emissionChange < 0 ? "success" : "destructive"} className="font-mono ml-0">
                    {emissionChange < 0 ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                    {Math.abs(emissionChange).toFixed(1)}%
                  </Badge>
                  <span className="text-muted-foreground ml-2">vs. previous quarter</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                <Leaf className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Target: {(currentPeriod.carbonEmissions * 0.85).toFixed(0)} tonnes</span>
                <span className="font-medium">
                  {Math.round((currentPeriod.carbonEmissions * 0.85) / currentPeriod.carbonEmissions * 100)}% of target
                </span>
              </div>
              <Progress 
                value={Math.min(100, (currentPeriod.carbonEmissions * 0.85) / currentPeriod.carbonEmissions * 100)} 
                className="h-1" 
              />
              <div className="flex justify-between text-xs mt-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                  <span className="text-muted-foreground">Net Zero 2030 Plan</span>
                </div>
                <span className="font-medium text-emerald-500">On track</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carbon Offset Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Carbon Offset</p>
                <h3 className="text-2xl font-bold mt-1">{totalOffsets.toLocaleString()} tonnes</h3>
                <div className="flex items-center text-xs mt-1">
                  <Badge variant="success" className="font-mono ml-0">
                    {offsetPercentage.toFixed(1)}%
                  </Badge>
                  <span className="text-muted-foreground ml-2">of total emissions</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-green-700/10 text-green-700">
                <Trees className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {carbonOffsetProjects.slice(0, 2).map((project, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{project.project}</span>
                    <span className="font-medium">{project.offset} tonnes</span>
                  </div>
                  <Progress 
                    value={project.offset / totalOffsets * 100} 
                    className="h-1" 
                    indicatorColor={project.status === "active" ? "bg-green-600" : "bg-amber-500"}
                  />
                </div>
              ))}
              <div className="text-xs text-muted-foreground">
                {carbonOffsetProjects.length - 2} more projects
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Electric Fleet Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Electric Fleet</p>
                <h3 className="text-2xl font-bold mt-1">{evPercentage}%</h3>
                <div className="flex items-center text-xs mt-1">
                  <Badge variant="success" className="font-mono ml-0">
                    <TrendingUp className="mr-1 h-3 w-3" />+{evChange}%
                  </Badge>
                  <span className="text-muted-foreground ml-2">vs. previous quarter</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span>2025 Target: 40%</span>
                <span className="font-medium">{Math.round(evPercentage / 40 * 100)}% of target</span>
              </div>
              <Progress value={Math.round(evPercentage / 40 * 100)} className="h-1" />
              <div className="text-xs text-muted-foreground mt-2">
                Current transition rate: +3% per quarter
              </div>
              <div className="grid grid-cols-5 gap-1 mt-2">
                <div className="text-center px-1 py-0.5 bg-blue-500/10 rounded text-xs">
                  <div className="font-medium">Q2'23</div>
                  <div className="text-[10px] text-muted-foreground">{evPercentage}%</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-blue-500/10 rounded text-xs">
                  <div className="font-medium">Q3'23</div>
                  <div className="text-[10px] text-muted-foreground">{evPercentage + 3}%</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-blue-500/10 rounded text-xs">
                  <div className="font-medium">Q4'23</div>
                  <div className="text-[10px] text-muted-foreground">{evPercentage + 6}%</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-blue-500/10 rounded text-xs">
                  <div className="font-medium">Q1'24</div>
                  <div className="text-[10px] text-muted-foreground">{evPercentage + 9}%</div>
                </div>
                <div className="text-center px-1 py-0.5 bg-blue-500/10 rounded text-xs">
                  <div className="font-medium">Q2'24</div>
                  <div className="text-[10px] text-muted-foreground">{evPercentage + 12}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Renewable Energy Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Renewable Energy</p>
                <h3 className="text-2xl font-bold mt-1">{currentPeriod.renewableEnergy}%</h3>
                <div className="flex items-center text-xs mt-1">
                  <Badge variant="success" className="font-mono ml-0">
                    <TrendingUp className="mr-1 h-3 w-3" />+{currentPeriod.renewableEnergy - previousPeriod.renewableEnergy}%
                  </Badge>
                  <span className="text-muted-foreground ml-2">vs. previous quarter</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-amber-500/10 text-amber-500">
                <Factory className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span>2025 Target: 75%</span>
                <span className="font-medium">{Math.round(currentPeriod.renewableEnergy / 75 * 100)}% of target</span>
              </div>
              <Progress value={Math.round(currentPeriod.renewableEnergy / 75 * 100)} className="h-1" />
              <div className="text-xs text-muted-foreground mt-2">
                Solar: {Math.round(currentPeriod.renewableEnergy * 0.6)}% | Wind: {Math.round(currentPeriod.renewableEnergy * 0.35)}% | Other: {Math.round(currentPeriod.renewableEnergy * 0.05)}%
              </div>
              <div className="flex justify-between text-xs mt-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                  <span className="text-muted-foreground">Facility coverage</span>
                </div>
                <span className="font-medium">14 of 18 facilities</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for detailed metrics */}
      <Tabs defaultValue="emissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="emissions">Emissions</TabsTrigger>
          <TabsTrigger value="fleet">Fleet Analysis</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Trends</TabsTrigger>
        </TabsList>
        
        {/* Emissions Tab */}
        <TabsContent value="emissions" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Carbon Emissions Trend
              </CardTitle>
              <CardDescription>
                Quarterly CO2 emissions with year-over-year comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={emissionsTrendChartRef} className="w-full h-[280px]" />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Fleet Analysis Tab */}
        <TabsContent value="fleet" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Emissions by Vehicle Type
              </CardTitle>
              <CardDescription>
                Carbon intensity per kilometer by vehicle classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={emissionsByVehicleChartRef} className="w-full h-[280px]" />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Efficiency Trends Tab */}
        <TabsContent value="efficiency" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" />
                Sustainability Initiatives
              </CardTitle>
              <CardDescription>
                Quarterly progress on key sustainability metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={efficiencyTrendChartRef} className="w-full h-[280px]" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* ESG Impact & Reporting */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <CircleDollarSign className="h-5 w-5 mr-2" />
            ESG Impact & Carbon Credits
          </CardTitle>
          <CardDescription>
            Financial and environmental sustainability metrics
          </CardDescription>
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
                  <Progress value={65} className="h-1" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credits Utilized</span>
                    <span className="font-medium">830 tCO2e</span>
                  </div>
                  <Progress value={42} className="h-1" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credits Available</span>
                    <span className="font-medium">410 tCO2e</span>
                  </div>
                  <Progress value={23} className="h-1" />
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
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-xs text-muted-foreground">CDP Rating</div>
                  <div className="text-lg font-bold">B+</div>
                  <Badge variant="outline" className="text-[10px] mt-1">+1 from 2022</Badge>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-xs text-muted-foreground">MSCI ESG</div>
                  <div className="text-lg font-bold">AA</div>
                  <Badge variant="outline" className="text-[10px] mt-1">Stable</Badge>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-xs text-muted-foreground">GRI Compliance</div>
                  <div className="text-lg font-bold">92%</div>
                  <Badge variant="success" className="text-[10px] mt-1">+5%</Badge>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-xs text-muted-foreground">TCFD</div>
                  <div className="text-lg font-bold">Full</div>
                  <Badge variant="outline" className="text-[10px] mt-1">Complete</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Sustainability ROI</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Cost Savings (Fuel)</span>
                    <span className="font-medium">$142,500</span>
                  </div>
                  <Progress value={78} className="h-1" indicatorColor="bg-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Maintenance Savings (EV)</span>
                    <span className="font-medium">$87,200</span>
                  </div>
                  <Progress value={62} className="h-1" indicatorColor="bg-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Tax Incentives</span>
                    <span className="font-medium">$215,000</span>
                  </div>
                  <Progress value={85} className="h-1" indicatorColor="bg-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Brand Value Increase</span>
                    <span className="font-medium">+4.2%</span>
                  </div>
                  <Progress value={42} className="h-1" indicatorColor="bg-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 