import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  BarChart, 
  LineChart,
  DonutChart,
  Legend
} from "@tremor/react";
import {
  Settings,
  Target,
  Truck,
  Warehouse,
  Users,
  TrendingUp,
  Clipboard,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

// Performance domain types
interface PerformanceDomain {
  name: string;
  icon: string;
  score: number;
  trend: number;
  status: "excellent" | "good" | "average" | "poor" | string;
  metrics: PerformanceMetric[];
}

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
}

// KPI data interface
interface KpiData {
  category: string;
  value: number;
  target: number;
}

// Daily performance interface
interface DailyPerformance {
  date: string;
  operations: number;
  delivery: number;
  warehouse: number;
  customer: number;
}

// Risk assessment interface
interface RiskAssessment {
  category: string;
  probability: number;
  impact: number;
  readiness: number;
}

interface LogisticsPerformanceMatrixProps {
  performanceDomains: PerformanceDomain[];
  kpiTrend: KpiData[];
  dailyPerformance: DailyPerformance[];
  riskAssessment: RiskAssessment[];
  improvementOpportunities: {area: string; potential: number; effort: number; priority: number}[];
}

const LogisticsPerformanceMatrix: React.FC<LogisticsPerformanceMatrixProps> = ({
  performanceDomains,
  kpiTrend,
  dailyPerformance,
  riskAssessment,
  improvementOpportunities
}) => {
  // Helper function to determine status color
  const getStatusColor = (status: string): string => {
    switch(status) {
      case "excellent": return "bg-green-500";
      case "good": return "bg-emerald-500";
      case "average": return "bg-amber-500";
      case "poor": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Helper function to determine trend icon and color
  const getTrendDisplay = (trend: number) => {
    if (trend > 0) {
      return { 
        icon: <TrendingUp className="h-4 w-4 mr-1" />, 
        color: "text-green-500" 
      };
    } else if (trend < 0) {
      return { 
        icon: <TrendingUp className="h-4 w-4 mr-1 rotate-180" />, 
        color: "text-red-500" 
      };
    } else {
      return { 
        icon: <span className="h-4 w-4 mr-1">―</span>, 
        color: "text-gray-500" 
      };
    }
  };

  // Helper function to render icon based on string name
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "Settings": return <Settings className="h-5 w-5 mr-2 text-primary" />;
      case "Truck": return <Truck className="h-5 w-5 mr-2 text-primary" />;
      case "Warehouse": return <Warehouse className="h-5 w-5 mr-2 text-primary" />;
      case "Users": return <Users className="h-5 w-5 mr-2 text-primary" />;
      default: return <Target className="h-5 w-5 mr-2 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Domain Cards - Keep these visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceDomains.map((domain, index) => (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: `var(--${domain.status === 'excellent' ? 'green' : domain.status === 'good' ? 'emerald' : domain.status === 'average' ? 'amber' : 'destructive'})` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                {renderIcon(domain.icon)}
                <span className="ml-2">{domain.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold">{domain.score}/100</div>
                <div className={`flex items-center ${getTrendDisplay(domain.trend).color}`}>
                  {getTrendDisplay(domain.trend).icon}
                  <span className="text-sm">{Math.abs(domain.trend)}%</span>
                </div>
              </div>
              <Badge className={`${getStatusColor(domain.status)} text-white`}>
                {domain.status.charAt(0).toUpperCase() + domain.status.slice(1)}
              </Badge>
              
              <div className="mt-4 space-y-2">
                {domain.metrics.slice(0, 2).map((metric, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-muted-foreground">{metric.name}</span>
                      <div className="flex items-center">
                        <span className="font-medium">{metric.value}{metric.unit}</span>
                        <span className="text-xs text-muted-foreground ml-1">/ {metric.target}{metric.unit}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
                      <div 
                        className={`h-full ${metric.value >= metric.target ? 'bg-green-500' : 'bg-amber-500'}`} 
                        style={{ width: `${(metric.value / metric.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Analytics - Organized in tabs */}
      <Tabs defaultValue="kpi-trends">
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="kpi-trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            KPI Trends
          </TabsTrigger>
          <TabsTrigger value="performance-tracking">
            <Clock className="h-4 w-4 mr-2" />
            Performance Tracking
          </TabsTrigger>
          <TabsTrigger value="risk-improvement">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Risk & Improvement
          </TabsTrigger>
        </TabsList>

        {/* KPI Trends Tab */}
        <TabsContent value="kpi-trends">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                KPI Performance Trends
              </CardTitle>
              <CardDescription>
                Current values against targets across key performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                className="h-64"
                data={kpiTrend}
                index="category"
                categories={["value", "target"]}
                colors={["blue", "gray"]}
                valueFormatter={(value: number) => `${value}`}
                layout="vertical"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tracking Tab */}
        <TabsContent value="performance-tracking">
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
              <LineChart
                className="h-64"
                data={dailyPerformance}
                index="date"
                categories={["operations", "delivery", "warehouse", "customer"]}
                colors={["blue", "emerald", "amber", "indigo"]}
                valueFormatter={(value: number) => `${value}%`}
                yAxisWidth={40}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk & Improvement Tab */}
        <TabsContent value="risk-improvement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Assessment */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                  Risk Assessment Matrix
                </CardTitle>
                <CardDescription>
                  Logistics operational risks with impact and mitigation readiness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
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
                      {riskAssessment.map((risk, index) => (
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
                <CardTitle className="flex items-center">
                  <Clipboard className="h-5 w-5 mr-2 text-primary" />
                  Improvement Opportunities
                </CardTitle>
                <CardDescription>
                  High-impact areas for performance enhancement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  <div className="space-y-4">
                    {improvementOpportunities.map((opportunity, index) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsPerformanceMatrix; 