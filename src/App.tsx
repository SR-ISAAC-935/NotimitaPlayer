import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { StreamConfigProvider } from './context/StreamConfigContext'
import Home from './components/home/Home'
import AdminLogin from './components/AdminLogin/AdminLogin'
import StreamConfigForm from './components/streamconfigform/StreamConfigForm'
import './App.css'

const ADMIN_ROUTE = '/panel-canal-2026'
const CONFIG_ROUTE = '/config-canal-2026'

function AdminLoginWrapper(): React.JSX.Element {
  const navigate = useNavigate()
  return <AdminLogin onSuccess={() => navigate(CONFIG_ROUTE)} />
}

function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path={ADMIN_ROUTE} element={<AdminLoginWrapper />} />
      <Route path={CONFIG_ROUTE} element={<StreamConfigForm />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <StreamConfigProvider>
        <AppRoutes />
      </StreamConfigProvider>
    </BrowserRouter>
  )
}