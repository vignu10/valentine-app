'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface HeartRainProps {
  isActive: boolean
}

function HeartRain({ isActive }: HeartRainProps) {
  if (!isActive) return null

  const hearts = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 3,
    delay: Math.random() * 2,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.span
            key={heart.id}
            className="absolute text-pink-400"
            initial={{ top: '-50px', opacity: 1 }}
            animate={{ top: '110vh', opacity: 0 }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: 'linear',
            }}
            style={{ left: `${heart.left}%` }}
          >
            <span style={{ fontSize: `${heart.size}rem` }}>💕</span>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface FinalRevealProps {
  girlfriendName: string
  onReset: () => void
}

export function FinalReveal({ girlfriendName, onReset }: FinalRevealProps) {
  const [showLetter, setShowLetter] = useState(false)
  const [showHearts, setShowHearts] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLetter(true), 500)
    const timer2 = setTimeout(() => setShowHearts(true), 1500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <HeartRain isActive={showHearts} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="glass-card max-w-2xl w-full p-8 md:p-12 text-center relative overflow-hidden"
      >
        {/* Candle Border Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-16 h-16 bg-amber-400/20 blur-2xl rounded-full flicker" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/20 blur-2xl rounded-full flicker" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-400/20 blur-2xl rounded-full flicker" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-amber-400/20 blur-2xl rounded-full flicker" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Characters */}
        <motion.div
          className="text-6xl mb-6 relative z-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👩🎮
        </motion.div>

        {showLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-8 text-glow">
              My Dearest {girlfriendName},
            </h2>

            <div className="font-script text-lg md:text-xl text-pink-100 leading-relaxed space-y-4 text-left whitespace-pre-line">
{`From the moment I met you, my life changed forever. You are not just my partner - you are my best friend, my player two, and my greatest adventure.

Every day with you feels like a beautiful journey, filled with love, laughter, and countless memories. Like Cody and May, we make the perfect team - supporting each other through every challenge, celebrating every victory together.

Tonight, under the candlelight, I want you to know that my heart belongs to you, now and always. You make every ordinary moment extraordinary, and every day feel like Valentine's Day.

Thank you for being you. Thank you for choosing me. Thank you for being my forever adventure.

I love you more than words can say. 💕

Forever Yours,
Your Player One 🎮`}
            </div>

            <div className="mt-8">
              <span className="text-4xl">💕</span>
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={onReset}
          className="relative z-10 mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
        >
          Play Again
        </motion.button>
      </motion.div>
    </div>
  )
}
