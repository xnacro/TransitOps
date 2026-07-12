import { Router } from "express";
import FuelLogController from "../controllers/fuellog.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/",     FuelLogController.create);
router.get("/",      FuelLogController.findAll);
router.get("/:id",   FuelLogController.findById);
router.delete("/:id", FuelLogController.delete);

export default router;
