# CarSurprise Component Design

**Date:** 2026-02-14
**Author:** Claude Code
**Status:** Approved

## Overview

A delightful sequential surprise component that reveals romantic car elements after the hostel quest is answered. The user interacts with an illustrated car to discover three surprises: rose petals from the sun visor, chocolates on the dashboard, and balloons with a bouquet in the boot.

## Component Structure

### File: `/components/CarSurprise.tsx`

**Props:**
```typescript
interface CarSurpriseProps {
  onComplete: () => void
}
```

**State:**
```typescript
- currentStep: 0 | 1 | 2 | 3  // Which surprise we're on
- isAnimating: boolean            // Block clicks during animation
```

**Sub-components:**
- `CarIllustration` — Stylized car SVG with clickable hotspots
- `SurpriseAnimation` — Handles the 3 animation types
- `HintBubble` — Animated hint text with pulse
- `ProgressBar` — Progress dots (○ ○ ○ → ● ● ●)

### Surprise Data Structure

```typescript
const SURPRISES = [
  {
    id: 'sunvisor',
    hint: '✨ Open the sun visor...',
    animation: 'rose-petals',
    position: { x: 30, y: 20 }
  },
  {
    id: 'dashboard',
    hint: '🍫 Check the dashboard...',
    animation: 'chocolates',
    position: { x: 50, y: 60 }
  },
  {
    id: 'boot',
    hint: '🎈 Open the boot for something special...',
    animation: 'balloons',
    position: { x: 80, y: 70 }
  }
]
```

## User Flow

1. User answers hostel riddle correctly → QuestCard triggers `onComplete`
2. CarSurprise renders in place (instead of immediate quest-2 advance)
3. Shows hint + highlighted hotspot for current step (1/3)
4. User clicks hotspot → animation plays, hotspots fade
5. Next hint + hotspot appears (2/3)
6. After all 3 → final celebration + "Continue" button
7. Button click → advances to quest-2

## Animation Details

### 1. Rose Petals (Sun Visor) 🌹
- Sun visor flips open with spring physics (bounce)
- 12-15 petal shapes cascade with varying rotation speeds
- Petals have subtle glow, random x-drift for organic scatter
- Easter egg: Occasional heart-shaped petal (💕)
- Sparkle burst when last petal lands
- Duration: ~2.5s

### 2. Chocolate Reveal (Dashboard) 🍫
- Dashboard pulses with pink glow
- Chocolates "pop-pop-pop" sequence (3 rapid scale-ins)
- Unique wrapper patterns (gold foil, silver hearts, pink stripes)
- Subtle shine sweep across each chocolate
- Tiny hearts float up from chocolates
- Easter egg: One chocolate has a bite taken out
- Duration: ~2s

### 3. Balloon Float + Bouquet (Boot) 🎈💐
- Boot lid lifts with easing
- 5 balloons float up with physics-based sway (varying sizes/colors)
- String trails follow each balloon
- Bouquet blooms open with scale + rotation
- Confetti sparkles in boot
- Easter egg: One balloon has tiny heart hanging
- Duration: ~3.5s

### Shared Behaviors
- Rotating playful hints for each hotspot
- Hotspots have satisfying hover state (glow + scale)
- Progress dots animate checkmark drawing
- All transitions use spring physics
- Final celebration: heart burst confetti (FloatingHearts intensity=5)
- Message: "The real surprise awaits in the car... 💕"

## Integration with Existing Code

### Modify `lib/questConfig.ts`
Add `hasCarSurprise: true` flag to quest-1:

```typescript
{
  id: 'quest-1',
  // ... existing props
  hasCarSurprise: true  // NEW
}
```

### Modify `app/page.tsx`
Add state and handlers:

```typescript
const [showCarSurprise, setShowCarSurprise] = useState(false)

const handleQuestComplete = (questId: string) => {
  const quest = getCurrentQuest()

  if (quest?.hasCarSurprise) {
    setShowCarSurprise(true)
  } else {
    // Normal flow
    const nextStage = determineNextStage(questId)
    setGameState(nextStage)
  }
}

const handleCarSurpriseComplete = () => {
  setShowCarSurprise(false)
  setGameState('quest-2')
  gameStore.saveProgress({ currentStage: 'quest-2', ... })
}
```

Render condition:
```typescript
{showCarSurprise && (
  <CarSurprise key="car-surprise" onComplete={handleCarSurpriseComplete} />
)}
```

## Visual Design

- Stylized illustrated car view (2D flat design)
- Glass morphism card style matching existing `.glass-card`
- Playful emoji-driven hints
- Pink/purple gradient background (existing)
- Font: Playfair Display for titles, Dancing Script for romantic touches

## Error Handling & Edge Cases

- **Rapid clicks**: Debounce, only first triggers
- **Navigate away**: Cleanup animations in useEffect
- **Animation fails**: Silent fallback, still advance
- **Keyboard navigation**: Tab through hotspots, Enter/Space triggers
- **Reduced motion**: Detect `prefers-reduced-motion`, simplify animations
- **Screen readers**: Announce "Rose petals falling from sun visor" etc.
- **Failsafe**: 2-second timeout on isAnimating
- **Images fail**: Display emoji alternatives (🚗💕)
- **Refresh mid-surprise**: Restart from step 1 (keeps it fresh)

## Testing Checklist

- [ ] Each hotspot triggers correct animation
- [ ] Animations play in correct sequence
- [ ] Can't click during animation (isAnimating works)
- [ ] Progress dots update correctly
- [ ] Final celebration plays after 3rd surprise
- [ ] Continue button advances to quest-2
- [ ] Refreshing restarts from step 1
- [ ] Keyboard navigation works (Tab + Enter)
- [ ] Reduced motion preference respected
- [ ] Cross-browser: Chrome/Safari/Firefox, iOS/Android

## Implementation Notes

- All animations use Framer Motion's AnimatePresence for clean exits
- Hotspot positions are percentage-based for responsive design
- Each animation component is independently testable
- Progress persists across page reloads via gameStore
- Easter eggs included: heart-shaped petal, bitten chocolate, heart on balloon

## Dependencies

- Framer Motion (already installed)
- Existing glass-card styles
- Existing FloatingHearts component
- Existing gameStore for progress persistence
