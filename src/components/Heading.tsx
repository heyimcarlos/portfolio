import React, { ReactNode } from 'react'

type Props = {
  children: any
  className?: string
  // @todo: Extract these keys from type
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  variant?: 'section-title' | 'none'
}

export default function Heading({
  children,
  className,
  as = 'h1',
  variant = 'none'
}: Props) {
  const variantClasses =
    variant === 'section-title'
      ? 'font-mplus font-bold text-xl mb-4 mt-3 leading-[1.33] md:leading-tight underline underline-offset-[6px] decoration-4 decoration-custom-teal dark:decoration-zinc-600'
      : ''
  const heading = React.createElement(as, {
    className: ` ${variantClasses}
     ${className}`,
    children
  })
  return <>{heading}</>
}
