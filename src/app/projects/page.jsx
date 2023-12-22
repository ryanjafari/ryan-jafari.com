import Image from 'next/image'

import { Card } from '@/components/Card'
import { ProjectBullet } from '@/components/ProjectBullet'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllEntries } from '@/lib/entries'
import { formatDate } from '@/lib/formatDate'
import { LinkIcon } from '@heroicons/react/24/outline'

function Project({ project }) {
  return (
    <Card
      as="li"
      key={project.title}
    >
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image
          src={project.logo}
          alt={`Logo for ${project.title}`}
          className="h-8 w-8"
          unoptimized
        />
      </div>
      <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={`/projects/${project.slug}`}>
          {project.title}
        </Card.Link>
      </h2>
      <p className="relative z-10 text-sm text-zinc-600 dark:text-zinc-400">
        {formatDate(project.date)}
      </p>
      <Card.Description>{project.description}</Card.Description>
      <ProjectBullet
        icon={LinkIcon}
        text={`/projects/${project.slug}`}
      />
    </Card>
  )
}

export const metadata = {
  title: 'Projects',
  description: "Things I've made trying to put my dent in the universe.",
}

export default async function ProjectsIndex() {
  let projects = await getAllEntries('projects')

  return (
    <SimpleLayout
      title="Things I've made trying to put my dent in the universe."
      intro="An almost-comprehensive listing of projects I've worked on in my career."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Project
            key={project.slug}
            project={project}
          />
        ))}
      </ul>
    </SimpleLayout>
  )
}
