
import './FacebookButton.css'

interface FacebookButtonProps {
  url?: string
}

export default function FacebookButton({ url }: FacebookButtonProps) {
  const href = url || '#'

  return (
    <a
      className="facebook-button"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ver transmisión en la página de Facebook"
    >
      <svg className="fb-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.1 1.2-3.2 3-3.2.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 2.9h-1.8v7A10 10 0 0022 12z" />
      </svg>
      <span className="fb-text">Ver en Facebook</span>
    </a>
  )
}