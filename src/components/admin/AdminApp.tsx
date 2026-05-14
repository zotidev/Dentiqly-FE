import React, { useState, useEffect } from 'react'
import { AdminLayout } from './AdminLayout'
import { Dashboard } from './Dashboard'
import { CalendarView } from './CalendarView'
import { ProfessionalsManager } from './ProfessionalsManager'
import { ServicesManager } from './ServicesManager'
import { PatientsView } from '../patients/PatientsView'
import { ObrasSocialesManager } from './ObrasSocialesManager'
import { RemindersView } from './RemindersView'
import { LiquidacionesManager } from './LiquidacionesManager'
import DebtorsReport from './DebtorsReport'
import CashFlow from './CashFlow'
import { FeriadosManager } from './FeriadosManager'
import { AusenciasManager } from './AusenciasManager'
import { SucursalesManager } from './SucursalesManager'
import { SettingsManager } from './SettingsManager'
import { UsersManager } from './UsersManager'
import { apiClient } from '../../lib/api-client'
import { OnboardingWizard } from './OnboardingWizard'
import { AlertTriangle, XCircle, Clock } from 'lucide-react'

interface SubscriptionStatus {
  subscription_status: 'pending_payment' | 'trialing' | 'active' | 'past_due' | 'suspended' | 'cancelled'
  trial_ends_at?: string
  grace_period_ends_at?: string
  nombre?: string
  slug?: string
}

const SubscriptionBanner: React.FC<{ status: SubscriptionStatus }> = ({ status }) => {
  const { subscription_status, trial_ends_at, grace_period_ends_at } = status

  if (subscription_status === 'trialing' && trial_ends_at) {
    const daysLeft = Math.max(0, Math.ceil((new Date(trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    if (daysLeft > 7) return null
    return (
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center gap-2 text-blue-800 text-sm">
        <Clock className="h-4 w-4 shrink-0" />
        <span>Tu período de prueba vence en <strong>{daysLeft} día{daysLeft !== 1 ? 's' : ''}</strong>. Suscríbete para continuar usando Dentiqly.</span>
      </div>
    )
  }

  if (subscription_status === 'past_due') {
    const graceEnd = grace_period_ends_at ? new Date(grace_period_ends_at).toLocaleDateString('es-AR') : 'pronto'
    return (
      <div className="bg-amber-50 border-b border-amber-300 px-4 py-2 flex items-center gap-2 text-amber-900 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>⚠️ Pago pendiente. Tienes acceso hasta el <strong>{graceEnd}</strong>. Por favor, regulariza tu suscripción.</span>
      </div>
    )
  }

  if (subscription_status === 'suspended') {
    return (
      <div className="bg-red-50 border-b border-red-300 px-4 py-3 flex items-center gap-2 text-red-900 text-sm">
        <XCircle className="h-4 w-4 shrink-0" />
        <span>🔴 Tu suscripción está <strong>suspendida</strong>. Algunas funciones pueden estar limitadas. Contactá a soporte para reactivar tu cuenta.</span>
      </div>
    )
  }

  return null
}

export const AdminApp: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard')
  const [navParams, setNavParams] = useState<Record<string, any>>({})
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const handleNavigate = (view: string, params?: Record<string, any>) => {
    setCurrentView(view)
    setNavParams(params || {})
  }

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const data = await apiClient.get<SubscriptionStatus>('/billing/status')
        setSubscriptionStatus(data)
      } catch {
        // Silencioso
      } finally {
        setLoading(false)
      }
    }
    fetchSubscriptionStatus()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-10 w-auto animate-pulse-soft" />
          <div className="w-8 h-8 border-2 border-[#2563FF] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (subscriptionStatus?.subscription_status === 'pending_payment') {
    return <OnboardingWizard clinicaNombre={subscriptionStatus.nombre} onComplete={() => window.location.reload()} />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard
          slug={subscriptionStatus?.slug}
          onNavigate={handleNavigate}
        />
      case 'calendar':
        return <CalendarView onNavigate={handleNavigate} />
      case 'patients':
        return <PatientsView initialPatientId={navParams.patientId} initialSearchTerm={navParams.searchTerm} />
      case 'professionals':
        return <ProfessionalsManager />
      case 'services':
        return <ServicesManager />
      case 'liquidaciones':
        return <LiquidacionesManager />
      case 'debtors':
        return <DebtorsReport />
      case 'cashflow':
        return <CashFlow />
      case 'feriados':
        return <FeriadosManager />
      case 'ausencias':
        return <AusenciasManager />
      case 'obras-sociales':
        return <ObrasSocialesManager />
      case 'recordatorios':
        return <RemindersView />
      case 'sucursales':
        return <SucursalesManager />
      case 'usuarios':
        return <UsersManager />
      case 'settings':
        return <SettingsManager />
      default:
        return <Dashboard />
    }
  }

  return (
    <AdminLayout currentView={currentView} onViewChange={setCurrentView} onSearch={(q) => handleNavigate('patients', { searchTerm: q })}>
      {subscriptionStatus && <SubscriptionBanner status={subscriptionStatus} />}
      {renderCurrentView()}
    </AdminLayout>
  )
}