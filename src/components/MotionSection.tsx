import { motion, MotionConfig, useReducedMotion } from 'framer-motion'
import React, { ReactNode, useEffect, useState } from 'react'

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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted && shouldReduceMotion ? (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0, delay: 0 }}
      className={`mb-6 ${classNames}`}
    >
      {children}
    </motion.div>
  ) : (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay }}
        className={`mb-6 ${classNames}`}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}
