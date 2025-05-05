# Module Configuration Guide

This guide explains how to configure your LogisticsDashboard to load different modules by default when deploying to different domains.

## Overview

The application can be configured to load a specific module by default when the user accesses the root URL. This is useful when you want to deploy the same codebase to different domains, each focused on a specific module.

## Configuration Steps

1. **Modify the default module in `client/src/config.ts`**:

   Open the `client/src/config.ts` file and change the `DEFAULT_MODULE` value to one of the available modules:

   ```typescript
   // Available options: "dashboard", "vehicles", "shipments", "customers", "suppliers", 
   // "warehouse", "orders", "routes", "reports", "analytics", "settings"
   export const DEFAULT_MODULE: ModuleType = "vehicles"; // Change this to your desired module
   ```

2. **Build and deploy the application**:

   After changing the configuration, build and deploy the application as usual.

   ```bash
   npm run build
   # Then deploy to your hosting service
   ```

## Available Modules

- `dashboard`: Main dashboard overview
- `vehicles`: Vehicle and fleet management
- `shipments`: Shipment tracking and management
- `customers`: Customer relationship management
- `suppliers`: Supplier management
- `warehouse`: Warehouse operations
- `orders`: Order management
- `routes`: Route optimization
- `reports`: Report generation
- `analytics`: Business analytics
- `settings`: System settings

## UI Adaptations Based on Module

When you change the default module, the application will automatically adapt several UI elements:

1. **Header Background**: Each module has a distinct, subtle background color in the header.
2. **Header Title**: The title will display the module name plus an "Edition" label (e.g., "Customers Edition").
3. **Search Placeholder**: The search placeholder will reflect the current module.
4. **Module-Specific Navigation**: Some modules (like Vehicles and Customers) will display additional navigation buttons in the header.

These visual cues help users understand which module they're currently viewing and provide a consistent experience across different deployments.

## Example Deployment Scenarios

1. **Fleet Management Portal** - Set `DEFAULT_MODULE` to `"vehicles"`
   - Features a green-tinted header with Fleet-specific navigation
   - Optimized for vehicle management workflows
   
2. **Customer Portal** - Set `DEFAULT_MODULE` to `"customers"`
   - Features an amber-tinted header with Customer-specific navigation
   - Focused on customer relationship management
   
3. **Shipping Portal** - Set `DEFAULT_MODULE` to `"shipments"`
   - Features a purple-tinted header
   - Streamlined for shipment tracking and management
   
4. **Admin Portal** - Keep `DEFAULT_MODULE` as `"dashboard"`
   - Features a blue-tinted header
   - Provides access to all modules

## Note on Standalone Mode

When using modules in standalone mode, the sidebar is hidden for cleaner interface. This is handled automatically by the application based on the routes defined in `STANDALONE_ROUTES` in `App.tsx`. 