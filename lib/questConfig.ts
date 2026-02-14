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
      hasCarSurprise: true  // ADD THIS LINE
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
