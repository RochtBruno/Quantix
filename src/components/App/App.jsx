import React from "react"

import Header from "../Header/Header.jsx"
import FinanceCard from "../FinanceCard/FinanceCard.jsx"

function App() {

  return (
    <>
    <Header/>

    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-6">
      <FinanceCard title={"Receitas"} value={50}/>
      <FinanceCard title={"Despesas"} value={75}/>
      <FinanceCard title={"Saldo"} value={100}/>
    </main>
    </>
  )
}

export default App
