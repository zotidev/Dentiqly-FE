import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const Hero3D: React.FC = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Decorative background circles that also tilt */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-[#2563FF]/20 to-[#02E3FF]/20 rounded-full blur-3xl -z-10 transform-gpu"
          style={{ transform: "translateZ(-50px)" }}
        />
        
        <motion.img
          src="/assets/hero-tooth.png"
          alt="Dentiqly Tooth"
          className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(37,99,255,0.3)]"
          style={{ transform: "translateZ(50px)" }}
        />
      </motion.div>
    </div>
  );
};
