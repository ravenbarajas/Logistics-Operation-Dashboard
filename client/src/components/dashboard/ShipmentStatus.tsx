import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { activeShipments } from "@/data/mock-data";

export default function ShipmentStatus() {
  return (
    <Card>
      <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Active Shipments</CardTitle>
        <Button>View All</Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {activeShipments.map((shipment) => (
          <div key={shipment.id} className="border border-border rounded-md p-3 mb-3 last:mb-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">Order #{shipment.id}</h3>
                <p className="text-sm text-muted-foreground">{shipment.route}</p>
              </div>
              <Badge
                variant={shipment.status === "Delayed" ? "destructive" : "secondary"}
                className={cn(
                  shipment.status === "Delayed" 
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20" 
                    : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                )}
              >
                {shipment.status}
              </Badge>
            </div>
            
            {/* Timeline */}
            <div className="relative">
              <div className="absolute h-full w-px bg-border left-2 top-0"></div>
              <div className="space-y-3">
                {shipment.timeline.map((event, index) => (
                  <div key={index} className="relative flex items-center pl-6">
                    <div 
                      className={cn(
                        "absolute left-0 w-4 h-4 rounded-full border-4 border-background",
                        event.completed 
                          ? event.delayed 
                            ? "bg-destructive" 
                            : event.current 
                              ? "bg-accent"
                              : "bg-secondary"
                          : "bg-muted"
                      )}
                    ></div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-xs font-medium",
                        !event.completed && "text-muted-foreground"
                      )}>
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
