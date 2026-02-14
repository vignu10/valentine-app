'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CarIllustration } from './CarIllustration'
import { RosePetalsAnimation } from './animations/RosePetalsAnimation'
import { ChocolatesAnimation } from './animations/ChocolatesAnimation'
import { BalloonsAnimation } from './animations/BalloonsAnimation'

interface CarSurpriseProps {
  onComplete: () => void
}

const SURPRISES = [
  {
    id: 'sunvisor',
    hint: '✨ Open the sun visor...',
    position: { x: 30, y: 20 }
  },
  {
    id: 'dashboard',
    hint: '🍫 Check the dashboard...',
    position: { x: 50, y: 60 }
  },
  {
    id: 'boot',
    hint: '🎈 Open the boot for something special...',
    position: { x: 80, y: 70 }
  }
]

export function CarSurprise({ onComplete }: CarSurpriseProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Announce progress to screen readers
  useEffect(() => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'

    const messages = [
      '',
      'Rose petals falling from sun visor',
      'Chocolates revealed on dashboard',
      'Balloons floating from boot'
    ]

    announcement.textContent = messages[currentStep] || ''
    document.body.appendChild(announcement)

    return () => {
      document.body.removeChild(announcement)
    }
  }, [currentStep])

  const handleHotspotClick = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setShowAnimation(true)
  }

  const handleAnimationComplete = () => {
    setShowAnimation(false)
    setIsAnimating(false)

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowCelebration(true)
    }
  }

  const getAnimationForStep = (step: number) => {
    switch (step) {
      case 0: return <RosePetalsAnimation onComplete={handleAnimationComplete} />
      case 1: return <ChocolatesAnimation onComplete={handleAnimationComplete} />
      case 2: return <BalloonsAnimation onComplete={handleAnimationComplete} />
      default: return null
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 0: return 'Your Adventure Awaits 🚗💕'
      case 1: return 'Sweet Surprises 🍫'
      case 2: return 'One More Gift... 🎈'
      default: return ''
    }
  }

  const currentSurprise = SURPRISES[currentStep]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto relative"
    >
      {!showCelebration && (
        <>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-8 text-glow">
            {getStepTitle(currentStep)}
          </h2>

          {/* Car Illustration */}
          <div className="glass-card p-8 mb-6 relative min-h-[300px]">
            <AnimatePresence>
              {!showAnimation ? (
                <CarIllustration
                  key="illustration"
                  currentHotspot={currentStep}
                  onHotspotClick={handleHotspotClick}
                  isAnimating={isAnimating}
                />
              ) : (
                <motion.div
                  key="animation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  {getAnimationForStep(currentStep)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hint - hide during animation */}
          <AnimatePresence mode="wait">
            {!showAnimation && (
              <motion.p
                key={`hint-${currentStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-xl text-white/90 mb-6"
              >
                {currentSurprise.hint}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex justify-center gap-3 mb-6">
            {SURPRISES.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index < currentStep ? 'bg-green-400' :
                  index === currentStep ? 'bg-pink-400' :
                  'bg-white/20'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>
        </>
      )}

      {/* Final Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -10 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              className="text-6xl"
            >
                💕
            </motion.div>

            <h3 className="font-display text-2xl md:text-3xl font-bold text-glow">
              The real surprise awaits in the car...
            </h3>

            <p className="text-white/80 text-lg">
              Can't wait to see you! 🚗💕
            </p>

            <motion.button
              onClick={onComplete}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue to Next Adventure
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
