import React, { useEffect, useState } from 'react'
import { FaLock } from 'react-icons/fa'
import { IoAlertCircle } from 'react-icons/io5'
import { classNames } from '../lib/utils'

type Props = {
  password: string
  title: string
}

const slugify = (str: string) => {
  return str.toLowerCase().split(' ').join('-')
}

export default function PasswordInput({ password, title }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isAuth, setIsAuth] = useState(() => {
    const slug = slugify(title)
    if (import.meta.env.SSR) {
      return false
    }
    if (typeof localStorage !== 'undefined' && localStorage.getItem(slug)) {
      return localStorage.getItem(slug) === 'AUTHORIZED'
    }
    return false
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const input = e.currentTarget.elements[0] as HTMLInputElement
    if (input.value === password) {
      setIsAuth(true)
      localStorage.setItem(slugify(title), 'AUTHORIZED')
    } else {
      setIsError(true)
    }
  }

  return isMounted && !isAuth ? (
    <div className="z-50 w-screen h-screen absolute backdrop-blur-sm overflow-hidden">
      <div className="w-full h-full inline-flex justify-center items-center">
        <form onSubmit={handleSubmit}>
          <div className="relative inline-flex items-center p-6 rounded-lg shadow-xl border border-custom-teal dark:border-zinc-700">
            <input
              type="password"
              name="password"
              id="password"
              onChange={() => setIsError(false)}
              className={classNames(
                isError
                  ? 'border transition-all duration-500 border-red-500 animate-shake'
                  : 'border-0',
                'p-2 rounded-md text-lg  shadow bg-zinc-50 dark:bg-zinc-700 focus:ring-2 focus:ring-custom-teal dark:focus:ring-zinc-300 focus:outline-8'
              )}
              placeholder="Enter password"
              aria-invalid="true"
              aria-describedby="password-input"
            />
            {isError && (
              <div className="pointer-events-none absolute inset-y-0 right-20 flex items-center">
                <IoAlertCircle
                  className="w-6 h-6 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
            <button type="submit">
              <FaLock className="w-6 h-6 ml-4 text-current text-custom-teal dark:text-zinc-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div />
  )
}