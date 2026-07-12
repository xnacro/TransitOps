import Expense from "../models/expense.model.js";
import Vehicle from "../models/vehicle.model.js";
import { validateExpense } from "../validators/expense.validator.js";

class ExpenseController {

    static async create(req, res) {
        try {
            const errors = validateExpense(req.body);
            if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation failed", errors });

            const vehicle = await Vehicle.findById(req.body.vehicle_id);
            if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found", errors: [] });

            const expense = await Expense.create(req.body);
            return res.status(201).json({ success: true, message: "Expense created", data: { expense } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findAll(req, res) {
        try {
            const expenses = await Expense.findAll();
            return res.status(200).json({ success: true, message: "Expenses retrieved", data: { expenses } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findById(req, res) {
        try {
            const expense = await Expense.findById(req.params.id);
            if (!expense) return res.status(404).json({ success: false, message: "Expense not found", errors: [] });
            return res.status(200).json({ success: true, message: "Expense retrieved", data: { expense } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async update(req, res) {
        try {
            const existing = await Expense.findById(req.params.id);
            if (!existing) return res.status(404).json({ success: false, message: "Expense not found", errors: [] });
            const expense = await Expense.update(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Expense updated", data: { expense } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async delete(req, res) {
        try {
            const existing = await Expense.findById(req.params.id);
            if (!existing) return res.status(404).json({ success: false, message: "Expense not found", errors: [] });
            await Expense.delete(req.params.id);
            return res.status(200).json({ success: true, message: "Expense deleted", data: null });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }
}

export default ExpenseController;
