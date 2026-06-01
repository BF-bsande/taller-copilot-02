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

const CERTIFICATIONS = [
  {
    id: 'ai-900',
    exam: 'AI-900',
    title: 'Azure AI Fundamentals',
    level: 'Principiante',
    category: 'AI',
    description:
      'Demuestra conceptos fundamentales de IA relacionados con el desarrollo de software y servicios de Microsoft Azure para crear soluciones de inteligencia artificial.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-fundamentals/',
  },
  {
    id: 'ai-102',
    exam: 'AI-102',
    title: 'Azure AI Engineer Associate',
    level: 'Intermedio',
    category: 'AI',
    description:
      'Diseña e implementa soluciones de Azure AI mediante Azure AI Services, Azure AI Search y Azure OpenAI. Incluye generación aumentada por recuperación (RAG) y soluciones multimodales.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-engineer/',
  },
  {
    id: 'az-204',
    exam: 'AZ-204',
    title: 'Azure Developer Associate',
    level: 'Intermedio',
    category: 'Azure',
    description:
      'Crea soluciones de extremo a extremo en Microsoft Azure: Azure Functions, aplicaciones web, soluciones de almacenamiento, seguridad basada en identidad y supervisión.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-developer/',
  },
  {
    id: 'dp-700',
    exam: 'DP-700',
    title: 'Fabric Data Engineer Associate',
    level: 'Intermedio',
    category: 'Datos',
    description:
      'Experiencia en patrones de carga de datos, arquitecturas de datos y procesos de orquestación usando Microsoft Fabric. Incluye ingestión, transformación y seguridad de soluciones analíticas.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/fabric-data-engineer-associate/',
  },
  {
    id: 'dp-600',
    exam: 'DP-600',
    title: 'Fabric Analytics Engineer Associate',
    level: 'Intermedio',
    category: 'Datos',
    description:
      'Diseña, crea e implementa soluciones de análisis de datos a escala empresarial usando Microsoft Fabric, incluyendo modelado semántico y visualización de datos.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/fabric-analytics-engineer-associate/',
  },
  {
    id: 'sc-500',
    exam: 'SC-500',
    title: 'Cloud and AI Security Engineer Associate',
    level: 'Intermedio',
    category: 'Seguridad',
    description:
      'Nueva certificación 2026 que reemplaza a AZ-500. Diseña e implementa entornos seguros con patrones de seguridad modernos para implementaciones empresariales, incluyendo protección de modelos de IA en la nube.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/cloud-ai-security-engineer/',
    isNew: true,
  },
]

const CATEGORY_COLORS = {
  AI: '#3cffd0',
  Azure: '#5200ff',
  Datos: '#3860be',
  Seguridad: '#ff8c42',
}

function CertificationCard({ cert }) {
  const accentColor = CATEGORY_COLORS[cert.category] ?? '#ffffff'
  return (
    <article className="cert-card">
      <div className="cert-card-header">
        <span
          className="cert-card-badge"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          {cert.category}
        </span>
        {cert.isNew && <span className="cert-card-new">Nuevo 2026</span>}
      </div>
      <p className="cert-card-exam">{cert.exam}</p>
      <h3 className="cert-card-title">Microsoft Certified: {cert.title}</h3>
      <p className="cert-card-level">{cert.level}</p>
      <p className="cert-card-description">{cert.description}</p>
      <a
        className="cert-card-link"
        href={cert.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: accentColor, borderColor: accentColor }}
      >
        Ver certificación →
      </a>
    </article>
  )
}

function WelcomePage({ onLogout }) {
  return (
    <main className="app-shell app-shell--wide">
      <section className="panel panel--wide">
        <div className="welcome-header">
          <h1 className="title">Bienvenido</h1>
          <button type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
        <p className="welcome-intro">Has iniciado sesión correctamente.</p>

        <section className="certifications-section">
          <h2 className="certifications-title">Certificaciones Microsoft 2026</h2>
          <p className="certifications-subtitle">
            Selección de certificaciones disponibles en 2026, basada en información de Microsoft Learn
          </p>
          <div className="certifications-grid">
            {CERTIFICATIONS.map((cert) => (
              <CertificationCard key={cert.id} cert={cert} />
            ))}
          </div>
        </section>
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
