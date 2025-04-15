import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowUp, ArrowDown, DollarSign, Warehouse as WarehouseIcon, Package2, CheckCircle2 } from "lucide-react";

interface InventorySummaryCardsProps {
  totalInventoryValue: number;
  spaceUtilization: number;
  totalItems: number;
  fulfillmentRate: number;
  inventoryValueChange: number;
  spaceUtilizationChange: number;
  totalItemsChange: number;
  fulfillmentRateChange: number;
}

export function InventorySummaryCards({
  totalInventoryValue,
  spaceUtilization,
  totalItems,
  fulfillmentRate,
  inventoryValueChange,
  spaceUtilizationChange,
  totalItemsChange,
  fulfillmentRateChange
}: InventorySummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-primary" />
            Total Inventory Value
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
          <div className="flex items-center">
            {inventoryValueChange >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
            )}
            <p className={`text-xs ${inventoryValueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(inventoryValueChange).toFixed(1)}% from last month
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <WarehouseIcon className="h-4 w-4 mr-2 text-primary" />
            Space Utilization
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="text-2xl font-bold">{spaceUtilization.toFixed(1)}%</div>
          <div className="flex items-center">
            {spaceUtilizationChange >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
            )}
            <p className={`text-xs ${spaceUtilizationChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(spaceUtilizationChange).toFixed(1)}% from last month
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Package2 className="h-4 w-4 mr-2 text-primary" />
            Total Inventory Items
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
          <div className="flex items-center">
            {totalItemsChange >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
            )}
            <p className={`text-xs ${totalItemsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(totalItemsChange)} new items this month
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
            Order Fulfillment Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="text-2xl font-bold">{fulfillmentRate.toFixed(1)}%</div>
          <div className="flex items-center">
            {fulfillmentRateChange >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
            )}
            <p className={`text-xs ${fulfillmentRateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(fulfillmentRateChange).toFixed(1)}% from last week
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 