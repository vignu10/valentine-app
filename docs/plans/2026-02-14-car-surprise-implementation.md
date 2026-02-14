# CarSurprise Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive car surprise component that reveals romantic elements sequentially after the hostel quest is answered.

**Architecture:** A new CarSurprise component that manages sequential state and orchestrates Framer Motion animations for three surprise elements (rose petals, chocolates, balloons). Integration happens via a `hasCarSurprise` flag in the quest config.

**Tech Stack:** React, TypeScript, Framer Motion, Tailwind CSS

---

### Task 1: Add hasCarSurprise flag to quest config

**Files:**
- Modify: `lib/questConfig.ts:4-42`

**Step 1: Add hasCarSurprise property to Quest type**

Edit `types/game.ts` to add the new optional property:

```typescript
// In types/game.ts, find the Quest interface and add:
export interface Quest {
  id: string
  stage: GameState
  title: string
  location: string
  time: string
  character: 'cody' | 'may' | 'both'
  riddle: string
  answers: string[]
  successMessage: string
  memory: string
  hasCarSurprise?: boolean  // ADD THIS LINE
}
```

**Step 2: Add flag to quest-1 in config**

Edit `lib/questConfig.ts`:

```typescript
// In the quest-1 object (around line 4), add hasCarSurprise: true
{
  id: 'quest-1',
  stage: 'quest-1',
  title: 'Where Love Begins',
  location: 'Hostel',
  time: '3:00 PM',
  character: 'cody',
  riddle: `In a world of two, we play our part,\nThrough every level, you're my heart.\nLike Cody and May, hand in hand,\nWhat's the name of this adventure land?`,
  answers: ['it takes two', 'together'],
  successMessage: 'The adventure awaits... Find the next clue where wheels await! 🚗',
  memory: "Remember when we first played It Takes Two together? That's when I knew you were my player two forever. 🎮💕",
  hasCarSurprise: true  // ADD THIS LINE
}
```

**Step 3: Commit**

```bash
git add types/game.ts lib/questConfig.ts
git commit -m "feat: add hasCarSurprise flag to quest config"
```

---

### Task 2: Add state and handlers to page.tsx for CarSurprise integration

**Files:**
- Modify: `app/page.tsx:14-104`

**Step 1: Add showCarSurprise state**

In `app/page.tsx`, find the useState declarations (around line 17) and add:

```typescript
const [showCarSurprise, setShowCarSurprise] = useState(false)
```

**Step 2: Modify handleQuestComplete to check for carSurprise**

Replace the existing `handleQuestComplete` function (lines 41-57) with:

```typescript
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
```

**Step 3: Add handleCarSurpriseComplete handler**

After the `handleReset` function (around line 63), add:

```typescript
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
```

**Step 4: Update QuestCard props to pass handler**

Find the QuestCard component usage (around line 88-92) and update:

```typescript
<QuestCard
  quest={getCurrentQuest()!}
  onComplete={handleQuestComplete}
  showButterfly={gameState === 'quest-2'}
  onCarSurpriseComplete={handleCarSurpriseComplete}  // ADD THIS
/>
```

**Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add CarSurprise state and handlers to page"
```

---

### Task 3: Create CarSurprise component structure

**Files:**
- Create: `components/CarSurprise.tsx`

**Step 1: Create component file with basic structure**

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  const handleHotspotClick = () => {
    if (isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setIsAnimating(false)
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1)
      } else {
        onComplete()
      }
    }, 2000)
  }

  const currentSurprise = SURPRISES[currentStep]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-8 text-glow">
        Your Adventure Awaits 🚗💕
      </h2>

      {/* Car Illustration Placeholder */}
      <div className="glass-card p-8 mb-6 relative">
        <div className="aspect-video bg-white/5 rounded-xl relative">
          {/* Hotspot will go here */}
          <motion.button
            onClick={handleHotspotClick}
            disabled={isAnimating}
            className="absolute w-16 h-16 rounded-full bg-pink-400/30 border-2 border-pink-400 cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: `${currentSurprise.position.x}%`,
              top: `${currentSurprise.position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={isAnimating ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl">👆</span>
          </motion.button>
        </div>
      </div>

      {/* Hint */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-xl text-white/90 mb-6"
      >
        {currentSurprise.hint}
      </motion.p>

      {/* Progress Dots */}
      <div className="flex justify-center gap-3 mb-6">
        {SURPRISES.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${index <= currentStep ? 'bg-pink-400' : 'bg-white/20'}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
```

**Step 2: Export from components index (if exists) or add import directly**

Check if `components/index.ts` exists:

```bash
ls components/index.ts 2>/dev/null && echo "EXISTS" || echo "NOT_EXISTS"
```

If exists, add export. If not, skip this step.

**Step 3: Commit**

```bash
git add components/CarSurprise.tsx
git commit -m "feat: create CarSurprise component structure"
```

---

### Task 4: Create illustrated car SVG component

**Files:**
- Create: `components/CarIllustration.tsx`

**Step 1: Create car illustration with hotspots**

```typescript
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
            className={`absolute w-20 h-20 rounded-full border-2 flex items-center justify-center ${
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
```

**Step 2: Commit**

```bash
git add components/CarIllustration.tsx
git commit -m "feat: add car illustration with hotspots"
```

---

### Task 5: Implement rose petals animation

**Files:**
- Create: `components/animations/RosePetalsAnimation.tsx`

**Step 1: Create rose petals animation component**

```typescript
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Petal {
  id: number
  x: number
  rotation: number
  delay: number
  duration: number
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
        duration: 2 + Math.random()
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
            {Math.random() > 0.8 ? '💕' : '🌹'}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/animations/RosePetalsAnimation.tsx
git commit -m "feat: add rose petals animation"
```

---

### Task 6: Implement chocolates animation

**Files:**
- Create: `components/animations/ChocolatesAnimation.tsx`

**Step 1: Create chocolates animation component**

```typescript
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
```

**Step 2: Commit**

```bash
git add components/animations/ChocolatesAnimation.tsx
git commit -m "feat: add chocolates animation with easter egg"
```

---

### Task 7: Implement balloons animation

**Files:**
- Create: `components/animations/BalloonsAnimation.tsx`

**Step 1: Create balloons animation component**

```typescript
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
```

**Step 2: Commit**

```bash
git add components/animations/BalloonsAnimation.tsx
git commit -m "feat: add balloons animation with bouquet"
```

---

### Task 8: Integrate animations into CarSurprise component

**Files:**
- Modify: `components/CarSurprise.tsx`

**Step 1: Update imports and add animation components**

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CarIllustration } from './CarIllustration'
import { RosePetalsAnimation } from './animations/RosePetalsAnimation'
import { ChocolatesAnimation } from './animations/ChocolatesAnimation'
import { BalloonsAnimation } from './animations/BalloonsAnimation'
```

**Step 2: Add animation state and update component**

Replace the return statement with:

```typescript
  const [showAnimation, setShowAnimation] = useState(false)

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
      onComplete()
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto relative"
    >
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
    </motion.div>
  )
}
```

**Step 3: Commit**

```bash
git add components/CarSurprise.tsx
git commit -m "feat: integrate animations into CarSurprise component"
```

---

### Task 9: Add final celebration to CarSurprise

**Files:**
- Modify: `components/CarSurprise.tsx`

**Step 1: Add final celebration state and component**

Add after the existing state:

```typescript
const [showCelebration, setShowCelebration] = useState(false)
```

Update `handleAnimationComplete` to show celebration on last step:

```typescript
  const handleAnimationComplete = () => {
    setShowAnimation(false)
    setIsAnimating(false)

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowCelebration(true)
    }
  }
```

Add celebration JSX after the progress dots:

```typescript
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
```

Also wrap the main content in a condition to hide during celebration:

```typescript
      {!showCelebration && (
        <>
          {/* All the existing content except celebration */}
        </>
      )}
```

**Step 2: Commit**

```bash
git add components/CarSurprise.tsx
git commit -m "feat: add final celebration to CarSurprise"
```

---

### Task 10: Update page.tsx to render CarSurprise

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add CarSurprise import**

```typescript
import { CarSurprise } from '@/components/CarSurprise'
```

**Step 2: Add CarSurprise render condition in AnimatePresence**

In the main return, add after the quest-1 condition:

```typescript
        {gameState === 'quest-1' && showCarSurprise && (
          <div key="car-surprise" className="min-h-screen flex flex-col items-center justify-center p-6 py-24">
            <CarSurprise onComplete={handleCarSurpriseComplete} />
          </div>
        )}
```

**Step 3: Remove QuestCard props for onCarSurpriseComplete**

Earlier we added this prop, but CarSurprise is now rendered separately. Remove the prop from QuestCard:

```typescript
<QuestCard
  quest={getCurrentQuest()!}
  onComplete={handleQuestComplete}
  showButterfly={gameState === 'quest-2'}
/>
```

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: render CarSurprise component in quest flow"
```

---

### Task 11: Add accessibility features

**Files:**
- Modify: `components/CarIllustration.tsx`, `components/CarSurprise.tsx`

**Step 1: Add ARIA labels and keyboard support to CarIllustration**

Update the hotspot button in CarIllustration:

```typescript
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
            // ... rest of props
          >
```

**Step 2: Add screen reader announcements in CarSurprise**

Add at top of component:

```typescript
import { useEffect } from 'react'

export function CarSurprise({ onComplete }: CarSurpriseProps) {
  // ... existing state

  // Announce progress to screen readers
  useEffect(() => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'

    const messages = [
      '',
      'Rose petals falling from the sun visor',
      'Chocolates revealed on the dashboard',
      'Balloons floating from the boot'
    ]

    announcement.textContent = messages[currentStep] || ''
    document.body.appendChild(announcement)

    return () => {
      document.body.removeChild(announcement)
    }
  }, [currentStep])
```

**Step 3: Add sr-only utility to globals.css if not exists**

Check if exists:

```bash
grep -n "sr-only" app/globals.css || echo "NOT_FOUND"
```

If not found, add to `app/globals.css` in the `@layer components` section:

```css
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
```

**Step 4: Commit**

```bash
git add components/CarIllustration.tsx components/CarSurprise.tsx app/globals.css
git commit -m "feat: add accessibility features to CarSurprise"
```

---

### Task 12: Test the feature end-to-end

**Files:**
- All modified files

**Step 1: Run dev server**

```bash
npm run dev
```

**Step 2: Test the flow manually**

1. Navigate to http://localhost:3000
2. Click "Start Your Adventure"
3. Answer the hostel riddle correctly ("it takes two")
4. Verify CarSurprise appears instead of quest-2
5. Click each hotspot sequentially:
   - Sun visor → rose petals animation
   - Dashboard → chocolates animation
   - Boot → balloons animation
6. Verify celebration appears
7. Click "Continue to Next Adventure"
8. Verify quest-2 (car/candlelight concert) appears

**Step 3: Test keyboard navigation**

1. Refresh page
2. Start adventure
3. Answer riddle
4. Use Tab to navigate to hotspot
5. Press Enter to trigger
6. Verify animation plays
7. Repeat for all 3 hotspots

**Step 4: Test responsive design**

1. Open DevTools (F12)
2. Toggle device toolbar
3. Test mobile view (iPhone, Android)
4. Verify hotspots are tapable and correctly positioned

**Step 5: Fix any issues found**

If bugs found, fix and commit individually.

---

### Task 13: Final polish and documentation

**Files:**
- Modify: `docs/plans/2026-02-14-car-surprise-design.md`
- Create: `components/CarSurprise.README.md` (optional)

**Step 1: Update design doc with implementation notes**

Add to design doc:

```markdown
## Implementation Notes

- All animations use Framer Motion's AnimatePresence for clean exits
- Hotspot positions are percentage-based for responsive design
- Each animation component is independently testable
- Progress persists across page reloads via gameStore
- Easter eggs included: heart-shaped petal, bitten chocolate, heart on balloon
```

**Step 2: Final commit with polish**

```bash
git add .
git commit -m "polish: CarSurprise feature complete with all animations

- Rose petals cascade from sun visor
- Chocolates pop on dashboard
- Balloons float from boot with bouquet
- Full accessibility support
- Final celebration before continuing

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Summary

This plan builds the CarSurprise feature in 13 bite-sized tasks:

1. Add config flag
2. Wire up state/handlers
3-4. Create component structure
5-7. Build animations
8-9. Integrate and celebrate
10. Render in app
11. Add accessibility
12. Test thoroughly
13. Final polish

Each task is 2-5 minutes with commits keeping progress safe.
