import React, { useState } from "react"

const formatCurrencyNumber = (n) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n)

function formatInputFromDigits(digits){
	if(!digits) return ""
	const num = parseInt(digits, 10)
	const value = num / 100
	return formatCurrencyNumber(value)
}

function formatDate(d){
	if(!d) return ""
	if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
		const [yyyy, mm, dd] = d.split("-")
		return `${dd}/${mm}/${yyyy}`
	}
	const date = new Date(d)
	if (!isNaN(date)) {
		const dd = String(date.getDate()).padStart(2, "0")
		const mm = String(date.getMonth() + 1).padStart(2, "0")
		const yyyy = date.getFullYear()
		return `${dd}/${mm}/${yyyy}`
	}

	const parts = String(d).split("-")
	if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
	return String(d)
}

function Goals() {

	const [showForm, setShowForm] = useState(false)
	const [goals, setGoals] = useState([])

	// inline editing for adding value
	const [editingGoalId, setEditingGoalId] = useState(null)
	const [editingAmountDisplay, setEditingAmountDisplay] = useState("")
	const [editingAmountNumber, setEditingAmountNumber] = useState(0)

	const [form, setForm] = useState({
		title: "",
		goalValueNumber: 0,
		goalDisplayValue: "",
		currentValueNumber: 0,
		currentDisplayValue: "",
		limitDate: new Date().toISOString().slice(0, 10)
	})

	const resetForm = () => {
		setForm({
			title: "",
			goalValueNumber: 0,
			goalDisplayValue: "",
			currentValueNumber: 0,
			currentDisplayValue: "",
			limitDate: new Date().toISOString().slice(0, 10)
		})
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		if (name === "goalValue") {
			const digits = value.replace(/\D/g, "")
			if (digits === "") {
				setForm(prev => ({ ...prev, goalValueNumber: 0, goalDisplayValue: "" }))
				return
			}
			const num = parseInt(digits, 10)
			const valueNumber = num / 100
			const displayValue = formatInputFromDigits(digits)
			setForm(prev => ({ ...prev, goalValueNumber: valueNumber, goalDisplayValue: displayValue }))
			return
		}

		if (name === "currentValue") {
			const digits = value.replace(/\D/g, "")
			if (digits === "") {
				setForm(prev => ({ ...prev, currentValueNumber: 0, currentDisplayValue: "" }))
				return
			}
			const num = parseInt(digits, 10)
			const valueNumber = num / 100
			const displayValue = formatInputFromDigits(digits)
			setForm(prev => ({ ...prev, currentValueNumber: valueNumber, currentDisplayValue: displayValue }))
			return
		}

		setForm(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const parsedGoal = Number(form.goalValueNumber) || 0
		const parsedCurrent = Number(form.currentValueNumber) || 0
		if ((parsedGoal <= 0 || isNaN(parsedGoal)) && (parsedCurrent <= 0 || isNaN(parsedCurrent))) {
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
	const handleDelete = (id) => {
		if(window.confirm("Deseja excluir essa meta? ")){
			setGoals((prev) => prev.filter((g) => g.id !== id))
		}
	}

	const handleCancel = () => {
		resetForm()
		setShowForm(false)
	}

	const startEditing = (id) => {
		setEditingGoalId(id)
		setEditingAmountDisplay("")
		setEditingAmountNumber(0)
	}

	const cancelEditing = () => {
		setEditingGoalId(null)
		setEditingAmountDisplay("")
		setEditingAmountNumber(0)
	}

	const onEditingAmountChange = (e) => {
		const value = e.target.value
		const digits = value.replace(/\D/g, "")
		if (digits === "") {
			setEditingAmountDisplay("")
			setEditingAmountNumber(0)
			return
		}
		const num = parseInt(digits, 10)
		const valueNumber = num / 100
		const displayValue = formatInputFromDigits(digits)
		setEditingAmountNumber(valueNumber)
		setEditingAmountDisplay(displayValue)
	}

	const confirmAddToGoal = (id) => {
		const parsed = Number(editingAmountNumber) || 0
		if (parsed <= 0 || isNaN(parsed)) {
			alert("Informe um valor válido")
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
		return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL"}).format(v || 0)
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
							className="w-full focus:outline-none placeholder-gray-500 px-3 py-2 border border-slate-300 rounded-lg"
							placeholder="Ex: Viagem, Emergência..."
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">Valor da meta</label>
							<input
								name="goalValue"
								value={form.goalDisplayValue}
								onChange={handleChange}
								inputMode="numeric"
								placeholder="R$ 0,00"
								className="w-full focus:outline-none placeholder-gray-500 px-3 py-2 border border-slate-300 rounded-lg"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">Valor inicial</label>
							<input
								name="currentValue"
								value={form.currentDisplayValue}
								onChange={handleChange}
								inputMode="numeric"
								placeholder="R$ 0,00"
								className="w-full focus:outline-none placeholder-gray-500 px-3 py-2 border border-slate-300 rounded-lg"
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
							className="w-full focus:outline-none placeholder-gray-500 px-3 py-2 border border-slate-300 rounded-lg"
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
										<div className="text-xs text-slate-500">Limite: {formatDate(g.limitDate)}</div>
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
												value={editingAmountDisplay}
												onChange={onEditingAmountChange}
												placeholder="R$ 0,00"
												className="px-3 focus:outline-none placeholder-gray-500 py-2 border border-slate-300 rounded-lg w-40"
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
								<button onClick={() => handleDelete(g.id)} className="bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg transition">Excluir</button>
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