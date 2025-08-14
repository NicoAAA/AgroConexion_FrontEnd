'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Slide {
  id: number
  src: string
  alt: string
}

interface Props {
  slides: Slide[]
}

export const Carousel = ({ slides }: Props) => {
  const [current, setCurrent] = useState(0)
  const [validSlides, setValidSlides] = useState<Slide[]>([])

  useEffect(() => {
    const validateImages = async () => {
      const filtered = await Promise.all(
        slides.map(async (slide) => {
          try {
            const res = await fetch(slide.src, { method: 'HEAD' })
            return res.ok ? slide : null
          } catch {
            console.warn(`Imagen inválida: ${slide.src}`)
            return null
          }
        })
      )
      setValidSlides(filtered.filter(Boolean) as Slide[])
    }

    validateImages()
  }, [slides])

  useEffect(() => {
    if (validSlides.length === 0) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % validSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [validSlides])

  if (validSlides.length === 0) return null

  return (
    <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] overflow-hidden rounded-xl shadow-lg">
      {validSlides.map((slide, index) => (
        <Link
          href={`/products/${slide.id}`}
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover rounded-xl"
            onError={() => console.warn(`No se pudo cargar: ${slide.src}`)}
          />
        </Link>
      ))}
    </div>
  )
}
