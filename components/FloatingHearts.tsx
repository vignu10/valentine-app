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
