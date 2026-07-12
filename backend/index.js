import express from "express";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

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