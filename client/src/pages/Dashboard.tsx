import { useState, useEffect } from "react";
import KpiCards from "@/components/dashboard/KpiCards";
import RealtimeMap from "@/components/dashboard/RealtimeMap";
import ShipmentStatus from "@/components/dashboard/ShipmentStatus";
import OrdersTable from "@/components/dashboard/OrdersTable";
import FleetStatus from "@/components/dashboard/FleetStatus";
import PerformanceCharts from "@/components/dashboard/PerformanceCharts";
import AlertsNotifications from "@/components/dashboard/AlertsNotifications";

export default function Dashboard() {
  // Load Chart.js and Leaflet dynamically
  useEffect(() => {
    const loadExternalScripts = async () => {
      // Load Leaflet
      if (!window.L) {
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
        leafletScript.async = true;
        document.body.appendChild(leafletScript);
      }
      
      // Load Chart.js
      if (!window.Chart) {
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        chartScript.async = true;
        document.body.appendChild(chartScript);
      }
    };
    
    loadExternalScripts();
  }, []);
  
  return (
    <div className="container mx-auto p-4 lg:p-6">
      {/* Dashboard Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Logistics Operations Dashboard</h1>
        <p className="text-muted-foreground">Overview of all logistics operations and KPIs</p>
      </div>
      
      {/* KPI Cards */}
      <KpiCards />
      
      {/* Map and Shipment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <RealtimeMap />
        <ShipmentStatus />
      </div>
      
      {/* Order Management and Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <OrdersTable />
        <FleetStatus />
      </div>
      
      {/* Performance Analytics */}
      <PerformanceCharts />
      
      {/* Alerts & Notifications */}
      <AlertsNotifications />
    </div>
  );
}
