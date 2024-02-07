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

// Listen for lines from the standard input
rl.on('line', (line) => {
  const log = JSON.parse(line)
  const logCopy = { ...log }

  // Delete off the bat
  delete logCopy.level
  delete logCopy.cwd
  delete logCopy.dirname

  // Get the color and symbol for the log level
  const { color, symbol } = colorMap[logCopy.levelLabel]

  // Add the "level" indicator, symbol, and label in the right color
  const formattedLevel = color(`█ ${symbol} ${logCopy.levelLabel}`)
  delete logCopy.levelLabel

  // Add the "name" field flanked by parenthesis in gray
  const formattedName = gray(`(${logCopy.name})`)
  delete logCopy.name

  // Add the "env" field to the right of "name" flanked by braces in gray
  const formattedEnv = gray(`{${logCopy.env}}`)
  delete logCopy.env

  // Add the "task" field to the right of "name" flanked by arrows in gray
  const formattedTask = gray(`>${logCopy.task}<`)
  delete logCopy.task

  // Add the "filename" field to the right of "task" flanked by pipes in gray
  const formattedFileName = gray(`|${logCopy.filename}|`)
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
  const formattedMessage = log.msg
  delete logCopy.msg

  // Pretty print the rest of the keys; they are data we want to print
  // Putting on single line with breakLength: inf makes it easier to indent
  const formattedKeysRaw = inspect(logCopy, {
    colors: true,
    compact: false,
    depth: 2,
    breakLength: Infinity,
  })

  // Split the formattedKeysRaw into lines and add indentation
  // Define your desired indentation (e.g., two spaces)
  const indentation = '  '
  const formattedKeys = formattedKeysRaw
    .split('\n')
    .map((line) => indentation + line)
    .join('\n')

  console.log(
    formattedLevel,
    '@',
    formattedTime,
    '➔',
    formattedName,
    'in',
    formattedEnv,
    'for',
    formattedTask,
    'in',
    formattedFileName,
    '-',
    formattedMessage,
    `\n${formattedKeys}`,
  )
})
