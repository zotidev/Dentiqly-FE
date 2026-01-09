import { apiClient } from "../lib/api-client"
import type { PlanTratamiento, CrearPlanTratamientoData } from "../types"

export const planesTratamientoApi = {
  listar: async (pacienteId: number): Promise<PlanTratamiento[]> => {
    return apiClient.get<PlanTratamiento[]>(`/planes-tratamiento?paciente_id=${pacienteId}`)
  },

  obtener: async (id: number): Promise<PlanTratamiento> => {
    return apiClient.get<PlanTratamiento>(`/planes-tratamiento/${id}`)
  },

  crear: async (data: CrearPlanTratamientoData): Promise<PlanTratamiento> => {
    return apiClient.post<PlanTratamiento>("/planes-tratamiento", data)
  },

  actualizar: async (id: number, data: Partial<CrearPlanTratamientoData>): Promise<PlanTratamiento> => {
    return apiClient.put<PlanTratamiento>(`/planes-tratamiento/${id}`, data)
  },

  eliminar: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/planes-tratamiento/${id}`)
  },
}
