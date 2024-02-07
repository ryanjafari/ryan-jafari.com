import fs from 'fs'
import createFileLogger from './logger.js'

const log = createFileLogger(import.meta.url)

/**
 * Saves a variable to the GitHub Actions output file.
 * @param {string} name - The name of the variable as it should appear in the output.
 * @param {*} variable - The variable to be saved. Can be any type that can be serialized to JSON.
 */
export function saveToGitHubOutput(name, variable) {
  log.info(`Saving ${name} = ${variable} to GitHub Actions output...`)

  // Serialize the variable to a JSON string
  const variableString = JSON.stringify(variable)
  log.debug({ variableString })

  // Construct the output string
  const outputString = `${name}=${variableString}`
  log.debug({ outputString })

  // Write to the GITHUB_OUTPUT file
  fs.appendFileSync(process.env.GITHUB_OUTPUT, outputString + '\n')
}
