const API_URL = 'http://localhost:4000/api'

export async function signup(email, name, lastName, password) {
	const res = await fetch(`${API_URL}/users/signup`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({email, name, lastName, password})
	})
	const data = await res.json()
	if(!res.ok){
		throw new Error(data.error || 'Erro ao cadastrar')
	}
	return data
}

export async function signin(email, password){
	const res = await fetch(`${API_URL}/users/signin`, {
		method: "POST",
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({ email, password})
	})
	const data = await res.json()
	if(!res.ok){
		throw new Error(data.error || "Erro ao fazer login")
	}
	return data
}

export async function getCurrentUser(token){
	const res = await fetch(`${API_URL}/users/me`,{
		headers: { Authorization: `Bearer ${token}`}
	})
	const data = await res.json()
	if(!res.ok){
		throw new Error(data.error || "Erro ao buscar usuário atual")
	}
	return data
}