'use client'

import { formatDate } from '@/lib/formatDate'
import dynamic from 'next/dynamic'
import { Suspense, useRef } from 'react'
import { Loading } from './Loading'
import { Prose } from './Prose'

const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
})

const EditableTitle = ({ isEditing, title, onChange }) => {
  return isEditing ? (
    <input
      className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100"
      onChange={onChange}
      placeholder="Article Title"
      type="text"
      value={title}
    />
  ) : (
    <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
      {title}
    </h1>
  )
}

const EditableDate = ({ isEditing, date, onChange }) => {
  return isEditing ? (
    <input
      className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
      onChange={onChange}
      type="date"
      value={date}
    />
  ) : (
    <time
      className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
      dateTime={date}
    >
      <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
      <span className="ml-3">{formatDate(date)}</span>
    </time>
  )
}

const EditableProse = ({ isEditing, children }) => {
  const editorRef = useRef(null)

  return (
    <div className="mt-8">
      {isEditing ? (
        <Suspense fallback={<Loading />}>
          <Editor
            editorRef={editorRef}
            markdown="cool"
          />
        </Suspense>
      ) : (
        <Prose data-mdx-content>{children}</Prose>
      )}
    </div>
  )
}

// TODO: See if I can make this one parameter.
const Entry = ({ entry, isEditing, onTitleChange, onDateChange, children }) => {
  return (
    <article>
      <header className="flex flex-col">
        <EditableTitle
          isEditing={isEditing}
          onChange={onTitleChange}
          title={entry.title}
        />
        <EditableDate
          date={entry.date}
          isEditing={isEditing}
          onChange={onDateChange}
        />
      </header>
      <EditableProse isEditing={isEditing}>{children}</EditableProse>
    </article>
  )
}

export { Entry }
