import { RouteManagementPanel } from "./RouteManagementPanel";
import { ResourceAllocation } from "./ResourceAllocation";
import { ScheduleCompliance } from "./ScheduleCompliance";
import { RouteTemplateAnalytics } from "./RouteTemplateAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { RouteData, MergedRouteData } from "@/components/routes/types";

interface ManagementTabProps {
  routes: {
    active: MergedRouteData[];
    scheduled: MergedRouteData[];
    completed: MergedRouteData[];
    templates: MergedRouteData[];
  };
  onViewDetails: (route: RouteData) => void;
  onStartRoute: (route: RouteData) => void;
  onCompleteRoute: (route: RouteData) => void;
  onDuplicateRoute: (route: RouteData) => void;
  onDeleteRoute: (route: RouteData) => void;
  onAddRoute: () => void;
}

export function ManagementTab({
  routes,
  onViewDetails,
  onStartRoute,
  onCompleteRoute,
  onDuplicateRoute,
  onDeleteRoute,
  onAddRoute
}: ManagementTabProps) {
  return (
    <>
      <RouteManagementPanel
        routes={routes}
        onViewDetails={onViewDetails}
        onStartRoute={onStartRoute}
        onCompleteRoute={onCompleteRoute}
        onDuplicateRoute={onDuplicateRoute}
        onDeleteRoute={onDeleteRoute}
        onAddRoute={onAddRoute}
      />

      <Card className="mb-6 p- border-none">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          <ResourceAllocation />
          <ScheduleCompliance />
          <RouteTemplateAnalytics templates={routes.templates} />
        </div>
      </Card>
    </>
  );
} 