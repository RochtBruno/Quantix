import express from 'express'
import { signup, signin, getUser } from '../controllers/users.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

//POST /api/users/signup
router.post('/signup', signup)

//POST /api/users/signin
router.post('/signin', signin)

//GET /api/users/me
router.get('/me',authMiddleware, getUser)

export default router