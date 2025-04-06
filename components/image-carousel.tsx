"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface ImageCarouselProps {
  images: string[]
  interval?: number
  height?: number
  className?: string
}

export function ImageCarousel({ images, interval = 5000, height = 120, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval, isAnimating])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-lg ${className}`}
      style={{ height: `${height}px` }}
    >
      <div className="relative w-full h-full">
        {/* Current image */}
        <motion.div
          key={`image-${currentIndex}`}
          initial={{ x: 0 }}
          animate={{ x: isAnimating ? "-100%" : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onAnimationComplete={() => setIsAnimating(false)}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Next image (slides in from right) */}
        {isAnimating && (
          <motion.div
            key={`image-next-${(currentIndex + 1) % images.length}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={images[(currentIndex + 1) % images.length] || "/placeholder.svg"}
              alt={`Slide ${((currentIndex + 1) % images.length) + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1.5 rounded-full ${index === currentIndex ? "bg-[#FFD700]" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}

