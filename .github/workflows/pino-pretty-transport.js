import pinoPretty from 'pino-pretty'

export default (opts) =>
  pinoPretty({
    ...opts,
    messageFormat: 'chafeel {logLevel} - {if pid}{pid} - {end}url:{req.url}',
    //messageFormat: (log, messageKey) => `hello ${log[messageKey]}`,
  })
