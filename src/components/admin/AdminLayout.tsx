import React, { useState } from 'react'
import {
  Calendar,
  Users,
  Briefcase,
  Settings,
  LogOut,
  X,
  UserCog,
  FileText,
  Wallet,
  DollarSign,
  CalendarOff,
  Shield,
  Bell,
  Menu,
  Search,
  MapPin as MapIcon,
  LayoutDashboard,
  Building2,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface AdminLayoutProps {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: string) => void
}

interface MenuGroup {
  label: string
  items: { id: string; label: string; icon: React.ElementType }[]
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentView,
  onViewChange
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  const menuGroups: MenuGroup[] = [
    {
      label: 'General',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'calendar', label: 'Calendario', icon: Calendar },
        { id: 'patients', label: 'Pacientes', icon: UserCog },
      ]
    },
    {
      label: 'Gestión',
      items: [
        { id: 'professionals', label: 'Profesionales', icon: Users },
        { id: 'services', label: 'Servicios', icon: Briefcase },
        { id: 'obras-sociales', label: 'Obras Sociales', icon: Shield },
      ]
    },
    {
      label: 'Finanzas',
      items: [
        { id: 'liquidaciones', label: 'Liquidaciones', icon: DollarSign },
        { id: 'debtors', label: 'Reporte de deudores', icon: FileText },
        { id: 'cashflow', label: 'Flujo de caja', icon: Wallet },
      ]
    },
    {
      label: 'Herramientas',
      items: [
        { id: 'feriados', label: 'Feriados', icon: Calendar },
        { id: 'ausencias', label: 'Ausencias', icon: CalendarOff },
        { id: 'sucursales', label: 'Sucursales', icon: MapIcon },
        { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
        { id: 'settings', label: 'Configuración', icon: Settings },
      ]
    }
  ]

  const userInitials = user
    ? `${(user.nombre || '').charAt(0)}${(user.apellido || '').charAt(0)}`.toUpperCase()
    : 'AD'

  const filterChips = ['Pacientes', 'Turnos', 'Servicios', 'Profesionales']

  return (
    <div className="min-h-screen bg-[#F5F0EA] flex flex-col lg:flex-row">
      {/* ═══ MOBILE TOP BAR ═══ */}
      <div className="lg:hidden h-16 bg-white border-b border-[#E8E0D6] flex items-center justify-between px-4 sticky top-0 z-[45]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0B1023] flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="text-base font-bold text-[#0B1023] tracking-tight">Dentiqly</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-[#EDE6DD] rounded-xl text-gray-500 transition-all active:scale-95"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ═══ SIDEBAR ═══ */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0 flex`}>
        <div className="w-[260px] bg-[#0B1023] lg:m-3 lg:rounded-2xl flex flex-col overflow-hidden relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 h-[68px] relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563FF] to-[#02E3FF] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-xs font-extrabold">D</span>
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight">dentiqly</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 overflow-y-auto dark-scrollbar pt-2 pb-4">
            <div className="space-y-6">
              {menuGroups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 mb-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.12em]">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = currentView === item.id

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onViewChange(item.id)
                            setSidebarOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-xl transition-all duration-150 group ${
                            isActive
                              ? 'bg-white/[0.1] text-white'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'
                          }`}
                        >
                          <Icon className={`h-[17px] w-[17px] flex-shrink-0 ${
                            isActive ? 'text-[#2563FF]' : 'text-gray-500 group-hover:text-gray-400'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* User + Logout */}
          <div className="px-3 pb-4 relative">
            <div className="border-t border-white/[0.06] pt-3 mb-2" />
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563FF] to-[#7C3AED] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white truncate leading-tight">
                  {user?.nombre || 'Admin'} {user?.apellido || ''}
                </p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email || 'admin@clinica.com'}</p>
              </div>
            </div>
            <button
              onClick={() => console.log('Logout')}
              className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="h-[17px] w-[17px]" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 mt-4 ml-2 h-fit bg-white/10 backdrop-blur-sm rounded-full text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ═══ OVERLAY (mobile) ═══ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="hidden lg:flex h-[68px] items-center justify-between px-8 sticky top-0 z-30 bg-[#F5F0EA]">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pacientes, turnos, servicios..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E0D6] rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#2563FF] focus:ring-2 focus:ring-[#2563FF]/10 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {filterChips.map((chip) => (
                <button
                  key={chip}
                  className="px-3 py-1.5 text-[11px] font-semibold text-gray-500 bg-white border border-[#E8E0D6] rounded-lg hover:bg-[#EDE6DD] hover:text-gray-700 transition-all whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <button className="relative p-2.5 bg-white border border-[#E8E0D6] rounded-xl hover:bg-[#EDE6DD] transition-all shadow-sm">
              <Bell className="h-4.5 w-4.5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#2563FF] rounded-full ring-2 ring-[#F5F0EA]" />
            </button>
            <button className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-white border border-[#E8E0D6] rounded-xl hover:bg-[#EDE6DD] transition-all shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563FF] to-[#7C3AED] flex items-center justify-center text-white text-[10px] font-bold">
                {userInitials}
              </div>
              <span className="text-sm font-semibold text-gray-700">{user?.nombre || 'Admin'}</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8 no-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
