'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Petal {
  id: number
  x: number
  rotation: number
  delay: number
  duration: number
  emoji: string
}

export function RosePetalsAnimation({ onComplete }: { onComplete: () => void }) {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    const newPetals: Petal[] = []
    for (let i = 0; i < 15; i++) {
      newPetals.push({
        id: i,
        x: Math.random() * 100,
        rotation: Math.random() * 720 - 360,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random(),
        emoji: Math.random() > 0.8 ? '💕' : '🌹'
      })
    }
    setPetals(newPetals)

    const timer = setTimeout(onComplete, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute text-2xl"
            style={{ left: `${petal.x}%` }}
            initial={{ y: -20, rotate: 0, opacity: 0 }}
            animate={{
              y: ['0vh', '100vh'],
              rotate: [0, petal.rotation],
              opacity: [0, 1, 1, 0.5]
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              ease: 'easeIn'
            }}
            exit={{ opacity: 0 }}
          >
            {petal.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
