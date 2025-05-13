import { Card, CardContent } from "@/components/ui/card";
import { OptimizationEngine } from "./OptimizationEngine";
import { OptimizationImpact } from "./OptimizationImpact";
import { OptimizationResults } from "./OptimizationResults";

interface OptimizationTabProps {
  routeComparisonData: any; // Use your actual type here
}

export function OptimizationTab({ routeComparisonData }: OptimizationTabProps) {
  return (
    <>
      <Card className="border-none mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-0">
          <OptimizationEngine />
          <OptimizationImpact />
        </div>
      </Card>

      <Card className="border-none">   
        <OptimizationResults routeComparisonData={routeComparisonData} />
      </Card>
    </>
  );
} 