import { Router } from "express";
import MaintenanceController from "../controllers/maintenance.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/",            MaintenanceController.create);
router.get("/",             MaintenanceController.findAll);
router.get("/:id",          MaintenanceController.findById);
router.put("/:id",          MaintenanceController.update);
router.patch("/:id/close",  MaintenanceController.close);
router.delete("/:id",       MaintenanceController.delete);

export default router;
