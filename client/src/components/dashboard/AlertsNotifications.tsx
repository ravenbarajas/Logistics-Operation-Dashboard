import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Activity } from "lucide-react";
import { alertsData } from "@/data/mock-data";

export default function AlertsNotifications() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="text-destructive" />;
      case 'warning':
        return <AlertCircle className="text-accent" />;
      case 'info':
        return <Activity className="text-secondary" />;
      default:
        return <AlertCircle />;
    }
  };
  
  const getAlertClasses = (type: string) => {
    switch (type) {
      case 'error':
        return "border-destructive/20 bg-destructive/10";
      case 'warning':
        return "border-accent/20 bg-accent/10";
      case 'info':
        return "border-secondary/20 bg-secondary/10";
      default:
        return "border-border bg-background";
    }
  };
  
  return (
    <div className="mb-6">
      <Card>
        <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
          <Button variant="outline">View All</Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {alertsData.map((alert, index) => (
              <div 
                key={index} 
                className={`flex items-start p-3 border rounded-md ${getAlertClasses(alert.type)}`}
              >
                <div className="mr-3 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
