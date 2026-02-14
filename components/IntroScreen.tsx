'use client'

import { motion } from 'framer-motion'

interface IntroScreenProps {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-glow">
          Love Adventure Quest
        </h1>
        <p className="font-script text-2xl md:text-3xl text-pink-300">
          A journey for Kullu 💕
        </p>
      </motion.div>

      {/* Character Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="text-8xl md:text-9xl mb-12 animate-float"
      >
        🎮
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onStart}
        className="btn-primary animate-pulse-glow"
      >
        Begin Our Adventure
      </motion.button>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-white/70 text-center max-w-md"
      >
        Three quests await. Solve the riddles to unlock our Valentine's Day adventure.
      </motion.p>
    </motion.div>
  )
}
