import chalk from 'chalk'
import fsp from 'fs/promises'
import yaml from 'js-yaml'

function customLog(...args) {
  const app = chalk.gray('[ryan-jafari.com]')
  const job = chalk.white('[ck-broadcast]')
  console.log(app, job, ...args)
}

export default async function parseFrontMatter({ github, context }) {
  customLog(chalk.yellow('Parsing article front matter...'))

  const { ARTICLE_PATH } = process.env
  customLog(chalk.blue('article path:'), ARTICLE_PATH)

  const content = await fsp.readFile(ARTICLE_PATH, 'utf8')
  const parts = content.split('---')
  const frontMatter = yaml.load(parts[1])
  customLog(chalk.blue('article front matter:'), frontMatter)

  return frontMatter
}
