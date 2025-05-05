import ordersData from './orders.json';
import analyticsData from './analytics.json';
import performanceData from './performance.json';
import financialsData from './financials.json';

// Type definitions to match the component interfaces
interface Order {
  id: string;
  customer: string;
  customerEmail?: string;
  items: number;
  total: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  payment: "completed" | "pending" | "failed";
  shipping: string;
  trackingNumber?: string;
  expectedDelivery?: string;
  products?: string[];
  address?: string;
  notes?: string;
}

interface FulfillmentCompliance {
  id: string;
  shippingMethod: string;
  priority: 'High' | 'Medium' | 'Regular' | 'Low';
  targetTime: string;
  actualTime: string;
  variance: string;
  varianceValue: number;
  compliance: number;
  status: 'optimal' | 'good' | 'warning' | 'critical';
}

interface RegionalPerformanceMetrics {
  id: string;
  region: string;
  orderVolume: number;
  avgOrderValue: number;
  fulfillmentRate: number;
  deliveryTime: number;
  returnRate: number;
  yoyGrowth: number;
  customerSatisfaction: number;
  status: 'optimal' | 'good' | 'warning' | 'critical';
}

// Type assertions to ensure data matches expected interfaces
// OrderManagement tab
export const orders = ordersData as unknown as Order[];

// Analytics tab
export const { 
  orderStatusData,
  orderVolumeData,
  shippingMethodsData,
  weeklyOrderTrends,
  deliveryPerformance,
  volumeAndRevenue,
  timelineData
} = analyticsData;

// Performance tab
export const fulfillmentComplianceData = 
  performanceData.fulfillmentComplianceData as unknown as FulfillmentCompliance[];
export const regionalPerformanceData = 
  performanceData.regionalPerformanceData as unknown as RegionalPerformanceMetrics[];

// Financials tab
export const {
  returnsRefundsData,
  profitabilityData,
  profitTrendsData,
  discountAnalysisData,
  fulfillmentCostsData
} = financialsData;

// Common color scheme for charts
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; 