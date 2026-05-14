import React, { useEffect, useRef } from "react"
import { Calendar, Users, Bell, Settings, LayoutDashboard } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const screenshots = [
  {
    src: "/assets/screenshots/dashboard.png",
    title: "Dashboard Inteligente",
    desc: "Métricas, agenda y turnos del día en una vista clara y accionable.",
    icon: LayoutDashboard,
    accent: "#2563FF",
  },
]

export const ProductShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const showcaseTrackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animations
      gsap.from(".product-title-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".product-title-reveal",
          start: "top 85%",
        },
      })

      gsap.from(".product-subtitle-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".product-subtitle-reveal",
          start: "top 85%",
        },
      })

      // Featured hero screenshot — parallax float
      gsap.from(".showcase-hero", {
        y: 80,
        opacity: 0,
        scale: 0.92,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".showcase-hero",
          start: "top 85%",
        },
      })

      // Subtle parallax on hero image while scrolling
      gsap.to(".showcase-hero-img", {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".showcase-hero",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      })

      // Secondary cards — staggered reveal
      gsap.from(".showcase-card", {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".showcase-grid",
          start: "top 80%",
        },
      })

      // Each card image gets a subtle parallax
      document.querySelectorAll(".showcase-card-img").forEach((img) => {
        gsap.to(img, {
          y: -15,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".showcase-card"),
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const hero = screenshots[0]
  const rest = screenshots.slice(1)

  return (
    <section ref={sectionRef} id="producto" className="py-32 bg-white relative overflow-hidden">
      {/* Subtle bg decor */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,255,0.04) 0%, transparent 65%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="product-title-reveal text-sm font-extrabold text-[#2563FF] tracking-widest uppercase mb-4">
            Poder sin límites
          </h2>
          <h3 className="product-subtitle-reveal text-4xl md:text-5xl font-extrabold text-[#0B1023] tracking-tight leading-tight">
            Todo lo que necesitas,
            <br />
            en una interfaz asombrosa.
          </h3>
        </div>

        {/* ── Hero Screenshot (Dashboard — large) ── */}
        <div className="showcase-hero mb-10" ref={showcaseTrackRef}>
          <div className="relative group">
            {/* Outer glow */}
            <div
              className="absolute -inset-4 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
              style={{ background: `linear-gradient(135deg, ${hero.accent}22, transparent 60%)` }}
            />
            {/* Card */}
            <div className="relative bg-white rounded-[22px] border border-gray-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Top bar with info */}
              <div className="flex items-center gap-4 px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/40">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${hero.accent}12` }}
                >
                  <hero.icon className="w-5 h-5" style={{ color: hero.accent }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0B1023]">{hero.title}</h4>
                  <p className="text-sm text-gray-400">{hero.desc}</p>
                </div>
                {/* Dot indicators */}
                <div className="ml-auto flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <span className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
              </div>
              {/* Screenshot */}
              <div className="overflow-hidden">
                <img
                  src={hero.src}
                  alt={hero.title}
                  loading="lazy"
                  className="showcase-hero-img w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Secondary Screenshots Grid ── */}
        <div className="showcase-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((shot, i) => {
            const Icon = shot.icon
            return (
              <div key={i} className="showcase-card group relative">
                {/* Hover glow */}
                <div
                  className="absolute -inset-3 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                  style={{ background: `linear-gradient(135deg, ${shot.accent}18, transparent 60%)` }}
                />
                {/* Card */}
                <div className="relative bg-white rounded-2xl border border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                  {/* Label bar */}
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${shot.accent}12` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: shot.accent }} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0B1023] truncate">{shot.title}</h4>
                      <p className="text-xs text-gray-400 truncate">{shot.desc}</p>
                    </div>
                    <div className="ml-auto flex gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    </div>
                  </div>
                  {/* Screenshot */}
                  <div className="overflow-hidden">
                    <img
                      src={shot.src}
                      alt={shot.title}
                      loading="lazy"
                      className="showcase-card-img w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
