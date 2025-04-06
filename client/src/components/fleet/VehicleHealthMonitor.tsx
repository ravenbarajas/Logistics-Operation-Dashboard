import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Settings, AlertTriangle, Calendar, Gauge, Battery, 
  Wrench, BarChartBig, Activity, Cpu, Check, X, Car, Cog, 
  CircleDot
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Types for health metrics
interface HealthMetric {
  name: string;
  score: number;
  status: 'good' | 'warning' | 'critical';
  lastChecked: Date;
  nextCheck?: Date;
}

interface MaintenancePrediction {
  vehicleId: string;
  vehicleName: string;
  component: string;
  predictionDate: Date;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  estimatedCost: number;
  description: string;
}

interface DiagnosticCode {
  code: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

interface VehicleHealthMonitorProps {
  vehicles: {
    id: string;
    name: string;
    type: string;
    status: string;
    healthScore: number;
  }[];
  selectedVehicleId?: string;
  onSelectVehicle?: (vehicleId: string) => void;
}

const COLORS = ['#16a34a', '#eab308', '#dc2626', '#3b82f6', '#8b5cf6'];
const HEALTH_SCORE_COLORS = {
  good: 'text-green-500',
  warning: 'text-amber-500',
  critical: 'text-red-500'
};

export function VehicleHealthMonitor({ 
  vehicles, 
  selectedVehicleId, 
  onSelectVehicle 
}: VehicleHealthMonitorProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVehicle, setSelectedVehicle] = useState(selectedVehicleId || (vehicles.length > 0 ? vehicles[0].id : ''));

  // Mock data - would come from API in a real app
  const healthMetrics: HealthMetric[] = [
    { name: 'Engine', score: 92, status: 'good', lastChecked: new Date('2024-03-15') },
    { name: 'Transmission', score: 88, status: 'good', lastChecked: new Date('2024-03-10') },
    { name: 'Brakes', score: 75, status: 'warning', lastChecked: new Date('2024-03-12'), nextCheck: new Date('2024-04-12') },
    { name: 'Suspension', score: 95, status: 'good', lastChecked: new Date('2024-03-05') },
    { name: 'Electrical', score: 82, status: 'good', lastChecked: new Date('2024-03-08') },
    { name: 'Fluid Levels', score: 90, status: 'good', lastChecked: new Date('2024-03-20') },
    { name: 'Tires', score: 62, status: 'warning', lastChecked: new Date('2024-03-18'), nextCheck: new Date('2024-04-18') },
    { name: 'Battery', score: 45, status: 'critical', lastChecked: new Date('2024-03-01'), nextCheck: new Date('2024-04-01') }
  ];

  const maintenancePredictions: MaintenancePrediction[] = [
    {
      vehicleId: vehicles[0]?.id || '1',
      vehicleName: vehicles[0]?.name || 'Delivery Truck 1',
      component: 'Battery',
      predictionDate: new Date('2024-04-15'),
      confidence: 92,
      severity: 'high',
      estimatedCost: 350,
      description: 'Battery voltage dropping below acceptable levels. Replacement recommended within 2 weeks.'
    },
    {
      vehicleId: vehicles[0]?.id || '1',
      vehicleName: vehicles[0]?.name || 'Delivery Truck 1',
      component: 'Tires',
      predictionDate: new Date('2024-05-05'),
      confidence: 85,
      severity: 'medium',
      estimatedCost: 600,
      description: 'Front tires showing excessive wear pattern. Rotation and possible replacement required.'
    },
    {
      vehicleId: vehicles[1]?.id || '2',
      vehicleName: vehicles[1]?.name || 'Delivery Van 1',
      component: 'Brake Pads',
      predictionDate: new Date('2024-04-22'),
      confidence: 88,
      severity: 'medium',
      estimatedCost: 250,
      description: 'Brake pad wear approaching minimum thickness. Replacement recommended during next service.'
    }
  ];

  const diagnosticCodes: DiagnosticCode[] = [
    {
      code: 'P0420',
      description: 'Catalyst System Efficiency Below Threshold',
      severity: 'warning',
      timestamp: new Date('2024-03-18'),
      resolved: false
    },
    {
      code: 'P0300',
      description: 'Random/Multiple Cylinder Misfire Detected',
      severity: 'critical',
      timestamp: new Date('2024-03-19'),
      resolved: false
    },
    {
      code: 'P0171',
      description: 'System Too Lean (Bank 1)',
      severity: 'warning',
      timestamp: new Date('2024-03-15'),
      resolved: true
    },
    {
      code: 'B1000',
      description: 'Driver\'s Airbag Module',
      severity: 'info',
      timestamp: new Date('2024-03-10'),
      resolved: true
    }
  ];

  const componentHealthData = [
    { subject: 'Engine', A: 92, fullMark: 100 },
    { subject: 'Transmission', A: 88, fullMark: 100 },
    { subject: 'Brakes', A: 75, fullMark: 100 },
    { subject: 'Suspension', A: 95, fullMark: 100 },
    { subject: 'Electrical', A: 82, fullMark: 100 },
    { subject: 'Tires', A: 62, fullMark: 100 },
  ];

  // Historical metrics
  const healthTrendData = [
    { month: 'Oct', score: 98 },
    { month: 'Nov', score: 96 },
    { month: 'Dec', score: 94 },
    { month: 'Jan', score: 90 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 78 },
  ];

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    if (onSelectVehicle) {
      onSelectVehicle(vehicleId);
    }
  };

  // Get overall health score
  const getOverallHealthScore = () => {
    return healthMetrics.reduce((sum, metric) => sum + metric.score, 0) / healthMetrics.length;
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'warning';
    return 'critical';
  };

  const filteredPredictions = maintenancePredictions.filter(
    prediction => prediction.vehicleId === selectedVehicle
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <CardTitle className="flex items-center text-xl">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Vehicle Health Dashboard
          </CardTitle>
          <CardDescription>Real-time health metrics for your fleet vehicles</CardDescription>
        </div>
        
        <div className="mt-2 md:mt-0">
          <select 
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={selectedVehicle}
            onChange={(e) => handleVehicleChange(e.target.value)}
          >
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} - Health: {vehicle.healthScore}%
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Health Overview</TabsTrigger>
          <TabsTrigger value="predictions">Maintenance Predictions</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Health Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-primary" />
                  Overall Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-full py-6">
                  <div className={`text-6xl font-bold mb-2 ${HEALTH_SCORE_COLORS[getHealthStatus(getOverallHealthScore())]}`}>
                    {Math.round(getOverallHealthScore())}%
                  </div>
                  <Badge className={
                    getHealthStatus(getOverallHealthScore()) === 'good' ? 'bg-green-500' :
                    getHealthStatus(getOverallHealthScore()) === 'warning' ? 'bg-amber-500' :
                    'bg-red-500'
                  }>
                    {getHealthStatus(getOverallHealthScore()) === 'good' ? 'Good Condition' :
                     getHealthStatus(getOverallHealthScore()) === 'warning' ? 'Needs Attention' :
                     'Critical Issues'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  Health Trends
                </CardTitle>
                <CardDescription>
                  Vehicle health score over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs" 
                      />
                      <YAxis 
                        className="text-xs"
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Health Score']}
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Component Health Radar Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BarChartBig className="h-5 w-5 mr-2 text-primary" />
                  Component Health Analysis
                </CardTitle>
                <CardDescription>
                  Health status breakdown by vehicle component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={componentHealthData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name="Health Score" 
                        dataKey="A" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Health Score']}
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Health Status Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Wrench className="h-5 w-5 mr-2 text-primary" />
                  Component Status Details
                </CardTitle>
                <CardDescription>
                  Detailed health metrics by component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-auto pr-2">
                  {healthMetrics.map((metric, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col space-y-2 pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{metric.name}</div>
                        <Badge className={
                          metric.status === 'good' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-amber-500' :
                          'bg-red-500'
                        }>
                          {metric.score}%
                        </Badge>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Last checked: {metric.lastChecked.toLocaleDateString()}</span>
                        {metric.nextCheck && (
                          <span>Next check: {metric.nextCheck.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Predictive Maintenance Analysis
              </CardTitle>
              <CardDescription>
                AI-powered maintenance predictions for your vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPredictions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Cpu className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No maintenance predictions available for this vehicle.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPredictions.map((prediction, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium">{prediction.component} Maintenance</h3>
                          <p className="text-sm text-muted-foreground">
                            Predicted: {prediction.predictionDate.toLocaleDateString()} • 
                            Confidence: {prediction.confidence}%
                          </p>
                        </div>
                        <Badge className={
                          prediction.severity === 'low' ? 'bg-blue-500' :
                          prediction.severity === 'medium' ? 'bg-amber-500' :
                          'bg-red-500'
                        }>
                          {prediction.severity.charAt(0).toUpperCase() + prediction.severity.slice(1)} Priority
                        </Badge>
                      </div>
                      
                      <p className="mb-4 text-sm">
                        {prediction.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Est. Cost: ${prediction.estimatedCost}</span>
                        <Button variant="outline" size="sm">
                          Schedule Service
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diagnostics" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                Diagnostic Trouble Codes
              </CardTitle>
              <CardDescription>
                Active and recent diagnostic codes from vehicle computer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diagnosticCodes.map((code, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 flex items-start space-x-4 ${
                      code.resolved ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className={`mt-0.5 p-2 rounded-full ${
                      code.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                      code.severity === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {code.resolved ? <Check className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {code.code}: {code.description}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Detected: {code.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                        
                        {code.resolved ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                            Resolved
                          </Badge>
                        ) : (
                          <Badge className={
                            code.severity === 'critical' ? 'bg-red-500' :
                            code.severity === 'warning' ? 'bg-amber-500' :
                            'bg-blue-500'
                          }>
                            {code.severity.charAt(0).toUpperCase() + code.severity.slice(1)}
                          </Badge>
                        )}
                      </div>
                      
                      {!code.resolved && (
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm">Diagnose</Button>
                          <Button variant="outline" size="sm">Ignore</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Battery className="h-5 w-5 mr-2 text-primary" />
                  System Tests
                </CardTitle>
                <CardDescription>
                  Results from automated system tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center">
                      <Cog className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Emissions System</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                      Pass
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Engine Performance</span>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-200">
                      Warning
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center">
                      <CircleDot className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Oxygen Sensor</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                      Pass
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Transmission</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                      Pass
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <Battery className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Battery System</span>
                    </div>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-200">
                      Fail
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-primary" />
                  Scan Results
                </CardTitle>
                <CardDescription>
                  Vehicle computer scan summary
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl font-bold text-red-500 mb-2">2</div>
                    <div className="text-sm font-medium">Active Faults</div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl font-bold text-amber-500 mb-2">3</div>
                    <div className="text-sm font-medium">Pending Codes</div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl font-bold text-green-500 mb-2">5</div>
                    <div className="text-sm font-medium">Historical Codes</div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">12</div>
                    <div className="text-sm font-medium">Systems Checked</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <Button className="w-full">Run New Diagnostic Scan</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 