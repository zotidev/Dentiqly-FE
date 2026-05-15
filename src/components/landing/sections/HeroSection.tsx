import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

// ASCII Molar Tooth Pattern mimicking the reference's background tech style
const AsciiTooth = ({ className }: { className?: string }) => (
  <pre className={`text-[8px] sm:text-[10px] md:text-[12px] leading-[8px] sm:leading-[10px] md:leading-[12px] font-mono whitespace-pre select-none pointer-events-none ${className}`}>
    {`       +++++++++++++++
     +++++++++++++++++++
    +++++++++++++++++++++
    +++++++++++++++++++++
    +++++++++++++++++++++
     +++++++++++++++++++
       +++++++++++++++
        ++++     ++++
        ++++     ++++
        ++++     ++++
        +++       +++
        ++         ++`}
  </pre>
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden bg-white pt-32 pb-20">

      {/* ── Background ASCII Shapes ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <AsciiTooth className="absolute left-[5%] top-[22%] text-[#0A0F2D]/20 -rotate-12" />
        <AsciiTooth className="absolute right-[8%] bottom-[20%] text-[#0A0F2D]/25 rotate-12 scale-125" />
        <AsciiTooth className="absolute left-[15%] bottom-[10%] text-[#0A0F2D]/20 -rotate-6 scale-75" />
        <AsciiTooth className="absolute right-[15%] top-[18%] text-[#0A0F2D]/20 rotate-6 scale-90" />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

        {/* ── Title ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[2.8rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.8rem] font-semibold tracking-[-3px] leading-[1.05] text-[#0A0F2D] mb-6 w-full"
        >
          Software dental<br />
          todo en uno
        </motion.h1>

        {/* ── Paragraph ── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[17px] sm:text-[20px] text-gray-500 leading-relaxed max-w-[700px] mb-10"
        >
          Desarrolla experiencias excepcionales para tus pacientes.
          Gestiona historias clínicas, turnos y facturación con una fluidez que parece magia. Sin complicaciones.
        </motion.p>

        {/* ── Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
        >
          <Link
            to="/register"
            className="btn-wayflyer-secondary min-w-[180px]"
          >
            Ver demo
          </Link>
          <Link
            to="/register"
            className="btn-wayflyer-primary min-w-[180px]"
          >
            Comenzar gratis
            <div className="btn-icon-circle">
              <ArrowRight size={14} />
            </div>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
