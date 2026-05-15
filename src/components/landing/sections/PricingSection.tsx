import React, { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Check, ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const features = [
  "Usuarios y profesionales ilimitados",
  "Gestion de turnos y agenda online",
  "Historias clinicas y odontogramas",
  "Facturacion y control de caja",
  "Recordatorios por WhatsApp",
  "Soporte prioritario 24/7",
]

export const PricingSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pricing-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })

      gsap.from(".pricing-card", {
        y: 80,
        opacity: 0,
        rotateX: 8,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pricing-card",
          start: "top 85%",
        },
      })

      gsap.from(".pricing-feature", {
        x: -15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pricing-card",
          start: "top 85%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="precios"
      data-navbar-theme="dark"
      className="py-28 sm:py-36 bg-[#0A0F2D] relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2563FF] rounded-[100%] blur-[150px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="pricing-title text-4xl md:text-5xl font-semibold text-white mb-6 tracking-[-3px]">
            Precios del software dental: simple, transparente, ilimitado.
          </h2>
          <p className="pricing-title text-xl text-blue-200/50">
            Un unico plan que escala con tu clinica. Sin letras chicas.
          </p>
        </div>

        <div className="pricing-card max-w-md mx-auto" style={{ perspective: "1000px" }}>
          <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#2563FF]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-[#0F1535] rounded-[2rem] p-10 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">Plan Pro</h3>
                <span className="px-4 py-1.5 rounded-full bg-[#0047FF]/15 border border-[#0047FF]/25 text-[#0047FF] text-xs font-bold uppercase tracking-wider">
                  Mas Popular
                </span>
              </div>

              <div className="mb-3">
                <span className="text-6xl font-semibold text-white tracking-[-3px]">
                  $80.000
                </span>
                <span className="text-blue-200/40 text-lg ml-2">ARS / mes</span>
              </div>
              <p className="text-blue-200/30 text-sm mb-6">
                o $864.000 /año <span className="text-[#22C55E] font-bold">(ahorrá 10%)</span>
              </p>

              <div className="space-y-5 mb-10">
                {features.map((feat, i) => (
                  <div key={i} className="pricing-feature flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0047FF]/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#0047FF]" />
                    </div>
                    <span className="text-blue-50/70">{feat}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="w-full btn-wayflyer-primary py-4 text-lg"
              >
                Comenzar 14 dias gratis
                <div className="btn-icon-circle">
                  <ArrowRight size={16} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
