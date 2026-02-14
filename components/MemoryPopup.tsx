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
