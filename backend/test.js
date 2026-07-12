import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const BASE = "http://localhost:5000/api";
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "arjun@transitops.io", password: "Str0ngP@ss!" }),
});
const loginData = await loginRes.json();
const TOKEN = loginData.data.token;
const AUTH = { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" };

const api = async (method, path, body) => {
    const opts = { method, headers: AUTH };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${BASE}${path}`, opts);
    return res.json();
};

let pass = 0, fail = 0;
const test = (name, condition) => {
    if (condition) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.log(`  ✗ ${name}`); }
};

console.log("\n=== VEHICLE CRUD ===");
const v1 = await api("POST", "/vehicles", { registration_number: "MH-12-AB-1234", make: "Tata", model: "Prima", year: 2023, type: "Truck", capacity: 10000, fuel_type: "Diesel" });
test("Create vehicle", v1.success && v1.data.vehicle.id);
const vid = v1.data.vehicle.id;

const v2 = await api("GET", `/vehicles/${vid}`);
test("Get vehicle by ID", v2.success && v2.data.vehicle.registration_number === "MH-12-AB-1234");

const v3 = await api("PUT", `/vehicles/${vid}`, { make: "Tata Motors" });
test("Update vehicle", v3.success && v3.data.vehicle.make === "Tata Motors");

const vDup = await api("POST", "/vehicles", { registration_number: "MH-12-AB-1234", make: "Tata", model: "Prima", year: 2023, type: "Truck", capacity: 5000 });
test("Reject duplicate reg number", !vDup.success);

const vList = await api("GET", "/vehicles");
test("List vehicles", vList.success && vList.data.vehicles.length > 0);

console.log("\n=== DRIVER CRUD ===");
const d1 = await api("POST", "/drivers", { name: "Ravi Kumar", phone: "9876543210", email: "ravi@test.com", license_number: "DL-123456", license_expiry: "2027-12-31" });
test("Create driver", d1.success && d1.data.driver.id);
const did = d1.data.driver.id;

const dDup = await api("POST", "/drivers", { name: "Dup", phone: "1234", email: "ravi@test.com", license_number: "DL-999", license_expiry: "2027-12-31" });
test("Reject duplicate email", !dDup.success);

const dList = await api("GET", "/drivers");
test("List drivers", dList.success && dList.data.drivers.length > 0);

console.log("\n=== TRIP LIFECYCLE ===");
const t1 = await api("POST", "/trips", { source: "Mumbai", destination: "Pune", vehicle_id: vid, driver_id: did, cargo_weight: 5000, planned_distance: 150 });
test("Create draft trip", t1.success && t1.data.trip.status === "Draft");
const tid = t1.data.trip.id;

const tOverweight = await api("POST", "/trips", { source: "A", destination: "B", vehicle_id: vid, driver_id: did, cargo_weight: 99999, planned_distance: 100 });
test("Reject overweight cargo", !tOverweight.success);

const tDisp = await api("PATCH", `/trips/${tid}/dispatch`);
test("Dispatch trip", tDisp.success && tDisp.data.trip.status === "Dispatched");

const vOnTrip = await api("GET", `/vehicles/${vid}`);
test("Vehicle status → On Trip", vOnTrip.data.vehicle.status === "On Trip");

const dOnTrip = await api("GET", `/drivers/${did}`);
test("Driver status → On Trip", dOnTrip.data.driver.status === "On Trip");

const tBusy = await api("POST", "/trips", { source: "X", destination: "Y", vehicle_id: vid, driver_id: did, cargo_weight: 100, planned_distance: 50 });
test("Reject busy vehicle/driver", !tBusy.success);

const tComp = await api("PATCH", `/trips/${tid}/complete`, { end_odometer: 150 });
test("Complete trip", tComp.success && tComp.data.trip.status === "Completed");

const vBack = await api("GET", `/vehicles/${vid}`);
test("Vehicle status → Available", vBack.data.vehicle.status === "Available");
test("Vehicle odometer updated", Number(vBack.data.vehicle.odometer) === 150);

console.log("\n=== MAINTENANCE ===");
const m1 = await api("POST", "/maintenance", { vehicle_id: vid, description: "Oil change", garage: "AutoCare", cost: 5000 });
test("Create maintenance", m1.success);
const mid = m1.data.maintenance.id;

const vShop = await api("GET", `/vehicles/${vid}`);
test("Vehicle status → In Shop", vShop.data.vehicle.status === "In Shop");

const tMaint = await api("POST", "/trips", { source: "A", destination: "B", vehicle_id: vid, driver_id: did, cargo_weight: 100, planned_distance: 50 });
test("Reject trip for vehicle in shop", !tMaint.success);

const mClose = await api("PATCH", `/maintenance/${mid}/close`);
test("Close maintenance", mClose.success && mClose.data.maintenance.status === "Closed");

const vAvail = await api("GET", `/vehicles/${vid}`);
test("Vehicle status → Available after close", vAvail.data.vehicle.status === "Available");

console.log("\n=== FUEL LOG ===");
const f1 = await api("POST", "/fuel-logs", { vehicle_id: vid, trip_id: tid, liters: 20, fuel_cost: 1800, fuel_station: "HP Fuel" });
test("Create fuel log", f1.success);
test("Auto-calc fuel efficiency", f1.data.fuel_log.fuel_efficiency !== null);

console.log("\n=== EXPENSE ===");
const e1 = await api("POST", "/expenses", { vehicle_id: vid, category: "Toll", amount: 500, description: "Mumbai-Pune Toll" });
test("Create expense", e1.success);

const eBad = await api("POST", "/expenses", { vehicle_id: vid, category: "Invalid", amount: 100 });
test("Reject invalid category", !eBad.success);

console.log("\n=== DASHBOARD ===");
const dash = await api("GET", "/dashboard/stats");
test("Dashboard returns stats", dash.success && dash.data.vehicles && dash.data.drivers && dash.data.trips);
test("Fleet utilization is number", typeof dash.data.fleet_utilization === "number");

console.log("\n=== REPORTS ===");
const endpoints = ["fuel-efficiency", "fleet-utilization", "vehicle-roi", "revenue", "operational-cost", "maintenance-cost", "expense-summary", "vehicle-performance"];
for (const ep of endpoints) {
    const r = await api("GET", `/reports/${ep}`);
    test(`Report: ${ep}`, r.success && Array.isArray(r.data.report));
}

console.log("\n=== EXPIRED LICENSE TEST ===");
const expiredDriver = await api("POST", "/drivers", { name: "Expired", phone: "000", email: "expired@test.com", license_number: "EXP-001", license_expiry: "2020-01-01" });
const expTid = await api("POST", "/trips", { source: "A", destination: "B", vehicle_id: vid, driver_id: expiredDriver.data.driver.id, cargo_weight: 100, planned_distance: 50 });
test("Reject expired license driver", !expTid.success);

console.log("\n=== SUSPENDED DRIVER TEST ===");
await api("PUT", `/drivers/${expiredDriver.data.driver.id}`, { status: "Suspended" });
const susTid = await api("POST", "/trips", { source: "A", destination: "B", vehicle_id: vid, driver_id: expiredDriver.data.driver.id, cargo_weight: 100, planned_distance: 50 });
test("Reject suspended driver", !susTid.success);

// cleanup
await pool.query("DELETE FROM fuel_logs");
await pool.query("DELETE FROM expenses");
await pool.query("DELETE FROM maintenance_logs");
await pool.query("DELETE FROM trips");
await pool.query("DELETE FROM drivers");
await pool.query("DELETE FROM vehicles");
await pool.end();

console.log(`\n=== RESULTS: ${pass} passed, ${fail} failed out of ${pass + fail} ===\n`);
process.exit(fail > 0 ? 1 : 0);
