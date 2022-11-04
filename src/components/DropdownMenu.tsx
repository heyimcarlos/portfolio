import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { IoMenu } from 'react-icons/io5/index.js'
import DropdownMenuItem from './DropdownMenuItem'
import { SOURCE_URL, EMAIL } from '../config'

const navItems = [
  { title: 'About', path: '/' },
  { title: 'Projects', path: '/projects' },
  { title: 'Contact', path: `mailto:${EMAIL}` }
  // { title: 'Blog', path: '/blog' }
]

export default function DropdownMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left pr-2 sm:pr-0">
      <div>
        <Menu.Button
          className="inline-flex justify-center rounded-md border border-zinc-400  dark:border-zinc-700 px-2 py-2 text-sm font-medium shadow-sm hover:bg-zinc-400 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-custom-teal focus:ring-offset-2 focus:ring-offset-gray-100 transition-all"
          aria-label="menu"
        >
          <IoMenu className="w-5 h-5" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md border border-zinc-400 dark:border-zinc-700 bg-orange-50 dark:bg-zinc-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none divide-zinc-400 dark:divide-zinc-700">
          {navItems.map(item => (
            <DropdownMenuItem href={item.path} key={item.title}>
              {item.title}
            </DropdownMenuItem>
          ))}
          {/* <DropdownMenuItem href={SOURCE_URL} key="source">
            Source
          </DropdownMenuItem> */}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
