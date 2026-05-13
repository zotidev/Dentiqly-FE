import React from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, PlayCircle, Sparkles, Star } from "lucide-react"
import { Hero3D } from "../Hero3D"

export const HeroSection: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FAFCFF]">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div
          style={{ y }}
          className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-b from-[#2563FF]/10 to-[#02E3FF]/5 rounded-full blur-[120px]"
        />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-tr from-[#8B5CF6]/10 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl relative z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#2563FF]" />
              <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2563FF] to-[#02E3FF]">
                La nueva era de la gestion dental
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-[#0A0F2D]"
            >
              Software dental <br />
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#2563FF] to-[#02E3FF]">
                  todo en uno
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "circOut" }}
                  className="absolute bottom-2 left-0 w-full h-4 bg-blue-100/60 -z-10 origin-left rounded-full"
                />
              </span>{" "}
              <br />
              sin complicaciones.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed"
            >
              Transforma la forma en que operas tu clinica. Gestiona pacientes,
              historias clinicas y facturacion con una fluidez que parece magia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                to="/register"
                className="group relative bg-[#2563FF] text-white px-8 py-4 rounded-2xl text-base font-bold overflow-hidden shadow-[0_10px_30px_rgba(37,99,255,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,255,0.4)] transition-all"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center justify-center gap-2">
                  Comenzar gratis
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
              <button className="group bg-white text-[#0A0F2D] border-2 border-gray-100 px-8 py-4 rounded-2xl text-base font-bold hover:border-gray-200 transition-all flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#2563FF] group-hover:text-white transition-colors">
                  <PlayCircle className="w-5 h-5" />
                </div>
                Ver demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex items-center gap-5"
            >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i}`}
                    alt="User"
                    className="w-12 h-12 rounded-full border-4 border-[#FAFCFF] shadow-sm"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Confiado por +500 clinicas
                </p>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="relative"
            >
              <Hero3D />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
