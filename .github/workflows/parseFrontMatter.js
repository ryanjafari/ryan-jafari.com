import chalk from 'chalk'
import fsp from 'fs/promises'
import yaml from 'js-yaml'
import { customLog } from './customLog.js'
import createFileLogger from './logger.js'

const fileLogger = createFileLogger(import.meta.url)
const log = fileLogger.child({ task: 'ck-broadcast' })

parseFrontMatter()

export default async function parseFrontMatter() {
  log.info('Parsing article front matter...')

  const { ARTICLE_PATH } = process.env
  customLog(chalk.blue('article path env:'), ARTICLE_PATH)

  const content = await fsp.readFile(ARTICLE_PATH, 'utf8')
  const parts = content.split('---')
  const frontMatter = yaml.load(parts[1])
  customLog(chalk.blue('article front matter:'), frontMatter)

  return frontMatter
}
