import React, {useState, useContext} from "react"
import { Navigate } from "react-router-dom"
import Header from "../Header/Header.jsx"
import FinanceCard from "../FinanceCard/FinanceCard.jsx"
import SignIn from "../SignIn/SignIn.jsx"
import Transactions from "../Transactions/Transactions.jsx"
import Goals from "../Goals/Goals.jsx"
import CurrentUserContext from '../../contexts/CurrentUserContext.js'
import TransactionsContext from '../../contexts/TransactionsContext.jsx'

function App() {
	const [currentUser, setCurrentUser] = useState({})
	const { totalReceitas = 0, totalDespesas = 0, balance = 0 } = useContext(TransactionsContext) || {}

	if(!currentUser){
		return <Navigate to="/signin" replace/>
	}

	const handleLogout = () => {
		setCurrentUser("")
	}

	return (
		<>
				<Header handleLogout={handleLogout}/>

				<main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-6">
					<FinanceCard title={"Receitas"} value={totalReceitas}/>
					<FinanceCard title={"Despesas"} value={totalDespesas}/>
					<FinanceCard title={"Saldo"} value={balance}/>
				</main>
				<div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Transactions/>
						<Goals />
				</div>

		</>
	)
}

export default App
