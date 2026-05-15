import React from "react"
import { Shield, Lock, Cloud, Database } from "lucide-react"
import { motion } from "framer-motion"

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
  return (
    <section id="seguridad" className="py-28 sm:py-36 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#2563FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[#0047FF]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-extrabold text-[#0047FF] tracking-widest uppercase mb-4"
          >
            Seguridad de nivel empresarial
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0A0F2D] tracking-[-3px]"
          >
            Tus datos dentales, siempre protegidos.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {badges.map((badge, i) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#0047FF]/30 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0047FF]/10 flex items-center justify-center mb-5 group-hover:bg-[#0047FF]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#0047FF]" />
                </div>
                <h4 className="text-lg font-bold text-[#0A0F2D] mb-2">{badge.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{badge.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
