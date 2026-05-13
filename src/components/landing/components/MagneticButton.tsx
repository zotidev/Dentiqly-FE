import React from "react"
import { useMagneticButton } from "../animations/useMagneticButton"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  strength?: number
  as?: "button" | "a" | "div"
  href?: string
  [key: string]: unknown
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  onClick,
  strength = 0.3,
  as: Component = "button",
  ...rest
}) => {
  const ref = useMagneticButton(strength)

  return (
    <Component
      ref={ref as React.Ref<HTMLButtonElement & HTMLAnchorElement & HTMLDivElement>}
      className={className}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Component>
  )
}
