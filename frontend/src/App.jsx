import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const Customers = React.lazy(()=>import('./pages/Customers'))
const Events = React.lazy(()=>import('./pages/Events'))
const Reports = React.lazy(()=>import('./pages/Reports'))
const Modules = React.lazy(()=>import('./pages/Modules'))
const ModuleDetail = React.lazy(()=>import('./pages/ModuleDetail'))
const Employees = React.lazy(()=>import('./pages/Employees'))
const Projects = React.lazy(()=>import('./pages/Projects'))
const Analytics = React.lazy(()=>import('./pages/Analytics'))
import Sidebar from './components/Sidebar'
import Layout from "./components/Layout"
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
const Register = React.lazy(()=>import('./pages/Register'))
const Forgot = React.lazy(()=>import('./pages/Forgot'))
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import Topbar from './components/Topbar'
import { ToastProvider } from './components/ToastProvider'

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  )
}

function AppShell(){
  const { isAuthenticated } = useAuth()
  return (
    <>
    
      <ToastProvider>
        <div className={isAuthenticated ? "main-content" : "main-content unauth"}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>

<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot" element={<Forgot />} />

<Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>

  <Route path="/" element={<Dashboard />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/customers" element={<Customers />} />
  <Route path="/events" element={<Events />} />
  <Route path="/reports" element={<Reports />} />
  <Route path="/modules" element={<Modules />} />
  <Route path="/modules/:slug" element={<ModuleDetail />} />
  <Route path="/employees" element={<Employees />} />
  <Route path="/projects" element={<Projects />} />
  <Route path="/analytics" element={<Analytics />} />

</Route>

</Routes>
          </Suspense>
        </div>
      </ToastProvider>
    </>
  )
}
