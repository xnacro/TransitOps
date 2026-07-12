import { Router } from "express";
import TripController from "../controllers/trip.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/",              TripController.create);
router.get("/",               TripController.findAll);
router.get("/:id",            TripController.findById);
router.put("/:id",            TripController.update);
router.patch("/:id/dispatch", TripController.dispatch);
router.patch("/:id/complete", TripController.complete);
router.patch("/:id/cancel",   TripController.cancel);

export default router;