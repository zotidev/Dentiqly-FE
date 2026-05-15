import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, ArrowRight } from "lucide-react"
import gsap from "gsap"

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.1,
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const darkSections = document.querySelectorAll<HTMLElement>('[data-navbar-theme="dark"]')
    if (darkSections.length === 0) return

    const visibleDarkSections = new Set<HTMLElement>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleDarkSections.add(entry.target as HTMLElement)
          } else {
            visibleDarkSections.delete(entry.target as HTMLElement)
          }
        })
        setIsDark(visibleDarkSections.size > 0)
      },
      {
        rootMargin: "-1px 0px -95% 0px",
      }
    )

    darkSections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
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
    { label: "Funcionalidades", href: "#funcionalidades-tabs" },
    { label: "Metricas", href: "#metricas" },
    { label: "Precios", href: "#precios" },
  ]

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-3"
      >
        <div className="w-full flex items-center justify-between h-[54px]">

          {/* ═══ Left: Logo ═══ */}
          <Link
            to="/"
            className="flex items-center shrink-0 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/dentiqly-logo.png"
              alt="Dentiqly"
              className={`h-[28px] w-auto transition-all duration-300 ${isDark ? "brightness-0 invert" : ""}`}
            />
          </Link>

          {/* ═══ Center: Nav Links pill ═══ */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-[#0047FF] rounded-full px-2 py-1.5 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 text-[13px] font-medium text-white hover:bg-white/15 rounded-full transition-all tracking-normal"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-1.5 transition-colors duration-300 ${isDark ? "text-white" : "text-[#0047FF]"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* ═══ Right: Auth Buttons ═══ */}
          <div className="hidden md:flex items-center gap-[10px]">
            <Link
              to="/login"
              className={`px-5 py-2.5 text-[13px] transition-all duration-300 ${
                isDark
                  ? "border border-white/30 text-white hover:bg-white/10 inline-flex items-center justify-center font-medium"
                  : "btn-wayflyer-secondary"
              }`}
            >
              <User size={14} className="mr-1.5" />
              Ingresar
            </Link>
            <Link
              to="/register"
              className={`px-5 py-2.5 text-[13px] transition-all duration-300 ${
                isDark
                  ? "bg-white text-[#0A0F2D] hover:bg-white/90 inline-flex items-center justify-center font-semibold gap-3"
                  : "btn-wayflyer-primary"
              }`}
            >
              Registrarse
              <div className={`btn-icon-circle ${isDark ? "!bg-[#0047FF] !text-white" : ""}`}>
                <ArrowRight size={12} />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 bg-[#0A0F2D]/95 backdrop-blur-xl pt-20 px-8 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link text-xl font-bold text-white/80 hover:text-white py-4 border-b border-white/5 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-8">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link text-center py-3.5 btn-wayflyer-secondary w-full"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link text-center py-3.5 btn-wayflyer-primary w-full"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
