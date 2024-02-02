import pino from 'pino'

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  messageFormat: 'chafeel {levelLabel} - {pid} - url:{req.url}',
})

export default logger
