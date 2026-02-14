'use client'

import { motion } from 'framer-motion'

interface Hotspot {
  id: string
  position: { x: number, y: number }
  isActive: boolean
  onClick: () => void
}

interface CarIllustrationProps {
  currentHotspot: number
  onHotspotClick: () => void
  isAnimating: boolean
}

const HOTSPOTS = [
  { id: 'sunvisor', x: 25, y: 15, label: 'Sun Visor' },
  { id: 'dashboard', x: 50, y: 55, label: 'Dashboard' },
  { id: 'boot', x: 85, y: 75, label: 'Boot' }
]

export function CarIllustration({ currentHotspot, onHotspotClick, isAnimating }: CarIllustrationProps) {
  return (
    <div className="relative w-full aspect-video">
      {/* Car Body - Stylized SVG */}
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {/* Car body */}
        <path
          d="M 40 120 L 60 80 L 150 60 L 280 60 L 340 80 L 360 120 L 360 140 L 320 160 L 80 160 L 40 140 Z"
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />

        {/* Windows */}
        <path
          d="M 70 120 L 90 85 L 200 70 L 200 120 Z"
          fill="rgba(147, 51, 234, 0.3)"
          stroke="rgba(255,255,255,0.2)"
        />
        <path
          d="M 210 70 L 320 85 L 330 120 L 210 120 Z"
          fill="rgba(147, 51, 234, 0.3)"
          stroke="rgba(255,255,255,0.2)"
        />

        {/* Wheels */}
        <circle cx="100" cy="160" r="20" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" />
        <circle cx="300" cy="160" r="20" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" />

        {/* Sun visor indicator */}
        <path d="M 75 95 L 120 95 L 115 100 L 80 100 Z" fill="rgba(244, 114, 182, 0.5)" />

        {/* Dashboard area indicator */}
        <rect x="180" y="110" width="80" height="30" rx="5" fill="rgba(244, 114, 182, 0.3)" />

        {/* Boot indicator */}
        <path d="M 340 100 L 355 100 L 355 140 L 330 150 L 330 100 Z" fill="rgba(244, 114, 182, 0.3)" />
      </svg>

      {/* Hotspot overlays */}
      {HOTSPOTS.map((hotspot, index) => {
        const isActive = index === currentHotspot
        const isPast = index < currentHotspot

        return (
          <motion.button
            key={hotspot.id}
            onClick={isActive && !isAnimating ? onHotspotClick : undefined}
            disabled={!isActive || isAnimating}
            aria-label={`Interact with ${hotspot.label}`}
            aria-disabled={!isActive || isAnimating}
            tabIndex={isActive && !isAnimating ? 0 : -1}
            className={`absolute w-20 h-20 rounded-full border-2 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-pink-400 ${
              isActive ? 'bg-pink-400/30 border-pink-400 cursor-pointer' :
              isPast ? 'bg-green-400/20 border-green-400/50' :
              'bg-white/5 border-white/20'
            }`}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isActive ? 1 : 0.8,
              opacity: isPast ? 0.5 : 1
            }}
            transition={{ delay: index * 0.1 }}
            whileHover={isActive ? { scale: 1.1 } : {}}
            whileTap={isActive ? { scale: 0.95 } : {}}
          >
            {isActive && (
              <motion.span
                className="text-3xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                👆
              </motion.span>
            )}
            {isPast && <span className="text-2xl">✓</span>}
          </motion.button>
        )
      })}
    </div>
  )
}
