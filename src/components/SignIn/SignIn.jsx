import React, { useState, useContext } from "react"
import { PiSignIn } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom"
import CurrentUserContext from "../../contexts/CurrentUserContext.js"


function SignIn(){

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const { setCurrentUser } = useContext(CurrentUserContext)
	const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault()
		const user = { email }
		if(setCurrentUser) setCurrentUser(user)
		navigate("/", {replace: true})
	}

	return(
		<>
			<div className="fixed inset-0 flex items-center justify-center bg-[#f1f1f1]">
				<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
					<div className="flex items-center justify-center mb-8">
						<div className="bg-emerald-100 p-3 rounded-xl">
							<PiSignIn className={`text-emerald-500 text-3xl`}/>
						</div>
					</div>
					<h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Quantix</h1>
					<p className="text-slate-600 text-center mb-8">Entre para continuar</p>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="">
							<label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
							<input className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition" onChange={(e) => setEmail(e.target.value)}/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
							<input className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition" onChange={(e) => setPassword(e.target.value)}/>
						</div>
						<button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">Entrar</button>
					</form>
					<Link to="/signup" className="block w-full mt-4 text-center text-sm text-slate-600 hover:text-slate-800 transition hover:cursor-pointer">Não tem conta? Cadastre-se</Link>
				</div>
			</div>
		</>
	)
}

export default SignIn