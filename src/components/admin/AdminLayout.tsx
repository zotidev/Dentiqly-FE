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
  const [searchQuery, setSearchQuery] = useState('')
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

  const filterChips = [
    { label: 'Pacientes', view: 'patients' },
    { label: 'Turnos', view: 'calendar' },
    { label: 'Servicios', view: 'services' },
    { label: 'Profesionales', view: 'professionals' },
  ]

  const userInitials = user
    ? `${(user.nombre || '').charAt(0)}${(user.apellido || '').charAt(0)}`.toUpperCase()
    : 'AD'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#F5F0EA] flex flex-col lg:flex-row">
      {/* ═══ MOBILE TOP BAR ═══ */}
      <div className="lg:hidden h-14 bg-[#EBE4DB] border-b border-[#DDD6CC] flex items-center justify-between px-4 sticky top-0 z-[45]">
        <div className="flex items-center gap-2">
          <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-7 w-auto" />
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-[#DDD6CC] rounded-xl text-gray-600 transition-all active:scale-95"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ═══ SIDEBAR ═══ */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0 flex`}>
        <div className="w-[250px] bg-[#EBE4DB] flex flex-col overflow-hidden border-r border-[#DDD6CC]">

          {/* Logo */}
          <div className="flex items-center px-5 h-[64px] border-b border-[#DDD6CC]">
            <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-8 w-auto" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 overflow-y-auto no-scrollbar pt-4 pb-4">
            <div className="space-y-5">
              {menuGroups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 mb-1.5 text-[10px] font-bold text-[#9C9489] uppercase tracking-[0.14em]">
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
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-xl transition-all duration-150 ${
                            isActive
                              ? 'bg-[#0B1023] text-white shadow-sm'
                              : 'text-[#6B6560] hover:bg-[#DDD6CC] hover:text-[#3D3832]'
                          }`}
                        >
                          <Icon className={`h-[16px] w-[16px] flex-shrink-0 ${
                            isActive ? 'text-white' : ''
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
          <div className="px-3 pb-3 border-t border-[#DDD6CC] pt-3">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563FF] to-[#7C3AED] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#3D3832] truncate leading-tight">
                  {user?.nombre || 'Admin'} {user?.apellido || ''}
                </p>
                <p className="text-[10px] text-[#9C9489] truncate">{user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#9C9489] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="h-[16px] w-[16px]" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 mt-4 ml-2 h-fit bg-black/20 backdrop-blur-sm rounded-full text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ═══ OVERLAY (mobile) ═══ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="hidden lg:flex h-[60px] items-center justify-between px-8 sticky top-0 z-30 bg-[#F5F0EA] border-b border-[#E8E0D6]/50">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9C9489]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E0D6] rounded-xl text-sm text-gray-700 placeholder:text-[#B5AFA8] focus:outline-none focus:border-[#2563FF] focus:ring-2 focus:ring-[#2563FF]/10 transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {filterChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => onViewChange(chip.view)}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap ${
                    currentView === chip.view
                      ? 'bg-[#0B1023] text-white'
                      : 'text-[#9C9489] bg-white border border-[#E8E0D6] hover:bg-[#EBE4DB] hover:text-[#6B6560]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <button
              onClick={() => onViewChange('recordatorios')}
              className="relative p-2 bg-white border border-[#E8E0D6] rounded-xl hover:bg-[#EBE4DB] transition-all"
            >
              <Bell className="h-4 w-4 text-[#9C9489]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#2563FF] rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-white border border-[#E8E0D6] rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563FF] to-[#7C3AED] flex items-center justify-center text-white text-[10px] font-bold">
                {userInitials}
              </div>
              <span className="text-sm font-semibold text-[#3D3832]">{user?.nombre || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 no-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
