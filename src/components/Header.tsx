import React from 'react'
import './Header.css'

interface HeaderProps {
  channelLogo?: string
  eventName?: string
  matchDateTime?: string
}

export default function Header({
  channelLogo,
  eventName,
  matchDateTime,
}: HeaderProps): React.JSX.Element {
  const dateTimeString = matchDateTime || 'Sáb, 12 Sep · 19:00 GT'

  return (
    <header className="site-header" role="banner" aria-label="Header de transmisión">
      <div className="header-left">
        <img
          src={channelLogo || '/logo192.png'}
          alt="Logo del canal"
          className="channel-logo"
        />
      </div>

      <div className="header-center">
        <h1 className="event-name">{eventName || 'Liga Nacional - Jornada X'}</h1>
      </div>

      <div className="header-right">
        <time className="match-time" dateTime={dateTimeString} aria-label={`Fecha y hora del partido: ${dateTimeString}`}>
          {dateTimeString}
        </time>
      </div>
    </header>
  )
}