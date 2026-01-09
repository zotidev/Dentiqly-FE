import React from 'react'
import { dentalColors } from '../../config/colors'
import { Calendar, Phone, MapPin } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className={`bg-white shadow-sm border-b border-[${dentalColors.gray200}]`}>
      {/* Top bar con información de contacto */}
      <div className={`bg-[${dentalColors.primary}] text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                <span>+54 11 1234-5678</span>
              </div>
              <div className="hidden sm:flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>Av. Corrientes 1234, CABA</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span>Lun - Vie: 8:00 - 20:00 | Sáb: 8:00 - 14:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className={`w-10 h-10 bg-[${dentalColors.primary}] rounded-lg flex items-center justify-center`}>
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className={`text-xl font-bold text-[${dentalColors.gray900}]`}>
                Centro Odontológico
              </h1>
              <p className={`text-sm text-[${dentalColors.gray600}]`}>
                Sistema de Reservas
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className={`text-sm font-medium text-[${dentalColors.gray900}]`}>
                ¿Necesitas ayuda?
              </p>
              <p className={`text-xs text-[${dentalColors.gray600}]`}>
                Llámanos al +54 11 1234-5678
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}