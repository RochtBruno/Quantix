import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getGoals = async (req, res) => {
	try {
		const { userId } = req

		const goals = await prisma.goal.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc'}
		})

		res.status(200).json({
			message: "Metas encontradas",
			goals
		})
	} catch (error) {
		console.log("Erro ao buscar metas", error)
		res.status(500).json({
			error: "Erro ao buscar metas"
		})
	}
}

export const createGoal = async (req, res) => {
try {
	const { userId } = req
	const { title, goalValue, currentValue, limitDate } = req.body

	if (!title || !goalValue || !limitDate) {
	return res.status(400).json({
		error: "Título, valor da meta e data limite são obrigatórios"
	})
	}

	const goal = await prisma.goal.create({
	data: {
		userId,
		title,
		goalValue: parseFloat(goalValue),
		currentValue: currentValue ? parseFloat(currentValue) : 0,
		limitDate: new Date(limitDate)
	}
	})

	res.status(201).json({
	message: "Meta criada com sucesso",
	goal
	})
} catch (error) {
	console.error('ERRO AO CRIAR META:', error)
	res.status(500).json({
	error: "Erro ao criar meta"
	})
}
}

export const updateGoal = async (req, res) => {
try {
	const { userId } = req
	const { id } = req.params
	const { currentValue } = req.body

	const goal = await prisma.goal.findUnique({
	where: { id: parseInt(id) }
	})

	if (!goal) {
	return res.status(404).json({
		error: "Meta não encontrada"
	})
	}

	if (goal.userId !== userId) {
	return res.status(403).json({
		error: "Você não tem permissão para atualizar esta meta"
	})
	}

	const updatedGoal = await prisma.goal.update({
	where: { id: parseInt(id) },
	data: {
		currentValue: parseFloat(currentValue)
	}
	})

	res.status(200).json({
	message: "Meta atualizada com sucesso",
	goal: updatedGoal
	})
} catch (error) {
	console.error('ERRO AO ATUALIZAR META:', error)
	res.status(500).json({
	error: "Erro ao atualizar meta"
	})
}
}

export const deleteGoal = async (req, res) => {
try {
	const { userId } = req
	const { id } = req.params

	const goal = await prisma.goal.findUnique({
	where: { id: parseInt(id) }
	})

	if (!goal) {
	return res.status(404).json({
		error: "Meta não encontrada"
	})
	}

	if (goal.userId !== userId) {
	return res.status(403).json({
		error: "Você não tem permissão para deletar esta meta"
	})
	}

	await prisma.goal.delete({
	where: { id: parseInt(id) }
	})

	res.status(200).json({
	message: "Meta deletada com sucesso"
	})
} catch (error) {
	console.error('ERRO AO DELETAR META:', error)
	res.status(500).json({
	error: "Erro ao deletar meta"
	})
}
}