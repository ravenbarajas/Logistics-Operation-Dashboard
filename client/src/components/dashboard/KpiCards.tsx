import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Truck, 
  Clock, 
  Package, 
  Fuel, 
  TrendingDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { kpiData } from "@/data/mock-data";

export default function KpiCards() {
  const { activeVehicles, onTimeDeliveries, pendingOrders, fuelEfficiency } = kpiData;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Active Vehicles Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Vehicles</p>
              <h3 className="text-2xl font-bold mt-1">{activeVehicles.active}/{activeVehicles.total}</h3>
              <p className="text-xs text-muted-foreground mt-1">{activeVehicles.utilization}% fleet utilization</p>
            </div>
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-muted">
            <Progress value={activeVehicles.utilization} className="h-1" />
          </div>
        </CardContent>
      </Card>
      
      {/* On-Time Deliveries Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">On-Time Deliveries</p>
              <h3 className="text-2xl font-bold mt-1">{onTimeDeliveries.percentage}%</h3>
              <p className="text-xs text-muted-foreground mt-1">+{onTimeDeliveries.change}% from last week</p>
            </div>
            <div className="p-2 rounded-full bg-secondary/10 text-secondary">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-muted">
            <Progress value={onTimeDeliveries.percentage} className="h-1 bg-secondary" />
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Orders Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
              <h3 className="text-2xl font-bold mt-1">{pendingOrders.total}</h3>
              <p className="text-xs text-muted-foreground mt-1">{pendingOrders.urgent} urgent deliveries</p>
            </div>
            <div className="p-2 rounded-full bg-accent/10 text-accent">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Badge variant="destructive" className="mr-2 bg-destructive/10 text-destructive hover:bg-destructive/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              {pendingOrders.urgent} Urgent
            </Badge>
            <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              {pendingOrders.normal} Normal
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Fuel Efficiency Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fuel Efficiency</p>
              <h3 className="text-2xl font-bold mt-1">{fuelEfficiency.value} {fuelEfficiency.unit}</h3>
              <p className="text-xs text-muted-foreground mt-1">{fuelEfficiency.change}% from last month</p>
            </div>
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Fuel className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-green-600">
            <div className="flex items-center">
              <TrendingDown className="mr-1 h-3.5 w-3.5" />
              {Math.abs(fuelEfficiency.change)}% improvement in fuel economy
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
