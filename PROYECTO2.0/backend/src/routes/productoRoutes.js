import express from "express";
import productoController from "../controllers/productoController.js";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/", productoController.getProductos);
router.get("/:id", productoController.getProductoById);

// Admin protected
router.post("/", isAuthenticated, isAdmin, productoController.createProducto);
router.put("/:id", isAuthenticated, isAdmin, productoController.updateProducto);
router.delete("/:id", isAuthenticated, isAdmin, productoController.deleteProducto);

export default router;
