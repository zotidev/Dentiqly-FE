import React, { useEffect, useRef } from "react"
import * as THREE from "three"

export const About3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // --- Floating torus knot (main centerpiece) ---
    const torusGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32, 2, 3)
    const torusMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563ff,
      metalness: 0.3,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      ior: 1.5,
      envMapIntensity: 1.0,
    })
    const torusKnot = new THREE.Mesh(torusGeo, torusMat)
    scene.add(torusKnot)

    // --- Orbiting icosahedrons ---
    const icoGroup = new THREE.Group()
    const icoGeo = new THREE.IcosahedronGeometry(0.2, 0)
    const icoColors = [0x02e3ff, 0x2563ff, 0x8b5cf6, 0x02e3ff]
    const icos: THREE.Mesh[] = []
    for (let i = 0; i < 4; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: icoColors[i],
        metalness: 0.5,
        roughness: 0.1,
        clearcoat: 1.0,
        transmission: 0.4,
        thickness: 0.3,
      })
      const ico = new THREE.Mesh(icoGeo, mat)
      icos.push(ico)
      icoGroup.add(ico)
    }
    scene.add(icoGroup)

    // --- Particle field ---
    const particleCount = 200
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSizes = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8
      particleSizes[i] = Math.random() * 3 + 1
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1))

    const particleMat = new THREE.PointsMaterial({
      color: 0x02e3ff,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // --- Wireframe sphere ring ---
    const ringGeo = new THREE.TorusGeometry(2.8, 0.01, 8, 80)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x2563ff,
      transparent: true,
      opacity: 0.15,
    })
    const ring1 = new THREE.Mesh(ringGeo, ringMat)
    ring1.rotation.x = Math.PI / 3
    scene.add(ring1)

    const ring2 = ring1.clone()
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.z = Math.PI / 6
    scene.add(ring2)

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0x2563ff, 2)
    mainLight.position.set(3, 3, 5)
    scene.add(mainLight)

    const accentLight = new THREE.PointLight(0x02e3ff, 3, 10)
    accentLight.position.set(-3, 2, 3)
    scene.add(accentLight)

    const backLight = new THREE.PointLight(0x8b5cf6, 2, 10)
    backLight.position.set(2, -2, -3)
    scene.add(backLight)

    // --- Mouse interaction ---
    let mouseX = 0, mouseY = 0
    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    container.addEventListener("mousemove", handleMouse)

    // --- Animation loop ---
    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Main knot rotation + float
      torusKnot.rotation.x = t * 0.15 + mouseY * 0.3
      torusKnot.rotation.y = t * 0.2 + mouseX * 0.3
      torusKnot.position.y = Math.sin(t * 0.5) * 0.3

      // Orbiting icosahedrons
      icos.forEach((ico, i) => {
        const angle = t * 0.4 + (i * Math.PI * 2) / 4
        const radius = 2.2 + Math.sin(t * 0.3 + i) * 0.3
        ico.position.x = Math.cos(angle) * radius
        ico.position.y = Math.sin(angle * 0.7 + i) * 0.8
        ico.position.z = Math.sin(angle) * radius * 0.5
        ico.rotation.x = t * 0.8 + i
        ico.rotation.y = t * 0.6 + i
      })

      // Rings rotate slowly
      ring1.rotation.z = t * 0.05
      ring2.rotation.y = t * 0.04

      // Particles drift
      const posArr = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += Math.sin(t + i) * 0.0005
      }
      particleGeo.attributes.position.needsUpdate = true

      // Accent light orbits
      accentLight.position.x = Math.cos(t * 0.3) * 4
      accentLight.position.z = Math.sin(t * 0.3) * 4

      // Camera follows mouse slightly
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    // --- Resize ---
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener("mousemove", handleMouse)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      torusGeo.dispose()
      torusMat.dispose()
      icoGeo.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  )
}
