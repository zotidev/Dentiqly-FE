import React from "react"

interface ToothAnatomicalSVGProps {
  numero: string
  esSuperior: boolean
  datos?: any
  isReadOnly?: boolean
  onSuperficieClick?: (superficie: string) => void
  onDienteClick?: () => void
  className?: string
  estadoColors: Record<string, string>
}

export const ToothAnatomicalSVG: React.FC<ToothAnatomicalSVGProps> = ({
  numero,
  esSuperior,
  datos,
  isReadOnly = false,
  onSuperficieClick,
  onDienteClick,
  className = "",
  estadoColors,
}) => {
  const parts = numero.split(".")
  const quadrant = parseInt(parts[0])
  const toothPos = parseInt(parts[1])
  const isTemporary = [5, 6, 7, 8].includes(quadrant)
  const isRight = [1, 4, 5, 8].includes(quadrant)

  const getToothType = (pos: number, isTemp: boolean) => {
    if (pos <= 2) return "incisor"
    if (pos === 3) return "canine"
    if (isTemp) return "molar"
    if (pos <= 5) return "premolar"
    return "molar"
  }

  const type = getToothType(toothPos, isTemporary)

  const getSurfaceColor = (superficie: string) => {
    const estado = datos?.superficies?.[superficie]
    if (!estado || estado === "sano") return "#FFFFFF"
    return estadoColors[estado] || "#93C5FD"
  }

  const getSurfaceStroke = (superficie: string) => {
    const estado = datos?.superficies?.[superficie]
    if (!estado || estado === "sano") return "#CBD5E1"
    if (estado === "buen_estado") return "#1E40AF"
    if (estado === "mal_estado") return "#B91C1C"
    return "#94A3B8"
  }

  const treatmentGral = datos?.tratamiento_general?.tratamiento || (datos?.estado !== "sano" ? datos?.estado : null)
  const treatmentGralColor = datos?.tratamiento_general?.estado === "buen_estado" ? estadoColors.buen_estado : estadoColors.mal_estado

  let paths: Record<string, string> = {}

  if (type === "molar" || type === "premolar") {
    paths = {
      oclusal: "M 30 35 Q 50 30 70 35 Q 75 50 70 65 Q 50 70 30 65 Q 25 50 30 35 Z",
      vestibular: "M 10 15 Q 50 5 90 15 L 70 35 Q 50 30 30 35 Z",
      lingual: "M 30 65 Q 50 70 70 65 L 90 85 Q 50 95 10 85 Z",
      mesial: isRight
        ? "M 70 35 Q 75 50 70 65 L 90 85 Q 95 50 90 15 Z"
        : "M 10 15 Q 5 50 10 85 L 30 65 Q 25 50 30 35 Z",
      distal: isRight
        ? "M 10 15 Q 5 50 10 85 L 30 65 Q 25 50 30 35 Z"
        : "M 70 35 Q 75 50 70 65 L 90 85 Q 95 50 90 15 Z",
    }
  } else {
    paths = {
      oclusal: "M 35 48 Q 50 45 65 48 Q 63 52 50 55 Q 37 52 35 48 Z",
      vestibular: "M 15 15 Q 50 8 85 15 L 65 48 Q 50 45 35 48 Z",
      lingual: "M 35 48 Q 50 55 65 48 L 85 85 Q 50 92 15 85 Z",
      mesial: isRight
        ? "M 65 48 Q 70 50 65 48 L 85 15 Q 90 50 85 85 Z"
        : "M 15 15 Q 10 50 15 85 L 35 48 Q 30 50 35 48 Z",
      distal: isRight
        ? "M 15 15 Q 10 50 15 85 L 35 48 Q 30 50 35 48 Z"
        : "M 65 48 Q 70 50 65 48 L 85 15 Q 90 50 85 85 Z",
    }
  }

  const isAusente = treatmentGral === "ausente" || treatmentGral === "extraccion"

  return (
    <div className={`relative ${className}`} style={{ width: "100%", height: "100%" }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        onClick={() => !isReadOnly && onDienteClick?.()}
      >
        <defs>
          <filter id={`tooth-shadow-${numero}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#94A3B8" floodOpacity="0.15" />
          </filter>
        </defs>

        <g opacity={isAusente ? 0.15 : 1} filter={`url(#tooth-shadow-${numero})`}>
          {Object.entries(paths).map(([surf, d]) => (
            <path
              key={surf}
              d={d}
              fill={getSurfaceColor(surf)}
              stroke={getSurfaceStroke(surf)}
              strokeWidth="1.5"
              strokeLinejoin="round"
              className={`transition-all duration-150 ${!isReadOnly ? "cursor-pointer" : ""}`}
              style={{
                filter: !isReadOnly ? undefined : undefined,
              }}
              onMouseEnter={(e) => {
                if (!isReadOnly) {
                  const el = e.currentTarget
                  const estado = datos?.superficies?.[surf]
                  if (!estado || estado === "sano") {
                    el.setAttribute("fill", "#EFF6FF")
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (!isReadOnly) {
                  e.currentTarget.setAttribute("fill", getSurfaceColor(surf))
                }
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (!isReadOnly) onSuperficieClick?.(surf)
              }}
            >
              <title>{surf}</title>
            </path>
          ))}
        </g>

        {isAusente && (
          <g stroke={treatmentGralColor} strokeWidth="5" strokeLinecap="round" opacity="0.8">
            <line x1="20" y1="20" x2="80" y2="80" />
            <line x1="80" y1="20" x2="20" y2="80" />
          </g>
        )}

        {!isAusente && treatmentGral === "corona" && (
          <circle cx="50" cy="50" r="38" fill="none" stroke={treatmentGralColor} strokeWidth="3" opacity="0.6" pointerEvents="none" />
        )}

        {!isAusente && treatmentGral === "tratamiento_endodontico" && (
          <line x1="50" y1="10" x2="50" y2="90" stroke={treatmentGralColor} strokeWidth="3" strokeLinecap="round" opacity="0.6" pointerEvents="none" />
        )}

        {!isAusente && treatmentGral === "implante" && (
          <g opacity="0.7" pointerEvents="none">
            <polygon points="50,85 38,50 62,50" fill={treatmentGralColor} />
            <rect x="42" y="15" width="16" height="38" rx="3" fill={treatmentGralColor} />
          </g>
        )}

        {!isAusente && treatmentGral === "caries" && (
          <circle cx="50" cy="50" r="12" fill="#1F2937" opacity="0.7" pointerEvents="none" />
        )}

        {!isAusente && treatmentGral === "restauracion" && (
          <circle cx="50" cy="50" r="12" fill={treatmentGralColor} opacity="0.7" pointerEvents="none" />
        )}
      </svg>
    </div>
  )
}
