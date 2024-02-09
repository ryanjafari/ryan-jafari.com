import path from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'

const responseBodySerializer = (body) => {
  // Detect if the body is likely HTML
  if (typeof body === 'string' && body.includes('<html')) {
    // Extract HTML details
    const titleMatch = body.match(/<title>(.*?)<\/title>/i)
    const descriptionMatch = body.match(
      /<meta name="description" content="(.*?)"/i,
    )

    // Build the details object
    const details = {}
    if (titleMatch) details.title = titleMatch[1]
    if (descriptionMatch) details.description = descriptionMatch[1]

    return details // Return extracted details
  }
  // If not HTML or unable to extract, return original body or some indication
  return body.startsWith('{') ? 'JSON Content' : 'Non-HTML Content'
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
