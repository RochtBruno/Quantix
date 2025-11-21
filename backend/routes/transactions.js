import express from 'express'
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/transactions.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/", authMiddleware, getTransactions)
router.post("/", authMiddleware, createTransaction)
router.delete("/:id", authMiddleware, deleteTransaction)

export default router