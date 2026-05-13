import React from "react"
import { useCustomCursor } from "../animations/useCustomCursor"

export const CustomCursor: React.FC = () => {
  const { dotRef, ringRef, isHovering, isHidden } = useCustomCursor()

  if (isHidden) return null

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? 12 : 8,
          height: isHovering ? 12 : 8,
          borderRadius: "50%",
          background: "#02E3FF",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s, height 0.3s",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? 56 : 40,
          height: isHovering ? 56 : 40,
          borderRadius: "50%",
          border: `1.5px solid ${isHovering ? "#02E3FF" : "rgba(255,255,255,0.3)"}`,
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s, height 0.3s, border-color 0.3s",
        }}
      />
    </>
  )
}
