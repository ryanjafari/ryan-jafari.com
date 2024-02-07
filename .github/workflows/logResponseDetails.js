import createFileLogger from './logger.js'

const log = createFileLogger(import.meta.url).child({
  task: 'logging-response-details',
})
async function logResponseDetails(response) {
  log.info('Logging response details...')

  // customLog('Status Code:', response.status)
  // customLog('Status Text:', response.statusText)
  // customLog('Response URL:', response.url)
  // customLog('Redirected:', response.redirected)
  // customLog('Response OK:', response.ok)
  log.debug(response.status)
  log.debug(response.statusText)
  log.debug(response)

  // Check if response is JSON
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      log.info('Parsing response body as JSON...', response.url)

      const body = await response.json()
      log.debug(body)
    } catch (error) {
      log.error('Error parsing response body:', error.message)

      log.debug(error)
      throw error
    }
  } else {
    // Handle non-JSON responses
    log.info('Parsing response body as text...')

    const textResponse = await response.text()
    const titleMatch = textResponse.match(/<title>(.*?)<\/title>/i)
    const descriptionMatch = textResponse.match(
      /<meta name="description" content="(.*?)"/i,
    )

    if (titleMatch) {
      log.debug('HTML Title:', titleMatch[1])
    }
    if (descriptionMatch) {
      log.debug('HTML Description:', descriptionMatch[1])
    }
  }
}

// Usage remains the same
export { logResponseDetails }
