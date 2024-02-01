// customLog.js
import chalk from 'chalk'

// TODO: Incorporate levels
function customLog(...args) {
  const app = chalk.gray('[ryan-jafari.com]')
  const job = chalk.white('[ck-broadcast]')
  console.log(app, job, ...args)
}

async function logResponseDetails(response) {
  customLog('Status Code:', response.status)
  customLog('Status Text:', response.statusText)
  customLog('Response URL:', response.url)
  customLog('Redirected:', response.redirected)
  customLog('Response OK:', response.ok)

  // Check if response is JSON
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      const body = await response.json()
      customLog('Response Body:', body)
    } catch (error) {
      customLog('Error parsing response body:', error.message)
    }
  } else {
    // Handle non-JSON responses
    const textResponse = await response.text()
    const titleMatch = textResponse.match(/<title>(.*?)<\/title>/i)
    const descriptionMatch = textResponse.match(
      /<meta name="description" content="(.*?)"/i,
    )

    if (titleMatch) {
      customLog('HTML Title:', titleMatch[1])
    }
    if (descriptionMatch) {
      customLog('HTML Description:', descriptionMatch[1])
    }
  }
}

// Usage remains the same

export { customLog, logResponseDetails }
