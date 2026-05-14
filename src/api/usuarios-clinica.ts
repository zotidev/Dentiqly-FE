import { apiClient } from "../lib/api-client"

export interface UsuarioClinica {
  id: number
  nombre: string
  apellido: string
  email: string
  role: 'admin' | 'recepcionista' | 'odontologo' | 'staff'
  activo: boolean
  createdAt: string
}

export interface CrearUsuarioClinicaData {
  nombre: string
  apellido: string
  email: string
  role: string
}

export interface ActualizarUsuarioClinicaData {
  nombre?: string
  apellido?: string
  email?: string
  role?: string
}

export const usuariosClinicaApi = {
  listar: async (): Promise<UsuarioClinica[]> => {
    const res = await apiClient.get<{ usuarios: UsuarioClinica[] }>('/usuarios-clinica')
    return res.usuarios || []
  },

  crear: async (data: CrearUsuarioClinicaData): Promise<UsuarioClinica> => {
    return apiClient.post<UsuarioClinica>('/usuarios-clinica', data)
  },

  actualizar: async (id: number, data: ActualizarUsuarioClinicaData): Promise<UsuarioClinica> => {
    return apiClient.put<UsuarioClinica>(`/usuarios-clinica/${id}`, data)
  },

  eliminar: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/usuarios-clinica/${id}`)
  },
}
