'use client'

import { AppContext } from '@/app/providers'
import { Container } from '@/components/Container'
import { useContext } from 'react'
import BackButton from './BackButton'

export function EntryLayout({ children, isEditing = false }) {
  let { previousPathname } = useContext(AppContext)

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          {/* TODO: Set the copy here "articles" dynamically. */}
          {previousPathname && <BackButton ariaLabel="Go back to articles" />}
          {children}
        </div>
      </div>
    </Container>
  )
}
