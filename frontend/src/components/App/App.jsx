import React, { useState, useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import Header from "../Header/Header.jsx"
import FinanceCard from "../FinanceCard/FinanceCard.jsx"
import Transactions from "../Transactions/Transactions.jsx"
import Goals from "../Goals/Goals.jsx"
import CurrentUserContext from '../../contexts/CurrentUserContext.js'
import TransactionsContext from '../../contexts/TransactionsContext.jsx'
import { getCurrentUser } from "../../api/api.js"

function App() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext)
  const { totalReceitas = 0, totalDespesas = 0, balance = 0 } = useContext(TransactionsContext) || {}
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (token && !currentUser) {
      // Validar token e obter dados do usuário
      getCurrentUser(token)
        .then(data => {
          setCurrentUser(data.user)
        })
        .catch(() => {
          localStorage.removeItem('token')
          setCurrentUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setCurrentUser(null)
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
