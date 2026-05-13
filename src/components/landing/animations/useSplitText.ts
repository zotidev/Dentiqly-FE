import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface SplitTextOptions {
  trigger?: "scroll" | "immediate"
  stagger?: number
  duration?: number
  delay?: number
  y?: number
}

export function useSplitText(options: SplitTextOptions = {}) {
  const {
    trigger = "scroll",
    stagger = 0.06,
    duration = 1,
    delay = 0,
    y = 100,
  } = options

  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const text = container.textContent || ""
    const words = text.split(" ").filter(Boolean)

    container.innerHTML = ""
    container.setAttribute("aria-label", text)

    words.forEach((word, i) => {
      const wordWrapper = document.createElement("span")
      wordWrapper.className = "split-word-wrapper"
      wordWrapper.style.display = "inline-block"
      wordWrapper.style.overflow = "hidden"
      wordWrapper.style.verticalAlign = "top"

      const wordSpan = document.createElement("span")
      wordSpan.className = "split-word"
      wordSpan.textContent = word
      wordSpan.style.display = "inline-block"
      wordSpan.style.willChange = "transform"

      wordWrapper.appendChild(wordSpan)
      container.appendChild(wordWrapper)

      if (i < words.length - 1) {
        const space = document.createElement("span")
        space.innerHTML = "&nbsp;"
        space.style.display = "inline-block"
        container.appendChild(space)
      }
    })

    const wordSpans = container.querySelectorAll(".split-word")

    if (trigger === "scroll") {
      gsap.from(wordSpans, {
        y: `${y}%`,
        opacity: 0,
        duration,
        stagger,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      })
    } else {
      gsap.from(wordSpans, {
        y: `${y}%`,
        opacity: 0,
        duration,
        stagger,
        delay,
        ease: "power4.out",
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill()
      })
      container.textContent = text
    }
  }, [trigger, stagger, duration, delay, y])

  return containerRef
}
