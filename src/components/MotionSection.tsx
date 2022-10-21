import { motion } from 'framer-motion'
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
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      className={`mb-6 ${classNames}`}
    >
      {children}
    </motion.div>
  )
}
