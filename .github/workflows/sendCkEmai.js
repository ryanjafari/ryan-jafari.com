module.exports = ({ github, context }) => {
  const { ARTICLE_FRONT_MATTER } = process.env
  const frontMatter = JSON.parse(ARTICLE_FRONT_MATTER)
  console.log(frontMatter)
}
