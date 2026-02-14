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
