import fs from 'fs'
import fsp from 'fs/promises'
import yaml from 'js-yaml'
import createFileLogger from './logger.js'

const log = createFileLogger(import.meta.url).child({
  task: 'ck-broadcast',
})

log.info('Parsing article front matter...')

const { ARTICLE_PATH } = process.env
log.debug({ ARTICLE_PATH })

const content = await fsp.readFile(ARTICLE_PATH, 'utf8')
const parts = content.split('---')
const frontMatter = yaml.load(parts[1])
log.debug({ frontMatter })

// Assuming frontMatter is your object
const frontMatterString = JSON.stringify(frontMatter)
log.debug({ frontMatterString })

// Construct the output string; replace 'frontMatter' with your desired output name
const outputString = `frontMatter=${frontMatterString}`
log.debug({ outputString })

// Write to the GITHUB_OUTPUT file
fs.appendFileSync(process.env.GITHUB_OUTPUT, outputString + '\n')
