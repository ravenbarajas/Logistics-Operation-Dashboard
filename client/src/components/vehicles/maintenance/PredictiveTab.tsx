import {
  TrendingUp, Settings, Clock, Calendar, X, Truck, Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PredictiveTabProps {
  openFailureDetailsDialog: () => void;
}

export function PredictiveTab({ openFailureDetailsDialog }: PredictiveTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            Failure Prediction Model
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => alert("Model settings opened")}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Model Confidence</span>
                <span className="text-sm font-medium">92.4%</span>
              </div>
              <Progress value={92.4} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Last updated: Today, 08:45 AM</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 px-2 text-xs"
                  onClick={() => alert("Model retrained with latest data")}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Retrain
                </Button>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Predictions by Vehicle Type</h4>
                <Select defaultValue="6months">
                  <SelectTrigger className="h-7 text-xs w-[110px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span>Delivery Trucks</span>
                  </div>
                  <span>87% accuracy</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    <span>Cargo Vans</span>
                  </div>
                  <span>93% accuracy</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Refrigerated Units</span>
                  </div>
                  <span>89% accuracy</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Button 
                    className="w-full mt-2" 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert("Detailed model accuracy report with precision and recall metrics for each component type")}
                  >
                    View Full Accuracy Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Time-to-Failure Estimates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-3">
            <Select defaultValue="high">
              <SelectTrigger className="h-8 text-xs w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => alert("Maintenance schedule updated")}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Schedule All
            </Button>
          </div>
          
          <div className="space-y-4">
            <div 
              className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              onClick={openFailureDetailsDialog}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Truck #103 - Battery</div>
                <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">14 days</Badge>
              </div>
              <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Replace within 2 weeks - Confidence: 92%</div>
              <div className="mt-2 flex items-center justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Added to maintenance schedule");
                  }}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Dismissed from alerts");
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Van #205 - Front Tires</div>
                <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">14 days</Badge>
              </div>
              <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Replace within 2 weeks - Confidence: 92%</div>
              <div className="mt-2 flex items-center justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Added to maintenance schedule");
                  }}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Dismissed from alerts");
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 