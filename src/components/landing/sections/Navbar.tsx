import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, ArrowRight } from "lucide-react"
import gsap from "gsap"

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
        {/* ── Navbar layout: two separate containers aligned to hero width ── */}
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* ═══ Container 1: Logo + Nav Links ═══ */}
          <div
            className="w-full max-w-[700px] flex items-center justify-between px-6"
            style={{
              background: "#0B1023",
              height: "44px",
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center shrink-0 hover:opacity-80 transition-opacity"
            >
              <img
                src="/assets/dentiqly-logo.png"
                alt="Dentiqly"
                className="h-[18px] w-auto brightness-0 invert"
              />
            </Link>

            {/* Nav links — aligned to end */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-1.5 text-[13px] font-medium text-white hover:text-[#02E3FF] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile hamburger inside container 1 */}
            <button
              className="md:hidden p-1.5 text-white/60"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* ═══ Container 2: Auth Buttons (visually separated, no bg) ═══ */}
          <div className="hidden md:flex items-center gap-[10px]">
            <Link
              to="/login"
              className="px-5 py-[6px] text-[13px] font-semibold text-white bg-[#0B1023] hover:bg-[#161d3a] transition-all whitespace-nowrap btn-hexagon flex items-center gap-1.5"
            >
              <User size={14} />
              Ingresar
            </Link>
            <Link
              to="/register"
              className="px-5 py-[6px] text-[13px] font-semibold text-[#0B1023] bg-[#02E3FF] hover:bg-[#02E3FF]/90 transition-all whitespace-nowrap btn-hexagon flex items-center gap-1.5"
            >
              Registrarse
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 bg-[#0B1023]/95 backdrop-blur-xl pt-20 px-8 md:hidden"
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
                className="mobile-nav-link text-center py-3.5 text-white/80 font-bold text-base border border-white/15 rounded-lg"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link text-center py-3.5 bg-white text-[#0B1023] font-bold text-base rounded-lg"
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
