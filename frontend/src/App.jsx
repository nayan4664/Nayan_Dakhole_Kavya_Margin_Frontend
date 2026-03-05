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
      {isAuthenticated ? <Sidebar /> : null}
      {isAuthenticated ? <Topbar /> : null}
      <ToastProvider>
        <div className={isAuthenticated ? "main-content" : "main-content unauth"}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
              <Route path="/modules/:slug" element={<ProtectedRoute><ModuleDetail /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </div>
      </ToastProvider>
    </>
  )
}
