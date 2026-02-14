'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Chocolate {
  id: number
  delay: number
  wrapper: 'gold' | 'silver' | 'pink'
}

const WRAPPER_COLORS = {
  gold: 'from-yellow-400 to-yellow-600',
  silver: 'from-gray-300 to-gray-400',
  pink: 'from-pink-300 to-pink-500'
}

export function ChocolatesAnimation({ onComplete }: { onComplete: () => void }) {
  const [showChocolates, setShowChocolates] = useState(false)

  useEffect(() => {
    setShowChocolates(true)
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  const chocolates: Chocolate[] = [
    { id: 0, delay: 0, wrapper: 'gold' },
    { id: 1, delay: 0.15, wrapper: 'silver' },
    { id: 2, delay: 0.3, wrapper: 'pink' }
  ]

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6">
      {chocolates.map((chocolate) => (
        <motion.div
          key={chocolate.id}
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={showChocolates ? {
            scale: 1,
            rotate: 0
          } : {}}
          transition={{
            delay: chocolate.delay,
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
        >
          <div className={`w-16 h-12 rounded-lg bg-gradient-to-br ${WRAPPER_COLORS[chocolate.wrapper]} shadow-lg relative`}>
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-white/30"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ delay: chocolate.delay + 0.5, duration: 0.5 }}
            />
          </div>

          {/* Tiny hearts floating up */}
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              className="absolute text-xs"
              style={{ left: `${30 + i * 40}%` }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -30, opacity: 0 }}
              transition={{
                delay: chocolate.delay + 0.8 + i * 0.2,
                duration: 1
              }}
            >
                💕
            </motion.span>
          ))}

          {/* Bite mark easter egg on one */}
          {chocolate.id === 2 && (
            <div className="absolute top-0 right-0 w-6 h-6 bg-white/10 rounded-bl-full" />
          )}
        </motion.div>
      ))}
    </div>
  )
}
