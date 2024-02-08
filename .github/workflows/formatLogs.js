import { blue, gray, green, magenta, red, yellow } from 'colorette'
import readline from 'readline'
import { Readable } from 'stream'
import { inspect } from 'util'

// Create an empty readable stream
const emptyStream = new Readable({
  read() {},
})

// Pipe the empty stream to the readline interface
emptyStream.pipe(process.stdout)

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: emptyStream,
})

// Define the color map for the log levels
const colorMap = {
  trace: { color: gray, symbol: '◦' },
  debug: { color: blue, symbol: '●' },
  info: { color: green, symbol: '✔' },
  warn: { color: yellow, symbol: '⚠' },
  error: { color: red, symbol: '✖' },
  fatal: { color: magenta, symbol: '☠' },
  silent: { color: gray, symbol: 'z' },
}

rl.on('line', (line) => {
  const log = JSON.parse(line)
  const logCopy = { ...log }

  // Delete off the bat
  delete logCopy.level
  delete logCopy.cwd
  delete logCopy.dirname

  // Get the color, symbol, and label for the log level
  const { color, symbol } = colorMap[logCopy.levelLabel]

  // Pad the level label to ensure it has a fixed length of 5 characters
  const paddedLevelLabel = logCopy.levelLabel.padEnd(5, ' ')

  // Add the "level" indicator, symbol, and padded label in the right color
  const formattedLevel = color(`█ ${symbol} ${paddedLevelLabel}`)
  delete logCopy.levelLabel

  // Conditionally format the "name" field
  const formattedName = logCopy.name ? gray(`(${logCopy.name})`) : ''
  delete logCopy.name

  // Conditionally format the "env" field if it is not undefined
  const formattedEnv = logCopy.env ? gray(` in {${logCopy.env}}`) : ''
  delete logCopy.env

  // Conditionally format the "task" field if it is not undefined
  const formattedTask = logCopy.task ? gray(` for >${logCopy.task}<`) : ''
  delete logCopy.task

  // Add the "filename" field flanked by pipes in gray
  const formattedFileName = gray(` in |${logCopy.filename}|`)
  delete logCopy.filename

  // Convert Unix timestamp in milliseconds to a Date object
  const date = new Date(logCopy.time)
  delete logCopy.time

  // Adjust for New York time zone (assuming UTC-5 for EST or UTC-4 for EDT)
  // For more accurate timezone handling, consider moment-timezone or luxon
  // New York is generally UTC-5 hours; 300 minutes
  const nyOffset = date.getTimezoneOffset() + 300
  const nyDate = new Date(date.getTime() - nyOffset * 60 * 1000)

  // Extract hours, minutes, seconds, and milliseconds for New York time
  const hours = nyDate.getHours().toString().padStart(2, '0')
  const minutes = nyDate.getMinutes().toString().padStart(2, '0')
  const seconds = nyDate.getSeconds().toString().padStart(2, '0')
  const milliseconds = nyDate.getMilliseconds().toString().padStart(3, '0')

  // Combine into the desired format
  const formattedTime = gray(`[${hours}:${minutes}:${seconds}.${milliseconds}]`)

  // Add the message from "msg" field after a dash
  const formattedMessage = log.msg ? `- ${log.msg}` : ''
  delete logCopy.msg

  // Pretty print the rest of the keys; they are data we want to print
  // Only proceed if logCopy is not empty
  let formattedKeys = ''
  if (Object.keys(logCopy).length > 0) {
    const formattedKeysRaw = inspect(logCopy, {
      colors: true,
      compact: false,
      depth: 2,
      breakLength: Infinity,
    })

    // Split the formattedKeysRaw into lines and add indentation
    const indentation = '  '
    formattedKeys = `\n${formattedKeysRaw
      .split('\n')
      .map((line) => indentation + line)
      .join('\n')}`
  }

  // Build the final log message, conditionally including parts
  const finalLogMessage = [
    formattedLevel,
    '@',
    formattedTime,
    '➔',
    formattedName,
    formattedEnv,
    formattedTask,
    formattedFileName,
    formattedMessage,
    formattedKeys,
  ].join('')

  console.log(finalLogMessage)
})
