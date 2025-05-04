import shipmentsData from './shipments.json';
import analyticsData from './analytics.json';
import routeEfficiencyData from './routeEfficiency.json';
import environmentalImpactData from './environmentalImpact.json';
import exceptionsData from './exceptions.json';
import efficiencyMetricsData from './efficiencyMetrics.json';

// Convert all date strings in shipments back to Date objects
const processedShipments = shipmentsData.map(shipment => ({
  ...shipment,
  estimatedDelivery: shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery) : null,
  actualDelivery: shipment.actualDelivery ? new Date(shipment.actualDelivery) : null,
  createdAt: new Date(shipment.createdAt),
  updatedAt: new Date(shipment.updatedAt)
}));

export { 
  processedShipments as shipments,
  analyticsData,
  routeEfficiencyData,
  environmentalImpactData,
  exceptionsData,
  efficiencyMetricsData as efficiencyMetrics
}; 