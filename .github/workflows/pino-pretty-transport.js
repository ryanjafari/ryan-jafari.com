import pinoPretty from 'pino-pretty'
import util from 'util'

export default (opts) =>
  pinoPretty({
    ...opts,
    //messageFormat: 'chafeel {levelLabel} - {pid} - url:{req.url}',
    //messageFormat: (log, messageKey) => `hello ${log[messageKey]}`,
    messageFormat: (log, messageKey, levelLabel) => {
      // do some log message customization
      return `hello ${util.inspect(log)} ${util.inspect(opts)} ${util.inspect(
        messageKey,
      )} ${util.inspect(levelLabel)}`
    },
  })
