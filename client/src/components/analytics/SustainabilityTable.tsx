import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { 
  sustainabilityData, 
  carbonOffsetProjects, 
  emissionsByVehicleData 
} from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";

// Sustainability Metrics Table
export type SustainabilityMetrics = {
  quarter: string;
  carbonEmissions: number;
  fuelEfficiency: number;
  electricVehicles: number;
  renewableEnergy: number;
};

export const sustainabilityColumns = [
  {
    id: "quarter",
    header: "Quarter",
    accessorKey: "quarter",
    cell: (row: SustainabilityMetrics) => <div>{row.quarter}</div>,
  },
  {
    id: "carbonEmissions",
    header: "Carbon Emissions (tons)",
    accessorKey: "carbonEmissions",
    cell: (row: SustainabilityMetrics) => {
      const value = row.carbonEmissions;
      const quarterIndex = sustainabilityData.findIndex(d => d.quarter === row.quarter);
      const prevValue = quarterIndex > 0 ? sustainabilityData[quarterIndex - 1].carbonEmissions : value;
      const percentChange = ((value - prevValue) / prevValue) * 100;
      
      return (
        <div className="flex items-center">
          <span className="font-medium mr-2">{value.toLocaleString()}</span>
          {quarterIndex > 0 && (
            <span className={percentChange < 0 ? "text-green-500" : "text-red-500"}>
              {percentChange < 0 ? "↓" : "↑"} {Math.abs(percentChange).toFixed(1)}%
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "fuelEfficiency",
    header: "Fuel Efficiency (mpg)",
    accessorKey: "fuelEfficiency",
    cell: (row: SustainabilityMetrics) => {
      return <div className="font-medium">{row.fuelEfficiency} mpg</div>;
    },
  },
  {
    id: "electricVehicles",
    header: "Electric Vehicles",
    accessorKey: "electricVehicles",
    cell: (row: SustainabilityMetrics) => {
      return <div className="font-medium">{row.electricVehicles} units</div>;
    },
  },
  {
    id: "renewableEnergy",
    header: "Renewable Energy",
    accessorKey: "renewableEnergy",
    cell: (row: SustainabilityMetrics) => {
      return <div className="font-medium">{row.renewableEnergy}%</div>;
    },
  },
];

// Carbon Offset Projects
export type CarbonOffsetProject = {
  project: string;
  contribution: number;
  offset: number;
  status: string;
};

export const carbonOffsetColumns = [
  {
    id: "project",
    header: "Project Name",
    accessorKey: "project",
    cell: (row: CarbonOffsetProject) => <div>{row.project}</div>,
  },
  {
    id: "contribution",
    header: "Contribution",
    accessorKey: "contribution",
    cell: (row: CarbonOffsetProject) => {
      return <div className="font-medium">${(row.contribution * 1000).toLocaleString()}</div>;
    },
  },
  {
    id: "offset",
    header: "CO2 Offset",
    accessorKey: "offset",
    cell: (row: CarbonOffsetProject) => {
      return <div className="font-medium">{row.offset} tons</div>;
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: (row: CarbonOffsetProject) => {
      const status = row.status;
      let badgeVariant = "";
      
      switch (status) {
        case "active":
          badgeVariant = "bg-green-500 hover:bg-green-600";
          break;
        case "completed":
          badgeVariant = "bg-blue-500 hover:bg-blue-600";
          break;
        case "planning":
          badgeVariant = "bg-yellow-500 hover:bg-yellow-600";
          break;
        default:
          badgeVariant = "bg-gray-500 hover:bg-gray-600";
      }
      
      return (
        <Badge className={badgeVariant + " capitalize"}>
          {status}
        </Badge>
      );
    },
  },
];

// Emissions by Vehicle Type
export type EmissionsByVehicle = {
  type: string;
  emissions: number;
  distance: number;
  emissionsPerMile?: number;
};

export const emissionsColumns = [
  {
    id: "type",
    header: "Vehicle Type",
    accessorKey: "type",
    cell: (row: EmissionsByVehicle) => <div>{row.type}</div>,
  },
  {
    id: "emissions",
    header: "CO2 Emissions Rate",
    accessorKey: "emissions",
    cell: (row: EmissionsByVehicle) => {
      return <div className="font-medium">{row.emissions} kg/mile</div>;
    },
  },
  {
    id: "distance",
    header: "Total Distance",
    accessorKey: "distance",
    cell: (row: EmissionsByVehicle) => {
      return <div className="font-medium">{(row.distance).toLocaleString()} miles</div>;
    },
  },
  {
    id: "emissionsPerMile",
    header: "Total Emissions",
    accessorKey: "emissionsPerMile",
    cell: (row: EmissionsByVehicle) => {
      const emissions = row.emissions;
      const distance = row.distance;
      const totalEmissions = emissions * distance / 1000; // Convert to tons
      
      return <div className="font-medium">{totalEmissions.toFixed(1)} tons</div>;
    },
  },
];

export function SustainabilityTables() {
  const calculatedEmissionsData = emissionsByVehicleData.map(item => ({
    ...item,
    emissionsPerMile: item.emissions * item.distance / 1000
  }));

  return (
    <div className="space-y-4">
      <DataTable
        columns={sustainabilityColumns}
        data={sustainabilityData}
        searchColumn="quarter"
        title="Sustainability Metrics Over Time"
        searchPlaceholder="Search by quarter..."
      />

      <DataTable
        columns={carbonOffsetColumns}
        data={carbonOffsetProjects}
        searchColumn="project"
        title="Carbon Offset Projects"
        searchPlaceholder="Search by project..."
      />

      <DataTable
        columns={emissionsColumns}
        data={calculatedEmissionsData}
        searchColumn="type"
        title="Emissions Analysis by Vehicle Type"
        searchPlaceholder="Search by vehicle type..."
      />
    </div>
  );
} 