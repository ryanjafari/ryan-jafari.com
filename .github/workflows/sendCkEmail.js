// module.exports = ({ github, context }) => {
//   const { ARTICLE_FRONT_MATTER } = process.env
//   const frontMatter = JSON.parse(ARTICLE_FRONT_MATTER)
//   console.log(frontMatter)
// }

const fetch = require('node-fetch')

module.exports = async ({ github, context }) => {
  const {
    CK_API_KEY,
    CK_API_BASE_URL,
    CK_API_BROADCASTS_ENDPOINT,
    ARTICLE_FRONT_MATTER,
  } = process.env
  const frontMatter = JSON.parse(ARTICLE_FRONT_MATTER)

  console.log(frontMatter)

  const emailSubject = `New Blog Post: ${frontMatter.title}`
  const emailBody = `<p>Published on: ${frontMatter.date}</p><p>${frontMatter.description}</p>`
  const ckApiEndpoint = `${CK_API_BASE_URL}${CK_API_BROADCASTS_ENDPOINT}`

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
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    console.log('Email sent successfully!')
  }
}
