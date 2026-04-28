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
  CalendarOff
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
    { id: 'settings', label: 'Configuración', icon: Settings },
  ]

  const handleLogout = () => {
    // Implementar logout
    console.log('Logout')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>

        {/* Header del sidebar */}
        <div className={`flex items-center justify-between h-16 px-6 border-b border-[${dentalColors.gray200}]`}>
          <div className="flex items-center">
            <img
              src="/assets/odaf-logo.png"
              alt="ODAF"
              className="h-8 w-auto"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
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
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                    ? `bg-[${dentalColors.primary}] text-white`
                    : `text-[${dentalColors.gray700}] hover:bg-[${dentalColors.gray100}] hover:text-[${dentalColors.gray900}]`
                    }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-6 left-3 right-3">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium text-[${dentalColors.gray700}] hover:bg-[${dentalColors.gray100}] hover:text-[${dentalColors.gray900}] rounded-lg transition-colors duration-200`}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
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
      <div className="flex-1 lg:ml-0">
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}