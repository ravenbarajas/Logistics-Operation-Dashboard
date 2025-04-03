import { Card } from "@/components/ui/card";
import {
  Line,
  LineChart as RechartsLineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface LineChartProps {
  data: Record<string, any>[];
  index: string;
  categories: string[];
  colors?: string[];
  yAxisWidth?: number;
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"],
  yAxisWidth = 40,
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: showLegend ? 40 : 10,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          className="stroke-muted"
        />
        <XAxis
          dataKey={index}
          tick={{ transform: "translate(0, 10)" }}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          className="text-xs fill-muted-foreground"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={yAxisWidth}
          fontSize={12}
          className="text-xs fill-muted-foreground"
          tickFormatter={valueFormatter}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="border-none shadow-lg p-2">
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="grid gap-1">
                      {payload.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">
                            {item.name}:
                          </span>
                          <span className="font-medium">
                            {valueFormatter(item.value as number)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            }
            return null;
          }}
        />
        {showLegend && (
          <Legend
            content={({ payload }) => (
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-4">
                {payload?.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          />
        )}
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            name={category.charAt(0).toUpperCase() + category.slice(1)}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: 'white',
              stroke: colors[index % colors.length],
            }}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              fill: colors[index % colors.length],
              stroke: 'white',
            }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
} 