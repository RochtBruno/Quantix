import express from 'express'
import { signup, signin, getUser } from '../controllers/users.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/me', authMiddleware, getUser)

export default router