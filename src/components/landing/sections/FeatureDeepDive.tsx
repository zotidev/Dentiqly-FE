import React, { useEffect, useRef } from "react"
import { Smile, MessageCircle, Building2 } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Smile,
    title: "Odontograma interactivo",
    subtitle: "Registro visual completo",
    desc: "Registra hallazgos, tratamientos y evoluciones en un odontograma digital interactivo. Cada diente con su historial completo, accesible con un clic.",
    bullets: [
      "Vista por diente con estado actual y tratamientos previos",
      "Registro de hallazgos con codigos de colores",
      "Exportacion en PDF para derivaciones",
    ],
    color: "#2563FF",
    visual: "odontograma",
  },
  {
    icon: MessageCircle,
    title: "Turnos y WhatsApp",
    subtitle: "Recordatorios automaticos",
    desc: "Tus pacientes reciben recordatorios automaticos por WhatsApp antes de cada turno. Reduce las ausencias hasta un 80% sin mover un dedo.",
    bullets: [
      "Confirmacion y cancelacion desde WhatsApp",
      "Recordatorios 24h y 1h antes del turno",
      "Mensajes personalizables por clinica",
    ],
    color: "#02E3FF",
    visual: "whatsapp",
  },
  {
    icon: Building2,
    title: "Panel multi-sucursal",
    subtitle: "Gestion centralizada",
    desc: "Administra todas tus sucursales desde un unico panel. Compara rendimiento, gestiona profesionales y unifica la facturacion en un solo lugar.",
    bullets: [
      "Dashboard comparativo entre sucursales",
      "Profesionales compartidos entre sedes",
      "Reportes consolidados de facturacion",
    ],
    color: "#7C3AED",
    visual: "multi",
  },
]

export const FeatureDeepDive: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const featureBlocks = gsap.utils.toArray<HTMLElement>(".feature-block")

      featureBlocks.forEach((block) => {
        const textEls = block.querySelectorAll(".feature-text-reveal")
        const visual = block.querySelector(".feature-visual")
        const bullets = block.querySelectorAll(".feature-bullet")

        gsap.from(textEls, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 75%",
          },
        })

        if (visual) {
          gsap.from(visual, {
            scale: 0.85,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 70%",
            },
          })
        }

        gsap.from(bullets, {
          x: -20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 65%",
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="funcionalidades" className="py-32 bg-[#FAFCFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {features.map((feature, i) => {
          const Icon = feature.icon
          const isReversed = i % 2 !== 0
          return (
            <div
              key={i}
              className={`feature-block grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                i < features.length - 1 ? "mb-32" : ""
              }`}
            >
              <div className={isReversed ? "lg:order-2" : ""}>
                <div
                  className="feature-text-reveal w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${feature.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <p
                  className="feature-text-reveal text-sm font-bold tracking-widest uppercase mb-3"
                  style={{ color: feature.color }}
                >
                  {feature.subtitle}
                </p>
                <h3 className="feature-text-reveal text-3xl sm:text-4xl font-extrabold text-[#0B1023] tracking-tight mb-5">
                  {feature.title}
                </h3>
                <p className="feature-text-reveal text-lg text-gray-600 leading-relaxed mb-8">
                  {feature.desc}
                </p>
                <div className="space-y-4">
                  {feature.bullets.map((bullet, j) => (
                    <div key={j} className="feature-bullet flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${feature.color}15` }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: feature.color }}
                        />
                      </div>
                      <span className="text-gray-600">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${isReversed ? "lg:order-1" : ""}`}>
                <div
                  className="feature-visual relative rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}08, ${feature.color}15)`,
                    border: `1px solid ${feature.color}15`,
                  }}
                >
                  {feature.visual === "odontograma" && (
                    <div className="w-full h-full p-8 flex items-center justify-center">
                      <div className="grid grid-cols-8 gap-1.5">
                        {Array.from({ length: 32 }).map((_, t) => (
                          <div
                            key={t}
                            className="w-7 h-9 rounded-md border transition-colors"
                            style={{
                              borderColor: `${feature.color}30`,
                              background:
                                t % 7 === 0
                                  ? `${feature.color}20`
                                  : t % 5 === 0
                                    ? "#22C55E20"
                                    : "white",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {feature.visual === "whatsapp" && (
                    <div className="w-full h-full p-8 flex flex-col items-center justify-center gap-3">
                      {[
                        { align: "left", text: "Hola! Recordatorio de tu turno manana a las 10:00" },
                        { align: "right", text: "Confirmo! Gracias" },
                        { align: "left", text: "Perfecto, te esperamos!" },
                      ].map((msg, m) => (
                        <div
                          key={m}
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                            msg.align === "left"
                              ? "self-start bg-white shadow-sm text-gray-700"
                              : "self-end bg-[#02E3FF] text-[#0B1023] font-medium"
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>
                  )}
                  {feature.visual === "multi" && (
                    <div className="w-full h-full p-8 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                        {["Sede Central", "Sede Norte", "Sede Sur", "Sede Oeste"].map(
                          (sede, s) => (
                            <div
                              key={s}
                              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                            >
                              <div
                                className="w-3 h-3 rounded-full mb-2"
                                style={{
                                  background:
                                    s === 0
                                      ? "#22C55E"
                                      : s === 1
                                        ? "#2563FF"
                                        : s === 2
                                          ? "#F59E0B"
                                          : "#7C3AED",
                                }}
                              />
                              <p className="text-xs font-bold text-[#0B1023]">{sede}</p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {12 + s * 3} profesionales
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
