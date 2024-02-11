import fsp from 'fs/promises'
import yaml from 'js-yaml'
import { createFileLogger } from './logger.js'
import { saveToGitHubOutput } from './saveToGitHubOutput.js'

const log = createFileLogger(import.meta.url)

// Validate ARTICLE_PATH environment variable
const validateArticlePath = () => {
  const { ARTICLE_PATH } = process.env
  if (!ARTICLE_PATH) {
    log.error({ ARTICLE_PATH }, 'Missing ARTICLE_PATH environment variable.')
    throw new Error('Missing ARTICLE_PATH environment variable.')
  }
  log.debug({ ARTICLE_PATH }, 'Validated ARTICLE_PATH environment variable.')
  return ARTICLE_PATH
}

// Read and validate article content
const readAndValidateContent = async (ARTICLE_PATH) => {
  const content = await fsp.readFile(ARTICLE_PATH, 'utf8')
  if (!content.includes('---')) {
    log.error({ content }, 'Content does not include front matter delimiters.')
    throw new Error('Content does not include front matter delimiters.')
  }
  log.debug({ content }, 'Read and validated article content.')
  return content
}

// Extract and parse front matter from content
const extractAndParseFrontMatter = (content) => {
  const parts = content.split('---')
  const frontMatter = yaml.load(parts[1])
  if (!frontMatter) {
    log.error({ parts }, 'Failed to parse front matter.')
    throw new Error('Failed to parse front matter.')
  }
  log.debug({ frontMatter }, 'Extracted and parsed front matter.')
  return frontMatter
}

// Main function orchestrating the parsing process
const main = async () => {
  log.debug('Starting article front matter parsing process.')

  const ARTICLE_PATH = validateArticlePath()
  const content = await readAndValidateContent(ARTICLE_PATH)
  const frontMatter = extractAndParseFrontMatter(content)

  saveToGitHubOutput('articleFrontMatter', frontMatter)
}

await main()
  .then(() => {
    log.info('Article front matter parsing completed.')
  })
  .catch((error) => {
    log.error({ error }, 'An error occurred during the parsing process.')
    process.exit(1)
  })
  .finally(() => {
    log.info('Finished parsing front matter.')
  })
