import createFileLogger from './logger.js'

const log = createFileLogger(import.meta.url)

async function logResponseDetails(response) {
  log.info('Logging response details...')

  log.debug(response.status)
  log.debug(response.statusText)

  throw new Error('Test error')

  log.debug(response.url)
  log.debug(response.redirected)
  log.debug(response.ok)

  // Check if response is JSON
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      log.info('Parsing response body as JSON...')

      const jsonResponse = await response.json()
      log.debug(jsonResponse)
    } catch (error) {
      log.error(error.message, 'Error parsing response body:')

      log.debug(error)
      throw error
    }
  }
  // Handle non-JSON responses
  else {
    log.info('Parsing response body as text...')

    const textResponse = await response.text()
    log.debug(textResponse)

    const titleMatch = textResponse.match(/<title>(.*?)<\/title>/i)
    const descriptionMatch = textResponse.match(
      /<meta name="description" content="(.*?)"/i,
    )

    if (titleMatch) {
      log.debug(titleMatch[1], 'HTML Title:')
    }
    if (descriptionMatch) {
      log.debug(descriptionMatch[1], 'HTML Description:')
    }
  }
}

// Usage remains the same
export { logResponseDetails }
