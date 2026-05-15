import React from "react"
import { Link } from "react-router-dom"
import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react"

export const FooterSection: React.FC = () => {
  return (
    <footer className="bg-[#FAFCFF] border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <img
              src="/assets/dentiqly-logo.png"
              alt="Dentiqly"
              className="h-8 w-auto mb-6"
            />
            <p className="text-gray-500 text-sm mb-8 pr-4">
              Software de gestion dental de proxima generacion para clinicas que
              exigen lo mejor.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#2563FF] hover:border-[#2563FF]/30 hover:bg-blue-50 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#0A0F2D] mb-6">Plataforma</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <a href="#funcionalidades" className="hover:text-[#2563FF] transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#precios" className="hover:text-[#2563FF] transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2563FF] transition-colors">
                  Seguridad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2563FF] transition-colors">
                  Actualizaciones
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0A0F2D] mb-6">Recursos</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-[#2563FF] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2563FF] transition-colors">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2563FF] transition-colors">
                  Guias
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2563FF] transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0A0F2D] mb-6">Compania</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <Link to="/sobre-nosotros" className="hover:text-[#2563FF] transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <a href="mailto:hola@dentiqly.com" className="hover:text-[#2563FF] transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@dentiqly.com"
                  className="hover:text-[#2563FF] transition-colors"
                >
                  hola@dentiqly.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Dentiqly. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/privacidad" className="hover:text-[#2563FF] transition-colors">
              Privacidad
            </Link>
            <Link to="/terminos" className="hover:text-[#2563FF] transition-colors">
              Terminos
            </Link>
            <Link to="/cookies" className="hover:text-[#2563FF] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
