import pool from "./src/config/db.js";

async function seedDatabase() {
    try {
        console.log("Seeding database with sample vehicles and drivers...");

        // Insert sample vehicles
        const vehicleQuery = `
            INSERT INTO vehicles (registration_number, make, model, year, type, capacity, fuel_type, odometer, status)
            VALUES 
                ('GJO1UB4521', 'Ford', 'Transit', 2022, 'Van', 500.00, 'Diesel', 74000.00, 'Available'),
                ('GJO1UB9981', 'Volvo', 'FH16', 2020, 'Truck', 5000.00, 'Diesel', 182000.00, 'On Trip'),
                ('GJO1UB1120', 'Suzuki', 'Mini-03', 2023, 'Mini', 1000.00, 'Petrol', 66000.00, 'In Shop')
            ON CONFLICT (registration_number) DO NOTHING;
        `;
        const vRes = await pool.query(vehicleQuery);
        console.log("Vehicles seeded successfully.");

        // Insert sample drivers
        const driverQuery = `
            INSERT INTO drivers (name, phone, email, license_number, license_expiry, status)
            VALUES 
                ('Alex Johnson', '9876543210', 'alex@transitops.com', 'DL-A-12345', '2026-10-15', 'Available'),
                ('Maria Garcia', '9876543211', 'maria@transitops.com', 'DL-B-67890', '2027-02-20', 'On Trip'),
                ('Linda Chen', '9876543213', 'linda@transitops.com', 'DL-A-22222', '2026-05-11', 'Available')
            ON CONFLICT (email) DO NOTHING;
        `;
        const dRes = await pool.query(driverQuery);
        console.log("Drivers seeded successfully.");

    } catch (err) {
        console.error("Seeding failed:", err.message);
    } finally {
        await pool.end();
    }
}

seedDatabase();
