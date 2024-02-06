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

  // deleteFirstKey(logCopy, 'name')
  // Delete the "task" field from the output

  // Get the color and symbol for the log level
  const { color, symbol } = colorMap[logCopy.levelLabel]
  delete logCopy.levelLabel

  // Add the "level" indicator and symbol in the right color
  const formattedLevel = color(`█ ${symbol}`)

  //console.log(logCopy)
  // Add the "name" field flanked by brackets in gray
  const formattedName = gray(`[${logCopy.name}]`)
  delete logCopy.name

  // Add the "task" field to the right of "name" flanked by arrows in gray
  const formattedTask = gray(`>${logCopy.task}<`)
  delete logCopy.task

  // Add the "filename" field to the right of "task" flanked by brackets in gray
  const formattedFileName = gray(`|${logCopy.filename}|`)
  delete logCopy.filename

  // Convert the date and time to a localized string
  const formattedDateTime = new Date(logCopy.time).toLocaleString('en-US', {
    timeZone: 'America/New_York',
  })
  delete logCopy.time

  // Split the formattedDateTime into date and time parts
  const [datePart, timePart] = formattedDateTime.split(', ')

  // Add "on" before the date and "at" before the time
  const formattedDate = datePart
  const formattedTime = timePart

  // Add the message from "msg" field after a colon
  const formattedMessage = log.msg || 'no message provided'
  delete logCopy.msg

  // Pretty print the rest of the keys; they are data we want to print
  const formattedKeys = inspect(logCopy, {
    colors: true,
    compact: false,
    depth: 2,
  })

  // Syntax highlight the JSON string using colorette
  // const formattedKeysHighlighted = formattedKeys
  //   .replace(/"([^"]+)":/g, (match, capture) => `"${blue(capture)}":`)
  //   .replace(/: (\d+\.?\d*)/g, (match, ca  pture) => `: ${green(capture)}`)
  //   .replace(
  //     /: (true|false|null)/g,
  //     (match, capture) => `: ${magenta(capture)}`,
  //   )
  //   .replace(/(\{|\}|\[|\])/g, (match) => gray(match))

  console.log(
    formattedLevel,
    '➔',
    formattedName,
    'for',
    formattedTask,
    'in',
    formattedFileName,
    'on',
    formattedDate,
    '@',
    formattedTime,
    ':',
    formattedMessage,
    `\n${formattedKeys}`,
    //yellow(util.inspect(logCopy, { colors: true })),
  )

  // console.log(util.inspect(form, {colors:true}));
})
