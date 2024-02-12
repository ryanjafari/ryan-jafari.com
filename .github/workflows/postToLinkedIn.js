import { createFileLogger } from './logger.js'
import { parseResponse } from './parseResponse.js'

const log = createFileLogger(import.meta.url)

// Parses environment variables required for the operation
const parseEnvVariables = () => {
  const envVariables = {
    SHARE_URL: process.env.SHARE_URL,
    SHARE_CONTENT: process.env.SHARE_CONTENT,
    SHARE_TITLE: process.env.SHARE_TITLE,
    LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_API_BASE_URL: process.env.LINKEDIN_API_BASE_URL,
    LINKEDIN_API_POSTS_ENDPOINT: process.env.LINKEDIN_API_POSTS_ENDPOINT,
    LINKEDIN_PERSON_ID: process.env.LINKEDIN_PERSON_ID,
  }

  log.debug({ envVariables }, 'Parsed environment variables.')

  return envVariables
}

const postArticleToLinkedIn = async (envVars) => {
  const linkedInApiUrl = `${envVars.LINKEDIN_API_BASE_URL}/${envVars.LINKEDIN_API_POSTS_ENDPOINT}`
  log.debug({ linkedInApiUrl }, 'Posting article to LinkedIn.')

  const payload = JSON.stringify({
    author: `urn:li:person:${envVars.LINKEDIN_PERSON_ID}`,
    commentary: 'test',
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'DRAFT', // or 'PUBLISHED'
    isReshareDisabledByAuthor: false,
  })
  log.debug({ payload }, 'Constructed payload for LinkedIn.')

  const response = await fetch(linkedInApiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${envVars.LINKEDIN_ACCESS_TOKEN}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202401',
      'Content-Type': 'application/json',
    },
    body: payload,
  })
  if (!response.ok) {
    log.error({ response }, 'Failed to post article to LinkedIn.')
    throw new Error('Failed to post article to LinkedIn.')
  }
  return response
}

const main = async () => {
  log.debug('Initiating LinkedIn article sharing process.')
  const envVars = parseEnvVariables()

  const response = await postArticleToLinkedIn(envVars)
  log.debug({ response }, 'Received response from LinkedIn.')
  const responseBody = await parseResponse(response)
  log.debug({ responseBody }, 'Parsed response body from LinkedIn.')

  log.info('Article successfully shared on LinkedIn.')
}

await main()
  .then(() => {
    log.info('LinkedIn article sharing process completed.')
  })
  .catch((error) => {
    log.error(
      { error },
      'An error occurred during the LinkedIn article sharing process.',
    )
    process.exit(1)
  })
  .finally(() => {
    log.info('Finished sharing article on LinkedIn.')
  })
