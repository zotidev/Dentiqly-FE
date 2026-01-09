export interface CrearSubServicioData {
  servicio_id: number
  nombre: string
  descripcion?: string
  precio: number
  duracion_estimada: number
  estado?: string
}

export interface SubServicio {
  id: number
  servicio_id: number
  nombre: string
  descripcion?: string
  precio: number
  duracion_estimada: number
  estado: string
  createdAt: string
  updatedAt: string
}
