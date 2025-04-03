import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { costAnalysisData, costPerMileData, maintenanceCostByVehicleType } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";

// Monthly Cost Analysis Table
export type CostAnalysis = {
  month: string;
  fuel: number;
  maintenance: number;
  labor: number;
  insurance: number;
  other: number;
  total?: number;
};

export const costAnalysisColumns = [
  {
    id: "month",
    header: "Month",
    accessorKey: "month",
    cell: (row: CostAnalysis) => <div>{row.month}</div>,
  },
  {
    id: "fuel",
    header: "Fuel Cost",
    accessorKey: "fuel",
    cell: (row: CostAnalysis) => {
      return <div className="font-medium">${row.fuel.toLocaleString()}</div>;
    },
  },
  {
    id: "maintenance",
    header: "Maintenance",
    accessorKey: "maintenance",
    cell: (row: CostAnalysis) => {
      return <div className="font-medium">${row.maintenance.toLocaleString()}</div>;
    },
  },
  {
    id: "labor",
    header: "Labor",
    accessorKey: "labor",
    cell: (row: CostAnalysis) => {
      return <div className="font-medium">${row.labor.toLocaleString()}</div>;
    },
  },
  {
    id: "insurance",
    header: "Insurance",
    accessorKey: "insurance",
    cell: (row: CostAnalysis) => {
      return <div className="font-medium">${row.insurance.toLocaleString()}</div>;
    },
  },
  {
    id: "other",
    header: "Other",
    accessorKey: "other",
    cell: (row: CostAnalysis) => {
      return <div className="font-medium">${row.other.toLocaleString()}</div>;
    },
  },
  {
    id: "total",
    header: "Total Cost",
    accessorKey: "total",
    cell: (row: CostAnalysis) => {
      const total = row.fuel + row.maintenance + row.labor + row.insurance + row.other;
      return <div className="font-medium">${total.toLocaleString()}</div>;
    },
  },
];

// Cost Per Mile Table
export type CostPerMile = {
  month: string;
  heavyTruck: number;
  mediumTruck: number;
  deliveryVan: number;
  electric: number;
};

export const costPerMileColumns = [
  {
    id: "month",
    header: "Month",
    accessorKey: "month",
    cell: (row: CostPerMile) => <div>{row.month}</div>,
  },
  {
    id: "heavyTruck",
    header: "Heavy Truck",
    accessorKey: "heavyTruck",
    cell: (row: CostPerMile) => {
      return <div className="font-medium">${row.heavyTruck.toFixed(2)}/mile</div>;
    },
  },
  {
    id: "mediumTruck",
    header: "Medium Truck",
    accessorKey: "mediumTruck",
    cell: (row: CostPerMile) => {
      return <div className="font-medium">${row.mediumTruck.toFixed(2)}/mile</div>;
    },
  },
  {
    id: "deliveryVan",
    header: "Delivery Van",
    accessorKey: "deliveryVan",
    cell: (row: CostPerMile) => {
      return <div className="font-medium">${row.deliveryVan.toFixed(2)}/mile</div>;
    },
  },
  {
    id: "electric",
    header: "Electric Vehicle",
    accessorKey: "electric",
    cell: (row: CostPerMile) => {
      return <div className="font-medium">${row.electric.toFixed(2)}/mile</div>;
    },
  },
];

// Maintenance Cost by Vehicle Type
export type MaintenanceCost = {
  type: string;
  preventive: number;
  corrective: number;
  emergency: number;
  total?: number;
};

export const maintenanceCostColumns = [
  {
    id: "type",
    header: "Vehicle Type",
    accessorKey: "type",
    cell: (row: MaintenanceCost) => <div>{row.type}</div>,
  },
  {
    id: "preventive",
    header: "Preventive",
    accessorKey: "preventive",
    cell: (row: MaintenanceCost) => {
      return <div className="font-medium">{row.preventive}%</div>;
    },
  },
  {
    id: "corrective",
    header: "Corrective",
    accessorKey: "corrective",
    cell: (row: MaintenanceCost) => {
      return <div className="font-medium">{row.corrective}%</div>;
    },
  },
  {
    id: "emergency",
    header: "Emergency",
    accessorKey: "emergency",
    cell: (row: MaintenanceCost) => {
      return <div className="font-medium">{row.emergency}%</div>;
    },
  },
  {
    id: "total",
    header: "Risk Score",
    accessorKey: "total",
    cell: (row: MaintenanceCost) => {
      const preventive = row.preventive;
      const emergency = row.emergency;
      const riskScore = emergency * 2 - preventive * 0.5;
      let badgeColor = "bg-green-500 hover:bg-green-600";
      
      if (riskScore > 25) {
        badgeColor = "bg-red-500 hover:bg-red-600";
      } else if (riskScore > 15) {
        badgeColor = "bg-yellow-500 hover:bg-yellow-600";
      }
      
      return (
        <Badge className={badgeColor}>
          {riskScore.toFixed(1)}
        </Badge>
      );
    },
  },
];

export function CostAnalysisTables() {
  const calculatedCostData = costAnalysisData.map(item => ({
    ...item,
    total: item.fuel + item.maintenance + item.labor + item.insurance + item.other
  }));

  return (
    <div className="space-y-4">
      <DataTable
        columns={costAnalysisColumns}
        data={calculatedCostData}
        searchColumn="month"
        title="Monthly Cost Breakdown"
        searchPlaceholder="Search by month..."
      />

      <DataTable
        columns={costPerMileColumns}
        data={costPerMileData}
        searchColumn="month"
        title="Cost Per Mile Analysis"
        searchPlaceholder="Search by month..."
      />

      <DataTable
        columns={maintenanceCostColumns}
        data={maintenanceCostByVehicleType}
        searchColumn="type"
        title="Maintenance Distribution by Vehicle Type"
        searchPlaceholder="Search by vehicle type..."
      />
    </div>
  );
} 