import { logResponseDetails } from './logResponseDetails.js'
import createFileLogger from './logger.js'

const log = createFileLogger(import.meta.url)

async function postArticleToLinkedIn() {
  log.info('Posting article to LinkedIn...')

  const {
    ARTICLE_FRONT_MATTER,
    ARTICLE_URL,
    LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_PERSON_ID,
  } = process.env

  // Parse the ARTICLE_FRONT_MATTER if necessary
  const articleDetails = JSON.parse(ARTICLE_FRONT_MATTER)
  const { title, description } = articleDetails // Assuming these fields exist

  // Define the API endpoint
  const apiUrl = 'https://api.linkedin.com/v2/ugcPosts'

  // Construct the request payload according to LinkedIn's API requirements
  const payload = {
    author: `urn:li:person:${LINKEDIN_PERSON_ID}`,
    lifecycleState: 'DRAFT',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: `${title} - ${description}. Read more: ${ARTICLE_URL}`,
        },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PRIVATE',
    },
  }

  // Send the request
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0', // This header is required for LinkedIn API calls
      },
    })

    log.info('Received response from LinkedIn...')
    await logResponseDetails(response)

    if (!response.ok) {
      log.error(response.status, 'Error! status:')
      throw new Error('Failed to post article to LinkedIn')
    } else {
      log.info(response.status, 'Success! status:')
    }
  } catch (error) {
    log.error(
      error.message,
      'An error occurred while fetching the LinkedIn API:',
    )
    process.exit(1)
  }
}

postArticleToLinkedIn()
