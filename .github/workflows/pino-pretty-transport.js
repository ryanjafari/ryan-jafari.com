import pinoPretty from 'pino-pretty'

export default (opts) =>
  pinoPretty({
    ...opts,
    messageFormat: (log, messageKey) =>
      `wow{levelLabel}  [rj] {levelLabel} - {if pid}{pid} - {end}url:{req.url}`,
  })
