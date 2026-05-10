import React, { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import {
  Bell,
  Send,
  Clock,
  Calendar,
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Settings,
  Save,
  X,
  Info,
} from 'lucide-react'
import { turnosApi, recordatoriosApi } from '../../api'
import type { Turno } from '../../types'

export const RemindersView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<number | null>(null)
  const [sendingAll, setSendingAll] = useState(false)
  const [sentIds, setSentIds] = useState<Set<number>>(new Set())
  const [errorIds, setErrorIds] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [massResult, setMassResult] = useState<{ enviados: number; errores: number; total: number } | null>(null)

  // Template editor
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [templateText, setTemplateText] = useState('')
  const [savedTemplate, setSavedTemplate] = useState('')
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [templateLoaded, setTemplateLoaded] = useState(false)

  // Preview modal
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [previewTurnoId, setPreviewTurnoId] = useState<number | null>(null)

  useEffect(() => {
    fetchTurnos()
    setSentIds(new Set())
    setErrorIds(new Set())
    setMassResult(null)
  }, [selectedDate])

  useEffect(() => {
    if (!templateLoaded) {
      loadTemplate()
    }
  }, [])

  const loadTemplate = async () => {
    try {
      const result = await recordatoriosApi.obtenerTemplate()
      setTemplateText(result.template || '')
      setSavedTemplate(result.template || '')
      setTemplateLoaded(true)
    } catch (error) {
      console.error('Error loading template:', error)
      setTemplateLoaded(true)
    }
  }

  const fetchTurnos = async () => {
    try {
      setLoading(true)
      const response = await turnosApi.listar({
        fecha_desde: selectedDate,
        fecha_hasta: selectedDate,
        limit: 200,
      })
      const turnosFecha = (response.data || []).filter(
        (t: Turno) => t.fecha === selectedDate && ['Pendiente', 'Confirmado', 'Creado', 'Confirmado por email', 'Confirmado por SMS', 'Confirmado por Whatsapp'].includes(t.estado)
      )
      turnosFecha.sort((a: Turno, b: Turno) => a.hora_inicio.localeCompare(b.hora_inicio))
      setTurnos(turnosFecha)
    } catch (error) {
      console.error('Error fetching turnos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReminder = async (turnoId: number) => {
    try {
      setSendingId(turnoId)
      setErrorIds((prev) => {
        const next = new Set(prev)
        next.delete(turnoId)
        return next
      })
      await recordatoriosApi.enviar(turnoId)
      setSentIds((prev) => new Set(prev).add(turnoId))
    } catch (error) {
      console.error('Error sending reminder:', error)
      setErrorIds((prev) => new Set(prev).add(turnoId))
    } finally {
      setSendingId(null)
    }
  }

  const handleSendAll = async () => {
    if (!window.confirm(`¿Enviar recordatorio a todos los pacientes con turno el ${formatDate(selectedDate)}?`)) return

    try {
      setSendingAll(true)
      const result = await recordatoriosApi.enviarMasivo(selectedDate)
      setMassResult(result)
      const allIds = new Set(turnos.map(t => t.id))
      setSentIds(allIds)
    } catch (error) {
      console.error('Error sending mass reminders:', error)
      alert('Error al enviar recordatorios masivos')
    } finally {
      setSendingAll(false)
    }
  }

  const handleSaveTemplate = async () => {
    try {
      setSavingTemplate(true)
      await recordatoriosApi.guardarTemplate(templateText)
      setSavedTemplate(templateText)
      alert('Mensaje guardado correctamente')
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Error al guardar el mensaje')
    } finally {
      setSavingTemplate(false)
    }
  }

  const handlePreview = async (turnoId?: number) => {
    try {
      setLoadingPreview(true)
      setShowPreview(true)
      setPreviewTurnoId(turnoId || null)

      const result = await recordatoriosApi.preview({
        turno_id: turnoId,
        custom_template: templateText || undefined,
      })
      setPreviewHtml(result.html)
    } catch (error) {
      console.error('Error loading preview:', error)
      setPreviewHtml('<p style="color:red;text-align:center;padding:40px;">Error al cargar la vista previa</p>')
    } finally {
      setLoadingPreview(false)
    }
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate + 'T00:00:00')
    date.setDate(date.getDate() + (direction === 'prev' ? -1 : 1))
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const formatDate = (fecha: string) => {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const filteredTurnos = turnos.filter((turno) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    const pacienteName = `${turno.paciente?.apellido || ''} ${turno.paciente?.nombre || ''}`.toLowerCase()
    const profesionalName = `${turno.profesional?.nombre || ''} ${turno.profesional?.apellido || ''}`.toLowerCase()
    return pacienteName.includes(term) || profesionalName.includes(term)
  })

  const turnosWithEmail = filteredTurnos.filter(t => t.paciente?.email)
  const turnosWithoutEmail = filteredTurnos.filter(t => !t.paciente?.email)
  const templateChanged = templateText !== savedTemplate

  return (
    <div className="bg-[#f0f2f5] min-h-screen p-4 sm:p-8 rounded-3xl font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-8 w-8 text-[#2563FF]" />
            Recordatorios
          </h1>
          <p className="text-gray-500 mt-1">Envía recordatorios de turno a los pacientes por email</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => handlePreview()} className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition shadow-sm">
            <Eye className="w-4 h-4" /> Ver email de ejemplo
          </button>
          <button onClick={() => setShowTemplateEditor(!showTemplateEditor)} className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition shadow-sm border ${showTemplateEditor ? 'bg-blue-50 border-[#2563FF] text-[#2563FF]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            <Settings className="w-4 h-4" /> Configurar mensaje
          </button>
        </div>
      </div>

      {/* Template Editor */}
      {showTemplateEditor && (
        <Card className="p-6 border-blue-200 bg-blue-50/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#026498]" />
                Mensaje personalizado del recordatorio
              </h3>
              <button
                onClick={() => setShowTemplateEditor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white border border-blue-100 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Variables disponibles (se reemplazan automáticamente):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs font-mono">
                    <span className="bg-blue-100 px-2 py-0.5 rounded">{'{nombre}'}</span>
                    <span className="bg-blue-100 px-2 py-0.5 rounded">{'{apellido}'}</span>
                    <span className="bg-blue-100 px-2 py-0.5 rounded">{'{fecha}'}</span>
                    <span className="bg-blue-100 px-2 py-0.5 rounded">{'{hora_inicio}'}</span>
                    <span className="bg-blue-100 px-2 py-0.5 rounded">{'{hora_fin}'}</span>
                    <span className="bg-blue-100 px-2 py-0.5 rounded">{'{profesional}'}</span>
                    <span className="bg-blue-100 px-2 py-0.5 rounded">{'{servicio}'}</span>
                  </div>
                  <p className="mt-2 text-xs text-blue-600">
                    Si dejás el campo vacío, se usará el mensaje predeterminado: "Te recordamos que tenés un turno programado..."
                  </p>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto del mensaje (aparece después del saludo "Hola [nombre],")
              </label>
              <textarea
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                rows={4}
                placeholder='Ej: Te recordamos que tenés un turno el {fecha} a las {hora_inicio} con {profesional} para {servicio}. ¡Te esperamos!'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {templateChanged && (
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Cambios sin guardar
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview()}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Vista previa
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveTemplate}
                  disabled={savingTemplate}
                  className="bg-[#026498]"
                >
                  {savingTemplate ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Guardar mensaje
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Date Selector */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#026498]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                setSelectedDate(tomorrow.toISOString().split('T')[0])
              }}
            >
              Mañana
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-48"
              />
            </div>

            <Button
              onClick={handleSendAll}
              disabled={sendingAll || turnosWithEmail.length === 0}
              className="bg-[#026498]"
            >
              {sendingAll ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar a todos ({turnosWithEmail.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Date Title */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 capitalize">
          {formatDate(selectedDate)}
        </h3>
        <p className="text-sm text-gray-500">
          {filteredTurnos.length} turno{filteredTurnos.length !== 1 ? 's' : ''} encontrado{filteredTurnos.length !== 1 ? 's' : ''}
          {turnosWithoutEmail.length > 0 && (
            <span className="text-amber-600"> · {turnosWithoutEmail.length} sin email</span>
          )}
        </p>
      </div>

      {/* Mass result banner */}
      {massResult && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">
              Recordatorios enviados: {massResult.enviados} de {massResult.total}
              {massResult.errores > 0 && (
                <span className="text-red-600"> · {massResult.errores} con error</span>
              )}
            </p>
          </div>
        </Card>
      )}

      {/* Turnos List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredTurnos.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No hay turnos para esta fecha</p>
            <p className="text-sm text-gray-400 mt-1">
              Seleccioná otra fecha para ver los turnos.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTurnos.map((turno) => {
            const isSent = sentIds.has(turno.id)
            const isSending = sendingId === turno.id
            const hasError = errorIds.has(turno.id)
            const hasEmail = !!turno.paciente?.email

            return (
              <Card key={turno.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {turno.paciente?.apellido}, {turno.paciente?.nombre}
                      </span>
                      {!hasEmail && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                          Sin email
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {turno.hora_inicio} - {turno.hora_fin}
                      </span>
                      {turno.profesional && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {turno.profesional.nombre} {turno.profesional.apellido}
                        </span>
                      )}
                      {turno.servicio && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {turno.servicio.nombre}
                        </span>
                      )}
                    </div>
                    {hasEmail && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Mail className="h-3 w-3" />
                        {turno.paciente?.email}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    {hasEmail && !isSent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(turno.id)}
                        title="Vista previa del email"
                        className="text-gray-500"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {!hasEmail ? (
                      <span className="text-xs text-gray-400 italic">No se puede enviar</span>
                    ) : isSent ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <CheckCircle className="h-5 w-5" />
                        Enviado
                      </div>
                    ) : hasError ? (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <Button
                          size="sm"
                          onClick={() => handleSendReminder(turno.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reintentar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleSendReminder(turno.id)}
                        disabled={isSending}
                        className="bg-[#026498]"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Enviar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#026498]" />
                  Vista previa del email
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {previewTurnoId
                    ? 'Así se verá el email para este paciente'
                    : 'Ejemplo con datos de prueba'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false)
                  setPreviewHtml('')
                  setPreviewTurnoId(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingPreview ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="p-4">
                  <div
                    className="border rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#f9f9f9' }}
                  >
                    <iframe
                      srcDoc={previewHtml}
                      title="Email Preview"
                      className="w-full border-0"
                      style={{ minHeight: '500px' }}
                      sandbox=""
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-3 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Los datos del turno (fecha, hora, profesional, servicio) siempre se incluyen automáticamente.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPreview(false)
                  setPreviewHtml('')
                  setPreviewTurnoId(null)
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
