import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  start?: string
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = "",
  delay = 0,
  y = 60,
  duration = 1,
  start = "top 85%",
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y,
        opacity: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      })
    }, el)

    return () => ctx.revert()
  }, [delay, y, duration, start])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
