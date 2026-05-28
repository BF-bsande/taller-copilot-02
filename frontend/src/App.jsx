import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'

const TOKEN_STORAGE_KEY = 'authToken'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function LoginPage({ setToken }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail ?? 'No fue posible iniciar sesión')
        return
      }

      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.access_token)
      setToken(data.access_token)
      setUsername('')
      setPassword('')
      navigate('/welcome', { replace: true })
    } catch {
      setError('No fue posible conectar con el backend')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="panel">
        <h1 className="title">JWT Demo</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error ? <p className="error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </section>
    </main>
  )
}

function WelcomePage({ onLogout }) {
  return (
    <main className="app-shell">
      <section className="panel">
        <h1 className="title">Bienvenido</h1>
        <div className="welcome">
          <p>Has iniciado sesión correctamente.</p>
          <button type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </section>
    </main>
  )
}

function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_STORAGE_KEY))

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    navigate('/login', { replace: true })
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={token ? <Navigate to="/welcome" replace /> : <LoginPage setToken={setToken} />}
      />
      <Route
        path="/welcome"
        element={token ? <WelcomePage onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
