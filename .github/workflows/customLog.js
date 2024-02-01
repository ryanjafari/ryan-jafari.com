// customLog.js
import chalk from 'chalk'

// TODO: Incorporate levels
function customLog(...args) {
  const app = chalk.gray('[ryan-jafari.com]')
  const job = chalk.white('[ck-broadcast]')
  console.log(app, job, ...args)
}

async function logResponseDetails(response) {
  customLog('Status Code:', response.status)
  customLog('Status Text:', response.statusText)
  customLog('Response URL:', response.url)
  customLog('Redirected:', response.redirected)
  customLog('Response OK:', response.ok)

  // For headers
  for (let [key, value] of response.headers) {
    customLog(`Header: ${key}`, value)
  }

  // For body (assuming JSON response)
  try {
    const body = await response.json()
    customLog('Response Body:', body)
  } catch (error) {
    customLog('Error parsing response body:', error.message)
  }
}

export { customLog, logResponseDetails }
