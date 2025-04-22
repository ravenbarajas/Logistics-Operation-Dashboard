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
  Legend
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
  MapPin
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
            </div>
          </Card>
        </TabsContent>
        
        {/* Financial Analytics Tab */}
        <TabsContent value="financial" className="space-y-4">
          {/* Financial Analytics Section */}
          <Card className="p-6">
            <div>
              <CardTitle className="flex items-center">
              Financial Analytics
              </CardTitle>
              <CardDescription className="mb-6">Track and manage shipping costs</CardDescription>
              <Tabs defaultValue="fuel" className="mb-6">
                <TabsList className="mb-6 grid grid-cols-3 w-full md:w-auto">
                  <TabsTrigger value="fuel">Fuel Analytics</TabsTrigger>
                  <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
                  <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fuel" className="max-h-[calc(100vh-20rem)] overflow-y-auto">
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
                </TabsContent>
                
                <TabsContent value="cost" className="max-h-[calc(100vh-20rem)] overflow-y-auto">
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle>Operational Cost Breakdown</CardTitle>
                      <CardDescription>Analysis of transportation costs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Fuel', value: 42 },
                                { name: 'Maintenance', value: 18 },
                                { name: 'Driver Wages', value: 28 },
                                { name: 'Insurance', value: 8 },
                                { name: 'Other', value: 4 },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {transportModeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="sustainability" className="max-h-[calc(100vh-20rem)] overflow-y-auto">
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle>Carbon Footprint</CardTitle>
                      <CardDescription>CO2 emissions by transport mode</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Q1', truck: 145, train: 45, electric: 20 },
                              { name: 'Q2', truck: 158, train: 48, electric: 28 },
                              { name: 'Q3', truck: 132, train: 52, electric: 35 },
                              { name: 'Q4', truck: 142, train: 50, electric: 40 },
                            ]}
                          >
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
                            <Legend />
                            <Bar dataKey="truck" name="Diesel Trucks" fill="#FF8042" />
                            <Bar dataKey="train" name="Rail Transport" fill="#FFBB28" />
                            <Bar dataKey="electric" name="Electric Vehicles" fill="#00C49F" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}