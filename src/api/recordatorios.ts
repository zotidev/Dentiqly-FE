import { apiClient } from "../lib/api-client"

export const recordatoriosApi = {
  async enviar(turno_id: number): Promise<{ message: string; messageId?: string }> {
    return apiClient.post("/recordatorios/enviar", { turno_id })
  },
  async enviarMasivo(fecha: string): Promise<{ message: string; enviados: number; errores: number; total: number }> {
    return apiClient.post("/recordatorios/enviar-masivo", { fecha })
  },
}
