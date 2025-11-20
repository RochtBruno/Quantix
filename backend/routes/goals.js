import express from "express"
import { getGoals, createGoal, updateGoal, deleteGoal } from "../controllers/goals.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, getGoals)
router.post("/", authMiddleware, createGoal)
router.patch("/:id", authMiddleware, updateGoal)
router.delete("/:id", authMiddleware, deleteGoal)

export default router