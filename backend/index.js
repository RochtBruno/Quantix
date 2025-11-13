import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import usersRoutes from './routes/users.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRoutes)

const PORT = process.env.PORT

app.listen(PORT,()=>{
	console.log(`Servidor rodando na porta ${PORT}`)
})