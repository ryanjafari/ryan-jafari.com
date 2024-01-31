import fs from 'fs'
import yaml from 'js-yaml'

export default function parseFrontMatter({ github, context }) {
  const { ARTICLE_PATH } = process.env

  const content = fs.readFileSync(ARTICLE_PATH, 'utf8')
  const parts = content.split('---')
  const frontMatter = yaml.load(parts[1])

  console.log(
    `[CK-Broadcast] ${frontMatter.date}|${frontMatter.title}|${frontMatter.description}`,
  )

  return frontMatter
}
