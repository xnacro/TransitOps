import { Router } from "express";
import ExpenseController from "../controllers/expense.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/",     ExpenseController.create);
router.get("/",      ExpenseController.findAll);
router.get("/:id",   ExpenseController.findById);
router.put("/:id",   ExpenseController.update);
router.delete("/:id", ExpenseController.delete);

export default router;
