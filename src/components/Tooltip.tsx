import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { colors } from '../styles/colors'

interface TooltipProps {
  children: React.ReactNode
  content: string
  disabled?: boolean
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`

const TooltipContent = styled(motion.div)`
  position: absolute;
  background: ${colors.background.dark};
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`

const Tooltip: React.FC<TooltipProps> = ({ children, content, disabled = false }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    const tooltipWidth = 200 // Estimación del ancho del tooltip
    const tooltipHeight = 30 // Estimación de la altura del tooltip

    // Calcular posición
    let x = rect.left + (rect.width / 2) - (tooltipWidth / 2)
    let y = rect.top - tooltipHeight - 8

    // Ajustar si se sale de la pantalla
    if (x < 0) x = 0
    if (x + tooltipWidth > window.innerWidth) {
      x = window.innerWidth - tooltipWidth
    }

    setPosition({ x, y })
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  return (
    <TooltipContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <TooltipContent
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              left: position.x,
              top: position.y
            }}
          >
            {content}
          </TooltipContent>
        )}
      </AnimatePresence>
    </TooltipContainer>
  )
}

export default Tooltip 