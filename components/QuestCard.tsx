'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Quest } from '@/types/game'
import { MemoryPopup } from './MemoryPopup'

interface QuestCardProps {
  quest: Quest
  onComplete: (questId: string) => void
  showButterfly?: boolean
}

export function QuestCard({ quest, onComplete, showButterfly = false }: QuestCardProps) {
  const [showMemory, setShowMemory] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [hintCount, setHintCount] = useState(0)

  const handleChoice = (choice: string) => {
    const normalizedAnswer = choice.toLowerCase().trim()
    const isCorrect = quest.answers.some((a) =>
      normalizedAnswer.includes(a.toLowerCase()) || a.toLowerCase().includes(normalizedAnswer)
    )

    if (isCorrect) {
      setShowMemory(true)
    } else {
      setIsWrong(true)
      setHintCount((prev) => prev + 1)
      setTimeout(() => setIsWrong(false), 500)
    }
  }

  const getHint = () => {
    if (hintCount < 3) return 'Think about our gaming adventures... 🎮'
    if (quest.answers[0].includes(' '))
      return `First word starts with "${quest.answers[0][0].toUpperCase()}"`
    return `The answer is: "${quest.answers[0]}"`
  }

  const getCharacterEmoji = () => {
    if (quest.character === 'both') return '🎮👩'
    return '🎮'
  }

  function ButterflyAnimation() {
    return (
      <motion.span
        className="fixed text-4xl z-40 pointer-events-none"
        initial={{ left: '-10%', top: '50%' }}
        animate={{
          left: ['0%', '30%', '60%', '110%'],
          top: ['50%', '30%', '60%', '40%'],
        }}
        transition={{ duration: 4, ease: 'easeInOut' }}
      >
        🦋
      </motion.span>
    )
  }

  return (
    <>
      {showButterfly && <ButterflyAnimation />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Progress Badge */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
            📍 {quest.location} • {quest.time}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-8 text-glow">
          {quest.title}
        </h2>

        {/* Character */}
        <div className="text-center mb-8">
          <motion.span
            className="text-6xl md:text-8xl inline-block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {getCharacterEmoji()}
          </motion.span>
        </div>

        {/* Riddle Card */}
        <div className="glass-card p-8 mb-6">
          <p className="font-script text-xl md:text-2xl text-center text-pink-100 whitespace-pre-line leading-relaxed">
            {quest.riddle}
          </p>
        </div>

        {/* Answer Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(quest.choices || quest.answers).map((choice, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice(choice)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isWrong
                    ? 'border-red-400 bg-red-500/20'
                    : 'border-pink-400/30 bg-white/5 hover:bg-white/10 hover:border-pink-400'
                }`}
              >
                <span className="text-pink-100 font-medium">{choice}</span>
              </motion.button>
            ))}
          </div>

          {hintCount > 0 && (
            <p className="text-center text-white/70 text-sm">
              💡 {getHint()}
            </p>
          )}
        </div>
      </motion.div>

      {/* Memory Popup */}
      {quest.memory && (
        <MemoryPopup
          isOpen={showMemory}
          memory={quest.memory}
          onClose={() => {
            setShowMemory(false)
            onComplete(quest.id)
          }}
          nextLabel={quest.id === 'quest-3' ? 'Complete Our Journey' : 'Continue to Next Quest'}
        />
      )}
    </>
  )
}
