import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SustainabilityMetricsProps {
  period: string;
  isDataLoaded: boolean;
}

export default function SustainabilityMetrics({ period, isDataLoaded }: SustainabilityMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sustainability Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          This component will display environmental impact and sustainability metrics for the logistics operations.
        </div>
      </CardContent>
    </Card>
  );
} 