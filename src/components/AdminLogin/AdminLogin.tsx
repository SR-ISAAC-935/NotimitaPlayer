import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStreamConfig } from '../../context/StreamConfigContext'
import './AdminLogin.css'

const LOGIN_ENDPOINT = 'https://notimitaapi.somee.com/Auth/Login'

interface AdminLoginProps {
  onSuccess?: () => void
}

export default function AdminLogin({ onSuccess }: AdminLoginProps): React.JSX.Element {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  
  const { updateConfig } = useStreamConfig()
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const body = await response.text()
        throw new Error(`HTTP ${response.status}: ${body}`)
      }

      const responseText = await response.text()
      const token = responseText.trim()

      if (!token) {
        throw new Error('Token no recibido del servidor')
      }

      updateConfig({ authToken: token })

      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/config-canal-2026')
      }
    } catch (fetchError: unknown) {
      if (fetchError instanceof Error) {
        setError(fetchError.message)
      } else {
        setError('Ocurrió un error inesperado')
      }
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit} aria-label="Formulario de acceso para administración">
        <h2>Acceso de administrador</h2>

        <label htmlFor="admin-username">Usuario</label>
        <input
          id="admin-username"
          type="text"
          value={username}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
          placeholder="Usuario"
          required
        />

        <label htmlFor="admin-password">Contraseña</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
          placeholder="Contraseña"
          required
        />

        {error && <p className="admin-login-error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </main>
  )
}