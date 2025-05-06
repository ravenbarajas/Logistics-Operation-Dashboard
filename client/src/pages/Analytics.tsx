import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
  Label
} from "recharts";
import { 
  Calendar, 
  Download, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Share2, 
  RefreshCw,
  AlertTriangle,
  Clipboard,
  TrendingUp,
  Clock,
  Truck,
  Network,
  MapPin,
  Car
} from "lucide-react";
import { 
  fuelConsumptionData, 
  deliveryPerformanceData, 
  costAnalysisData,
  costPerMileData,
  maintenanceCostByVehicleType,
  sustainabilityData,
  carbonOffsetProjects,
  emissionsByVehicleData,
  networkAnalyticsData,
  logisticsPerformanceData
} from "@/data/mock-data";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnhancedDataTable } from "@/components/ui/enhanced-data-table";
import { Badge } from "@/components/ui/badge";
import { 
  fuelConsumptionColumns, 
  fuelEfficiencyColumns, 
  fuelSupplierColumns,
  fuelEfficiencyData,
  fuelSupplierData 
} from "@/components/analytics/FuelAnalyticsTable";

import { 
  costAnalysisColumns, 
  costPerMileColumns, 
  maintenanceCostColumns 
} from "@/components/analytics/CostAnalysisTable";

import { 
  sustainabilityColumns, 
  carbonOffsetColumns, 
  emissionsColumns 
} from "@/components/analytics/SustainabilityTable";

import NetworkAnalytics from "@/components/analytics/NetworkAnalytics";
import LogisticsPerformanceMatrix from "@/components/analytics/LogisticsPerformanceMatrix";
import html2pdf from 'html2pdf.js';
import { useLocation, Link } from "wouter";

export default function Analytics() {
  // Sample data for various charts
  const monthlyDeliveries = [
    { name: "Jan", total: 452 },
    { name: "Feb", total: 478 },
    { name: "Mar", total: 512 },
    { name: "Apr", total: 495 },
    { name: "May", total: 540 },
    { name: "Jun", total: 580 },
    { name: "Jul", total: 605 },
    { name: "Aug", total: 617 },
    { name: "Sep", total: 589 },
    { name: "Oct", total: 570 },
    { name: "Nov", total: 610 },
    { name: "Dec", total: 652 },
  ];
  
  const routeEfficiencyData = [
    { route: "SF to LA", plannedTime: 8.2, actualTime: 8.5, efficiency: 96 },
    { route: "Portland to Seattle", plannedTime: 3.1, actualTime: 3.0, efficiency: 103 },
    { route: "LA to Las Vegas", plannedTime: 4.5, actualTime: 4.2, efficiency: 107 },
    { route: "Seattle to Boise", plannedTime: 7.3, actualTime: 7.9, efficiency: 92 },
    { route: "SF to Portland", plannedTime: 9.5, actualTime: 10.2, efficiency: 93 },
    { route: "LA to Phoenix", plannedTime: 5.8, actualTime: 5.7, efficiency: 102 },
  ];
  
  const transportModeData = [
    { name: "Truck", value: 65 },
    { name: "Van", value: 20 },
    { name: "Rail", value: 10 },
    { name: "Air", value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Calculate the data for the tables
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
  
  const calculatedCostData = costAnalysisData.map(item => ({
    ...item,
    total: item.fuel + item.maintenance + item.labor + item.insurance + item.other
  }));
  
  const calculatedEmissionsData = emissionsByVehicleData.map(item => ({
    ...item,
    emissionsPerMile: item.emissions * item.distance / 1000
  }));

  const [activeTab, setActiveTab] = useState({
    fuel: "consumption",
    cost: "costBreakdown",
    sustainability: "metrics"
  });
  
  const [location] = useLocation();
  const [mainTabValue, setMainTabValue] = useState('risk');

  useEffect(() => {
    // Initialize tabs based on URL path
    const path = location;
    if (path.includes("/analytics/performance")) {
      setMainTabValue("performance");
    } else if (path.includes("/analytics/route")) {
      setMainTabValue("route");
    } else if (path.includes("/analytics/financial")) {
      setMainTabValue("financial");
    } else if (path === "/analytics") {
      // Redirect base path to risk
      window.history.replaceState({}, "", "/analytics/risk");
      setMainTabValue("risk");
    } else if (path.includes("/analytics/risk")) {
      setMainTabValue("risk");
    }
    
    // Initialize tabs based on URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash === 'consumption' || hash === 'efficiency' || hash === 'suppliers') {
      setActiveTab({...activeTab, fuel: hash});
    } else if (hash === 'costBreakdown' || hash === 'costPerMile' || hash === 'maintenance') {
      setActiveTab({...activeTab, cost: hash});
    } else if (hash === 'metrics' || hash === 'carbOffset' || hash === 'emissions') {
      setActiveTab({...activeTab, sustainability: hash});
    }
    
    // Add hash change listener
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash === 'consumption' || newHash === 'efficiency' || newHash === 'suppliers') {
        setActiveTab({...activeTab, fuel: newHash});
      } else if (newHash === 'costBreakdown' || newHash === 'costPerMile' || newHash === 'maintenance') {
        setActiveTab({...activeTab, cost: newHash});
      } else if (newHash === 'metrics' || newHash === 'carbOffset' || newHash === 'emissions') {
        setActiveTab({...activeTab, sustainability: newHash});
      }
    };
    
    // Listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      // When browser back/forward is used, update our tab state based on the new URL
      const path = location;
      if (path.includes("/analytics/performance")) {
        setMainTabValue("performance");
      } else if (path.includes("/analytics/route")) {
        setMainTabValue("route");
      } else if (path.includes("/analytics/financial")) {
        setMainTabValue("financial");
      } else if (path.includes("/analytics/risk") || path === "/analytics") {
        setMainTabValue("risk");
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location]);
  
  const handleTabChange = (section: 'fuel' | 'cost' | 'sustainability', tab: string) => {
    setActiveTab({...activeTab, [section]: tab});
    window.location.hash = tab;
  };

  // Handle main tab changes
  const handleMainTabChange = (value: string) => {
    // Set the tab state
    setMainTabValue(value);
    
    // Update URL without full page reload using path-based navigation
    if (value === "risk") {
      window.history.pushState({}, "", "/analytics/risk");
    } else if (value === "performance") {
      window.history.pushState({}, "", "/analytics/performance");
    } else if (value === "route") {
      window.history.pushState({}, "", "/analytics/route");
    } else if (value === "financial") {
      window.history.pushState({}, "", "/analytics/financial");
    }
  };

  const analyticsSectionRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExportReport = async () => {
    if (!analyticsSectionRef.current) return;
    
    try {
      setIsExporting(true);
      
      // Configure PDF options with A4 as default
      const options = {
        margin: 10,
        filename: `logistics_analytics_report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          allowTaint: true,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as 'portrait' | 'landscape'
        }
      };
      
      // Wait for charts to render completely
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate the PDF
      await html2pdf().from(analyticsSectionRef.current).set(options).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Get the current page name for the heading
  const getCurrentPageName = () => {
    switch (mainTabValue) {
      case "risk": return "Risk Analytics";
      case "performance": return "Performance Insights";
      case "route": return "Route Analytics";
      case "financial": return "Financial Analytics";
      default: return "Analytics";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" ref={analyticsSectionRef}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <span>Current section: </span>
            <Badge className="ml-2">
              {getCurrentPageName()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button 
            onClick={handleExportReport} 
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </>
            )}
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Different summary cards based on the active tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mainTabValue === "risk" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">72/100</div>
                <p className="text-xs text-muted-foreground">+4 pts from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Delayed Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">6.2%</div>
                <p className="text-xs text-muted-foreground">-0.8% from target</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">12</div>
                <p className="text-xs text-muted-foreground">+3 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Mitigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">84%</div>
                <p className="text-xs text-muted-foreground">+5% from last quarter</p>
              </CardContent>
            </Card>
          </>
        )}
        
        {mainTabValue === "performance" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">94.8%</div>
                <p className="text-xs text-muted-foreground">+2.4% from last quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5 hrs</div>
                <p className="text-xs text-muted-foreground">-5% from previous month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Perfect Order Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">92.7%</div>
                <p className="text-xs text-muted-foreground">+1.2% from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Driver Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">87/100</div>
                <p className="text-xs text-muted-foreground">+3 pts above average</p>
              </CardContent>
            </Card>
          </>
        )}
        
        {mainTabValue === "route" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Route Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">86.3%</div>
                <p className="text-xs text-muted-foreground">+3.1% from baseline</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Distance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">427 mi</div>
                <p className="text-xs text-muted-foreground">-16 mi from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Delivery Density</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">5.8 stops</div>
                <p className="text-xs text-muted-foreground">Per route, avg.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Traffic Delays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">14.2%</div>
                <p className="text-xs text-muted-foreground">Of total delivery time</p>
              </CardContent>
            </Card>
          </>
        )}
        
        {mainTabValue === "financial" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cost Per Mile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.87</div>
                <p className="text-xs text-muted-foreground">-$0.12 from last quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">8.2 mpg</div>
                <p className="text-xs text-muted-foreground">+0.4 mpg from target</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue Per Truck</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">$5,842</div>
                <p className="text-xs text-muted-foreground">+8.3% year-over-year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">$0.22/mi</div>
                <p className="text-xs text-muted-foreground">+$0.03 from budget</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Main Tab Navigation */}
      <Tabs value={mainTabValue} onValueChange={handleMainTabChange} className="mb-8 space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="risk" className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Risk Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance Insights
          </TabsTrigger>
          <TabsTrigger value="route" className="flex items-center">
            <Network className="h-4 w-4 mr-2" />
            Route Analytics
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Financial Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Risk Analytics Tab */}
        <TabsContent value="risk" className="space-y-4">
          {/* Risk Assessment and Improvement Opportunities Section */}
          <Card className="mb-6 p-6">
            <div className="mb-6">
                <CardTitle className="flex items-center">
                Risk Assessment Analytics
                </CardTitle>
                <CardDescription className="mb-6">Spot risks before they impact shipments</CardDescription>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Assessment */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                          Risk Assessment Matrix
                        </CardTitle>
                        <CardDescription>
                          Logistics operational risks with impact and mitigation readiness
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => {
                            const container = document.getElementById('risks-container');
                            if (container) {
                              container.scrollBy({ top: -200, behavior: 'smooth' });
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => {
                            const container = document.getElementById('risks-container');
                            if (container) {
                              container.scrollBy({ top: 200, behavior: 'smooth' });
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div id="risks-container" className="max-h-64 overflow-y-hidden hide-scrollbar">
                      <table className="w-full min-w-[500px]">
                        <thead className="sticky top-0 bg-background z-10">
                          <tr className="border-b dark:border-gray-700">
                            <th className="py-2 px-4 text-left text-sm font-medium">Risk Category</th>
                            <th className="py-2 px-4 text-left text-sm font-medium">Probability</th>
                            <th className="py-2 px-4 text-left text-sm font-medium">Impact</th>
                            <th className="py-2 px-4 text-left text-sm font-medium">Readiness</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logisticsPerformanceData.riskAssessment.map((risk, index) => (
                            <tr key={index} className="border-b dark:border-gray-700">
                              <td className="py-2 px-4 text-sm">{risk.category}</td>
                              <td className="py-2 px-4">
                                <Badge className={`${risk.probability > 7 ? 'bg-red-500' : risk.probability > 4 ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                                  {risk.probability}/10
                                </Badge>
                              </td>
                              <td className="py-2 px-4">
                                <Badge className={`${risk.impact > 7 ? 'bg-red-500' : risk.impact > 4 ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                                  {risk.impact}/10
                                </Badge>
                              </td>
                              <td className="py-2 px-4">
                                <Badge className={`${risk.readiness < 5 ? 'bg-red-500' : risk.readiness < 8 ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                                  {risk.readiness}/10
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Improvement Opportunities */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center">
                          <Clipboard className="h-5 w-5 mr-2 text-primary" />
                          Improvement Opportunities
                        </CardTitle>
                        <CardDescription>
                          High-impact areas for performance enhancement
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => {
                            const container = document.getElementById('improvements-container');
                            if (container) {
                              container.scrollBy({ top: -200, behavior: 'smooth' });
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => {
                            const container = document.getElementById('improvements-container');
                            if (container) {
                              container.scrollBy({ top: 200, behavior: 'smooth' });
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div id="improvements-container" className="max-h-64 overflow-y-hidden hide-scrollbar">
                      <div className="space-y-4">
                        {logisticsPerformanceData.improvementOpportunities.map((opportunity, index) => (
                          <div key={index} className="border rounded-md p-3 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{opportunity.area}</span>
                              <Badge className={`${opportunity.priority > 7 ? 'bg-red-500' : opportunity.priority > 4 ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                                Priority: {opportunity.priority}/10
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Potential Impact</div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
                                  <div 
                                    className="h-full bg-blue-500" 
                                    style={{ width: `${opportunity.potential * 10}%` }}
                                  />
                                </div>
                                <div className="text-right text-xs mt-1">{opportunity.potential}/10</div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Implementation Effort</div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
                                  <div 
                                    className="h-full bg-amber-500" 
                                    style={{ width: `${opportunity.effort * 10}%` }}
                                  />
                                </div>
                                <div className="text-right text-xs mt-1">{opportunity.effort}/10</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* New Risk Prediction & Alert Management Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Risk Prediction Engine Component */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        Risk Prediction Engine
                      </CardTitle>
                      <CardDescription>
                        AI-powered risk forecasting for upcoming shipments
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      Recalculate
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Upcoming High-Risk Shipments</div>
                      <Badge className="bg-amber-500 text-white">8 shipments</Badge>
                    </div>
                    
                    <div className="border rounded-lg p-3 dark:border-gray-700 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Chicago to Denver</div>
                        <div className="text-sm text-muted-foreground">SH-38291 • Departs in 2 days</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className="bg-red-500 text-white mb-1">Risk: 92%</Badge>
                        <span className="text-xs">Weather conditions</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3 dark:border-gray-700 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Atlanta to Miami</div>
                        <div className="text-sm text-muted-foreground">SH-29384 • Departs tomorrow</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className="bg-amber-500 text-white mb-1">Risk: 78%</Badge>
                        <span className="text-xs">Traffic congestion</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3 dark:border-gray-700 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Seattle to Portland</div>
                        <div className="text-sm text-muted-foreground">SH-58204 • Departs in 3 days</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className="bg-amber-500 text-white mb-1">Risk: 65%</Badge>
                        <span className="text-xs">Driver availability</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Last updated: Today, 10:45 AM</span>
                      <Button variant="ghost" size="sm" className="text-xs">
                        View all 8 shipments
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Alert Management System Component */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        Alert Management System
                      </CardTitle>
                      <CardDescription>
                        Real-time risk notification and resolution tracking
                      </CardDescription>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue placeholder="Alert Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Alerts</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="font-medium">Active Alerts</span>
                        <div className="text-sm text-muted-foreground">12 unresolved issues</div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-red-500 text-white">Critical: 3</Badge>
                        <Badge className="bg-amber-500 text-white">High: 5</Badge>
                        <Badge className="bg-blue-500 text-white">Medium: 4</Badge>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-3 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">System-wide Weather Alert</div>
                          <div className="text-sm text-muted-foreground">Severe weather conditions affecting Midwest region</div>
                        </div>
                        <Button variant="destructive" size="sm" className="ml-2">
                          Escalate
                        </Button>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <span>Created: 2 hours ago</span>
                        <span className="mx-2">•</span>
                        <span>Affects: 23 shipments</span>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-3 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Critical Driver Shortage</div>
                          <div className="text-sm text-muted-foreground">Northeast hub facing 35% driver shortage</div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-2">
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <span>Created: 3 hours ago</span>
                        <span className="mx-2">•</span>
                        <span>Affects: 17 shipments</span>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-amber-500 pl-3 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Fuel Price Spike Alert</div>
                          <div className="text-sm text-muted-foreground">12% increase in diesel prices in Western region</div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-2">
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <span>Created: 5 hours ago</span>
                        <span className="mx-2">•</span>
                        <span>Affects: Budget forecasts</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-3">
                      <Button variant="ghost" size="sm">
                        Load more alerts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Risk Analytics Dashboard */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                  Risk Analytics Dashboard
                </CardTitle>
                <CardDescription>
                  Comprehensive risk analytics by category and mitigation effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Weather Risks</div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5"/></svg>
                    </div>
                    <div className="text-2xl font-bold text-amber-500">32%</div>
                    <div className="text-xs text-muted-foreground">Of total risk factors</div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                      <div className="h-full bg-amber-500" style={{ width: "32%" }} />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Technical Failures</div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                    </div>
                    <div className="text-2xl font-bold text-red-500">28%</div>
                    <div className="text-xs text-muted-foreground">Of total risk factors</div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                      <div className="h-full bg-red-500" style={{ width: "28%" }} />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Workforce Issues</div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div className="text-2xl font-bold text-blue-500">24%</div>
                    <div className="text-xs text-muted-foreground">Of total risk factors</div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                      <div className="h-full bg-blue-500" style={{ width: "24%" }} />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Network Congestion</div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M10 8V5c0-1.1.9-2 2-2h0a2 2 0 0 1 2 2v3"/><path d="M12 16v-4"/></svg>
                    </div>
                    <div className="text-2xl font-bold text-purple-500">16%</div>
                    <div className="text-xs text-muted-foreground">Of total risk factors</div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                      <div className="h-full bg-purple-500" style={{ width: "16%" }} />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 dark:border-gray-700 lg:col-span-2">
                    <div className="font-medium mb-2">Risk Mitigation Effectiveness</div>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { category: "Weather", before: 92, after: 68 },
                            { category: "Technical", before: 85, after: 48 },
                            { category: "Workforce", before: 76, after: 52 },
                            { category: "Network", before: 64, after: 38 },
                            { category: "Regulatory", before: 58, after: 32 }
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="category" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <YAxis 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value) => [`${value}% Risk Level`, '']}
                          />
                          <Legend />
                          <Bar dataKey="before" name="Before Mitigation" fill="#f97316" />
                          <Bar dataKey="after" name="After Mitigation" fill="#14b8a6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="font-medium mb-2">Risk Resolution Time</div>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "< 24 hours", value: 42 },
                              { name: "1-3 days", value: 28 },
                              { name: "3-7 days", value: 18 },
                              { name: "> 7 days", value: 12 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#6366f1" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value) => [`${value}%`, ``]}
                          />
                          <Legend formatter={(value) => `${value}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Card>
        </TabsContent>
        
        {/* Performance Insights Tab */}
        <TabsContent value="performance" className="space-y-4">
          {/* Performance Insights Section */}
          <Card className="mb-6 p-6">
            <div className="mb-6">
                <CardTitle className="flex items-center">
                Performance Insights
                </CardTitle>
                <CardDescription className="mb-6">Monitor and improve delivery performance</CardDescription>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* KPI Trends - Circular Progress Indicators */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                      KPI Performance Indicators
                    </CardTitle>
                    <CardDescription>
                      Current performance against targets across key indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {logisticsPerformanceData.kpiTrend.slice(0, 6).map((kpi, index) => {
                        const percentage = Math.round((kpi.value / kpi.target) * 100);
                        const color = percentage >= 100 ? 'text-green-500' : 
                                      percentage >= 80 ? 'text-emerald-500' : 
                                      percentage >= 60 ? 'text-amber-500' : 'text-red-500';
                        
                        return (
                          <div key={index} className="flex flex-col items-center">
                            <div className="relative w-20 h-20">
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle 
                                  className="text-gray-200 stroke-current" 
                                  strokeWidth="10" 
                                  cx="50" 
                                  cy="50" 
                                  r="40" 
                                  fill="transparent"
                                />
                                <circle 
                                  className={`${color} stroke-current`} 
                                  strokeWidth="10" 
                                  strokeLinecap="round" 
                                  cx="50" 
                                  cy="50" 
                                  r="40" 
                                  fill="transparent"
                                  strokeDasharray={`${Math.min(percentage, 100) * 2.51}, 251`}
                                  transform="rotate(-90 50 50)"
                                />
                                <text 
                                  x="50%" 
                                  y="50%" 
                                  dy=".3em" 
                                  textAnchor="middle" 
                                  className={`${color} fill-current text-lg font-bold`}
                                >
                                  {percentage}%
                                </text>
                              </svg>
                            </div>
                            <div className="mt-2 text-center">
                              <div className="text-sm font-medium truncate max-w-[100px] mx-auto">
                                {kpi.category}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {kpi.value}/{kpi.target}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Tracking - Line Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      Daily Performance Tracking
                    </CardTitle>
                    <CardDescription>
                      Consolidated performance across domains for the past 7 days
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={logisticsPerformanceData.dailyPerformance}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                            dataKey="date" 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <YAxis 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                          domain={[60, 100]}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="operations" name="Operations" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="delivery" name="Delivery" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="warehouse" name="Warehouse" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="customer" name="Customer" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* New Driver Performance & SLA Achievement Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Driver Performance Rankings */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M16 17a5 5 0 0 1-10 0"/><path d="M12 17V3"/><path d="m6 7 6-4 6.001 4"/></svg>
                        Driver Performance Rankings
                      </CardTitle>
                      <CardDescription>
                        Top performing drivers based on multiple metrics
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="month">
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="quarter">Quarter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div id="drivers-container" className="max-h-72 overflow-y-auto hide-scrollbar">
                      <table className="w-full min-w-[500px]">
                        <thead className="sticky top-0 bg-background z-10">
                          <tr className="border-b dark:border-gray-700">
                            <th className="py-2 px-4 text-left text-sm font-medium">Driver</th>
                            <th className="py-2 px-4 text-left text-sm font-medium">On-Time %</th>
                            <th className="py-2 px-4 text-left text-sm font-medium">Customer Rating</th>
                            <th className="py-2 px-4 text-left text-sm font-medium">Efficiency Score</th>
                            <th className="py-2 px-4 text-left text-sm font-medium">Overall</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: 1, name: "James Wilson", onTime: 98.2, rating: 4.9, efficiency: 92, overall: 95 },
                            { id: 2, name: "Sarah Johnson", onTime: 97.5, rating: 4.8, efficiency: 94, overall: 94 },
                            { id: 3, name: "Michael Brown", onTime: 96.8, rating: 4.9, efficiency: 89, overall: 93 },
                            { id: 4, name: "Emma Davis", onTime: 96.2, rating: 4.7, efficiency: 91, overall: 92 },
                            { id: 5, name: "Robert Miller", onTime: 95.9, rating: 4.8, efficiency: 88, overall: 91 },
                            { id: 6, name: "Jennifer Garcia", onTime: 95.5, rating: 4.6, efficiency: 90, overall: 90 },
                            { id: 7, name: "David Martinez", onTime: 94.8, rating: 4.7, efficiency: 87, overall: 89 },
                          ].map((driver, index) => (
                            <tr key={index} className="border-b dark:border-gray-700">
                              <td className="py-2 px-4 text-sm">
                                <div className="flex items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                    index === 0 ? 'bg-yellow-500' : 
                                    index === 1 ? 'bg-slate-400' : 
                                    index === 2 ? 'bg-amber-700' : 'bg-slate-200 dark:bg-slate-700'
                                  } text-white font-medium text-xs`}>
                                    {index + 1}
                                  </div>
                                  {driver.name}
                                </div>
                              </td>
                              <td className="py-2 px-4">
                                <Badge className={`${driver.onTime > 97 ? 'bg-green-500' : driver.onTime > 95 ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
                                  {driver.onTime}%
                                </Badge>
                              </td>
                              <td className="py-2 px-4">
                                <div className="flex items-center">
                                  <span className="mr-1">{driver.rating}</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                </div>
                              </td>
                              <td className="py-2 px-4">
                                <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${driver.efficiency}%` }}></div>
                                </div>
                              </td>
                              <td className="py-2 px-4 font-medium">
                                {driver.overall}/100
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* SLA Achievement Rate */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    SLA Achievement Rate
                  </CardTitle>
                  <CardDescription>
                    Service level agreement performance across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { category: "Standard", achieved: 96.8, target: 95 },
                          { category: "Express", achieved: 93.5, target: 98 },
                          { category: "Same-Day", achieved: 87.2, target: 90 },
                          { category: "Premium", achieved: 98.1, target: 99 },
                          { category: "Int'l", achieved: 92.4, target: 92 }
                        ]}
                        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="category" 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <YAxis 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                          domain={[80, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }}
                          formatter={(value) => [`${value}%`, '']}
                        />
                        <Legend />
                        <Bar 
                          dataKey="achieved" 
                          name="Achieved" 
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]} 
                        />
                        <Bar 
                          dataKey="target" 
                          name="Target" 
                          fill="#d1d5db"
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* New Performance Benchmarking */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M21 6H3"/><path d="M10 12H3"/><path d="M10 18H3"/><path d="m16 6 2 8.5L20 6"/><path d="m14 12 2 7 2-7"/></svg>
                  Industry Performance Benchmarking
                </CardTitle>
                <CardDescription>
                  How our performance compares to industry standards and competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">On-Time Delivery</div>
                        <Badge className="bg-green-500 text-white">+3.2%</Badge>
                      </div>
                      <div className="text-3xl font-bold mb-2">94.8%</div>
                      <div className="text-sm text-muted-foreground">Industry avg: 91.6%</div>
                      <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <span className="font-medium mr-1">Rank:</span>
                        <span className="text-green-500 font-bold">Top 15%</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Delivery Time</div>
                        <Badge className="bg-emerald-500 text-white">-10.5%</Badge>
                      </div>
                      <div className="text-3xl font-bold mb-2">18.5 hrs</div>
                      <div className="text-sm text-muted-foreground">Industry avg: 20.7 hrs</div>
                      <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <span className="font-medium mr-1">Rank:</span>
                        <span className="text-green-500 font-bold">Top 22%</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Perfect Order Rate</div>
                        <Badge className="bg-amber-500 text-white">-0.5%</Badge>
                      </div>
                      <div className="text-3xl font-bold mb-2">92.7%</div>
                      <div className="text-sm text-muted-foreground">Industry avg: 93.2%</div>
                      <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <span className="font-medium mr-1">Rank:</span>
                        <span className="text-amber-500 font-bold">Top 45%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="font-medium mb-4">Year-Over-Year Performance Trends</div>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { quarter: 'Q1 2022', company: 87, industry: 86, competitor: 84 },
                              { quarter: 'Q2 2022', company: 89, industry: 87, competitor: 85 },
                              { quarter: 'Q3 2022', company: 86, industry: 88, competitor: 86 },
                              { quarter: 'Q4 2022', company: 90, industry: 89, competitor: 87 },
                              { quarter: 'Q1 2023', company: 92, industry: 89, competitor: 88 },
                              { quarter: 'Q2 2023', company: 94, industry: 90, competitor: 89 },
                              { quarter: 'Q3 2023', company: 93, industry: 91, competitor: 90 },
                              { quarter: 'Q4 2023', company: 95, industry: 91, competitor: 91 },
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis 
                              dataKey="quarter" 
                              className="text-xs"
                              tick={{fill: 'hsl(var(--foreground))'}}
                            />
                            <YAxis 
                              className="text-xs" 
                              tick={{fill: 'hsl(var(--foreground))'}}
                              domain={[80, 100]}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="company" name="Our Company" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="industry" name="Industry Avg" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="competitor" name="Top Competitor" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="font-medium mb-2">Performance Comparison by Region</div>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={[
                              { region: 'Northeast', company: 94, competitor: 91, industry: 89 },
                              { region: 'Southeast', company: 92, competitor: 93, industry: 90 },
                              { region: 'Midwest', company: 96, competitor: 90, industry: 88 },
                              { region: 'Southwest', company: 91, competitor: 89, industry: 87 },
                              { region: 'West', company: 93, competitor: 92, industry: 90 },
                            ]}
                            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis 
                              type="number"
                              domain={[80, 100]}
                              className="text-xs" 
                              tick={{fill: 'hsl(var(--foreground))'}}
                            />
                            <YAxis 
                              dataKey="region" 
                              type="category" 
                              className="text-xs" 
                              tick={{fill: 'hsl(var(--foreground))'}}
                              width={70}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="company" name="Our Performance" fill="#3b82f6" />
                            <Bar dataKey="competitor" name="Top Competitor" fill="#f59e0b" />
                            <Bar dataKey="industry" name="Industry Avg" fill="#9ca3af" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Monthly Deliveries</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="2023">
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2021">2021</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Number of deliveries completed each month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyDeliveries}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="name" 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <YAxis 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                        <Bar 
                          dataKey="total" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Delivery Performance</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="quarter">
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue placeholder="Time Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>On-time vs late delivery performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={deliveryPerformanceData}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <YAxis 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="onTime" 
                          stackId="1" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.6}
                          name="On Time"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="late" 
                          stackId="1" 
                          stroke="hsl(var(--destructive))" 
                          fill="hsl(var(--destructive))" 
                          fillOpacity={0.6}
                          name="Late"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Card>
        </TabsContent>
        
        {/* Route Analytics Tab */}
        <TabsContent value="route" className="space-y-4">
          {/* Route and Bottleneck Analysis Section */}
          <Card className="mb-6 p-6">
            <div className="mb-0">
                <CardTitle className="flex items-center">
                Route & Network Analytics
                </CardTitle>
                <CardDescription className="mb-6">Optimize routes for speed and cost</CardDescription>
              {/* Network Bottlenecks - Full Width Row */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                        Critical Network Bottlenecks
                      </CardTitle>
                      <CardDescription>
                        Key congestion points currently impacting logistics flow
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => {
                          const container = document.getElementById('bottlenecks-container');
                          if (container) {
                            container.scrollBy({ left: -300, behavior: 'smooth' });
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => {
                          const container = document.getElementById('bottlenecks-container');
                          if (container) {
                            container.scrollBy({ left: 300, behavior: 'smooth' });
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Horizontal scrolling cards with no scrollbar + navigation buttons */}
                  <div 
                    id="bottlenecks-container"
                    className="flex overflow-x-hidden pb-4 hide-scrollbar" 
                  >
                    <div className="flex gap-4 py-1 px-0.5 min-w-full">
                      {networkAnalyticsData.bottlenecks.map((bottleneck, index) => (
                        <div key={index} className="min-w-[220px] max-w-[250px] flex-shrink-0 border rounded-lg p-4 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="font-medium truncate max-w-[150px]">{bottleneck.location}</div>
                            <Badge className={`${bottleneck.severity > 7 ? 'bg-red-500' : bottleneck.severity > 5 ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                              {bottleneck.severity.toFixed(1)}/10
                            </Badge>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1 flex justify-between">
                                <span>Impacted Shipments</span>
                                <span className="font-medium">{bottleneck.impactedShipments}</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
                                <div 
                                  className="h-full bg-red-500" 
                                  style={{ width: `${(bottleneck.impactedShipments / 2000) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1 flex justify-between">
                                <span>Avg Delay</span>
                                <span className="font-medium">{bottleneck.avgDelay} hrs</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
                                <div 
                                  className="h-full bg-amber-500" 
                                  style={{ width: `${(bottleneck.avgDelay / 15) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                    {/* Average Network Delay - Key Metrics */}
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="font-medium">Average Network Delay</span>
                        </div>
                        <Badge className="bg-amber-500 text-white">+5.2%</Badge>
                      </div>
                      <div className="text-2xl font-bold mb-2">6.8 hrs</div>
                      <div className="text-xs text-muted-foreground">
                        Increased from 6.5 hrs last month • 2.3 hrs above target
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                        <div className="h-full bg-amber-500" style={{ width: "68%" }} />
                      </div>
                    </div>
                    
                    {/* Most Affected Hub - Key Metrics */}
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-red-500" />
                          <span className="font-medium">Most Affected Hub</span>
                        </div>
                        <Badge className="bg-red-500 text-white">Critical</Badge>
                      </div>
                      <div className="text-2xl font-bold mb-2">Chicago Hub</div>
                      <div className="text-xs text-muted-foreground">
                        1,240 shipments impacted • Avg delay 5.8 hrs
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                        <div className="h-full bg-red-500" style={{ width: "82%" }} />
                      </div>
                    </div>
                    
                    {/* Rerouting Efficiency - Key Metrics */}
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">Rerouting Efficiency</span>
                        </div>
                        <Badge className="bg-green-500 text-white">+12%</Badge>
                      </div>
                      <div className="text-2xl font-bold mb-2">76.4%</div>
                      <div className="text-xs text-muted-foreground">
                        425 shipments successfully rerouted • 2.1 hrs saved on average
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                        <div className="h-full bg-green-500" style={{ width: "76%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* New Two Column Layout - Replacing Previous Components */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hub Throughput Capacity - Replacing Route Performance */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-primary" />
                    Hub Throughput Capacity
                  </CardTitle>
                  <CardDescription>
                    Current utilization vs maximum capacity by hub
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                          data={networkAnalyticsData.hubPerformance.map(hub => ({
                            name: hub.hub,
                            value: hub.utilization
                          }))}
                        cx="50%"
                        cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                        fill="#8884d8"
                          paddingAngle={2}
                        dataKey="value"
                        >
                          {networkAnalyticsData.hubPerformance.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][index % 6]}
                            />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                        formatter={(value, name, props) => [`${value}% utilized`, `${name}`]}
                      />
                      <Legend 
                        formatter={(value, entry, index) => {
                          const hub = networkAnalyticsData.hubPerformance[index];
                          return `${value} (${hub.throughput.toLocaleString()} units)`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {networkAnalyticsData.hubPerformance.slice(0, 3).map((hub, index) => (
                      <div key={index} className="text-center bg-muted/30 rounded p-2">
                        <div className="text-xs font-medium mb-1">{hub.hub}</div>
                        <div className="text-sm">🔄 {hub.throughput.toLocaleString()}</div>
                        <div className="text-sm">⏱️ {hub.deliveryTime}h avg</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

                {/* Seasonal Transit Time Variations - Replacing Network Connection Strength */}
              <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Network className="h-5 w-5 mr-2 text-primary" />
                      Seasonal Transit Time Variations
                    </CardTitle>
                    <CardDescription>
                      Analysis of transit time fluctuations across seasons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { season: 'Winter', chicago: 35.2, newyork: 28.4, losangeles: 22.8, dallas: 24.2 },
                            { season: 'Spring', chicago: 29.8, newyork: 25.6, losangeles: 21.5, dallas: 22.7 },
                            { season: 'Summer', chicago: 27.4, newyork: 26.1, losangeles: 23.2, dallas: 25.8 },
                            { season: 'Fall', chicago: 31.6, newyork: 27.5, losangeles: 22.1, dallas: 23.4 }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="season" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <YAxis 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                            label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value, name) => [`${value} hours`, name === 'chicago' ? 'Chicago' : 
                                                          name === 'newyork' ? 'New York' : 
                                                          name === 'losangeles' ? 'Los Angeles' : 'Dallas']}
                          />
                          <Legend 
                            formatter={(value) => value === 'chicago' ? 'Chicago' : 
                                                  value === 'newyork' ? 'New York' : 
                                                  value === 'losangeles' ? 'Los Angeles' : 'Dallas'}
                          />
                          <Bar dataKey="chicago" fill="#3b82f6" />
                          <Bar dataKey="newyork" fill="#10b981" />
                          <Bar dataKey="losangeles" fill="#f59e0b" />
                          <Bar dataKey="dallas" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              </div>
              
              {/* Route Efficiency Analysis - New Component */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                    Route Efficiency Analysis
                  </CardTitle>
                  <CardDescription>
                    Top performing routes by efficiency score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={[
                          { route: "LA - San Diego", efficiency: 98 },
                          { route: "Portland - Seattle", efficiency: 96 },
                          { route: "Dallas - Houston", efficiency: 94 },
                          { route: "Miami - Orlando", efficiency: 93 },
                          { route: "Chicago - Milwaukee", efficiency: 92 }
                        ]}
                        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          type="number" 
                          domain={[80, 100]}
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <YAxis 
                          dataKey="route" 
                          type="category" 
                          className="text-xs" 
                          tick={{fill: 'hsl(var(--foreground))'}}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                        <Bar 
                          dataKey="efficiency" 
                          fill="#10b981"
                          radius={[0, 4, 4, 0]}
                          label={{ position: 'right', fill: 'hsl(var(--foreground))', fontSize: 12 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Card>
        </TabsContent>
        
        {/* Financial Analytics Tab */}
        <TabsContent value="financial" className="space-y-4">
          {/* Financial Analytics Section */}
          <Card className="p-6">
            <CardTitle className="flex items-center">
            Financial Analytics
            </CardTitle>
            <CardDescription className="mb-6">Track and manage shipping costs</CardDescription>
            
            {/* New Financial Performance Overview Section */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Financial Performance Overview</CardTitle>
                <CardDescription>Key financial indicators compared to previous periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Revenue per Mile</div>
                      <Badge className="bg-green-500 text-white">+4.8%</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">$3.42</div>
                    <div className="text-xs text-muted-foreground">vs $3.26 last quarter</div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-3">
                      <div className="h-full bg-green-500" style={{ width: "84%" }} />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Operating Expenses</div>
                      <Badge className="bg-amber-500 text-white">+2.3%</Badge>
                    </div>
                    <div className="text-2xl font-bold text-amber-600 mb-1">$4.85M</div>
                    <div className="text-xs text-muted-foreground">vs $4.74M last quarter</div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-3">
                      <div className="h-full bg-amber-500" style={{ width: "76%" }} />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Profit Margin</div>
                      <Badge className="bg-green-500 text-white">+1.2%</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">18.7%</div>
                    <div className="text-xs text-muted-foreground">vs 17.5% last quarter</div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-3">
                      <div className="h-full bg-green-500" style={{ width: "68%" }} />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Cost per Shipment</div>
                      <Badge className="bg-red-500 text-white">+3.1%</Badge>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-1">$245.32</div>
                    <div className="text-xs text-muted-foreground">vs $237.94 last quarter</div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-3">
                      <div className="h-full bg-red-500" style={{ width: "72%" }} />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue vs Expenses Trend */}
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="font-medium mb-3">Revenue vs Expenses Trend</div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { month: 'Jan', revenue: 3.2, expenses: 2.6 },
                            { month: 'Feb', revenue: 3.4, expenses: 2.7 },
                            { month: 'Mar', revenue: 3.6, expenses: 2.9 },
                            { month: 'Apr', revenue: 3.5, expenses: 2.8 },
                            { month: 'May', revenue: 3.7, expenses: 3.0 },
                            { month: 'Jun', revenue: 3.9, expenses: 3.2 },
                            { month: 'Jul', revenue: 4.1, expenses: 3.4 },
                            { month: 'Aug', revenue: 4.2, expenses: 3.4 },
                            { month: 'Sep', revenue: 4.0, expenses: 3.3 },
                            { month: 'Oct', revenue: 4.3, expenses: 3.5 },
                            { month: 'Nov', revenue: 4.5, expenses: 3.7 },
                            { month: 'Dec', revenue: 4.8, expenses: 3.9 },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <YAxis 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                            domain={[0, 6]}
                            tickFormatter={(value) => `$${value}M`}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value) => [`$${value}M`, ``]}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            name="Revenue" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={{ r: 3 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="expenses" 
                            name="Expenses" 
                            stroke="#f43f5e" 
                            strokeWidth={2}
                            dot={{ r: 3 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Cost Breakdown by Category */}
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="font-medium mb-3">Cost Breakdown by Category</div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Fuel', value: 42, fill: '#f97316' },
                              { name: 'Labor', value: 28, fill: '#3b82f6' },
                              { name: 'Maintenance', value: 15, fill: '#10b981' },
                              { name: 'Insurance', value: 8, fill: '#8b5cf6' },
                              { name: 'Admin', value: 5, fill: '#f43f5e' },
                              { name: 'Other', value: 2, fill: '#94a3b8' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value) => [`${value}%`, ``]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Card>

          <Card className="py-6 px-6">
            <CardTitle>
              
            </CardTitle>
            <Tabs defaultValue="fuel" className="mb-0">
              <TabsList className="mb-6 grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="fuel">Fuel Analytics</TabsTrigger>
                <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
                <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fuel" className="overflow-auto">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle>Fuel Consumption Trends</CardTitle>
                    <CardDescription>Monthly consumption patterns across fleet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={fuelConsumptionData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <YAxis 
                            className="text-xs" 
                            tick={{fill: 'hsl(var(--foreground))'}}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="diesel" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line type="monotone" dataKey="gasoline" stroke="#82ca9d" />
                          <Line type="monotone" dataKey="electric" stroke="#ffc658" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Fuel Efficiency by Vehicle Type */}
                <Card className="mt-6">
                  <CardHeader className="py-4">
                    <CardTitle>Fuel Efficiency by Vehicle Type</CardTitle>
                    <CardDescription>MPG comparison across different vehicle categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-1.1-.9-.2-1.9.1-2.5.7-.5.5-.8 1.1-.8 1.8-.1.6 0 1.3.2 1.9"/><path d="M16 17H5c-1.5 0-2.8-.8-3.5-2"/><path d="M11 17v4"/><path d="M7 17v4"/><circle cx="16" cy="17" r="2"/><circle cx="7" cy="17" r="2"/></svg>
                          <span className="font-medium text-blue-500">Heavy Duty Trucks</span>
                          </div>
                          <Badge className="bg-amber-500 text-white">6.2 MPG</Badge>
                        </div>
                        <div className="h-28 mt-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                { month: 'Jan', mpg: 6.1 },
                                { month: 'Feb', mpg: 6.0 },
                                { month: 'Mar', mpg: 6.2 },
                                { month: 'Apr', mpg: 6.3 },
                                { month: 'May', mpg: 6.4 },
                                { month: 'Jun', mpg: 6.2 },
                              ]}
                              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                            >
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  borderColor: 'hsl(var(--border))',
                                  color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`${value} MPG`, ``]}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="mpg" 
                                stroke="#3b82f6" 
                                fill="#3b82f6" 
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="text-green-500 font-medium">↑ 1.6%</span> vs previous quarter
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-1.1-.9-.2-1.9.1-2.5.7-.5.5-.8 1.1-.8 1.8-.1.6 0 1.3.2 1.9"/><path d="M16 17H5c-1.5 0-2.8-.8-3.5-2"/><path d="M11 17v4"/><path d="M7 17v4"/><circle cx="16" cy="17" r="2"/><circle cx="7" cy="17" r="2"/></svg>
                            <span className="font-medium text-green-500">Medium Duty Trucks</span>
                          </div>
                          <Badge className="bg-green-500 text-white">8.7 MPG</Badge>
                        </div>
                        <div className="h-28 mt-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                { month: 'Jan', mpg: 8.2 },
                                { month: 'Feb', mpg: 8.3 },
                                { month: 'Mar', mpg: 8.5 },
                                { month: 'Apr', mpg: 8.6 },
                                { month: 'May', mpg: 8.8 },
                                { month: 'Jun', mpg: 8.7 },
                              ]}
                              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                            >
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  borderColor: 'hsl(var(--border))',
                                  color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`${value} MPG`, ``]}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="mpg" 
                                stroke="#10b981" 
                                fill="#10b981" 
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="text-green-500 font-medium">↑ 3.2%</span> vs previous quarter
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-500"><path d="M10 16V8a2 2 0 1 1 4 0v8"/><path d="M2 12v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4"/><path d="M6 8h12"/><path d="M18 12h4"/><path d="M17.5 16H22"/><path d="M2 12h4"/><path d="M2 16h4.5"/></svg>
                            <span className="font-medium text-purple-500">Delivery Vans</span>
                          </div>
                          <Badge className="bg-green-500 text-white">12.4 MPG</Badge>
                        </div>
                        <div className="h-28 mt-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                { month: 'Jan', mpg: 11.8 },
                                { month: 'Feb', mpg: 12.0 },
                                { month: 'Mar', mpg: 12.1 },
                                { month: 'Apr', mpg: 12.3 },
                                { month: 'May', mpg: 12.5 },
                                { month: 'Jun', mpg: 12.4 },
                              ]}
                              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                            >
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  borderColor: 'hsl(var(--border))',
                                  color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`${value} MPG`, ``]}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="mpg" 
                                stroke="#8b5cf6" 
                                fill="#8b5cf6" 
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="text-green-500 font-medium">↑ 2.5%</span> vs previous quarter
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { vehicleType: 'Heavy Duty Truck', diesel: 6.2, gasoline: 0, hybrid: 7.8, electric: 0, target: 6.5 },
                            { vehicleType: 'Medium Duty Truck', diesel: 8.7, gasoline: 8.4, hybrid: 11.2, electric: 0, target: 9.0 },
                            { vehicleType: 'Light Duty Truck', diesel: 10.3, gasoline: 9.8, hybrid: 14.5, electric: 0, target: 11.0 },
                            { vehicleType: 'Delivery Van', diesel: 12.4, gasoline: 11.9, hybrid: 16.8, electric: "N/A", target: 13.0 },
                            { vehicleType: 'Small Van', diesel: 0, gasoline: 16.5, hybrid: 21.2, electric: "N/A", target: 18.0 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="vehicleType" className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                          <YAxis className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} label={{ value: 'Miles Per Gallon (MPG)', angle: -90, position: 'insideLeft', offset: -5 }} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--foreground))'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="diesel" name="Diesel" fill="#6366f1" />
                          <Bar dataKey="gasoline" name="Gasoline" fill="#f97316" />
                          <Bar dataKey="hybrid" name="Hybrid" fill="#10b981" />
                          <Line type="monotone" dataKey="target" name="Target MPG" stroke="#ef4444" strokeWidth={2} dot={{ r: 5 }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Fuel Cost Analysis */}
                <Card className="mt-6">
                  <CardHeader className="py-4">
                    <CardTitle>Fuel Cost Analysis</CardTitle>
                    <CardDescription>Cost per mile and price trends across fuel types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="font-medium mb-3">Cost Per Mile by Fuel Type</div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { month: 'Jan', diesel: 0.62, gasoline: 0.58, electricity: 0.23 },
                                { month: 'Feb', diesel: 0.63, gasoline: 0.59, electricity: 0.23 },
                                { month: 'Mar', diesel: 0.65, gasoline: 0.61, electricity: 0.24 },
                                { month: 'Apr', diesel: 0.67, gasoline: 0.64, electricity: 0.24 },
                                { month: 'May', diesel: 0.69, gasoline: 0.66, electricity: 0.25 },
                                { month: 'Jun', diesel: 0.70, gasoline: 0.67, electricity: 0.25 },
                                { month: 'Jul', diesel: 0.71, gasoline: 0.68, electricity: 0.25 },
                                { month: 'Aug', diesel: 0.69, gasoline: 0.67, electricity: 0.26 },
                                { month: 'Sep', diesel: 0.68, gasoline: 0.66, electricity: 0.26 },
                                { month: 'Oct', diesel: 0.64, gasoline: 0.63, electricity: 0.25 },
                                { month: 'Nov', diesel: 0.63, gasoline: 0.61, electricity: 0.25 },
                                { month: 'Dec', diesel: 0.62, gasoline: 0.60, electricity: 0.24 },
                              ]}
                              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="month" className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                              <YAxis 
                                className="text-xs" 
                                tick={{fill: 'hsl(var(--foreground))'}} 
                                tickFormatter={(value) => `$${value}`} 
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  borderColor: 'hsl(var(--border))',
                                  color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`$${value} per mile`, ``]}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="diesel" name="Diesel" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} />
                              <Line type="monotone" dataKey="gasoline" name="Gasoline" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} />
                              <Line type="monotone" dataKey="electricity" name="Electricity" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="font-medium mb-3">Fuel Price Trends</div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { month: 'Jan', diesel: 3.68, gasoline: 3.42 },
                                { month: 'Feb', diesel: 3.72, gasoline: 3.46 },
                                { month: 'Mar', diesel: 3.85, gasoline: 3.59 },
                                { month: 'Apr', diesel: 3.96, gasoline: 3.72 },
                                { month: 'May', diesel: 4.08, gasoline: 3.84 },
                                { month: 'Jun', diesel: 4.12, gasoline: 3.91 },
                                { month: 'Jul', diesel: 4.18, gasoline: 3.97 },
                                { month: 'Aug', diesel: 4.06, gasoline: 3.89 },
                                { month: 'Sep', diesel: 3.98, gasoline: 3.82 },
                                { month: 'Oct', diesel: 3.85, gasoline: 3.74 },
                                { month: 'Nov', diesel: 3.74, gasoline: 3.62 },
                                { month: 'Dec', diesel: 3.69, gasoline: 3.54 },
                              ]}
                              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="month" className="text-xs" tick={{fill: 'hsl(var(--foreground))'}} />
                              <YAxis 
                                className="text-xs" 
                                tick={{fill: 'hsl(var(--foreground))'}} 
                                tickFormatter={(value) => `$${value}`} 
                                domain={[3, 4.5]}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  borderColor: 'hsl(var(--border))',
                                  color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`$${value} per gallon`, ``]}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="diesel" name="Diesel" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} />
                              <Line type="monotone" dataKey="gasoline" name="Gasoline" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="text-sm font-medium mb-2">Average Fuel Cost</div>
                        <div className="text-3xl font-bold text-amber-600">$0.66<span className="text-lg">/mile</span></div>
                        <div className="text-xs text-muted-foreground mb-3">Across all vehicle types</div>
                        <div className="flex items-center justify-between text-xs">
                          <span>vs Target: $0.60/mile</span>
                          <Badge className="bg-red-500 text-white">+10%</Badge>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="text-sm font-medium mb-2">Fuel Cost Trend</div>
                        <div className="text-3xl font-bold text-red-600">+4.2%</div>
                        <div className="text-xs text-muted-foreground mb-3">Year-over-year increase</div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Industry Average: +3.8%</span>
                          <Badge className="bg-amber-500 text-white">+0.4%</Badge>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="text-sm font-medium mb-2">Most Efficient Route</div>
                        <div className="text-xl font-bold text-green-600">Portland - Seattle</div>
                        <div className="text-xs text-muted-foreground mb-3">$0.52/mile average</div>
                        <div className="flex items-center justify-between text-xs">
                          <span>vs Fleet Average</span>
                          <Badge className="bg-green-500 text-white">-21%</Badge>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="text-sm font-medium mb-2">Potential Savings</div>
                        <div className="text-3xl font-bold text-blue-600">$234K</div>
                        <div className="text-xs text-muted-foreground mb-3">Annual with 5% efficiency gain</div>
                        <div className="flex items-center justify-between text-xs">
                          <span>ROI on efficiency program</span>
                          <Badge className="bg-green-500 text-white">342%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cost" className="overflow-auto">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle>Operational Cost Breakdown</CardTitle>
                    <CardDescription>Analysis of transportation costs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Fuel', value: 42, fill: '#f97316' },
                                { name: 'Maintenance', value: 18, fill: '#10b981' },
                                { name: 'Driver Wages', value: 28, fill: '#3b82f6' },
                                { name: 'Insurance', value: 8, fill: '#8b5cf6' },
                                { name: 'Other', value: 4, fill: '#f43f5e' },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                              formatter={(value) => [`${value}%`, ``]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="font-medium mb-3">Cost Analysis by Category</div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fuel</span>
                              <span className="font-medium">$1,848,670</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                              <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>42% of total</span>
                              <span>+3.2% vs. last year</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Maintenance</span>
                              <span className="font-medium">$792,288</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>18% of total</span>
                              <span>+2.1% vs. last year</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Driver Wages</span>
                              <span className="font-medium">$1,232,446</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>28% of total</span>
                              <span>+4.5% vs. last year</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Insurance</span>
                              <span className="font-medium">$352,128</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '8%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>8% of total</span>
                              <span>+1.8% vs. last year</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cost Per Mile Analysis */}
                <Card className="mt-6">
                  <CardHeader className="py-4">
                    <CardTitle>Cost Per Mile Analysis</CardTitle>
                    <CardDescription>Detailed cost per mile breakdown by vehicle type and region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="border rounded-lg p-4 dark:border-gray-700 col-span-2">
                        <div className="font-medium mb-3">Cost Per Mile by Vehicle Type</div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { vehicle: 'Heavy Truck', cpm: 1.94, target: 1.85 },
                                { vehicle: 'Medium Truck', cpm: 1.68, target: 1.60 },
                                { vehicle: 'Light Truck', cpm: 1.43, target: 1.40 },
                                { vehicle: 'Delivery Van', cpm: 1.22, target: 1.20 },
                                { vehicle: 'Sprinter Van', cpm: 0.96, target: 0.95 },
                              ]}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                type="number" 
                                domain={[0, 2.5]} 
                                tickFormatter={(value) => `$${value}`}
                                className="text-xs" 
                                tick={{fill: 'hsl(var(--foreground))'}} 
                              />
                              <YAxis 
                                type="category" 
                                dataKey="vehicle" 
                                className="text-xs" 
                                tick={{fill: 'hsl(var(--foreground))'}} 
                                width={100}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  borderColor: 'hsl(var(--border))',
                                  color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`$${value}/mile`, ``]}
                              />
                              <Legend />
                              <Bar dataKey="cpm" name="Current CPM" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                              <ReferenceLine x={1.5} stroke="#f43f5e" strokeWidth={2}>
                                <Label value="Fleet Average: $1.50" position="insideBottomRight" fill="hsl(var(--foreground))" fontSize={12} />
                              </ReferenceLine>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="font-medium mb-2">Regional Cost Variation</div>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Northeast</span>
                              <Badge className="bg-red-500 text-white">$1.82/mi</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">21% above average</div>
                          </div>
                          
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Midwest</span>
                              <Badge className="bg-amber-500 text-white">$1.54/mi</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">3% above average</div>
                          </div>
                          
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">South</span>
                              <Badge className="bg-green-500 text-white">$1.42/mi</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">5% below average</div>
                          </div>
                          
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">West</span>
                              <Badge className="bg-amber-500 text-white">$1.65/mi</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">10% above average</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="font-medium mb-3">Cost Per Mile Year-Over-Year Trend</div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { month: 'Jan', current: 1.48, previous: 1.42 },
                              { month: 'Feb', current: 1.49, previous: 1.43 },
                              { month: 'Mar', current: 1.52, previous: 1.45 },
                              { month: 'Apr', current: 1.55, previous: 1.48 },
                              { month: 'May', current: 1.58, previous: 1.49 },
                              { month: 'Jun', current: 1.60, previous: 1.51 },
                              { month: 'Jul', current: 1.59, previous: 1.53 },
                              { month: 'Aug', current: 1.56, previous: 1.54 },
                              { month: 'Sep', current: 1.54, previous: 1.52 },
                              { month: 'Oct', current: 1.52, previous: 1.50 },
                              { month: 'Nov', current: 1.51, previous: 1.49 },
                              { month: 'Dec', current: 1.50, previous: 1.48 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis 
                              dataKey="month" 
                              className="text-xs" 
                              tick={{fill: 'hsl(var(--foreground))'}}
                            />
                            <YAxis 
                              className="text-xs" 
                              tick={{fill: 'hsl(var(--foreground))'}}
                              domain={[1.35, 1.65]}
                              tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                              formatter={(value) => [`$${value} per mile`, ``]}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="current" 
                              name="Current Year" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              dot={{ r: 3 }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="previous" 
                              name="Previous Year" 
                              stroke="#94a3b8" 
                              strokeWidth={2}
                              dot={{ r: 2 }}
                              strokeDasharray="5 5" 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Maintenance Cost Analysis */}
                <Card className="mt-6">
                  <CardHeader className="py-4">
                    <CardTitle>Maintenance Cost Analysis</CardTitle>
                    <CardDescription>Trends in maintenance expenses and vehicle downtime</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="text-sm font-medium mb-2">Average Maintenance Cost</div>
                        <div className="text-3xl font-bold text-blue-600">$0.22<span className="text-lg">/mile</span></div>
                        <div className="text-xs text-muted-foreground mb-3">$792,288 annual total</div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                          <div className="h-full bg-blue-500" style={{ width: "88%" }} />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Target: $0.20/mi</span>
                          <span className="text-red-500 font-medium">+10%</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="text-sm font-medium mb-2">Vehicle Downtime</div>
                        <div className="text-3xl font-bold text-amber-600">4.2%</div>
                        <div className="text-xs text-muted-foreground mb-3">1,532 hours total</div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                          <div className="h-full bg-amber-500" style={{ width: "84%" }} />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Target: 3.5%</span>
                          <span className="text-red-500 font-medium">+0.7%</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="text-sm font-medium mb-2">Preventive Maintenance</div>
                        <div className="text-3xl font-bold text-green-600">68%</div>
                        <div className="text-xs text-muted-foreground mb-3">of total maintenance costs</div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                          <div className="h-full bg-green-500" style={{ width: "68%" }} />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Target: 75%</span>
                          <span className="text-amber-500 font-medium">-7%</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="text-sm font-medium mb-2">Maintenance Cost Trend</div>
                        <div className="text-3xl font-bold text-red-600">+5.8%</div>
                        <div className="text-xs text-muted-foreground mb-3">Year-over-year increase</div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 mt-2">
                          <div className="h-full bg-red-500" style={{ width: "58%" }} />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Target: +3.0%</span>
                          <span className="text-red-500 font-medium">+2.8%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="font-medium mb-3">Top Maintenance Cost Drivers</div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              layout="vertical"
                              data={[
                                { category: 'Engine Repairs', cost: 185642 },
                                { category: 'Tire Replacement', cost: 142548 },
                                { category: 'Brake System', cost: 118843 },
                                { category: 'Transmission', cost: 92648 },
                                { category: 'Electrical', cost: 85772 },
                                { category: 'Suspension', cost: 72318 },
                                { category: 'HVAC System', cost: 54683 },
                                { category: 'Other', cost: 39834 }
                              ]}
                              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                type="number" 
                                className="text-xs" 
                                tick={{fill: 'hsl(var(--foreground))'}}
                                tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
                              />
                              <YAxis 
                                dataKey="category" 
                                type="category" 
                                className="text-xs" 
                                tick={{fill: 'hsl(var(--foreground))'}}
                                width={100}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  borderColor: 'hsl(var(--border))',
                                  color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`$${(value).toLocaleString()}`, ``]}
                              />
                              <Bar dataKey="cost" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="font-medium mb-3">Maintenance Cost by Vehicle Age</div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { age: '<1', cost: 0.11 },
                                { age: '1', cost: 0.13 },
                                { age: '2', cost: 0.16 },
                                { age: '3', cost: 0.19 },
                                { age: '4', cost: 0.24 },
                                { age: '5', cost: 0.29 },
                                { age: '6', cost: 0.36 },
                                { age: '7', cost: 0.42 },
                                { age: '8+', cost: 0.48 }
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="age" 
                                className="text-xs" 
                                tick={{fill: 'hsl(var(--foreground))'}}
                                label={{ value: 'Vehicle Age (years)', position: 'insideBottom', offset: -5 }}
                              />
                              <YAxis 
                                className="text-xs" 
                                tick={{fill: 'hsl(var(--foreground))'}}
                                tickFormatter={(value) => `$${value}`}
                                domain={[0, 0.5]}
                                label={{ value: 'Cost per Mile ($)', angle: -90, position: 'insideLeft' }}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  borderColor: 'hsl(var(--border))',
                                  color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`$${value} per mile`, ``]}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="cost" 
                                name="Maintenance Cost" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={{ r: 3 }} 
                              />
                              <ReferenceLine y={0.22} stroke="#f43f5e" strokeDasharray="3 3">
                                <Label value="Fleet Average: $0.22" position="right" fill="hsl(var(--foreground))" fontSize={12} />
                              </ReferenceLine>
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sustainability" className="overflow-auto">
                {/* Sustainability Analysis Section */}
                <Card className="mb-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      Sustainability Insights
                    </CardTitle>
                    <CardDescription>Track and manage environmental impact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* KPI Trends - Circular Progress Indicators */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                            KPI Performance Indicators
                          </CardTitle>
                          <CardDescription>
                            Current performance against targets across key indicators
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                              { category: "Carbon Reduction", value: 14, target: 15 },
                              { category: "Electric Fleet", value: 35, target: 40 },
                              { category: "Fuel Efficiency", value: 32, target: 30 },
                              { category: "Waste Reduction", value: 22, target: 20 },
                              { category: "Renewables", value: 18, target: 25 },
                              { category: "Green Packaging", value: 85, target: 80 }
                            ].map((kpi, index) => {
                              const percentage = Math.round((kpi.value / kpi.target) * 100);
                              const color = percentage >= 100 ? 'text-green-500' : 
                                            percentage >= 80 ? 'text-emerald-500' : 
                                            percentage >= 60 ? 'text-amber-500' : 'text-red-500';
                              
                              return (
                                <div key={index} className="flex flex-col items-center">
                                  <div className="relative w-20 h-20">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                      <circle 
                                        className="text-gray-200 stroke-current" 
                                        strokeWidth="10" 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                        fill="transparent"
                                      />
                                      <circle 
                                        className={`${color} stroke-current`} 
                                        strokeWidth="10" 
                                        strokeLinecap="round" 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                        fill="transparent"
                                        strokeDasharray={`${Math.min(percentage, 100) * 2.51}, 251`}
                                        transform="rotate(-90 50 50)"
                                      />
                                      <text 
                                        x="50%" 
                                        y="50%" 
                                        dy=".3em" 
                                        textAnchor="middle" 
                                        className={`${color} fill-current text-lg font-bold`}
                                      >
                                        {percentage}%
                                      </text>
                                    </svg>
                                  </div>
                                  <div className="mt-2 text-center">
                                    <div className="text-sm font-medium truncate max-w-[100px] mx-auto">
                                      {kpi.category}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {kpi.value}/{kpi.target}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Performance Tracking - Line Chart */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-primary" />
                            Daily Performance Tracking
                          </CardTitle>
                          <CardDescription>
                            Consolidated performance across domains for the past 7 days
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={[
                                  { date: "Mon", operations: 85, delivery: 90, warehouse: 84, customer: 88 },
                                  { date: "Tue", operations: 83, delivery: 87, warehouse: 85, customer: 87 },
                                  { date: "Wed", operations: 86, delivery: 91, warehouse: 87, customer: 89 },
                                  { date: "Thu", operations: 88, delivery: 93, warehouse: 88, customer: 90 },
                                  { date: "Fri", operations: 90, delivery: 92, warehouse: 89, customer: 91 },
                                  { date: "Sat", operations: 92, delivery: 94, warehouse: 90, customer: 93 },
                                  { date: "Sun", operations: 91, delivery: 93, warehouse: 89, customer: 92 }
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis 
                                  dataKey="date" 
                                  className="text-xs" 
                                  tick={{fill: 'hsl(var(--foreground))'}}
                                />
                                <YAxis 
                                  className="text-xs" 
                                  tick={{fill: 'hsl(var(--foreground))'}}
                                  domain={[60, 100]}
                                />
                                <Tooltip 
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    color: 'hsl(var(--foreground))'
                                  }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="operations" name="Operations" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="delivery" name="Delivery" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="warehouse" name="Warehouse" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="customer" name="Customer" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Environmental Impact Analysis & Renewable Energy Adoption */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                      {/* Environmental Impact Analysis */}
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                                Environmental Impact Analysis
                              </CardTitle>
                              <CardDescription>
                                Carbon footprint by logistics activities
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="quarter">
                                <SelectTrigger className="w-[100px] h-8">
                                  <SelectValue placeholder="Period" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="month">Month</SelectItem>
                                  <SelectItem value="quarter">Quarter</SelectItem>
                                  <SelectItem value="year">Year</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={[
                                    { activity: "Transportation", emissions: 68, target: 60, yoy: -8 },
                                    { activity: "Warehousing", emissions: 18, target: 15, yoy: -12 },
                                    { activity: "Packaging", emissions: 8, target: 5, yoy: -15 },
                                    { activity: "Administration", emissions: 6, target: 5, yoy: -10 }
                                  ]}
                                  layout="vertical"
                                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                  <XAxis type="number" className="text-xs" />
                                  <YAxis dataKey="activity" type="category" className="text-xs" />
                                  <Tooltip 
                                    contentStyle={{
                                      backgroundColor: 'hsl(var(--card))',
                                      borderColor: 'hsl(var(--border))',
                                      color: 'hsl(var(--foreground))'
                                    }}
                                    formatter={(value) => [`${value}%`, ``]}
                                  />
                                  <Legend />
                                  <Bar dataKey="emissions" name="Current Emissions %" fill="#f97316" />
                                  <Bar dataKey="target" name="Target %" fill="#10b981" />
                                  <ReferenceLine x={0} stroke="#fafafa" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="border rounded-lg p-3 dark:border-gray-700">
                                <div className="text-sm font-medium mb-1">Year-Over-Year Change</div>
                                <div className="text-2xl font-bold text-green-500">-10.2%</div>
                                <div className="text-xs text-muted-foreground">Total carbon reduction</div>
                              </div>
                              <div className="border rounded-lg p-3 dark:border-gray-700">
                                <div className="text-sm font-medium mb-1">CO₂ Offset Credits</div>
                                <div className="text-2xl font-bold text-blue-500">4,250</div>
                                <div className="text-xs text-muted-foreground">Tons purchased this year</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Renewable Energy Adoption */}
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                                Renewable Energy Adoption
                              </CardTitle>
                              <CardDescription>
                                Progress toward renewable energy targets
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="quarter">
                                <SelectTrigger className="w-[100px] h-8">
                                  <SelectValue placeholder="Period" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="month">Month</SelectItem>
                                  <SelectItem value="quarter">Quarter</SelectItem>
                                  <SelectItem value="year">Year</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={[
                                  { quarter: "Q1 2022", renewable: 18, nonRenewable: 82 },
                                  { quarter: "Q2 2022", renewable: 22, nonRenewable: 78 },
                                  { quarter: "Q3 2022", renewable: 25, nonRenewable: 75 },
                                  { quarter: "Q4 2022", renewable: 28, nonRenewable: 72 },
                                  { quarter: "Q1 2023", renewable: 32, nonRenewable: 68 },
                                  { quarter: "Q2 2023", renewable: 35, nonRenewable: 65 },
                                  { quarter: "Q3 2023", renewable: 38, nonRenewable: 62 },
                                  { quarter: "Q4 2023", renewable: 42, nonRenewable: 58 }
                                ]}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="quarter" className="text-xs" />
                                <YAxis className="text-xs" tickFormatter={(value) => `${value}%`} />
                                <Tooltip 
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    color: 'hsl(var(--foreground))'
                                  }}
                                  formatter={(value) => [`${value}%`, ``]}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="renewable" name="Renewable Energy" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="nonRenewable" name="Non-Renewable" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                                <ReferenceLine y={50} label="2025 Target" stroke="#f43f5e" strokeDasharray="3 3" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            <div className="border rounded-lg p-3 dark:border-gray-700 text-center">
                              <div className="text-xs font-medium mb-1">Solar</div>
                              <div className="text-lg font-bold text-yellow-500">24%</div>
                            </div>
                            <div className="border rounded-lg p-3 dark:border-gray-700 text-center">
                              <div className="text-xs font-medium mb-1">Wind</div>
                              <div className="text-lg font-bold text-blue-500">12%</div>
                            </div>
                            <div className="border rounded-lg p-3 dark:border-gray-700 text-center">
                              <div className="text-xs font-medium mb-1">Other Green</div>
                              <div className="text-lg font-bold text-green-500">6%</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sustainability Initiatives Dashboard */}
                    <Card className="mt-6">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
                          Sustainability Initiatives Dashboard
                        </CardTitle>
                        <CardDescription>
                          Active sustainability programs and their impact metrics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4 dark:border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium">Electric Fleet</div>
                                <Badge className="bg-green-500 text-white">+8 vehicles</Badge>
                              </div>
                              <div className="text-3xl font-bold mb-2">42 vehicles</div>
                              <div className="text-sm text-muted-foreground">28% of total fleet</div>
                              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                                <span className="font-medium mr-1">Target:</span>
                                <span className="text-green-500 font-bold">50% by 2025</span>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4 dark:border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium">Eco-Packaging</div>
                                <Badge className="bg-emerald-500 text-white">+14.2%</Badge>
                              </div>
                              <div className="text-3xl font-bold mb-2">78.5%</div>
                              <div className="text-sm text-muted-foreground">Biodegradable materials</div>
                              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                                <span className="font-medium mr-1">Plastic reduction:</span>
                                <span className="text-green-500 font-bold">62 tons</span>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4 dark:border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium">Carbon Offset</div>
                                <Badge className="bg-amber-500 text-white">68% of goal</Badge>
                              </div>
                              <div className="text-3xl font-bold mb-2">4,250 tons</div>
                              <div className="text-sm text-muted-foreground">CO₂ offset this year</div>
                              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                                <span className="font-medium mr-1">Annual target:</span>
                                <span className="text-amber-500 font-bold">6,200 tons</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="border rounded-lg p-4 dark:border-gray-700">
                              <div className="font-medium mb-4">Active Sustainability Projects</div>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-3 dark:border-gray-700">
                                  <div>
                                    <div className="font-medium">Solar Panel Installations</div>
                                    <div className="text-sm text-muted-foreground">8 warehouse facilities</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-green-500">$342K</div>
                                    <div className="text-sm text-muted-foreground">Annual savings</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between border-b pb-3 dark:border-gray-700">
                                  <div>
                                    <div className="font-medium">EV Charging Network</div>
                                    <div className="text-sm text-muted-foreground">42 charging stations</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-amber-500">72%</div>
                                    <div className="text-sm text-muted-foreground">Completion</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between border-b pb-3 dark:border-gray-700">
                                  <div>
                                    <div className="font-medium">Route Optimization AI</div>
                                    <div className="text-sm text-muted-foreground">Reduces emissions by 14%</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-blue-500">86%</div>
                                    <div className="text-sm text-muted-foreground">Implementation</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium">Reforestation Program</div>
                                    <div className="text-sm text-muted-foreground">125,000 trees planted</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-green-500">100%</div>
                                    <div className="text-sm text-muted-foreground">2023 Goal met</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-4 dark:border-gray-700">
                              <div className="font-medium mb-2">Sustainability ROI Analysis</div>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={[
                                      { project: "Solar Panels", investment: 1.2, returns: 1.8, payback: 4 },
                                      { project: "EV Fleet", investment: 2.4, returns: 1.6, payback: 7 },
                                      { project: "Route AI", investment: 0.8, returns: 1.4, payback: 2 },
                                      { project: "Packaging", investment: 0.5, returns: 0.7, payback: 3 }
                                    ]}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="project" className="text-xs" />
                                    <YAxis 
                                      className="text-xs" 
                                      tickFormatter={(value) => `$${value}M`} 
                                    />
                                    <Tooltip 
                                      contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        color: 'hsl(var(--foreground))'
                                      }}
                                      formatter={(value, name) => [
                                        name === 'payback' ? `${value} years` : `$${value}M`, 
                                        name === 'payback' ? 'Payback Period' : 
                                        name === 'investment' ? 'Initial Investment' : 'Annual Returns'
                                      ]}
                                    />
                                    <Legend />
                                    <Bar dataKey="investment" name="Investment ($M)" fill="#94a3b8" />
                                    <Bar dataKey="returns" name="Annual Returns ($M)" fill="#10b981" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="mt-2 text-xs text-muted-foreground text-center">
                                Average ROI across all sustainability initiatives: <span className="text-green-500 font-bold">142%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
          
        </TabsContent>
      </Tabs>
    </div>
  );
}