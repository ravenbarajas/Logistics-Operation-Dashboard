import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Route, Truck, CheckCircle, AlertCircle, Copy, Calendar, User, 
  TrafficCone, LineChart, Clock, Activity, DollarSign, FuelIcon, Wind,
  BarChart3
} from "lucide-react";
import { RouteSummary } from "@/components/routes/types";

interface SummaryCardsProps {
  summary: RouteSummary | null;
  activeTab: string;
}

export function SummaryCards({ summary, activeTab }: SummaryCardsProps) {
  if (!summary) return null;

  // Optimization Tab KPIs
  if (activeTab === "optimization") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardItem 
            title="Total Routes" 
            value={summary.totalRoutes.toString()} 
            icon={<Route className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="All planned routes"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Active Routes" 
            value={summary.activeRoutes.toString()} 
            valueClassName="text-blue-500"
            icon={<Truck className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle={`${Math.round((summary.activeRoutes / summary.totalRoutes) * 100)}% currently active`}
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Completed Routes" 
            value={summary.completedRoutes.toString()}
            valueClassName="text-green-500"
            icon={<CheckCircle className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle={`${Math.round((summary.completedRoutes / summary.totalRoutes) * 100)}% completion rate`}
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Avg. Distance" 
            value={`${summary.averageRouteDistance} mi`}
            valueClassName="text-amber-500"
            icon={<AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle={`Total: ${summary.totalDistance.toLocaleString()} miles`}
          />
        </Card>
      </div>
    );
  }

  // Management Tab KPIs
  if (activeTab === "management") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardItem 
            title="Route Templates" 
            value="18"
            valueClassName="text-purple-500"
            icon={<Copy className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Reusable route templates"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Schedule Adherence" 
            value="92%"
            valueClassName="text-green-500"
            icon={<Calendar className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Routes following schedule"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Driver Assignments" 
            value="26"
            valueClassName="text-blue-500"
            icon={<User className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Drivers currently assigned"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Vehicle Utilization" 
            value="87%"
            valueClassName="text-amber-500"
            icon={<Truck className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Fleet capacity utilization"
          />
        </Card>
      </div>
    );
  }

  // Traffic Tab KPIs
  if (activeTab === "traffic") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardItem 
            title="Traffic Congestion" 
            value="42%"
            valueClassName="text-red-500"
            icon={<TrafficCone className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Average urban congestion"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Avg. Speed" 
            value="34 mph"
            valueClassName="text-blue-500"
            icon={<LineChart className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Average route speed"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Delay Impact" 
            value="+18%"
            valueClassName="text-amber-500"
            icon={<Clock className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Added time from traffic"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Rerouting Events" 
            value="127"
            valueClassName="text-purple-500"
            icon={<Route className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Real-time route adjustments"
          />
        </Card>
      </div>
    );
  }

  // Insights Tab KPIs
  if (activeTab === "insights") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardItem 
            title="Efficiency Score" 
            value="86.3"
            valueClassName="text-green-500"
            icon={<Activity className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Overall system efficiency"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Cost Per Mile" 
            value="$1.24"
            valueClassName="text-blue-500"
            icon={<DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Average operational cost"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="Fuel Efficiency" 
            value="6.8 mpg"
            valueClassName="text-amber-500"
            icon={<FuelIcon className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="Fleet average consumption"
          />
        </Card>
        
        <Card>
          <CardItem 
            title="CO₂ Reduction" 
            value="-12%"
            valueClassName="text-green-600"
            icon={<Wind className="h-4 w-4 mr-1 text-muted-foreground" />}
            subtitle="YoY emissions improvement"
          />
        </Card>
      </div>
    );
  }

  // Fallback to basic stats if no specific tab is matched
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardItem 
          title="Total Routes" 
          value={summary.totalRoutes.toString()} 
          icon={<Route className="h-4 w-4 mr-1 text-muted-foreground" />}
          subtitle="All planned routes"
        />
      </Card>
      
      <Card>
        <CardItem 
          title="Active Routes" 
          value={summary.activeRoutes.toString()} 
          valueClassName="text-blue-500"
          icon={<Truck className="h-4 w-4 mr-1 text-muted-foreground" />}
          subtitle={`${Math.round((summary.activeRoutes / summary.totalRoutes) * 100)}% currently active`}
        />
      </Card>
      
      <Card>
        <CardItem 
          title="Completed Routes" 
          value={summary.completedRoutes.toString()}
          valueClassName="text-green-500"
          icon={<CheckCircle className="h-4 w-4 mr-1 text-muted-foreground" />}
          subtitle={`${Math.round((summary.completedRoutes / summary.totalRoutes) * 100)}% completion rate`}
        />
      </Card>
      
      <Card>
        <CardItem 
          title="Avg. Distance" 
          value={`${summary.averageRouteDistance} mi`}
          valueClassName="text-amber-500"
          icon={<AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />}
          subtitle={`Total: ${summary.totalDistance.toLocaleString()} miles`}
        />
      </Card>
    </div>
  );
}

interface CardItemProps {
  title: string;
  value: string;
  valueClassName?: string;
  icon: React.ReactNode;
  subtitle: string;
}

function CardItem({ title, value, valueClassName = "", icon, subtitle }: CardItemProps) {
  return (
    <div className="p-6">
      <div className="text-sm font-medium">{title}</div>
      <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
      <div className="flex items-center">
        {icon}
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
} 