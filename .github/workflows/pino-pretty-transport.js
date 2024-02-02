// pino-pretty-transport.js
module.exports = (opts) =>
  require('pino-pretty')({
    ...opts,
    messageFormat: (log, messageKey) => `hello ${log[messageKey]}`,
  })
