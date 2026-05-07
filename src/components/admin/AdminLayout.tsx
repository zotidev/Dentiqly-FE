import React, { useState } from 'react'
import { dentalColors } from '../../config/colors'
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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: string) => void
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentView,
  onViewChange
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'patients', label: 'Pacientes', icon: UserCog },
    { id: 'professionals', label: 'Profesionales', icon: Users },
    { id: 'services', label: 'Servicios', icon: Briefcase },
    { id: 'liquidaciones', label: 'Liquidaciones', icon: DollarSign },
    { id: 'debtors', label: 'Reporte de deudores', icon: FileText },
    { id: 'cashflow', label: 'Flujo de caja', icon: Wallet },
    { id: 'feriados', label: 'Feriados', icon: Calendar },
    { id: 'ausencias', label: 'Ausencias/Vacaciones', icon: CalendarOff },
    { id: 'obras-sociales', label: 'Obras Sociales', icon: Shield },
    { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ]

  const handleLogout = () => {
    // Implementar logout
    console.log('Logout')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transition-all duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'w-20' : 'w-64'} lg:static lg:inset-0`}>

        {/* Header del sidebar */}
        <div className={`flex items-center justify-between h-16 border-b border-[${dentalColors.gray200}] ${isCollapsed ? 'px-4' : 'px-6'}`}>
          <div className="flex items-center overflow-hidden">
            <img
              src="/assets/odaf-logo.png"
              alt="ODAF"
              className={`h-8 w-auto transition-all ${isCollapsed ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100'}`}
            />
            {isCollapsed && (
               <img
               src="/assets/odaf-logo.png"
               alt="ODAF"
               className="h-8 w-8 object-contain"
             />
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              title={isCollapsed ? "Expandir menú" : "Contraer menú"}
            >
              {isCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto no-scrollbar">
          <div className="space-y-1">
            {menuItems.map((item) => {
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
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-bold capitalize tracking-tight rounded-xl transition-all duration-200 group ${isActive
                    ? `bg-[#026498] text-white shadow-md`
                    : `text-gray-500 hover:bg-gray-100 hover:text-gray-900`
                    } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-transform ${isActive ? '' : 'group-hover:scale-110'} ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
                  <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Logout button */}
        <div className={`absolute bottom-6 left-3 right-3 transition-all duration-300`}>
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-bold capitalize tracking-tight text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              Cerrar Sesión
            </span>
          </button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col h-screen overflow-hidden">
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}