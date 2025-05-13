import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MergedRouteData } from "@/components/routes/types";

interface RouteTemplateAnalyticsProps {
  templates: MergedRouteData[];
}

export function RouteTemplateAnalytics({ templates }: RouteTemplateAnalyticsProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Route Template Analytics</CardTitle>
        <CardDescription>Template usage and effectiveness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-md bg-muted/30">
              <div className="text-sm text-muted-foreground">Total Templates</div>
              <div className="text-2xl font-bold">{templates.length}</div>
            </div>
            <div className="p-3 rounded-md bg-muted/30">
              <div className="text-sm text-muted-foreground">Usage Rate</div>
              <div className="text-2xl font-bold">76%</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Top Templates by Usage</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Downtown Loop</span>
                  <span className="text-sm font-medium">42 uses</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">North District</span>
                  <span className="text-sm font-medium">36 uses</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">South District</span>
                  <span className="text-sm font-medium">28 uses</span>
                </div>
                <Progress value={56} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">East Suburban</span>
                  <span className="text-sm font-medium">22 uses</span>
                </div>
                <Progress value={44} className="h-2" />
              </div>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Template Efficiency</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Time Saved</span>
                  <span className="text-sm font-medium text-green-500">+18%</span>
                </div>
                <Progress value={18} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Fuel Reduction</span>
                  <span className="text-sm font-medium text-green-500">+12%</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Error Reduction</span>
                  <span className="text-sm font-medium text-green-500">+24%</span>
                </div>
                <Progress value={24} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-md bg-muted/30">
            <h4 className="text-sm font-medium mb-2">Recommendations</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-start">
                <div className="h-3 w-3 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0"></div>
                <span>Create 3 new templates for West Region routes</span>
              </li>
              <li className="flex items-start">
                <div className="h-3 w-3 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0"></div>
                <span>Optimize Downtown Loop for rush hour traffic</span>
              </li>
              <li className="flex items-start">
                <div className="h-3 w-3 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0"></div>
                <span>Review and update 4 underutilized templates</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 