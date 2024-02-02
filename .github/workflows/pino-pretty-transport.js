import pinoPretty from 'pino-pretty'

export default (opts) =>
  pinoPretty({
    ...opts,
    messageFormat: (log, messageKey) => `hello ${log[messageKey]}`,
  })
