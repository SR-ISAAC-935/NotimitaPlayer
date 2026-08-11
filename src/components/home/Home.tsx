import React from 'react'
import Header from '../Header'
import VideoPlayer from '../VideoPlayer'
import FacebookButton from '../FacebookButton/FacebookButton'
import logomita from '../../images/logonotimita.png'
import './Home.css'
import { useStreamConfig } from '../../context/StreamConfigContext'

export default function Home(): React.JSX.Element {
  const { config } = useStreamConfig()

  const eventName = config?.match || 'Atlético Mictlán vs Deportivo Achuapa'
  const playbackUrl = config?.playbackUrl || ''
  const streamStatus = config?.streamStatus ?? 'Pendiente'

  return (
    <>
      <Header channelLogo={logomita} eventName={eventName} matchDateTime="02/08/2026 hora: 11:00 am" />
      <section id="center">
        {playbackUrl ? (
          <>
            <p className="stream-status">Estado: {streamStatus}</p>
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