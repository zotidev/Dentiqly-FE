import { apiClient } from "../lib/api-client"

export interface Feriado {
  id: number
  fecha: string
  descripcion?: string
  createdAt: string
  updatedAt: string
}

export const feriadosApi = {
  async listar(year?: number): Promise<Feriado[]> {
    const params = year ? `?year=${year}` : ""
    return apiClient.get<Feriado[]>(`/feriados${params}`)
  },
  async crear(data: { fecha: string; descripcion?: string }): Promise<Feriado> {
    return apiClient.post<Feriado>("/feriados", data)
  },
  async eliminar(id: number): Promise<void> {
    return apiClient.delete(`/feriados/${id}`)
  },
}
