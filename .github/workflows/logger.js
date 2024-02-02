import pino from 'pino'

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'debug',
  transport: {
    target: './pino-pretty-transport',
    options: {
      colorize: true,
    },
  },
})

export default logger
