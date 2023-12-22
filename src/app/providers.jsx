'use client'

import { MDXProvider } from '@mdx-js/react'
import { ThemeProvider, useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { createContext, useEffect, useRef } from 'react'
import { useMDXComponents } from '../../mdx-components'

function usePrevious(value) {
  let ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    let media = window.matchMedia('(prefers-color-scheme: dark)')

    function onMediaChange() {
      let systemTheme = media.matches ? 'dark' : 'light'
      if (resolvedTheme === systemTheme) {
        setTheme('system')
      }
    }

    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export const AppContext = createContext({})

export function Providers({ children }) {
  let pathname = usePathname()
  let previousPathname = usePrevious(pathname)
  const mdxComponents = useMDXComponents()

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
      >
        <ThemeWatcher />
        <MDXProvider components={mdxComponents}>{children}</MDXProvider>
      </ThemeProvider>
    </AppContext.Provider>
  )
}
