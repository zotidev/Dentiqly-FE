import React from "react";

interface ToothAnatomicalSVGProps {
  numero: string;
  esSuperior: boolean;
  datos?: any;
  isReadOnly?: boolean;
  onSuperficieClick?: (superficie: string) => void;
  onDienteClick?: () => void;
  className?: string;
  estadoColors: Record<string, string>;
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
  const parts = numero.split(".");
  const quadrant = parseInt(parts[0]);
  const toothPos = parseInt(parts[1]);
  const isTemporary = [5, 6, 7, 8].includes(quadrant);
  const isRight = [1, 4, 5, 8].includes(quadrant);

  const getToothType = (pos: number, isTemp: boolean) => {
    if (pos <= 2) return "incisor";
    if (pos === 3) return "canine";
    if (isTemp) return "molar";
    if (pos <= 5) return "premolar";
    return "molar";
  };

  const type = getToothType(toothPos, isTemporary);

  const getSurfaceColor = (superficie: string) => {
    const estado = datos?.superficies?.[superficie];
    if (!estado || estado === "sano") return "white";
    return estadoColors[estado] || "#93C5FD";
  };

  const getSurfaceStroke = (superficie: string) => {
    const estado = datos?.superficies?.[superficie];
    if (!estado || estado === "sano") return "#d1d5db";
    return "white";
  };

  const treatmentGral = datos?.tratamiento_general?.tratamiento || (datos?.estado !== "sano" ? datos?.estado : null);
  const treatmentGralColor = datos?.tratamiento_general?.estado === "buen_estado" ? estadoColors.buen_estado : estadoColors.mal_estado;

  // Improved Curved Paths for Anatomical Interactivity
  let paths: Record<string, string> = {};

  if (type === "molar" || type === "premolar") {
    // Organic Rounded Shapes for Molars
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
    };
  } else {
    // Tapered Shapes for Incisors/Canines
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
    };
  }

  const isAusente = treatmentGral === "ausente" || treatmentGral === "extraccion";

  return (
    <div className={`relative group ${className}`} style={{ width: "100%", height: "100%" }}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-105"
        onClick={() => !isReadOnly && onDienteClick?.()}
      >
        <g opacity={isAusente ? 0.2 : 1}>
          {Object.entries(paths).map(([surf, d]) => (
            <path
              key={surf}
              d={d}
              fill={getSurfaceColor(surf)}
              stroke={getSurfaceStroke(surf)}
              strokeWidth="1.8"
              className={`transition-colors ${!isReadOnly ? "cursor-pointer hover:fill-blue-50" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!isReadOnly) onSuperficieClick?.(surf);
              }}
            >
              <title>{surf}</title>
            </path>
          ))}
        </g>

        {isAusente && (
           <g stroke={treatmentGralColor} strokeWidth="6" strokeLinecap="round">
             <line x1="15" y1="15" x2="85" y2="85" />
             <line x1="85" y1="15" x2="15" y2="85" />
           </g>
        )}
        
        {!isAusente && treatmentGral && treatmentGral !== "sano" && (
          <path
            d="M 20 20 L 80 80 M 80 20 L 20 80"
            stroke={treatmentGralColor}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.7"
            pointerEvents="none"
          />
        )}
      </svg>
      
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 bg-white/90 px-1.5 rounded-full border border-gray-100">
        {numero}
      </div>
    </div>
  );
};
