import { createFileLogger } from './logger.js'
import { parseResponse } from './parseResponse.js'
import { saveToGitHubOutput } from './saveToGitHubOutput.js'

const log = createFileLogger(import.meta.url)

// Parses environment variables required for the operation
const parseEnvVariables = () => {
  const envVariables = {
    ARTICLE_FRONT_MATTER: process.env.ARTICLE_FRONT_MATTER,
    ARTICLE_PATH: process.env.ARTICLE_PATH,
    CK_API_KEY: process.env.CK_API_KEY,
    CK_API_BASE_URL: process.env.CK_API_BASE_URL,
    CK_API_BC_ENDPOINT: process.env.CK_API_BC_ENDPOINT,
    CK_EMAIL_ADDRESS: process.env.CK_EMAIL_ADDRESS,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  }

  log.debug({ envVariables }, 'Parsed environment variables.')

  return envVariables
}

// Prepares email content based on the article's front matter and path
const prepareEmailContent = (
  ARTICLE_PATH,
  NEXT_PUBLIC_SITE_URL,
  frontMatter,
) => {
  const date = new Date(frontMatter.date)
  const fDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  const title = frontMatter.title

  const desc = frontMatter.description

  const slug = ARTICLE_PATH.match(/articles\/(.+?)\/page\.md/)[1]
  const url = `${NEXT_PUBLIC_SITE_URL}/articles/${slug}`

  const content = `${fDate}: ${title} - ${desc} Read more... ${url}`

  log.debug(
    { fDate, title, desc, slug, url, content },
    'Prepared email content from:',
  )

  return { title, content }
}

// Posts email to ConvertKit, now directly including payload construction
const postEmailToConvertKit = async (envVars, { title, content }) => {
  const converKitApiUrl = `${envVars.CK_API_BASE_URL}/${envVars.CK_API_BC_ENDPOINT}`
  log.debug({ converKitApiUrl }, 'Posting email to ConvertKit.')

  const payload = JSON.stringify({
    api_key: envVars.CK_API_KEY,
    content,
    description: '[ck-broadcast] GitHub Workflow Job',
    email_address: envVars.CK_EMAIL_ADDRESS,
    public: true,
    published_at: JSON.parse(envVars.ARTICLE_FRONT_MATTER).date,
    subject: title,
  })
  log.debug({ payload }, 'Constructed payload for ConvertKit.')

  const response = await fetch(converKitApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  })
  if (!response.ok) {
    log.error({ response }, 'Failed to send email to ConvertKit.')
    throw new Error('Failed to send email to ConvertKit.')
  }
  return response
}

// Main function orchestrating the email sending process
const main = async () => {
  log.debug('Initiating email sending process to ConvertKit.')
  const envVars = parseEnvVariables()
  const frontMatter = JSON.parse(envVars.ARTICLE_FRONT_MATTER)
  const { title, content } = prepareEmailContent(
    envVars.ARTICLE_PATH,
    envVars.NEXT_PUBLIC_SITE_URL,
    frontMatter,
  )

  saveToGitHubOutput('shareContent', content)

  const response = await postEmailToConvertKit(envVars, { title, content })
  log.debug({ response }, 'Received response from ConvertKit.')
  const responseBody = await parseResponse(response)
  log.debug({ responseBody }, 'Parsed response body from ConvertKit.')

  log.info({ title, content }, 'Email successfully sent to ConvertKit.')
}

await main()
  .then(() => {
    log.info('Email sending process to ConvertKit completed.')
  })
  .catch((error) => {
    log.error(
      { error },
      'An error occurred during the ConvertKit email sending process.',
    )
    process.exit(1)
  })
  .finally(() => {
    log.info('Finished sending email to ConvertKit.')
  })
