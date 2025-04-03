// Interfaces for the different report types
export interface PerformanceReport {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  data: {
    date: string;
    shipments: number;
    deliveredOnTime: number;
    delayed: number;
  }[];
  summary: {
    totalShipments: number;
    onTimeDeliveryRate: number;
    averageDelay: number; // in hours
  };
}

export interface InventoryReport {
  period: 'current' | 'weekly' | 'monthly' | 'quarterly';
  data: {
    category: string;
    totalItems: number;
    inStock: number;
    outOfStock: number;
    lowStock: number;
  }[];
  summary: {
    totalItems: number;
    outOfStockPercentage: number;
    lowStockPercentage: number;
    highestStockCategory: string;
    lowestStockCategory: string;
  };
}

export interface CostReport {
  period: 'monthly' | 'quarterly' | 'yearly';
  data: {
    date: string;
    transportation: number;
    storage: number;
    labor: number;
    maintenance: number;
    other: number;
    total: number;
  }[];
  summary: {
    totalCost: number;
    transportationPercentage: number;
    storagePercentage: number;
    laborPercentage: number;
    maintenancePercentage: number;
    otherPercentage: number;
    monthOverMonthChange: number; // percentage
  };
}

export interface UtilizationReport {
  period: 'weekly' | 'monthly';
  data: {
    resource: string;
    type: 'vehicle' | 'warehouse' | 'personnel';
    utilization: number; // percentage
    capacity: number;
    usage: number;
  }[];
  summary: {
    overallUtilization: number; // percentage
    vehicleUtilization: number; // percentage
    warehouseUtilization: number; // percentage
    personnelUtilization: number; // percentage
    mostUtilizedResource: string;
    leastUtilizedResource: string;
  };
}

// Generate mock performance data
const generatePerformanceData = (period: PerformanceReport['period']): PerformanceReport => {
  let dates: string[] = [];
  const now = new Date();
  
  // Generate appropriate date ranges based on period
  if (period === 'daily') {
    // Last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
  } else if (period === 'weekly') {
    // Last 12 weeks
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
      dates.push(`Week ${weekNumber}, ${date.toISOString().split('T')[0].substring(0, 7)}`);
    }
  } else if (period === 'monthly') {
    // Last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      dates.push(date.toISOString().split('T')[0].substring(0, 7));
    }
  } else if (period === 'quarterly') {
    // Last 8 quarters
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - (i * 3));
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      dates.push(`Q${quarter} ${date.getFullYear()}`);
    }
  } else {
    // Last 5 years
    for (let i = 4; i >= 0; i--) {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - i);
      dates.push(date.getFullYear().toString());
    }
  }
  
  // Generate data for each date
  const data = dates.map(date => {
    const shipments = Math.floor(Math.random() * 50) + 30;
    const deliveredOnTime = Math.floor(shipments * (0.7 + Math.random() * 0.25));
    const delayed = shipments - deliveredOnTime;
    
    return {
      date,
      shipments,
      deliveredOnTime,
      delayed
    };
  });
  
  // Calculate summary
  const totalShipments = data.reduce((sum, item) => sum + item.shipments, 0);
  const totalOnTime = data.reduce((sum, item) => sum + item.deliveredOnTime, 0);
  const totalDelays = data.reduce((sum, item) => sum + item.delayed, 0);
  const onTimeDeliveryRate = totalOnTime / totalShipments;
  const averageDelay = totalDelays > 0 ? Math.round((Math.random() * 24) + 4) : 0;
  
  return {
    period,
    data,
    summary: {
      totalShipments,
      onTimeDeliveryRate,
      averageDelay
    }
  };
};

// Generate mock inventory data
const generateInventoryReport = (period: InventoryReport['period']): InventoryReport => {
  const categories = [
    'Electronics',
    'Furniture',
    'Clothing',
    'Food & Beverages',
    'Automotive',
    'Office Supplies',
    'Construction Materials',
    'Chemicals'
  ];
  
  const data = categories.map(category => {
    const totalItems = Math.floor(Math.random() * 2000) + 500;
    const inStock = Math.floor(totalItems * (0.6 + Math.random() * 0.3));
    const outOfStock = Math.floor((totalItems - inStock) * (Math.random() * 0.5));
    const lowStock = totalItems - inStock - outOfStock;
    
    return {
      category,
      totalItems,
      inStock,
      outOfStock,
      lowStock
    };
  });
  
  // Calculate summary
  const totalItems = data.reduce((sum, item) => sum + item.totalItems, 0);
  const totalOutOfStock = data.reduce((sum, item) => sum + item.outOfStock, 0);
  const totalLowStock = data.reduce((sum, item) => sum + item.lowStock, 0);
  const outOfStockPercentage = totalOutOfStock / totalItems;
  const lowStockPercentage = totalLowStock / totalItems;
  
  // Find highest and lowest stock categories
  const sortedByStock = [...data].sort((a, b) => (b.inStock / b.totalItems) - (a.inStock / a.totalItems));
  const highestStockCategory = sortedByStock[0].category;
  const lowestStockCategory = sortedByStock[sortedByStock.length - 1].category;
  
  return {
    period,
    data,
    summary: {
      totalItems,
      outOfStockPercentage,
      lowStockPercentage,
      highestStockCategory,
      lowestStockCategory
    }
  };
};

// Generate mock cost data
const generateCostReport = (period: CostReport['period']): CostReport => {
  let dates: string[] = [];
  const now = new Date();
  
  if (period === 'monthly') {
    // Last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      dates.push(date.toISOString().split('T')[0].substring(0, 7));
    }
  } else if (period === 'quarterly') {
    // Last 8 quarters
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - (i * 3));
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      dates.push(`Q${quarter} ${date.getFullYear()}`);
    }
  } else {
    // Last 5 years
    for (let i = 4; i >= 0; i--) {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - i);
      dates.push(date.getFullYear().toString());
    }
  }
  
  // Generate data for each date
  const data = dates.map(date => {
    const transportation = Math.floor(Math.random() * 30000) + 20000;
    const storage = Math.floor(Math.random() * 20000) + 15000;
    const labor = Math.floor(Math.random() * 25000) + 30000;
    const maintenance = Math.floor(Math.random() * 10000) + 5000;
    const other = Math.floor(Math.random() * 8000) + 2000;
    const total = transportation + storage + labor + maintenance + other;
    
    return {
      date,
      transportation,
      storage,
      labor,
      maintenance,
      other,
      total
    };
  });
  
  // Calculate summary
  const totalCost = data.reduce((sum, item) => sum + item.total, 0);
  const totalTransportation = data.reduce((sum, item) => sum + item.transportation, 0);
  const totalStorage = data.reduce((sum, item) => sum + item.storage, 0);
  const totalLabor = data.reduce((sum, item) => sum + item.labor, 0);
  const totalMaintenance = data.reduce((sum, item) => sum + item.maintenance, 0);
  const totalOther = data.reduce((sum, item) => sum + item.other, 0);
  
  const transportationPercentage = totalTransportation / totalCost;
  const storagePercentage = totalStorage / totalCost;
  const laborPercentage = totalLabor / totalCost;
  const maintenancePercentage = totalMaintenance / totalCost;
  const otherPercentage = totalOther / totalCost;
  
  // Calculate month over month change (comparing last two periods)
  const lastMonthTotal = data[data.length - 1].total;
  const previousMonthTotal = data[data.length - 2].total;
  const monthOverMonthChange = (lastMonthTotal - previousMonthTotal) / previousMonthTotal;
  
  return {
    period,
    data,
    summary: {
      totalCost,
      transportationPercentage,
      storagePercentage,
      laborPercentage,
      maintenancePercentage,
      otherPercentage,
      monthOverMonthChange
    }
  };
};

// Generate mock utilization data
const generateUtilizationReport = (period: UtilizationReport['period']): UtilizationReport => {
  const resources = [
    { name: 'Truck FL-123', type: 'vehicle' as const },
    { name: 'Truck FL-456', type: 'vehicle' as const },
    { name: 'Van FL-789', type: 'vehicle' as const },
    { name: 'Main Warehouse', type: 'warehouse' as const },
    { name: 'North Distribution Center', type: 'warehouse' as const },
    { name: 'South Storage Facility', type: 'warehouse' as const },
    { name: 'Logistics Team', type: 'personnel' as const },
    { name: 'Warehouse Staff', type: 'personnel' as const },
    { name: 'Delivery Team', type: 'personnel' as const }
  ];
  
  const data = resources.map(resource => {
    const utilization = Math.random() * 70 + 30; // 30-100%
    const capacity = Math.floor(Math.random() * 100) + 100;
    const usage = Math.floor(capacity * (utilization / 100));
    
    return {
      resource: resource.name,
      type: resource.type,
      utilization,
      capacity,
      usage
    };
  });
  
  // Calculate summary
  const overallUtilization = data.reduce((sum, item) => sum + item.utilization, 0) / data.length;
  
  const vehicleData = data.filter(item => item.type === 'vehicle');
  const warehouseData = data.filter(item => item.type === 'warehouse');
  const personnelData = data.filter(item => item.type === 'personnel');
  
  const vehicleUtilization = vehicleData.reduce((sum, item) => sum + item.utilization, 0) / vehicleData.length;
  const warehouseUtilization = warehouseData.reduce((sum, item) => sum + item.utilization, 0) / warehouseData.length;
  const personnelUtilization = personnelData.reduce((sum, item) => sum + item.utilization, 0) / personnelData.length;
  
  // Find most and least utilized resources
  const sortedByUtilization = [...data].sort((a, b) => b.utilization - a.utilization);
  const mostUtilizedResource = sortedByUtilization[0].resource;
  const leastUtilizedResource = sortedByUtilization[sortedByUtilization.length - 1].resource;
  
  return {
    period,
    data,
    summary: {
      overallUtilization,
      vehicleUtilization,
      warehouseUtilization,
      personnelUtilization,
      mostUtilizedResource,
      leastUtilizedResource
    }
  };
};

// The report service
export const reportService = {
  async getPerformanceReport(period: PerformanceReport['period'] = 'monthly'): Promise<PerformanceReport> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return generatePerformanceData(period);
  },
  
  async getInventoryReport(period: InventoryReport['period'] = 'current'): Promise<InventoryReport> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    return generateInventoryReport(period);
  },
  
  async getCostReport(period: CostReport['period'] = 'monthly'): Promise<CostReport> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 900));
    return generateCostReport(period);
  },
  
  async getUtilizationReport(period: UtilizationReport['period'] = 'monthly'): Promise<UtilizationReport> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 750));
    return generateUtilizationReport(period);
  },
  
  async generateCustomReport(params: {
    type: 'performance' | 'inventory' | 'cost' | 'utilization';
    period: string;
    filters?: Record<string, any>;
  }): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    switch (params.type) {
      case 'performance':
        return generatePerformanceData(params.period as any);
      case 'inventory':
        return generateInventoryReport(params.period as any);
      case 'cost':
        return generateCostReport(params.period as any);
      case 'utilization':
        return generateUtilizationReport(params.period as any);
      default:
        throw new Error('Invalid report type');
    }
  }
}; 