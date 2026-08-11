import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStreamConfig } from '../../context/StreamConfigContext'
import './StreamConfigForm.css'

// 1. Estructura de los datos de transmisión
export interface StreamConfig {
  match?: string
  playbackUrl?: string
  streamStatus?: string | null
}

// 2. Estructura del valor retornado por el hook useStreamConfig
interface StreamConfigContextType {
  config: StreamConfig
  updateConfig: (newConfig: StreamConfig) => void
}

export default function StreamConfigForm(): React.JSX.Element {
  // Tipamos la desestructuración del hook
  const { config, updateConfig } = useStreamConfig() as StreamConfigContextType

  const [match, setMatch] = useState<string>(config?.match || '')
  const [playbackUrl, setPlaybackUrl] = useState<string>(config?.playbackUrl || '')
  const [error, setError] = useState<string>('')
  
  const navigate = useNavigate()

  // Tipado explícito del evento submit del formulario
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
        <button type="submit">Guardar configuración</button>
      </form>
    </main>
  )
}