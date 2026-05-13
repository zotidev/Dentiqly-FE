import React, { useState } from 'react'
import {
  Calendar,
  Users,
  Briefcase,
  Settings,
  LogOut,
  X,
  Home,
  UserCog,
  FileText,
  Wallet,
  DollarSign,
  CalendarOff,
  Shield,
  Bell,
  PanelLeftClose,
  PanelLeft,
  Menu,
  Search,
  ChevronDown,
  Sparkles,
  MapPin as MapIcon,
  LayoutDashboard,
  Activity,
  Building2,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface AdminLayoutProps {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: string) => void
}

interface MenuGroup {
  label: string
  items: { id: string; label: string; icon: React.ElementType; badge?: number }[]
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentView,
  onViewChange
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user } = useAuth()

  const menuGroups: MenuGroup[] = [
    {
      label: 'General',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'calendar', label: 'Calendario', icon: Calendar },
      ]
    },
    {
      label: 'Gestión',
      items: [
        { id: 'patients', label: 'Pacientes', icon: UserCog },
        { id: 'professionals', label: 'Profesionales', icon: Users },
        { id: 'services', label: 'Servicios', icon: Briefcase },
        { id: 'obras-sociales', label: 'Obras Sociales', icon: Shield },
      ]
    },
    {
      label: 'Finanzas',
      items: [
        { id: 'liquidaciones', label: 'Liquidaciones', icon: DollarSign },
        { id: 'debtors', label: 'Deudores', icon: FileText },
        { id: 'cashflow', label: 'Flujo de Caja', icon: Wallet },
      ]
    },
    {
      label: 'Organización',
      items: [
        { id: 'feriados', label: 'Feriados', icon: Calendar },
        { id: 'ausencias', label: 'Ausencias', icon: CalendarOff },
        { id: 'sucursales', label: 'Sucursales', icon: MapIcon },
        { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
      ]
    },
    {
      label: 'Sistema',
      items: [
        { id: 'settings', label: 'Configuración', icon: Settings },
      ]
    }
  ]

  const allItems = menuGroups.flatMap(g => g.items)
  const currentItem = allItems.find(i => i.id === currentView)

  const userInitials = user
    ? `${(user.nombre || '').charAt(0)}${(user.apellido || '').charAt(0)}`.toUpperCase()
    : 'AD'

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col lg:flex-row">
      {/* ═══ MOBILE TOP BAR ═══ */}
      <div className="lg:hidden h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-4 sticky top-0 z-[45]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-blue-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-extrabold bg-gradient-to-r from-[#0B1023] to-[#2563FF] bg-clip-text text-transparent tracking-tight">
            Dentiqly
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-500 transition-all active:scale-95"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ═══ SIDEBAR ═══ */}
      <div className={`fixed inset-y-0 left-0 z-50 gradient-sidebar shadow-sidebar transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${isCollapsed ? 'lg:w-[78px]' : 'lg:w-[260px]'} w-[280px] lg:static lg:inset-0 flex flex-col`}>

        {/* Sidebar decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563FF] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-[#02E3FF] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* Logo area */}
        <div className={`flex items-center h-[72px] border-b border-white/[0.06] ${isCollapsed ? 'lg:justify-center lg:px-3 justify-between px-5' : 'justify-between px-5'}`}>
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'lg:w-0 lg:opacity-0 lg:gap-0' : 'w-auto opacity-100'}`}>
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-blue-glow shrink-0">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold text-white tracking-tight leading-none">
                Dentiqly
              </span>
              <span className="text-[10px] font-medium text-blue-400/60 tracking-widest uppercase mt-0.5">
                Admin Panel
              </span>
            </div>
          </div>
          {/* Collapsed logo */}
          {isCollapsed && (
            <div className="hidden lg:flex w-9 h-9 rounded-xl gradient-primary items-center justify-center shadow-blue-glow shrink-0">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 hover:bg-white/[0.06] rounded-lg text-gray-500 hover:text-gray-300 transition-all"
              title={isCollapsed ? "Expandir menú" : "Contraer menú"}
            >
              {isCollapsed ? <PanelLeft className="h-4.5 w-4.5" /> : <PanelLeftClose className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/[0.06] rounded-lg text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 flex-1 overflow-y-auto dark-scrollbar pb-24">
          <div className="space-y-6">
            {menuGroups.map((group) => (
              <div key={group.label}>
                {!isCollapsed && (
                  <p className="px-3 mb-2 text-[10px] font-semibold text-gray-500/80 uppercase tracking-[0.15em]">
                    {group.label}
                  </p>
                )}
                {isCollapsed && <div className="lg:mb-1 lg:border-t lg:border-white/[0.04] lg:pt-2" />}
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
                        title={isCollapsed ? item.label : undefined}
                        className={`relative w-full flex items-center px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-200 group ${
                          isActive
                            ? 'sidebar-item-active text-white'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                        } ${isCollapsed ? 'lg:justify-center' : ''}`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full bg-gradient-to-b from-[#2563FF] to-[#02E3FF]" />
                        )}
                        <Icon className={`h-[18px] w-[18px] flex-shrink-0 transition-all duration-200 ${
                          isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'
                        } ${isCollapsed ? 'lg:mr-0' : 'mr-3'}`} />
                        <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                          isCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'
                        }`}>
                          {item.label}
                        </span>
                        {item.badge && !isCollapsed && (
                          <span className="ml-auto text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/[0.06]">
          {/* User info */}
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 hover:bg-white/[0.04] transition-all cursor-pointer ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-blue-500/20">
              {userInitials}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden ${isCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {user?.nombre || 'Admin'} {user?.apellido || ''}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                {user?.email || 'admin@clinica.com'}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => console.log('Logout')}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
            className={`w-full flex items-center px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group ${isCollapsed ? 'lg:justify-center' : ''}`}
          >
            <LogOut className={`h-[18px] w-[18px] flex-shrink-0 transition-all group-hover:text-red-400 ${isCollapsed ? 'lg:mr-0' : 'mr-3'}`} />
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
              Cerrar Sesión
            </span>
          </button>
        </div>
      </div>

      {/* ═══ OVERLAY (mobile) ═══ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="hidden lg:flex h-[72px] bg-white/60 backdrop-blur-xl border-b border-gray-200/40 items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {currentItem?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-56 pl-10 pr-4 py-2.5 bg-gray-100/80 border border-transparent rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all group">
              <Bell className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200/60" />

            {/* User avatar in header */}
            <button className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 hover:bg-gray-100 rounded-xl transition-all">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {userInitials}
              </div>
              <span className="text-sm font-semibold text-gray-700">{user?.nombre || 'Admin'}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
