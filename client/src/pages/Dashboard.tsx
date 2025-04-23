import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdvancedKpiGrid from "@/components/dashboard/AdvancedKpiGrid";
import LogisticsNetworkMap from "@/components/dashboard/LogisticsNetworkMap";
import ShipmentStatusMatrix from "@/components/dashboard/ShipmentStatusMatrix";
import FleetPerformancePanel from "@/components/dashboard/FleetPerformancePanel";
import OperationalEfficiency from "@/components/dashboard/OperationalEfficiency";
import CostAnalyticsDashboard from "@/components/dashboard/CostAnalyticsDashboard";
import SustainabilityMetrics from "@/components/dashboard/SustainabilityMetrics";
import PredictiveAnalytics from "@/components/dashboard/PredictiveAnalytics";
import SystemStatusPanel from "@/components/dashboard/SystemStatusPanel";
import DeliveryPerformanceMatrix from "@/components/dashboard/DeliveryPerformanceMatrix";

// Extend Window interface to include Chart and ApexCharts
declare global {
  interface Window {
    Chart: any;
    ApexCharts: any;
    L: any;
  }
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Load required libraries dynamically
  useEffect(() => {
    const loadExternalScripts = async () => {
      try {
        // Load Leaflet if not already loaded
        if (!window.L) {
          await new Promise<void>((resolve, reject) => {
            // Load Leaflet CSS
            const leafletCss = document.createElement('link');
            leafletCss.rel = 'stylesheet';
            leafletCss.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
            document.head.appendChild(leafletCss);
            
            // Load Leaflet JS
            const leafletScript = document.createElement('script');
            leafletScript.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
            leafletScript.async = true;
            leafletScript.onload = () => resolve();
            leafletScript.onerror = () => reject(new Error('Failed to load Leaflet'));
            document.body.appendChild(leafletScript);
          });
        }
        
        // Load Chart.js if not already loaded
        if (!window.Chart) {
          await new Promise<void>((resolve, reject) => {
            const chartScript = document.createElement('script');
            chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js';
            chartScript.async = true;
            chartScript.onload = () => resolve();
            chartScript.onerror = () => reject(new Error('Failed to load Chart.js'));
            document.body.appendChild(chartScript);
          });
          
          // Load Chart.js annotations plugin
          await new Promise<void>((resolve, reject) => {
            const annotationsScript = document.createElement('script');
            annotationsScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.0.1/dist/chartjs-plugin-annotation.min.js';
            annotationsScript.async = true;
            annotationsScript.onload = () => resolve();
            annotationsScript.onerror = () => reject(new Error('Failed to load Chart.js annotations plugin'));
            document.body.appendChild(annotationsScript);
          });
        }
        
        // Load ApexCharts for advanced visualizations
        if (!window.ApexCharts) {
          await new Promise<void>((resolve, reject) => {
            const apexChartsScript = document.createElement('script');
            apexChartsScript.src = 'https://cdn.jsdelivr.net/npm/apexcharts@3.41.0/dist/apexcharts.min.js';
            apexChartsScript.async = true;
            apexChartsScript.onload = () => resolve();
            apexChartsScript.onerror = () => reject(new Error('Failed to load ApexCharts'));
            document.body.appendChild(apexChartsScript);
          });
        }
        
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error loading external scripts:', error);
      }
    };
    
    loadExternalScripts();
  }, []);
  
  // Add console log to check if Chart.js is loaded
  useEffect(() => {
    console.log("Is data loaded:", isDataLoaded);
    if (isDataLoaded) {
      console.log("Chart.js loaded:", window.Chart ? "YES" : "NO");
    }
  }, [isDataLoaded]);
  
  // Handle period change for data filtering
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
  };
  
  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Dashboard Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Logistics Command Center</h1>
          <p className="text-muted-foreground">Comprehensive operational analytics and real-time monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <SystemStatusPanel />
        </div>
      </div>
      
      {/* Advanced KPI Grid - Comprehensive metrics at a glance */}
      <AdvancedKpiGrid period={selectedPeriod} />
      
      {/* Tabbed Main Dashboard Interface */}
      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="fleet">Fleet Mgmt</TabsTrigger>
          <TabsTrigger value="delivery">Deliveries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="sustainability" className="hidden md:block">Sustainability</TabsTrigger>
        </TabsList>
        
        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          {/* Network Map and Shipment Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <LogisticsNetworkMap isDataLoaded={isDataLoaded} period={selectedPeriod} />
            </div>
            <ShipmentStatusMatrix period={selectedPeriod} />
          </div>
          
          {/* Operational Efficiency */}
          <OperationalEfficiency period={selectedPeriod} />
        </TabsContent>
        
        {/* Fleet Management Tab */}
        <TabsContent value="fleet" className="space-y-4">
          <FleetPerformancePanel period={selectedPeriod} isDataLoaded={isDataLoaded} />
        </TabsContent>
        
        {/* Delivery Performance Tab */}
        <TabsContent value="delivery" className="space-y-4">
          <DeliveryPerformanceMatrix period={selectedPeriod} isDataLoaded={isDataLoaded} />
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <CostAnalyticsDashboard period={selectedPeriod} isDataLoaded={isDataLoaded} />
          <PredictiveAnalytics period={selectedPeriod} isDataLoaded={isDataLoaded} />
        </TabsContent>
        
        {/* Sustainability Tab */}
        <TabsContent value="sustainability" className="space-y-4">
          <SustainabilityMetrics period={selectedPeriod} isDataLoaded={isDataLoaded} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
