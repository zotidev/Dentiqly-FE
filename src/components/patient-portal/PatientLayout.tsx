import React, { useState, useEffect } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { patientPortalApi, clearPatientToken } from "../../api/patient-portal"
import { dentalColors } from "../../config/colors"
import { Calendar, User, FileText, Folder, Clock, LogOut, Menu, X, Home } from "lucide-react"

export const PatientLayout: React.FC = () => {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfil = await patientPortalApi.obtenerPerfil()
        setNombre(perfil.paciente.nombre)
      } catch (error) {
        console.error("Error al cargar perfil:", error)
      } finally {
        setLoading(false)
      }
    }
    cargarPerfil()
  }, [])

  const handleLogout = () => {
    clearPatientToken()
    navigate("/paciente/login")
  }

  const navItems = [
    { to: "/paciente/dashboard", icon: Home, label: "Inicio" },
    { to: "/paciente/turnos", icon: Calendar, label: "Mis Turnos" },
    { to: "/paciente/mis-datos", icon: User, label: "Mis Datos" },
    { to: "/paciente/historial", icon: FileText, label: "Mi Historial" },
    { to: "/paciente/tratamientos", icon: Clock, label: "Tratamientos" },
    { to: "/paciente/archivos", icon: Folder, label: "Archivos" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: dentalColors.gray50 }}>
        <div className="text-lg" style={{ color: dentalColors.primary }}>Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: dentalColors.gray50 }}>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b" style={{ borderColor: dentalColors.gray200 }}>
          <h1 className="text-xl font-bold" style={{ color: dentalColors.primary }}>
            Dentiqly
          </h1>
          <p className="text-sm" style={{ color: dentalColors.gray600 }}>
            Portal del Paciente
          </p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: dentalColors.gray200 }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-4 lg:p-8">
        <header className="mb-6 lg:hidden">
          <h2 className="text-lg font-semibold" style={{ color: dentalColors.gray800 }}>
            Hola, {nombre}
          </h2>
        </header>
        <Outlet />
      </main>
    </div>
  )
}
