import DashboardService from "../services/dashboard.service.js";

class DashboardController {

    static async getStats(req, res) {
        try {
            const stats = await DashboardService.getStats();
            return res.status(200).json({ success: true, message: "Dashboard stats retrieved", data: stats });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }
}
export default DashboardController;
