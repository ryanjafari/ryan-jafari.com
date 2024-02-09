import { parseResponse } from './logResponseDetails.js'
import createFileLogger from './logger.js'
import { saveToGitHubOutput } from './saveToGitHubOutput.js'

const log = createFileLogger(import.meta.url)

// Parses environment variables required for the operation
function parseEnvVariables() {
  const {
    ARTICLE_FRONT_MATTER,
    ARTICLE_PATH,
    CK_API_KEY,
    CK_API_BASE_URL,
    CK_API_BC_ENDPOINT,
    CK_EMAIL_ADDRESS,
    NEXT_PUBLIC_SITE_URL,
  } = process.env

  log.debug('Parsed environment variables.')

  return {
    ARTICLE_FRONT_MATTER,
    ARTICLE_PATH,
    CK_API_KEY,
    CK_API_BASE_URL,
    CK_API_BC_ENDPOINT,
    CK_EMAIL_ADDRESS,
    NEXT_PUBLIC_SITE_URL,
  }
}

// Prepares email content based on the article's front matter and path
function prepareEmailContent(ARTICLE_PATH, NEXT_PUBLIC_SITE_URL, frontMatter) {
  const slug = ARTICLE_PATH.match(/articles\/(.+?)\/page\.md/)[1]
  const url = `${NEXT_PUBLIC_SITE_URL}/articles/${slug}`
  const content = `<p>${frontMatter.date}</p><p>${frontMatter.description}</p><p><a href="${url}">Read more...</a></p>`
  const subject = frontMatter.title

  log.debug({ slug, url, content, subject }, 'Prepared email content.')

  return { url, content, subject }
}

// Main function that handles sending an email via ConvertKit
async function sendEmailToConvertKit() {
  log.info('Initiating email sending process to ConvertKit.')
  const envVars = parseEnvVariables()
  const frontMatter = JSON.parse(envVars.ARTICLE_FRONT_MATTER)
  const { url, content, subject } = prepareEmailContent(
    envVars.ARTICLE_PATH,
    envVars.NEXT_PUBLIC_SITE_URL,
    frontMatter,
  )

  log.debug({ url, content, subject }, 'Prepared email content.')

  saveToGitHubOutput('articleUrl', url)
  log.debug('Article URL saved to GitHub output.')

  const ckApiEndpoint = `${envVars.CK_API_BASE_URL}${envVars.CK_API_BC_ENDPOINT}`

  try {
    log.info('Attempting to post email content to ConvertKit.')
    const response = await fetch(ckApiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: envVars.CK_API_KEY,
        content,
        description: '[ck-broadcast] GitHub Workflow Job',
        email_address: envVars.CK_EMAIL_ADDRESS,
        public: true,
        published_at: frontMatter.date,
        subject,
      }),
    })
    log.debug({ response }, 'Received response from ConvertKit.')

    const responseBody = await parseResponse(response)
    log.debug({ responseBody }, 'Parsed response body from ConvertKit.')

    if (!response.ok) {
      // TODO: log.handleError(response, 'Failed to send email to ConvertKit.')
      log.error({ response }, 'Failed to send email to ConvertKit.')
      throw new Error('Failed to send email to ConvertKit.')
    }

    log.info({ response }, 'Email successfully sent to ConvertKit.')
  } catch (error) {
    log.error(
      { error },
      'An error occurred while attempting to send email to ConvertKit.',
    )
    process.exit(1)
  }
}

sendEmailToConvertKit()
