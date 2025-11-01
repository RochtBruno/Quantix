import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import './index.css'
import App from './components/App/App.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import SignUp from './components/SignUp/SignUp.jsx'
import CurrentUserContext from './contexts/CurrentUserContext.js'
import { TransactionsProvider } from './contexts/TransactionsContext.jsx'

function Root() {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <TransactionsProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<App />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TransactionsProvider>
    </CurrentUserContext.Provider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
