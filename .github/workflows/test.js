import createFileLogger from './logger.js'

// const fileLogger = logger.child({
//   // file: 'test.js',
//   // msgPrefix: '[test.js]',
//   filename: <fill this in></fill>
//   module: path.basename(new URL(import.meta.url).pathname),
// })

const fileLogger = createFileLogger(import.meta.url)
const log = fileLogger.child({ task: '[ck-broadcast]' })

log.info('Sending email to ConvertKit...')
