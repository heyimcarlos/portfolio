import { motion } from 'framer-motion'
import React, { ReactNode } from 'react'

type Props = {
  delay?: number
  children: ReactNode
}

export default function MotionSection({ children, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      className="mb-6"
    >
      {children}
    </motion.div>
  )
}
