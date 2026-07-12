import { Router } from "express";
import VehicleController from "../controllers/vehicle.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/",     VehicleController.create);
router.get("/",      VehicleController.findAll);
router.get("/:id",   VehicleController.findById);
router.put("/:id",   VehicleController.update);
router.delete("/:id", VehicleController.delete);

export default router;
