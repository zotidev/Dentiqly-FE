import { apiClient } from "../lib/api-client"
import type { HistorialClinico, CrearHistorialClinicoData } from "../types"

export const historialesClinicosApi = {
  listar: async (pacienteId: string | number): Promise<HistorialClinico[]> => {
    return apiClient.get<HistorialClinico[]>(`/historiales-clinicos?paciente_id=${pacienteId}`)
  },

  obtener: async (id: number): Promise<HistorialClinico> => {
    return apiClient.get<HistorialClinico>(`/historiales-clinicos/${id}`)
  },

  crear: async (data: CrearHistorialClinicoData): Promise<HistorialClinico> => {
    return apiClient.post<HistorialClinico>("/historiales-clinicos", data)
  },

  actualizar: async (id: number, data: Partial<CrearHistorialClinicoData>): Promise<HistorialClinico> => {
    return apiClient.put<HistorialClinico>(`/historiales-clinicos/${id}`, data)
  },

  eliminar: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/historiales-clinicos/${id}`)
  },
}
