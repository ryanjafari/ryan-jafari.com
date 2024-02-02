import logger from './logger.js'

export default async function sendCkEmail({ github, context }) {
  // customLog(chalk.black('Sending email to ConvertKit...'))

  const {
    ARTICLE_FRONT_MATTER,
    ARTICLE_PATH,
    CK_API_KEY,
    CK_API_BASE_URL,
    CK_API_BC_ENDPOINT,
    CK_EMAIL_ADDRESS,
    NEXT_PUBLIC_SITE_URL,
  } = process.env

  logger.debug({ ARTICLE_FRONT_MATTER })
  logger.debug({ ARTICLE_PATH })
  logger.debug({ CK_API_KEY })
  logger.debug({ CK_API_BASE_URL })
  logger.debug({ CK_API_BC_ENDPOINT })
  logger.debug({ CK_EMAIL_ADDRESS })
  logger.debug({ NEXT_PUBLIC_SITE_URL })

  const frontMatter = JSON.parse(ARTICLE_FRONT_MATTER)
  logger.debug({ frontMatter })

  // Prepare the email content
  const slug = ARTICLE_PATH.match(/articles\/(.+?)\/page\.md/)[1]
  const url = `${NEXT_PUBLIC_SITE_URL}/articles/${slug}`
  const content = `<p>${frontMatter.date}</p><p>${frontMatter.description}</p><p><a href="${url}">Read more...</a></p>`
  const subject = frontMatter.title

  // customLog(chalk.blue('broadcast content:'), content)
  // customLog(chalk.blue('broadcast subject:'), subject)

  // Construct the API endpoint URL
  const ckApiEndpoint = `${CK_API_BASE_URL}${CK_API_BC_ENDPOINT}`
  // customLog(chalk.blue('ck api endpoint:'), ckApiEndpoint)

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

  // customLog(chalk.cyanBright('Received response from ConvertKit...'))
  // await logResponseDetails(response) // Log the details of the response

  if (!response.ok) {
    // customLog(chalk.red('HTTP error! status:'), response.status)
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    // customLog(`done`, 'Success! status:', response.status)
  }
}
