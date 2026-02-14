'use client'

import { motion } from 'framer-motion'

interface ProgressDotsProps {
  totalQuests: number
  completedQuests: string[]
}

export function ProgressDots({ totalQuests, completedQuests }: ProgressDotsProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
      {Array.from({ length: totalQuests }).map((_, index) => {
        const isCompleted = completedQuests.includes(`quest-${index + 1}`)

        return (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: isCompleted ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              isCompleted ? 'bg-pink-400 shadow-lg shadow-pink-400/50' : 'bg-white/30'
            }`}
          />
        )
      })}
    </div>
  )
}
