import React, { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const CtaSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cta-content > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#2563FF] to-[#0047FF] p-12 md:p-20 text-center overflow-hidden shadow-[0_20px_60px_rgba(37,99,255,0.2)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

          <div className="cta-content relative z-10">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-[-3px]">
              Digitalizá tu clínica dental
              <br />
              hoy mismo.
            </h2>
            <p className="text-blue-100/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Unite a las cientos de clinicas que ya estan ahorrando tiempo y
              brindando una experiencia excepcional a sus pacientes.
            </p>
            <Link
              to="/register"
              className="inline-flex bg-white text-[#2563FF] px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-transform shadow-xl items-center gap-2 group"
            >
              Crear mi cuenta gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
