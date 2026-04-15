import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { LoginPaciente } from "./LoginPaciente"
import { PatientLayout } from "./PatientLayout"
import { DashboardPaciente } from "./DashboardPaciente"
import { MisTurnos } from "./MisTurnos"
import { DetalleTurno } from "./DetalleTurno"
import { CancelarTurno } from "./CancelarTurno"
import { ReprogramarTurno } from "./ReprogramarTurno"
import { MisDatos } from "./MisDatos"
import { MiHistorial } from "./MiHistorial"
import { MisTratamientos } from "./MisTratamientos"
import { MisArchivos } from "./MisArchivos"

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("patientToken")
  if (!token) {
    return <Navigate to="/paciente/login" replace />
  }
  return <>{children}</>
}

export const PatientApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPaciente />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/paciente/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPaciente />} />
        <Route path="turnos" element={<MisTurnos />} />
        <Route path="turnos/:id" element={<DetalleTurno />} />
        <Route path="turnos/:id/cancelar" element={<CancelarTurno />} />
        <Route path="turnos/:id/reprogramar" element={<ReprogramarTurno />} />
        <Route path="mis-datos" element={<MisDatos />} />
        <Route path="historial" element={<MiHistorial />} />
        <Route path="tratamientos" element={<MisTratamientos />} />
        <Route path="archivos" element={<MisArchivos />} />
      </Route>
      <Route path="*" element={<Navigate to="/paciente/login" replace />} />
    </Routes>
  )
}
