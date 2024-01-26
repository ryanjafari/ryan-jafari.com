module.exports = ({ github, context }) => {
  const fs = require('fs')
  const yaml = require('js-yaml')

  const { ARTICLE_PATH } = process.env
  const content = fs.readFileSync(filePath, 'utf8')
  const frontMatter = yaml.load(content.split('---')[1])

  console.log(
    `${frontMatter.date}|${frontMatter.title}|${frontMatter.description}`,
  )
}
