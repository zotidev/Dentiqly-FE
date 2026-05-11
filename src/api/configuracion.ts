import { apiClient } from "../lib/api-client"

export interface ConfiguracionTenant {
  nombre_clinica?: string
  direccion?: string
  telefono?: string
  email?: string
  horarios_atencion?: any
  logo_url?: string
  clinic_name?: string
  clinic_address?: string
  clinic_phone?: string
  clinic_google_maps?: string
}

export interface Setting {
  id?: number
  clave: string
  valor: any
  tipo: "string" | "number" | "boolean" | "json"
  descripcion?: string
  categoria?: string
}

export const configuracionApi = {
  async obtenerPublica(): Promise<ConfiguracionTenant> {
    return apiClient.get<ConfiguracionTenant>("/configuracion")
  },

  async listar(params?: { categoria?: string }): Promise<Setting[]> {
    const query = params?.categoria ? `?categoria=${params.categoria}` : ""
    return apiClient.get<Setting[]>(`/configuracion${query}`)
  },

  async obtener(clave: string): Promise<Setting> {
    return apiClient.get<Setting>(`/configuracion/${clave}`)
  },

  async crear(data: Setting): Promise<Setting> {
    return apiClient.post<Setting>("/configuracion", data)
  },

  async actualizar(clave: string, data: Partial<Setting>): Promise<Setting> {
    return apiClient.put<Setting>(`/configuracion/${clave}`, data)
  },

  async eliminar(clave: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/configuracion/${clave}`)
  }
}
