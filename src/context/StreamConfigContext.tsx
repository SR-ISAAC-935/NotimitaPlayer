import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'streamConfig'

// 1. Estructura de los datos de configuración
export interface StreamConfig {
  streamKey: string
  fbRestreamingKey: string
  match: string
  authToken: string
  playbackUrl: string
  streamStatus: string | null
}

// Valores iniciales por defecto
const initialConfig: StreamConfig = {
  streamKey: '',
  fbRestreamingKey: '',
  match: '',
  authToken: '',
  playbackUrl: '',
  streamStatus: null,
}

// 2. Estructura del Contexto
export interface StreamConfigContextType {
  config: StreamConfig
  updateConfig: (updates: Partial<StreamConfig>) => void
}

// 3. Props para el Provider
interface StreamConfigProviderProps {
  children: ReactNode
}

// Inicialización del Contexto con soporte para nulo
const StreamConfigContext = createContext<StreamConfigContextType | null>(null)

export function StreamConfigProvider({ children }: StreamConfigProviderProps): React.JSX.Element {
  const [config, setConfig] = useState<StreamConfig>(() => {
    if (typeof window === 'undefined') {
      return initialConfig
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as StreamConfig) : initialConfig
    } catch {
      return initialConfig
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      // No-op si localStorage falla.
    }
  }, [config])

  function updateConfig(updates: Partial<StreamConfig>): void {
    setConfig((current) => ({ ...current, ...updates }))
  }

  return (
    <StreamConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </StreamConfigContext.Provider>
  )
}

export function useStreamConfig(): StreamConfigContextType {
  const context = useContext(StreamConfigContext)

  if (!context) {
    throw new Error('useStreamConfig debe usarse dentro de StreamConfigProvider')
  }

  return context
}