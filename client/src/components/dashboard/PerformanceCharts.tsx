import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deliveryPerformanceData, fuelConsumptionData } from "@/data/mock-data";

export default function PerformanceCharts() {
  const deliveryChartRef = useRef<HTMLCanvasElement | null>(null);
  const fuelChartRef = useRef<HTMLCanvasElement | null>(null);
  const deliveryChartInstance = useRef<any>(null);
  const fuelChartInstance = useRef<any>(null);
  
  useEffect(() => {
    if (!deliveryChartRef.current || !window.Chart) return;
    
    // Clean up existing chart
    if (deliveryChartInstance.current) {
      deliveryChartInstance.current.destroy();
    }
    
    // Create delivery performance chart
    const ctx = deliveryChartRef.current.getContext('2d');
    if (!ctx) return;
    
    deliveryChartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: deliveryPerformanceData.labels,
        datasets: [{
          label: 'On-Time Deliveries',
          data: deliveryPerformanceData.onTimeData,
          borderColor: 'hsl(var(--secondary))',
          backgroundColor: 'hsla(var(--secondary), 0.1)',
          tension: 0.3,
          fill: true
        }, {
          label: 'Delayed Deliveries',
          data: deliveryPerformanceData.delayedData,
          borderColor: 'hsl(var(--accent))',
          backgroundColor: 'hsla(var(--accent), 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              },
              color: 'hsl(var(--foreground))'
            },
            grid: {
              color: 'hsla(var(--muted), 0.5)'
            }
          },
          x: {
            ticks: {
              color: 'hsl(var(--foreground))'
            },
            grid: {
              color: 'hsla(var(--muted), 0.5)'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'hsl(var(--foreground))'
            }
          }
        }
      }
    });
    
    return () => {
      if (deliveryChartInstance.current) {
        deliveryChartInstance.current.destroy();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!fuelChartRef.current || !window.Chart) return;
    
    // Clean up existing chart
    if (fuelChartInstance.current) {
      fuelChartInstance.current.destroy();
    }
    
    // Create fuel consumption chart
    const ctx = fuelChartRef.current.getContext('2d');
    if (!ctx) return;
    
    fuelChartInstance.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: fuelConsumptionData.labels,
        datasets: [{
          label: 'Fuel Consumption (L)',
          data: fuelConsumptionData.values,
          backgroundColor: 'hsl(var(--primary))'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'hsl(var(--foreground))'
            },
            grid: {
              color: 'hsla(var(--muted), 0.5)'
            }
          },
          x: {
            ticks: {
              color: 'hsl(var(--foreground))'
            },
            grid: {
              color: 'hsla(var(--muted), 0.5)'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'hsl(var(--foreground))'
            }
          }
        }
      }
    });
    
    return () => {
      if (fuelChartInstance.current) {
        fuelChartInstance.current.destroy();
      }
    };
  }, []);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Delivery Performance Chart */}
      <Card>
        <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">Delivery Performance</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[250px] relative">
            <canvas ref={deliveryChartRef} />
          </div>
        </CardContent>
      </Card>
      
      {/* Fuel Consumption Chart */}
      <Card>
        <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">Fuel Consumption</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[250px] relative">
            <canvas ref={fuelChartRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
