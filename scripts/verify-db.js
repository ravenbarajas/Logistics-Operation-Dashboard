// Database verification script
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

// Load environment variables
dotenv.config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:admin123@localhost:5432/logidash',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying database tables and data...\n');
    
    // Check users table
    const usersResult = await pool.query('SELECT * FROM users');
    console.log(`✅ Found ${usersResult.rows.length} users:`);
    usersResult.rows.forEach(user => {
      console.log(`  - ${user.username} (${user.role})`);
    });
    
    // Check vehicles table
    const vehiclesResult = await pool.query('SELECT * FROM vehicles');
    console.log(`\n✅ Found ${vehiclesResult.rows.length} vehicles:`);
    vehiclesResult.rows.forEach(vehicle => {
      console.log(`  - ${vehicle.name} (${vehicle.type}, ${vehicle.status})`);
    });
    
    // Check warehouses table
    const warehousesResult = await pool.query('SELECT * FROM warehouses');
    console.log(`\n✅ Found ${warehousesResult.rows.length} warehouses:`);
    warehousesResult.rows.forEach(warehouse => {
      console.log(`  - ${warehouse.name} (Capacity: ${warehouse.capacity}, Usage: ${warehouse.current_usage})`);
    });
    
    // Check shipments table
    const shipmentsResult = await pool.query('SELECT * FROM shipments');
    console.log(`\n✅ Found ${shipmentsResult.rows.length} shipments:`);
    shipmentsResult.rows.forEach(shipment => {
      console.log(`  - ${shipment.tracking_number} (Status: ${shipment.status})`);
    });
    
    // Check inventory table
    const inventoryResult = await pool.query('SELECT i.*, w.name as warehouse_name FROM inventory i JOIN warehouses w ON i.warehouse_id = w.id');
    console.log(`\n✅ Found ${inventoryResult.rows.length} inventory items:`);
    inventoryResult.rows.forEach(item => {
      console.log(`  - ${item.item_name} (${item.quantity} ${item.unit} at ${item.warehouse_name})`);
    });
    
    // Check routes table
    const routesResult = await pool.query('SELECT * FROM routes');
    console.log(`\n✅ Found ${routesResult.rows.length} routes:`);
    routesResult.rows.forEach(route => {
      console.log(`  - Vehicle ID: ${route.vehicle_id}, Status: ${route.status}, Distance: ${route.distance}`);
    });
    
    console.log('\n🎉 Database verification completed successfully!');
  } catch (error) {
    console.error('❌ Error verifying database:', error);
  } finally {
    await pool.end();
  }
}

verifyDatabase().catch(console.error); 