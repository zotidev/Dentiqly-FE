import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Play, ArrowRight } from "lucide-react"
import { Hero3D } from "../Hero3D"

export const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-white">
      {/* ── Content pinned to the very bottom ── */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        {/* Bottom layout: title+desc LEFT — buttons RIGHT, same baseline */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-24">
          {/* ── Left: Title + Description ── */}
          <div className="max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-[2.5rem] sm:text-[2.8rem] lg:text-[3.2rem] font-extrabold tracking-tight leading-[1.1] text-[#0A0F2D] mb-4"
            >
              Software dental{" "}
              <br className="hidden sm:block" />
              <span className="relative inline-block px-1 mx-1">
                <span className="relative z-10 text-[#0A0F2D]">
                  todo en uno
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: "circOut" }}
                  className="absolute inset-y-1 inset-x-0 bg-[#02E3FF] -z-10 origin-left"
                />
              </span>{" "}
              <br />
              sin complicaciones.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-[15px] sm:text-base text-gray-400 leading-relaxed max-w-md"
            >
              Transforma la forma en que operas tu clinica. Gestiona pacientes,
              historias clinicas y facturacion con una fluidez que parece magia.
            </motion.p>
          </div>

          {/* ── Right: Buttons (at the same bottom baseline) ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-row gap-3 shrink-0 pb-1"
          >
            <Link
              to="/register"
              className="px-8 py-3 text-[13px] font-semibold text-[#0B1023] bg-[#02E3FF] hover:bg-[#02E3FF]/90 transition-all whitespace-nowrap btn-hexagon flex items-center justify-center gap-2"
            >
              Comenzar gratis
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 text-[13px] font-semibold text-white bg-[#0B1023] hover:bg-[#161d3a] transition-all whitespace-nowrap btn-hexagon flex items-center justify-center gap-2"
            >
              <Play size={15} />
              Ver demo
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
