import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllEntries } from '@/lib/entries'
import { formatDate } from '@/lib/formatDate'

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export const metadata = {
  title: 'Articles',
  description:
    'All of my long-form thoughts on programming, products, relationships, management, startups, tinkering, and the future. In the order I had them.',
}

export default async function ArticlesIndex() {
  let articles = await getAllEntries('articles')

  return (
    <SimpleLayout
      intro="All of my long-form thoughts on programming, products, relationships, management, startups, tinkering, and the future. In the order I had them."
      title="Writing on software design, leadership, and tech problem-solving."
    >
      <div className="flex justify-end">
        <Button href="/articles/new">Create New Article</Button>
      </div>
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {articles.map((article) => (
            <Article
              article={article}
              key={article.slug}
            />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
