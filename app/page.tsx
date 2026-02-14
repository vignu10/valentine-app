'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { gameStore } from '@/lib/gameStore'
import { questConfig } from '@/lib/questConfig'
import { FloatingHearts } from '@/components/FloatingHearts'
import { IntroScreen } from '@/components/IntroScreen'
import { QuestCard } from '@/components/QuestCard'
import { FinalReveal } from '@/components/FinalReveal'
import { ProgressDots } from '@/components/ProgressDots'
import { CarSurprise } from '@/components/CarSurprise'
import type { GameState } from '@/types/game'

const GIRLFRIEND_NAME = 'Kullu'

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState>('intro')
  const [completedQuests, setCompletedQuests] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [showCarSurprise, setShowCarSurprise] = useState(false)

  // Load progress on mount
  useEffect(() => {
    const savedProgress = gameStore.getProgress()
    if (savedProgress) {
      setGameState(savedProgress.currentStage)
      setCompletedQuests(savedProgress.completedQuests)
    }
    setIsInitialized(true)
  }, [])

  const handleStart = () => {
    gameStore.markStarted()
    setGameState('quest-1')
    gameStore.saveProgress({
      currentStage: 'quest-1',
      completedQuests: [],
      unlockedStages: ['quest-1'],
    })
  }

  const handleQuestComplete = (questId: string) => {
    const newCompleted = [...completedQuests, questId]
    setCompletedQuests(newCompleted)

    const quest = getCurrentQuest()

    // Check if this quest has a car surprise
    if (quest?.hasCarSurprise) {
      setShowCarSurprise(true)
      gameStore.saveProgress({
        currentStage: gameState,
        completedQuests: newCompleted,
        unlockedStages: ['quest-1', 'quest-2', 'quest-3'],
      })
      return
    }

    // Determine next stage
    const questIndex = parseInt(questId.split('-')[1]) - 1
    const nextStage: GameState = questIndex + 1 >= 3 ? 'complete' : (`quest-${questIndex + 2}` as GameState)

    setGameState(nextStage)

    // Save progress
    gameStore.saveProgress({
      currentStage: nextStage,
      completedQuests: newCompleted,
      unlockedStages: ['quest-1', 'quest-2', 'quest-3'],
    })
  }

  const handleReset = () => {
    gameStore.resetProgress()
    setGameState('intro')
    setCompletedQuests([])
  }

  const handleCarSurpriseComplete = () => {
    setShowCarSurprise(false)

    // Advance to quest-2
    setGameState('quest-2')

    gameStore.saveProgress({
      currentStage: 'quest-2',
      completedQuests: completedQuests,
      unlockedStages: ['quest-1', 'quest-2', 'quest-3'],
    })
  }

  const getCurrentQuest = () => {
    return questConfig.quests.find((q) => q.stage === gameState)
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <FloatingHearts intensity={gameState === 'complete' ? 3 : 1} />

      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <IntroScreen key="intro" onStart={handleStart} />
        )}

        {gameState === 'quest-1' && showCarSurprise && (
          <div key="car-surprise" className="min-h-screen flex flex-col items-center justify-center p-6 py-24">
            <CarSurprise onComplete={handleCarSurpriseComplete} />
          </div>
        )}

        {gameState !== 'intro' && gameState !== 'complete' && (
          <div key={gameState} className="min-h-screen flex flex-col items-center justify-center p-6 py-24">
            <QuestCard
              quest={getCurrentQuest()!}
              onComplete={handleQuestComplete}
              showButterfly={gameState === 'quest-2'}
            />
            <ProgressDots totalQuests={3} completedQuests={completedQuests} />
          </div>
        )}

        {gameState === 'complete' && (
          <FinalReveal key="complete" girlfriendName={GIRLFRIEND_NAME} onReset={handleReset} />
        )}
      </AnimatePresence>
    </main>
  )
}
