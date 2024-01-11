'use client'

import { subscribeToNewsletter } from '@/app/actions'
import { useState } from 'react'
import { Button } from './Button'

function MailIcon(props) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
      />
      <path
        className="stroke-zinc-400 dark:stroke-zinc-500"
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
      />
    </svg>
  )
}

export function Newsletter() {
  const [hasError, setHasError] = useState(false)

  const submit = async (formData) => {
    try {
      await subscribeToNewsletter(formData)
      setHasError(false)
    } catch (error) {
      // TODO: Is there a way to automatically make sure that this error (and others like it) are only shown in the debug console in development?
      if (process.env.NODE_ENV === 'development') {
        // console.error(
        //   '%c[ryan-jafari.com]%c [subscribe]',
        //   'color: rgb(120, 120, 120)',
        //   'color: inherit',
        //   error,
        // )
      }
      setHasError(true)
    }
  }

  return (
    <form
      action={submit}
      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Stay up to date</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Get notified when I publish something new, and unsubscribe at any time.
      </p>
      <div className="mt-6 flex">
        <input
          aria-label="Email address"
          className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
          name="email"
          placeholder="Email address"
          required
          type="email"
        />
        <Button
          className="ml-4 flex-none"
          type="submit"
        >
          Join
        </Button>
      </div>

      {hasError && (
        <div className="mt-4 text-sm text-red-500">
          Something went wrong. Please try again.
        </div>
      )}
    </form>
  )
}
