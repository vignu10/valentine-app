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
  choices?: string[]
  successMessage: string
  memory: string
  hasCarSurprise?: boolean
}

export interface QuestConfig {
  quests: Quest[]
}
