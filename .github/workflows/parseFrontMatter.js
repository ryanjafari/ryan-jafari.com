import fsp from 'fs/promises'
import yaml from 'js-yaml'
import createFileLogger from './logger.js'
import { saveToGitHubOutput } from './saveToOutput.js'

const jobName = process.env.GITHUB_JOB
const stepName = process.env.GITHUB_STEP

const log = createFileLogger(import.meta.url).child({
  task: `${jobName}/${stepName}`,
})

log.info('Parsing article front matter...')

const { ARTICLE_PATH } = process.env
log.debug({ ARTICLE_PATH })

const content = await fsp.readFile(ARTICLE_PATH, 'utf8')
const parts = content.split('---')
const frontMatter = yaml.load(parts[1])
log.debug({ frontMatter })

saveToGitHubOutput('frontMatter', frontMatter)
