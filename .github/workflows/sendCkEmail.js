import { parseResponse } from './logResponseDetails.js'
import createFileLogger from './logger.js'
import { saveToGitHubOutput } from './saveToGitHubOutput.js'

const log = createFileLogger(import.meta.url)

// Extracted function for parsing environment variables
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

  // Here, you could add validation or defaulting if necessary
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

// Function to prepare email content
function prepareEmailContent(ARTICLE_PATH, NEXT_PUBLIC_SITE_URL, frontMatter) {
  const slug = ARTICLE_PATH.match(/articles\/(.+?)\/page\.md/)[1]
  const url = `${NEXT_PUBLIC_SITE_URL}/articles/${slug}`
  const content = `<p>${frontMatter.date}</p><p>${frontMatter.description}</p><p><a href="${url}">Read more...</a></p>`
  const subject = frontMatter.title
  return { slug, url, content, subject }
}

// Main function to encapsulate the logic
async function sendEmailToConvertKit() {
  log.info('Sending email to ConvertKit...')
  const envVars = parseEnvVariables()
  const frontMatter = JSON.parse(envVars.ARTICLE_FRONT_MATTER)
  const { slug, url, content, subject } = prepareEmailContent(
    envVars.ARTICLE_PATH,
    envVars.NEXT_PUBLIC_SITE_URL,
    frontMatter,
  )

  saveToGitHubOutput('articleUrl', url)
  log.debug({ slug, url, content, subject })

  const ckApiEndpoint = `${envVars.CK_API_BASE_URL}${envVars.CK_API_BC_ENDPOINT}`

  try {
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

    log.info('Received response from ConvertKit...')

    const responseBody = await parseResponse(response)

    // await logResponseDetails(response)

    if (!response.ok) {
      log.error(response, 'Error! response:')
      throw new Error('Failed to send email to ConvertKit')
    } else {
      log.info(response, 'Success! response:')
    }
  } catch (error) {
    // For now, exit because we are in a GitHub Actions context, and we want to fail the job if an error occurs. Later, we will probably handle the error more gracefully as we'll be in a real application context.
    log.error(error, 'An error occurred while fetching the ConvertKit API:')
    process.exit(1)
  }
}

sendEmailToConvertKit()
