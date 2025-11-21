import React, { useState, useContext, useEffect } from "react"
import TransactionsContext from "../../contexts/TransactionsContext.jsx"
import { getTransactions, createTransaction, deleteTransaction} from "../../api/api.js"
import { MdDelete } from "react-icons/md";

const CATEGORY_OPTIONS = {
	Receita: ["Salário", "Investimentos", "Bônus", "Outros"],
	Despesa: ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Energia", "Internet", "Água", "Compras", "Lazer", "Outros"]
}

function formatCurrencyNumber(n){
	return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}


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

function Transactions() {
	const [showForm, setShowForm] = useState(false)
	const { transactions, addTransaction, deleteTransaction: removeTransaction, setTransactions } = useContext(TransactionsContext)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [form, setForm] = useState({
		type: "Receita",
		valueNumber: 0,
		displayValue: "",
		category: CATEGORY_OPTIONS["Receita"][0],
		date: new Date().toISOString().slice(0, 10),
		description: ""
	})

	useEffect(() => {
		const fetchTransactions = async () => {
			const token = localStorage.getItem('token')
			if(!token) return
			try {
				setLoading(true)
				const data = await getTransactions(token)
				setTransactions(data.transactions)
			} catch (error) {
				setError(error.message || "Erro ao carregar transações")
			} finally{
				setLoading(false)
			}
		}
		fetchTransactions()
	},[])

	const resetForm = () => {
		setForm({
			type: "Receita",
			valueNumber: 0,
			displayValue: "",
			category: CATEGORY_OPTIONS["Receita"][0],
			date: new Date().toISOString().slice(0, 10),
			description: ""
		})
	}

	const handleChange = (e) => {
		const { name, value } = e.target

		if(name === "value"){
			const digits = value.replace(/\D/g, "")
			if(digits === ""){
				setForm(prev => ({ ...prev, valueNumber: 0, displayValue: "" }))
				return
			}
			const num = parseInt(digits, 10)
			const valueNumber = num / 100
			const displayValue = formatInputFromDigits(digits)
			setForm(prev => ({ ...prev, valueNumber, displayValue }))
			return
		}

		if(name === "type"){
			setForm(prev => ({ ...prev, type: value, category: CATEGORY_OPTIONS[value][0] }))
			return
		}
		setForm(prev => ({ ...prev, [name]: value }))
	}

	const handleAdd = async(e) => {
		e.preventDefault()
		const parsedValue = Number(form.valueNumber) || 0
		if(parsedValue <= 0 || isNaN(parsedValue)){
			alert("Informe um valor válido")
			return
		}
		const token = localStorage.getItem("token")
		if(!token){
			alert("Você precisa estar logado para fazer essa ação")
			return
		}
		try {
			setLoading(true)
			setError("")
			const data = await createTransaction(
				token,
				form.type,
				parsedValue,
				form.category,
				form.date,
				form.description
			)
			addTransaction(data.transaction)
			resetForm()
			setShowForm(false)
		} catch (error) {
			setError(error.message || "Erro ao criar transação")
		} finally{
			setLoading(false)
		}

	}

	const handleDelete = async (id) => {
		if(!id){
			alert("Erro ao apagar card, id não encontrado")
			return
		}
		if(!window.confirm("Deseja excluir essa transação?")){
			return
		}
		const token = localStorage.getItem('token')
		if(!token){
			alert("Você precisa estar logado para fazer essa ação")
			return
		}
		try {
			setLoading(true)
			setError("")
			await deleteTransaction(token, id)
			removeTransaction(id)
		} catch (error) {
			setError(error.message || "Erro ao deletra transação")
		} finally{
			setLoading(false)
		}
	}

	const handleCancel = () => {
		resetForm()
		setShowForm(false)
	}

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

			{ showForm && (
				<div className="p-6 border-b border-slate-200">
				<form className="grid gap-4" onSubmit={handleAdd}>
				  <div className="grid grid-cols-2 gap-4">
					<div>
					  <label className="block text-sm font-medium text-slate-700 mb-1 hover:cursor-pointer">Tipo</label>
					  <select
						name="type"
						value={form.type}
						onChange={handleChange}
						className="w-full focus:outline-none placeholder-gray-500 px-3 py-2 border border-slate-300 rounded-lg"
					  >
						<option>Receita</option>
						<option>Despesa</option>
					  </select>
					</div>

					<div>
					  <label className="block text-sm font-medium text-slate-700 mb-1 hover:cursor-pointer">Valor</label>
					  <input
						name="value"
						value={form.displayValue}
						onChange={handleChange}
						inputMode="numeric"
						placeholder="R$ 0,00"
						className="w-full focus:outline-none placeholder-gray-500 px-3 py-2 border border-slate-300 rounded-lg"
					  />
					</div>
				  </div>

				  <div className="grid grid-cols-2 gap-4">
					  <div>
						<label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
						<select
						  name="category"
						  value={form.category}
						  onChange={handleChange}
						  className="w-full focus:outline-none placeholder-gray-500 px-3 py-2 border border-slate-300 rounded-lg hover:cursor-pointer"
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
						  className="w-full focus:outline-none placeholder-gray-500 px-3 py-2 border border-slate-300 rounded-lg"
						/>
					  </div>
				  </div>
				  <div>
					  <label className="block  text-sm font-medium text-slate-700 mb-1 hover:cursor-pointer">Descrição</label>
					  <input
						name="description"
						value={form.description}
						onChange={handleChange}
						className="w-full focus:outline-none placeholder-gray-500 px-3 py-2 border border-slate-300 rounded-lg"
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
					  {loading ? "Salvando..." : "Adicionar"}
					</button>
				  </div>
				</form>
			  </div>
			)}

			<div className="p-6">
			  {loading && transactions.length === 0 ? (
				<div className="text-center text-slate-500">Carregando transações</div>
			  ) : transactions.length === 0 ? (
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

					  <div className="text-right flex gap-5">
						<div >
						<div className={`font-semibold ${t.type === "Receita" ? "text-emerald-600" : "text-red-600"}`}>
						  {currency(t.value)}
						</div>
						<div className="text-xs text-slate-500">{formatDate(t.date)}</div>
					  </div>
					  <button onClick={() => handleDelete(t.id)} className="px-2 py-2"><MdDelete className={`text-red-500 text-xl hover:cursor-pointer hover:text-red-700`}/></button>
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