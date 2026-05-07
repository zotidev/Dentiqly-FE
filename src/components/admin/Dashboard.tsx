import React, { useEffect, useState } from 'react'
import { Card } from '../ui/Card'
import {
  Calendar,
  Users,
  Clock,
  Briefcase,
  TrendingUp,
  Activity,
  CheckCircle2
} from 'lucide-react'
import { turnosApi, profesionalesApi, serviciosApi } from '../../api'
import type { Turno } from '../../types'

interface DashboardStats {
  totalTurnos: number
  turnosHoy: number
  totalProfesionales: number
  totalServicios: number
  turnosPorEstado: Record<string, number>
  totalServicios: number
  turnosPorEstado: Record<string, number>
  turnosRecientes: Turno[]
  turnosPorProf: Record<string, number>
  appointmentTrend: { fecha: string; count: number }[]
  appointmentTrend: { fecha: string; count: number }[]
}

export const Dashboard: React.FC<{ onNavigateToCalendar?: () => void }> = ({ onNavigateToCalendar }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTurnos: 0,
    turnosHoy: 0,
    totalProfesionales: 0,
    totalServicios: 0,
    turnosPorEstado: {},
    totalServicios: 0,
    turnosPorEstado: {},
    turnosRecientes: [],
    turnosPorProf: {},
    appointmentTrend: [],
    appointmentTrend: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Calculate date range: 30 days ago to 90 days from now
        const desde = new Date()
        desde.setDate(desde.getDate() - 30)
        const hasta = new Date()
        hasta.setDate(hasta.getDate() + 90)

        const [turnosResponse, profesionalesResponse, serviciosResponse] = await Promise.all([
          turnosApi.listar({
            limit: 5000,
            fecha_desde: desde.toISOString().split('T')[0],
            fecha_hasta: hasta.toISOString().split('T')[0]
          }),
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

        setStats({
          totalTurnos: turnos.length,
          turnosHoy,
          totalProfesionales: profesionales.length,
          totalServicios: serviciosResponse.data?.length || 0,
          turnosPorEstado,
          turnosRecientes,
          turnosPorProf,
          appointmentTrend
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])


  const handleConfirmAll = async () => {
    if (!window.confirm('¿Estás seguro de que quieres confirmar TODOS los turnos pendientes?')) {
      return
    }

    try {
      setLoading(true)
      const response = await turnosApi.confirmarTodosPendientes()
      alert(response.message)
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error('Error confirming all appointments:', error)
      alert('Error al confirmar los turnos')
    } finally {
      setLoading(false)
    }
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
      title: 'Servicios',
      value: stats.totalServicios,
      icon: Briefcase,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Panel de Control - ODAF
          </h2>
          <p className="text-gray-600">
            Resumen de actividad y métricas del centro odontológico
          </p>
        </div>
        <div>
          <button
            onClick={handleConfirmAll}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all transform hover:scale-105"
          >
            <CheckCircle2 className="h-5 w-5" />
            Confirmar todos los pendientes
          </button>
        </div>
      </div>


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

      {/* Row 2: Status breakdown */}
      <div className="grid grid-cols-1 gap-6">
        {/* Turnos por Estado */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Distribución de Turnos por Estado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(stats.turnosPorEstado).map(([estado, count]) => {
              const colors: Record<string, string> = {
                'Pendiente': 'bg-yellow-500',
                'Confirmado': 'bg-blue-500',
                'Atendido': 'bg-green-500',
                'Cancelado': 'bg-red-500',
                'Ausente': 'bg-gray-900'
              }
              const percentage = (count / stats.totalTurnos * 100).toFixed(0)
              return (
                <div key={estado} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{estado}</span>
                    <span className="text-xs font-black text-gray-500">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`${colors[estado] || 'bg-gray-400'} h-1.5 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-right mt-1 text-gray-400 font-bold">{percentage}% del total</p>
                </div>
              )
            })}
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