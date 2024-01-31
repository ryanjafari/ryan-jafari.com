import chalk from 'chalk'
import fsp from 'fs/promises'
import yaml from 'js-yaml'

export default async function parseFrontMatter({ github, context }) {
  const { ARTICLE_PATH } = process.env

  const content = await fsp.readFile(ARTICLE_PATH, 'utf8')
  const parts = content.split('---')
  const frontMatter = yaml.load(parts[1])

  console.log(chalk.blue('Article front matter:'), frontMatter)

  // console.log(
  //   `[CK-Broadcast] ${frontMatter.date}|${frontMatter.title}|${frontMatter.description}`,
  // )

  return frontMatter
}
