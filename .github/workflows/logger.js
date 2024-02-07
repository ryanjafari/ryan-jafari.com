import path from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'

const createBaseLogger = pino({
  name: 'r-j.com',
  level: process.env.PINO_LOG_LEVEL || 'info',
  base: {
    // cwd: process.cwd(),
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
  // const dirname = path.dirname(fileURLToPath(importMetaUrl))
  const filename = path.basename(fileURLToPath(importMetaUrl))
  const baseLogger = createBaseLogger.child({ filename })
  return baseLogger
}

export default createFileLogger
