import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

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

const AsciiAgenda = ({ className }: { className?: string }) => (
  <pre className={`text-[7px] sm:text-[9px] md:text-[10px] leading-[9px] sm:leading-[11px] md:leading-[12px] font-mono whitespace-pre select-none pointer-events-none ${className}`}>
    {`+========================+
|  <<<   AGENDA   >>>    |
+========================+
|  LU  MA  MI  JU  VI   |
|------------------------+
|  08  --  --  09  --    |
|  09  10  --  --  11    |
|  --  --  14  15  --    |
|  16  --  17  --  18    |
|  --  20  --  21  --    |
+------------------------+
|  >> TURNO 09:30  <<    |
|  >> TURNO 14:00  <<    |
+========================+`}
  </pre>
);

const AsciiCalendar = ({ className }: { className?: string }) => (
  <pre className={`text-[7px] sm:text-[9px] md:text-[10px] leading-[9px] sm:leading-[11px] md:leading-[12px] font-mono whitespace-pre select-none pointer-events-none ${className}`}>
    {`+--+--+--+--+--+
|LU|MA|MI|JU|VI|
+--+--+--+--+--+
|  |##|  |##|  |
|##|  |  |  |##|
|  |  |##|  |  |
|  |##|  |##|  |
+--+--+--+--+--+`}
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

        <AsciiAgenda className="absolute left-[2%] top-[50%] text-[#0A0F2D]/[0.7] rotate-6" />
        <AsciiAgenda className="absolute right-[3%] top-[38%] text-[#0A0F2D]/[0.9] -rotate-3 scale-110" />
        <AsciiCalendar className="absolute left-[22%] top-[12%] text-[#0A0F2D]/[0.8] rotate-3" />
        <AsciiCalendar className="absolute right-[20%] bottom-[8%] text-[#0A0F2D]/[0.8] -rotate-6 scale-110" />
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
