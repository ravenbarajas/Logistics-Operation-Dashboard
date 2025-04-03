import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { fleetService, FleetSummary } from "@/services/fleetService";
import { Vehicle } from "@shared/schema";

export default function FleetStatus() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [fleetSummary, setFleetSummary] = useState<FleetSummary | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summary, vehiclesData] = await Promise.all([
        fleetService.getFleetSummary(),
        fleetService.getVehicles()
      ]);
      setFleetSummary(summary);
      setVehicles(vehiclesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!chartRef.current || !fleetSummary) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Clear previous chart
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);

    // Draw new chart
    const total = fleetSummary.totalVehicles;
    const active = fleetSummary.activeVehicles;
    const maintenance = fleetSummary.inMaintenance;
    const inactive = fleetSummary.outOfService;

    const width = chartRef.current.width;
    const height = chartRef.current.height;
    const barWidth = 40;
    const spacing = 20;
    const startX = (width - (barWidth * 4 + spacing * 3)) / 2;

    // Draw bars
    ctx.fillStyle = '#22c55e'; // green-500
    ctx.fillRect(startX, height - (active / total) * height, barWidth, (active / total) * height);

    ctx.fillStyle = '#f59e0b'; // amber-500
    ctx.fillRect(startX + barWidth + spacing, height - (maintenance / total) * height, barWidth, (maintenance / total) * height);

    ctx.fillStyle = '#ef4444'; // red-500
    ctx.fillRect(startX + (barWidth + spacing) * 2, height - (inactive / total) * height, barWidth, (inactive / total) * height);
  }, [fleetSummary]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="text-red-500">Error: {error}</div>
        <Button onClick={fetchData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  // Get vehicles that need maintenance soon (within 30 days)
  const upcomingMaintenance = vehicles
    .filter(vehicle => {
      if (!vehicle.nextMaintenance) return false;
      const nextMaintenance = new Date(vehicle.nextMaintenance);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return nextMaintenance <= thirtyDaysFromNow;
    })
    .slice(0, 3);

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
          <canvas ref={chartRef} width={400} height={200} />
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-green-500 rounded-md mr-3"></div>
              <div>
                <p className="text-sm font-medium">Active Vehicles</p>
                <p className="text-xl font-bold">{fleetSummary?.activeVehicles}</p>
              </div>
            </div>
            <span className="text-xs text-green-500">{fleetSummary?.activePercentage}% of fleet</span>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-amber-500 rounded-md mr-3"></div>
              <div>
                <p className="text-sm font-medium">In Maintenance</p>
                <p className="text-xl font-bold">{fleetSummary?.inMaintenance}</p>
              </div>
            </div>
            <span className="text-xs text-amber-500">{fleetSummary?.maintenancePercentage}% of fleet</span>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-red-500 rounded-md mr-3"></div>
              <div>
                <p className="text-sm font-medium">Inactive</p>
                <p className="text-xl font-bold">{fleetSummary?.outOfService}</p>
              </div>
            </div>
            <span className="text-xs text-red-500">{fleetSummary?.outOfServicePercentage}% of fleet</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Upcoming Maintenance</h3>
          <div className="space-y-2">
            {upcomingMaintenance.map((vehicle) => (
              <div key={vehicle.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                <div>
                  <p className="text-sm font-medium">{vehicle.type} #{vehicle.id}</p>
                  <p className="text-xs text-muted-foreground">Next maintenance: {new Date(vehicle.nextMaintenance!).toLocaleDateString()}</p>
                </div>
                <p className="text-xs">{Math.ceil((new Date(vehicle.nextMaintenance!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</p>
              </div>
            ))}
            {upcomingMaintenance.length === 0 && (
              <p className="text-sm text-muted-foreground">No vehicles requiring maintenance in the next 30 days</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
