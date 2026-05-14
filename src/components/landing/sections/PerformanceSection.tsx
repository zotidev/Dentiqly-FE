import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

interface MetricData {
  multiplier: string
  label: string
  competitionLabel: string
  competitionValue: string
  competitionWidth: string
  dentiqlyLabel: string
  dentiqlyValue: string
  dentiqlyWidth: string
}

const metrics: MetricData[] = [
  {
    multiplier: "6.0x",
    label: "Gestión de turnos más rápida",
    competitionLabel: "COMPETENCIA",
    competitionValue: "180 s",
    competitionWidth: "100%",
    dentiqlyLabel: "DENTIQLY",
    dentiqlyValue: "30 s",
    dentiqlyWidth: "15%",
  },
  {
    multiplier: "7.0x",
    label: "Menor tasa de inasistencia",
    competitionLabel: "COMPETENCIA",
    competitionValue: "35 %",
    competitionWidth: "80%",
    dentiqlyLabel: "DENTIQLY",
    dentiqlyValue: "5 %",
    dentiqlyWidth: "12%",
  },
  {
    multiplier: "5.3x",
    label: "Carga de historias clínicas rápida",
    competitionLabel: "COMPETENCIA",
    competitionValue: "8 min",
    competitionWidth: "90%",
    dentiqlyLabel: "DENTIQLY",
    dentiqlyValue: "1.5 min",
    dentiqlyWidth: "18%",
  },
]

export const PerformanceSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  return (
    <section className="bg-[#0B1023] text-white py-24 sm:py-32 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* ── Left Sidebar (hidden on mobile) ── */}
          <div className="hidden lg:flex flex-col gap-6 w-48 shrink-0 pt-2 border-l border-white/10 pl-6">
            <button className="text-[11px] font-bold tracking-widest text-white text-left uppercase transition-colors">
              Eficiencia
            </button>
            <button className="text-[11px] font-bold tracking-widest text-white/40 hover:text-white text-left uppercase transition-colors">
              Pacientes
            </button>
            <button className="text-[11px] font-bold tracking-widest text-white/40 hover:text-white text-left uppercase transition-colors">
              Finanzas
            </button>
            <button className="text-[11px] font-bold tracking-widest text-white/40 hover:text-white text-left uppercase transition-colors">
              Integraciones
            </button>
            <button className="text-[11px] font-bold tracking-widest text-white/40 hover:text-white text-left uppercase transition-colors">
              Escalabilidad
            </button>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1" ref={ref}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h2 className="text-2xl sm:text-3xl font-medium leading-relaxed tracking-tight text-white mb-6">
                La gestión clínica moderna requiere precisión y velocidad. 
                El software tradicional o planillas sueltas limitan tu crecimiento. 
                <span className="text-white/60"> Dentiqly está diseñado para optimizar flujos de trabajo, 
                permitiéndote atender a más pacientes en menos tiempo.</span>
              </h2>
              
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium text-[#02E3FF]"
              >
                Conoce el impacto de Dentiqly
                <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Metrics List */}
            <div className="mt-20 flex flex-col gap-16">
              {metrics.map((metric, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-16 items-start">
                  
                  {/* Big Number */}
                  <div className="w-full md:w-56 shrink-0">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.6, delay: 0.2 + idx * 0.15 }}
                      className="text-5xl sm:text-6xl font-medium tracking-tighter text-white mb-2"
                    >
                      {metric.multiplier}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + idx * 0.15 }}
                      className="text-[#02E3FF] text-sm font-medium tracking-wide"
                    >
                      {metric.label}
                    </motion.div>
                  </div>

                  {/* Bars */}
                  <div className="flex-1 w-full pt-2 flex flex-col gap-5">
                    
                    {/* Competition Bar */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40 uppercase">
                        <span>{metric.competitionLabel}</span>
                        <span>{metric.competitionValue}</span>
                      </div>
                      <div className="h-3 w-full bg-transparent rounded-sm overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: metric.competitionWidth } : { width: 0 }}
                          transition={{ duration: 1, delay: 0.4 + idx * 0.15, ease: "easeOut" }}
                          className="h-full rounded-sm"
                          style={{
                            background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 4px, transparent 4px, transparent 8px)"
                          }}
                        />
                      </div>
                    </div>

                    {/* Dentiqly Bar */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[10px] font-bold font-mono tracking-widest text-[#02E3FF] uppercase">
                        <span>{metric.dentiqlyLabel}</span>
                        <span>{metric.dentiqlyValue}</span>
                      </div>
                      <div className="h-3 w-full bg-transparent rounded-sm overflow-hidden flex items-center">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: metric.dentiqlyWidth } : { width: 0 }}
                          transition={{ duration: 0.8, delay: 0.6 + idx * 0.15, ease: "easeOut" }}
                          className="h-full bg-[#02E3FF] rounded-sm shadow-[0_0_10px_rgba(2,227,255,0.5)]"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
