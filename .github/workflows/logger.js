import path from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'

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
