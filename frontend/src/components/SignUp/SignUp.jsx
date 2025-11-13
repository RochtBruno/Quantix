import React, { useState, useContext } from "react"
import { PiSignIn } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom"
import CurrentUserContext from "../../contexts/CurrentUserContext.js"
import { signup } from "../../api/api.js"

function SignUp(){
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { setCurrentUser } = useContext(CurrentUserContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await signup(email, name, lastName, password)
      
      // Salvar token no localStorage
      localStorage.setItem('token', data.token)
      
      // Atualizar contexto com dados do usuário
      setCurrentUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        lastName: data.user.lastName
      })
      
      navigate("/", { replace: true })
    } catch (err) {
      setError(err.message || "Erro ao cadastrar")
    } finally {
      setLoading(false)
    }
  }

  return(
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-[#f1f1f1]">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <PiSignIn className={`text-emerald-500 text-3xl`}/>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Quantix</h1>
        <p className="text-slate-600 text-center mb-8">Crie sua conta para começar</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sobrenome</label>
            <input 
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Cadastrando..." : "Cadastrar-se"}
          </button>
        </form>
        <Link to="/signin" className="block w-full mt-4 text-sm text-center text-slate-600 hover:text-slate-800 transition hover:cursor-pointer">Já tem conta? Entre</Link>
      </div>
    </div>
    </>
  )
}

export default SignUp