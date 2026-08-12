import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStreamConfig } from '../../context/StreamConfigContext'
import './StreamConfigForm.css'

// 1. Actualizamos la estructura para incluir fbRestreamingKey y streamKey
export interface StreamConfig {
  match?: string
  playbackUrl?: string
  streamStatus?: string | null
  authToken?: string 
  streamKey?: string
  fbRestreamingKey?: string
}

interface StreamConfigContextType {
  config: StreamConfig
  updateConfig: (newConfig: Partial<StreamConfig>) => void
}

const STREAM_KEY_ENDPOINT = 'https://notimitaapi.somee.com/StreamApiKey/GetStreamKey'

export default function StreamConfigForm(): React.JSX.Element {
  const { config, updateConfig } = useStreamConfig() as StreamConfigContextType

  const [match, setMatch] = useState<string>(config?.match || '')
  // Nuevo estado para la clave de retransmisión de Facebook
  const [fbRestreamingKey, setFbRestreamingKey] = useState<string>(config?.fbRestreamingKey || '')
  
  const [streamKey, setStreamKey] = useState<string>(config?.streamKey || '')
  const [isLoadingKey, setIsLoadingKey] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  
  const navigate = useNavigate()

  useEffect(() => {
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
            'Authorization': `Bearer ${config.authToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: No se pudo obtener la clave.`)
        }

        const keyData = await response.text()
        // Limpiamos la clave por si viene con comillas o espacios extra
        setStreamKey(keyData.replace(/["']/g, "").trim())

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

    // Solo hacemos fetch si no tenemos ya la key guardada
    if (!streamKey) {
      fetchStreamKey()
    }
  }, [config.authToken, streamKey])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setError('')

    if (!streamKey) {
      setError('Aún no se ha cargado la Stream Key. Por favor espera.')
      return
    }

    if (!fbRestreamingKey.trim()) {
      setError('La clave de retransmisión de Facebook es obligatoria.')
      return
    }

    // Generamos la playbackUrl automáticamente igual que en tu backend
    const generatedPlaybackUrl = `https://retransmisionmatches.duckdns.org/hls/${streamKey}.m3u8`

    updateConfig({
      match,
      fbRestreamingKey: fbRestreamingKey.trim(),
      streamKey,
      playbackUrl: generatedPlaybackUrl, // Se guarda lista para usarse en el reproductor
      streamStatus: null,
    })

    navigate('/')
  }

  return (
    <main className="stream-config-page">
      <form className="stream-config-form" onSubmit={handleSubmit} aria-label="Configuración de streaming">
        <h2>Configuración de transmisión</h2>

        <div className="stream-key-container">
          <label>Tu Stream Key (Automática):</label>
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
          placeholder="Ej: Tucumán vs Chinitos"
          required
        />

        <label htmlFor="fb-restreaming-key">Clave de Facebook (fbRestreamingKey)</label>
        <input
          id="fb-restreaming-key"
          type="text"
          placeholder="FB-1719508349360601-1-Ab7..."
          value={fbRestreamingKey}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFbRestreamingKey(event.target.value)}
          required
        />

        {error && <p className="stream-config-error">{error}</p>}
        <button type="submit" disabled={!config.authToken || isLoadingKey}>Guardar configuración</button>
      </form>
    </main>
  )
}