import React, { useState, useEffect, useRef, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const tabs = [
  {
    number: "01",
    label: "ODONTOGRAMA INTERACTIVO",
    title:
      "Cada diente con su historial completo, accesible con un clic.",
    description:
      "Registrá hallazgos, tratamientos y evoluciones en un odontograma digital interactivo. Vista por diente, códigos de colores y exportación en PDF.",
    image: "/assets/features/3d-odontograma.png",
  },
  {
    number: "02",
    label: "TURNOS Y EMAIL",
    title:
      "Reduce ausencias hasta un 80% sin mover un dedo.",
    description:
      "Tus pacientes reciben recordatorios automáticos por email antes de cada turno. Confirmación, cancelación y mensajes personalizables.",
    image: "/assets/features/3d-email.png",
  },
  {
    number: "03",
    label: "PANEL MULTI-SUCURSAL",
    title:
      "Todas tus sedes, un solo panel de control.",
    description:
      "Administrá todas tus sucursales desde un único panel. Compará rendimiento, gestioná profesionales y unificá la gestión en un solo lugar.",
    image: "/assets/features/3d-multi.png",
  },
]

export const TabbedShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const pinWrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const prevTabRef = useRef(0)

  const animateContent = useCallback((direction: "down" | "up") => {
    if (!contentRef.current) return
    const els = contentRef.current.querySelectorAll(".tab-content-animate")
    const yFrom = direction === "down" ? 30 : -30
    gsap.fromTo(
      els,
      { opacity: 0, y: yFrom },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out", overwrite: true }
    )
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from(".tabbed-showcase-inner", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      })

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * (tabs.length - 1)}`,
        pin: pinWrapperRef.current,
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress
          const newTab = Math.min(
            tabs.length - 1,
            Math.floor(progress * tabs.length)
          )
          setActiveTab((prev) => {
            if (prev !== newTab) {
              const direction = newTab > prev ? "down" : "up"
              prevTabRef.current = prev
              requestAnimationFrame(() => animateContent(direction))
            }
            return newTab
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [animateContent])

  const current = tabs[activeTab]

  return (
    <section
      ref={sectionRef}
      id="funcionalidades-tabs"
      className="relative overflow-hidden"
      style={{ minHeight: `${100 * tabs.length}vh` }}
    >
      <div
        ref={pinWrapperRef}
        className="bg-[#FAFCFF]"
        style={{ height: "100vh", display: "flex", alignItems: "center" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="tabbed-showcase-inner">
            {/* Tab Navigation Bar */}
            <div className="flex justify-center mb-10 sm:mb-12">
              <div
                className="inline-flex items-center gap-0 rounded-full px-2 py-2"
                style={{
                  background: "#F1F5F9",
                  border: "1px solid #E2E8F0",
                }}
              >
                {tabs.map((tab, index) => {
                  const isActive = activeTab === index
                  return (
                    <button
                      key={tab.number}
                      className="relative flex items-center gap-2 transition-all duration-300 focus:outline-none cursor-default"
                      style={{
                        padding: "10px 20px",
                        borderRadius: "999px",
                        background: isActive ? "#0A0F2D" : "transparent",
                        color: isActive ? "#FFFFFF" : "#64748B",
                      }}
                    >
                      <span
                        className="flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300"
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          border: isActive
                            ? "1.5px solid rgba(255,255,255,0.4)"
                            : "1.5px solid #94A3B8",
                          color: isActive ? "#FFFFFF" : "#64748B",
                        }}
                      >
                        {tab.number}
                      </span>

                      <span className="hidden sm:flex items-center gap-2">
                        <span
                          className="block transition-all duration-300"
                          style={{
                            width: isActive ? "32px" : "16px",
                            height: "1.5px",
                            background: isActive
                              ? "rgba(255,255,255,0.3)"
                              : "#CBD5E1",
                          }}
                        />
                        <span
                          className="text-xs font-bold tracking-[0.12em] uppercase whitespace-nowrap transition-colors duration-300"
                          style={{
                            fontFamily: "'Instrument Sans', sans-serif",
                          }}
                        >
                          {tab.label}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                {tabs.map((_, index) => (
                  <div
                    key={index}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: activeTab === index ? "32px" : "8px",
                      background:
                        activeTab === index
                          ? "#0047FF"
                          : activeTab > index
                          ? "#0047FF"
                          : "#E2E8F0",
                      opacity: activeTab >= index ? 1 : 0.4,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div
              ref={contentRef}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              {/* Left: Title + Description */}
              <div className="order-2 lg:order-1">
                <h2
                  className="tab-content-animate text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-[-3px] leading-[1.1] mb-6"
                  style={{
                    color: "#0A0F2D",
                    fontFamily: "'Instrument Sans', sans-serif",
                  }}
                >
                  {current.title}
                </h2>
                <p
                  className="tab-content-animate text-lg leading-relaxed max-w-lg"
                  style={{ color: "#64748B" }}
                >
                  {current.description}
                </p>
              </div>

              {/* Right: Image Container */}
              <div className="order-1 lg:order-2">
                <div
                  className="tab-content-animate relative rounded-3xl overflow-hidden bg-[#FAFCFF]"
                  style={{
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none opacity-50"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #CBD5E1 1px, transparent 1px),
                        linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)
                      `,
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Dynamic glow based on active tab */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20 blur-[60px] transition-colors duration-1000"
                    style={{
                      background: activeTab === 0 
                        ? 'radial-gradient(circle at center, #2563FF 0%, transparent 70%)'
                        : activeTab === 1 
                        ? 'radial-gradient(circle at center, #02E3FF 0%, transparent 70%)'
                        : 'radial-gradient(circle at center, #8B5CF6 0%, transparent 70%)'
                    }}
                  />

                  <div className="relative z-10 p-6 sm:p-8 flex items-center justify-center min-h-[320px] sm:min-h-[400px]">
                    <img
                      key={current.image}
                      src={current.image}
                      alt={`Dentiqly - ${current.label}: ${current.title}`}
                      loading="lazy"
                      className="max-w-full max-h-[400px] object-contain drop-shadow-[0_20px_40px_rgba(37,99,255,0.15)] animate-float scale-110 mix-blend-multiply"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
