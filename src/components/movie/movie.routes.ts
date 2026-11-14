import { Router } from "express";
import { movieController } from "./movie.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";


const router = Router()

router.get("/", movieController.getAll)
router.get("/:id", movieController.getById)
router.post("/", authMiddleware, adminMiddleware, movieController.create)
router.put("/:id", authMiddleware, adminMiddleware, movieController.update)
router.delete("/:id", authMiddleware, adminMiddleware, movieController.delete)

export default router