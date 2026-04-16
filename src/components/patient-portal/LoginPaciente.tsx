import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { patientPortalApi, setPatientToken, getPatientToken } from "../../api/patient-portal"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { dentalColors } from "../../config/colors"

export const LoginPaciente: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [dni, setDni] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = getPatientToken()
    if (token) {
      navigate("/paciente/dashboard")
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await patientPortalApi.login(email, dni)
      setPatientToken(response.token)
      navigate("/paciente/dashboard")
    } catch (err: any) {
      setError(err.message || "Credenciales invalidas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: dentalColors.gray50 }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: dentalColors.primary }}>
            Mi Portal ODAF
          </h1>
          <p className="mt-2" style={{ color: dentalColors.gray600 }}>
            Gestioná tus turnos y datos de salud
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: dentalColors.gray700 }}>
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: dentalColors.gray700 }}>
                  DNI (como contrasena)
                </label>
                <Input
                  type="password"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="Tu numero de DNI"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-red-50 text-red-600 text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: dentalColors.gray600 }}>
              No tenes cuenta? Tu cuenta se crea automaticamente al reservar un turno.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t">
            <Link to="/" className="block text-center text-sm" style={{ color: dentalColors.primary }}>
              Reservar un turno
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
