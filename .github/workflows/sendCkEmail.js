import { logResponseDetails } from './logResponseDetails.js'
import createFileLogger from './logger.js'
import { saveToGitHubOutput } from './saveToGitHubOutput.js'

const log = createFileLogger(import.meta.url)

log.info('Sending email to ConvertKit...')

const {
  ARTICLE_FRONT_MATTER,
  ARTICLE_PATH,
  CK_API_KEY,
  CK_API_BASE_URL,
  CK_API_BC_ENDPOINT,
  CK_EMAIL_ADDRESS,
  NEXT_PUBLIC_SITE_URL,
} = process.env

log.debug({ ARTICLE_FRONT_MATTER })
log.debug({ ARTICLE_PATH })
log.debug({ CK_API_KEY })
log.debug({ CK_API_BASE_URL })
log.debug({ CK_API_BC_ENDPOINT })
log.debug({ CK_EMAIL_ADDRESS })
log.debug({ NEXT_PUBLIC_SITE_URL })

const frontMatter = JSON.parse(ARTICLE_FRONT_MATTER)
log.debug({ frontMatter })

// Prepare the email content
const slug = ARTICLE_PATH.match(/articles\/(.+?)\/page\.md/)[1]
const url = `${NEXT_PUBLIC_SITE_URL}/articles/${slug}`
const content = `<p>${frontMatter.date}</p><p>${frontMatter.description}</p><p><a href="${url}">Read more...</a></p>`
const subject = frontMatter.title

saveToGitHubOutput('articleUrl', url)

log.debug({ slug })
log.debug({ url })
log.debug({ content })
log.debug({ subject })

// Construct the API endpoint URL
const ckApiEndpoint = `${CK_API_BASE_URL}${CK_API_BC_ENDPOINT}`
log.debug(ckApiEndpoint)

// customLog(chalk.magenta('Sending request to ConvertKit...'))
const response = await fetch(ckApiEndpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: CK_API_KEY, // docs say api_secret but it doesn't work
    content: content, // email content
    description: '[ck-broadcast] GitHub Workflow Job', // internal description
    email_address: CK_EMAIL_ADDRESS, // use the default email address
    email_layout_template: null, // use the default email layout template
    public: true, // add to ck creator profile newsletter feed
    published_at: frontMatter.date, // article published date
    send_at: null, // create a draft broadcast
    subject: subject, // email subject
    thumbnail_alt: null, // public thumbnail image alt
    thumbnail_url: null, // public thumbnail image url
  }),
})

// Make sure to use try-catch to handle the potential thrown error
try {
  // Your fetch request and other operations...

  log.info('Received response from ConvertKit...')

  // TODO: Incorporate this into `log` object, use debug
  // Await the logResponseDetails to ensure it completes before moving on
  await logResponseDetails(response) // This will wait until logResponseDetails is done

  if (!response.ok) {
    log.error(response.status, 'HTTP error! status:')
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    log.info(response.status, 'Success! status:')
  }
} catch (error) {
  // Handle errors, such as logging or further actions
  log.error('An error occurred:', error.message)
  throw error
}
