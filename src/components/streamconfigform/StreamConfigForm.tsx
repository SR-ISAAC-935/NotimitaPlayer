import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStreamConfig } from '../../context/StreamConfigContext'
import './StreamConfigForm.css'

// 1. Actualizamos la estructura para incluir el authToken
export interface StreamConfig {
  match?: string
  playbackUrl?: string
  streamStatus?: string | null
  authToken?: string // <-- Añadido para poder leer el token
}

interface StreamConfigContextType {
  config: StreamConfig
  updateConfig: (newConfig: Partial<StreamConfig>) => void
}

const STREAM_KEY_ENDPOINT = 'https://notimitaapi.somee.com/StreamApiKey/GetStreamKey'

export default function StreamConfigForm(): React.JSX.Element {
  const { config, updateConfig } = useStreamConfig() as StreamConfigContextType

  const [match, setMatch] = useState<string>(config?.match || '')
  const [playbackUrl, setPlaybackUrl] = useState<string>(config?.playbackUrl || '')
  
  // Nuevos estados para manejar la Stream Key
  const [streamKey, setStreamKey] = useState<string>('')
  const [isLoadingKey, setIsLoadingKey] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  
  const navigate = useNavigate()

  // 2. useEffect para hacer el fetch automático al montar el componente
  useEffect(() => {
    // Si no hay token en el contexto, podríamos redirigir al login
    if (!config.authToken) {
      setError('No estás autenticado. Por favor, inicia sesión.')
      return
    }

    async function fetchStreamKey() {
      setIsLoadingKey(true)
      try {
        const response = await fetch(STREAM_KEY_ENDPOINT, {
          method: 'GET',
          headers: {
            // 3. Enviamos el token de autorización
            'Authorization': `Bearer ${config.authToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: No se pudo obtener la clave.`)
        }

        // Suponiendo que la API devuelve la clave como texto plano.
        // Si devuelve JSON, cambia esto a await response.json() y extrae la propiedad.
        const keyData = await response.text()
        setStreamKey(keyData)

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Error inesperado al obtener la stream key')
        }
      } finally {
        setIsLoadingKey(false)
      }
    }

    fetchStreamKey()
  }, [config.authToken])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setError('')

    if (!playbackUrl.trim()) {
      setError('Pega el enlace de reproducción (playbackUrl) que te devolvió la API.')
      return
    }

    updateConfig({
      match,
      playbackUrl: playbackUrl.trim(),
      streamStatus: null,
    })

    navigate('/')
  }

  return (
    <main className="stream-config-page">
      <form className="stream-config-form" onSubmit={handleSubmit} aria-label="Configuración de streaming">
        <h2>Configuración de transmisión</h2>

        {/* Sección para mostrar la Stream Key */}
        <div className="stream-key-container">
          <label>Tu Stream Key:</label>
          {isLoadingKey ? (
            <p className="loading-text">Cargando clave...</p>
          ) : (
            <code className="stream-key-display">{streamKey || 'No disponible'}</code>
          )}
        </div>

        <label htmlFor="match">Partido</label>
        <input
          id="match"
          type="text"
          value={match}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMatch(event.target.value)}
          required
        />

        <label htmlFor="playback-url">Enlace de reproducción (playbackUrl)</label>
        <input
          id="playback-url"
          type="text"
          placeholder="http://128.140.101.162:8080/hls/streamkey.m3u8"
          value={playbackUrl}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPlaybackUrl(event.target.value)}
          required
        />

        {error && <p className="stream-config-error">{error}</p>}
        <button type="submit" disabled={!config.authToken}>Guardar configuración</button>
      </form>
    </main>
  )
}