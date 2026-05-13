import React, { useEffect, useRef } from "react"
import { Shield, Lock, Cloud, Database } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const badges = [
  {
    icon: Lock,
    title: "Encriptacion AES-256",
    desc: "Tus datos protegidos con el mismo estandar que usan los bancos.",
  },
  {
    icon: Cloud,
    title: "Cloud Security",
    desc: "Infraestructura en la nube con redundancia y alta disponibilidad.",
  },
  {
    icon: Database,
    title: "Backups Automaticos",
    desc: "Copias de seguridad cada hora. Nunca pierdas un dato.",
  },
  {
    icon: Shield,
    title: "Compliance Total",
    desc: "Cumplimos con todas las regulaciones de proteccion de datos de salud.",
  },
]

export const SecuritySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".security-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })

      gsap.from(".security-badge", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".security-grid",
          start: "top 80%",
        },
      })

      gsap.from(".security-shimmer", {
        x: "-100%",
        duration: 1.5,
        delay: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".security-grid",
          start: "top 80%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-28 sm:py-36 bg-[#0B1023] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#2563FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[#02E3FF]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="security-title text-sm font-extrabold text-[#02E3FF] tracking-widest uppercase mb-4">
            Seguridad de nivel empresarial
          </h2>
          <h3 className="security-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Tus datos, siempre protegidos.
          </h3>
        </div>

        <div className="security-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="security-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none rounded-3xl" />

          {badges.map((badge, i) => {
            const Icon = badge.icon
            return (
              <div
                key={i}
                className="security-badge group relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2563FF]/10 flex items-center justify-center mb-5 group-hover:bg-[#2563FF]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#02E3FF]" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{badge.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed">{badge.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
