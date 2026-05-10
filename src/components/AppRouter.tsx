import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { dentalColors } from '../config/colors'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '../lib/api-client'

// Import components
import { BookingForm } from './booking/BookingForm'
import { AdminApp } from './admin/AdminApp'
import { PatientApp } from './patient-portal/PatientApp'
import { LandingPage } from './landing/LandingPage'
import { LoginPage } from './auth/LoginPage'
import { RegisterPage } from './auth/RegisterPage'
import { SuperAdminApp } from './superadmin/SuperAdminApp'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563FF]"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

/**
 * BookingLayout con slug del tenant.
 * Setea el tenantSlug en el apiClient para que todas las llamadas
 * del wizard de booking vayan a /api/public/:slug/
 */
const BookingWithSlug: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  useEffect(() => {
    if (slug) {
      apiClient.setTenantSlug(slug)
    }
    return () => {
      apiClient.setTenantSlug(null)
    }
  }, [slug])

  if (!slug) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: dentalColors.gray50 }}>
      <main className="flex-1 py-8">
        <BookingForm />
      </main>
    </div>
  )
}

const BookingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: dentalColors.gray50 }}>
      <main className="flex-1 py-8">
        <BookingForm />
      </main>
    </div>
  )
}

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Booking público por slug de clínica */}
      <Route path="/booking/:slug" element={<BookingWithSlug />} />
      
      {/* Legacy booking sin slug */}
      <Route path="/reserva" element={<BookingLayout />} />
      
      {/* Super Admin Protected Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <SuperAdminApp />
          </ProtectedRoute>
        } 
      />

      {/* Tenant Admin Protected Routes */}
      <Route 
        path="/:slug/admin/*" 
        element={
          <ProtectedRoute>
            <AdminApp />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/paciente/*" element={<PatientApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}