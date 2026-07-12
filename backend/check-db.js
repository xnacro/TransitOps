import pool from "./src/config/db.js";

async function checkDatabase() {
    try {
        console.log("Checking database connection and tables...");
        
        // Check tables
        const tablesRes = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        console.log("\n--- Public Tables ---");
        tablesRes.rows.forEach(r => console.log(` - ${r.table_name}`));
        
        // Count rows in vehicles
        const vehiclesRes = await pool.query("SELECT COUNT(*) FROM vehicles;");
        console.log(`\nVehicles Count: ${vehiclesRes.rows[0].count}`);
        
        if (parseInt(vehiclesRes.rows[0].count) > 0) {
            const vehicles = await pool.query("SELECT id, registration_number, make, model, status FROM vehicles LIMIT 5;");
            console.log("\n--- Sample Vehicles ---");
            vehicles.rows.forEach(v => {
                console.log(`ID: ${v.id} | Reg: ${v.registration_number} | ${v.make} ${v.model} | Status: ${v.status}`);
            });
        } else {
            console.log("\nNo vehicles found in the 'vehicles' table.");
        }

        // Count rows in drivers
        const driversRes = await pool.query("SELECT COUNT(*) FROM drivers;");
        console.log(`Drivers Count: ${driversRes.rows[0].count}`);
        
        // Count rows in users
        const usersRes = await pool.query("SELECT COUNT(*) FROM users;");
        console.log(`Users Count: ${usersRes.rows[0].count}`);

    } catch (err) {
        console.error("Database query failed:", err.message);
    } finally {
        await pool.end();
    }
}

checkDatabase();
