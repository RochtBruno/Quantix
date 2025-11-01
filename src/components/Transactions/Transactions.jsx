import React, { useState, useContext } from "react"
import TransactionsContext from "../../contexts/TransactionsContext.jsx"

const CATEGORY_OPTIONS = {
	Receita: ["Salário", "Investimentos", "Bônus", "Outros"],
	Despesa: ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Energia", "Internet", "Água", "Compras", "Lazer", "Outros"]
}

function Transactions() {
	const [showForm, setShowForm] = useState(false)
	// const [transactions, setTransactions] = useState([])
	const { transactions, addTransaction } = useContext(TransactionsContext)
	const [form, setForm] = useState({
		type: "Receita",
		value: "",
		category: CATEGORY_OPTIONS["Receita"][0],
		date: new Date().toISOString().slice(0, 10),
		description: ""
	})

	const resetForm = () => {
		setForm({
			type: "Receita",
			value: "",
			category: CATEGORY_OPTIONS["Receita"][0],
			date: new Date().toISOString().slice(0, 10),
			description: ""
		})
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => {
			if(name === "type"){
				return {
					...prev,
					type: value,
					category: CATEGORY_OPTIONS[value][0]
				}
			}
			return {...prev, [name]: value}
		})
	}

	const handleAdd = (e) => {
		e.preventDefault()
		const parsedValue = parseFloat(form.value.toString().replace(",","."))
		if(!parsedValue || isNaN(parsedValue)){
			alert("Informe um valor válido")
			return
		}
		const newTx = {
			id: Date.now(),
			type: form.type,
			value: parsedValue,
			category: form.category,
			date: form.date,
			description: form.description
		}
		// corrigido: manter histórico anterior
		addTransaction(newTx)
		
		resetForm()
		setShowForm(false)
	}

	const handleCancel = () => {
		resetForm()
		setShowForm(false)
	}

	// corrigido: retornar o valor formatado
	const currency = (v) => {
		return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL"}).format(v)
	}

	return(
		<>
		<div className="bg-white rounded-xl shadow-sm border border-slate-200">
			<div className="p-6 border-b border-slate-200 flex justify-between items-center">
				<h2 className="text-xl font-bold text-slate-800">Transações</h2>
				<button 
				onClick={() => setShowForm((s) => !s)}
				className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg transition">{showForm ? "Fechar" : "Adicionar"}</button>
			</div>
			{
				showForm && (
					<div className="p-6 border-b border-slate-200">
			<form className="grid gap-4" onSubmit={handleAdd}>
			  <div className="grid grid-cols-2 gap-4">
				<div>
				  <label className="block text-sm font-medium text-slate-700 mb-1 hover:cursor-pointer">Tipo</label>
				  <select
					name="type"
					value={form.type}
					onChange={handleChange}
					className="w-full px-3 py-2 border border-slate-300 rounded-lg"
				  >
					<option>Receita</option>
					<option>Despesa</option>
				  </select>
				</div>

				<div>
				  <label className="block text-sm font-medium text-slate-700 mb-1 hover:cursor-pointer">Valor</label>
				  <input
					name="value"
					value={form.value}
					onChange={handleChange}
					inputMode="decimal"
					placeholder="0.00"
					className="w-full px-3 py-2 border border-slate-300 rounded-lg"
				  />
				</div>
			  </div>

			  {/* Categoria e Data lado a lado */}
			  <div className="grid grid-cols-2 gap-4">
				  <div>
					<label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
					<select
					  name="category"
					  value={form.category}
					  onChange={handleChange}
					  className="w-full px-3 py-2 border border-slate-300 rounded-lg hover:cursor-pointer"
					>
					  {CATEGORY_OPTIONS[form.type].map((c) => (
						<option key={c} value={c}>
						  {c}
						</option>
					  ))}
					</select>
				  </div>

				  <div>
					<label className="block text-sm font-medium text-slate-700 mb-1 hover:cursor-pointer">Data</label>
					<input
					  name="date"
					  type="date"
					  value={form.date}
					  onChange={handleChange}
					  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
					/>
				  </div>
			  </div>

			  {/* Descrição embaixo, full-width */}
			  <div>
				  <label className="block text-sm font-medium text-slate-700 mb-1 hover:cursor-pointer">Descrição</label>
				  <input
					name="description"
					value={form.description}
					onChange={handleChange}
					className="w-full px-3 py-2 border border-slate-300 rounded-lg"
					placeholder="Observações (opcional)"
				  />
			  </div>

			  <div className="flex gap-3 justify-end">
				<button
				  type="button"
				  onClick={handleCancel}
				  className="px-4 py-2 rounded-lg bg-red-500 text-white border border-slate-300 text-sm hover:cursor-pointer"
				>
				  Cancelar
				</button>
				<button
				  type="submit"
				  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm hover:cursor-pointer"
				>
				  Adicionar
				</button>
			  </div>
			</form>
		  </div>
				)
			}
			<div className="p-6">
		  {transactions.length === 0 ? (
			<div className="text-center text-slate-500">Nenhuma transação registrada</div>
		  ) : (
			<ul className="space-y-4">
			  {transactions.map((t) => (
				<li key={t.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
				  <div className="flex items-center gap-3">
					<div
					  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
						t.type === "Receita" ? "bg-emerald-100" : "bg-red-100"
					  }`}
					>
					  <span className={`${t.type === "Receita" ? "text-emerald-600" : "text-red-600"} font-semibold`}>
						{t.type === "Receita" ? "R" : "D"}
					  </span>
					</div>
					<div>
					  <div className="text-sm font-medium text-slate-800">{t.category}</div>
					  <div className="text-xs text-slate-500">{t.description || "-"}</div>
					</div>
				  </div>

				  <div className="text-right">
					<div className={`font-semibold ${t.type === "Receita" ? "text-emerald-600" : "text-red-600"}`}>
					  {currency(t.value)}
					</div>
					<div className="text-xs text-slate-500">{t.date}</div>
				  </div>
				</li>
			  ))}
			</ul>
		  )}
		</div>
		</div>
		</>
	)
}

export default Transactions