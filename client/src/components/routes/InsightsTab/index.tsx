import { Card, CardContent } from "@/components/ui/card";
import { EfficiencyImprovements } from "./EfficiencyImprovements";
import { ResourceUtilization } from "./ResourceUtilization";
import { DriverPerformance } from "./DriverPerformance";
import { PerformanceAreaKey, DriverPerformanceData as IDriverPerformanceData } from "@/components/routes/types";

interface InsightsTabProps {
  efficiencyImprovementData: any; // Replace with your actual type
  driverPerformanceData: Record<PerformanceAreaKey, IDriverPerformanceData[]>;
}

export function InsightsTab({
  efficiencyImprovementData,
  driverPerformanceData
}: InsightsTabProps) {
  return (
    <>
      <Card className="border-none">
        <CardContent className="p-0 mb-6">
          <EfficiencyImprovements 
            efficiencyImprovementData={efficiencyImprovementData} 
          />
          
          <ResourceUtilization />
        </CardContent>
      </Card>

      <DriverPerformance 
        driverPerformanceData={driverPerformanceData}
      />
    </>
  );
} 