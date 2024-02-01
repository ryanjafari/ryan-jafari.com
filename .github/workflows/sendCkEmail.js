// Assuming fetch is available globally or replace with an appropriate import
import chalk from 'chalk'
import { customLog, logResponseDetails } from './customLog.js'

export default async function sendCkEmail({ github, context }) {
  customLog(chalk.yellow('Sending email to ConvertKit...'))

  const {
    CK_API_KEY,
    CK_API_BASE_URL,
    CK_API_BROADCASTS_ENDPOINT,
    ARTICLE_FRONT_MATTER,
  } = process.env
  customLog(chalk.blue('ck api key env:'), CK_API_KEY)
  customLog(chalk.blue('ck api base url env:'), CK_API_BASE_URL)
  customLog(
    chalk.blue('ck api broadcasts endpoint env:'),
    CK_API_BROADCASTS_ENDPOINT,
  )
  customLog(chalk.blue('article front matter env:'), ARTICLE_FRONT_MATTER)

  const frontMatter = JSON.parse(ARTICLE_FRONT_MATTER)
  customLog(chalk.blue('article front matter:'), frontMatter)

  // Prepare the email content
  const emailSubject = frontMatter.title
  const emailBody = `<p>Published on: ${frontMatter.date}</p><p>${frontMatter.description}</p>`
  customLog(chalk.blue('email subject:'), emailSubject)
  customLog(chalk.blue('email body:'), emailBody)

  // Construct the API endpoint URL
  const ckApiEndpoint = `${CK_API_BASE_URL}${CK_API_BROADCASTS_ENDPOINT}`
  customLog(chalk.blue('ck api endpoint:'), ckApiEndpoint)

  customLog(chalk.yellow('Sending request to ConvertKit...'))
  const response = await fetch(ckApiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: CK_API_KEY, // docs say api_secret but it doesn't work
      content: emailBody,
      description: '[ck-broadcast] GitHub Workflow Job', // internal description
      email_address: null, // use the default email address
      email_layout_template: null, // use the default email layout template
      public: true, // add to ck creator profile newsletter feed
      subject: emailSubject,
      body: emailBody,
    }),
  })

  customLog(chalk.cyanBright('Received response from ConvertKit...'))
  await logResponseDetails(response) // Log the details of the response

  if (!response.ok) {
    customLog(chalk.red('HTTP error! status:'), response.status)
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    customLog(chalk.green('Success! status:'), response.status)
  }
}
