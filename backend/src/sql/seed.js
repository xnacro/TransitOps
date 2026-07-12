// ═══════════════════════════════════════════════════════════
//  TransitOps — Database Seed Script
//  Seeds: roles, admin user, 25 vehicles, 10 drivers,
//         15 trips, maintenance, fuel logs, expenses
//  Run:   node src/sql/seed.js
// ═══════════════════════════════════════════════════════════
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const hash = async (pw) => bcrypt.hash(pw, 10);

async function seed() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // ─── 1. Roles ───────────────────────────────────────────
        console.log("🔑  Seeding roles...");
        await client.query(`
            INSERT INTO roles (id, name, description) VALUES
                (1, 'fleet-manager',     'Manages vehicles, maintenance, and fleet'),
                (2, 'driver',            'Operates vehicles and completes trips'),
                (3, 'safety-officer',    'Monitors safety and compliance'),
                (4, 'financial-analyst', 'Handles fuel, expenses, and reports')
            ON CONFLICT (id) DO NOTHING
        `);

        // ─── 2. Admin User ──────────────────────────────────────
        console.log("👤  Seeding admin user...");
        const adminPw = await hash("admin123");
        await client.query(`
            INSERT INTO users (name, email, password, role_id, is_active)
            VALUES ('Admin', 'admin@transitops.com', $1, 1, true)
            ON CONFLICT (email) DO UPDATE SET password = $1
        `, [adminPw]);

        // ─── 3. Vehicles (25) ───────────────────────────────────
        console.log("🚛  Seeding 25 vehicles...");
        const vehicles = [
            ['GJ01AB1234', 'Tata', 'Ace Gold', 2023, 'Mini', 750, 'Diesel', 42300],
            ['GJ01CD5678', 'Tata', 'Ultra 1012', 2022, 'Truck', 5000, 'Diesel', 87650],
            ['GJ01EF9012', 'Ashok Leyland', 'Ecomet 1215', 2024, 'Truck', 8000, 'Diesel', 12400],
            ['GJ01GH3456', 'Mahindra', 'Bolero Pickup', 2023, 'Van', 1300, 'Diesel', 35200],
            ['GJ01IJ7890', 'Force', 'Traveller', 2021, 'Bus', 3500, 'Diesel', 98700],
            ['GJ05KL2345', 'Tata', 'LPT 1109', 2022, 'Truck', 7000, 'Diesel', 54800],
            ['GJ05MN6789', 'Eicher', 'Pro 2049', 2024, 'Truck', 4500, 'Diesel', 8900],
            ['GJ05OP1234', 'BharatBenz', '1415R', 2023, 'Truck', 9500, 'Diesel', 67200],
            ['GJ05QR5678', 'Tata', 'Intra V30', 2024, 'Mini', 1000, 'Diesel', 15600],
            ['GJ05ST9012', 'Ashok Leyland', 'Boss 1616', 2022, 'Truck', 12000, 'Diesel', 112000],
            ['MH01UV3456', 'Mahindra', 'Furio 7', 2023, 'Truck', 5500, 'Diesel', 43800],
            ['MH01WX7890', 'Tata', 'Starbus', 2021, 'Bus', 4000, 'CNG', 78500],
            ['MH04YZ2345', 'Eicher', 'Pro 3015', 2022, 'Truck', 10000, 'Diesel', 92100],
            ['MH04AB6789', 'Force', 'Citiline', 2024, 'Bus', 3200, 'Diesel', 6700],
            ['RJ14CD1234', 'Tata', 'Signa 3118', 2023, 'Truck', 18000, 'Diesel', 134500],
            ['RJ14EF5678', 'Ashok Leyland', 'Dost', 2024, 'Mini', 1250, 'Diesel', 11200],
            ['RJ14GH9012', 'BharatBenz', '1217C', 2022, 'Truck', 8500, 'Diesel', 78900],
            ['DL01IJ3456', 'Tata', 'T.7 Ultra', 2023, 'Truck', 6000, 'Diesel', 56100],
            ['DL01KL7890', 'Mahindra', 'Supro', 2024, 'Van', 800, 'Petrol', 18400],
            ['DL01MN2345', 'Eicher', 'Pro 2059XP', 2023, 'Truck', 5000, 'Diesel', 44700],
            ['GJ01NP6789', 'Tata', 'Winger', 2022, 'Van', 1500, 'Diesel', 62300],
            ['GJ01QR1234', 'Force', 'Gurkha', 2024, 'Van', 1000, 'Diesel', 9500],
            ['GJ05TU5678', 'Ashok Leyland', 'Partner', 2023, 'Truck', 4200, 'Diesel', 38700],
            ['MH01VW9012', 'BharatBenz', '914R', 2024, 'Truck', 6500, 'Diesel', 5200],
            ['MH04XY3456', 'Tata', 'Prima', 2022, 'Truck', 25000, 'Diesel', 156000],
        ];
        const statusPool = ['Available', 'Available', 'Available', 'On Trip', 'In Shop'];
        for (const [reg, make, model, year, type, cap, fuel, odo] of vehicles) {
            const status = statusPool[Math.floor(Math.random() * statusPool.length)];
            await client.query(`
                INSERT INTO vehicles (registration_number, make, model, year, type, capacity, fuel_type, odometer, status)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                ON CONFLICT (registration_number) DO NOTHING
            `, [reg, make, model, year, type, cap, fuel, odo, status]);
        }

        // ─── 4. Drivers (10) ────────────────────────────────────
        console.log("🪪  Seeding 10 drivers...");
        const drivers = [
            ['Rajesh Kumar', '9876543210', 'rajesh@transitops.in', 'GJ-DL-2023-001', '2027-03-15'],
            ['Amit Patel', '9876543211', 'amit@transitops.in', 'GJ-DL-2022-042', '2026-11-20'],
            ['Suresh Yadav', '9876543212', 'suresh@transitops.in', 'MH-DL-2024-019', '2028-01-10'],
            ['Vikram Singh', '9876543213', 'vikram@transitops.in', 'RJ-DL-2023-105', '2027-06-25'],
            ['Manoj Sharma', '9876543214', 'manoj@transitops.in', 'DL-DL-2022-078', '2026-09-30'],
            ['Deepak Gupta', '9876543215', 'deepak@transitops.in', 'GJ-DL-2024-033', '2028-04-18'],
            ['Arjun Reddy', '9876543216', 'arjun@transitops.in', 'MH-DL-2023-067', '2027-08-12'],
            ['Karan Mehta', '9876543217', 'karan@transitops.in', 'GJ-DL-2023-091', '2027-12-05'],
            ['Rohit Joshi', '9876543218', 'rohit@transitops.in', 'RJ-DL-2024-014', '2028-02-28'],
            ['Sanjay Nair', '9876543219', 'sanjay@transitops.in', 'DL-DL-2023-056', '2027-10-15'],
        ];
        const driverStatusPool = ['Available', 'Available', 'On Trip'];
        for (const [name, phone, email, lic, exp] of drivers) {
            const status = driverStatusPool[Math.floor(Math.random() * driverStatusPool.length)];
            await client.query(`
                INSERT INTO drivers (name, phone, email, license_number, license_expiry, status)
                VALUES ($1,$2,$3,$4,$5,$6)
                ON CONFLICT (email) DO NOTHING
            `, [name, phone, email, lic, exp, status]);
        }

        // Get inserted IDs
        const vRows = (await client.query("SELECT id FROM vehicles ORDER BY id LIMIT 25")).rows;
        const dRows = (await client.query("SELECT id FROM drivers ORDER BY id LIMIT 10")).rows;

        if (vRows.length === 0 || dRows.length === 0) {
            console.log("⚠️  Vehicles or drivers empty — skipping trips/logs.");
            await client.query("COMMIT");
            return;
        }

        // ─── 5. Trips (15) ──────────────────────────────────────
        console.log("🛣️  Seeding 15 trips...");
        const routes = [
            ['Gandhinagar Depot', 'Ahmedabad Warehouse', 120, 2500],
            ['Ahmedabad', 'Surat', 265, 8000],
            ['Gandhinagar', 'Rajkot', 210, 6500],
            ['Ahmedabad', 'Vadodara', 110, 3500],
            ['Surat', 'Mumbai', 280, 12000],
            ['Gandhinagar', 'Udaipur', 290, 9500],
            ['Rajkot', 'Bhavnagar', 165, 4500],
            ['Vadodara', 'Pune', 420, 15000],
            ['Ahmedabad', 'Jaipur', 680, 22000],
            ['Gandhinagar', 'Bhuj', 330, 11000],
            ['Surat', 'Nashik', 250, 7500],
            ['Ahmedabad', 'Gandhinagar Depot', 25, 800],
            ['Rajkot', 'Ahmedabad', 215, 7000],
            ['Mumbai', 'Pune', 150, 5000],
            ['Gandhinagar', 'Mount Abu', 220, 6000],
        ];
        const tripStatuses = ['Draft', 'Dispatched', 'Dispatched', 'Completed', 'Completed', 'Completed', 'Cancelled'];
        for (let i = 0; i < routes.length; i++) {
            const [src, dest, dist, rev] = routes[i];
            const vid = vRows[i % vRows.length].id;
            const did = dRows[i % dRows.length].id;
            const cargo = 500 + Math.floor(Math.random() * 4500);
            const status = tripStatuses[Math.floor(Math.random() * tripStatuses.length)];
            await client.query(`
                INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, revenue, status)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            `, [src, dest, vid, did, cargo, dist, rev, status]);
        }

        // ─── 6. Maintenance Logs (8) ────────────────────────────
        console.log("🔧  Seeding 8 maintenance logs...");
        const maintEntries = [
            ['Engine oil change + filter replacement', 'AutoFix Gandhinagar', 3500, '2026-06-10', 'Closed'],
            ['Brake pad replacement (front)', 'SpeedWheels Ahmedabad', 5200, '2026-06-15', 'Closed'],
            ['Full AC servicing', 'CoolTech Surat', 4800, '2026-06-22', 'Closed'],
            ['Tyre replacement (all 4)', 'TyreMart Rajkot', 18500, '2026-07-01', 'Closed'],
            ['Clutch plate repair', 'AutoFix Gandhinagar', 8900, '2026-07-03', 'Open'],
            ['Battery replacement', 'PowerZone Vadodara', 6200, '2026-07-05', 'Open'],
            ['Radiator flush + coolant', 'CoolTech Surat', 2800, '2026-07-08', 'Open'],
            ['Suspension overhaul', 'SpeedWheels Ahmedabad', 15000, '2026-07-10', 'Open'],
        ];
        for (let i = 0; i < maintEntries.length; i++) {
            const [desc, garage, cost, date, status] = maintEntries[i];
            const vid = vRows[i % vRows.length].id;
            await client.query(`
                INSERT INTO maintenance_logs (vehicle_id, description, garage, cost, start_date, status)
                VALUES ($1,$2,$3,$4,$5,$6)
            `, [vid, desc, garage, cost, date, status]);
        }

        // ─── 7. Fuel Logs (20) ──────────────────────────────────
        console.log("⛽  Seeding 20 fuel logs...");
        const stations = ['HP Pump Gandhinagar', 'Indian Oil Ahmedabad', 'BPCL Surat', 'HP Pump Rajkot', 'Indian Oil Vadodara', 'BPCL Mumbai'];
        for (let i = 0; i < 20; i++) {
            const vid = vRows[i % vRows.length].id;
            const liters = 30 + Math.floor(Math.random() * 120);
            const costPerLiter = 88 + Math.random() * 10;
            const fuelCost = Math.round(liters * costPerLiter);
            const station = stations[Math.floor(Math.random() * stations.length)];
            const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
            const month = String(1 + Math.floor(Math.random() * 7)).padStart(2, '0');
            await client.query(`
                INSERT INTO fuel_logs (vehicle_id, liters, fuel_cost, fuel_station, date)
                VALUES ($1,$2,$3,$4,$5)
            `, [vid, liters, fuelCost, station, `2026-${month}-${day}`]);
        }

        // ─── 8. Expenses (12) ───────────────────────────────────
        console.log("💰  Seeding 12 expenses...");
        const expEntries = [
            ['Toll', 'NH48 Ahmedabad-Surat toll', 340],
            ['Toll', 'NH8 Gandhinagar-Rajkot', 280],
            ['Parking', 'Ahmedabad warehouse parking', 150],
            ['Insurance', 'Comprehensive policy renewal Q3', 12500],
            ['Toll', 'Mumbai Eastern Express highway', 620],
            ['Parking', 'Surat GIDC parking', 100],
            ['Insurance', 'Third party renewal', 4800],
            ['Repair', 'Windshield replacement', 7200],
            ['Toll', 'NH48 return trip', 340],
            ['Other', 'Vehicle washing and cleaning', 450],
            ['Toll', 'Vadodara expressway', 420],
            ['Repair', 'Side mirror replacement', 2800],
        ];
        for (let i = 0; i < expEntries.length; i++) {
            const [cat, desc, amount] = expEntries[i];
            const vid = vRows[i % vRows.length].id;
            const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
            const month = String(1 + Math.floor(Math.random() * 7)).padStart(2, '0');
            await client.query(`
                INSERT INTO expenses (vehicle_id, category, description, amount, date)
                VALUES ($1,$2,$3,$4,$5)
            `, [vid, cat, desc, amount, `2026-${month}-${day}`]);
        }

        await client.query("COMMIT");
        console.log("\n✅  Seed complete!");
        console.log("   📧 Admin login: admin@transitops.com / admin123");
        console.log("   🚛 25 vehicles");
        console.log("   🪪 10 drivers");
        console.log("   🛣️  15 trips");
        console.log("   🔧 8 maintenance logs");
        console.log("   ⛽ 20 fuel logs");
        console.log("   💰 12 expenses\n");

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("❌  Seed failed:", err.message);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
