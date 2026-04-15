import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { turnosApi, profesionalesApi, pacientesApi, serviciosApi } from '../../api'
import type { Profesional, Paciente, Servicio } from '../../types'

interface AdminAppointmentModalProps {
    onClose: () => void
    onCreate: () => void
}

export const AdminAppointmentModal: React.FC<AdminAppointmentModalProps> = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        paciente_id: '',
        profesional_id: 0,
        servicio_id: 0,
        fecha: new Date().toISOString().split('T')[0],
        hora_inicio: '10:00',
        hora_fin: '10:30',
        estado: 'Confirmado',
        observaciones: '',
        sobre_turno: false
    })

    const [loading, setLoading] = useState(false)
    const [profesionales, setProfesionales] = useState<Profesional[]>([])
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [servicios, setServicios] = useState<Servicio[]>([])
    const [searchPaciente, setSearchPaciente] = useState('')

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [profesionalesRes, pacientesRes, serviciosRes] = await Promise.all([
                    profesionalesApi.listar({ limit: 100, estado: 'Activo' }),
                    pacientesApi.listar({ limit: 50 }),
                    serviciosApi.listar()
                ])
                setProfesionales(profesionalesRes.data || [])
                setPacientes(pacientesRes.data || [])
                setServicios(serviciosRes.data || [])
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchInitialData()
    }, [])

    useEffect(() => {
        const fetchPacientes = async () => {
            if (searchPaciente.length > 2) {
                try {
                    const response = await pacientesApi.listar({ search: searchPaciente, limit: 10 });
                    setPacientes(response.data || [])
                } catch (error) {
                    console.error('Error fetching patients:', error)
                }
            }
        }
        const delayDebounceFn = setTimeout(() => {
            fetchPacientes()
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    }, [searchPaciente])

    // Update end time based on selected service duration
    useEffect(() => {
        if (formData.servicio_id && formData.hora_inicio) {
            const servicio = servicios.find(s => s.id === formData.servicio_id)
            if (servicio) {
                const duration = servicio.duracion_estimada || 30
                const [hours, minutes] = formData.hora_inicio.split(':').map(Number)
                const date = new Date()
                date.setHours(hours, minutes + duration, 0)
                const endHours = String(date.getHours()).padStart(2, '0')
                const endMinutes = String(date.getMinutes()).padStart(2, '0')
                setFormData(prev => ({ ...prev, hora_fin: `${endHours}:${endMinutes}` }))
            }
        }
    }, [formData.servicio_id, formData.hora_inicio, servicios])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        if (!formData.paciente_id || !formData.profesional_id || !formData.servicio_id) {
            alert('Por favor complete todos los campos requeridos.')
            setLoading(false)
            return
        }

        try {
            await turnosApi.crear({
                paciente_id: formData.paciente_id,
                profesional_id: formData.profesional_id,
                servicio_id: formData.servicio_id,
                fecha: formData.fecha,
                hora_inicio: formData.hora_inicio,
                hora_fin: formData.hora_fin,
                estado: formData.estado,
                observaciones: formData.observaciones,
                sobre_turno: formData.sobre_turno
            })
            onCreate()
            onClose()
        } catch (error: any) {
            console.error('Error creating appointment:', error)
            const errorMessage = error.response?.data?.error || 'Error al crear el turno. Verifique solapamientos o habilitar Sobre Turno.'
            alert(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 my-8">
                <h3 className="text-lg font-semibold mb-4 text-[#026498]">Forzar Nuevo Turno (Admin)</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Buscar Paciente</label>
                        <Input
                            type="text"
                            placeholder="DNI, nombre o apellido..."
                            value={searchPaciente}
                            onChange={(e) => setSearchPaciente(e.target.value)}
                            className="mb-2"
                        />
                        <select
                            value={formData.paciente_id}
                            onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
                            className="w-full border rounded-md p-2"
                            required
                        >
                            <option value="">Seleccionar paciente</option>
                            {pacientes.map((paciente) => (
                                <option key={paciente.id} value={paciente.id}>
                                    {paciente.numero_documento} - {paciente.apellido}, {paciente.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Profesional</label>
                        <select
                            value={formData.profesional_id || ''}
                            onChange={(e) => setFormData({ ...formData, profesional_id: parseInt(e.target.value) })}
                            className="w-full border rounded-md p-2"
                            required
                        >
                            <option value="">Seleccionar profesional</option>
                            {profesionales.map((prof) => (
                                <option key={prof.id} value={prof.id}>
                                    {prof.apellido}, {prof.nombre} - {prof.especialidad}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Servicio</label>
                        <select
                            value={formData.servicio_id || ''}
                            onChange={(e) => setFormData({ ...formData, servicio_id: parseInt(e.target.value) })}
                            className="w-full border rounded-md p-2"
                            required
                        >
                            <option value="">Seleccionar servicio</option>
                            {servicios.map((serv) => (
                                <option key={serv.id} value={serv.id}>
                                    {serv.nombre} ({serv.duracion_estimada} min)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex space-x-2">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">Fecha</label>
                            <Input
                                type="date"
                                value={formData.fecha}
                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-1/4">
                            <label className="block text-sm font-medium mb-1">Inicio</label>
                            <Input
                                type="time"
                                value={formData.hora_inicio}
                                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-1/4">
                            <label className="block text-sm font-medium mb-1">Fin</label>
                            <Input
                                type="time"
                                value={formData.hora_fin}
                                onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <input
                            type="checkbox"
                            id="sobre_turno"
                            checked={formData.sobre_turno}
                            onChange={(e) => setFormData({ ...formData, sobre_turno: e.target.checked })}
                            className="mr-3 w-5 h-5 text-red-600 rounded focus:ring-red-500"
                        />
                        <label htmlFor="sobre_turno" className="text-sm font-bold text-red-800 cursor-pointer">
                            Ignorar Reglas / Forzar (Sobre Turno)
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Estado</label>
                        <select
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            className="w-full border rounded-md p-2"
                        >
                            <option value="Confirmado">Confirmado</option>
                            <option value="Creado">Creado</option>
                            <option value="En sala de espera">En sala de espera</option>
                            <option value="Atendido">Atendido</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Observaciones</label>
                        <textarea
                            value={formData.observaciones}
                            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                            className="w-full border rounded-md p-2 h-16"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-[#026498]">
                            {loading ? 'Guardando...' : 'Crear Turno Manual'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
