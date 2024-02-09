import path from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'

const responseBodySerializer = (responseBody) => {
  // Directly pass through if responseBody is already an object (assuming JSON)
  if (typeof responseBody !== 'string') {
    return responseBody
  }

  // Proceed to check for HTML content if responseBody is a string
  if (responseBody.includes('<html')) {
    // Attempt to extract HTML title and description
    const titleMatch = responseBody.match(/<title>(.*?)<\/title>/i)
    const descriptionMatch = responseBody.match(
      /<meta name="description" content="(.*?)"/i,
    )
    const details = {}

    if (titleMatch) {
      details.title = titleMatch[1]
    }
    if (descriptionMatch) {
      details.description = descriptionMatch[1]
    }

    // Return extracted HTML details if any were found
    if (Object.keys(details).length > 0) {
      return { htmlContent: details }
    }
  }

  // If it's a string but not HTML, or HTML without title/description, return as is
  return responseBody
}

// Define a custom serializer for the "response" key
const responseSerializer = (response) => {
  // Check if the input looks like a Fetch API Response object
  if (
    response &&
    typeof response === 'object' &&
    'status' in response &&
    'url' in response &&
    'headers' in response // For defensive programming
  ) {
    // Convert headers to an object and redact sensitive headers
    const headers = Object.fromEntries(response.headers.entries())
    const sensitiveHeaders = ['etag', 'x-request-id'] // Define sensitive headers here
    const redactedHeaders = { ...headers }

    // Redact sensitive headers
    sensitiveHeaders.forEach((header) => {
      if (redactedHeaders.hasOwnProperty(header)) {
        redactedHeaders[header] = '[REDACTED]'
      }
    })

    return {
      bodyUsed: response.bodyUsed,
      headers: redactedHeaders, // Use the redacted headers object
      ok: response.ok,
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      type: response.type,
      url: response.url,
    }
  }
  // If it's not a response object, return it unchanged
  return response
}

const createBaseLogger = pino({
  name: 'r-j.com',
  level: process.env.PINO_LOG_LEVEL || 'info',
  serializers: {
    response: responseSerializer, // Use the custom serializer for "response"
    responseBody: responseBodySerializer, // Use the custom serializer for "responseBody"
  },
  base: {
    env: process.env.NODE_ENV,
  },
  formatters: {
    level(label, number) {
      return { level: number, levelLabel: label }
    },
  },
  useOnlyCustomLevels: false,

  // TODO: Configure browser transport
  // browser: {
  //   write: (o: any) => {
  //     console.log(`${JSON.stringify(o)}`);
  //   }
  // }

  // TODO: Configure additional transports
  // transport: {
  //   target: './pino-pretty-transport',
  //   options: {
  //     colorize: true,
  //     colorizeObjects: true,
  //   },
  // },
})

const createFileLogger = (importMetaUrl) => {
  const filename = path.basename(fileURLToPath(importMetaUrl))
  return createBaseLogger.child({ filename })
}

export default createFileLogger
