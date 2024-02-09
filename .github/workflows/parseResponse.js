import createFileLogger from './logger.js'

const log = createFileLogger(import.meta.url)

// Parses the response, handling JSON and text content types.
const parseResponse = async (response) => {
  log.debug({ response }, 'Initiating response parsing.')
  try {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      log.debug(
        { contentType },
        'Detected content type as JSON. Parsing as JSON.',
      )
      return await parseJsonResponse(response)
    } else {
      log.debug(
        { contentType },
        'Detected content type as text. Parsing as text.',
      )
      return await parseTextResponse(response)
    }
  } catch (error) {
    log.handleError({ error }, 'Failed to parse response.')
  }
}

// Parses JSON response and logs the parsed JSON.
const parseJsonResponse = async (response) => {
  try {
    const jsonResponse = await response.json()
    log.debug({ jsonResponse }, 'Successfully parsed JSON response.')
    return jsonResponse
  } catch (error) {
    log.handleError({ error }, 'Failed to parse JSON response.')
  }
}

// Parses text response and logs the parsed text.
const parseTextResponse = async (response) => {
  try {
    const textResponse = await response.text()
    log.debug({ textResponse }, 'Successfully parsed text response.')
    return textResponse
  } catch (error) {
    log.handleError({ error }, 'Failed to parse text response.')
  }
}

export { parseResponse }
