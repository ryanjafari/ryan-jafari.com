// customLog.js
import chalk from 'chalk'

// TODO: Incorporate levels
function customLog(...args) {
  const app = chalk.gray('[ryan-jafari.com]')
  const job = chalk.white('[ck-broadcast]')
  console.log(app, job, ...args)
}

export default customLog
