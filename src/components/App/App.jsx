import React from "react"

import Header from "../Header/Header.jsx"
import FinanceCard from "../FinanceCard/FinanceCard.jsx"
import SignIn from "../SignIn/SignIn.jsx"
import Transactions from "../Transactions/Transactions.jsx"
import Goals from "../Goals/Goals.jsx"

function App() {

  return (
    <>
    <Header/>

    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-6">
      <FinanceCard title={"Receitas"} value={50}/>
      <FinanceCard title={"Despesas"} value={75}/>
      <FinanceCard title={"Saldo"} value={100}/>
      {/* <SignIn /> */}
    </main>
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Transactions/>
        <Goals />
      </div>
    </>
  )
}

export default App
