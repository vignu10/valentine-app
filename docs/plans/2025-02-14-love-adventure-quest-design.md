# Love Adventure Quest - Design Document

**Date:** 2025-02-14
**Girlfriend:** Kullu
**Theme:** It Takes Two inspired Valentine's Day adventure

---

## Overview

A romantic 3-stage mini-game where Kullu solves riddles based on a real Valentine's Day plan. Each completed quest unlocks the next stage, culminating in a love letter reveal with celebratory animations.

---

## Quest Stages

### Quest 1: "Where Love Begins" (Hostel - 3:00 PM)
- **Scene:** Hostel building exterior
- **Character:** Cody-style character waiting
- **Riddle:**
  ```
  In a world of two, we play our part,
  Through every level, you're my heart.
  Like Cody and May, hand in hand,
  What's the name of this adventure land?
  ```
- **Answers:** "It Takes Two", "Together"
- **Success Message:** "The adventure awaits... Find the next clue where wheels await! 🚗"
- **Memory:** "Remember when we first played It Takes Two together? That's when I knew you were my player two forever. 🎮💕"

### Quest 2: "The Journey of Hearts" (In the Car)
- **Scene:** Car interior with sunset lighting
- **Characters:** Both Cody and May styled
- **Riddle:**
  ```
  Where flickering flames dance with grace,
  Melodies float in this magical space.
  At six-fifteen, when stars align,
  What enchanting place will be thine?
  ```
- **Answers:** "Candlelight Concert", "Concert", "Candlelight"
- **Success Message:** Butterfly animation + countdown to 6:15 PM
- **Memory:** "Every journey with you feels like an adventure. I can't wait to create more memories together. 💕"

### Quest 3: "Under Candlelight" (Candlelight Concert - 6:15 PM)
- **Scene:** Beautiful candlelight concert venue
- **Characters:** Both standing together
- **Final Reveal:** Love letter with heart rain animation
- **Love Letter Content:**
  ```
  My Dearest Kullu,

  From the moment I met you, my life changed forever. You are not just my partner - you are my best friend, my player two, and my greatest adventure.

  Every day with you feels like a beautiful journey, filled with love, laughter, and countless memories. Like Cody and May, we make the perfect team - supporting each other through every challenge, celebrating every victory together.

  Tonight, under the candlelight, I want you to know that my heart belongs to you, now and always. You make every ordinary moment extraordinary, and every day feel like Valentine's Day.

  Thank you for being you. Thank you for choosing me. Thank you for being my forever adventure.

  I love you more than words can say. 💕

  Forever Yours,
  Your Player One 🎮
  ```

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 15.1.0 with App Router |
| Language | TypeScript |
| Styling | Tailwind CSS 4.x |
| Animations | Framer Motion + CSS keyframes |
| Storage | LocalStorage for progress persistence |
| Deployment | Static export for tiiny.host |

---

## Project Structure

```
ValentinesDAy/
├── app/
│   ├── page.tsx          # Main game page with state machine
│   ├── layout.tsx         # Root layout with fonts
│   └── globals.css        # Tailwind + custom animations
├── components/
│   ├── QuestCard.tsx      # Individual quest component
│   ├── IntroScreen.tsx    # Start screen
│   ├── MemoryPopup.tsx    # Memory reveal modal
│   └── FloatingHearts.tsx  # Background animation
├── public/
│   ├── cody.png          # Character images (downloaded)
│   ├── may.png
│   └── rose.png          # Optional assets
├── lib/
│   └── gameStore.ts      # localStorage utilities
├── types/
│   └── game.ts           # TypeScript types
└── docs/plans/           # Design documents
```

---

## Data Model

### Game State Types

```typescript
type GameState = 'intro' | 'quest-1' | 'quest-2' | 'quest-3' | 'complete'

interface GameProgress {
  currentStage: GameState
  completedQuests: string[]
  unlockedStages: string[]
}

interface Quest {
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
```

### LocalStorage Keys

- `love-quest-progress` - Main game progress (JSON)
- `love-quest-started` - First play timestamp

---

## Component Architecture

### IntroScreen
- Title with animated gradient text
- "Begin Our Adventure" button with pulse effect
- Floating hearts background

### QuestCard
- Stage title and location badge
- Character image(s) positioned left/right
- Riddle displayed in glass-morphism card
- Text input with hint below
- Submit button with loading state
- Memory popup modal on success

### FloatingHearts
- Canvas-based particle system
- Hearts float upward with random positions/speeds
- Intensity increases on quest completion

### MemoryPopup
- Modal overlay with blur backdrop
- Memory text with romantic font
- "Continue to Next Quest" button
- Auto-triggers heart animation

---

## Animations & Effects

### Quest-Specific Animations

| Quest | Animations |
|-------|-------------|
| Quest 1 | Pulsing glow, gentle float, success sparkles |
| Quest 2 | Butterfly path animation, countdown timer, candlelight flicker |
| Quest 3 | Heart rain (50+ elements), letter scale-fade, candle borders |

### Shared Animations

- **Page Transitions:** Framer Motion `AnimatePresence` with slide-fade
- **Wrong Answer:** Shake animation (x-axis translate)
- **Button Hover:** Scale + glow intensity increase
- **Progress Dots:** Scale pop when completed
- **Background Hearts:** Continuous float loop

### Technical Implementation

- CSS keyframes: Continuous effects (floating, flickering, pulsing)
- Framer Motion: State transitions and complex sequences
- requestAnimationFrame: Particle systems (hearts, sparkles)

---

## Visual Design

### Color Scheme

```
Background: Dark gradient
  from-purple-900 → via-pink-800 → to-rose-900

Glass Cards:
  backdrop-blur-md
  bg-white/10
  border-white/20

Accents:
  Primary: pink-400
  Secondary: rose-500
  Glow: purple-400/50
```

### Typography

| Use Case | Font |
|----------|------|
| Headings | Playfair Display |
| Romantic Accents | Dancing Script |
| Body Text | Inter |

---

## Error Handling

### Input Validation
- Trim whitespace from answers
- Case-insensitive comparison
- Accept partial matches
- Empty input: Show toast message

### LocalStorage Fallback
- Graceful degradation to in-memory state
- Warning toast if persistence unavailable
- Game remains fully functional

### Edge Cases
- Mid-quest refresh: Resume at current stage
- 5+ wrong answers: Show hint with first word reveal
- Image load failures: Fallback to emoji placeholders
- Mobile resize: Responsive breakpoints (sm, md, lg, xl)

---

## Deployment Strategy

### Static Export Configuration

```typescript
// next.config.ts
export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: './'
}
```

### Build & Deploy

```bash
# Build
npm run build

# Output: /out/index.html + static assets
# Zip /out contents → Upload to tiiny.host
```

### Asset Strategy
- **Characters:** Download official It Takes Two promo art
- **Backgrounds:** CSS gradients + SVG patterns (no images)
- **Icons:** Inline SVG hearts, butterflies, roses
- **Fonts:** Google Fonts CDN

### Optimization Targets
- Bundle size: < 200KB gzipped
- All images pre-optimized
- GPU-accelerated animations (transform, opacity)
- Lazy load character images

---

## Success Criteria

- [ ] All 3 quests complete with riddle validation
- [ ] Progress persists across browser sessions
- [ ] Mobile-responsive (tested on phone)
- [ ] All animations run smoothly (60fps)
- [ ] Successfully exports to static HTML
- [ ] Deployable to tiiny.host
- [ ] Personalized content (Kullu's name, specific plan)
