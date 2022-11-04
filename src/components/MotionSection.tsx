import { motion, MotionConfig, useReducedMotion } from 'framer-motion'
import React, { ReactNode } from 'react'

type Props = {
  delay?: number
  children: ReactNode
  classNames?: string
}

export default function MotionSection({
  children,
  delay = 0,
  classNames
}: Props) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={
          !shouldReduceMotion ? { y: 10, opacity: 0 } : { y: 0, opacity: 0 }
        }
        animate={
          !shouldReduceMotion ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }
        }
        transition={
          !shouldReduceMotion
            ? { duration: 0.8, delay }
            : { duration: 0, delay: 0 }
        }
        className={`mb-6 ${classNames}`}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}
