// Manual database setup script
import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// PostgreSQL connection details
const dbConfig = {
  user: 'postgres',
  password: 'admin123',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
};

const targetDbName = 'logidash';

// Define the table creation queries separately
const tableQueries = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    current_location JSONB,
    last_maintenance TIMESTAMP,
    next_maintenance TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location JSONB,
    capacity INTEGER NOT NULL,
    current_usage INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit VARCHAR(20),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL,
    origin_location JSONB,
    destination_location JSONB,
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    vehicle_id INTEGER REFERENCES vehicles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    start_location JSONB,
    end_location JSONB,
    status VARCHAR(20),
    distance NUMERIC,
    estimated_duration INTEGER,
    actual_duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`
];

// Define index creation
const indexQueries = [
  `CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status)`,
  `CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status)`,
  `CREATE INDEX IF NOT EXISTS idx_shipments_vehicle_id ON shipments(vehicle_id)`,
  `CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_id ON inventory(warehouse_id)`,
  `CREATE INDEX IF NOT EXISTS idx_routes_vehicle_id ON routes(vehicle_id)`
];

// Function to execute each query and handle errors
async function executeQuery(pool, query, description) {
  try {
    await pool.query(query);
    console.log(`✅ ${description} successful`);
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`ℹ️ ${description} - ${error.message} (continuing)`);
      return true;
    } else {
      console.error(`❌ Error in ${description}:`, error);
      return false;
    }
  }
}

async function setupDatabase() {
  console.log('Starting manual database setup...');
  
  // Connect to PostgreSQL
  let pool = new Pool(dbConfig);
  
  try {
    // 1. Create database if it doesn't exist
    console.log(`Checking if database '${targetDbName}' exists...`);
    const dbCheckResult = await pool.query(`
      SELECT EXISTS(
        SELECT 1 FROM pg_database WHERE datname = $1
      ) as exists
    `, [targetDbName]);
    
    const dbExists = dbCheckResult.rows[0].exists;
    
    if (!dbExists) {
      console.log(`Creating database '${targetDbName}'...`);
      await pool.query(`CREATE DATABASE ${targetDbName}`);
      console.log(`Database '${targetDbName}' created.`);
    } else {
      console.log(`Database '${targetDbName}' already exists.`);
    }
    
    // Close connection to postgres database
    await pool.end();
    
    // 2. Connect to the target database
    console.log(`Connecting to '${targetDbName}' database...`);
    const targetDbConfig = { ...dbConfig, database: targetDbName };
    pool = new Pool(targetDbConfig);
    
    // 3. Create tables
    console.log('\nCreating tables...');
    for (const [index, query] of tableQueries.entries()) {
      await executeQuery(pool, query, `Table ${index + 1} creation`);
    }
    
    // 4. Create indexes
    console.log('\nCreating indexes...');
    for (const [index, query] of indexQueries.entries()) {
      await executeQuery(pool, query, `Index ${index + 1} creation`);
    }
    
    // 5. Create trigger function
    console.log('\nCreating update timestamp function...');
    const triggerFunctionQuery = `
    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `;
    await executeQuery(pool, triggerFunctionQuery, 'Trigger function creation');
    
    // 6. Create triggers
    console.log('\nCreating triggers...');
    const triggerQueries = [
      `DROP TRIGGER IF EXISTS update_users_modtime ON users;
       CREATE TRIGGER update_users_modtime
       BEFORE UPDATE ON users
       FOR EACH ROW
       EXECUTE FUNCTION update_modified_column()`,
       
      `DROP TRIGGER IF EXISTS update_vehicles_modtime ON vehicles;
       CREATE TRIGGER update_vehicles_modtime
       BEFORE UPDATE ON vehicles
       FOR EACH ROW
       EXECUTE FUNCTION update_modified_column()`,
       
      `DROP TRIGGER IF EXISTS update_warehouses_modtime ON warehouses;
       CREATE TRIGGER update_warehouses_modtime
       BEFORE UPDATE ON warehouses
       FOR EACH ROW
       EXECUTE FUNCTION update_modified_column()`,
       
      `DROP TRIGGER IF EXISTS update_shipments_modtime ON shipments;
       CREATE TRIGGER update_shipments_modtime
       BEFORE UPDATE ON shipments
       FOR EACH ROW
       EXECUTE FUNCTION update_modified_column()`,
       
      `DROP TRIGGER IF EXISTS update_routes_modtime ON routes;
       CREATE TRIGGER update_routes_modtime
       BEFORE UPDATE ON routes
       FOR EACH ROW
       EXECUTE FUNCTION update_modified_column()`
    ];
    
    for (const [index, query] of triggerQueries.entries()) {
      await executeQuery(pool, query, `Trigger ${index + 1} creation`);
    }
    
    // 7. Insert sample data
    console.log('\nInserting sample data...');
    
    // Sample users
    const userQueries = [
      `INSERT INTO users (username, password, email, role)
       SELECT 'admin', '$2b$10$X.DpM4Euef5F7v8hm32J2.YtxBX5N0VAQuD6OXdSYWYA/zpbBOfrm', 'admin@logidash.com', 'admin'
       WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`,
       
      `INSERT INTO users (username, password, email, role)
       SELECT 'manager', '$2b$10$X.DpM4Euef5F7v8hm32J2.YtxBX5N0VAQuD6OXdSYWYA/zpbBOfrm', 'manager@logidash.com', 'manager'
       WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'manager')`,
       
      `INSERT INTO users (username, password, email, role)
       SELECT 'user', '$2b$10$X.DpM4Euef5F7v8hm32J2.YtxBX5N0VAQuD6OXdSYWYA/zpbBOfrm', 'user@logidash.com', 'user'
       WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user')`
    ];
    
    for (const [index, query] of userQueries.entries()) {
      await executeQuery(pool, query, `User ${index + 1} insertion`);
    }
    
    // Sample vehicles
    const vehicleQueries = [
      `INSERT INTO vehicles (name, type, status, current_location, last_maintenance, next_maintenance)
       SELECT 'Truck-001', 'Truck', 'active', '{"lat": 40.7128, "lng": -74.0060}', '2023-10-15', '2024-01-15'
       WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE name = 'Truck-001')`,
       
      `INSERT INTO vehicles (name, type, status, current_location, last_maintenance, next_maintenance)
       SELECT 'Van-001', 'Van', 'maintenance', '{"lat": 34.0522, "lng": -118.2437}', '2023-11-10', '2024-02-10'
       WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE name = 'Van-001')`,
       
      `INSERT INTO vehicles (name, type, status, current_location, last_maintenance, next_maintenance)
       SELECT 'Truck-002', 'Truck', 'active', '{"lat": 41.8781, "lng": -87.6298}', '2023-09-20', '2024-03-20'
       WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE name = 'Truck-002')`
    ];
    
    for (const [index, query] of vehicleQueries.entries()) {
      await executeQuery(pool, query, `Vehicle ${index + 1} insertion`);
    }
    
    // Sample warehouses
    console.log('\nInserting warehouses...');
    const warehouseQueries = [
      `INSERT INTO warehouses (name, location, capacity, current_usage, status)
       SELECT 'New York Warehouse', '{"lat": 40.7128, "lng": -74.0060}', 10000, 6500, 'active'
       WHERE NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'New York Warehouse')`,
       
      `INSERT INTO warehouses (name, location, capacity, current_usage, status)
       SELECT 'Los Angeles Warehouse', '{"lat": 34.0522, "lng": -118.2437}', 15000, 9000, 'active'
       WHERE NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Los Angeles Warehouse')`,
       
      `INSERT INTO warehouses (name, location, capacity, current_usage, status)
       SELECT 'Chicago Warehouse', '{"lat": 41.8781, "lng": -87.6298}', 8000, 4000, 'active'
       WHERE NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Chicago Warehouse')`
    ];
    
    for (const [index, query] of warehouseQueries.entries()) {
      await executeQuery(pool, query, `Warehouse ${index + 1} insertion`);
    }
    
    // Sample inventory items (after warehouses are created)
    console.log('\nInserting inventory items...');
    const inventoryQueries = [
      `INSERT INTO inventory (warehouse_id, item_name, quantity, unit)
       SELECT 1, 'Paper', 500, 'boxes'
       WHERE EXISTS (SELECT 1 FROM warehouses WHERE id = 1) 
       AND NOT EXISTS (SELECT 1 FROM inventory WHERE warehouse_id = 1 AND item_name = 'Paper')`,
       
      `INSERT INTO inventory (warehouse_id, item_name, quantity, unit)
       SELECT 1, 'Electronics', 200, 'units'
       WHERE EXISTS (SELECT 1 FROM warehouses WHERE id = 1)
       AND NOT EXISTS (SELECT 1 FROM inventory WHERE warehouse_id = 1 AND item_name = 'Electronics')`,
       
      `INSERT INTO inventory (warehouse_id, item_name, quantity, unit)
       SELECT 2, 'Clothing', 1500, 'boxes'
       WHERE EXISTS (SELECT 1 FROM warehouses WHERE id = 2)
       AND NOT EXISTS (SELECT 1 FROM inventory WHERE warehouse_id = 2 AND item_name = 'Clothing')`,
       
      `INSERT INTO inventory (warehouse_id, item_name, quantity, unit)
       SELECT 3, 'Medical Supplies', 300, 'boxes'
       WHERE EXISTS (SELECT 1 FROM warehouses WHERE id = 3)
       AND NOT EXISTS (SELECT 1 FROM inventory WHERE warehouse_id = 3 AND item_name = 'Medical Supplies')`
    ];
    
    for (const [index, query] of inventoryQueries.entries()) {
      await executeQuery(pool, query, `Inventory ${index + 1} insertion`);
    }
    
    // Sample shipments
    console.log('\nInserting shipments...');
    const shipmentQueries = [
      `INSERT INTO shipments (tracking_number, status, origin_location, destination_location, estimated_delivery, vehicle_id)
       SELECT 'TRK-12345', 'in_transit', '{"lat": 40.7128, "lng": -74.0060}', '{"lat": 34.0522, "lng": -118.2437}', '2024-04-15', 1
       WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'TRK-12345')`,
       
      `INSERT INTO shipments (tracking_number, status, origin_location, destination_location, estimated_delivery, vehicle_id)
       SELECT 'TRK-23456', 'pending', '{"lat": 34.0522, "lng": -118.2437}', '{"lat": 41.8781, "lng": -87.6298}', '2024-04-18', NULL
       WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'TRK-23456')`,
       
      `INSERT INTO shipments (tracking_number, status, origin_location, destination_location, estimated_delivery, actual_delivery, vehicle_id)
       SELECT 'TRK-34567', 'delivered', '{"lat": 41.8781, "lng": -87.6298}', '{"lat": 29.7604, "lng": -95.3698}', '2024-03-10', '2024-03-09', 2
       WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'TRK-34567')`
    ];
    
    for (const [index, query] of shipmentQueries.entries()) {
      await executeQuery(pool, query, `Shipment ${index + 1} insertion`);
    }
    
    // Sample routes
    console.log('\nInserting routes...');
    const routeQueries = [
      `INSERT INTO routes (vehicle_id, start_location, end_location, status, distance, estimated_duration)
       SELECT 1, '{"lat": 40.7128, "lng": -74.0060}', '{"lat": 34.0522, "lng": -118.2437}', 'active', 4500, 2880
       WHERE NOT EXISTS (SELECT 1 FROM routes WHERE vehicle_id = 1 AND distance = 4500)`,
       
      `INSERT INTO routes (vehicle_id, start_location, end_location, status, distance, estimated_duration, actual_duration)
       SELECT 2, '{"lat": 41.8781, "lng": -87.6298}', '{"lat": 29.7604, "lng": -95.3698}', 'completed', 1800, 960, 950
       WHERE NOT EXISTS (SELECT 1 FROM routes WHERE vehicle_id = 2 AND distance = 1800)`
    ];
    
    for (const [index, query] of routeQueries.entries()) {
      await executeQuery(pool, query, `Route ${index + 1} insertion`);
    }
    
    // 8. Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nCreated tables:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Success
    console.log('\nDatabase setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase().catch(console.error); 