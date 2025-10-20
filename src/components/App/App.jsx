
import { FiLogOut } from "react-icons/fi";

function App() {

  return (
    <>
    <header className="grid grid-cols-2 ">
      <div className="pl-25 py-10">
        <h1 className="text-3xl font-bold text-slate-800">Quantix - Dashboard Financeiro</h1>
        <p className="text-slate-600 mt-1">Gerencie suas finanças com clareza</p>
      </div>
      <div className="pr-25 py-10 flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:cursor-pointer rounded-lg transition"><FiLogOut /><span>Sair</span></button>
      </div>
    </header>
    </>
  )
}

export default App
