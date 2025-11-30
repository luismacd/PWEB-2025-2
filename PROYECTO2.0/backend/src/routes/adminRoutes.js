import express from "express";
import adminController from "../controllers/adminController.js";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Protected admin summary
// Protected admin summary
router.get("/summary", isAuthenticated, isAdmin, adminController.getSummary);

// Additional admin endpoints for dashboard
router.get("/stats", isAuthenticated, isAdmin, adminController.getStats);
router.get("/users", isAuthenticated, isAdmin, adminController.getUsers);
router.get("/users/:id", isAuthenticated, isAdmin, adminController.getUserDetail);
router.put("/users/:id", isAuthenticated, isAdmin, adminController.updateUserEstado);

export default router;
