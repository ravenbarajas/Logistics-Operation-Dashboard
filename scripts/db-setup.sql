-- Create tables for different entities

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    current_location JSONB,
    last_maintenance TIMESTAMP,
    next_maintenance TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location JSONB,
    capacity INTEGER NOT NULL,
    current_usage INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit VARCHAR(20),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
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
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
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
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_vehicle_id ON shipments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_id ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_routes_vehicle_id ON routes(vehicle_id);

-- Function to update the modified timestamp
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_modified_column') THEN
        CREATE FUNCTION update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    END IF;
END
$$;

-- Create triggers for each table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_modtime') THEN
        CREATE TRIGGER update_users_modtime
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vehicles_modtime') THEN
        CREATE TRIGGER update_vehicles_modtime
            BEFORE UPDATE ON vehicles
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_warehouses_modtime') THEN
        CREATE TRIGGER update_warehouses_modtime
            BEFORE UPDATE ON warehouses
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_shipments_modtime') THEN
        CREATE TRIGGER update_shipments_modtime
            BEFORE UPDATE ON shipments
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_routes_modtime') THEN
        CREATE TRIGGER update_routes_modtime
            BEFORE UPDATE ON routes
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
    END IF;
END
$$;

-- Insert sample data only if it doesn't exist
DO $$
BEGIN
    -- Sample users
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin') THEN
        INSERT INTO users (username, password, email, role) VALUES
        ('admin', '$2b$10$X.DpM4Euef5F7v8hm32J2.YtxBX5N0VAQuD6OXdSYWYA/zpbBOfrm', 'admin@logidash.com', 'admin');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'manager') THEN
        INSERT INTO users (username, password, email, role) VALUES
        ('manager', '$2b$10$X.DpM4Euef5F7v8hm32J2.YtxBX5N0VAQuD6OXdSYWYA/zpbBOfrm', 'manager@logidash.com', 'manager');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'user') THEN
        INSERT INTO users (username, password, email, role) VALUES
        ('user', '$2b$10$X.DpM4Euef5F7v8hm32J2.YtxBX5N0VAQuD6OXdSYWYA/zpbBOfrm', 'user@logidash.com', 'user');
    END IF;

    -- Sample vehicles
    IF NOT EXISTS (SELECT 1 FROM vehicles WHERE name = 'Truck-001') THEN
        INSERT INTO vehicles (name, type, status, current_location, last_maintenance, next_maintenance) VALUES
        ('Truck-001', 'Truck', 'active', '{"lat": 40.7128, "lng": -74.0060}', '2023-10-15', '2024-01-15');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM vehicles WHERE name = 'Van-001') THEN
        INSERT INTO vehicles (name, type, status, current_location, last_maintenance, next_maintenance) VALUES
        ('Van-001', 'Van', 'maintenance', '{"lat": 34.0522, "lng": -118.2437}', '2023-11-10', '2024-02-10');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM vehicles WHERE name = 'Truck-002') THEN
        INSERT INTO vehicles (name, type, status, current_location, last_maintenance, next_maintenance) VALUES
        ('Truck-002', 'Truck', 'active', '{"lat": 41.8781, "lng": -87.6298}', '2023-09-20', '2024-03-20');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM vehicles WHERE name = 'Van-002') THEN
        INSERT INTO vehicles (name, type, status, current_location, last_maintenance, next_maintenance) VALUES
        ('Van-002', 'Van', 'inactive', '{"lat": 37.7749, "lng": -122.4194}', '2023-12-05', '2024-04-05');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM vehicles WHERE name = 'Truck-003') THEN
        INSERT INTO vehicles (name, type, status, current_location, last_maintenance, next_maintenance) VALUES
        ('Truck-003', 'Truck', 'active', '{"lat": 29.7604, "lng": -95.3698}', '2023-08-25', '2024-02-25');
    END IF;

    -- Sample warehouses
    IF NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'New York Warehouse') THEN
        INSERT INTO warehouses (name, location, capacity, current_usage, status) VALUES
        ('New York Warehouse', '{"lat": 40.7128, "lng": -74.0060}', 10000, 6500, 'active');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Los Angeles Warehouse') THEN
        INSERT INTO warehouses (name, location, capacity, current_usage, status) VALUES
        ('Los Angeles Warehouse', '{"lat": 34.0522, "lng": -118.2437}', 15000, 9000, 'active');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Chicago Warehouse') THEN
        INSERT INTO warehouses (name, location, capacity, current_usage, status) VALUES
        ('Chicago Warehouse', '{"lat": 41.8781, "lng": -87.6298}', 8000, 4000, 'active');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Houston Warehouse') THEN
        INSERT INTO warehouses (name, location, capacity, current_usage, status) VALUES
        ('Houston Warehouse', '{"lat": 29.7604, "lng": -95.3698}', 12000, 10000, 'full');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Miami Warehouse') THEN
        INSERT INTO warehouses (name, location, capacity, current_usage, status) VALUES
        ('Miami Warehouse', '{"lat": 25.7617, "lng": -80.1918}', 9000, 2000, 'active');
    END IF;

    -- Sample shipments
    IF NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'TRK-12345') THEN
        INSERT INTO shipments (tracking_number, status, origin_location, destination_location, estimated_delivery, vehicle_id) VALUES
        ('TRK-12345', 'in_transit', '{"lat": 40.7128, "lng": -74.0060}', '{"lat": 34.0522, "lng": -118.2437}', '2024-04-15', 1);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'TRK-23456') THEN
        INSERT INTO shipments (tracking_number, status, origin_location, destination_location, estimated_delivery, vehicle_id) VALUES
        ('TRK-23456', 'pending', '{"lat": 34.0522, "lng": -118.2437}', '{"lat": 41.8781, "lng": -87.6298}', '2024-04-18', NULL);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'TRK-34567') THEN
        INSERT INTO shipments (tracking_number, status, origin_location, destination_location, estimated_delivery, vehicle_id) VALUES
        ('TRK-34567', 'delivered', '{"lat": 41.8781, "lng": -87.6298}', '{"lat": 29.7604, "lng": -95.3698}', '2024-03-10', 3);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'TRK-45678') THEN
        INSERT INTO shipments (tracking_number, status, origin_location, destination_location, estimated_delivery, vehicle_id) VALUES
        ('TRK-45678', 'in_transit', '{"lat": 29.7604, "lng": -95.3698}', '{"lat": 25.7617, "lng": -80.1918}', '2024-04-20', 1);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'TRK-56789') THEN
        INSERT INTO shipments (tracking_number, status, origin_location, destination_location, estimated_delivery, vehicle_id) VALUES
        ('TRK-56789', 'cancelled', '{"lat": 25.7617, "lng": -80.1918}', '{"lat": 40.7128, "lng": -74.0060}', '2024-03-25', NULL);
    END IF;

    -- Sample inventory
    IF NOT EXISTS (SELECT 1 FROM inventory WHERE warehouse_id = 1 AND item_name = 'Paper') THEN
        INSERT INTO inventory (warehouse_id, item_name, quantity, unit) VALUES
        (1, 'Paper', 500, 'boxes');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM inventory WHERE warehouse_id = 1 AND item_name = 'Electronics') THEN
        INSERT INTO inventory (warehouse_id, item_name, quantity, unit) VALUES
        (1, 'Electronics', 200, 'units');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM inventory WHERE warehouse_id = 2 AND item_name = 'Clothing') THEN
        INSERT INTO inventory (warehouse_id, item_name, quantity, unit) VALUES
        (2, 'Clothing', 1500, 'boxes');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM inventory WHERE warehouse_id = 2 AND item_name = 'Food Products') THEN
        INSERT INTO inventory (warehouse_id, item_name, quantity, unit) VALUES
        (2, 'Food Products', 800, 'pallets');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM inventory WHERE warehouse_id = 3 AND item_name = 'Medical Supplies') THEN
        INSERT INTO inventory (warehouse_id, item_name, quantity, unit) VALUES
        (3, 'Medical Supplies', 300, 'boxes');
    END IF;

    -- Sample routes
    IF NOT EXISTS (SELECT 1 FROM routes WHERE vehicle_id = 1 AND distance = 4500) THEN
        INSERT INTO routes (vehicle_id, start_location, end_location, status, distance, estimated_duration, actual_duration) VALUES
        (1, '{"lat": 40.7128, "lng": -74.0060}', '{"lat": 34.0522, "lng": -118.2437}', 'active', 4500, 2880, NULL);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM routes WHERE vehicle_id = 3 AND distance = 1800) THEN
        INSERT INTO routes (vehicle_id, start_location, end_location, status, distance, estimated_duration, actual_duration) VALUES
        (3, '{"lat": 41.8781, "lng": -87.6298}', '{"lat": 29.7604, "lng": -95.3698}', 'completed', 1800, 960, 950);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM routes WHERE vehicle_id = 1 AND distance = 1600) THEN
        INSERT INTO routes (vehicle_id, start_location, end_location, status, distance, estimated_duration, actual_duration) VALUES
        (1, '{"lat": 29.7604, "lng": -95.3698}', '{"lat": 25.7617, "lng": -80.1918}', 'active', 1600, 840, NULL);
    END IF;
END
$$; 