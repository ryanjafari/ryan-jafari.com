import fsp from 'fs/promises'
import yaml from 'js-yaml'
import { createFileLogger } from './logger.js'
import { saveToGitHubOutput } from './saveToGitHubOutput.js'

const log = createFileLogger(import.meta.url)

log.info('Parsing article front matter...')

const { ARTICLE_PATH } = process.env
log.debug({ ARTICLE_PATH })

const content = await fsp.readFile(ARTICLE_PATH, 'utf8')
const parts = content.split('---')
const frontMatter = yaml.load(parts[1])
log.debug({ frontMatter })

saveToGitHubOutput('articleFrontMatter', frontMatter)
