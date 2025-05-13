import { Card, CardContent } from "@/components/ui/card";
import { OptimizationComparison } from "./OptimizationComparison";
import { TrafficPatternAnalysis } from "./TrafficPatternAnalysis";
import { TrafficIncidentAnalysis } from "./TrafficIncidentAnalysis";
import { TrafficIncident, TrafficRoad, AutomatedAction } from "@/components/routes/types";

interface TrafficTabProps {
  optimizationSummaryData: any; // Replace with your actual type
  trafficIncidents: TrafficIncident[];
  trafficRoads: TrafficRoad[];
  trafficAutomatedActions: AutomatedAction[];
  refreshTrafficData: () => void;
  generateCoordinatesFromPath: (path: string, id: string) => Array<{lat: number, lng: number}>;
}

export function TrafficTab({
  optimizationSummaryData,
  trafficIncidents,
  trafficRoads,
  trafficAutomatedActions,
  refreshTrafficData,
  generateCoordinatesFromPath
}: TrafficTabProps) {
  return (
    <>
      <Card className="mb-6 border-none">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-0">
            <OptimizationComparison 
              optimizationSummaryData={optimizationSummaryData} 
            />
            <TrafficPatternAnalysis />
          </div>
        </CardContent>
      </Card>

      <TrafficIncidentAnalysis 
        trafficIncidents={trafficIncidents}
        trafficRoads={trafficRoads}
        trafficAutomatedActions={trafficAutomatedActions}
        refreshTrafficData={refreshTrafficData}
        generateCoordinatesFromPath={generateCoordinatesFromPath}
      />
    </>
  );
} 