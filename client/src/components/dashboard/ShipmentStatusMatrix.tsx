import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { activeShipments } from "@/data/mock-data";
import { Package, Clock, Info, CheckCircle2, AlertCircle } from "lucide-react";

interface ShipmentStatusMatrixProps {
  period: string;
}

export default function ShipmentStatusMatrix({ period }: ShipmentStatusMatrixProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [shipments, setShipments] = useState(activeShipments);
  
  // Filter shipments based on tab
  useEffect(() => {
    if (activeTab === "all") {
      setShipments(activeShipments);
    } else {
      setShipments(activeShipments.filter(shipment => shipment.status === activeTab));
    }
  }, [activeTab]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-transit":
        return <Clock className="h-4 w-4 text-secondary" />;
      case "delayed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "pending":
        return <Info className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-transit":
        return "bg-secondary/10 text-secondary border-secondary/40";
      case "delayed":
        return "bg-destructive/10 text-destructive border-destructive/40";
      case "delivered":
        return "bg-success/10 text-success border-success/40";
      case "pending":
        return "bg-muted/10 text-muted-foreground border-muted/40";
      default:
        return "bg-primary/10 text-primary border-primary/40";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Shipment Status</CardTitle>
            <CardDescription>Real-time tracking of active shipments</CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className="font-mono text-xs">
              {activeShipments.length} Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4">
            <TabsList className="w-full justify-start border-b rounded-none h-9 mb-0 bg-transparent space-x-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary rounded-none h-9 px-1">
                All
              </TabsTrigger>
              <TabsTrigger value="in-transit" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary rounded-none h-9 px-1">
                In Transit
              </TabsTrigger>
              <TabsTrigger value="delayed" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary rounded-none h-9 px-1">
                Delayed
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary rounded-none h-9 px-1">
                Pending
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="h-[300px] px-4">
            <div className="pt-2 space-y-2">
              {shipments.map((shipment) => (
                <div 
                  key={shipment.id}
                  className={`p-3 border rounded-lg ${shipment.status === "delayed" ? "border-destructive/30" : "border-muted"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm flex items-center space-x-1">
                        <span>#{shipment.id}</span>
                        <Badge variant="outline" className={`ml-2 ${getStatusColor(shipment.status)}`}>
                          <span className="flex items-center">
                            {getStatusIcon(shipment.status)}
                            <span className="ml-1 capitalize">{shipment.status.replace("-", " ")}</span>
                          </span>
                        </Badge>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{shipment.route}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{shipment.eta}</p>
                      <p className="text-xs text-muted-foreground mt-1">{shipment.vehicle}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex relative items-center mb-2">
                      {shipment.timeline.map((event, index) => (
                        <div 
                          key={`${shipment.id}-event-${index}`} 
                          className="flex-1 relative z-10"
                        >
                          <div 
                            className={`
                              h-2 w-2 rounded-full mx-auto 
                              ${event.completed ? ('delayed' in event && event.delayed ? "bg-destructive" : "bg-success") : "bg-muted"} 
                              ${event.current ? "ring-2 ring-offset-2 ring-primary/30" : ""}
                            `}
                          />
                          {index < shipment.timeline.length - 1 && (
                            <div 
                              className={`absolute top-1 h-0.5 w-full 
                                ${event.completed ? ('delayed' in event && event.delayed ? "bg-destructive/30" : "bg-success/30") : "bg-muted/30"}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex text-[10px]">
                      <div className="flex-1 text-center">
                        <div className={`font-medium ${shipment.timeline[0]?.completed ? "text-success" : "text-muted-foreground"}`}>
                          Pickup
                        </div>
                      </div>
                      {shipment.timeline.length > 2 && (
                        <div className="flex-1 text-center">
                          <div className={`font-medium ${
                            shipment.timeline.find(t => t.current && 'delayed' in t && t.delayed) 
                              ? "text-destructive" 
                              : shipment.timeline[1]?.completed 
                                ? "text-success" 
                                : "text-muted-foreground"
                          }`}>
                            In Transit
                          </div>
                        </div>
                      )}
                      <div className="flex-1 text-center">
                        <div className={`font-medium ${
                          shipment.timeline[shipment.timeline.length - 1]?.completed 
                            ? "text-success" 
                            : "text-muted-foreground"
                        }`}>
                          Delivery
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-muted/60">
                    <div className="flex items-center text-xs">
                      <span className="text-muted-foreground mr-1">Origin:</span>
                      <span className="font-medium">{shipment.origin}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="text-muted-foreground mr-1">Destination:</span>
                      <span className="font-medium">{shipment.destination}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
        
        <div className="flex justify-between items-center p-3 border-t mt-1">
          <div className="text-xs text-muted-foreground">
            Updated 2 minutes ago
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-8">
            View All Shipments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 