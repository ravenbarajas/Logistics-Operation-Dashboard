import fleetData from './fleetData.json';
import maintenanceData from './maintenanceData.json';
import fuelData from './fuelData.json';
import analyticsData from './analyticsData.json';
import driversData from './driversData.json';

// For fleet data, we need to convert string dates back to Date objects
const convertDates = (vehicles: any[]) => {
  return vehicles.map(vehicle => ({
    ...vehicle,
    lastMaintenance: vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance) : null,
    nextMaintenance: vehicle.nextMaintenance ? new Date(vehicle.nextMaintenance) : null,
    createdAt: new Date(vehicle.createdAt),
    updatedAt: new Date(vehicle.updatedAt),
    location: {
      ...vehicle.location,
      lastUpdated: new Date(vehicle.location.lastUpdated)
    }
  }));
};

// Convert maintenance record dates
const convertMaintenanceDates = (records: any[]) => {
  return records.map(record => ({
    ...record,
    date: new Date(record.date)
  }));
};

// Convert fuel record dates
const convertFuelDates = (records: any[]) => {
  return records.map(record => ({
    ...record,
    date: new Date(record.date)
  }));
};

// Convert upcoming maintenance dates
const convertUpcomingDates = (records: any[]) => {
  return records.map(record => ({
    ...record,
    date: new Date(record.date)
  }));
};

// Extract and convert data with proper date handling
export const expandedFleetData = convertDates(fleetData);
export const maintenanceRecords = convertMaintenanceDates(maintenanceData.maintenanceRecords);
export const upcomingMaintenance = convertUpcomingDates(maintenanceData.upcomingMaintenance);
export const vehicleActivityData = maintenanceData.vehicleActivityData;
export const fuelRecords = convertFuelDates(fuelData.fuelRecords);
export const vehicleFuelData = fuelData.vehicleFuelData;
export const monthlyFuelData = fuelData.monthlyFuelData;
export const vehicleFuelConsumption = fuelData.vehicleFuelConsumption;
export const vehicleTypes = analyticsData.vehicleTypes;
export const vehicleStatus = analyticsData.vehicleStatus;
export const fuelConsumption = analyticsData.fuelConsumption;
export const monthlyMileage = analyticsData.monthlyMileage;
export const metrics = analyticsData.metrics;
export const vehicleAssignmentStats = analyticsData.vehicleAssignmentStats;
export const drivers = driversData;

// Export all data grouped by category
export default {
  fleet: {
    vehicles: expandedFleetData
  },
  maintenance: {
    records: maintenanceRecords,
    upcoming: upcomingMaintenance,
    activity: vehicleActivityData
  },
  fuel: {
    records: fuelRecords,
    vehicleData: vehicleFuelData,
    monthlyData: monthlyFuelData,
    consumption: vehicleFuelConsumption
  },
  analytics: {
    vehicleTypes,
    vehicleStatus,
    fuelConsumption,
    monthlyMileage,
    metrics,
    assignmentStats: vehicleAssignmentStats
  },
  drivers: drivers
}; 