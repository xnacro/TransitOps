-- vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id                  SERIAL PRIMARY KEY,
    registration_number VARCHAR(50)  NOT NULL UNIQUE,
    make                VARCHAR(100) NOT NULL,
    model               VARCHAR(100) NOT NULL,
    year                INTEGER      NOT NULL,
    type                VARCHAR(50)  NOT NULL,
    capacity            NUMERIC(10,2) NOT NULL DEFAULT 0,
    fuel_type           VARCHAR(30)  NOT NULL DEFAULT 'Diesel',
    odometer            NUMERIC(12,2) NOT NULL DEFAULT 0,
    status              VARCHAR(20)  NOT NULL DEFAULT 'Available',
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_vehicle_status CHECK (status IN ('Available','On Trip','In Shop','Retired'))
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_reg ON vehicles(registration_number);

-- drivers
CREATE TABLE IF NOT EXISTS drivers (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20)  NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    license_number  VARCHAR(50)  NOT NULL UNIQUE,
    license_expiry  DATE         NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'Available',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_driver_status CHECK (status IN ('Available','On Trip','Suspended'))
);

CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);

-- trips
CREATE TABLE IF NOT EXISTS trips (
    id                 SERIAL PRIMARY KEY,
    source             VARCHAR(255)  NOT NULL,
    destination        VARCHAR(255)  NOT NULL,
    vehicle_id         INTEGER       NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id          INTEGER       NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
    cargo_weight       NUMERIC(10,2) NOT NULL DEFAULT 0,
    planned_distance   NUMERIC(12,2) NOT NULL DEFAULT 0,
    start_odometer     NUMERIC(12,2) NOT NULL DEFAULT 0,
    end_odometer       NUMERIC(12,2),
    distance_travelled NUMERIC(12,2),
    revenue            NUMERIC(12,2) NOT NULL DEFAULT 0,
    status             VARCHAR(20)   NOT NULL DEFAULT 'Draft',
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_trip_status CHECK (status IN ('Draft','Dispatched','Completed','Cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver ON trips(driver_id);

-- maintenance_logs
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id              SERIAL PRIMARY KEY,
    vehicle_id      INTEGER       NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    description     TEXT          NOT NULL,
    garage          VARCHAR(255)  NOT NULL,
    cost            NUMERIC(12,2) NOT NULL DEFAULT 0,
    start_date      DATE          NOT NULL DEFAULT CURRENT_DATE,
    completion_date DATE,
    status          VARCHAR(20)   NOT NULL DEFAULT 'Open',
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_maint_status CHECK (status IN ('Open','Closed'))
);

CREATE INDEX IF NOT EXISTS idx_maint_vehicle ON maintenance_logs(vehicle_id);

-- fuel_logs
CREATE TABLE IF NOT EXISTS fuel_logs (
    id              SERIAL PRIMARY KEY,
    vehicle_id      INTEGER       NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    trip_id         INTEGER       REFERENCES trips(id) ON DELETE SET NULL,
    liters          NUMERIC(10,2) NOT NULL,
    fuel_cost       NUMERIC(12,2) NOT NULL,
    fuel_station    VARCHAR(255)  NOT NULL,
    date            DATE          NOT NULL DEFAULT CURRENT_DATE,
    fuel_efficiency NUMERIC(10,2),
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fuel_vehicle ON fuel_logs(vehicle_id);

-- expenses
CREATE TABLE IF NOT EXISTS expenses (
    id          SERIAL PRIMARY KEY,
    vehicle_id  INTEGER       NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    category    VARCHAR(30)   NOT NULL,
    description TEXT,
    amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
    date        DATE          NOT NULL DEFAULT CURRENT_DATE,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_expense_cat CHECK (category IN ('Fuel','Maintenance','Parking','Insurance','Repair','Toll','Other'))
);

CREATE INDEX IF NOT EXISTS idx_expense_vehicle ON expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_expense_category ON expenses(category);
