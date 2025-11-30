import express from "express";
import ordenController from "../controllers/ordenController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/", ordenController.createOrden);
router.get("/", ordenController.getOrdenes);
// Protected route returning orders for the authenticated user
router.get("/mias", isAuthenticated, ordenController.getMisOrdenes);
// Get single order by id
router.get("/:id", ordenController.getOrdenById);

export default router;
