import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { fleetData } from "@/data/mock-data";

export default function FleetStatus() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);
  
  useEffect(() => {
    if (!chartRef.current || !window.Chart) return;
    
    // Clean up existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    chartInstance.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'In Maintenance', 'Inactive'],
        datasets: [{
          data: [fleetData.status.active, fleetData.status.maintenance, fleetData.status.inactive],
          backgroundColor: [
            'hsl(var(--secondary))',
            'hsl(var(--accent))',
            'hsl(var(--muted-foreground))'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: 'hsl(var(--foreground))'
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
  
  return (
    <Card>
      <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Fleet Status</CardTitle>
        <Button variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          History
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[200px] relative">
          <canvas ref={chartRef} />
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-secondary rounded-md mr-3"></div>
              <div>
                <p className="text-sm font-medium">Active Vehicles</p>
                <p className="text-xl font-bold">{fleetData.status.active}</p>
              </div>
            </div>
            <span className="text-xs text-secondary">{fleetData.changes.active}</span>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-accent rounded-md mr-3"></div>
              <div>
                <p className="text-sm font-medium">In Maintenance</p>
                <p className="text-xl font-bold">{fleetData.status.maintenance}</p>
              </div>
            </div>
            <span className="text-xs text-accent">{fleetData.changes.maintenance}</span>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-muted-foreground rounded-md mr-3"></div>
              <div>
                <p className="text-sm font-medium">Inactive</p>
                <p className="text-xl font-bold">{fleetData.status.inactive}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{fleetData.changes.inactive}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Upcoming Maintenance</h3>
          <div className="space-y-2">
            {fleetData.upcoming.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                <div>
                  <p className="text-sm font-medium">{item.type} #{item.id}</p>
                  <p className="text-xs text-muted-foreground">{item.service}</p>
                </div>
                <p className="text-xs">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
