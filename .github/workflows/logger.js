import path from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'

// Serializes response body for logging. Extracts and logs HTML content details if present.
const responseBodySerializer = (responseBody) => {
  if (typeof responseBody !== 'string') {
    return responseBody // Return as-is if not a string
  }

  if (responseBody.includes('<html')) {
    const titleMatch = responseBody.match(/<title>(.*?)<\/title>/i)
    const descriptionMatch = responseBody.match(
      /<meta name="description" content="(.*?)"/i,
    )
    const details = {}

    if (titleMatch) details.title = titleMatch[1]
    if (descriptionMatch) details.description = descriptionMatch[1]

    return Object.keys(details).length > 0
      ? { htmlContent: details }
      : responseBody
  }

  return responseBody // Return as-is if not HTML or no details found
}

// Serializes response objects, redacting sensitive headers for logging.
const responseSerializer = (response) => {
  if (
    response &&
    typeof response === 'object' &&
    'status' in response &&
    'url' in response
  ) {
    const headers = Object.fromEntries(response.headers.entries())
    const sensitiveHeaders = ['etag', 'x-request-id']
    sensitiveHeaders.forEach((header) => {
      if (header in headers) headers[header] = '[REDACTED]'
    })

    return {
      bodyUsed: response.bodyUsed,
      headers: headers,
      ok: response.ok,
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      type: response.type,
      url: response.url,
    }
  }
  return response // Return as-is if not a response object
}

// Custom serializer for error objects
const errorSerializer = (errorObj) => {
  if (errorObj && errorObj.error instanceof Error) {
    // Extracting and formatting the error information
    return {
      message: errorObj.error.message,
      stack: errorObj.error.stack,
      type: errorObj.error.constructor.name,
    }
  }
  return errorObj
}

// Creates a base logger instance with predefined settings.
const createBaseLogger = () =>
  pino({
    name: 'r-j.com',
    level: process.env.PINO_LOG_LEVEL || 'info',
    serializers: {
      response: responseSerializer,
      responseBody: responseBodySerializer,
      error: errorSerializer,
    },
    base: { env: process.env.NODE_ENV },
    formatters: {
      level(label, number) {
        return { level: number, levelLabel: label }
      },
    },
  })

// Creates a logger for a specific file, using the file's basename from the import meta URL.
const createFileLogger = (importMetaUrl) => {
  const filename = path.basename(fileURLToPath(importMetaUrl))
  const fileLogger = createBaseLogger().child({ filename })

  return fileLogger
}

export { createFileLogger }
