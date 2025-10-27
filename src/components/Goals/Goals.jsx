import React from "react"

function Goals() {
	return(
		<>
		<div className="bg-white rounded-xl shadow-sm border border-slate-200">
			<div className="p-6 border-b border-slate-200 flex justify-between items-center">
				<h2 className="text-xl font-bold text-slate-800">Metas</h2>
				<button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 hover:cursor-pointer py-2 rounded-lg transition">Adicionar</button>
			</div>
			<div className="p-8 text-center text-slate-500">Nenhuma meta cadastrada</div>
		</div>
		</>
	)
}

export default Goals