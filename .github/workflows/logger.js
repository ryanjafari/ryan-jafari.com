import path from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'

// Custom serializer for errors
const errorSerializer = (error) => {
  if (error instanceof Error) {
    return {
      type: error.constructor.name,
      message: error.message,
      stack: error.stack,
    }
  }
  return error
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

// Creates a base logger instance with predefined settings.
const createBaseLogger = () =>
  pino({
    name: 'r-j.com',
    level: process.env.PINO_LOG_LEVEL || 'info',
    serializers: {
      error: errorSerializer,
      response: responseSerializer,
      responseBody: responseBodySerializer,
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
