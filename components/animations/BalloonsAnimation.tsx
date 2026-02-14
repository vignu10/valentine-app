'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Balloon {
  id: number
  color: string
  size: number
  swayAmount: number
  speed: number
  delay: number
}

export function BalloonsAnimation({ onComplete }: { onComplete: () => void }) {
  const [showBalloons, setShowBalloons] = useState(false)

  useEffect(() => {
    setShowBalloons(true)
    const timer = setTimeout(onComplete, 3500)
    return () => clearTimeout(timer)
  }, [onComplete])

  const balloons: Balloon[] = [
    { id: 0, color: 'bg-red-400', size: 60, swayAmount: 20, speed: 3, delay: 0 },
    { id: 1, color: 'bg-pink-400', size: 50, swayAmount: 25, speed: 2.5, delay: 0.1 },
    { id: 2, color: 'bg-white', size: 55, swayAmount: 15, speed: 2.8, delay: 0.2 },
    { id: 3, color: 'bg-purple-400', size: 45, swayAmount: 30, speed: 3.2, delay: 0.15 },
    { id: 4, color: 'bg-red-300', size: 65, swayAmount: 18, speed: 2.7, delay: 0.25 }
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Bouquet */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl"
        initial={{ scale: 0, rotate: -30 }}
        animate={showBalloons ? { scale: 1, rotate: 0 } : {}}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        💐
      </motion.div>

      {/* Balloons */}
      <AnimatePresence>
        {showBalloons && balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            className="absolute"
            style={{
              left: `${20 + balloon.id * 15}%`,
              bottom: 0
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-150, -400],
              opacity: [0, 1, 1, 0.5],
              x: [0, balloon.swayAmount, -balloon.swayAmount, 0]
            }}
            transition={{
              duration: balloon.speed,
              delay: balloon.delay,
              ease: 'easeInOut',
              times: [0, 0.3, 0.7, 1]
            }}
            exit={{ opacity: 0 }}
          >
            {/* Balloon */}
            <div
              className={`w-16 h-20 rounded-full ${balloon.color} relative`}
              style={{ width: balloon.size, height: balloon.size * 1.3 }}
            >
              {/* String */}
              <motion.div
                className="absolute top-full left-1/2 w-0.5 h-16 bg-white/50 -translate-x-1/2"
                animate={{ rotate: balloon.swayAmount / 2 }}
                transition={{
                  duration: balloon.speed,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              />

              {/* Easter egg: heart on one balloon */}
              {balloon.id === 2 && (
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                  💕
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confetti sparkles in boot */}
      {showBalloons && (
        <motion.div
          className="absolute bottom-4 right-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="absolute text-lg"
              style={{ left: i * 10 }}
              animate={{
                y: [0, -20, 0],
                opacity: [1, 0, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 1,
                delay: 0.5 + i * 0.1,
                repeat: Infinity
              }}
            >
                ✨
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  )
}
