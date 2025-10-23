import React from "react"
import { PiSignIn } from "react-icons/pi";


function SignIn(){
	return(
		<>
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
				<div className="flex items-center justify-center mb-8">
					<div className="bg-emerald-100 p-3 rounded-xl">
						<PiSignIn className={`text-emerald-500 text-3xl`}/>
					</div>
				</div>
				<h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Quantix</h1>
				<p className="text-slate-600 text-center mb-8">Entre para continuar</p>
				<form className="space-y-4">
					<div className="">
						<label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
						<input className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition" />
					</div>
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
						<input className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition" />
					</div>
					<button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">Entrar</button>
				</form>
				<button className="w-full mt-4 text-sm text-slate-600 hover:text-slate-800 transition">Não tem conta? Cadastre-se</button>
			</div>
		</>
	)
}

export default SignIn