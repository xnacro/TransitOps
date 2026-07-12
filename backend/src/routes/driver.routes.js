import { Router } from "express";
import DriverController from "../controllers/driver.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/",     DriverController.create);
router.get("/",      DriverController.findAll);
router.get("/:id",   DriverController.findById);
router.put("/:id",   DriverController.update);
router.delete("/:id", DriverController.delete);

export default router;
