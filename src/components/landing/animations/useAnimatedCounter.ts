import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function useAnimatedCounter(target: number, duration = 2, decimals = 0) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (!ref.current) return

    const obj = { value: 0 }

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        gsap.to(obj, {
          value: target,
          duration,
          ease: "power2.out",
          snap: { value: 1 / Math.pow(10, decimals) },
          onUpdate: () => setValue(Number(obj.value.toFixed(decimals))),
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [target, duration, decimals])

  return { value, ref }
}
