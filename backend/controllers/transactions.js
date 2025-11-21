import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getTransactions = async(req, res) => {
	try{
		const { userId } = req
		const transactions = await prisma.transaction.findMany({
			where: { userId },
			orderBy: { createdAt : 'desc'}
		})
		res.status(200).json({
			message: "Transações encontradas",transactions
		})
	}catch(error){
		console.log("error ao buscar transações", error)
		res.status(500).json({
			error: "Erro ao buscar transações"
		})
	}
}

export const createTransaction = async (req, res) => {
	try{
		const { userId } = req
		const { type, value, category, date, description } = req.body

		if(!type || !value || !category || !date){
			return res.status(400).json({
				error : "Tipo, valor, categoria e data são obrigatórios"
			})
		}

		const transaction = await prisma.transaction.create({
			data: {
				userId,
				type,
				value: parseFloat(value),
				category,
				date: new Date(date),
				description: description || null
			}
		})

		res.status(201).json({
			message: "Transação criada com sucesso",
			transaction
		})
	}catch(error){
		console.log("Erro ao criar transação", error)
		res.status(500).json({
			error: "Erro ao criar transação"
		})
	}
}

export const deleteTransaction = async (req, res) => {
	try{
		const { userId } = req
		const { id } = req.params

		const transaction = await prisma.transaction.findUnique({
			where: { id: parseInt (id)}
		})
		if(!transaction){
			return res.status(404).json({
				error: "Transação não encontrada"
			})
		}

		if(transaction.userId !== userId){
			return res.status(403).json({
				error: "Você não tem permissão para deletar essa transação"
			})
		}

		await prisma.transaction.delete({
			where: { id: parseInt(id)}
		})

		res.status(200).json({
			message: "Transação deletada com sucesso"
		})
	}catch(error){
		console.log("Erro ao deletar transação", error)
		res.status(500).json({
			error: "Erro ao deletar transação"
		})
	}
}