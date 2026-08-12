import React, { useEffect, useState } from 'react'
import Header from '../Header'
import VideoPlayer from '../VideoPlayer'
import FacebookButton from '../FacebookButton/FacebookButton'
import logomita from '../../images/logonotimita.png'
import './Home.css'
import { useStreamConfig } from '../../context/StreamConfigContext'

const GET_ACTIVE_STREAMING_ENDPOINT = 'https://notimitaapi.somee.com/StreamApiKey/GetActiveStreaming'
const POLL_INTERVAL_MS = 10000 // 10 segundos

interface ActiveStreamingDto {
  streamingId: string
  match: string
  status: number
  playbackUrl: string
  startedAt: string
  viewerCount: number
}

// Ajustá estos textos según los valores reales de tu enum StreamingStatus
const STATUS_LABELS: Record<number, string> = {
  0: 'Iniciando',
  1: 'En vivo',
  2: 'Finalizado',
  3: 'Error',
}

function getOrCreateViewerId(): string {
  const existing = sessionStorage.getItem('viewerId')
  if (existing) return existing

  const id = crypto.randomUUID()
  sessionStorage.setItem('viewerId', id)
  return id
}

export default function Home(): React.JSX.Element {
  const { config } = useStreamConfig()
  const [activeStream, setActiveStream] = useState<ActiveStreamingDto | null>(null)
  const [hasFetched, setHasFetched] = useState<boolean>(false)

  const viewerIdRef = React.useRef<string>(getOrCreateViewerId())

  useEffect(() => {
    let isMounted = true

    async function fetchActiveStreaming() {
      try {
        const url = `${GET_ACTIVE_STREAMING_ENDPOINT}?viewerId=${viewerIdRef.current}`
        const response = await fetch(url)

        if (!response.ok) {
          if (isMounted) setActiveStream(null)
          return
        }

        const data: ActiveStreamingDto = await response.json()
        if (isMounted) setActiveStream(data)

      } catch {
        if (isMounted) setActiveStream(null)
      } finally {
        if (isMounted) setHasFetched(true)
      }
    }

    fetchActiveStreaming()
    const intervalId = setInterval(fetchActiveStreaming, POLL_INTERVAL_MS)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  // El estado del servidor manda; el context local solo sirve como fallback
  // mientras llega la primera respuesta del fetch (evita el parpadeo inicial
  // para quien acaba de configurar el stream en este mismo navegador).
  const eventName = activeStream?.match || config?.match || 'Atlético Mictlán vs Deportivo Achuapa'
  const playbackUrl = activeStream?.playbackUrl || (!hasFetched ? config?.playbackUrl : '') || ''
  const streamStatus = activeStream ? (STATUS_LABELS[activeStream.status] ?? 'Pendiente') : 'Pendiente'
  const viewerCount = activeStream?.viewerCount ?? 0

  return (
    <>
      <Header channelLogo={logomita} eventName={eventName} matchDateTime="02/08/2026 hora: 11:00 am" />
      <section id="center">
        {playbackUrl ? (
          <>
            <p className="stream-status">
              Estado: {streamStatus} · {viewerCount} {viewerCount === 1 ? 'persona viendo' : 'personas viendo'}
            </p>
            <VideoPlayer streamUrl={playbackUrl} />
          </>
        ) : (
          <div className="stream-loading">Transmision aun no disponible.</div>
        )}

        <div className="facebook-cta">
          <FacebookButton url="https://www.facebook.com/profile.php?id=61591528442466" />
        </div>
      </section>
      <div className="ticks"></div>
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}