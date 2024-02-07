async function logResponseDetails(log, response) {
  log.info('Logging response details...')

  log.debug(response.status)
  log.debug(response.statusText)
  log.debug(response.url)
  log.debug(response.redirected)
  log.debug(response.ok)

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
