import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Plus, UserPlus, Search, X, Check } from 'lucide-react'
import { PatientForm } from '../booking/PatientForm'
import { turnosApi, profesionalesApi, pacientesApi, serviciosApi } from '../../api'
import type { Profesional, Paciente, Servicio } from '../../types'

interface AdminAppointmentModalProps {
    onClose: () => void
    onCreate: () => void
    initialData?: Partial<{
        fecha: string
        hora_inicio: string
        hora_fin: string
        profesional_id: number
        sobre_turno: boolean
        paciente_id: string
        paciente_nombre: string
    }>
}

export const AdminAppointmentModal: React.FC<AdminAppointmentModalProps> = ({ onClose, onCreate, initialData }) => {
    const [formData, setFormData] = useState({
        paciente_id: initialData?.paciente_id || '',
        profesional_id: initialData?.profesional_id || 0,
        servicio_id: 0,
        fecha: initialData?.fecha || new Date().toISOString().split('T')[0],
        hora_inicio: initialData?.hora_inicio || '10:00',
        hora_fin: initialData?.hora_fin || '10:30',
        estado: 'Confirmado',
        observaciones: '',
        sobre_turno: initialData?.sobre_turno || false
    })

    const [loading, setLoading] = useState(false)
    const [profesionales, setProfesionales] = useState<Profesional[]>([])
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [servicios, setServicios] = useState<Servicio[]>([])
    const [searchPaciente, setSearchPaciente] = useState(initialData?.paciente_nombre || '')
    const [isNewPatient, setIsNewPatient] = useState(false)
    const [horaFinManual, setHoraFinManual] = useState(false)

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

    // Auto-suggest end time based on service duration ONLY if not manually edited
    useEffect(() => {
        if (horaFinManual) return // Don't override manual selection
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
    }, [formData.servicio_id, formData.hora_inicio, servicios, horaFinManual])

    const handleNewPatientSubmit = async (data: any) => {
        setLoading(true)
        try {
            const newPatient = await pacientesApi.crear(data)
            await turnosApi.crear({
                paciente_id: newPatient.id,
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
            console.error('Error creating patient and appointment:', error)
            alert('Error al crear el paciente o el turno.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isNewPatient) return // Handled by PatientForm

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
        <div className="fixed inset-0 bg-[#0A0F2D]/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
                
                {/* Header Estilizado */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2563FF] shadow-sm">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                                {formData.sobre_turno ? "Nuevo Sobreturno" : "Agendar Turno"}
                            </h3>
                            <p className="text-sm text-gray-400 font-medium mt-1">Completa los datos del agendamiento</p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Sección: Paciente */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-[#2563FF]">Información del Paciente</label>
                                <button
                                    type="button"
                                    onClick={() => setIsNewPatient(!isNewPatient)}
                                    className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2563FF] transition-colors flex items-center gap-1.5"
                                >
                                    {isNewPatient ? (
                                        <><Search size={14} strokeWidth={3} /> Usar Existente</>
                                    ) : (
                                        <><UserPlus size={14} strokeWidth={3} /> Nuevo Paciente</>
                                    )}
                                </button>
                            </div>

                            {isNewPatient ? (
                                <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-3 text-amber-700 mb-4">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                            <UserPlus size={16} />
                                        </div>
                                        <span className="text-sm font-bold">Registro de paciente nuevo activo</span>
                                    </div>
                                    <PatientForm
                                        onPatientData={handleNewPatientSubmit}
                                        loading={loading}
                                    />
                                </div>
                            ) : (
                                <div className="relative group">
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            placeholder="Buscar por DNI, nombre o apellido..."
                                            value={searchPaciente}
                                            onChange={(e) => {
                                                setSearchPaciente(e.target.value);
                                                setFormData({ ...formData, paciente_id: '' });
                                            }}
                                            className="h-14 px-6 bg-gray-50/50 border-gray-100 rounded-2xl font-bold text-lg focus:bg-white transition-all shadow-none group-hover:border-blue-200"
                                            required={!isNewPatient}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {formData.paciente_id ? (
                                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in">
                                                    <Check className="w-4 h-4 text-white" strokeWidth={4} />
                                                </div>
                                            ) : (
                                                <Search className="w-5 h-5 text-gray-300" />
                                            )}
                                        </div>
                                    </div>

                                    {searchPaciente.length > 2 && !formData.paciente_id && (
                                        <div className="absolute z-[60] w-full mt-2 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                                            {pacientes.length > 0 ? pacientes.map((paciente) => (
                                                <div
                                                    key={paciente.id}
                                                    className="px-6 py-4 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none transition-all flex items-center justify-between group/item"
                                                    onClick={() => {
                                                        setFormData({ ...formData, paciente_id: paciente.id });
                                                        setSearchPaciente(`${paciente.apellido}, ${paciente.nombre} (DNI: ${paciente.numero_documento})`);
                                                    }}
                                                >
                                                    <div>
                                                        <div className="font-black text-gray-900">{paciente.apellido}, {paciente.nombre}</div>
                                                        <div className="text-xs text-gray-400 font-bold">DNI: {paciente.numero_documento}</div>
                                                    </div>
                                                    <div className="opacity-0 group-hover/item:opacity-100 text-[#2563FF] font-black text-[10px] uppercase tracking-widest">
                                                        Seleccionar
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-8 text-center text-gray-400 font-bold">No se encontraron pacientes</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sección: Detalles Médicos */}
                        {!isNewPatient && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 px-1">Profesional *</label>
                                        <select
                                            value={formData.profesional_id || ''}
                                            onChange={(e) => setFormData({ ...formData, profesional_id: parseInt(e.target.value) })}
                                            className="w-full h-12 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2563FF] outline-none transition-all appearance-none"
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

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 px-1">Servicio *</label>
                                        <select
                                            value={formData.servicio_id || ''}
                                            onChange={(e) => setFormData({ ...formData, servicio_id: parseInt(e.target.value) })}
                                            className="w-full h-12 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2563FF] outline-none transition-all appearance-none"
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
                                </div>

                                <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-[#2563FF] px-1">Fecha</label>
                                            <Input
                                                type="date"
                                                value={formData.fecha}
                                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                                required
                                                className="h-11 bg-white border-blue-100 rounded-xl font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-[#2563FF] px-1">Hora Inicio</label>
                                            <Input
                                                type="time"
                                                value={formData.hora_inicio}
                                                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                                                required
                                                className="h-11 bg-white border-blue-100 rounded-xl font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-[#2563FF] px-1">Hora Fin</label>
                                            <Input
                                                type="time"
                                                value={formData.hora_fin}
                                                onChange={(e) => {
                                                    setHoraFinManual(true)
                                                    setFormData({ ...formData, hora_fin: e.target.value })
                                                }}
                                                required
                                                className="h-11 bg-white border-blue-100 rounded-xl font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl group cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, sobre_turno: !prev.sobre_turno }))}>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.sobre_turno ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 bg-white'}`}>
                                            {formData.sobre_turno && <Check size={14} strokeWidth={4} />}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-black text-gray-900">Forzar agendamiento (Sobre Turno)</span>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Ignora restricciones de horario y solapamientos</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 px-1">Estado del Turno</label>
                                        <select
                                            value={formData.estado}
                                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                            className="w-full h-12 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white transition-all appearance-none"
                                        >
                                            <option value="Confirmado">Confirmado</option>
                                            <option value="Creado">Creado</option>
                                            <option value="En sala de espera">En sala de espera</option>
                                            <option value="Atendido">Atendido</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 px-1">Observaciones</label>
                                        <textarea
                                            value={formData.observaciones}
                                            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                            className="w-full h-12 px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white transition-all resize-none outline-none"
                                            placeholder="Notas internas..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={onClose}
                                        className="flex-1 h-14 rounded-2xl font-black text-[12px] uppercase tracking-widest border-2"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="flex-[2] h-14 rounded-2xl bg-[#2563FF] hover:bg-blue-700 text-white font-black text-[12px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:translate-y-0"
                                    >
                                        {loading ? 'Procesando...' : 'Confirmar Agendamiento'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
