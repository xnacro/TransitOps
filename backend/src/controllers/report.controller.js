import ReportService from "../services/report.service.js";
import { toCSV } from "../utils/csv.js";

const REPORT_MAP = {
    "fuel-efficiency":    ReportService.fuelEfficiency,
    "fleet-utilization":  ReportService.fleetUtilization,
    "vehicle-roi":        ReportService.vehicleROI,
    "revenue":            ReportService.revenue,
    "operational-cost":   ReportService.operationalCost,
    "maintenance-cost":   ReportService.maintenanceCost,
    "expense-summary":    ReportService.expenseSummary,
    "vehicle-performance": ReportService.vehiclePerformance,
};

const handleReport = (reportKey) => {
    return async (req, res) => {
        try {
            const data = await REPORT_MAP[reportKey]();
            if (req.query.format === "csv") {
                const csv = toCSV(data);
                res.setHeader("Content-Type", "text/csv");
                res.setHeader("Content-Disposition", `attachment; filename=${reportKey}.csv`);
                return res.send(csv);
            }
            return res.status(200).json({ success: true, message: reportKey + " report", data: { report: data } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    };
};

class ReportController {
    static fuelEfficiency    = handleReport("fuel-efficiency");
    static fleetUtilization  = handleReport("fleet-utilization");
    static vehicleROI        = handleReport("vehicle-roi");
    static revenue           = handleReport("revenue");
    static operationalCost   = handleReport("operational-cost");
    static maintenanceCost   = handleReport("maintenance-cost");
    static expenseSummary    = handleReport("expense-summary");
    static vehiclePerformance = handleReport("vehicle-performance");
}

export default ReportController;
