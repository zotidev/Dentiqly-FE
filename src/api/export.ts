const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {}
  const token = localStorage.getItem("token")
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

async function downloadCsv(endpoint: string, filename: string) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, { headers: getHeaders() })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Error al exportar" }))
    throw new Error(error.error || `Error ${response.status}`)
  }

  const blob = await response.blob()
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

export const exportApi = {
  pacientes: () => downloadCsv("/export/pacientes", "pacientes.csv"),
  turnos: (params?: { desde?: string; hasta?: string }) => {
    const query = new URLSearchParams()
    if (params?.desde) query.append("desde", params.desde)
    if (params?.hasta) query.append("hasta", params.hasta)
    const qs = query.toString()
    return downloadCsv(`/export/turnos${qs ? `?${qs}` : ""}`, "turnos.csv")
  },
  liquidaciones: () => downloadCsv("/export/liquidaciones", "liquidaciones.csv"),
  flujoCaja: (params?: { desde?: string; hasta?: string }) => {
    const query = new URLSearchParams()
    if (params?.desde) query.append("desde", params.desde)
    if (params?.hasta) query.append("hasta", params.hasta)
    const qs = query.toString()
    return downloadCsv(`/export/flujo-caja${qs ? `?${qs}` : ""}`, "flujo-caja.csv")
  },
}
