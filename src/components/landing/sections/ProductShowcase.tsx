import React, { useEffect, useRef } from "react"
import { Calendar, Users, Receipt, BarChart3 } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    desc: "Visualiza tu dia al instante. Arrastra, suelta y confirma turnos por WhatsApp automaticamente sin mover un dedo.",
    large: true,
    dark: false,
    gradient: "from-[#2563FF] to-[#02E3FF]",
    iconBg: "bg-gradient-to-br from-[#2563FF] to-[#02E3FF]",
    hasVisual: true,
  },
  {
    icon: Users,
    title: "Historia Clinica Digital",
    desc: "Toda la informacion de tus pacientes asegurada y accesible desde cualquier dispositivo, en cualquier lugar del mundo.",
    large: false,
    dark: true,
    gradient: "",
    iconBg: "bg-white/10",
    hasVisual: false,
  },
  {
    icon: Receipt,
    title: "Facturacion Simplificada",
    desc: "Emite facturas y controla los pagos de multiples profesionales sin dolores de cabeza financieros.",
    large: false,
    dark: false,
    gradient: "",
    iconBg: "bg-purple-50",
    hasVisual: false,
  },
  {
    icon: BarChart3,
    title: "Metricas en Tiempo Real",
    desc: "Toma decisiones basadas en datos reales. Entiende de donde vienen tus ingresos y optimiza el rendimiento de tu clinica.",
    large: true,
    dark: false,
    gradient: "",
    iconBg: "bg-emerald-50",
    hasVisual: true,
  },
]

export const ProductShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.from(".product-card", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".product-grid",
          start: "top 80%",
        },
      })

      gsap.from(".bar-animate", {
        height: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".bar-container",
          start: "top 85%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="producto" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="product-title-reveal text-sm font-extrabold text-[#2563FF] tracking-widest uppercase mb-4">
            Poder sin limites
          </h2>
          <h3 className="product-subtitle-reveal text-4xl md:text-5xl font-extrabold text-[#0B1023] tracking-tight leading-tight">
            Todo lo que necesitas,
            <br />
            en una interfaz asombrosa.
          </h3>
        </div>

        <div className="product-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, i) => {
            const Icon = product.icon
            return (
              <div
                key={i}
                className={`product-card group relative rounded-3xl p-8 overflow-hidden transition-all duration-500 ${
                  product.large ? "md:col-span-2" : ""
                } ${
                  product.dark
                    ? "bg-[#0B1023] text-white hover:shadow-xl"
                    : "bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(37,99,255,0.1)]"
                }`}
              >
                {product.dark && (
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#2563FF] rounded-full blur-3xl opacity-40 group-hover:scale-150 transition-transform duration-700" />
                )}

                {!product.dark && product.large && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#2563FF]/8 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
                )}

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${product.iconBg} ${
                    product.dark ? "border border-white/20 backdrop-blur-md" : ""
                  } ${!product.dark && product.iconBg.includes("gradient") ? "shadow-lg shadow-blue-500/25" : ""}`}
                >
                  <Icon
                    className={`w-7 h-7 ${
                      product.dark
                        ? "text-white"
                        : product.iconBg.includes("purple")
                          ? "text-purple-600"
                          : product.iconBg.includes("emerald")
                            ? "text-emerald-600"
                            : "text-white"
                    }`}
                  />
                </div>

                <h4
                  className={`text-2xl font-bold mb-3 relative z-10 ${
                    product.dark ? "" : "text-[#0B1023]"
                  }`}
                >
                  {product.title}
                </h4>
                <p
                  className={`relative z-10 max-w-md ${
                    product.dark ? "text-gray-400" : "text-gray-600"
                  } ${product.large ? "mb-8" : ""}`}
                >
                  {product.desc}
                </p>

                {product.hasVisual && i === 0 && (
                  <div className="w-full h-48 bg-[#FAFCFF] rounded-2xl border border-gray-100 p-4 relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-500 mt-4">
                    <div className="flex gap-4 h-full">
                      <div className="w-16 h-full bg-white rounded-xl shadow-sm border border-gray-50 flex flex-col gap-2 p-2">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="w-full h-8 bg-gray-50 rounded-lg" />
                        ))}
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="w-full h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center px-4">
                          <div className="w-32 h-3 bg-blue-100 rounded-full" />
                        </div>
                        <div className="w-3/4 h-24 bg-gradient-to-r from-[#2563FF]/10 to-[#02E3FF]/10 rounded-xl border border-blue-100/50 relative">
                          <div className="absolute left-4 top-4 w-2 h-2 bg-[#2563FF] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {product.hasVisual && i === 3 && (
                  <div className="bar-container w-full md:w-1/2 h-40 bg-gray-50 rounded-2xl relative flex items-end justify-between p-4 group-hover:bg-emerald-50/30 transition-colors mt-4 md:ml-auto">
                    {[40, 70, 45, 90, 65].map((h, j) => (
                      <div
                        key={j}
                        className="bar-animate w-8 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
