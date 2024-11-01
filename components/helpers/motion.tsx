import { HTMLMotionProps, motion } from 'framer-motion'
import { forwardRef, HTMLAttributes, ReactNode } from 'react'

type MotionDivProps = { children?: ReactNode } & HTMLMotionProps<'div'> &
  HTMLAttributes<HTMLDivElement>

export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div ref={ref} {...props}>
        {children}
      </motion.div>
    )
  }
)

MotionDiv.displayName = 'MotionDiv'
