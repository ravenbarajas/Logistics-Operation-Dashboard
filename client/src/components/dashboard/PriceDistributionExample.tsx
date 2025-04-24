import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceDistributionChart } from "./PriceDistributionChart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample price distribution data
const sampleData = [
  { range: "$0-$50", count: 156, percentage: 15.6 },
  { range: "$51-$100", count: 289, percentage: 28.9 },
  { range: "$101-$150", count: 198, percentage: 19.8 },
  { range: "$151-$200", count: 142, percentage: 14.2 },
  { range: "$201-$250", count: 87, percentage: 8.7 },
  { range: "$251-$300", count: 62, percentage: 6.2 },
  { range: "$301+", count: 66, percentage: 6.6 }
];

// Sample monthly data for dropdown selection
const monthlyData = {
  january: [
    { range: "$0-$50", count: 156, percentage: 15.6 },
    { range: "$51-$100", count: 289, percentage: 28.9 },
    { range: "$101-$150", count: 198, percentage: 19.8 },
    { range: "$151-$200", count: 142, percentage: 14.2 },
    { range: "$201-$250", count: 87, percentage: 8.7 },
    { range: "$251-$300", count: 62, percentage: 6.2 },
    { range: "$301+", count: 66, percentage: 6.6 }
  ],
  february: [
    { range: "$0-$50", count: 132, percentage: 13.2 },
    { range: "$51-$100", count: 301, percentage: 30.1 },
    { range: "$101-$150", count: 215, percentage: 21.5 },
    { range: "$151-$200", count: 129, percentage: 12.9 },
    { range: "$201-$250", count: 95, percentage: 9.5 },
    { range: "$251-$300", count: 58, percentage: 5.8 },
    { range: "$301+", count: 70, percentage: 7.0 }
  ],
  march: [
    { range: "$0-$50", count: 145, percentage: 14.5 },
    { range: "$51-$100", count: 278, percentage: 27.8 },
    { range: "$101-$150", count: 220, percentage: 22.0 },
    { range: "$151-$200", count: 136, percentage: 13.6 },
    { range: "$201-$250", count: 92, percentage: 9.2 },
    { range: "$251-$300", count: 65, percentage: 6.5 },
    { range: "$301+", count: 64, percentage: 6.4 }
  ]
};

export default function PriceDistributionExample() {
  const [currentMonth, setCurrentMonth] = useState<"january" | "february" | "march">("january");
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  // Format values with dollar sign
  const valueFormatter = (value: number) => `${value}`;
  
  // Format percentages with 1 decimal place
  const percentageFormatter = (value: number) => `${value.toFixed(1)}%`;
  
  // Handle bar click events
  const handleBarClick = (data: { range: string; count: number; percentage: number }, index: number) => {
    setSelectedBar(data.range);
    console.log(`Bar clicked: ${data.range}, Count: ${data.count}, Percentage: ${data.percentage}%`);
    
    // In a real application, you might:
    // - Open a modal with detailed information
    // - Filter data based on the selected range
    // - Navigate to a detailed view
    // - etc.
  };
  
  // Handle legend click events
  const handleLegendClick = (dataKey: string) => {
    setSelectedSeries(dataKey);
    console.log(`Legend item clicked: ${dataKey}`);
    
    // In a real application, you might:
    // - Toggle visibility of a series
    // - Show only the selected series
    // - Update another visualization
    // - etc.
  };

  return (
    <Card className="w-full h-[500px]">
      <CardHeader className="px-6 py-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-semibold">Price Distribution Analysis</CardTitle>
        <Select 
          value={currentMonth} 
          onValueChange={(value) => setCurrentMonth(value as "january" | "february" | "march")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="january">January 2023</SelectItem>
            <SelectItem value="february">February 2023</SelectItem>
            <SelectItem value="march">March 2023</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-6 pt-0 pb-6 h-[400px]">
        <PriceDistributionChart
          data={monthlyData[currentMonth]}
          valueFormatter={valueFormatter}
          percentageFormatter={percentageFormatter}
          onBarClick={handleBarClick}
          onLegendClick={handleLegendClick}
          title="Monthly Price Distribution"
          description="Analysis of order prices across different price ranges"
        />
        
        {/* Display current selection */}
        {(selectedBar || selectedSeries) && (
          <div className="mt-4 p-3 bg-muted/20 rounded-md text-sm">
            <div className="font-medium mb-1">Current Selection:</div>
            {selectedBar && (
              <div className="text-xs mb-1">
                Selected Price Range: <span className="font-semibold">{selectedBar}</span>
              </div>
            )}
            {selectedSeries && (
              <div className="text-xs">
                Selected Series: <span className="font-semibold">{selectedSeries}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 text-xs"
              onClick={() => {
                setSelectedBar(null);
                setSelectedSeries(null);
              }}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 