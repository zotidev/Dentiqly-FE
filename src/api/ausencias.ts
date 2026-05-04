import { apiClient } from "./client"

export interface Ausencia {
  id: number;
  profesional_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio?: string;
  hora_fin?: string;
  motivo?: string;
  profesional?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

export const ausenciasApi = {
  listar: async () => {
    return apiClient.get<Ausencia[]>("/ausencias")
  },
  crear: async (datos: Partial<Ausencia>) => {
    return apiClient.post<Ausencia>("/ausencias", datos)
  },
  eliminar: async (id: number) => {
    return apiClient.delete<any>(`/ausencias/${id}`)
  }
}
