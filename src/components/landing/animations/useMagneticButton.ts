import { useEffect, useRef } from "react"
import gsap from "gsap"

export function useMagneticButton(strength = 0.3) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
    if (isTouchDevice) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out",
      })
    }

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      })
    }

    el.addEventListener("mousemove", onMouseMove)
    el.addEventListener("mouseleave", onMouseLeave)

    return () => {
      el.removeEventListener("mousemove", onMouseMove)
      el.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [strength])

  return ref
}
