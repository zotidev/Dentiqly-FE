import React, { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ─── Tab data mapped from existing FeatureDeepDive content ─── */
const tabs = [
  {
    number: "01",
    label: "ODONTOGRAMA INTERACTIVO",
    title:
      "Cada diente con su historial completo, accesible con un clic.",
    description:
      "Registrá hallazgos, tratamientos y evoluciones en un odontograma digital interactivo. Vista por diente, códigos de colores y exportación en PDF.",
    image: "/assets/features/odontograma.png",
  },
  {
    number: "02",
    label: "TURNOS Y WHATSAPP",
    title:
      "Reduce ausencias hasta un 80% sin mover un dedo.",
    description:
      "Tus pacientes reciben recordatorios automáticos por WhatsApp antes de cada turno. Confirmación, cancelación y mensajes personalizables.",
    image: "/assets/features/turnos-whatsapp.png",
  },
  {
    number: "03",
    label: "PANEL MULTI-SUCURSAL",
    title:
      "Todas tus sedes, un solo panel de control.",
    description:
      "Administrá todas tus sucursales desde un único panel. Compará rendimiento, gestioná profesionales y unificá la facturación en un solo lugar.",
    image: "/assets/features/multi-sucursal.png",
  },
]

export const TabbedShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  /* ─── Scroll-trigger entrance animation ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tabbed-showcase-inner", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* ─── Animate content on tab switch ─── */
  useEffect(() => {
    if (!contentRef.current) return
    const tl = gsap.timeline()
    tl.fromTo(
      contentRef.current.querySelectorAll(".tab-content-animate"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
    )
  }, [activeTab])

  const current = tabs[activeTab]

  return (
    <section
      ref={sectionRef}
      id="funcionalidades-tabs"
      className="py-24 sm:py-32 bg-[#FAFCFF] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tabbed-showcase-inner">
          {/* ═══ Tab Navigation Bar ═══ */}
          <div className="flex justify-center mb-16 sm:mb-20">
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
                    onClick={() => setActiveTab(index)}
                    className="relative flex items-center gap-2 transition-all duration-300 focus:outline-none"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "999px",
                      background: isActive ? "#0B1023" : "transparent",
                      color: isActive ? "#FFFFFF" : "#64748B",
                    }}
                  >
                    {/* Number circle */}
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

                    {/* Line + Label (visible on sm+) */}
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
                          fontFamily: "'Inter', sans-serif",
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

          {/* ═══ Content Area ═══ */}
          <div
            ref={contentRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          >
            {/* ── Left: Title + Description ── */}
            <div className="order-2 lg:order-1">
              <h3
                className="tab-content-animate text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.1] mb-6"
                style={{
                  color: "#0B1023",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {current.title}
              </h3>
              <p
                className="tab-content-animate text-lg leading-relaxed max-w-lg"
                style={{ color: "#64748B" }}
              >
                {current.description}
              </p>
            </div>

            {/* ── Right: Image Container ── */}
            <div className="order-1 lg:order-2">
              <div
                className="tab-content-animate relative rounded-3xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #EEF2FF 100%)",
                  border: "1px solid #E2E8F0",
                }}
              >
                {/* Subtle grid pattern overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.35]"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #CBD5E1 1px, transparent 1px),
                      linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Decorative curved accent on the bottom-left */}
                <div
                  className="absolute bottom-0 left-0 w-40 h-40 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at bottom left, rgba(37,99,255,0.08) 0%, transparent 70%)",
                  }}
                />

                {/* Image */}
                <div className="relative z-10 p-6 sm:p-8 flex items-center justify-center min-h-[320px] sm:min-h-[400px]">
                  <img
                    key={current.image}
                    src={current.image}
                    alt={current.label}
                    className="max-w-full max-h-[400px] object-contain drop-shadow-lg transition-opacity duration-300"
                    onError={(e) => {
                      // Graceful fallback if image not found
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const parent = target.parentElement
                      if (parent && !parent.querySelector(".img-fallback")) {
                        const fallback = document.createElement("div")
                        fallback.className =
                          "img-fallback flex items-center justify-center text-center p-8"
                        fallback.innerHTML = `
                          <div>
                            <div style="width:64px;height:64px;border-radius:16px;background:rgba(37,99,255,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563FF" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                            </div>
                            <p style="color:#94A3B8;font-size:14px;font-weight:500">Imagen próximamente</p>
                          </div>
                        `
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
