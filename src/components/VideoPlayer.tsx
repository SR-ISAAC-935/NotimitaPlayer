import React, { useEffect, useRef } from 'react'
import Hls from 'hls.js'
import './VideoPlayer.css'

interface VideoPlayerProps {
  streamUrl: string
  poster?: string
  teamLogo?: string
  alt?: string
}

export default function VideoPlayer({
  streamUrl,
  poster,
  teamLogo,
  alt = 'Reproductor de video en vivo',
}: VideoPlayerProps): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !streamUrl) return

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari / iOS: soporte nativo
      video.src = streamUrl
      // Opcional: forzar play en iOS
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log('Autoplay bloqueado', e))
      })
    } else if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(streamUrl)
      hls.attachMedia(video)
      
      // Escuchar el evento cuando HLS haya parseado el manifiesto y dar Play
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Autoplay bloqueado', e))
      })

      return () => hls.destroy()
    }
  }, [streamUrl])

  return (
    <div className="video-player" role="region" aria-label="Reproductor de transmisión en vivo">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="player"
          controls
          autoPlay // <-- Añadido
          muted    // <-- Obligatorio en navegadores modernos para que funcione el autoPlay
          playsInline // <-- Muy recomendado para iOS para que no abra pantalla completa obligatoriamente
          poster={poster || undefined}
          aria-label={alt}
        >
          Tu navegador no soporta video.
        </video>
        {teamLogo && <img src={teamLogo} alt="" className="team-logo" />}
      </div>
    </div>
  )
}