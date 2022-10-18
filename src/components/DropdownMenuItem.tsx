import React, { ReactNode } from 'react'
import { Menu } from '@headlessui/react'
import { classNames } from '../lib/utils'

type Props = {
  href: string
  children: ReactNode
}

export default function DropdownMenuItem({ children, href }: Props) {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href={href}
          className={classNames(
            active ? 'bg-custom-teal dark:bg-zinc-700' : '',
            'block px-4 py-2 text-sm'
          )}
        >
          {children}
        </a>
      )}
    </Menu.Item>
  )
}
