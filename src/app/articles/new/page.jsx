'use client'

import { Button } from '@/components/Button'
import { Entry } from '@/components/Entry'
import { EntryLayout } from '@/components/EntryLayout'
import { useState } from 'react'

const NewArticle = () => {
  const [editableTitle, setEditableTitle] = useState('New Article')
  const [editableDate, setEditableDate] = useState('2024-02-15')
  const [editableProse, setEditableProse] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Logic to post the new article data, using editableTitle and editableDate
  }

  const handleDateChange = (newDate) => {
    setEditableDate(newDate)
  }

  const handleProseChange = (newProse) => {
    setEditableProse(newProse)
  }

  const handleTitleChange = (newTitle) => {
    setEditableTitle(newTitle)
  }

  return (
    <EntryLayout>
      <form onSubmit={handleSubmit}>
        <Entry
          entry={{
            title: editableTitle,
            date: editableDate,
            description: 'A new article',
          }}
          isEditing={true}
          onDateChange={handleDateChange}
          onProseChange={handleProseChange}
          onTitleChange={handleTitleChange}
        />
        <Button type="submit">Save</Button>
      </form>
    </EntryLayout>
  )
}

export default NewArticle
