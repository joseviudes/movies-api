import { Router } from "express"
import { reviewController } from "./review.controller.js"
import { authMiddleware } from "../../middlewares/auth.middleware.js"

const router = Router()

router.use(authMiddleware) // todas las rutas de reviews requieren login asique no hace falta ponerlo en cada una

router.get("/", reviewController.getMine)
router.post("/", reviewController.create)
router.delete("/:id", reviewController.delete)

export default router