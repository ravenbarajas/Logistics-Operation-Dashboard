import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Fuel, Droplets, DollarSign, Gauge } from "lucide-react";
import { ConsumptionTab, CostTab, EfficiencyTab } from "./fuel";

export function FuelTab() {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="bg-background">
        <CardTitle className="text-xl flex items-center">
          <Fuel className="h-5 w-5 mr-2 text-primary" />
          Fuel Analytics & Optimization System
        </CardTitle>
        <CardDescription>
          Track fuel consumption, costs, and optimize efficiency across your fleet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="consumption" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="consumption">
              <Droplets className="h-4 w-4 mr-2" />
              Consumption Analytics
            </TabsTrigger>
            <TabsTrigger value="cost">
              <DollarSign className="h-4 w-4 mr-2" />
              Cost Tracking
            </TabsTrigger>
            <TabsTrigger value="efficiency">
              <Gauge className="h-4 w-4 mr-2" />
              Efficiency Monitoring
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="consumption">
            <ConsumptionTab />
          </TabsContent>
          
          <TabsContent value="cost">
            <CostTab />
          </TabsContent>
          
          <TabsContent value="efficiency">
            <EfficiencyTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 