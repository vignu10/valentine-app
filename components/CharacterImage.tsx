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
