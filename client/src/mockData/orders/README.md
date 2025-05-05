# Orders Mock Data

This directory contains mock data used by the OrderManagement component in a JSON format, providing a more maintainable and modular approach for managing data.

## Files

- `orders.json` - Main order data used in the OrderManagement tab
- `analytics.json` - Data for charts and metrics in the OrderAnalytics tab
- `performance.json` - Data for the OrderPerformance tab
- `financials.json` - Data for the OrderFinancials tab
- `index.ts` - Export file that provides properly typed data to the application

## Usage

Import the data from this module in your components:

```typescript
import { 
  orders, 
  orderStatusData,
  fulfillmentComplianceData,
  // other exports...
} from "@/mockData/orders";
```

## Data Structure

The data is organized according to the tabs in the OrderManagement page:

### orders.json
Contains the main array of order objects used in the primary order table.

### analytics.json
Contains data for charts and metrics displayed in the Analytics tab:
- `orderStatusData` - For pie charts showing order status distribution
- `orderVolumeData` - Daily order volume metrics
- `shippingMethodsData` - Shipping methods breakdown
- `timelineData` - Order processing timeline data

### performance.json
Contains data for performance metrics:
- `fulfillmentComplianceData` - Service level compliance metrics
- `regionalPerformanceData` - Regional performance indicators

### financials.json
Contains financial data:
- `returnsRefundsData` - Returns and refunds metrics
- `profitabilityData` - Monthly profitability data
- `profitTrendsData` - Profit trends by product category
- `discountAnalysisData` - Analysis of discount impact
- `fulfillmentCostsData` - Cost breakdown of fulfillment operations

## Type Safety

The exported data is properly typed to match the interfaces used in the application components. 