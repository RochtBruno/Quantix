import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import usersRoutes from './routes/users.js'
import transactionsRoutes from './routes/transactions.js'
import goalsRouter from "./routes/goals.js"

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

app.use('/api/users', usersRoutes)
app.use("/api/transactions",transactionsRoutes)
app.use("/api/goals", goalsRouter)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
})