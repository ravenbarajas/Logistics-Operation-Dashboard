import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { ArrowRightLeft } from "lucide-react";

interface StockMovementData {
  month: string;
  inbound: number;
  outbound: number;
}

interface StockMovementChartProps {
  data: StockMovementData[];
}

export function StockMovementChart({ data }: StockMovementChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <ArrowRightLeft className="h-5 w-5 mr-2 text-primary" />
          Stock Movement Trends
        </CardTitle>
        <CardDescription>Inbound and outbound inventory flow over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <TabsList className="mb-4">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="composed">Composed Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value}`, '']} />
                <Legend />
                <Bar dataKey="inbound" name="Inbound" fill="#0088FE" />
                <Bar dataKey="outbound" name="Outbound" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="line" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value}`, '']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="inbound" 
                  name="Inbound" 
                  stroke="#0088FE" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="outbound" 
                  name="Outbound" 
                  stroke="#FF8042" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="composed" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value}`, '']} />
                <Legend />
                <Bar dataKey="inbound" name="Inbound" fill="#0088FE" />
                <Bar dataKey="outbound" name="Outbound" fill="#FF8042" />
                <Line 
                  type="monotone" 
                  dataKey="inbound" 
                  name="Inbound Trend" 
                  stroke="#004080" 
                  dot={false}
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="outbound" 
                  name="Outbound Trend" 
                  stroke="#A63600" 
                  dot={false}
                  strokeWidth={2} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 