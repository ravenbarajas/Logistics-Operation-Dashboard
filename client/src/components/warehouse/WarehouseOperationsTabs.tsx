import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { WarehouseIcon, Boxes } from "lucide-react";
import { Warehouse } from "@shared/schema";
import { Inventory } from "@shared/schema";

interface WarehouseOperationsTabsProps {
  warehouseData: Warehouse[];
  inventoryData: Inventory[];
  warehouseContent: React.ReactNode;
  inventoryContent: React.ReactNode;
}

export function WarehouseOperationsTabs({
  warehouseData,
  inventoryData,
  warehouseContent,
  inventoryContent
}: WarehouseOperationsTabsProps) {
  return (
    <Tabs defaultValue="warehouses" className="mb-6 space-y-6">
      <TabsList className="grid grid-cols-2 w-full md:w-auto">
        <TabsTrigger value="warehouses">
          <WarehouseIcon className="h-5 w-5 mr-2 text-primary" />
          Warehouses
        </TabsTrigger>
        <TabsTrigger value="inventory">
          <Boxes className="h-5 w-5 mr-2 text-primary" />
          Inventory
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="warehouses">
        {warehouseContent}
      </TabsContent>
            
      <TabsContent value="inventory">
        {inventoryContent}
      </TabsContent>
    </Tabs>
  );
} 