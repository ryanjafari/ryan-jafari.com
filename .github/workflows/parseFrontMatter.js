const fs = require('fs')
const yaml = require('js-yaml')

const filePath = process.argv[2]

const content = fs.readFileSync(filePath, 'utf8')
const frontMatter = yaml.load(content.split('---')[1])
console.log(
  `${frontMatter.date}|${frontMatter.title}|${frontMatter.description}`,
)
