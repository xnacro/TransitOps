import express from "express";
import dotenv from "dotenv";
import pool from "./src/config/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL Connected");
    console.log(result.rows[0]);
} catch (err) {
    console.error("Database Connection Failed");
    console.error(err.message);
}

app.get("/", (req, res) => {
    res.send("Hello World! from TransitOps Backend");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});