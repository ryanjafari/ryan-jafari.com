import pinoPretty from 'pino-pretty'

export default (opts) =>
  pinoPretty({
    ...opts,
    //messageFormat: 'chafeel {levelLabel} - {pid} - url:{req.url}',
    //messageFormat: (log, messageKey) => `hello ${log[messageKey]}`,
    messageFormat: (log, messageKey, levelLabel) => {
      // do some log message customization
      return `hello dawg ${log[messageKey]} ${levelLabel}`
    },
  })
