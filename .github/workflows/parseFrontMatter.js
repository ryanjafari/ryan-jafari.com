module.exports = ({ github, context }) => {
  const fs = require('fs')
  const yaml = require('js-yaml')

  const { ARTICLE_PATH } = process.env

  const content = fs.readFileSync(ARTICLE_PATH, 'utf8')
  const parts = content.split('---')
  const frontMatter = yaml.load(parts[1])

  console.log(
    `[CK-Broadcast] ${frontMatter.date}|${frontMatter.title}|${frontMatter.description}`,
  )

  return frontMatter
}
