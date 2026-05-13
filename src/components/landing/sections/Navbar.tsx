import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      })
    })

    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      ctx.revert()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    if (!mobileMenuRef.current) return
    const links = mobileMenuRef.current.querySelectorAll(".mobile-nav-link")

    if (mobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      )
      gsap.fromTo(
        links,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, delay: 0.15, ease: "power3.out" }
      )
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { label: "Producto", href: "#producto" },
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Metricas", href: "#metricas" },
    { label: "Precios", href: "#precios" },
  ]

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div
          className={`w-full max-w-6xl rounded-full px-6 py-4 flex justify-between items-center transition-all duration-500 ${
            scrolled
              ? "bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
              : "bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#2563FF] hover:bg-blue-50/50 rounded-full transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-[#2563FF] transition-colors"
            >
              Ingresar
            </Link>
            <Link
              to="/register"
              className="group relative px-6 py-2.5 bg-[#0A0F2D] text-white rounded-full text-sm font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(37,99,255,0.6)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Probar gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563FF] to-[#02E3FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 bg-[#0B1023]/95 backdrop-blur-xl pt-28 px-8 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link text-2xl font-bold text-white/80 hover:text-[#02E3FF] py-4 border-b border-white/5 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-8">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link text-center py-4 text-white/80 font-bold text-lg"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link text-center py-4 bg-[#02E3FF] text-[#0B1023] font-bold text-lg rounded-2xl"
              >
                Probar gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
