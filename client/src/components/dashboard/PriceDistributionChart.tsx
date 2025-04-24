import React from "react";
import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Define data type for price distribution
interface PricePoint {
  range: string;
  count: number;
  percentage: number;
}

// Define props with proper typing for callback functions
interface PriceDistributionChartProps {
  data: PricePoint[];
  valueFormatter?: (value: number) => string;
  percentageFormatter?: (value: number) => string;
  onBarClick?: (data: PricePoint, index: number) => void;
  onLegendClick?: (dataKey: string) => void;
  title?: string;
  description?: string;
}

export function PriceDistributionChart({
  data,
  valueFormatter = (value: number) => value.toString(),
  percentageFormatter = (value: number) => `${value.toFixed(1)}%`,
  onBarClick,
  onLegendClick,
  title = "Price Distribution",
  description = "Distribution of prices across different ranges",
}: PriceDistributionChartProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {title && (
        <div className="mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 40,
            }}
            barCategoryGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-muted"
            />
            <XAxis
              dataKey="range"
              tick={{ transform: "translate(0, 10)" }}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              className="text-xs fill-muted-foreground"
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              width={40}
              fontSize={12}
              className="text-xs fill-muted-foreground"
              tickFormatter={valueFormatter}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              width={40}
              fontSize={12}
              className="text-xs fill-muted-foreground"
              tickFormatter={percentageFormatter}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="border-none shadow-lg p-2">
                      <div className="grid gap-2">
                        <div className="text-sm font-semibold">{label}</div>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2 text-xs">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: payload[0].color }}
                            />
                            <span className="text-muted-foreground">
                              Count:
                            </span>
                            <span className="font-medium">
                              {valueFormatter(payload[0].value as number)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: payload[1].color }}
                            />
                            <span className="text-muted-foreground">
                              Percentage:
                            </span>
                            <span className="font-medium">
                              {percentageFormatter(payload[1].value as number)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                }
                return null;
              }}
            />
            <Legend
              content={({ payload }) => (
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-4">
                  {payload?.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        if (item.dataKey && onLegendClick) {
                          onLegendClick(item.dataKey.toString());
                        }
                      }}
                    >
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
            <Bar
              yAxisId="left"
              dataKey="count"
              name="Count"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              onClick={(data, index) => onBarClick?.(data as PricePoint, index)}
            />
            <Bar
              yAxisId="right"
              dataKey="percentage"
              name="Percentage"
              fill="#16a34a"
              radius={[4, 4, 0, 0]}
              onClick={(data, index) => onBarClick?.(data as PricePoint, index)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 