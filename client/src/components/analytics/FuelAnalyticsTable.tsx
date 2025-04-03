import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { fuelConsumptionData } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";

// Monthly Fuel Consumption Table
export type FuelConsumption = {
  month: string;
  diesel: number;
  gasoline: number;
  electric: number;
  total?: number;
  cost?: number;
};

export const fuelConsumptionColumns = [
  {
    id: "month",
    header: "Month",
    accessorKey: "month",
    cell: (row: FuelConsumption) => <div>{row.month}</div>,
  },
  {
    id: "diesel",
    header: "Diesel (gal)",
    accessorKey: "diesel",
    cell: (row: FuelConsumption) => {
      return <div className="font-medium">{row.diesel.toLocaleString()}</div>;
    },
  },
  {
    id: "gasoline",
    header: "Gasoline (gal)",
    accessorKey: "gasoline",
    cell: (row: FuelConsumption) => {
      return <div className="font-medium">{row.gasoline.toLocaleString()}</div>;
    },
  },
  {
    id: "electric",
    header: "Electric (kWh)",
    accessorKey: "electric",
    cell: (row: FuelConsumption) => {
      return <div className="font-medium">{row.electric.toLocaleString()}</div>;
    },
  },
  {
    id: "total",
    header: "Total (Diesel Equivalent)",
    accessorKey: "total",
    cell: (row: FuelConsumption) => {
      const diesel = row.diesel;
      const gasoline = row.gasoline;
      const electric = row.electric;
      // Convert gasoline and electric to diesel equivalent for total
      const gasolineEquivalent = gasoline * 0.88; // Conversion factor
      const electricEquivalent = electric * 0.03; // Conversion factor
      const total = diesel + gasolineEquivalent + electricEquivalent;
      
      return <div className="font-medium">{total.toFixed(0)} gal</div>;
    },
  },
  {
    id: "cost",
    header: "Estimated Cost",
    accessorKey: "cost",
    cell: (row: FuelConsumption) => {
      const diesel = row.diesel;
      const gasoline = row.gasoline;
      const electric = row.electric;
      // Calculate cost based on average prices
      const dieselCost = diesel * 3.85; // $3.85 per gallon
      const gasolineCost = gasoline * 3.65; // $3.65 per gallon
      const electricCost = electric * 0.15; // $0.15 per kWh
      const totalCost = dieselCost + gasolineCost + electricCost;
      
      return <div className="font-medium">${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>;
    },
  },
];

// Fuel Efficiency Table
export type FuelEfficiency = {
  month: string;
  dieselMpg: number;
  gasolineMpg: number;
  electricMpkWh: number;
  overallEfficiency: string;
};

export const fuelEfficiencyData = [
  { month: "Jan", dieselMpg: 7.2, gasolineMpg: 9.5, electricMpkWh: 3.2, overallEfficiency: "Medium" },
  { month: "Feb", dieselMpg: 7.3, gasolineMpg: 9.3, electricMpkWh: 3.2, overallEfficiency: "Medium" },
  { month: "Mar", dieselMpg: 7.1, gasolineMpg: 9.1, electricMpkWh: 3.3, overallEfficiency: "Medium" },
  { month: "Apr", dieselMpg: 7.0, gasolineMpg: 9.0, electricMpkWh: 3.3, overallEfficiency: "Low" },
  { month: "May", dieselMpg: 7.4, gasolineMpg: 9.4, electricMpkWh: 3.4, overallEfficiency: "Medium" },
  { month: "Jun", dieselMpg: 7.8, gasolineMpg: 9.7, electricMpkWh: 3.5, overallEfficiency: "High" },
  { month: "Jul", dieselMpg: 7.9, gasolineMpg: 9.8, electricMpkWh: 3.5, overallEfficiency: "High" },
];

export const fuelEfficiencyColumns = [
  {
    id: "month",
    header: "Month",
    accessorKey: "month",
    cell: (row: FuelEfficiency) => <div>{row.month}</div>,
  },
  {
    id: "dieselMpg",
    header: "Diesel (MPG)",
    accessorKey: "dieselMpg",
    cell: (row: FuelEfficiency) => {
      return <div className="font-medium">{row.dieselMpg} mpg</div>;
    },
  },
  {
    id: "gasolineMpg",
    header: "Gasoline (MPG)",
    accessorKey: "gasolineMpg",
    cell: (row: FuelEfficiency) => {
      return <div className="font-medium">{row.gasolineMpg} mpg</div>;
    },
  },
  {
    id: "electricMpkWh",
    header: "Electric (miles/kWh)",
    accessorKey: "electricMpkWh",
    cell: (row: FuelEfficiency) => {
      return <div className="font-medium">{row.electricMpkWh} mi/kWh</div>;
    },
  },
  {
    id: "overallEfficiency",
    header: "Overall Rating",
    accessorKey: "overallEfficiency",
    cell: (row: FuelEfficiency) => {
      const rating = row.overallEfficiency;
      let badgeVariant = "";
      
      switch (rating) {
        case "High":
          badgeVariant = "bg-green-500 hover:bg-green-600";
          break;
        case "Medium":
          badgeVariant = "bg-yellow-500 hover:bg-yellow-600";
          break;
        case "Low":
          badgeVariant = "bg-red-500 hover:bg-red-600";
          break;
        default:
          badgeVariant = "bg-gray-500 hover:bg-gray-600";
      }
      
      return (
        <Badge className={badgeVariant}>
          {rating}
        </Badge>
      );
    },
  },
];

// Fuel Supplier Performance
export type FuelSupplier = {
  supplier: string;
  fuelType: string;
  quality: string;
  deliveryReliability: number;
  costRating: number;
  overallScore: number;
};

export const fuelSupplierData = [
  { supplier: "PetroCorp", fuelType: "Diesel", quality: "Premium", deliveryReliability: 98, costRating: 85, overallScore: 92 },
  { supplier: "EcoFuels", fuelType: "Biodiesel", quality: "Standard", deliveryReliability: 95, costRating: 75, overallScore: 85 },
  { supplier: "GasExpress", fuelType: "Gasoline", quality: "Premium", deliveryReliability: 97, costRating: 82, overallScore: 90 },
  { supplier: "ElectroCharge", fuelType: "Electricity", quality: "Green", deliveryReliability: 99, costRating: 88, overallScore: 94 },
  { supplier: "ValueGas", fuelType: "Gasoline", quality: "Regular", deliveryReliability: 92, costRating: 95, overallScore: 93 },
  { supplier: "TruckFuel Ltd", fuelType: "Diesel", quality: "Standard", deliveryReliability: 93, costRating: 90, overallScore: 91 },
];

export const fuelSupplierColumns = [
  {
    id: "supplier",
    header: "Supplier",
    accessorKey: "supplier",
    cell: (row: FuelSupplier) => <div>{row.supplier}</div>,
  },
  {
    id: "fuelType",
    header: "Fuel Type",
    accessorKey: "fuelType",
    cell: (row: FuelSupplier) => <div>{row.fuelType}</div>,
  },
  {
    id: "quality",
    header: "Quality Grade",
    accessorKey: "quality",
    cell: (row: FuelSupplier) => <div>{row.quality}</div>,
  },
  {
    id: "deliveryReliability",
    header: "Delivery Reliability",
    accessorKey: "deliveryReliability",
    cell: (row: FuelSupplier) => {
      return <div className="font-medium">{row.deliveryReliability}%</div>;
    },
  },
  {
    id: "costRating",
    header: "Cost Rating",
    accessorKey: "costRating",
    cell: (row: FuelSupplier) => {
      return <div className="font-medium">{row.costRating}/100</div>;
    },
  },
  {
    id: "overallScore",
    header: "Overall Score",
    accessorKey: "overallScore",
    cell: (row: FuelSupplier) => {
      const score = row.overallScore;
      let badgeVariant = "";
      
      if (score >= 90) {
        badgeVariant = "bg-green-500 hover:bg-green-600";
      } else if (score >= 80) {
        badgeVariant = "bg-blue-500 hover:bg-blue-600";
      } else if (score >= 70) {
        badgeVariant = "bg-yellow-500 hover:bg-yellow-600";
      } else {
        badgeVariant = "bg-red-500 hover:bg-red-600";
      }
      
      return (
        <Badge className={badgeVariant}>
          {score}/100
        </Badge>
      );
    },
  },
];

export function FuelAnalyticsTables() {
  const calculatedFuelData = fuelConsumptionData.map(item => {
    const diesel = item.diesel;
    const gasoline = item.gasoline;
    const electric = item.electric;
    const gasolineEquivalent = gasoline * 0.88;
    const electricEquivalent = electric * 0.03;
    const total = diesel + gasolineEquivalent + electricEquivalent;
    
    const dieselCost = diesel * 3.85;
    const gasolineCost = gasoline * 3.65;
    const electricCost = electric * 0.15;
    const cost = dieselCost + gasolineCost + electricCost;
    
    return {
      ...item,
      total,
      cost
    };
  });

  return (
    <div className="space-y-4">
      <DataTable
        columns={fuelConsumptionColumns}
        data={calculatedFuelData}
        searchColumn="month"
        title="Monthly Fuel Consumption"
        searchPlaceholder="Search by month..."
      />

      <DataTable
        columns={fuelEfficiencyColumns}
        data={fuelEfficiencyData}
        searchColumn="month"
        title="Fuel Efficiency Metrics"
        searchPlaceholder="Search by month..."
      />

      <DataTable
        columns={fuelSupplierColumns}
        data={fuelSupplierData}
        searchColumn="supplier"
        title="Fuel Supplier Performance"
        searchPlaceholder="Search by supplier..."
      />
    </div>
  );
} 