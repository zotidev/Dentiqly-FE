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
import { apiClient } from '../../lib/api-client'
import { AlertTriangle, XCircle, Clock } from 'lucide-react'

interface SubscriptionStatus {
  subscription_status: 'trialing' | 'active' | 'past_due' | 'suspended' | 'cancelled'
  trial_ends_at?: string
  grace_period_ends_at?: string
}

const SubscriptionBanner: React.FC<{ status: SubscriptionStatus }> = ({ status }) => {
  const { subscription_status, trial_ends_at, grace_period_ends_at } = status

  if (subscription_status === 'trialing' && trial_ends_at) {
    const daysLeft = Math.max(0, Math.ceil((new Date(trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    if (daysLeft > 7) return null // No molestar si hay más de 7 días
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const data = await apiClient.get<SubscriptionStatus>('/billing/status')
        setSubscriptionStatus(data)
      } catch {
        // Silencioso: si falla, no mostramos banner pero tampoco bloqueamos
      }
    }
    fetchSubscriptionStatus()
  }, [])

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigateToCalendar={() => setCurrentView('calendar')} />
      case 'calendar':
        return <CalendarView />
      case 'patients':
        return <PatientsView />
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
      case 'settings':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración</h3>
            <p className="text-gray-600">Panel de configuración en desarrollo</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <AdminLayout currentView={currentView} onViewChange={setCurrentView}>
      {subscriptionStatus && <SubscriptionBanner status={subscriptionStatus} />}
      {renderCurrentView()}
    </AdminLayout>
  )
}