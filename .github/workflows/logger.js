import os from 'os'
import path from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'

const createBaseLogger = pino({
  name: 'ryan-jafari.com',
  level: process.env.PINO_LOG_LEVEL || 'info',
  base: {
    env: process.env.NODE_ENV,
    hostname: os.hostname(),
    pid: process.pid,
  },
  formatters: {
    level(label, number) {
      return { level: number, levelLabel: label }
    },
  },
  useOnlyCustomLevels: false,

  // browser: {
  //   write: (o: any) => {
  //     console.log(`${JSON.stringify(o)}`);
  //   }
  // }

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
  const baseLogger = createBaseLogger.child({ filename })
  return baseLogger
}

export default createFileLogger
