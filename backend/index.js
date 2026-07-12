import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import vehicleRoutes from "./src/routes/vehicle.routes.js";
import driverRoutes from "./src/routes/driver.routes.js";
import tripRoutes from "./src/routes/trip.routes.js";
import maintenanceRoutes from "./src/routes/maintenance.routes.js";
import fuelLogRoutes from "./src/routes/fuellog.routes.js";
import expenseRoutes from "./src/routes/expense.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import reportRoutes from "./src/routes/report.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/fuel-logs", fuelLogRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
    res.send("Hello World! from TransitOps Backend");
});

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

const startServer = async () => {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("PostgreSQL connected at", result.rows[0].now);
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

startServer();