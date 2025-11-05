import React, { useState, useEffect } from 'react'
import { IoIosTrendingUp, IoIosTrendingDown } from "react-icons/io";
import { BsCashCoin } from "react-icons/bs";


function FinanceCard({title, value}) {
	const [colorCard, setColorCard] = useState("")

	useEffect(() => {
		if(title == "Receitas"){
			setColorCard("emerald")
		}else if(title == "Despesas"){
			setColorCard("red")
		}else if(title == "Saldo"){
			setColorCard("blue")
		}
	}, [title])

	const renderIcon = () => {
		if(title === "Receitas") {
			return <IoIosTrendingUp className={`text-${colorCard}-500 text-xl`} />;
		} else if(title === "Despesas") {
			return <IoIosTrendingDown className={`text-${colorCard}-500 text-xl`} />;
		} else if(title === "Saldo") {
			return <BsCashCoin className={`text-${colorCard}-500 text-xl`} />;
		}
		return <IoIosTrendingUp className={`text-${colorCard}-500 text-xl`} />;
	}

	const formatCurrency = (v) => {
		const num = Number(v) || 0
		return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
	}


	return(
		<>
			<div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
				<div className="flex items-center justify-between mb-2">
					<span className="text-slate-600 text-sm font-medium">{title}</span>
					<div className={`bg-${colorCard}-100 p-2 rounded-lg`}>
						{renderIcon()}
						</div>
				</div>
				<p className={`text-2xl font-bold text-${colorCard}-600`}>{formatCurrency(value)}</p>
			</div>
		</>
	)
}

export default FinanceCard