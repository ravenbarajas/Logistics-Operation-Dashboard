import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  BarChart3, 
  LineChart,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Wind,
  Thermometer
} from "lucide-react";
import { networkAnalyticsData, fleetData, logisticsPerformanceData } from "@/data/mock-data";

interface PredictiveAnalyticsProps {
  period: string;
  isDataLoaded: boolean;
}

export default function PredictiveAnalytics({ period, isDataLoaded }: PredictiveAnalyticsProps) {
  const [forecastLoaded, setForecastLoaded] = useState(false);
  
  const volumeForecastChartRef = useRef<HTMLDivElement>(null);
  const demandPredictionChartRef = useRef<HTMLDivElement>(null);
  const riskAssessmentChartRef = useRef<HTMLDivElement>(null);
  
  // Generate mock forecast data based on current data
  // Normally this would come from an ML model via API
  const generateForecastData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Past data - based on historical data
    const historicalData = Array.from({ length: 12 }, (_, i) => ({
      month: months[(currentMonth - 11 + i) % 12],
      volume: Math.round(40000 + Math.random() * 20000 + i * 2000)
    }));
    
    // Future forecast - 6 months ahead
    const forecastData = Array.from({ length: 6 }, (_, i) => ({
      month: months[(currentMonth + 1 + i) % 12],
      projected: Math.round(historicalData[historicalData.length - 1].volume * (1 + ((Math.random() * 0.1) + 0.02) * (i + 1))),
      optimistic: 0,
      pessimistic: 0
    }));
    
    // Add optimistic and pessimistic scenarios
    forecastData.forEach(data => {
      data.optimistic = Math.round(data.projected * (1 + Math.random() * 0.15));
      data.pessimistic = Math.round(data.projected * (1 - Math.random() * 0.15));
    });
    
    return { historical: historicalData, forecast: forecastData };
  };
  
  // Generate seasonal impact data
  const generateSeasonalImpactData = () => {
    return {
      weather: [
        { factor: "Rain", impact: 0.85, confidence: 0.92 },
        { factor: "Snow", impact: 0.65, confidence: 0.88 },
        { factor: "Heat Wave", impact: 0.78, confidence: 0.85 },
        { factor: "Fog", impact: 0.72, confidence: 0.90 }
      ],
      calendar: [
        { factor: "Holiday Season", impact: 1.42, confidence: 0.95 },
        { factor: "Back to School", impact: 1.25, confidence: 0.88 },
        { factor: "Summer Break", impact: 0.92, confidence: 0.82 },
        { factor: "Tax Season", impact: 1.08, confidence: 0.86 }
      ],
      market: [
        { factor: "Fuel Price Spike", impact: 0.88, confidence: 0.75 },
        { factor: "Labor Shortage", impact: 0.82, confidence: 0.78 },
        { factor: "Competitor Promotion", impact: 0.93, confidence: 0.70 },
        { factor: "Supply Chain Disruption", impact: 0.78, confidence: 0.82 }
      ]
    };
  };
  
  // Initialize forecast data
  const [forecastData] = useState(() => generateForecastData());
  const [seasonalData] = useState(() => generateSeasonalImpactData());
  
  // Initialize charts
  useEffect(() => {
    if (isDataLoaded && window.ApexCharts) {
      setForecastLoaded(true);
      
      // Volume Forecast Chart
      if (volumeForecastChartRef.current) {
        const chart = new window.ApexCharts(volumeForecastChartRef.current, {
          series: [
            {
              name: 'Historical Volume',
              type: 'line',
              data: forecastData.historical.map(d => d.volume)
            },
            {
              name: 'Projected Volume',
              type: 'line',
              data: [...Array(forecastData.historical.length - 1).fill(null), 
                     forecastData.historical[forecastData.historical.length - 1].volume, 
                     ...forecastData.forecast.map(d => d.projected)]
            },
            {
              name: 'Optimistic',
              type: 'area',
              data: [...Array(forecastData.historical.length).fill(null), 
                     ...forecastData.forecast.map(d => d.optimistic)]
            },
            {
              name: 'Pessimistic',
              type: 'area',
              data: [...Array(forecastData.historical.length).fill(null), 
                     ...forecastData.forecast.map(d => d.pessimistic)]
            }
          ],
          chart: {
            height: 300,
            type: 'line',
            toolbar: {
              show: false
            },
            animations: {
              enabled: true
            }
          },
          stroke: {
            width: [3, 3, 0, 0],
            curve: 'smooth',
            dashArray: [0, 0, 0, 0]
          },
          colors: ['#6b7280', '#3b82f6', 'rgba(34, 197, 94, 0.5)', 'rgba(239, 68, 68, 0.5)'],
          fill: {
            type: ['solid', 'solid', 'gradient', 'gradient'],
            opacity: [1, 1, 0.4, 0.4],
            gradient: {
              shade: 'light',
              type: 'vertical',
              opacityFrom: 0.6,
              opacityTo: 0.1,
              stops: [0, 100]
            }
          },
          markers: {
            size: [4, 4, 0, 0],
            strokeWidth: 2,
            hover: {
              size: 7
            }
          },
          xaxis: {
            categories: [...forecastData.historical.map(d => d.month), 
                        ...forecastData.forecast.map(d => d.month)],
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              }
            }
          },
          yaxis: {
            title: {
              text: 'Shipment Volume'
            },
            labels: {
              formatter: function(val: number) {
                return Math.round(val / 1000) + 'k';
              }
            }
          },
          tooltip: {
            shared: true,
            intersect: false,
            theme: 'dark',
            y: {
              formatter: function(val: number) {
                return val.toLocaleString();
              }
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '13px',
            fontFamily: 'inherit'
          },
          annotations: {
            xaxis: [{
              x: forecastData.historical.length - 0.5,
              borderColor: '#6b7280',
              label: {
                borderColor: '#6b7280',
                style: {
                  color: '#fff',
                  background: '#6b7280'
                },
                text: 'Current'
              }
            }]
          }
        });
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
      
      // Risk Assessment Chart
      if (riskAssessmentChartRef.current) {
        const chart = new window.ApexCharts(riskAssessmentChartRef.current, {
          series: [{
            name: 'Risk Score',
            data: logisticsPerformanceData.riskAssessment.map(item => 
              Math.round((item.probability * item.impact) / item.readiness))
          }],
          chart: {
            type: 'radar',
            height: 300,
            toolbar: {
              show: false
            },
            dropShadow: {
              enabled: true,
              blur: 1,
              left: 1,
              top: 1
            }
          },
          stroke: {
            width: 2
          },
          fill: {
            opacity: 0.2
          },
          markers: {
            size: 5,
            hover: {
              size: 8
            }
          },
          xaxis: {
            categories: logisticsPerformanceData.riskAssessment.map(item => item.category)
          },
          yaxis: {
            show: false
          },
          colors: ['#f43f5e'],
          plotOptions: {
            radar: {
              polygons: {
                strokeColors: '#e2e8f0',
                fill: {
                  colors: ['#f8fafc', '#f1f5f9']
                }
              }
            }
          }
        });
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
      
      // Demand Prediction Chart
      if (demandPredictionChartRef.current) {
        const regions = ['West Coast', 'Midwest', 'Northeast', 'Southeast', 'Southwest'];
        const timeframes = ['Current Week', '1 Week Ahead', '2 Weeks Ahead', '4 Weeks Ahead'];
        
        // Generate random demand forecast data
        const generateDemandData = () => {
          return regions.map(region => {
            return {
              name: region,
              data: timeframes.map((_, i) => {
                // Base value that increases with future timeframes
                const baseValue = 100 + Math.random() * 50;
                // Uncertainty increases with forecast horizon
                const uncertainty = i * 5; 
                // Random fluctuation with higher uncertainty for farther predictions
                return Math.round(baseValue * (1 + (Math.random() * 0.4 - 0.2) * (i + 1)));
              })
            };
          });
        };
        
        const chart = new window.ApexCharts(demandPredictionChartRef.current, {
          series: generateDemandData(),
          chart: {
            type: 'heatmap',
            height: 300,
            toolbar: {
              show: false
            }
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: 'normal'
            }
          },
          colors: ["#3b82f6"],
          xaxis: {
            categories: timeframes,
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
          plotOptions: {
            heatmap: {
              colorScale: {
                ranges: [
                  {
                    from: 0,
                    to: 80,
                    color: '#bfdbfe',
                    name: 'Low Demand'
                  },
                  {
                    from: 81,
                    to: 110,
                    color: '#60a5fa',
                    name: 'Medium Demand'
                  },
                  {
                    from: 111,
                    to: 1000,
                    color: '#2563eb',
                    name: 'High Demand'
                  }
                ]
              }
            }
          },
          title: {
            text: 'Regional Demand Forecast',
            align: 'left',
            style: {
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 'bold'
            }
          }
        });
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
    }
  }, [isDataLoaded, forecastLoaded]);
  
  return (
    <div className="space-y-4">
      {/* Predictive Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Volume Forecast Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Shipment Volume Forecast
              </CardTitle>
              <CardDescription>
                Projected shipping volume with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={volumeForecastChartRef} className="w-full h-[300px]" />
            </CardContent>
          </Card>
        </div>
        
        {/* Key Predictions Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Key Predictions
            </CardTitle>
            <CardDescription>
              Critical forecast metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">Volume Growth</span>
                </div>
                <Badge className="font-mono">+{(forecastData.forecast[0].projected / forecastData.historical[forecastData.historical.length - 1].volume * 100 - 100).toFixed(1)}%</Badge>
              </div>
              <Progress value={80} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Expected growth next month with 82% confidence
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-sm font-medium">Seasonal Peak</span>
                </div>
                <Badge variant="outline" className="font-mono">Nov-Dec</Badge>
              </div>
              <Progress value={65} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Holiday season surge expected to be 42% above baseline
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm font-medium">Capacity Risk</span>
                </div>
                <Badge variant="destructive" className="font-mono">High</Badge>
              </div>
              <Progress value={92} className="h-1" indicatorColor="bg-red-500" />
              <p className="text-xs text-muted-foreground">
                90% chance of capacity constraints in Q4
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for detailed forecasts */}
      <Tabs defaultValue="demand" className="space-y-4">
        <TabsList>
          <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Factors</TabsTrigger>
        </TabsList>
        
        {/* Demand Forecast Tab */}
        <TabsContent value="demand" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Regional Demand Heatmap
              </CardTitle>
              <CardDescription>
                Projected shipping demand by region and time horizon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={demandPredictionChartRef} className="w-full h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Risk Assessment Tab */}
        <TabsContent value="risk" className="m-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Risk Radar
              </CardTitle>
              <CardDescription>
                Potential disruption factors and their projected impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={riskAssessmentChartRef} className="w-full h-[300px]" />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Seasonal Factors Tab */}
        <TabsContent value="seasonal" className="m-0">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Weather Impact */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 mr-2">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">Weather Factors</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {seasonalData.weather.map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.factor}</span>
                          <span className="font-medium">{item.impact < 1 ? '-' : '+'}{Math.abs((item.impact - 1) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={item.impact * 50} 
                            className="h-1" 
                            indicatorColor={item.impact < 1 ? "bg-red-500" : "bg-emerald-500"}
                          />
                          <span className="text-xs text-muted-foreground">{(item.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Calendar Events */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-amber-500/10 text-amber-500 mr-2">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">Calendar Events</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {seasonalData.calendar.map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.factor}</span>
                          <span className="font-medium">{item.impact < 1 ? '-' : '+'}{Math.abs((item.impact - 1) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={item.impact * 50} 
                            className="h-1" 
                            indicatorColor={item.impact < 1 ? "bg-red-500" : "bg-emerald-500"}
                          />
                          <span className="text-xs text-muted-foreground">{(item.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Market Factors */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-500 mr-2">
                      <Wind className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">Market Factors</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {seasonalData.market.map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.factor}</span>
                          <span className="font-medium">{item.impact < 1 ? '-' : '+'}{Math.abs((item.impact - 1) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={item.impact * 50} 
                            className="h-1" 
                            indicatorColor={item.impact < 1 ? "bg-red-500" : "bg-emerald-500"}
                          />
                          <span className="text-xs text-muted-foreground">{(item.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 