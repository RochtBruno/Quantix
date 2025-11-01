import React, { useState } from "react"

function Goals() {

	const [showForm, setShowForm] = useState(false)
	const [goals, setGoals] = useState([])
	const [editingGoalId, setEditingGoalId] = useState(null)
	const [editingAmount, setEditingAmount] = useState("")
	const [form, setForm] = useState({
		title: "",
		goalValue: "",
		currentValue: "",
		limitDate: new Date().toISOString().slice(0, 10)
	})

	const resetForm = () => {
		setForm({
			title: "",
			goalValue: "",
			currentValue: "",
			limitDate: new Date().toISOString().slice(0, 10)
		})
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => {
			return{ ...prev, [name]: value}
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const parsedGoal = parseFloat(form.goalValue.toString().replace(",", "."))
		const parsedCurrent = parseFloat(form.currentValue.toString().replace(",", "."))
		if((!parsedGoal || isNaN(parsedGoal)) && (!parsedCurrent || isNaN(parsedCurrent))){
			alert("Informe um valor válido!")
			return
		}
		const newGoal = {
			id: Date.now(),
			title: form.title || "Nova meta",
			goalValue: parsedGoal,
			currentValue: parsedCurrent,
			limitDate: form.limitDate
		}
		setGoals((prev) => [newGoal, ...prev])
		resetForm()
		setShowForm(false)
	}

	const handleCancel = () => {
		resetForm()
		setShowForm(false)
	}

	const startEditing = (id) => {
		setEditingGoalId(id)
		setEditingAmount("")
	}

	const cancelEditing = () => {
		setEditingGoalId(null)
		setEditingAmount("")
	}

	const confirmAddToGoal = (id) => {
		const raw = editingAmount.trim()
		if (!raw) {
			alert("Informe um valor para adicionar")
			return
		}
		const parsed = parseFloat(raw.replace(",", "."))
		if (!parsed || isNaN(parsed)) {
			alert("Valor inválido")
			return
		}
		setGoals((prev) =>
			prev.map((g) =>
				g.id === id
					? { ...g, currentValue: Math.min(g.goalValue, (g.currentValue || 0) + parsed) }
					: g
			)
		)
		cancelEditing()
	}

	const currency = (v) => {
		return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL"}).format(v)
	}

	return(
		<>
		<div className="bg-white rounded-xl shadow-sm border border-slate-200">
			<div className="p-6 border-b border-slate-200 flex justify-between items-center">
				<h2 className="text-xl font-bold text-slate-800">Metas</h2>
				<button 
				onClick={() => setShowForm((s) => !s)}
				className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 hover:cursor-pointer py-2 rounded-lg transition">{showForm ? "Fechar" : "Adicionar"}</button>
			</div>
			{showForm && (
			<div className="p-6 border-b border-slate-200">
				<form className="grid gap-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
						<input
							name="title"
							value={form.title}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg"
							placeholder="Ex: Viagem, Emergência..."
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">Valor da meta</label>
							<input
								name="goalValue"
								value={form.goalValue}
								onChange={handleChange}
								inputMode="decimal"
								placeholder="0.00"
								className="w-full px-3 py-2 border border-slate-300 rounded-lg"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">Valor inicial</label>
							<input
								name="currentValue"
								value={form.currentValue}
								onChange={handleChange}
								inputMode="decimal"
								placeholder="0.00"
								className="w-full px-3 py-2 border border-slate-300 rounded-lg"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">Data limite</label>
						<input
							name="limitDate"
							type="date"
							value={form.limitDate}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg"
						/>
					</div>

					<div className="flex gap-3 justify-end">
						<button type="button" onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded-lg border border-slate-300 text-sm hover:cursor-pointer">Cancelar</button>
						<button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm hover:cursor-pointer">Adicionar</button>
					</div>
				</form>
			</div>
		)}

		<div className="p-6">
			{goals.length === 0 ? (
				<div className="text-center text-slate-500">Nenhuma meta cadastrada</div>
			) : (
				<ul className="space-y-4">
					{goals.map((g) => {
						const pct = g.goalValue > 0 ? Math.round((g.currentValue / g.goalValue) * 100) : 0
						const pctClamped = Math.min(100, Math.max(0, pct))
						return (
							<li key={g.id} className="bg-slate-50 p-4 rounded-lg">
								<div className="flex items-center justify-between">
									<div>
										<div className="text-sm font-medium text-slate-800">{g.title}</div>
										<div className="text-xs text-slate-500">Limite: {g.limitDate}</div>
									</div>
									<div className="text-right">
										<div className="font-semibold text-slate-800">{currency(g.currentValue)} / {currency(g.goalValue)}</div>
										<div className="text-xs text-slate-500">{pctClamped}%</div>
									</div>
								</div>

								{/* progress bar */}
								<div className="mt-3 bg-slate-200 h-2 rounded-full overflow-hidden">
									<div
										className="h-2 bg-emerald-600 rounded-full"
										style={{ width: `${pctClamped}%` }}
									/>
								</div>

								{/* area para adicionar valor inline */}
								<div className="mt-3">
									{editingGoalId === g.id ? (
										<div className="flex items-center gap-2">
											<input
												type="text"
												value={editingAmount}
												onChange={(e) => setEditingAmount(e.target.value)}
												placeholder="Valor (ex: 100.00)"
												className="px-3 py-2 border border-slate-300 rounded-lg w-40"
											/>
											<button
												onClick={() => confirmAddToGoal(g.id)}
												className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm hover:cursor-pointer"
											>
												Ok
											</button>
											<button
												onClick={cancelEditing}
												className="px-3 py-2 border border-slate-300 bg-red-500 text-white rounded-lg text-sm hover:cursor-pointer"
											>
												Cancelar
											</button>
										</div>
									) : (
										<div className="flex justify-end">
											<button
												onClick={() => startEditing(g.id)}
												className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 hover:cursor-pointer"
											>
												Adicionar Valor
											</button>
										</div>
									)}
								</div>
							</li>
						)
					})}
				</ul>
			)}
		</div>
		</div>
		</>
	)
}

export default Goals