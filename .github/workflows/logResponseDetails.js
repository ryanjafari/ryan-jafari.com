import createFileLogger from './logger.js'

const log = createFileLogger(import.meta.url)

async function logResponseDetails(response) {
  log.info('Logging response details...')

  logBasicResponseDetails(response)

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    await parseJsonResponse(response)
  } else {
    await parseTextResponse(response)
  }
}

function logBasicResponseDetails(response) {
  log.debug(response.status)
  log.debug(response.statusText)
  log.debug(response.url)
  log.debug(response.redirected)
  log.debug(response.ok)
}

async function parseJsonResponse(response) {
  try {
    log.info('Parsing response body as JSON...')
    const jsonResponse = await response.json()
    log.debug(jsonResponse)
  } catch (error) {
    handleError(error, 'Error parsing response body as JSON:')
  }
}

async function parseTextResponse(response) {
  try {
    log.info('Parsing response body as text...')
    const textResponse = await response.text()
    log.debug(textResponse)
    logHtmlDetails(textResponse)
  } catch (error) {
    handleError(error, 'Error parsing response body as text:')
  }
}

function logHtmlDetails(text) {
  const titleMatch = text.match(/<title>(.*?)<\/title>/i)
  const descriptionMatch = text.match(
    /<meta name="description" content="(.*?)"/i,
  )
  if (titleMatch) log.debug(titleMatch[1], 'HTML Title:')
  if (descriptionMatch) log.debug(descriptionMatch[1], 'HTML Description:')
}

function handleError(error, message) {
  log.error(error.message, message)
  log.debug(error)
  throw error
}

export { logResponseDetails }
