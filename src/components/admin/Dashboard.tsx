import React, { useEffect, useState } from 'react'
import { Card } from '../ui/Card'
import {
  Calendar,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react'
import { turnosApi, profesionalesApi, serviciosApi } from '../../api'
import type { Turno } from '../../types'

interface DashboardStats {
  totalTurnos: number
  turnosHoy: number
  totalProfesionales: number
  totalServicios: number
  turnosPorEstado: Record<string, number>
  ingresoTotal: number
  ingresoPendiente: number
  turnosRecientes: Turno[]
  turnosPorProf: Record<string, number>
  appointmentTrend: { fecha: string; count: number }[]
  pagosPendientes: number
  turnosPendientesPago: Turno[]
}

export const Dashboard: React.FC<{ onNavigateToCalendar?: () => void }> = ({ onNavigateToCalendar }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTurnos: 0,
    turnosHoy: 0,
    totalProfesionales: 0,
    totalServicios: 0,
    turnosPorEstado: {},
    ingresoTotal: 0,
    ingresoPendiente: 0,
    turnosRecientes: [],
    turnosPorProf: {},
    appointmentTrend: [],
    pagosPendientes: 0,
    turnosPendientesPago: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [turnosResponse, profesionalesResponse, serviciosResponse] = await Promise.all([
          turnosApi.listar({ limit: 1000 }),
          profesionalesApi.listar({ estado: 'Activo' }),
          serviciosApi.listar()
        ])

        const turnos = turnosResponse.data || []
        const profesionales = profesionalesResponse.data || []

        // Calculate stats
        const today = new Date().toISOString().split('T')[0]
        const turnosHoy = turnos.filter(turno => turno.fecha === today).length

        // Count by status
        const turnosPorEstado: Record<string, number> = {}
        turnos.forEach(turno => {
          turnosPorEstado[turno.estado] = (turnosPorEstado[turno.estado] || 0) + 1
        })

        // Revenue calculations - sum from all turnos with precio_final OR service price
        const ingresoTotal = turnos
          .filter(t => t.estado === 'Atendido')
          .reduce((acc, t) => {
            const precio = Number(t.precio_final) || Number(t.subservicio?.precio) || Number(t.servicio?.precio_base) || 0
            return acc + precio
          }, 0)

        const ingresoPendiente = turnos
          .filter(t => t.estado === 'Pendiente' || t.estado === 'Confirmado por email')
          .reduce((acc, t) => {
            const precio = Number(t.precio_final) || Number(t.subservicio?.precio) || Number(t.servicio?.precio_base) || 0
            return acc + precio
          }, 0)

        // Recent appointments (last 5)
        const turnosRecientes = [...turnos]
          .sort((a, b) => {
            const dateComparison = b.fecha.localeCompare(a.fecha)
            if (dateComparison !== 0) return dateComparison
            return b.hora_inicio.localeCompare(a.hora_inicio)
          })
          .slice(0, 5)

        // Appointments per professional
        const turnosPorProf: Record<string, number> = {}
        turnos.forEach(turno => {
          if (turno.profesional) {
            const key = `${turno.profesional.nombre} ${turno.profesional.apellido}`
            turnosPorProf[key] = (turnosPorProf[key] || 0) + 1
          }
        })

        // Last 7 days trend
        const appointmentTrend: { fecha: string; count: number }[] = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const count = turnos.filter(t => t.fecha === dateStr).length
          appointmentTrend.push({ fecha: dateStr, count })
        }

        // Count pending payments
        const turnosPendientesPago = turnos.filter(
          t => t.estado === 'Pendiente' && !t.pago_confirmado
        )
        const pagosPendientes = turnosPendientesPago.length

        setStats({
          totalTurnos: turnos.length,
          turnosHoy,
          totalProfesionales: profesionales.length,
          totalServicios: serviciosResponse.data?.length || 0,
          turnosPorEstado,
          ingresoTotal,
          ingresoPendiente,
          turnosRecientes,
          turnosPorProf,
          appointmentTrend,
          pagosPendientes,
          turnosPendientesPago
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleProcessPayment = async (id: number, confirm: boolean) => {
    try {
      await turnosApi.confirmarPago(id, confirm)
      // Update local state to remove processed appointment
      setStats(prev => ({
        ...prev,
        pagosPendientes: prev.pagosPendientes - 1,
        turnosPendientesPago: prev.turnosPendientesPago.filter(t => t.id !== id),
        // Update other stats optimistically if needed, or just let them be until refresh
        turnosHoy: prev.turnosHoy, // Keep as is for now
      }))
      // Optionally show success toast
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Error al procesar el pago')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const statCards = [
    {
      title: 'Turnos Hoy',
      value: stats.turnosHoy,
      icon: Calendar,
      color: '#026498',
      bgColor: '#02649810'
    },
    {
      title: 'Total Turnos',
      value: stats.totalTurnos,
      icon: Clock,
      color: '#3B82F6',
      bgColor: '#3B82F610'
    },
    {
      title: 'Profesionales',
      value: stats.totalProfesionales,
      icon: Users,
      color: '#10B981',
      bgColor: '#10B98110'
    },
    {
      title: 'Ingresos Total',
      value: formatCurrency(stats.ingresoTotal),
      icon: DollarSign,
      color: '#F59E0B',
      bgColor: '#F59E0B10'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const maxTrendValue = Math.max(...stats.appointmentTrend.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Panel de Control - ODAF
        </h2>
        <p className="text-gray-600">
          Resumen de actividad y métricas del centro odontológico
        </p>
      </div>

      {/* Pending Payments Alert */}
      {stats.pagosPendientes > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="mb-3">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-yellow-800">
                {stats.pagosPendientes} {stats.pagosPendientes === 1 ? 'pago pendiente' : 'pagos pendientes'} de confirmación
              </h3>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {stats.turnosPendientesPago.map(turno => (
              <div key={turno.id} className="bg-white p-4 rounded-md shadow-sm border border-yellow-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {turno.paciente?.nombre} {turno.paciente?.apellido}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(turno.fecha).toLocaleDateString()} - {turno.hora_inicio} hs
                  </div>
                  <div className="text-sm text-gray-500">
                    Prof: {turno.profesional?.nombre} {turno.profesional?.apellido}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleProcessPayment(turno.id, true)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleProcessPayment(turno.id, false)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon className="h-7 w-7" style={{ color: stat.color }} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Row 2: Status breakdown and Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turnos por Estado */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Turnos por Estado
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.turnosPorEstado).map(([estado, count]) => {
              const colors: Record<string, string> = {
                'Pendiente': 'bg-yellow-500',
                'Confirmado': 'bg-blue-500',
                'Atendido': 'bg-green-500',
                'Cancelado': 'bg-red-500'
              }
              const percentage = (count / stats.totalTurnos * 100).toFixed(0)
              return (
                <div key={estado}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{estado}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[estado] || 'bg-gray-500'} h-2 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Revenue Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Ingresos
          </h3>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.ingresoTotal)}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700 font-medium">Pendiente de Pago</p>
              <p className="text-2xl font-bold text-yellow-900">{formatCurrency(stats.ingresoPendiente)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 3: Trends and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Tendencia Últimos 7 Días
          </h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {stats.appointmentTrend.map((day, index) => {
              const height = (day.count / maxTrendValue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${height}%`, minHeight: day.count > 0 ? '10px' : '0' }}
                      title={`${day.count} turnos`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">
                    {new Date(day.fecha).getDate()}/{new Date(day.fecha).getMonth() + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-800">{day.count}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent Appointments */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-indigo-600" />
            Turnos Recientes
          </h3>
          <div className="space-y-3">
            {stats.turnosRecientes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No hay turnos recientes</p>
            ) : (
              stats.turnosRecientes.map((turno) => (
                <div key={turno.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {turno.paciente?.nombre} {turno.paciente?.apellido}
                    </p>
                    <p className="text-xs text-gray-600">
                      {turno.servicio?.nombre}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-700">
                      {new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-xs text-gray-500">{turno.hora_inicio}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Professional Stats */}
      {Object.keys(stats.turnosPorProf).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-teal-600" />
            Turnos por Profesional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.turnosPorProf)
              .sort((a, b) => b[1] - a[1])
              .map(([nombre, count]) => (
                <div key={nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{nombre}</span>
                  <span className="text-sm font-bold text-gray-900 bg-white px-3 py-1 rounded-full">{count}</span>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
}