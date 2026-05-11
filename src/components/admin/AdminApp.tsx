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
import { SettingsManager } from './SettingsManager'
import { apiClient } from '../../lib/api-client'
import { AlertTriangle, XCircle, Clock, CreditCard, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react'

interface SubscriptionStatus {
  subscription_status: 'pending_payment' | 'trialing' | 'active' | 'past_due' | 'suspended' | 'cancelled'
  trial_ends_at?: string
  grace_period_ends_at?: string
  nombre?: string
  slug?: string
}

const PendingPaymentScreen: React.FC<{ clinicaNombre?: string }> = ({ clinicaNombre }) => {
  const [paying, setPaying] = useState(false)

  const handlePayment = async () => {
    setPaying(true)
    try {
      const response = await apiClient.post<{ init_point: string }>('/billing/create-preference')
      if (response.init_point) {
        window.location.href = response.init_point
      }
    } catch (error) {
      console.error('Error al iniciar pago:', error)
      alert('Hubo un error al conectar con MercadoPago. Por favor, intenta de nuevo o contacta a soporte.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-[#0A0F2D] p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
          <div className="relative z-10">
            <div className="inline-flex p-3 bg-blue-500/20 rounded-2xl mb-4 backdrop-blur-sm border border-white/10">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Bienvenido a Dentiqly!</h1>
            <p className="text-blue-100/80">Tu clínica <span className="text-white font-semibold">{clinicaNombre || 'seleccionada'}</span> está en proceso de activación.</p>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
            <Clock className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Activación pendiente de pago</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Para comenzar a usar todas las funciones de Dentiqly, completa tu suscripción. Una vez verificado el pago, tu cuenta será activada manualmente en minutos.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-400" />
                Medios de Pago
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Transferencia / Alias</p>
                  <p className="font-mono text-sm text-gray-800 font-bold">dentiqly.saas.dental</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">CBU</p>
                  <p className="font-mono text-sm text-gray-800 font-bold">0000003100094857362514</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2563FF] text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {paying ? (
                    <>
                      <Clock className="h-5 w-5 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pagar Suscripción ($80.000)
                    </>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2 italic">Procesado de forma segura por MercadoPago</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                ¿Ya pagaste?
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Envíanos el comprobante por WhatsApp para una activación inmediata.</p>
                <a 
                  href="https://wa.me/5491100000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                >
                  <MessageSquare className="h-5 w-5" />
                  Enviar Comprobante
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="text-sm text-gray-500">Si tienes dudas o necesitas asistencia:</p>
                <p className="font-bold text-gray-900">soporte@dentiqly.com</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-2"
              >
                Actualizar estado
                <CheckCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (subscriptionStatus?.subscription_status === 'pending_payment') {
    return <PendingPaymentScreen clinicaNombre={subscriptionStatus.nombre} />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          slug={subscriptionStatus?.slug} 
          onNavigateToCalendar={() => setCurrentView('calendar')} 
        />
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
        return <SettingsManager />
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