import createFileLogger from './logger.js'

const log = createFileLogger(import.meta.url)

async function parseResponse(response) {
  try {
    log.debug('Parsing response...')

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      log.debug('Content-Type: application/json')
      return await parseJsonResponse(response)
    } else {
      log.debug('Content-Type: text/*')
      return await parseTextResponse(response)
    }
  } catch (error) {
    handleError(error, 'Error parsing response:')
  }
}

async function parseJsonResponse(response) {
  try {
    log.debug('Parsing response body as JSON...')
    const jsonResponse = await response.json()
    log.debug({ jsonResponse })
    return jsonResponse // Return the parsed JSON response
  } catch (error) {
    handleError(error, 'Error parsing response body as JSON:')
    // No need to return or throw here, as handleError will throw the error.
  }
}

async function parseTextResponse(response) {
  try {
    log.debug('Parsing response body as text...')
    const textResponse = await response.text()
    log.debug({ textResponse })
    // logHtmlDetails(textResponse)
    return textResponse // Return the parsed text response
  } catch (error) {
    handleError(error, 'Error parsing response body as text:')
    // Since handleError rethrows the error, no need for further action here.
  }
}

// function logHtmlDetails(text) {
//   const titleMatch = text.match(/<title>(.*?)<\/title>/i)
//   const descriptionMatch = text.match(
//     /<meta name="description" content="(.*?)"/i,
//   )
//   if (titleMatch) log.debug(titleMatch[1], 'HTML Title:')
//   if (descriptionMatch) log.debug(descriptionMatch[1], 'HTML Description:')
// }

function handleError(error, message) {
  log.error(error, message)
  throw error
}

export { parseResponse }
