import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const metrics = [
  { value: 500, prefix: "+", suffix: "", label: "Clinicas activas" },
  { value: 50000, prefix: "+", suffix: "", label: "Pacientes gestionados" },
  { value: 99.9, prefix: "", suffix: "%", label: "Uptime garantizado", decimals: 1 },
  { value: 24, prefix: "", suffix: "/7", label: "Soporte disponible" },
]

function AnimatedNumber({
  target,
  prefix,
  suffix,
  decimals = 0,
}: {
  target: number
  prefix: string
  suffix: string
  decimals?: number
}) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (!ref.current) return

    const obj = { val: 0 }
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: "power2.out",
          snap: { val: decimals > 0 ? 0.1 : 1 },
          onUpdate: () => setValue(Number(obj.val.toFixed(decimals))),
        })
      },
    })

    return () => trigger.kill()
  }, [target, decimals])

  const formatted =
    target >= 1000 && decimals === 0
      ? value.toLocaleString("es-AR")
      : value.toFixed(decimals)

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-3">
        {prefix}
        {formatted}
        {suffix}
      </div>
    </div>
  )
}

export const MetricsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".metric-label", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="metricas"
      className="py-28 sm:py-36 bg-[#0B1023] relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2563FF] rounded-[100%] blur-[150px] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center">
              <AnimatedNumber
                target={m.value}
                prefix={m.prefix}
                suffix={m.suffix}
                decimals={m.decimals || 0}
              />
              <p className="metric-label text-sm text-white/40 font-medium tracking-wide">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
