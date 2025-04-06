export interface LocationData {
  lat: number;
  lng: number;
  lastUpdated: string | Date;
  address?: string;
  // Keep latitude and longitude for compatibility with MapComponent
  latitude?: number;
  longitude?: number;
}

export interface ExtendedVehicleDetails {
  location?: LocationData;
  lastService?: string | Date; 
  nextServiceDue?: string | Date;
  fuelEfficiency?: number;
  utilizationRate?: number;
  maintenanceScore?: number;
  monthlyCost?: number;
  notes?: string;
}

/**
 * Calculate the difference in days between two dates
 */
export function daysDifference(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format a date safely, handling different date formats
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return 'N/A';
  
  try {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    } else if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return String(date);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Get the maintenance status of a vehicle based on the next service date
 */
export function getMaintenanceStatus(nextServiceDue: string | Date | undefined | null): 'overdue' | 'due-soon' | 'on-schedule' {
  if (!nextServiceDue) return 'on-schedule';
  
  try {
    const serviceDate = typeof nextServiceDue === 'string' ? new Date(nextServiceDue) : nextServiceDue;
    if (!(serviceDate instanceof Date)) return 'on-schedule';
    
    const today = new Date();
    
    if (today > serviceDate) {
      return 'overdue';
    }
    
    if (daysDifference(today, serviceDate) < 7) {
      return 'due-soon';
    }
    
    return 'on-schedule';
  } catch (error) {
    return 'on-schedule';
  }
}

/**
 * Add mock vehicle detail data for testing
 */
export function addMockVehicleDetails<T extends Record<string, any>>(vehicles: T[]): (T & ExtendedVehicleDetails)[] {
  return vehicles.map(vehicle => {
    // Add random locations for some vehicles
    const hasLocation = Math.random() > 0.3; // 70% chance to have location data
    
    let locationData: LocationData | undefined = undefined;
    if (hasLocation) {
      // Generate random coordinates around a central point
      const baseLatitude = 34.0522; // Los Angeles as an example center
      const baseLongitude = -118.2437;
      const lat = baseLatitude + (Math.random() - 0.5) * 0.2;
      const lng = baseLongitude + (Math.random() - 0.5) * 0.2;
      
      locationData = {
        lat,
        lng,
        // For compatibility with MapComponent
        latitude: lat,
        longitude: lng,
        lastUpdated: new Date(Date.now() - Math.random() * 86400000 * 3), // Random time within the last 3 days
        address: `${Math.floor(Math.random() * 9000) + 1000} ${
          ['Main St', 'Broadway', 'Washington Ave', 'Park Rd', 'Industrial Blvd'][Math.floor(Math.random() * 5)]
        }, ${
          ['Los Angeles', 'Glendale', 'Pasadena', 'Long Beach', 'Santa Monica'][Math.floor(Math.random() * 5)]
        }, CA`
      };
    }
    
    return {
      ...vehicle,
      location: locationData,
      lastService: new Date(Date.now() - Math.random() * 86400000 * 30), // Random date within last 30 days
      nextServiceDue: new Date(Date.now() + Math.random() * 86400000 * 60), // Random date within next 60 days
      fuelEfficiency: Math.floor(Math.random() * 30) + 55, // Random value between 55-85%
      utilizationRate: Math.floor(Math.random() * 25) + 65, // Random value between 65-90%
      maintenanceScore: Math.floor(Math.random() * 20) + 75, // Random value between 75-95%
      monthlyCost: Math.floor(Math.random() * 500) + 300, // Random value between 300-800
      notes: Math.random() > 0.7 ? 
        ["Needs tire rotation at next service", "Check engine light came on briefly last week", "Air filter replacement recommended", "Driver reported unusual noise when braking"][Math.floor(Math.random() * 4)] 
        : undefined
    };
  });
} 