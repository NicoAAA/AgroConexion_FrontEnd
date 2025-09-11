'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  items: string[]
  speed?: number // en píxeles por segundo
}

/**
 * Barra de texto en movimiento (Ticker)
 * - Se desplaza automáticamente con requestAnimationFrame
 * - Se pausa al hacer hover
 * - Colores adaptados a light/dark mode
 */
export const TickerText = ({ items, speed = 60 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [offset, setOffset] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)

  // Medir el ancho del contenido
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (contentRef.current) {
        setContentWidth(contentRef.current.offsetWidth / 2)
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [items])

  // Animación con requestAnimationFrame
  useEffect(() => {
    let lastTime = performance.now()

    const animate = (time: number) => {
      const delta = time - lastTime
      lastTime = time

      if (!isHovered && contentWidth > 0) {
        setOffset((prevOffset) => {
          let newOffset = prevOffset + (speed * delta) / 1000
          return newOffset >= contentWidth ? 0 : newOffset
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isHovered, speed, contentWidth])

  return (
    <div
      className="relative w-full overflow-hidden 
                 bg-green-600 dark:bg-green-800 
                 text-white py-3 px-4 rounded-lg shadow-md cursor-pointer 
                 transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={containerRef}
        className="whitespace-nowrap flex"
        style={{ transform: `translateX(-${offset}px)` }}
      >
        <div ref={contentRef} className="flex shrink-0 gap-8">
          {items.map((item, idx) => (
            <span
              key={`original-${idx}`}
              className="text-lg font-semibold tracking-wide"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 gap-8">
          {items.map((item, idx) => (
            <span
              key={`clone-${idx}`}
              className="text-lg font-semibold tracking-wide"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
