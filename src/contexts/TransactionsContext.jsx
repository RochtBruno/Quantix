import React, { createContext, useState, useMemo } from "react";

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
const [transactions, setTransactions] = useState([]);

const addTransaction = (tx) => {
	setTransactions((prev) => [tx, ...prev]);
};

const deleteTransaction = (id) => {
	setTransactions((prev) => prev.filter((t) => t.id !== id))
}

const totals = useMemo(() => {
	const totalReceitas = transactions
	.filter((t) => t.type === "Receita")
	.reduce((s, t) => s + (Number(t.value) || 0), 0);
	const totalDespesas = transactions
	.filter((t) => t.type === "Despesa")
	.reduce((s, t) => s + (Number(t.value) || 0), 0);
	const balance = totalReceitas - totalDespesas;
	return { totalReceitas, totalDespesas, balance };
}, [transactions]);

return (
	<TransactionsContext.Provider
	value={{ transactions, addTransaction, deleteTransaction, ...totals }}
	>
	{children}
	</TransactionsContext.Provider>
);
}

export default TransactionsContext;