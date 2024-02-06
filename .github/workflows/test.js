import createFileLogger from './logger.js'

// const fileLogger = logger.child({
//   // file: 'test.js',
//   // msgPrefix: '[test.js]',
//   filename: <fill this in></fill>
//   module: path.basename(new URL(import.meta.url).pathname),
// })

const fileLogger = createFileLogger(import.meta.url)
const log = fileLogger.child({ task: 'ck-broadcast' })

log.trace('Sending email to ConvertKit...')
log.debug({ something: 'cool' }, { so: 's' }, 'Sending email to ConvertKit...')

const something = { cool: 'beans', are: 'cool' }

log.debug({ something })

log.info('Sending email to ConvertKit...')
log.warn('Sending email to ConvertKit...')
log.error('Sending email to ConvertKit...')
log.fatal('Sending email to ConvertKit...')
log.silent('Sending email to ConvertKit...')
