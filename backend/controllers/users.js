const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()
import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient()

export const signup = async (req, res) => {
	try{
		const [email, name, lastName, password] = req.body

		if(!email || !name || lastName || !password){
			return res.status(400).json({
				error: "Campos vazios não são permitidos"
			})
		}

		const userExists = await prisma.user.findUnique({
			where: { email }
		})
		if(userExists){
			return res.status(400).json({
				error: "Email já cadastrado"
			})
		}

		const hashedPassword = await bcrypt.hash(password,10)

		const user = await prisma.user.create({
			data:{
				email,
				name,
				lastName,
				password: hashedPassword
			},
			select:{
				id: true,
				email:true,
				name: true,
				lastName: true,
				createdAt: true
			}
		})

		const token = jwt.sign(
			{ userId: user.id},
			process.env.JWT_SECRET,
			{ expiresIn: '7d'}
		)

		res.status(201).json({
			message: "Usuário criado com sucesso",
			token,
			user
		})
	}catch(err){
		res.status(500).json({
			error: "Erro ao cadastrar usuário"
		})
	}
}

export const sign = async (req, res) => {
	try{
		const { email, password } = req.body
		if(!email || !password){
			return res.status(400).json({
				error: "Email e senha são obrigatórios"
			})
		}

		const user = await prisma.user.findUnique({
			where: { email},
			select: {
				id: true,
				email: true,
				name: true,
				lastName: true,
				password: true,
				createdAt: true
			}
		})

		if(!user){
			return res.status(401).json({
				error: "Email ou senha incorretos"
			})
		}

		const passwordMatch = await bcrypt.compare(password, user.password)

		if(!passwordMatch){
			return res.status(401).json({
				error: 'Email ou senha incorretos'
			})
		}

		const token = jwt.sign(
			{ userId: user.id},
			process.env.JWT_SECRET,
			{ expiresIn: '7d'}
		)

		const { password: _, ...userWithoutPassword } = user

		res.status(200).json({
			message: "Login realizado com sucesso",
			token,
			user: userWithoutPassword
		})
	}catch(err){
		res.status(500).json({
			error: 'Erro ao fazer login'
		})
	}
}

export const getUser = async (req, res) => {
	try{
		const { userId } = req
		const user = await prisma.user.findUnique({
			where: {id: userId},
			select:{
				id: true,
				email: true,
				name: true,
				lastName: true,
				createdAt: true
			}
		})
		if(!user){
			return res.status(404).json({
				error: "Usuário não encontrado"
			})
		}

		res.status(200).json({
			message: "Usuário encontrado",
			user
		})
	}catch(error){
		res.status(500).json({
			error: `Erro ao buscar usuário: ${error}`
		})
	}
}
