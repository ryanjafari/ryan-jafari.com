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

  // Define your desired indentation (e.g., two spaces)
  const indentation = '  '

  // Process the logCopy object
  delete logCopy.level
  delete logCopy.cwd
  delete logCopy.dirname
  const { color, symbol } = colorMap[logCopy.levelLabel]
  const paddedLevelLabel = logCopy.levelLabel.padEnd(5, ' ')
  const formattedLevel = color(`█ ${symbol} ${paddedLevelLabel}`)
  const formattedName = logCopy.name ? gray(`(${logCopy.name})`) : ''
  const formattedEnv = logCopy.env ? ` in {${gray(logCopy.env)}}` : ''
  const formattedTask = logCopy.task ? ` for >${gray(logCopy.task)}<` : ''
  const formattedFileName = gray(` in |${logCopy.filename}|`)
  const formattedTime = gray(`[${hours}:${minutes}:${seconds}.${milliseconds}]`)
  const formattedMessage = log.msg ? `- ${log.msg}` : ''
  delete logCopy.levelLabel
  delete logCopy.name
  delete logCopy.env
  delete logCopy.task
  delete logCopy.filename
  delete logCopy.time
  delete logCopy.msg

  // Check if logCopy is empty for pretty printing
  let formattedKeys = ''
  if (Object.keys(logCopy).length > 0) {
    const formattedKeysRaw = inspect(logCopy, {
      colors: true,
      compact: false,
      depth: 2,
      breakLength: Infinity,
    })
    formattedKeys = formattedKeysRaw
      .split('\n')
      .map((line) => indentation + line)
      .join('\n')
  }

  // Build and print the final log message
  console.log(
    [
      formattedLevel,
      '@',
      formattedTime,
      '➔',
      formattedName,
      formattedEnv,
      formattedTask,
      formattedFileName,
      formattedMessage,
      formattedKeys ? `\n${formattedKeys}` : '',
    ]
      .filter(Boolean)
      .join(' '),
  )
})
