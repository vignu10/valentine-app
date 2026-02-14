# Love Adventure Quest Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a romantic 3-stage Valentine's Day mini-game for Kullu with riddles, animations, and a love letter reveal.

**Architecture:** Single-page Next.js app with state machine managing quest progression. Framer Motion for animations, localStorage for progress persistence. Static export for tiiny.host deployment.

**Tech Stack:** Next.js 15.1.0, TypeScript, Tailwind CSS 4.x, Framer Motion

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `/package.json`
- Create: `/next.config.ts`
- Create: `/tsconfig.json`
- Create: `/tailwind.config.ts`
- Create: `/postcss.config.mjs`

**Step 1: Create package.json**

```json
{
  "name": "love-adventure-quest",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^12.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0"
  }
}
```

**Step 2: Create next.config.ts**

```typescript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: './',
  reactStrictMode: true,
}

export default nextConfig
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        script: ['Dancing Script', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'fall': 'fall linear forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
        fall: {
          'to': { transform: 'translateY(100vh) rotate(720deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 5: Create postcss.config.mjs**

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
}

export default config
```

**Step 6: Install dependencies**

Run: `npm install`
Expected: All packages installed successfully

**Step 7: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind CSS"
```

---

### Task 2: Create TypeScript Types

**Files:**
- Create: `/types/game.ts`

**Step 1: Write type definitions**

```typescript
export type GameState = 'intro' | 'quest-1' | 'quest-2' | 'quest-3' | 'complete'

export interface GameProgress {
  currentStage: GameState
  completedQuests: string[]
  unlockedStages: string[]
}

export interface Quest {
  id: string
  stage: GameState
  title: string
  location: string
  time: string
  character: 'cody' | 'both'
  riddle: string
  answers: string[]
  successMessage: string
  memory: string
}

export interface QuestConfig {
  quests: Quest[]
}
```

**Step 2: Commit**

```bash
git add types/game.ts
git commit -m "feat: add TypeScript game types"
```

---

### Task 3: Create LocalStorage Utilities

**Files:**
- Create: `/lib/gameStore.ts`

**Step 1: Write localStorage utilities**

```typescript
import type { GameProgress, GameState } from '@/types/game'

const STORAGE_KEY = 'love-quest-progress'
const STARTED_KEY = 'love-quest-started'

export const gameStore = {
  getProgress(): GameProgress | null {
    if (typeof window === 'undefined') return null
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveProgress(progress: GameProgress): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Silently fail if localStorage unavailable
    }
  },

  resetProgress(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STARTED_KEY)
    } catch {
      // Silently fail
    }
  },

  markStarted(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STARTED_KEY, Date.now().toString())
    } catch {
      // Silently fail
    }
  },

  isStarted(): boolean {
    if (typeof window === 'undefined') return false
    try {
      return !!localStorage.getItem(STARTED_KEY)
    } catch {
      return false
    }
  },
}
```

**Step 2: Commit**

```bash
git add lib/gameStore.ts
git commit -m "feat: add localStorage game store utilities"
```

---

### Task 4: Create Quest Configuration

**Files:**
- Create: `/lib/questConfig.ts`

**Step 1: Write quest data**

```typescript
import type { QuestConfig } from '@/types/game'

export const questConfig: QuestConfig = {
  quests: [
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
    },
    {
      id: 'quest-2',
      stage: 'quest-2',
      title: 'The Journey of Hearts',
      location: 'In the Car',
      time: 'On the way',
      character: 'both',
      riddle: `Where flickering flames dance with grace,\nMelodies float in this magical space.\nAt six-fifteen, when stars align,\nWhat enchanting place will be thine?`,
      answers: ['candlelight concert', 'concert', 'candlelight'],
      successMessage: 'Almost there... The magic awaits at 6:15 PM! 🕕',
      memory: 'Every journey with you feels like an adventure. I can\'t wait to create more memories together. 💕',
    },
    {
      id: 'quest-3',
      stage: 'quest-3',
      title: 'Under Candlelight',
      location: 'Candlelight Concert',
      time: '6:15 PM',
      character: 'both',
      riddle: `What three words describe everything I feel for you? 💕`,
      answers: ['i love you'],
      successMessage: 'Forever and always, my Player Two 💕',
      memory: '',
    },
  ],
}
```

**Step 2: Commit**

```bash
git add lib/questConfig.ts
git commit -m "feat: add quest configuration with riddles and answers"
```

---

### Task 5: Create Root Layout

**Files:**
- Create: `/app/layout.tsx`

**Step 1: Write layout component**

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Dancing_Script, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Love Adventure Quest 💕',
  description: 'A special Valentine\'s Day adventure for Kullu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dancing.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
```

**Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with Google Fonts"
```

---

### Task 6: Create Global Styles

**Files:**
- Create: `/app/globals.css`

**Step 1: Write global CSS**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900 min-h-screen text-white;
  }
}

@layer components {
  .glass-card {
    @apply backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl;
  }

  .btn-primary {
    @apply px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full font-semibold text-lg
           shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70 hover:scale-105
           transition-all duration-300 cursor-pointer;
  }

  .input-field {
    @apply w-full px-6 py-4 bg-white/5 border-2 border-white/20 rounded-full
           text-white placeholder-white/50 focus:outline-none focus:border-pink-400
           transition-colors duration-300 text-center;
  }
}

@layer utilities {
  .text-glow {
    text-shadow: 0 0 20px rgba(244, 114, 182, 0.5),
                 0 0 40px rgba(244, 114, 182, 0.3);
  }

  .flicker {
    animation: flicker 3s ease-in-out infinite;
  }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  25%, 75% { opacity: 0.9; }
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add global styles with custom utilities"
```

---

### Task 7: Create Floating Hearts Component

**Files:**
- Create: `/components/FloatingHearts.tsx`

**Step 1: Write floating hearts component**

```tsx
'use client'

import { useEffect, useState } from 'react'

interface Heart {
  id: number
  left: number
  size: number
  duration: number
  delay: number
}

export function FloatingHearts({ intensity = 1 }: { intensity?: number }) {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const count = Math.floor(15 * intensity)
    const newHearts: Heart[] = []

    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5,
      })
    }

    setHearts(newHearts)
  }, [intensity])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute animate-fall opacity-60"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
            fontSize: `${heart.size}rem`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          💕
        </span>
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/FloatingHearts.tsx
git commit -m "feat: add floating hearts background animation"
```

---

### Task 8: Create Memory Popup Component

**Files:**
- Create: `/components/MemoryPopup.tsx`

**Step 1: Write memory popup component**

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface MemoryPopupProps {
  isOpen: boolean
  memory: string
  onClose: () => void
  nextLabel?: string
}

export function MemoryPopup({ isOpen, memory, onClose, nextLabel = 'Continue' }: MemoryPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="glass-card max-w-md w-full p-8 text-center"
            >
              <div className="text-6xl mb-4">💭</div>
              <p className="font-script text-2xl text-pink-200 leading-relaxed">
                {memory}
              </p>
              <button
                onClick={onClose}
                className="btn-primary mt-6"
              >
                {nextLabel}
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
```

**Step 2: Commit**

```bash
git add components/MemoryPopup.tsx
git commit -m "feat: add memory popup modal component"
```

---

### Task 9: Create Intro Screen Component

**Files:**
- Create: `/components/IntroScreen.tsx`

**Step 1: Write intro screen component**

```tsx
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
```

**Step 2: Commit**

```bash
git add components/IntroScreen.tsx
git commit -m "feat: add intro screen component"
```

---

### Task 10: Create Quest Card Component

**Files:**
- Create: `/components/QuestCard.tsx`

**Step 1: Write quest card component**

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Quest } from '@/types/game'

interface QuestCardProps {
  quest: Quest
  onComplete: () => void
  showButterfly?: boolean
}

export function QuestCard({ quest, onComplete, showButterfly = false }: QuestCardProps) {
  const [answer, setAnswer] = useState('')
  const [showMemory, setShowMemory] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [hintCount, setHintCount] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!answer.trim()) {
      setIsWrong(true)
      setTimeout(() => setIsWrong(false), 500)
      return
    }

    const normalizedAnswer = answer.toLowerCase().trim()
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className={`input-field ${isWrong ? 'animate-shake border-red-400' : ''}`}
            autoComplete="off"
          />

          {hintCount > 0 && (
            <p className="text-center text-white/70 text-sm">
              💡 {getHint()}
            </p>
          )}

          <button type="submit" className="btn-primary w-full">
            Submit Answer
          </button>
        </form>
      </motion.div>

      {/* Memory Popup */}
      {quest.memory && (
        <MemoryPopup
          isOpen={showMemory}
          memory={quest.memory}
          onClose={() => {
            setShowMemory(false)
            onComplete()
          }}
          nextLabel="Continue to Next Quest"
        />
      )}
    </>
  )
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
```

**Step 2: Commit**

```bash
git add components/QuestCard.tsx
git commit -m "feat: add quest card component with answer validation"
```

---

### Task 11: Create Final Reveal Component

**Files:**
- Create: `/components/FinalReveal.tsx`

**Step 1: Write final reveal component with love letter**

```tsx
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
```

**Step 2: Commit**

```bash
git add components/FinalReveal.tsx
git commit -m "feat: add final reveal component with love letter and heart rain"
```

---

### Task 12: Create Progress Indicator Component

**Files:**
- Create: `/components/ProgressDots.tsx`

**Step 1: Write progress dots component**

```tsx
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
```

**Step 2: Commit**

```bash
git add components/ProgressDots.tsx
git commit -m "feat: add progress dots indicator component"
```

---

### Task 13: Create Main Game Page

**Files:**
- Create: `/app/page.tsx`

**Step 1: Write main page with game state machine**

```tsx
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
import type { GameState } from '@/types/game'

const GIRLFRIEND_NAME = 'Kullu'

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState>('intro')
  const [completedQuests, setCompletedQuests] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

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
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add main game page with state machine"
```

---

### Task 14: Download Character Images

**Files:**
- Create: `/public/cody.png`
- Create: `/public/may.png`

**Step 1: Download It Takes Two character images**

Run these commands to download official character art:

```bash
# Create public directory if needed
mkdir -p public

# Download Cody character image
curl -L "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/It_Takes_Two_cover.jpg/220px-It_Takes_Two_cover.jpg" -o public/cody.png 2>/dev/null || echo "Please manually add cody.png"

# For May, we'll use a placeholder - you can replace with actual image
echo "👩" > public/may.png
```

**Note:** The URLs above are examples. For production, manually download official "It Takes Two" character art from EA/Steam promotional materials and save as:
- `/public/cody.png` (Cody character)
- `/public/may.png` (May character)

**Step 2: Add fallback image component**

Create `/components/CharacterImage.tsx`:

```tsx
'use client'

interface CharacterImageProps {
  character: 'cody' | 'may'
  className?: string
}

export function CharacterImage({ character, className = '' }: CharacterImageProps) {
  const emoji = character === 'cody' ? '🎮' : '👩'

  return (
    <div className={`text-6xl md:text-8xl ${className}`}>
      {emoji}
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add public/ components/CharacterImage.tsx
git commit -m "feat: add character images and fallback component"
```

---

### Task 15: Build and Test Locally

**Files:**
- (No new files)

**Step 1: Run development server**

Run: `npm run dev`
Expected: Server starts at http://localhost:3000

**Step 2: Test all game flows**

Open http://localhost:3000 and verify:
- [ ] Intro screen displays with "Begin Our Adventure" button
- [ ] Clicking button starts Quest 1
- [ ] Quest 1: "It Takes Two" answer works, wrong answer shakes
- [ ] Quest 1 complete → memory popup appears → continue to Quest 2
- [ ] Quest 2: "Concert" answer works, butterfly animation plays
- [ ] Quest 2 complete → memory popup → continue to Quest 3
- [ ] Quest 3: "I love you" answer works
- [ ] Final reveal shows love letter with heart rain
- [ ] Progress dots update correctly
- [ ] Reset button works and returns to intro

**Step 3: Test localStorage persistence**

- [ ] Complete a quest, refresh page, verify progress saved
- [ ] Close browser, reopen, verify game remembers state

**Step 4: Test mobile responsiveness**

- [ ] Check on phone viewport (use Chrome DevTools)
- [ ] Verify all text is readable
- [ ] Verify animations work on mobile

**Step 5: Commit fixes if any**

```bash
git add .
git commit -m "fix: address issues from local testing"
```

---

### Task 16: Production Build for Tiiny.host

**Files:**
- (No new files)

**Step 1: Run production build**

Run: `npm run build`
Expected: Build completes with `/out` directory containing static files

**Step 2: Verify output**

Run: `ls -la out/`
Expected: Should show `index.html` and `/_next/` static assets

**Step 3: Test locally (optional)**

Run: `npx serve out -p 3001`
Expected: Site runs at http://localhost:3001, same functionality as dev

**Step 4: Prepare for deployment**

Create a zip file of the `/out` directory:

```bash
# Zip the output directory
cd out
zip -r ../love-adventure-quest.zip .
cd ..
```

**Step 5: Deploy to tiiny.host**

1. Go to https://tiiny.host
2. Upload `love-adventure-quest.zip` OR drag the `/out` folder
3. Get the shareable URL
4. Test the deployed URL on mobile phone

**Step 6: Commit final version**

```bash
git add .
git commit -m "release: Love Adventure Quest v1.0 ready for tiiny.host"
```

---

## Testing Checklist

Before deployment, verify:

- [ ] All 3 quests work with correct answers
- [ ] Wrong answer shake animation plays
- [ ] Memory popups display correctly
- [ ] Progress dots update in real-time
- [ ] Butterfly animation plays on Quest 2 completion
- [ ] Heart rain plays on final reveal
- [ ] Love letter displays properly formatted
- [ ] Reset functionality clears all progress
- [ ] LocalStorage persists across sessions
- [ ] Mobile responsive (test on actual phone)
- [ ] Static export works without API routes
- [ ] All animations run smoothly (60fps target)

---

## Deployment Notes

**Tiiny.host Deployment:**
1. Build: `npm run build`
2. Zip contents of `/out` folder
3. Upload to tiiny.host
4. Share URL with Kullu

**Alternative static hosts:**
- Netlify Drop (drag `/out` folder)
- Vercel (import project)
- GitHub Pages (push to gh-pages branch)

---

## Troubleshooting

**Build errors?**
- Ensure Next.js 15.1.0 installed: `npm ls next`
- Clear `.next` cache: `rm -rf .next && npm run build`

**Images not loading?**
- Check file paths in `/public`
- Use unoptimized: true in next.config.ts

**Animations not smooth?**
- Check for expensive CSS filters
- Use transform instead of position changes
- Test on target device

**LocalStorage not working?**
- Check browser's private browsing mode
- Verify getProgress/saveProgress functions
- Check browser console for errors

---

## Success Criteria

✅ All 3 quests complete with riddle validation
✅ Progress persists across browser sessions
✅ Mobile-responsive (tested on phone)
✅ All animations run smoothly (60fps)
✅ Successfully exports to static HTML
✅ Deployable to tiiny.host
✅ Personalized content (Kullu's name, specific plan)
