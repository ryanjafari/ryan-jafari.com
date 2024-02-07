import fsp from 'fs/promises'
import yaml from 'js-yaml'
import createFileLogger from './logger.js'

const fileLogger = createFileLogger(import.meta.url)
const log = fileLogger.child({ task: 'ck-broadcast' })

parseFrontMatter()

export default async function parseFrontMatter() {
  log.info('Parsing article front matter...')

  const { ARTICLE_PATH } = process.env
  log.info({ ARTICLE_PATH })

  const content = await fsp.readFile(ARTICLE_PATH, 'utf8')
  const parts = content.split('---')
  const frontMatter = yaml.load(parts[1])
  log.debug({ frontMatter })

  return frontMatter
}
