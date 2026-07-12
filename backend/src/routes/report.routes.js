import { Router } from "express";
import ReportController from "../controllers/report.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/fuel-efficiency",    ReportController.fuelEfficiency);
router.get("/fleet-utilization",  ReportController.fleetUtilization);
router.get("/vehicle-roi",        ReportController.vehicleROI);
router.get("/revenue",            ReportController.revenue);
router.get("/operational-cost",   ReportController.operationalCost);
router.get("/maintenance-cost",   ReportController.maintenanceCost);
router.get("/expense-summary",    ReportController.expenseSummary);
router.get("/vehicle-performance", ReportController.vehiclePerformance);

export default router;
