import React, { useEffect, useRef, useState } from "react"
import { Calendar, Users, Bell, Settings, LayoutDashboard, ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Link } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

const useCases = [
  {
    key: "dashboard",
    src: "/assets/screenshots/dashboard.png",
    label: "DASHBOARD",
    title: "Panel de control inteligente",
    desc: "Métricas, agenda y resumen del día en una vista clara y accionable.",
    icon: LayoutDashboard,
    cta: "Descubrí el Dashboard",
  },
  {
    key: "calendario",
    src: "/assets/screenshots/calendario.png",
    label: "CALENDARIO",
    title: "Agenda dental online",
    desc: "Agenda visual con turnos, disponibilidad y gestión por profesional.",
    icon: Calendar,
    cta: "Descubrí el Calendario",
  },
  {
    key: "pacientes",
    src: "/assets/screenshots/paciente-detalle.png",
    label: "PACIENTES",
    title: "Ficha completa del paciente",
    desc: "Historial clínico, odontograma y tratamientos en un solo lugar.",
    icon: Users,
    cta: "Descubrí Pacientes",
  },
  {
    key: "recordatorios",
    src: "/assets/screenshots/recordatorios.png",
    label: "RECORDATORIOS",
    title: "Notificaciones automáticas",
    desc: "Recordatorios por email para reducir inasistencias hasta un 80%.",
    icon: Bell,
    cta: "Descubrí Recordatorios",
  },
  {
    key: "configuracion",
    src: "/assets/screenshots/configuracion.png",
    label: "CONFIGURACIÓN",
    title: "Personalización total",
    desc: "Servicios, horarios, permisos y roles adaptados a tu clínica.",
    icon: Settings,
    cta: "Descubrí Configuración",
  },
]

export const ProductShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".showcase-header-left > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      })

      gsap.from(".showcase-header-right", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      })

      gsap.from(".showcase-gallery", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: { trigger: ".showcase-gallery", start: "top 85%" },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const mainImg = document.querySelector(".showcase-main-img")
    const overlay = document.querySelector(".showcase-overlay-content")
    if (mainImg) {
      gsap.fromTo(mainImg, { opacity: 0, scale: 1.02 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" })
    }
    if (overlay) {
      gsap.fromTo(overlay, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: "power3.out" })
    }
  }, [active])

  const current = useCases[active]
  const others = useCases.filter((_, i) => i !== active)

  return (
    <section
      ref={sectionRef}
      id="producto"
      className="min-h-screen flex flex-col justify-center py-16 sm:py-20 bg-[#FAFCFF] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="showcase-header-left flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <LayoutDashboard className="w-4 h-4 text-[#2563FF]" />
              <p className="text-sm font-extrabold text-[#2563FF] tracking-widest uppercase">
                Casos de uso
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl xl:text-[3.4rem] font-semibold text-[#0A0F2D] tracking-[-3px] leading-[1.1]">
              Todo lo que necesitas
              <br />
              para gestionar tu clínica
            </h2>
          </div>

          <div className="showcase-header-right lg:max-w-sm lg:text-right">
            <p className="text-base text-gray-500 leading-relaxed">
              <span className="font-semibold text-[#0A0F2D]">Automatizá la gestión, controlá turnos</span>
              {" "}y ofrecé una experiencia excepcional a tus pacientes.
            </p>
          </div>
        </div>

        {/* ── Gallery ── */}
        <div className="showcase-gallery flex flex-col lg:flex-row gap-2 items-stretch">

          {/* Main Image — shows full screenshot */}
          <div className="relative rounded-2xl overflow-hidden group" style={{ flex: "1 1 0", minWidth: 0 }}>
            <img
              key={current.src}
              src={current.src}
              alt={`Dentiqly - ${current.title}`}
              className="showcase-main-img w-full h-auto block rounded-2xl"
              style={{ imageRendering: "auto", maxWidth: "1024px" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl" />

            <div className="showcase-overlay-content absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 rounded-md bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold tracking-widest uppercase mb-3 border border-white/10">
                {current.label}
              </span>
              <h3 className="text-xl font-semibold text-white mb-1 tracking-[-1px]">
                {current.title}
              </h3>
              <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-4">
                {current.desc}
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0A0F2D] text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                {current.cta}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Thumbnails — 2x2 grid */}
          <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-2 shrink-0" style={{ width: "280px" }}>
            {others.map((uc) => {
              const idx = useCases.findIndex((u) => u.key === uc.key)
              return (
                <button
                  key={uc.key}
                  onClick={() => setActive(idx)}
                  className="relative rounded-xl overflow-hidden group/thumb transition-all duration-300 hover:ring-2 hover:ring-[#2563FF]/30"
                >
                  <img
                    src={uc.src}
                    alt={`Dentiqly - ${uc.title}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-left-top transition-transform duration-500 group-hover/thumb:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover/thumb:bg-black/15 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <span className="text-white text-[10px] font-bold tracking-wider uppercase">
                      {uc.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile thumbnails */}
        <div className="flex lg:hidden gap-2 mt-4 overflow-x-auto">
          {useCases.map((uc, i) => (
            <button
              key={uc.key}
              onClick={() => setActive(i)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                active === i
                  ? "bg-[#0A0F2D] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {uc.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
