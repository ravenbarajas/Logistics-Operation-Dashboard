import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CostAnalyticsDashboardProps {
  period: string;
  isDataLoaded: boolean;
}

export default function CostAnalyticsDashboard({ period, isDataLoaded }: CostAnalyticsDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Cost Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          This component will display detailed cost analytics and financial metrics.
        </div>
      </CardContent>
    </Card>
  );
} 