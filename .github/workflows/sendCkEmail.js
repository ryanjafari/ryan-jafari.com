// Assuming fetch is available globally or replace with an appropriate import
import chalk from 'chalk'

export const sendCkEmail = async ({ github, context }) => {
  const {
    CK_API_KEY,
    CK_API_BASE_URL,
    CK_API_BROADCASTS_ENDPOINT,
    ARTICLE_FRONT_MATTER,
  } = process.env

  const frontMatter = JSON.parse(ARTICLE_FRONT_MATTER)

  console.log(chalk.blue('Article front matter:'), frontMatter)

  // Prepare the email content
  const emailSubject = `New Blog Post: ${frontMatter.title}`
  const emailBody = `<p>Published on: ${frontMatter.date}</p><p>${frontMatter.description}</p>`

  // Construct the API endpoint URL
  const ckApiEndpoint = `${CK_API_BASE_URL}${CK_API_BROADCASTS_ENDPOINT}`

  console.log(chalk.yellow('Sending email to ConvertKit...'))

  const response = await fetch(ckApiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: CK_API_KEY,
      subject: emailSubject,
      body: emailBody,
    }),
  })

  if (!response.ok) {
    console.error(chalk.red(`HTTP error! status: ${response.status}`))
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    console.log(chalk.green('Email sent successfully!'))
  }
}
