import { createFileLogger } from './logger.js'

const log = createFileLogger(import.meta.url)

// Parses environment variables required for the operation
const parseEnvVariables = () => {
  const envVariables = ({
    SHARE_URL: process.env.SHARE_URL,
    SHARE_CONTENT: process.env.SHARE_CONTENT,
    SHARE_TITLE: process.env.SHARE_TITLE,
    LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_PERSON_ID: process.env.LINKEDIN_PERSON_ID,
  } = process.env)

  log.debug({ envVariables }, 'Parsed environment variables.')

  return envVariables
}

const postArticleToLinkedIn = async (envVars) => {
  const linkedInApiUrl = `${envVars.LINKEDIN_API_BASE_URL}/${envVars.LINKEDIN_API_POSTS_ENDPOINT}`
  log.debug({ linkedInApiUrl }, 'Posting article to LinkedIn.')

  const payload = {
    author: `urn:li:person:${LINKEDIN_PERSON_ID}`,
    lifecycleState: 'DRAFT',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: 'test',
        },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PRIVATE',
    },
  }
  log.debug({ payload }, 'Constructed payload for LinkedIn.')

  const response = await fetch(linkedInApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

  // Construct the request payload according to LinkedIn's API requirements

  // Send the request
  // try {
  //   const response = await fetch(apiUrl, {
  //     method: 'POST',
  //     body: JSON.stringify(payload),
  //     headers: {
  //       Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
  //       'Content-Type': 'application/json',
  //       'X-Restli-Protocol-Version': '2.0.0', // This header is required for LinkedIn API calls
  //     },
  //   })

  //   log.info('Received response from LinkedIn...')
  //   await logResponseDetails(response)

  //   if (!response.ok) {
  //     log.error(response.status, 'Error! status:')
  //     throw new Error('Failed to post article to LinkedIn')
  //   } else {
  //     log.info(response.status, 'Success! status:')
  //   }
  // } catch (error) {
  //   log.error(
  //     error.message,
  //     'An error occurred while fetching the LinkedIn API:',
  //   )
  //   process.exit(1)
  // }
}

main()
